import './style.css';
import { GameEngine, ActionProvider } from './core/GameEngine';
import { getAvailableActions } from './betting/BettingAction';
import { ActionType } from './core/GameState';
import { Player } from './core/Player';
import { Renderer } from './ui/Renderer';

// ─── Renderer ───
const app = document.getElementById('app')!;
const renderer = new Renderer(app);

// ─── Game Engine reference ───
let engine: GameEngine | null = null;

/**
 * Sprint 3: 더미 AI 액션 프로바이더
 * 모든 플레이어를 자동으로 처리 + UI 업데이트
 */
const dummyActionProvider: ActionProvider = async (
  player: Player,
  currentBet: number,
  minimumRaise: number,
) => {
  const available = getAvailableActions(player, currentBet, minimumRaise);
  const rand = Math.random();

  let action: ActionType;
  let amount = 0;

  if (available.canCheck) {
    if (rand < 0.7) {
      action = 'check';
    } else if (rand < 0.9 && available.canRaise) {
      action = 'raise';
      amount = available.minRaise;
    } else {
      action = 'check';
    }
  } else if (available.canCall) {
    if (rand < 0.6) {
      action = 'call';
      amount = available.callAmount;
    } else if (rand < 0.75 && available.canRaise) {
      action = 'raise';
      amount = available.minRaise;
    } else {
      action = 'fold';
    }
  } else {
    if (rand < 0.5 && available.canAllIn) {
      action = 'allin';
      amount = available.allInAmount;
    } else {
      action = 'fold';
    }
  }

  // UI에 액션 표시 + 렌더링
  renderer.setPlayerAction(player.id, action);
  if (engine) {
    renderer.render(engine.getState());
  }

  // AI 사고 딜레이
  await new Promise(r => setTimeout(r, 400));

  return { action, amount };
};

// ─── 게임 루프 ───
async function gameLoop(): Promise<void> {
  if (!engine) return;

  while (!engine.getState().isGameOver) {
    renderer.clearActions();
    renderer.render(engine.getState());

    const handNum = engine.getState().handNumber;
    renderer.setMessage(`핸드 #${handNum + 1} 시작...`);
    await new Promise(r => setTimeout(r, 600));

    await engine.playHands(1);
    renderer.render(engine.getState());

    const state = engine.getState();
    if (state.isGameOver) {
      const winner = state.players.find(p => !p.isEliminated);
      renderer.setMessage(`\ud83c\udfc6 ${winner?.name ?? '???'} 최종 승리!`);
      break;
    }

    renderer.setMessage(`핸드 #${state.handNumber} 완료`);
    await new Promise(r => setTimeout(r, 1500));
  }
}

// ─── 앱 시작 ───
renderer.showStartScreen(async () => {
  engine = new GameEngine(dummyActionProvider);

  renderer.initGameUI(engine.getState().players);
  renderer.render(engine.getState());
  renderer.setMessage('게임을 시작합니다...');

  await new Promise(r => setTimeout(r, 800));
  gameLoop();
});
