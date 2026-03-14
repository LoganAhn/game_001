/**
 * 게임 종료 화면 — 승리/패배 결과 + 통계 + 재시작 버튼
 */
export function showGameOverScreen(
  parent: HTMLElement,
  options: {
    isWin: boolean;
    winnerName: string;
    handsPlayed: number;
    finalChips: number;
    onRestart: () => void;
  },
): void {
  const overlay = document.createElement('div');
  overlay.className = 'game-over-overlay animate-fade-in';

  const title = document.createElement('div');
  title.className = 'game-over-title';
  title.textContent = options.isWin ? 'Victory!' : 'Game Over';

  const subtitle = document.createElement('div');
  subtitle.className = 'game-over-subtitle';
  subtitle.textContent = options.isWin
    ? '\ubaa8\ub4e0 \uc0c1\ub300\ub97c \ubb3c\ub9ac\ucce4\uc2b5\ub2c8\ub2e4!'
    : `${options.winnerName}\uc774(\uac00) \uc2b9\ub9ac\ud588\uc2b5\ub2c8\ub2e4`;

  // Stats
  const stats = document.createElement('div');
  stats.className = 'game-over-stats';

  stats.appendChild(createStat(String(options.handsPlayed), '\ud578\ub4dc'));
  stats.appendChild(createStat(options.finalChips.toLocaleString(), '\ucd5c\uc885 \uce69'));

  // Restart button
  const restartBtn = document.createElement('button');
  restartBtn.className = 'start-btn';
  restartBtn.textContent = '\uc0c8 \uac8c\uc784 \uc2dc\uc791';
  restartBtn.addEventListener('click', () => {
    overlay.remove();
    options.onRestart();
  });

  overlay.append(title, subtitle, stats, restartBtn);
  parent.appendChild(overlay);
}

function createStat(value: string, label: string): HTMLElement {
  const stat = document.createElement('div');
  stat.className = 'game-over-stat';

  const valEl = document.createElement('div');
  valEl.className = 'game-over-stat-value';
  valEl.textContent = value;

  const labelEl = document.createElement('div');
  labelEl.className = 'game-over-stat-label';
  labelEl.textContent = label;

  stat.append(valEl, labelEl);
  return stat;
}
