/**
 * AIController — AI 의사결정 디스패처
 *
 * 게임 페이즈에 따라 적절한 전략 모듈로 위임하는 진입점.
 * GameEngine의 ActionProvider 콜백에서 AI 플레이어일 때 호출된다.
 *
 * 디스패치 구조:
 *  - preflop → PreFlopStrategy (Chen Formula 기반 핸드 평가)
 *  - postflop(flop/turn/river) → PostFlopStrategy (핸드 강도 + 팟 오즈)
 *
 * 각 전략 모듈의 결정(shouldPlay/shouldRaise 또는 action/betSizeRatio)을
 * AvailableActions 제약 조건에 맞춰 최종 AIAction(action + amount)으로 변환한다.
 */
import { Card } from '../core/Card';
import { Player } from '../core/Player';
import { ActionType, GamePhase } from '../core/GameState';
import { AvailableActions } from '../betting/BettingAction';
import { AI_PROFILES, AIPersonality } from './AIPersonality';
import { preFlopDecision } from './PreFlopStrategy';
import { postFlopDecision } from './PostFlopStrategy';

// ─── 의사결정 상수 ───────────────────────────────────────────
/** 이 배수 이상의 레이즈를 시도하면 올인을 고려 */
const ALL_IN_RAISE_MULTIPLIER = 4;
/** 올인 금액이 최대 레이즈의 이 비율 미만이면 올인이 더 유리하다고 판단 */
const ALL_IN_CHIP_RATIO = 0.5;

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

/**
 * 프리플롭 액션 결정
 *
 * PreFlopStrategy의 결정(shouldPlay, shouldRaise, raiseMultiplier)을
 * AvailableActions 범위 내의 구체적 액션과 금액으로 변환한다.
 * raiseMultiplier가 ALL_IN_RAISE_MULTIPLIER 이상이고 올인 비용이 적으면 올인한다.
 */
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
    if (decision.raiseMultiplier >= ALL_IN_RAISE_MULTIPLIER && available.canAllIn && available.allInAmount < available.maxRaise * ALL_IN_CHIP_RATIO) {
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

/**
 * 포스트플롭 액션 결정
 *
 * PostFlopStrategy의 결정(action, betSizeRatio)을
 * AvailableActions 제약에 맞춰 실행 가능한 액션으로 매핑한다.
 * 전략이 raise를 권장하지만 raise가 불가능하면 call/check/fold로 폴백한다.
 */
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
