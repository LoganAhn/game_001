import { describe, it, expect } from 'vitest';
import { Suit, Rank, cardToString, isRedSuit, SUIT_SYMBOLS, RANK_LABELS } from '../core/Card';

describe('Card', () => {
  describe('cardToString', () => {
    it('에이스 스페이드를 "A♠"로 변환', () => {
      expect(cardToString({ suit: Suit.Spades, rank: Rank.Ace })).toBe('A♠');
    });

    it('10 하트를 "10♥"로 변환', () => {
      expect(cardToString({ suit: Suit.Hearts, rank: Rank.Ten })).toBe('10♥');
    });

    it('2 클럽을 "2♣"로 변환', () => {
      expect(cardToString({ suit: Suit.Clubs, rank: Rank.Two })).toBe('2♣');
    });
  });

  describe('isRedSuit', () => {
    it('Hearts는 빨강', () => {
      expect(isRedSuit(Suit.Hearts)).toBe(true);
    });

    it('Diamonds는 빨강', () => {
      expect(isRedSuit(Suit.Diamonds)).toBe(true);
    });

    it('Spades는 검정', () => {
      expect(isRedSuit(Suit.Spades)).toBe(false);
    });

    it('Clubs는 검정', () => {
      expect(isRedSuit(Suit.Clubs)).toBe(false);
    });
  });

  describe('상수 매핑', () => {
    it('4개 수트 심볼이 정의됨', () => {
      expect(Object.keys(SUIT_SYMBOLS)).toHaveLength(4);
    });

    it('13개 랭크 라벨이 정의됨', () => {
      expect(Object.keys(RANK_LABELS)).toHaveLength(13);
    });
  });
});
