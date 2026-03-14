import { describe, it, expect } from 'vitest';
import { PotManager } from '../core/Pot';
import { createPlayer, Player } from '../core/Player';

function makePlayers(count: number, chips = 10000): Player[] {
  return Array.from({ length: count }, (_, i) =>
    createPlayer(i, `Player${i}`, chips, true, i)
  );
}

describe('PotManager', () => {
  describe('기본 기능', () => {
    it('초기 팟은 0', () => {
      const pm = new PotManager();
      expect(pm.getTotalPot()).toBe(0);
    });

    it('기여금 추가 후 총 팟 계산', () => {
      const pm = new PotManager();
      pm.addContribution(0, 100);
      pm.addContribution(1, 200);
      expect(pm.getTotalPot()).toBe(300);
    });

    it('같은 플레이어 기여금 누적', () => {
      const pm = new PotManager();
      pm.addContribution(0, 100);
      pm.addContribution(0, 50);
      expect(pm.getPlayerContribution(0)).toBe(150);
    });

    it('reset() 후 팟 초기화', () => {
      const pm = new PotManager();
      pm.addContribution(0, 500);
      pm.reset();
      expect(pm.getTotalPot()).toBe(0);
    });
  });

  describe('사이드팟 계산', () => {
    it('모두 같은 금액이면 사이드팟 1개', () => {
      const pm = new PotManager();
      const players = makePlayers(3);
      pm.addContribution(0, 100);
      pm.addContribution(1, 100);
      pm.addContribution(2, 100);
      const pots = pm.calculateSidePots(players);
      expect(pots).toHaveLength(1);
      expect(pots[0]!.amount).toBe(300);
      expect(pots[0]!.eligiblePlayerIds).toHaveLength(3);
    });

    it('1명 올인 시 사이드팟 2개 생성', () => {
      const pm = new PotManager();
      const players = makePlayers(3);
      // Player 0: 50 올인, Player 1,2: 100씩
      pm.addContribution(0, 50);
      pm.addContribution(1, 100);
      pm.addContribution(2, 100);
      players[0]!.isAllIn = true;

      const pots = pm.calculateSidePots(players);
      expect(pots).toHaveLength(2);
      // 메인팟: 50 × 3 = 150 (3명 모두 자격)
      expect(pots[0]!.amount).toBe(150);
      expect(pots[0]!.eligiblePlayerIds).toHaveLength(3);
      // 사이드팟: 50 × 2 = 100 (Player 1,2만 자격)
      expect(pots[1]!.amount).toBe(100);
      expect(pots[1]!.eligiblePlayerIds).toHaveLength(2);
    });

    it('폴드한 플레이어의 기여금도 팟에 포함', () => {
      const pm = new PotManager();
      const players = makePlayers(3);
      pm.addContribution(0, 100);
      pm.addContribution(1, 100);
      pm.addContribution(2, 50); // Player 2 콜 후 폴드
      players[2]!.folded = true;

      const pots = pm.calculateSidePots(players);
      const totalInPots = pots.reduce((sum, p) => sum + p.amount, 0);
      expect(totalInPots).toBe(250);
    });
  });

  describe('팟 분배', () => {
    it('단일 팟 승자에게 전액 분배', () => {
      const pm = new PotManager();
      const sidePots = [{ amount: 300, eligiblePlayerIds: [0, 1, 2] }];
      const rankValues = new Map([[0, 900], [1, 500], [2, 200]]);

      const winners = pm.distributePots(sidePots, rankValues);
      expect(winners).toHaveLength(1);
      expect(winners[0]!.playerId).toBe(0);
      expect(winners[0]!.amount).toBe(300);
    });

    it('동점 시 균등 분배 (split pot)', () => {
      const pm = new PotManager();
      const sidePots = [{ amount: 300, eligiblePlayerIds: [0, 1, 2] }];
      const rankValues = new Map([[0, 500], [1, 500], [2, 200]]);

      const winners = pm.distributePots(sidePots, rankValues);
      expect(winners).toHaveLength(2);
      expect(winners[0]!.amount).toBe(150);
      expect(winners[1]!.amount).toBe(150);
    });

    it('사이드팟별 다른 승자 가능', () => {
      const pm = new PotManager();
      const sidePots = [
        { amount: 150, eligiblePlayerIds: [0, 1, 2] },
        { amount: 100, eligiblePlayerIds: [1, 2] },
      ];
      // Player 0이 메인팟 승, Player 1이 사이드팟 승
      const rankValues = new Map([[0, 900], [1, 700], [2, 200]]);

      const winners = pm.distributePots(sidePots, rankValues);
      const p0 = winners.find(w => w.playerId === 0);
      const p1 = winners.find(w => w.playerId === 1);
      expect(p0!.amount).toBe(150); // 메인팟
      expect(p1!.amount).toBe(100); // 사이드팟
    });

    it('홀수 칩 분배 시 나머지는 첫 번째 승자에게', () => {
      const pm = new PotManager();
      const sidePots = [{ amount: 301, eligiblePlayerIds: [0, 1] }];
      const rankValues = new Map([[0, 500], [1, 500]]);

      const winners = pm.distributePots(sidePots, rankValues);
      const amounts = winners.map(w => w.amount).sort((a, b) => b - a);
      expect(amounts[0]).toBe(151); // 나머지 1칩 포함
      expect(amounts[1]).toBe(150);
    });
  });
});
