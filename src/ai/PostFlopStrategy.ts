/**
 * PostFlopStrategy — 포스트플롭 AI 의사결정 전략
 *
 * 핸드 강도(hand strength)와 보드 위험도(board danger)를 기반으로
 * 벨류 베팅, 블러프, 폴드 등의 포스트플롭 액션을 결정한다.
 *
 * 의사결정 흐름:
 *  1. 핸드 강도 계산 + 스킬 기반 노이즈 적용 → perceivedStrength
 *  2. 팟 오즈 계산
 *  3. 강도 구간별 분기:
 *     - 강한 핸드 (≥ STRONG_HAND_THRESHOLD): 벨류 베팅/레이즈
 *     - 중간 핸드 (≥ MEDIUM_HAND_THRESHOLD): 팟 오즈·보드 위험도에 따라 콜/체크/폴드
 *     - 약한 핸드 (< MEDIUM_HAND_THRESHOLD): 블러프 또는 체크/폴드
 */
import { Card } from '../core/Card';
import { AIPersonality } from './AIPersonality';
import { calculateHandStrength, boardDanger } from './HandStrengthCalc';

// ─── 전략 임계값 상수 ───────────────────────────────────────────
/** 강한 핸드 판별 기준 (이 이상이면 벨류 베팅) */
const STRONG_HAND_THRESHOLD = 0.7;
/** 중간 핸드 판별 기준 (이 이상이면 상황별 콜/체크) */
const MEDIUM_HAND_THRESHOLD = 0.4;
/** 보드 위험도가 이 이상이면 방어적 플레이 */
const HIGH_DANGER_THRESHOLD = 0.5;
/** 콜 비용이 팟의 이 비율 이상이면 '비싼 콜'로 판단 (위험 보드) */
const EXPENSIVE_CALL_RATIO = 0.3;
/** 콜 비용이 팟의 이 비율 미만이면 '저렴한 콜'로 약한 핸드도 콜 허용 */
const CHEAP_CALL_RATIO = 0.15;
/** 핸드 강도가 팟 오즈 + 이 마진보다 크면 +EV 콜 */
const POT_ODDS_MARGIN = 0.1;
/** 약한 베팅 시 팟 대비 기본 비율 */
const WEAK_BET_RATIO = 0.33;
/** 블러프 베팅 시 팟 대비 기본 크기 */
const BLUFF_BASE_SIZE = 0.5;
/** 중간 핸드에서 콜 비용이 팟의 이 비율 이상이면 폴드 고려 */
const MEDIUM_HAND_EXPENSIVE_CALL_RATIO = 0.5;

export interface PostFlopDecision {
  action: 'fold' | 'check' | 'call' | 'raise' | 'allin';
  /** raise 시 팟 대비 비율 (0.5 = half pot, 1.0 = pot) */
  betSizeRatio: number;
}

/**
 * 포스트플롭 의사결정
 */
export function postFlopDecision(
  holeCards: Card[],
  communityCards: Card[],
  personality: AIPersonality,
  potSize: number,
  toCall: number,
  canCheck: boolean,
): PostFlopDecision {
  const handStrength = calculateHandStrength(holeCards, communityCards);
  const danger = boardDanger(communityCards);

  // skill 기반 노이즈
  const noise = (1 - personality.skill) * (Math.random() * 0.3 - 0.15);
  const perceivedStrength = Math.min(1, Math.max(0, handStrength + noise));

  // 팟 오즈: toCall / (pot + toCall)
  const potOdds = potSize > 0 && toCall > 0 ? toCall / (potSize + toCall) : 0;

  // ─── 매우 강한 핸드 (0.7+) → 벨류 베팅/레이즈 ───
  if (perceivedStrength >= STRONG_HAND_THRESHOLD) {
    if (Math.random() < personality.aggression) {
      // 강한 핸드 + 공격적: 큰 베팅
      const ratio = 0.6 + personality.aggression * 0.4;
      return { action: 'raise', betSizeRatio: ratio };
    }
    return toCall > 0
      ? { action: 'call', betSizeRatio: 0 }
      : { action: 'raise', betSizeRatio: BLUFF_BASE_SIZE };
  }

  // ─── 괜찮은 핸드 (0.4~0.7) ───
  if (perceivedStrength >= MEDIUM_HAND_THRESHOLD) {
    // 보드가 위험하면 방어적으로
    if (danger > HIGH_DANGER_THRESHOLD && toCall > potSize * EXPENSIVE_CALL_RATIO) {
      return canCheck
        ? { action: 'check', betSizeRatio: 0 }
        : { action: 'fold', betSizeRatio: 0 };
    }

    // 팟 오즈가 유리하면 콜
    if (perceivedStrength > potOdds + POT_ODDS_MARGIN) {
      if (toCall > 0) {
        return { action: 'call', betSizeRatio: 0 };
      }
      // 체크 또는 약한 베팅
      if (Math.random() < personality.aggression * 0.5) {
        return { action: 'raise', betSizeRatio: WEAK_BET_RATIO + personality.aggression * 0.2 };
      }
      return { action: 'check', betSizeRatio: 0 };
    }

    // 콜이 비싸면 폴드 고려
    if (toCall > potSize * MEDIUM_HAND_EXPENSIVE_CALL_RATIO) {
      return canCheck
        ? { action: 'check', betSizeRatio: 0 }
        : { action: 'fold', betSizeRatio: 0 };
    }

    return toCall > 0
      ? { action: 'call', betSizeRatio: 0 }
      : { action: 'check', betSizeRatio: 0 };
  }

  // ─── 약한 핸드 (0.4 미만) ───

  // 블러프 시도
  if (Math.random() < personality.bluffFrequency) {
    const bluffSize = BLUFF_BASE_SIZE + Math.random() * BLUFF_BASE_SIZE;
    return { action: 'raise', betSizeRatio: bluffSize };
  }

  // 체크 가능하면 체크
  if (canCheck) {
    return { action: 'check', betSizeRatio: 0 };
  }

  // 콜이 매우 저렴하면 콜
  if (toCall > 0 && toCall < potSize * CHEAP_CALL_RATIO && Math.random() < 0.4) {
    return { action: 'call', betSizeRatio: 0 };
  }

  return { action: 'fold', betSizeRatio: 0 };
}
