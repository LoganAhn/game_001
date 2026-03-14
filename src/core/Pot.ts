import { Player } from './Player';
import { SidePot } from './GameState';

export interface PotWinner {
  playerId: number;
  amount: number;
}

export class PotManager {
  private contributions: Map<number, number> = new Map();

  reset(): void {
    this.contributions.clear();
  }

  addContribution(playerId: number, amount: number): void {
    const current = this.contributions.get(playerId) ?? 0;
    this.contributions.set(playerId, current + amount);
  }

  getTotalPot(): number {
    let total = 0;
    for (const amount of this.contributions.values()) {
      total += amount;
    }
    return total;
  }

  getPlayerContribution(playerId: number): number {
    return this.contributions.get(playerId) ?? 0;
  }

  /**
   * 사이드팟 계산
   * 모든 기여금(폴드 포함)을 레벨별로 분리, 자격은 폴드하지 않은 플레이어만
   */
  calculateSidePots(players: Player[]): SidePot[] {
    // 기여금이 있는 모든 플레이어 (폴드 포함)
    const allContributions: { playerId: number; amount: number; folded: boolean }[] = [];
    for (const p of players) {
      if (p.isEliminated) continue;
      const contrib = this.contributions.get(p.id) ?? 0;
      if (contrib > 0) {
        allContributions.push({ playerId: p.id, amount: contrib, folded: p.folded });
      }
    }

    if (allContributions.length === 0) return [];

    // 고유 기여 레벨을 오름차순 정렬
    const uniqueLevels = [...new Set(allContributions.map(c => c.amount))].sort((a, b) => a - b);

    const pots: SidePot[] = [];
    let previousLevel = 0;

    for (const level of uniqueLevels) {
      const increment = level - previousLevel;
      if (increment <= 0) continue;

      // 이 레벨까지 기여한 모든 플레이어 수 (폴드 포함)
      const contributingAll = allContributions.filter(c => c.amount >= previousLevel + 1);
      const potAmount = increment * contributingAll.length;

      // 자격: 폴드하지 않고 이 레벨까지 기여한 플레이어만
      const eligiblePlayerIds = allContributions
        .filter(c => !c.folded && c.amount >= level)
        .map(c => c.playerId);

      if (potAmount > 0) {
        // 기존 팟에 같은 자격자 집합이면 합치기
        const lastPot = pots[pots.length - 1];
        if (lastPot && this.sameEligible(lastPot.eligiblePlayerIds, eligiblePlayerIds)) {
          lastPot.amount += potAmount;
        } else {
          pots.push({ amount: potAmount, eligiblePlayerIds });
        }
      }

      previousLevel = level;
    }

    return pots;
  }

  private sameEligible(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    const setA = new Set(a);
    return b.every(id => setA.has(id));
  }

  /**
   * 팟 분배: 각 사이드팟별로 자격 있는 플레이어 중 최고 핸드에게 분배
   * rankValues: playerId → HandResult.rankValue 매핑
   */
  distributePots(
    sidePots: SidePot[],
    rankValues: Map<number, number>
  ): PotWinner[] {
    const winners: PotWinner[] = [];

    for (const pot of sidePots) {
      // 자격 있는 플레이어 중 rankValue가 있는(쇼다운 참여) 플레이어만
      const eligible = pot.eligiblePlayerIds.filter(id => rankValues.has(id));
      if (eligible.length === 0) continue;

      // 최고 rankValue 찾기
      let maxRank = -1;
      for (const id of eligible) {
        const rank = rankValues.get(id)!;
        if (rank > maxRank) maxRank = rank;
      }

      // 동점자 (split pot)
      const potWinners = eligible.filter(id => rankValues.get(id) === maxRank);
      const share = Math.floor(pot.amount / potWinners.length);
      const remainder = pot.amount - share * potWinners.length;

      for (let i = 0; i < potWinners.length; i++) {
        const winnerId = potWinners[i]!;
        // 나머지 칩은 첫 번째 승자에게
        const amount = share + (i === 0 ? remainder : 0);
        const existing = winners.find(w => w.playerId === winnerId);
        if (existing) {
          existing.amount += amount;
        } else {
          winners.push({ playerId: winnerId, amount });
        }
      }
    }

    return winners;
  }
}
