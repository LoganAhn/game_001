import { Card } from './Card';

export interface Player {
  id: number;
  name: string;
  chips: number;
  holeCards: Card[];
  currentBet: number;
  totalBetThisRound: number;
  folded: boolean;
  isAllIn: boolean;
  isAI: boolean;
  isEliminated: boolean;
  seatIndex: number;
}

export function createPlayer(
  id: number,
  name: string,
  chips: number,
  isAI: boolean,
  seatIndex: number
): Player {
  return {
    id,
    name,
    chips,
    holeCards: [],
    currentBet: 0,
    totalBetThisRound: 0,
    folded: false,
    isAllIn: false,
    isAI,
    isEliminated: false,
    seatIndex,
  };
}

export function resetPlayerForNewHand(player: Player): void {
  player.holeCards = [];
  player.currentBet = 0;
  player.totalBetThisRound = 0;
  player.folded = false;
  player.isAllIn = false;
}
