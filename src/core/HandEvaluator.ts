import { Card, Rank, RANK_LABELS } from './Card';
import { HandCategory, HandResult } from './HandRank';

export class HandEvaluator {
  /**
   * 7장(홀카드 2장 + 커뮤니티 5장)에서 최적의 5장 핸드를 평가
   */
  static evaluate(holeCards: Card[], communityCards: Card[]): HandResult {
    const allCards = [...holeCards, ...communityCards];
    const combos = this.combinations(allCards, 5);
    let best: HandResult | null = null;
    for (const combo of combos) {
      const result = this.evaluateFive(combo);
      if (!best || result.rankValue > best.rankValue) {
        best = result;
      }
    }
    return best!;
  }

  /**
   * 5장 핸드만 평가 (쇼다운 표시용)
   */
  static evaluateFive(cards: Card[]): HandResult {
    const sorted = [...cards].sort((a, b) => b.rank - a.rank);

    const isFlush = sorted.every(c => c.suit === sorted[0]!.suit);
    const straight = this.getStraightHighCard(sorted);
    const isStraight = straight !== null;

    const rankCounts = this.getRankCounts(sorted);
    const groups = this.getGroups(rankCounts);

    // Royal Flush
    if (isFlush && isStraight && straight === Rank.Ace) {
      return this.makeResult(HandCategory.RoyalFlush, sorted, [14],
        'Royal Flush');
    }

    // Straight Flush
    if (isFlush && isStraight) {
      return this.makeResult(HandCategory.StraightFlush, sorted, [straight!],
        `Straight Flush, ${RANK_LABELS[straight!]} high`);
    }

    // Four of a Kind
    if (groups.quads.length > 0) {
      const quadRank = groups.quads[0]!;
      const kicker = sorted.find(c => c.rank !== quadRank)!.rank;
      return this.makeResult(HandCategory.FourOfAKind, sorted, [quadRank, kicker],
        `Four of a Kind, ${RANK_LABELS[quadRank]}s`);
    }

    // Full House
    if (groups.trips.length > 0 && groups.pairs.length > 0) {
      const tripRank = groups.trips[0]!;
      const pairRank = groups.pairs[0]!;
      return this.makeResult(HandCategory.FullHouse, sorted, [tripRank, pairRank],
        `Full House, ${RANK_LABELS[tripRank]}s full of ${RANK_LABELS[pairRank]}s`);
    }

    // Flush
    if (isFlush) {
      const ranks = sorted.map(c => c.rank);
      return this.makeResult(HandCategory.Flush, sorted, ranks,
        `Flush, ${RANK_LABELS[sorted[0]!.rank]} high`);
    }

    // Straight
    if (isStraight) {
      return this.makeResult(HandCategory.Straight, sorted, [straight!],
        `Straight, ${RANK_LABELS[straight!]} high`);
    }

    // Three of a Kind
    if (groups.trips.length > 0) {
      const tripRank = groups.trips[0]!;
      const kickers = sorted.filter(c => c.rank !== tripRank).map(c => c.rank);
      return this.makeResult(HandCategory.ThreeOfAKind, sorted, [tripRank, ...kickers],
        `Three of a Kind, ${RANK_LABELS[tripRank]}s`);
    }

    // Two Pair
    if (groups.pairs.length >= 2) {
      const highPair = groups.pairs[0]!;
      const lowPair = groups.pairs[1]!;
      const kicker = sorted.find(c => c.rank !== highPair && c.rank !== lowPair)!.rank;
      return this.makeResult(HandCategory.TwoPair, sorted, [highPair, lowPair, kicker],
        `Two Pair, ${RANK_LABELS[highPair]}s and ${RANK_LABELS[lowPair]}s`);
    }

    // One Pair
    if (groups.pairs.length === 1) {
      const pairRank = groups.pairs[0]!;
      const kickers = sorted.filter(c => c.rank !== pairRank).map(c => c.rank);
      return this.makeResult(HandCategory.OnePair, sorted, [pairRank, ...kickers],
        `Pair of ${RANK_LABELS[pairRank]}s`);
    }

    // High Card
    const ranks = sorted.map(c => c.rank);
    return this.makeResult(HandCategory.HighCard, sorted, ranks,
      `${RANK_LABELS[sorted[0]!.rank]} High`);
  }

  static compare(a: HandResult, b: HandResult): number {
    if (a.rankValue > b.rankValue) return 1;
    if (a.rankValue < b.rankValue) return -1;
    return 0;
  }

  // --- Private helpers ---

  private static makeResult(
    category: HandCategory,
    cards: Card[],
    rankComponents: number[],
    description: string
  ): HandResult {
    // 인코딩: category를 최상위에, 이후 각 랭크 컴포넌트를 하위 자릿수에
    let rankValue = category * 1_00_00_00_00_00;
    for (let i = 0; i < rankComponents.length && i < 5; i++) {
      rankValue += (rankComponents[i] ?? 0) * Math.pow(100, 4 - i);
    }
    return { category, rankValue, bestFive: cards, description };
  }

  private static getStraightHighCard(sorted: Card[]): Rank | null {
    const ranks = sorted.map(c => c.rank);

    // 일반 스트레이트 체크
    let isSequential = true;
    for (let i = 1; i < ranks.length; i++) {
      if (ranks[i - 1]! - ranks[i]! !== 1) {
        isSequential = false;
        break;
      }
    }
    if (isSequential) return ranks[0]!;

    // A-2-3-4-5 (Wheel) 체크
    if (
      ranks[0] === Rank.Ace &&
      ranks[1] === Rank.Five &&
      ranks[2] === Rank.Four &&
      ranks[3] === Rank.Three &&
      ranks[4] === Rank.Two
    ) {
      return Rank.Five; // 5-high straight
    }

    return null;
  }

  private static getRankCounts(cards: Card[]): Map<Rank, number> {
    const counts = new Map<Rank, number>();
    for (const card of cards) {
      counts.set(card.rank, (counts.get(card.rank) ?? 0) + 1);
    }
    return counts;
  }

  private static getGroups(rankCounts: Map<Rank, number>) {
    const quads: Rank[] = [];
    const trips: Rank[] = [];
    const pairs: Rank[] = [];

    // 내림차순 정렬을 위해 배열로 변환
    const entries = [...rankCounts.entries()].sort((a, b) => b[0] - a[0]);

    for (const [rank, count] of entries) {
      if (count === 4) quads.push(rank);
      else if (count === 3) trips.push(rank);
      else if (count === 2) pairs.push(rank);
    }

    return { quads, trips, pairs };
  }

  /**
   * n개 중 k개를 선택하는 조합 생성
   */
  static combinations(arr: Card[], k: number): Card[][] {
    const result: Card[][] = [];
    const combo: Card[] = [];

    function backtrack(start: number) {
      if (combo.length === k) {
        result.push([...combo]);
        return;
      }
      for (let i = start; i < arr.length; i++) {
        combo.push(arr[i]!);
        backtrack(i + 1);
        combo.pop();
      }
    }

    backtrack(0);
    return result;
  }
}
