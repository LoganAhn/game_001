import { Card } from '../core/Card';
import { Player } from '../core/Player';
import { ActionType, GamePhase } from '../core/GameState';
import { AvailableActions } from '../betting/BettingAction';
import { AI_PROFILES, AIPersonality } from './AIPersonality';
import { preFlopDecision } from './PreFlopStrategy';
import { postFlopDecision } from './PostFlopStrategy';

export interface AIAction {
  action: ActionType;
  amount: number;
}

/**
 * AI 의사결정 디스패처
 * 프리플롭: Chen Formula 기반
 * 포스트플롭: 핸드 강도 + 팟 오즈 기반
 */
export function getAIAction(
  player: Player,
  available: AvailableActions,
  communityCards: Card[],
  phase: GamePhase,
  potSize: number,
  currentBet: number,
  bigBlind: number,
): AIAction {
  const personality = AI_PROFILES[player.id] ?? getDefaultPersonality();
  const holeCards = player.holeCards;

  if (holeCards.length < 2) {
    return { action: 'fold', amount: 0 };
  }

  if (phase === 'preflop') {
    return preFlopAction(holeCards, personality, available, currentBet, bigBlind);
  }

  return postFlopAction(holeCards, communityCards, personality, available, potSize);
}

function preFlopAction(
  holeCards: Card[],
  personality: AIPersonality,
  available: AvailableActions,
  currentBet: number,
  bigBlind: number,
): AIAction {
  const facingRaise = currentBet > bigBlind;
  const decision = preFlopDecision(holeCards[0]!, holeCards[1]!, personality, facingRaise);

  if (!decision.shouldPlay) {
    if (available.canCheck) return { action: 'check', amount: 0 };
    return { action: 'fold', amount: 0 };
  }

  if (decision.shouldRaise && available.canRaise) {
    const raiseTarget = Math.floor(bigBlind * decision.raiseMultiplier);
    const raiseAmount = Math.max(available.minRaise, Math.min(raiseTarget, available.maxRaise));

    // 매우 강한 핸드(4x+ raise) → 올인 고려
    if (decision.raiseMultiplier >= 4 && available.canAllIn && available.allInAmount < available.maxRaise * 0.5) {
      return { action: 'allin', amount: available.allInAmount };
    }

    return { action: 'raise', amount: raiseAmount };
  }

  if (available.canCall) {
    return { action: 'call', amount: available.callAmount };
  }

  if (available.canCheck) {
    return { action: 'check', amount: 0 };
  }

  // 콜할 수 없고 체크도 안 되면 올인 또는 폴드
  if (available.canAllIn && decision.shouldPlay) {
    return { action: 'allin', amount: available.allInAmount };
  }

  return { action: 'fold', amount: 0 };
}

function postFlopAction(
  holeCards: Card[],
  communityCards: Card[],
  personality: AIPersonality,
  available: AvailableActions,
  potSize: number,
): AIAction {
  const toCall = available.canCall ? available.callAmount : 0;
  const canCheck = available.canCheck;

  const decision = postFlopDecision(
    holeCards, communityCards, personality, potSize, toCall, canCheck,
  );

  switch (decision.action) {
    case 'fold':
      if (available.canCheck) return { action: 'check', amount: 0 };
      return { action: 'fold', amount: 0 };

    case 'check':
      if (available.canCheck) return { action: 'check', amount: 0 };
      return { action: 'fold', amount: 0 };

    case 'call':
      if (available.canCall) return { action: 'call', amount: available.callAmount };
      if (available.canCheck) return { action: 'check', amount: 0 };
      if (available.canAllIn) return { action: 'allin', amount: available.allInAmount };
      return { action: 'fold', amount: 0 };

    case 'raise': {
      if (!available.canRaise) {
        if (available.canCall) return { action: 'call', amount: available.callAmount };
        if (available.canCheck) return { action: 'check', amount: 0 };
        return { action: 'fold', amount: 0 };
      }
      const betAmount = Math.floor(potSize * decision.betSizeRatio);
      const raiseAmount = Math.max(available.minRaise, Math.min(betAmount, available.maxRaise));
      return { action: 'raise', amount: raiseAmount };
    }

    case 'allin':
      if (available.canAllIn) return { action: 'allin', amount: available.allInAmount };
      return { action: 'fold', amount: 0 };
  }
}

function getDefaultPersonality(): AIPersonality {
  return { name: 'Default', tightness: 0.5, aggression: 0.5, bluffFrequency: 0.1, skill: 0.5 };
}
