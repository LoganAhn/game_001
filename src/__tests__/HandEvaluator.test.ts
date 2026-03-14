import { describe, it, expect } from 'vitest';
import { HandEvaluator } from '../core/HandEvaluator';
import { HandCategory } from '../core/HandRank';
import { Suit, Rank, Card } from '../core/Card';

function card(rank: Rank, suit: Suit): Card {
  return { rank, suit };
}

const S = Suit.Spades;
const H = Suit.Hearts;
const D = Suit.Diamonds;
const C = Suit.Clubs;

describe('HandEvaluator', () => {
  describe('evaluateFive — 5장 핸드 판별', () => {
    it('Royal Flush', () => {
      const cards = [
        card(Rank.Ace, S), card(Rank.King, S), card(Rank.Queen, S),
        card(Rank.Jack, S), card(Rank.Ten, S),
      ];
      const result = HandEvaluator.evaluateFive(cards);
      expect(result.category).toBe(HandCategory.RoyalFlush);
    });

    it('Straight Flush (9-high)', () => {
      const cards = [
        card(Rank.Nine, H), card(Rank.Eight, H), card(Rank.Seven, H),
        card(Rank.Six, H), card(Rank.Five, H),
      ];
      const result = HandEvaluator.evaluateFive(cards);
      expect(result.category).toBe(HandCategory.StraightFlush);
    });

    it('Straight Flush — Wheel (A-2-3-4-5)', () => {
      const cards = [
        card(Rank.Ace, D), card(Rank.Two, D), card(Rank.Three, D),
        card(Rank.Four, D), card(Rank.Five, D),
      ];
      const result = HandEvaluator.evaluateFive(cards);
      expect(result.category).toBe(HandCategory.StraightFlush);
    });

    it('Four of a Kind', () => {
      const cards = [
        card(Rank.King, S), card(Rank.King, H), card(Rank.King, D),
        card(Rank.King, C), card(Rank.Seven, S),
      ];
      const result = HandEvaluator.evaluateFive(cards);
      expect(result.category).toBe(HandCategory.FourOfAKind);
    });

    it('Full House', () => {
      const cards = [
        card(Rank.Jack, S), card(Rank.Jack, H), card(Rank.Jack, D),
        card(Rank.Four, S), card(Rank.Four, H),
      ];
      const result = HandEvaluator.evaluateFive(cards);
      expect(result.category).toBe(HandCategory.FullHouse);
    });

    it('Flush', () => {
      const cards = [
        card(Rank.Ace, C), card(Rank.Ten, C), card(Rank.Seven, C),
        card(Rank.Four, C), card(Rank.Two, C),
      ];
      const result = HandEvaluator.evaluateFive(cards);
      expect(result.category).toBe(HandCategory.Flush);
    });

    it('Straight', () => {
      const cards = [
        card(Rank.Eight, S), card(Rank.Seven, H), card(Rank.Six, D),
        card(Rank.Five, C), card(Rank.Four, S),
      ];
      const result = HandEvaluator.evaluateFive(cards);
      expect(result.category).toBe(HandCategory.Straight);
    });

    it('Straight — Wheel (5-high)', () => {
      const cards = [
        card(Rank.Ace, S), card(Rank.Two, H), card(Rank.Three, D),
        card(Rank.Four, C), card(Rank.Five, S),
      ];
      const result = HandEvaluator.evaluateFive(cards);
      expect(result.category).toBe(HandCategory.Straight);
    });

    it('Three of a Kind', () => {
      const cards = [
        card(Rank.Nine, S), card(Rank.Nine, H), card(Rank.Nine, D),
        card(Rank.King, S), card(Rank.Two, C),
      ];
      const result = HandEvaluator.evaluateFive(cards);
      expect(result.category).toBe(HandCategory.ThreeOfAKind);
    });

    it('Two Pair', () => {
      const cards = [
        card(Rank.Ace, S), card(Rank.Ace, H), card(Rank.Six, D),
        card(Rank.Six, C), card(Rank.Three, S),
      ];
      const result = HandEvaluator.evaluateFive(cards);
      expect(result.category).toBe(HandCategory.TwoPair);
    });

    it('One Pair', () => {
      const cards = [
        card(Rank.Queen, S), card(Rank.Queen, H), card(Rank.Ten, D),
        card(Rank.Five, C), card(Rank.Two, S),
      ];
      const result = HandEvaluator.evaluateFive(cards);
      expect(result.category).toBe(HandCategory.OnePair);
    });

    it('High Card', () => {
      const cards = [
        card(Rank.Ace, S), card(Rank.Jack, H), card(Rank.Eight, D),
        card(Rank.Five, C), card(Rank.Three, S),
      ];
      const result = HandEvaluator.evaluateFive(cards);
      expect(result.category).toBe(HandCategory.HighCard);
    });
  });

  describe('evaluate — 7장에서 최적 5장 선택', () => {
    it('7장 중 Royal Flush를 찾음', () => {
      const hole = [card(Rank.Ace, S), card(Rank.King, S)];
      const community = [
        card(Rank.Queen, S), card(Rank.Jack, S), card(Rank.Ten, S),
        card(Rank.Two, H), card(Rank.Three, D),
      ];
      const result = HandEvaluator.evaluate(hole, community);
      expect(result.category).toBe(HandCategory.RoyalFlush);
    });

    it('7장 중 최고 핸드를 선택함', () => {
      const hole = [card(Rank.Ace, S), card(Rank.Ace, H)];
      const community = [
        card(Rank.Ace, D), card(Rank.King, S), card(Rank.King, H),
        card(Rank.Seven, C), card(Rank.Two, D),
      ];
      const result = HandEvaluator.evaluate(hole, community);
      // AAA + KK = Full House
      expect(result.category).toBe(HandCategory.FullHouse);
    });

    it('C(7,5) = 21개 조합 생성', () => {
      const cards: Card[] = [];
      for (let i = 0; i < 7; i++) {
        cards.push(card(Rank.Two + i as Rank, S));
      }
      const combos = HandEvaluator.combinations(cards, 5);
      expect(combos).toHaveLength(21);
    });
  });

  describe('compare — 핸드 비교', () => {
    it('Royal Flush > Straight Flush', () => {
      const royal = HandEvaluator.evaluateFive([
        card(Rank.Ace, S), card(Rank.King, S), card(Rank.Queen, S),
        card(Rank.Jack, S), card(Rank.Ten, S),
      ]);
      const straightFlush = HandEvaluator.evaluateFive([
        card(Rank.Nine, H), card(Rank.Eight, H), card(Rank.Seven, H),
        card(Rank.Six, H), card(Rank.Five, H),
      ]);
      expect(HandEvaluator.compare(royal, straightFlush)).toBe(1);
    });

    it('높은 페어 > 낮은 페어', () => {
      const aces = HandEvaluator.evaluateFive([
        card(Rank.Ace, S), card(Rank.Ace, H), card(Rank.King, D),
        card(Rank.Queen, C), card(Rank.Jack, S),
      ]);
      const kings = HandEvaluator.evaluateFive([
        card(Rank.King, S), card(Rank.King, H), card(Rank.Ace, D),
        card(Rank.Queen, C), card(Rank.Jack, S),
      ]);
      expect(HandEvaluator.compare(aces, kings)).toBe(1);
    });

    it('같은 핸드끼리 키커로 비교', () => {
      const aceKicker = HandEvaluator.evaluateFive([
        card(Rank.Ten, S), card(Rank.Ten, H), card(Rank.Ace, D),
        card(Rank.Five, C), card(Rank.Three, S),
      ]);
      const kingKicker = HandEvaluator.evaluateFive([
        card(Rank.Ten, D), card(Rank.Ten, C), card(Rank.King, S),
        card(Rank.Five, H), card(Rank.Three, D),
      ]);
      expect(HandEvaluator.compare(aceKicker, kingKicker)).toBe(1);
    });

    it('동일 핸드는 0 반환', () => {
      const hand1 = HandEvaluator.evaluateFive([
        card(Rank.Ace, S), card(Rank.King, H), card(Rank.Queen, D),
        card(Rank.Jack, C), card(Rank.Nine, S),
      ]);
      const hand2 = HandEvaluator.evaluateFive([
        card(Rank.Ace, H), card(Rank.King, D), card(Rank.Queen, C),
        card(Rank.Jack, S), card(Rank.Nine, H),
      ]);
      expect(HandEvaluator.compare(hand1, hand2)).toBe(0);
    });
  });
});
