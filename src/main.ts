/**
 * main.ts — GameEngine ↔ UI ↔ AI ↔ Animation ↔ Sound 통합 엔트리포인트
 *
 * 아키텍처 흐름:
 *   renderer.showStartScreen() → startNewGame()
 *     → new GameEngine(actionProvider)    // ActionProvider 콜백 주입
 *     → gameLoop()                        // 핸드 반복 루프
 *         → engine.playHands(1)           // 1핸드 실행
 *             → actionProvider(player)    // 각 플레이어 턴마다 호출
 *                 ├─ Human: renderer.requestHumanAction() → Promise<BettingDecision>
 *                 │   └─ BettingControls.show() → 버튼 클릭 시 resolve
 *                 └─ AI: getAIAction(player, available, ...) → {action, amount}
 *                     └─ PreFlopStrategy / PostFlopStrategy (성격 프로필 반영)
 *             → playSoundForAction()      // 액션별 사운드
 *             → renderer.render(state)    // UI 갱신
 *         → showHandPopup() / showGameOverScreen()  // 결과 표시
 *
 * 핵심 패턴: ActionProvider가 GameEngine과 UI/AI를 디커플링.
 * GameEngine은 "누가 결정하는지" 모르고, 콜백의 Promise만 await.
 */

import './style.css';
import { GameEngine, ActionProvider } from './core/GameEngine';
import { getAvailableActions } from './betting/BettingAction';
import { Player } from './core/Player';
import { Renderer } from './ui/Renderer';
import { GAME_CONFIG } from './utils/Constants';
import { getAIAction } from './ai/AIController';
import { animationManager } from './animation/AnimationManager';
import { soundManager } from './sound/SoundManager';
import { playCardDeal, playChipBet, playCheck, playFold, playWin, playAllIn } from './sound/SoundEffects';
import { showHandPopup } from './animation/WinEffects';
import { showGameOverScreen } from './ui/GameOverScreen';

// ─── Renderer ───
const app = document.getElementById('app')!;
const renderer = new Renderer(app);

// ─── Game Engine reference ───
let engine: GameEngine | null = null;

/** 액션에 맞는 사운드 재생 */
function playSoundForAction(action: string): void {
  switch (action) {
    case 'fold': playFold(); break;
    case 'check': playCheck(); break;
    case 'call':
    case 'raise': playChipBet(); break;
    case 'allin': playAllIn(); break;
  }
}

/**
 * 통합 액션 프로바이더:
 * - 인간(Player 0): 베팅 컨트롤 UI를 통해 입력 대기
 * - AI: 성격 프로필 기반 의사결정
 */
const actionProvider: ActionProvider = async (
  player: Player,
  currentBet: number,
  minimumRaise: number,
) => {
  const available = getAvailableActions(player, currentBet, minimumRaise);

  if (!player.isAI) {
    // ─── 인간 플레이어 ───
    renderer.setMessage(`${player.name}의 차례입니다`);
    if (engine) renderer.render(engine.getState());

    const decision = await renderer.requestHumanAction(
      available,
      engine?.getState().mainPot ?? 0
    );

    playSoundForAction(decision.action);
    renderer.setPlayerAction(player.id, decision.action);
    if (engine) renderer.render(engine.getState());
    return decision;
  }

  // ─── AI 플레이어 ───
  renderer.setMessage(`${player.name} 생각 중...`);
  if (engine) {
    engine.getState().currentPlayerIndex = player.id;
    renderer.render(engine.getState());
  }

  // AI 사고 딜레이
  const delay = GAME_CONFIG.AI_THINK_MIN_MS +
    Math.random() * (GAME_CONFIG.AI_THINK_MAX_MS - GAME_CONFIG.AI_THINK_MIN_MS);
  await new Promise(r => setTimeout(r, delay));

  // AI 의사결정 (성격 프로필 기반)
  const state = engine?.getState();
  const aiDecision = getAIAction(
    player,
    available,
    state?.communityCards ?? [],
    state?.phase ?? 'preflop',
    state?.mainPot ?? 0,
    currentBet,
    state?.bigBlind ?? GAME_CONFIG.INITIAL_BIG_BLIND,
  );

  playSoundForAction(aiDecision.action);
  renderer.setPlayerAction(player.id, aiDecision.action);
  if (engine) renderer.render(engine.getState());

  return aiDecision;
};

// ─── 게임 루프 ───
async function gameLoop(): Promise<void> {
  if (!engine) return;

  while (!engine.getState().isGameOver) {
    renderer.clearActions();
    renderer.render(engine.getState());

    const handNum = engine.getState().handNumber;
    renderer.setMessage(`핸드 #${handNum + 1} 시작...`);
    playCardDeal();
    await animationManager.delay(800);

    await engine.playHands(1);
    renderer.render(engine.getState());

    const state = engine.getState();

    // 승리 효과
    if (state.phase === 'hand_complete' || state.phase === 'showdown') {
      const winner = state.players.find(p => !p.folded && !p.isEliminated);
      if (winner) {
        playWin();
        await showHandPopup(
          app,
          `${winner.name} 승리!`,
          winner.name,
          state.mainPot > 0 ? state.mainPot : 0,
        );
      }
    }

    if (state.isGameOver) {
      const winner = state.players.find(p => !p.isEliminated);
      const human = state.players.find(p => !p.isAI);
      playWin();
      showGameOverScreen(app, {
        isWin: winner?.id === human?.id,
        winnerName: winner?.name ?? '???',
        handsPlayed: state.handNumber,
        finalChips: human?.chips ?? 0,
        onRestart: startNewGame,
      });
      break;
    }

    // 인간 탈락 체크
    const human = state.players.find(p => !p.isAI);
    if (human?.isEliminated) {
      showGameOverScreen(app, {
        isWin: false,
        winnerName: state.players.find(p => !p.isEliminated)?.name ?? '???',
        handsPlayed: state.handNumber,
        finalChips: 0,
        onRestart: startNewGame,
      });
      break;
    }

    renderer.setMessage(`핸드 #${state.handNumber} 완료`);
    await animationManager.delay(1500);
  }
}

// ─── 새 게임 시작 ───
async function startNewGame(): Promise<void> {
  soundManager.init();
  await soundManager.resume();

  engine = new GameEngine(actionProvider);

  renderer.initGameUI(engine.getState().players);
  renderer.render(engine.getState());
  renderer.setMessage('게임을 시작합니다...');

  await animationManager.delay(800);
  gameLoop();
}

// ─── 앱 시작 ───
renderer.showStartScreen(() => { startNewGame(); });
