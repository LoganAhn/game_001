import { Card } from '../core/Card';
import { AIPersonality } from './AIPersonality';
import { calculateHandStrength, boardDanger } from './HandStrengthCalc';

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
  if (perceivedStrength >= 0.7) {
    if (Math.random() < personality.aggression) {
      // 강한 핸드 + 공격적: 큰 베팅
      const ratio = 0.6 + personality.aggression * 0.4;
      return { action: 'raise', betSizeRatio: ratio };
    }
    return toCall > 0
      ? { action: 'call', betSizeRatio: 0 }
      : { action: 'raise', betSizeRatio: 0.5 };
  }

  // ─── 괜찮은 핸드 (0.4~0.7) ───
  if (perceivedStrength >= 0.4) {
    // 보드가 위험하면 방어적으로
    if (danger > 0.5 && toCall > potSize * 0.3) {
      return canCheck
        ? { action: 'check', betSizeRatio: 0 }
        : { action: 'fold', betSizeRatio: 0 };
    }

    // 팟 오즈가 유리하면 콜
    if (perceivedStrength > potOdds + 0.1) {
      if (toCall > 0) {
        return { action: 'call', betSizeRatio: 0 };
      }
      // 체크 또는 약한 베팅
      if (Math.random() < personality.aggression * 0.5) {
        return { action: 'raise', betSizeRatio: 0.33 + personality.aggression * 0.2 };
      }
      return { action: 'check', betSizeRatio: 0 };
    }

    // 콜이 비싸면 폴드 고려
    if (toCall > potSize * 0.5) {
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
    const bluffSize = 0.5 + Math.random() * 0.5;
    return { action: 'raise', betSizeRatio: bluffSize };
  }

  // 체크 가능하면 체크
  if (canCheck) {
    return { action: 'check', betSizeRatio: 0 };
  }

  // 콜이 매우 저렴하면 콜
  if (toCall > 0 && toCall < potSize * 0.15 && Math.random() < 0.4) {
    return { action: 'call', betSizeRatio: 0 };
  }

  return { action: 'fold', betSizeRatio: 0 };
}
