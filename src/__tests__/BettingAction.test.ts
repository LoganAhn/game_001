import { describe, it, expect } from 'vitest';
import { getAvailableActions, applyAction, validateAction } from '../betting/BettingAction';
import { createPlayer } from '../core/Player';

describe('BettingAction', () => {
  describe('getAvailableActions', () => {
    it('베팅 없을 때: 체크 가능, 콜 불가', () => {
      const player = createPlayer(0, 'Test', 1000, false, 0);
      const actions = getAvailableActions(player, 0, 100);
      expect(actions.canCheck).toBe(true);
      expect(actions.canCall).toBe(false);
      expect(actions.canRaise).toBe(true);
    });

    it('상대 베팅 있을 때: 콜 가능, 체크 불가', () => {
      const player = createPlayer(0, 'Test', 1000, false, 0);
      const actions = getAvailableActions(player, 200, 100);
      expect(actions.canCheck).toBe(false);
      expect(actions.canCall).toBe(true);
      expect(actions.callAmount).toBe(200);
    });

    it('칩이 콜 금액보다 적으면 콜 불가, 올인만 가능', () => {
      const player = createPlayer(0, 'Test', 50, false, 0);
      const actions = getAvailableActions(player, 200, 100);
      expect(actions.canCall).toBe(false);
      expect(actions.canAllIn).toBe(true);
      expect(actions.allInAmount).toBe(50);
    });

    it('최소 레이즈 금액 계산', () => {
      const player = createPlayer(0, 'Test', 1000, false, 0);
      const actions = getAvailableActions(player, 100, 100);
      expect(actions.minRaise).toBe(200); // currentBet + minimumRaise
    });
  });

  describe('applyAction', () => {
    it('fold: 플레이어 폴드 상태 변경', () => {
      const player = createPlayer(0, 'Test', 1000, false, 0);
      const amount = applyAction(player, 'fold', 0, 100);
      expect(player.folded).toBe(true);
      expect(amount).toBe(0);
      expect(player.chips).toBe(1000);
    });

    it('check: 칩 변화 없음', () => {
      const player = createPlayer(0, 'Test', 1000, false, 0);
      const amount = applyAction(player, 'check', 0, 0);
      expect(amount).toBe(0);
      expect(player.chips).toBe(1000);
    });

    it('call: 콜 금액만큼 칩 차감', () => {
      const player = createPlayer(0, 'Test', 1000, false, 0);
      const amount = applyAction(player, 'call', 0, 200);
      expect(amount).toBe(200);
      expect(player.chips).toBe(800);
      expect(player.currentBet).toBe(200);
    });

    it('raise: 레이즈 금액만큼 칩 차감', () => {
      const player = createPlayer(0, 'Test', 1000, false, 0);
      const amount = applyAction(player, 'raise', 400, 200);
      expect(amount).toBe(400);
      expect(player.chips).toBe(600);
      expect(player.currentBet).toBe(400);
    });

    it('allin: 전 칩 베팅, isAllIn = true', () => {
      const player = createPlayer(0, 'Test', 500, false, 0);
      const amount = applyAction(player, 'allin', 0, 200);
      expect(amount).toBe(500);
      expect(player.chips).toBe(0);
      expect(player.isAllIn).toBe(true);
    });

    it('call로 칩이 0이 되면 isAllIn', () => {
      const player = createPlayer(0, 'Test', 200, false, 0);
      applyAction(player, 'call', 0, 200);
      expect(player.chips).toBe(0);
      expect(player.isAllIn).toBe(true);
    });
  });

  describe('validateAction', () => {
    it('fold는 항상 유효', () => {
      const player = createPlayer(0, 'Test', 1000, false, 0);
      expect(validateAction(player, 'fold', 0, 200, 100)).toBe(true);
    });

    it('베팅 없을 때 check 유효', () => {
      const player = createPlayer(0, 'Test', 1000, false, 0);
      expect(validateAction(player, 'check', 0, 0, 100)).toBe(true);
    });

    it('베팅 있을 때 check 무효', () => {
      const player = createPlayer(0, 'Test', 1000, false, 0);
      expect(validateAction(player, 'check', 0, 200, 100)).toBe(false);
    });

    it('최소 레이즈 미만 raise 무효', () => {
      const player = createPlayer(0, 'Test', 1000, false, 0);
      // currentBet=100, minRaise=100 → 최소 200이어야 함
      expect(validateAction(player, 'raise', 150, 100, 100)).toBe(false);
    });

    it('최소 레이즈 이상 raise 유효', () => {
      const player = createPlayer(0, 'Test', 1000, false, 0);
      expect(validateAction(player, 'raise', 200, 100, 100)).toBe(true);
    });
  });
});
