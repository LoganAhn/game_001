import { Card } from '../core/Card';
import { HandEvaluator } from '../core/HandEvaluator';
import { HandCategory } from '../core/HandRank';

/**
 * 핸드 강도를 0~1 범위로 정규화
 * 0 = 최약 (하이카드 최저), 1 = 최강 (로얄 플러시)
 */
export function calculateHandStrength(
  holeCards: Card[],
  communityCards: Card[],
): number {
  if (communityCards.length < 3) return 0;

  const result = HandEvaluator.evaluate(holeCards, communityCards);

  // 카테고리 기반 기본 점수 (0~1)
  const categoryScore = categoryBaseStrength(result.category);

  // 카테고리 내 상대적 위치 (rankValue 활용)
  // rankValue 범위는 category * 10^10 ~ (category+1) * 10^10
  const categoryBase = result.category * 1_00_00_00_00_00;
  const categoryRange = 1_00_00_00_00_00;
  const withinCategory = (result.rankValue - categoryBase) / categoryRange;

  // 기본 점수 + 카테고리 내 위치 가중치
  const strength = categoryScore + withinCategory * 0.1;

  return Math.min(1, Math.max(0, strength));
}

function categoryBaseStrength(category: HandCategory): number {
  switch (category) {
    case HandCategory.HighCard: return 0.05;
    case HandCategory.OnePair: return 0.2;
    case HandCategory.TwoPair: return 0.4;
    case HandCategory.ThreeOfAKind: return 0.55;
    case HandCategory.Straight: return 0.65;
    case HandCategory.Flush: return 0.72;
    case HandCategory.FullHouse: return 0.82;
    case HandCategory.FourOfAKind: return 0.92;
    case HandCategory.StraightFlush: return 0.97;
    case HandCategory.RoyalFlush: return 1.0;
  }
}

/**
 * 보드 텍스처 분석 — 위험도 계산 (0~1)
 * 높을수록 보드가 위험함 (플러시/스트레이트 가능 보드)
 */
export function boardDanger(communityCards: Card[]): number {
  if (communityCards.length < 3) return 0;

  let danger = 0;

  // 플러시 가능성: 같은 수트 3장 이상
  const suitCounts = new Map<number, number>();
  for (const c of communityCards) {
    suitCounts.set(c.suit, (suitCounts.get(c.suit) ?? 0) + 1);
  }
  const maxSuitCount = Math.max(...suitCounts.values());
  if (maxSuitCount >= 4) danger += 0.4;
  else if (maxSuitCount >= 3) danger += 0.2;

  // 스트레이트 가능성: 연속 카드
  const ranks = [...new Set(communityCards.map(c => c.rank))].sort((a, b) => a - b);
  let maxConsecutive = 1;
  let current = 1;
  for (let i = 1; i < ranks.length; i++) {
    if (ranks[i]! - ranks[i - 1]! <= 2) {
      current++;
      maxConsecutive = Math.max(maxConsecutive, current);
    } else {
      current = 1;
    }
  }
  if (maxConsecutive >= 4) danger += 0.3;
  else if (maxConsecutive >= 3) danger += 0.15;

  // 페어 보드 (풀하우스/쿼드 가능)
  const rankCounts = new Map<number, number>();
  for (const c of communityCards) {
    rankCounts.set(c.rank, (rankCounts.get(c.rank) ?? 0) + 1);
  }
  for (const count of rankCounts.values()) {
    if (count >= 2) { danger += 0.1; break; }
  }

  return Math.min(1, danger);
}
