import { SidePot } from '../core/GameState';

/**
 * 팟 표시 렌더링
 */
export function renderPotDisplay(container: HTMLElement, mainPot: number, sidePots: SidePot[]): void {
  // 기존 pot display가 있으면 업데이트만
  let potDisplay = container.querySelector('.pot-display') as HTMLElement | null;

  if (!potDisplay) {
    potDisplay = document.createElement('div');
    potDisplay.className = 'pot-display';
    container.appendChild(potDisplay);
  }

  potDisplay.replaceChildren();

  if (mainPot > 0) {
    const label = document.createElement('div');
    label.className = 'pot-label';
    label.textContent = 'POT';

    const amount = document.createElement('div');
    amount.className = 'pot-amount';
    amount.textContent = mainPot.toLocaleString();

    potDisplay.append(label, amount);

    // Side pots
    if (sidePots.length > 1) {
      const sidePotContainer = document.createElement('div');
      sidePotContainer.className = 'side-pots';

      for (let i = 0; i < sidePots.length; i++) {
        const pot = sidePots[i]!;
        const chip = document.createElement('span');
        chip.className = 'side-pot-chip';
        chip.textContent = `Side ${i + 1}: ${pot.amount.toLocaleString()}`;
        sidePotContainer.appendChild(chip);
      }

      potDisplay.appendChild(sidePotContainer);
    }
  }
}
