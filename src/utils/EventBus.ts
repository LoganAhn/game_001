import { Card } from '../core/Card';

export type GamePhase = 'waiting' | 'preflop' | 'flop' | 'turn' | 'river' | 'showdown' | 'hand_complete';

export type ActionType = 'fold' | 'check' | 'call' | 'raise' | 'allin';

export interface PlayerActionData {
  playerId: number;
  action: ActionType;
  amount: number;
}

export type GameEvent =
  | { type: 'HAND_START'; dealerIndex: number; handNumber: number }
  | { type: 'BLINDS_POSTED'; sbPlayerId: number; bbPlayerId: number; sbAmount: number; bbAmount: number }
  | { type: 'HOLE_CARDS_DEALT'; playerId: number; cards: Card[] }
  | { type: 'PHASE_CHANGE'; phase: GamePhase }
  | { type: 'COMMUNITY_CARDS'; cards: Card[]; phase: GamePhase }
  | { type: 'PLAYER_TURN'; playerId: number }
  | { type: 'PLAYER_ACTION'; playerId: number; action: ActionType; amount: number }
  | { type: 'POT_UPDATE'; mainPot: number; sidePots: { amount: number; playerIds: number[] }[] }
  | { type: 'SHOWDOWN_REVEAL'; playerId: number; cards: Card[]; handDescription: string }
  | { type: 'HAND_RESULT'; winners: { playerId: number; amount: number; hand: string }[] }
  | { type: 'PLAYER_ELIMINATED'; playerId: number }
  | { type: 'GAME_OVER'; winnerId: number }
  | { type: 'MESSAGE'; text: string }
  | { type: 'CHIPS_UPDATE'; playerId: number; chips: number };

type EventCallback = (event: GameEvent) => void;

export class EventBus {
  private listeners = new Map<string, Set<EventCallback>>();
  private globalListeners = new Set<EventCallback>();

  on(eventType: string, callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);
    return () => this.listeners.get(eventType)?.delete(callback);
  }

  onAll(callback: EventCallback): () => void {
    this.globalListeners.add(callback);
    return () => this.globalListeners.delete(callback);
  }

  emit(event: GameEvent): void {
    const typeListeners = this.listeners.get(event.type);
    if (typeListeners) {
      for (const cb of typeListeners) cb(event);
    }
    for (const cb of this.globalListeners) cb(event);
  }
}
