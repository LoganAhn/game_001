import './style.css';
import { GameEngine, ActionProvider } from './core/GameEngine';
import { getAvailableActions } from './betting/BettingAction';
import { ActionType } from './core/GameState';
import { Player } from './core/Player';

/**
 * Sprint 2: 더미 AI — 랜덤 콜/폴드/체크
 * 모든 플레이어(인간 포함)를 자동으로 처리
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
    // 체크 가능하면: 70% 체크, 20% 레이즈, 10% 폴드
    if (rand < 0.7) {
      action = 'check';
    } else if (rand < 0.9 && available.canRaise) {
      action = 'raise';
      amount = available.minRaise;
    } else {
      action = 'check'; // 폴드 대신 체크
    }
  } else if (available.canCall) {
    // 콜해야 하는 상황: 60% 콜, 15% 레이즈, 25% 폴드
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
    // 칩이 콜 금액보다 적으면 올인 또는 폴드
    if (rand < 0.5 && available.canAllIn) {
      action = 'allin';
      amount = available.allInAmount;
    } else {
      action = 'fold';
    }
  }

  // AI 사고 딜레이 시뮬레이션 (짧게)
  await new Promise(r => setTimeout(r, 10));

  return { action, amount };
};

// --- 앱 시작 ---
const app = document.getElementById('app')!;

const heading = document.createElement('h1');
heading.textContent = '♠ Texas Hold\'em Poker';
heading.style.color = 'white';
heading.style.fontFamily = 'monospace';
heading.style.padding = '2rem';

const info = document.createElement('p');
info.textContent = 'Sprint 2 — 콘솔(F12)에서 AI끼리 자동 게임 진행을 확인하세요.';
info.style.color = '#aaa';
info.style.fontFamily = 'monospace';
info.style.paddingLeft = '2rem';

const startBtn = document.createElement('button');
startBtn.textContent = '🎮 게임 시작 (5핸드 자동 진행)';
startBtn.style.cssText = 'margin-left:2rem;padding:0.8rem 1.5rem;font-size:1.1rem;cursor:pointer;background:#2d8a4e;color:white;border:none;border-radius:8px;font-family:monospace;';

let running = false;
startBtn.addEventListener('click', async () => {
  if (running) return;
  running = true;
  startBtn.disabled = true;
  startBtn.textContent = '⏳ 진행 중...';

  const engine = new GameEngine(dummyActionProvider);

  console.log('\n=== Sprint 2: 자동 게임 데모 (5핸드) ===\n');
  await engine.playHands(5);
  console.log('\n=== 데모 완료 ===');
  startBtn.textContent = '✅ 완료 — 콘솔 확인';
  running = false;
});

app.appendChild(heading);
app.appendChild(info);
app.appendChild(startBtn);
