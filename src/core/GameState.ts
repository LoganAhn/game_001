import { Card } from './Card';
import { Player } from './Player';

export type GamePhase = 'waiting' | 'preflop' | 'flop' | 'turn' | 'river' | 'showdown' | 'hand_complete';

export type ActionType = 'fold' | 'check' | 'call' | 'raise' | 'allin';

export interface SidePot {
  amount: number;
  eligiblePlayerIds: number[];
}

export interface GameState {
  players: Player[];
  communityCards: Card[];
  mainPot: number;
  sidePots: SidePot[];
  dealerIndex: number;
  currentPlayerIndex: number;
  phase: GamePhase;
  currentBet: number;
  minimumRaise: number;
  smallBlind: number;
  bigBlind: number;
  handNumber: number;
  isGameOver: boolean;
}

export function getSmallBlindIndex(dealerIndex: number, activePlayers: Player[]): number {
  // 2인일 경우 딜러가 SB
  if (activePlayers.length === 2) return dealerIndex;
  return (dealerIndex + 1) % activePlayers.length;
}

export function getBigBlindIndex(dealerIndex: number, activePlayers: Player[]): number {
  if (activePlayers.length === 2) return (dealerIndex + 1) % activePlayers.length;
  return (dealerIndex + 2) % activePlayers.length;
}
