import { Player } from '../core/Player';
import { ActionType } from '../core/GameState';
import { createCardElement, createCardBackElement } from './CardView';

/**
 * 6인 좌석 위치 (타원형 테이블 기준, % 단위)
 * Player 0 (인간): 하단 중앙
 * Player 1~5: 시계 방향
 */
interface SeatPosition {
  top: string;
  left: string;
  cardsOffset: 'above' | 'below';
  betOffset: { top: string; left: string };
  dealerOffset: { top: string; left: string };
}

const SEAT_POSITIONS: SeatPosition[] = [
  // Seat 0 — 하단 중앙 (Human)
  { top: '88%', left: '50%', cardsOffset: 'below', betOffset: { top: '-40px', left: '0' }, dealerOffset: { top: '-12px', left: '60px' } },
  // Seat 1 — 하단 오른쪽
  { top: '72%', left: '85%', cardsOffset: 'above', betOffset: { top: '-40px', left: '-20px' }, dealerOffset: { top: '-12px', left: '55px' } },
  // Seat 2 — 상단 오른쪽
  { top: '18%', left: '82%', cardsOffset: 'below', betOffset: { top: '85px', left: '-20px' }, dealerOffset: { top: '75px', left: '55px' } },
  // Seat 3 — 상단 중앙
  { top: '5%', left: '50%', cardsOffset: 'below', betOffset: { top: '85px', left: '0' }, dealerOffset: { top: '75px', left: '60px' } },
  // Seat 4 — 상단 왼쪽
  { top: '18%', left: '18%', cardsOffset: 'below', betOffset: { top: '85px', left: '20px' }, dealerOffset: { top: '75px', left: '-25px' } },
  // Seat 5 — 하단 왼쪽
  { top: '72%', left: '15%', cardsOffset: 'above', betOffset: { top: '-40px', left: '20px' }, dealerOffset: { top: '-12px', left: '-25px' } },
];

export interface PlayerSeatElements {
  container: HTMLElement;
  nameEl: HTMLElement;
  chipsEl: HTMLElement;
  cardsContainer: HTMLElement;
  infoEl: HTMLElement;
  betEl: HTMLElement;
  dealerBtn: HTMLElement;
  blindMarker: HTMLElement;
  actionBadge: HTMLElement;
}

export function createPlayerSeat(player: Player, seatIndex: number): PlayerSeatElements {
  const pos = SEAT_POSITIONS[seatIndex]!;
  const container = document.createElement('div');
  container.className = `player-seat${player.isAI ? '' : ' player-seat--human'}`;
  container.style.top = pos.top;
  container.style.left = pos.left;
  container.style.transform = 'translate(-50%, -50%)';
  container.dataset['playerId'] = String(player.id);

  // Cards container
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'player-cards';

  // Player info box
  const infoEl = document.createElement('div');
  infoEl.className = 'player-info';

  const nameEl = document.createElement('div');
  nameEl.className = 'player-name';
  nameEl.textContent = player.name;

  const chipsEl = document.createElement('div');
  chipsEl.className = 'player-chips';
  chipsEl.textContent = formatChips(player.chips);

  const actionBadge = document.createElement('div');
  actionBadge.className = 'player-action-badge';
  actionBadge.style.display = 'none';

  infoEl.append(nameEl, chipsEl, actionBadge);

  // Bet display
  const betEl = document.createElement('div');
  betEl.className = 'player-bet';
  betEl.style.display = 'none';
  betEl.style.top = pos.betOffset.top;
  betEl.style.left = `calc(50% + ${pos.betOffset.left})`;
  betEl.style.transform = 'translateX(-50%)';

  // Dealer button
  const dealerBtn = document.createElement('div');
  dealerBtn.className = 'dealer-button';
  dealerBtn.textContent = 'D';
  dealerBtn.style.display = 'none';
  dealerBtn.style.top = pos.dealerOffset.top;
  dealerBtn.style.left = pos.dealerOffset.left;

  // Blind marker
  const blindMarker = document.createElement('div');
  blindMarker.className = 'blind-marker';
  blindMarker.style.display = 'none';

  // Ordering: cards above or below info
  if (pos.cardsOffset === 'above') {
    container.append(cardsContainer, infoEl);
  } else {
    container.append(infoEl, cardsContainer);
  }
  container.append(betEl, dealerBtn, blindMarker);

  return { container, nameEl, chipsEl, cardsContainer, infoEl, betEl, dealerBtn, blindMarker, actionBadge };
}

export function updatePlayerSeat(
  elements: PlayerSeatElements,
  player: Player,
  options: {
    isDealer: boolean;
    blindType: 'sb' | 'bb' | null;
    isCurrentTurn: boolean;
    showCards: boolean;
    lastAction: ActionType | null;
  }
): void {
  const { container, chipsEl, cardsContainer, betEl, dealerBtn, blindMarker, actionBadge } = elements;

  // Update state classes
  container.classList.toggle('player-seat--folded', player.folded);
  container.classList.toggle('player-seat--eliminated', player.isEliminated);
  container.classList.toggle('player-seat--active', options.isCurrentTurn);

  // Chips
  chipsEl.textContent = formatChips(player.chips);

  // Cards
  cardsContainer.replaceChildren();
  if (player.holeCards.length === 2 && !player.isEliminated) {
    if (options.showCards) {
      for (const card of player.holeCards) {
        const cardEl = createCardElement(card);
        cardsContainer.appendChild(cardEl);
      }
    } else {
      cardsContainer.appendChild(createCardBackElement());
      cardsContainer.appendChild(createCardBackElement());
    }
  }

  // Bet
  if (player.currentBet > 0) {
    betEl.textContent = formatChips(player.currentBet);
    betEl.style.display = 'block';
  } else {
    betEl.style.display = 'none';
  }

  // Dealer button
  dealerBtn.style.display = options.isDealer ? 'flex' : 'none';

  // Blind marker
  if (options.blindType) {
    blindMarker.textContent = options.blindType.toUpperCase();
    blindMarker.className = `blind-marker blind-marker--${options.blindType}`;
    blindMarker.style.display = 'block';
  } else {
    blindMarker.style.display = 'none';
  }

  // Action badge
  if (options.lastAction && !player.isEliminated) {
    actionBadge.textContent = getActionLabel(options.lastAction);
    actionBadge.className = `player-action-badge player-action-badge--${options.lastAction}`;
    actionBadge.style.display = 'block';
  } else {
    actionBadge.style.display = 'none';
  }
}

function getActionLabel(action: ActionType): string {
  switch (action) {
    case 'fold': return 'Fold';
    case 'check': return 'Check';
    case 'call': return 'Call';
    case 'raise': return 'Raise';
    case 'allin': return 'All In';
  }
}

function formatChips(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 10_000) return `${(amount / 1_000).toFixed(1)}K`;
  return amount.toLocaleString();
}
