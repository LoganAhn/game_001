import { Player } from '../core/Player';
import { ActionType } from '../core/GameState';

export interface BettingActionResult {
  action: ActionType;
  amount: number; // 이번 액션으로 추가 베팅하는 금액
  totalBet: number; // 이 베팅 라운드에서의 총 베팅 금액
}

export interface AvailableActions {
  canFold: boolean;
  canCheck: boolean;
  canCall: boolean;
  callAmount: number;
  canRaise: boolean;
  minRaise: number;
  maxRaise: number; // = player chips (all-in)
  canAllIn: boolean;
  allInAmount: number;
}

/**
 * 현재 플레이어가 수행할 수 있는 액션 목록 계산
 */
export function getAvailableActions(
  player: Player,
  currentBet: number,
  minimumRaise: number
): AvailableActions {
  const toCall = currentBet - player.currentBet;
  const playerChips = player.chips;

  const canFold = true;
  const canCheck = toCall === 0;
  const canCall = toCall > 0 && playerChips > toCall;
  const callAmount = Math.min(toCall, playerChips);

  // 레이즈: 최소 레이즈 = currentBet + minimumRaise
  const minRaiseTotal = currentBet + minimumRaise;
  const minRaiseAmount = minRaiseTotal - player.currentBet;
  const canRaise = playerChips > toCall && playerChips >= minRaiseAmount;
  const maxRaise = player.currentBet + playerChips; // 올인 시 토탈

  const canAllIn = playerChips > 0;
  const allInAmount = playerChips;

  return {
    canFold,
    canCheck,
    canCall,
    callAmount,
    canRaise,
    minRaise: minRaiseTotal,
    maxRaise,
    canAllIn,
    allInAmount,
  };
}

/**
 * 액션을 플레이어에게 적용
 * 반환: 실제로 베팅한 금액
 */
export function applyAction(
  player: Player,
  action: ActionType,
  amount: number,
  currentBet: number
): number {
  switch (action) {
    case 'fold': {
      player.folded = true;
      return 0;
    }
    case 'check': {
      return 0;
    }
    case 'call': {
      const toCall = Math.min(currentBet - player.currentBet, player.chips);
      player.chips -= toCall;
      player.currentBet += toCall;
      player.totalBetThisRound += toCall;
      if (player.chips === 0) player.isAllIn = true;
      return toCall;
    }
    case 'raise': {
      // amount = 레이즈 후 총 베팅액 (이 라운드에서)
      const raiseAmount = amount - player.currentBet;
      const actual = Math.min(raiseAmount, player.chips);
      player.chips -= actual;
      player.currentBet += actual;
      player.totalBetThisRound += actual;
      if (player.chips === 0) player.isAllIn = true;
      return actual;
    }
    case 'allin': {
      const allIn = player.chips;
      player.currentBet += allIn;
      player.totalBetThisRound += allIn;
      player.chips = 0;
      player.isAllIn = true;
      return allIn;
    }
  }
}

/**
 * 액션 유효성 검증
 */
export function validateAction(
  player: Player,
  action: ActionType,
  amount: number,
  currentBet: number,
  minimumRaise: number
): boolean {
  const available = getAvailableActions(player, currentBet, minimumRaise);

  switch (action) {
    case 'fold':
      return true;
    case 'check':
      return available.canCheck;
    case 'call':
      return available.canCall || (currentBet > player.currentBet && player.chips <= currentBet - player.currentBet);
    case 'raise':
      if (!available.canRaise) return false;
      return amount >= available.minRaise && amount <= available.maxRaise;
    case 'allin':
      return available.canAllIn;
  }
}
