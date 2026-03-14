import { describe, it, expect } from 'vitest';
import { Deck } from '../core/Deck';

describe('Deck', () => {
  it('52장으로 초기화됨', () => {
    const deck = new Deck();
    expect(deck.remaining).toBe(52);
  });

  it('deal()은 1장을 꺼내고 remaining 감소', () => {
    const deck = new Deck();
    const card = deck.deal();
    expect(card).toHaveProperty('suit');
    expect(card).toHaveProperty('rank');
    expect(deck.remaining).toBe(51);
  });

  it('dealMultiple()로 여러 장 딜', () => {
    const deck = new Deck();
    const cards = deck.dealMultiple(5);
    expect(cards).toHaveLength(5);
    expect(deck.remaining).toBe(47);
  });

  it('52장 모두 딜하면 에러', () => {
    const deck = new Deck();
    deck.dealMultiple(52);
    expect(() => deck.deal()).toThrow('Deck is empty');
  });

  it('셔플 후에도 52장 유지', () => {
    const deck = new Deck();
    deck.shuffle();
    expect(deck.remaining).toBe(52);
  });

  it('셔플하면 카드 순서가 변경됨', () => {
    const deck1 = new Deck();
    const deck2 = new Deck();
    deck2.shuffle();

    // 첫 10장 비교 — 셔플 후 동일할 확률은 극히 낮음
    const cards1 = deck1.dealMultiple(10);
    const cards2 = deck2.dealMultiple(10);
    const same = cards1.every((c, i) =>
      c.suit === cards2[i]!.suit && c.rank === cards2[i]!.rank
    );
    expect(same).toBe(false);
  });

  it('reset() 후 52장으로 복원됨', () => {
    const deck = new Deck();
    deck.dealMultiple(20);
    deck.reset();
    expect(deck.remaining).toBe(52);
  });

  it('모든 카드가 고유함 (중복 없음)', () => {
    const deck = new Deck();
    const cards = deck.dealMultiple(52);
    const keys = cards.map(c => `${c.suit}-${c.rank}`);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(52);
  });
});
