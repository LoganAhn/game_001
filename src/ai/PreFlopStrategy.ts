import { Card, Rank } from '../core/Card';
import { AIPersonality } from './AIPersonality';

/**
 * Chen Formula — 프리플롭 핸드 강도 계산
 * 반환: 점수 (-1 ~ 20+, 높을수록 강함)
 */
export function chenFormula(card1: Card, card2: Card): number {
  const high = card1.rank >= card2.rank ? card1 : card2;
  const low = card1.rank >= card2.rank ? card2 : card1;

  // 1. 높은 카드 기본 점수
  let score = baseScore(high.rank);

  // 2. 페어 보너스
  if (high.rank === low.rank) {
    score = Math.max(score * 2, 5);
    return Math.ceil(score);
  }

  // 3. 수티드 보너스
  if (high.suit === low.suit) {
    score += 2;
  }

  // 4. 갭 패널티
  const gap = high.rank - low.rank - 1;
  if (gap === 1) score -= 1;
  else if (gap === 2) score -= 2;
  else if (gap === 3) score -= 4;
  else if (gap >= 4) score -= 5;

  // 5. 스트레이트 보너스: Q 미만이면서 갭 0~1
  if (high.rank < Rank.Queen && gap <= 1) {
    score += 1;
  }

  return Math.ceil(score);
}

function baseScore(rank: Rank): number {
  switch (rank) {
    case Rank.Ace: return 10;
    case Rank.King: return 8;
    case Rank.Queen: return 7;
    case Rank.Jack: return 6;
    default: return rank / 2;
  }
}

export interface PreFlopDecision {
  shouldPlay: boolean;
  shouldRaise: boolean;
  raiseMultiplier: number; // BB의 배수 (2.5x, 3x, 4x 등)
}

/**
 * 프리플롭 의사결정
 */
export function preFlopDecision(
  card1: Card,
  card2: Card,
  personality: AIPersonality,
  facingRaise: boolean,
): PreFlopDecision {
  const chen = chenFormula(card1, card2);

  // skill에 따른 노이즈 (-3 ~ +3 범위, skill 높을수록 노이즈 작음)
  const noise = (1 - personality.skill) * (Math.random() * 6 - 3);
  const adjustedChen = chen + noise;

  // tightness 기반 임계값: tight일수록 높은 chen 필요
  // tight=0 → threshold=2, tight=1 → threshold=10
  const playThreshold = 2 + personality.tightness * 8;
  const raiseThreshold = playThreshold + 3;

  const shouldPlay = adjustedChen >= playThreshold;

  // 페이싱 레이즈 시 더 높은 기준 필요
  const facingRaiseAdjust = facingRaise ? 2 : 0;

  if (!shouldPlay && adjustedChen < playThreshold - facingRaiseAdjust) {
    // 블러프 가능성
    if (Math.random() < personality.bluffFrequency * 0.5) {
      return { shouldPlay: true, shouldRaise: true, raiseMultiplier: 2.5 };
    }
    return { shouldPlay: false, shouldRaise: false, raiseMultiplier: 0 };
  }

  const shouldRaise = adjustedChen >= raiseThreshold - facingRaiseAdjust
    || Math.random() < personality.aggression * 0.4;

  // 레이즈 사이즈: chen 점수에 비례
  let raiseMultiplier = 2.5;
  if (adjustedChen >= 12) raiseMultiplier = 4;
  else if (adjustedChen >= 9) raiseMultiplier = 3;

  return { shouldPlay, shouldRaise, raiseMultiplier };
}
