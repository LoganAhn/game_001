import './style.css';
import { GameEngine, ActionProvider } from './core/GameEngine';
import { getAvailableActions } from './betting/BettingAction';
import { Player } from './core/Player';
import { Renderer } from './ui/Renderer';
import { GAME_CONFIG } from './utils/Constants';
import { getAIAction } from './ai/AIController';

// ─── Renderer ───
const app = document.getElementById('app')!;
const renderer = new Renderer(app);

// ─── Game Engine reference ───
let engine: GameEngine | null = null;

/**
 * 통합 액션 프로바이더:
 * - 인간(Player 0): 베팅 컨트롤 UI를 통해 입력 대기
 * - AI: 더미 AI (랜덤 콜/폴드/체크)
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
    await new Promise(r => setTimeout(r, 800));

    await engine.playHands(1);
    renderer.render(engine.getState());

    const state = engine.getState();
    if (state.isGameOver) {
      const winner = state.players.find(p => !p.isEliminated);
      if (winner && !winner.isAI) {
        renderer.setMessage(`축하합니다! 최종 승리!`);
      } else {
        renderer.setMessage(`${winner?.name ?? '???'} 최종 승리! 다시 도전하세요.`);
      }
      break;
    }

    // 인간 탈락 체크
    const human = state.players.find(p => !p.isAI);
    if (human?.isEliminated) {
      renderer.setMessage('칩을 모두 잃었습니다. 게임 오버!');
      break;
    }

    renderer.setMessage(`핸드 #${state.handNumber} 완료`);
    await new Promise(r => setTimeout(r, 1500));
  }
}

// ─── 앱 시작 ───
renderer.showStartScreen(async () => {
  engine = new GameEngine(actionProvider);

  renderer.initGameUI(engine.getState().players);
  renderer.render(engine.getState());
  renderer.setMessage('게임을 시작합니다...');

  await new Promise(r => setTimeout(r, 800));
  gameLoop();
});
