import { describe, it, expect } from 'vitest';
import { chenFormula } from '../ai/PreFlopStrategy';
import { calculateHandStrength, boardDanger } from '../ai/HandStrengthCalc';
import { getAIAction } from '../ai/AIController';
import { AI_PROFILES } from '../ai/AIPersonality';
import { Card, Suit, Rank } from '../core/Card';
import { getAvailableActions } from '../betting/BettingAction';
import { createPlayer } from '../core/Player';

// Helper
function card(rank: Rank, suit: Suit): Card {
  return { rank, suit };
}

describe('Chen Formula', () => {
  it('AA = 20 (최고 페어)', () => {
    expect(chenFormula(
      card(Rank.Ace, Suit.Spades),
      card(Rank.Ace, Suit.Hearts)
    )).toBe(20);
  });

  it('KK = 16', () => {
    expect(chenFormula(
      card(Rank.King, Suit.Spades),
      card(Rank.King, Suit.Hearts)
    )).toBe(16);
  });

  it('22 = 5 (최소 페어 점수)', () => {
    expect(chenFormula(
      card(Rank.Two, Suit.Spades),
      card(Rank.Two, Suit.Hearts)
    )).toBe(5);
  });

  it('AKs (수티드) > AKo (오프수트)', () => {
    const suited = chenFormula(
      card(Rank.Ace, Suit.Spades),
      card(Rank.King, Suit.Spades)
    );
    const offsuit = chenFormula(
      card(Rank.Ace, Suit.Spades),
      card(Rank.King, Suit.Hearts)
    );
    expect(suited).toBeGreaterThan(offsuit);
  });

  it('72o = 매우 낮은 점수', () => {
    const score = chenFormula(
      card(Rank.Seven, Suit.Spades),
      card(Rank.Two, Suit.Hearts)
    );
    expect(score).toBeLessThanOrEqual(0);
  });

  it('높은 카드 순서와 무관하게 동일 결과', () => {
    const a = chenFormula(card(Rank.Ace, Suit.Spades), card(Rank.King, Suit.Hearts));
    const b = chenFormula(card(Rank.King, Suit.Hearts), card(Rank.Ace, Suit.Spades));
    expect(a).toBe(b);
  });
});

describe('Hand Strength Calculation', () => {
  it('원페어 > 하이카드', () => {
    const pair = calculateHandStrength(
      [card(Rank.Ace, Suit.Spades), card(Rank.Ace, Suit.Hearts)],
      [card(Rank.Two, Suit.Clubs), card(Rank.Seven, Suit.Diamonds), card(Rank.Ten, Suit.Spades)]
    );
    const highCard = calculateHandStrength(
      [card(Rank.Ace, Suit.Spades), card(Rank.King, Suit.Hearts)],
      [card(Rank.Two, Suit.Clubs), card(Rank.Seven, Suit.Diamonds), card(Rank.Ten, Suit.Spades)]
    );
    expect(pair).toBeGreaterThan(highCard);
  });

  it('플러시 > 스트레이트', () => {
    const flush = calculateHandStrength(
      [card(Rank.Ace, Suit.Hearts), card(Rank.King, Suit.Hearts)],
      [card(Rank.Two, Suit.Hearts), card(Rank.Seven, Suit.Hearts), card(Rank.Ten, Suit.Hearts)]
    );
    const straight = calculateHandStrength(
      [card(Rank.Nine, Suit.Spades), card(Rank.Eight, Suit.Hearts)],
      [card(Rank.Seven, Suit.Clubs), card(Rank.Six, Suit.Diamonds), card(Rank.Ten, Suit.Spades)]
    );
    expect(flush).toBeGreaterThan(straight);
  });

  it('0~1 범위 반환', () => {
    const strength = calculateHandStrength(
      [card(Rank.Two, Suit.Spades), card(Rank.Three, Suit.Hearts)],
      [card(Rank.King, Suit.Clubs), card(Rank.Queen, Suit.Diamonds), card(Rank.Jack, Suit.Spades)]
    );
    expect(strength).toBeGreaterThanOrEqual(0);
    expect(strength).toBeLessThanOrEqual(1);
  });
});

describe('Board Danger', () => {
  it('모노톤 보드(같은 수트 3장) 위험도 높음', () => {
    const danger = boardDanger([
      card(Rank.Two, Suit.Hearts),
      card(Rank.Seven, Suit.Hearts),
      card(Rank.Jack, Suit.Hearts),
    ]);
    expect(danger).toBeGreaterThanOrEqual(0.2);
  });

  it('레인보우 보드 위험도 낮음', () => {
    const danger = boardDanger([
      card(Rank.Two, Suit.Spades),
      card(Rank.Seven, Suit.Hearts),
      card(Rank.Jack, Suit.Diamonds),
    ]);
    expect(danger).toBeLessThan(0.2);
  });
});

describe('AI Controller', () => {
  it('Alex(Tight-Aggressive)가 72o에 fold 또는 check 경향', () => {
    const player = createPlayer(1, 'Alex', 10000, true, 1);
    player.holeCards = [card(Rank.Seven, Suit.Spades), card(Rank.Two, Suit.Hearts)];
    const available = getAvailableActions(player, 200, 100);

    // 여러 번 실행하여 fold/check 비율 확인
    let foldOrCheckCount = 0;
    for (let i = 0; i < 50; i++) {
      const action = getAIAction(player, available, [], 'preflop', 300, 200, 100);
      if (action.action === 'fold' || action.action === 'check') foldOrCheckCount++;
    }
    // Alex는 tight(0.7)이므로 72o에 대부분 fold
    expect(foldOrCheckCount).toBeGreaterThan(25);
  });

  it('모든 AI 프로필이 유효한 액션 반환', () => {
    for (const [id, profile] of Object.entries(AI_PROFILES)) {
      const player = createPlayer(Number(id), profile.name, 10000, true, Number(id));
      player.holeCards = [card(Rank.Ace, Suit.Spades), card(Rank.King, Suit.Hearts)];
      const available = getAvailableActions(player, 100, 100);
      const action = getAIAction(player, available, [], 'preflop', 150, 100, 100);

      expect(['fold', 'check', 'call', 'raise', 'allin']).toContain(action.action);
      expect(action.amount).toBeGreaterThanOrEqual(0);
    }
  });
});
