import { Card, SUIT_SYMBOLS, RANK_LABELS, isRedSuit } from '../core/Card';

/**
 * CSS 전용 카드 렌더링 (이미지 없음)
 */
export function createCardElement(card: Card, faceDown = false): HTMLElement {
  const el = document.createElement('div');
  const colorClass = isRedSuit(card.suit) ? 'card--red' : 'card--black';
  el.className = `card ${colorClass}${faceDown ? ' card--flipped' : ''}`;

  const rankLabel = RANK_LABELS[card.rank];
  const suitSymbol = SUIT_SYMBOLS[card.suit];

  // Front face
  const face = document.createElement('div');
  face.className = 'card-face';

  // Top corner
  const topCorner = createCorner(rankLabel, suitSymbol);

  // Center suit
  const centerSuit = document.createElement('div');
  centerSuit.className = 'card-center-suit';
  centerSuit.textContent = suitSymbol;

  // Bottom corner (rotated)
  const bottomCorner = createCorner(rankLabel, suitSymbol);
  bottomCorner.classList.add('card-bottom');

  face.append(topCorner, centerSuit, bottomCorner);

  // Back
  const back = document.createElement('div');
  back.className = 'card-back';

  el.append(face, back);
  return el;
}

function createCorner(rank: string, suit: string): HTMLElement {
  const corner = document.createElement('div');
  corner.className = 'card-corner';

  const rankSpan = document.createElement('span');
  rankSpan.className = 'card-corner-rank';
  rankSpan.textContent = rank;

  const suitSpan = document.createElement('span');
  suitSpan.className = 'card-corner-suit';
  suitSpan.textContent = suit;

  corner.append(rankSpan, suitSpan);
  return corner;
}

export function createCardBackElement(): HTMLElement {
  const el = document.createElement('div');
  el.className = 'card card--flipped';

  const face = document.createElement('div');
  face.className = 'card-face';

  const back = document.createElement('div');
  back.className = 'card-back';

  el.append(face, back);
  return el;
}

export function createEmptySlot(): HTMLElement {
  const el = document.createElement('div');
  el.className = 'card-slot';
  return el;
}
