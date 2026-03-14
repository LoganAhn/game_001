import { describe, it, expect } from 'vitest';
import { GameEngine, ActionProvider } from '../core/GameEngine';
import { getAvailableActions } from '../betting/BettingAction';
import { GAME_CONFIG } from '../utils/Constants';

/** 항상 콜/체크하는 AI */
const alwaysCallProvider: ActionProvider = async (player, currentBet, minimumRaise) => {
  const available = getAvailableActions(player, currentBet, minimumRaise);
  if (available.canCheck) return { action: 'check', amount: 0 };
  if (available.canCall) return { action: 'call', amount: available.callAmount };
  if (available.canAllIn) return { action: 'allin', amount: available.allInAmount };
  return { action: 'fold', amount: 0 };
};

/** 항상 폴드하는 AI (블라인드 제외) */
const alwaysFoldProvider: ActionProvider = async (_player, currentBet) => {
  if (currentBet === 0) return { action: 'check', amount: 0 };
  return { action: 'fold', amount: 0 };
};

describe('GameEngine', () => {
  it('초기 상태: 6명 플레이어, 각 10000칩', () => {
    const engine = new GameEngine(alwaysCallProvider);
    engine.setLogEnabled(false);
    const state = engine.getState();
    expect(state.players).toHaveLength(6);
    expect(state.players.every(p => p.chips === GAME_CONFIG.STARTING_CHIPS)).toBe(true);
    expect(state.phase).toBe('waiting');
    expect(state.handNumber).toBe(0);
  });

  it('1핸드 진행 후 handNumber 증가', async () => {
    const engine = new GameEngine(alwaysCallProvider);
    engine.setLogEnabled(false);
    await engine.playHands(1);
    expect(engine.getState().handNumber).toBe(1);
  });

  it('1핸드 후 총 칩 합계 보존 (칩이 사라지지 않음)', async () => {
    const engine = new GameEngine(alwaysCallProvider);
    engine.setLogEnabled(false);
    await engine.playHands(1);
    const totalChips = engine.getState().players.reduce((sum, p) => sum + p.chips, 0);
    expect(totalChips).toBe(GAME_CONFIG.STARTING_CHIPS * GAME_CONFIG.TOTAL_PLAYERS);
  });

  it('5핸드 진행해도 총 칩 보존', async () => {
    const engine = new GameEngine(alwaysCallProvider);
    engine.setLogEnabled(false);
    await engine.playHands(5);
    const totalChips = engine.getState().players.reduce((sum, p) => sum + p.chips, 0);
    expect(totalChips).toBe(GAME_CONFIG.STARTING_CHIPS * GAME_CONFIG.TOTAL_PLAYERS);
  });

  it('모두 폴드하면 블라인드만 이동', async () => {
    const engine = new GameEngine(alwaysFoldProvider);
    engine.setLogEnabled(false);
    await engine.playHands(1);
    const state = engine.getState();
    // 칩 총합 보존 (블라인드만 이동하므로 총합 불변)
    const totalChips = state.players.reduce((sum, p) => sum + p.chips, 0);
    expect(totalChips).toBe(GAME_CONFIG.STARTING_CHIPS * GAME_CONFIG.TOTAL_PLAYERS);
    // 최소 1명의 칩이 시작과 다름 (블라인드 이동 발생)
    const changed = state.players.filter(p => p.chips !== GAME_CONFIG.STARTING_CHIPS);
    expect(changed.length).toBeGreaterThanOrEqual(1);
  });

  it('핸드 완료 후 phase는 hand_complete', async () => {
    const engine = new GameEngine(alwaysCallProvider);
    engine.setLogEnabled(false);
    await engine.playHands(1);
    expect(engine.getState().phase).toBe('hand_complete');
  });

  it('여러 핸드 진행 시 탈락자 없으면 모두 생존', async () => {
    const engine = new GameEngine(alwaysCallProvider);
    engine.setLogEnabled(false);
    await engine.playHands(3);
    const eliminated = engine.getState().players.filter(p => p.isEliminated);
    // 3핸드로는 탈락 어려움 (시작 10000칩, BB 100)
    expect(eliminated.length).toBe(0);
  });
});
