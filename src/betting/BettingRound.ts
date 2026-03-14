import { Player } from '../core/Player';
import { ActionType } from '../core/GameState';
import { PotManager } from '../core/Pot';
import { applyAction } from './BettingAction';

export type ActionRequestFn = (player: Player, currentBet: number, minimumRaise: number) => Promise<{ action: ActionType; amount: number }>;

export interface BettingRoundResult {
  /** 베팅 라운드 중 폴드로 1명만 남아 핸드가 끝남 */
  handFinished: boolean;
  /** 액티브 플레이어가 1명 이하 (나머지 전원 올인 또는 폴드) */
  allInShowdown: boolean;
}

export class BettingRound {
  constructor(
    private players: Player[],
    private potManager: PotManager,
    private onAction: (playerId: number, action: ActionType, amount: number) => void,
    private onPotUpdate: () => void,
  ) {}

  /**
   * 베팅 라운드 실행
   * @param startIndex 첫 번째로 액션하는 플레이어의 인덱스 (activePlayers 기준)
   * @param requestAction 플레이어에게 액션을 요청하는 함수 (AI 또는 인간)
   */
  async run(
    startIndex: number,
    currentBet: number,
    minimumRaise: number,
    requestAction: ActionRequestFn,
  ): Promise<{ currentBet: number; minimumRaise: number; result: BettingRoundResult }> {
    const activePlayers = this.getActivePlayers();

    if (activePlayers.length <= 1) {
      return {
        currentBet,
        minimumRaise,
        result: { handFinished: true, allInShowdown: false },
      };
    }

    // 베팅이 가능한 플레이어 (폴드/올인이 아닌)
    let actablePlayers = this.getActablePlayers();
    if (actablePlayers.length === 0) {
      return {
        currentBet,
        minimumRaise,
        result: { handFinished: false, allInShowdown: true },
      };
    }

    // 마지막으로 레이즈한 플레이어 (한 바퀴 돌면 종료)
    let lastRaiserId: number | null = null;
    let currentIndex = this.findPlayerIndex(activePlayers, startIndex);
    let actedCount = 0;

    while (true) {
      const player = activePlayers[currentIndex]!;

      // 폴드/올인한 플레이어는 스킵
      if (!player.folded && !player.isAllIn) {
        const { action, amount } = await requestAction(player, currentBet, minimumRaise);

        const actualAmount = applyAction(player, action, amount, currentBet);
        this.potManager.addContribution(player.id, actualAmount);
        this.onAction(player.id, action, actualAmount);

        // 레이즈/올인으로 베팅이 올라간 경우
        if ((action === 'raise' || action === 'allin') && player.currentBet > currentBet) {
          const raiseSize = player.currentBet - currentBet;
          minimumRaise = Math.max(minimumRaise, raiseSize);
          currentBet = player.currentBet;
          lastRaiserId = player.id;
          actedCount = 1; // 레이즈 후 다시 한 바퀴
        } else {
          actedCount++;
        }

        this.onPotUpdate();

        // 폴드로 1명만 남으면 핸드 종료
        const remaining = this.getActivePlayers();
        if (remaining.length <= 1) {
          return {
            currentBet,
            minimumRaise,
            result: { handFinished: true, allInShowdown: false },
          };
        }
      }

      // 다음 플레이어
      currentIndex = (currentIndex + 1) % activePlayers.length;

      // 종료 조건: 한 바퀴를 돌았는지 확인
      actablePlayers = this.getActablePlayers();

      if (actablePlayers.length === 0) {
        // 모두 올인 또는 폴드
        return {
          currentBet,
          minimumRaise,
          result: { handFinished: false, allInShowdown: true },
        };
      }

      // 마지막 레이즈 플레이어에게 돌아왔거나, 레이즈 없이 한 바퀴 돌았으면 종료
      if (lastRaiserId !== null) {
        if (activePlayers[currentIndex]!.id === lastRaiserId) break;
      } else {
        if (actedCount >= actablePlayers.length) break;
      }

      // 모든 액터블 플레이어의 베팅이 currentBet과 같으면 종료
      const allMatched = actablePlayers.every(p => p.currentBet === currentBet);
      if (allMatched && actedCount > 0) break;
    }

    const allInShowdown = this.getActablePlayers().length <= 1 && this.getActivePlayers().length > 1;

    return {
      currentBet,
      minimumRaise,
      result: { handFinished: false, allInShowdown },
    };
  }

  /** 폴드하지 않고 탈락하지 않은 플레이어 */
  private getActivePlayers(): Player[] {
    return this.players.filter(p => !p.folded && !p.isEliminated);
  }

  /** 액션 가능한 플레이어 (폴드/올인/탈락 아닌) */
  private getActablePlayers(): Player[] {
    return this.players.filter(p => !p.folded && !p.isAllIn && !p.isEliminated);
  }

  private findPlayerIndex(activePlayers: Player[], seatStartIndex: number): number {
    // seatStartIndex부터 시작하는 첫 번째 액티브 플레이어 찾기
    for (let i = 0; i < activePlayers.length; i++) {
      if (activePlayers[i]!.seatIndex >= seatStartIndex) return i;
    }
    return 0;
  }
}
