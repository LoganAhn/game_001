import { Card } from '../core/Card';
import { createCardElement, createEmptySlot } from './CardView';

/**
 * 커뮤니티 카드 영역 렌더링
 */
export function renderCommunityCards(container: HTMLElement, cards: Card[]): void {
  const cardsRow = document.createElement('div');
  cardsRow.className = 'community-cards';

  for (let i = 0; i < 5; i++) {
    const card = cards[i];
    if (card) {
      const cardEl = createCardElement(card);
      cardEl.classList.add('animate-deal');
      cardEl.style.animationDelay = `${i * 80}ms`;
      cardsRow.appendChild(cardEl);
    } else {
      cardsRow.appendChild(createEmptySlot());
    }
  }

  container.replaceChildren(cardsRow);
}
