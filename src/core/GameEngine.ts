import { Card, cardToString } from './Card';
import { Deck } from './Deck';
import { HandEvaluator } from './HandEvaluator';
import { Player, createPlayer, resetPlayerForNewHand } from './Player';
import { GamePhase, GameState, getSmallBlindIndex, getBigBlindIndex } from './GameState';
import { PotManager } from './Pot';
import { BettingRound, ActionRequestFn } from '../betting/BettingRound';
import { ActionType } from './GameState';
import { GAME_CONFIG } from '../utils/Constants';

export type ActionProvider = (
  player: Player,
  currentBet: number,
  minimumRaise: number,
  communityCards: Card[],
  phase: GamePhase
) => Promise<{ action: ActionType; amount: number }>;

export class GameEngine {
  private state: GameState;
  private deck: Deck;
  private potManager: PotManager;
  private actionProvider: ActionProvider;
  private logEnabled = true;

  constructor(actionProvider: ActionProvider) {
    this.deck = new Deck();
    this.potManager = new PotManager();
    this.actionProvider = actionProvider;

    const players: Player[] = [
      createPlayer(0, 'You', GAME_CONFIG.STARTING_CHIPS, false, 0),
      createPlayer(1, 'Alex', GAME_CONFIG.STARTING_CHIPS, true, 1),
      createPlayer(2, 'Bella', GAME_CONFIG.STARTING_CHIPS, true, 2),
      createPlayer(3, 'Charlie', GAME_CONFIG.STARTING_CHIPS, true, 3),
      createPlayer(4, 'Diana', GAME_CONFIG.STARTING_CHIPS, true, 4),
      createPlayer(5, 'Eddie', GAME_CONFIG.STARTING_CHIPS, true, 5),
    ];

    this.state = {
      players,
      communityCards: [],
      mainPot: 0,
      sidePots: [],
      dealerIndex: 0,
      currentPlayerIndex: 0,
      phase: 'waiting',
      currentBet: 0,
      minimumRaise: GAME_CONFIG.INITIAL_BIG_BLIND,
      smallBlind: GAME_CONFIG.INITIAL_SMALL_BLIND,
      bigBlind: GAME_CONFIG.INITIAL_BIG_BLIND,
      handNumber: 0,
      isGameOver: false,
    };
  }

  setLogEnabled(enabled: boolean): void {
    this.logEnabled = enabled;
  }

  getState(): GameState {
    return this.state;
  }

  private log(msg: string): void {
    if (this.logEnabled) console.log(msg);
  }

  /**
   * N핸드만 진행 (데모/테스트용)
   */
  async playHands(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      if (this.state.isGameOver) break;
      await this.playHand();
      this.checkEliminations();

      const alive = this.state.players.filter(p => !p.isEliminated);
      if (alive.length <= 1) {
        this.state.isGameOver = true;
        this.log(`\n🏆 ${alive[0]?.name ?? 'Unknown'} 최종 승리!`);
        break;
      }

      if (this.state.handNumber % GAME_CONFIG.BLIND_INCREASE_INTERVAL === 0 && this.state.handNumber > 0) {
        this.state.smallBlind = Math.floor(this.state.smallBlind * GAME_CONFIG.BLIND_INCREASE_MULTIPLIER);
        this.state.bigBlind = Math.floor(this.state.bigBlind * GAME_CONFIG.BLIND_INCREASE_MULTIPLIER);
        this.log(`\n📈 블라인드 증가: SB ${this.state.smallBlind} / BB ${this.state.bigBlind}`);
      }

      this.advanceDealer();
    }
  }

  /**
   * 게임 시작 — 게임 오버까지 반복
   */
  async startGame(): Promise<void> {
    this.log('=== Texas Hold\'em 게임 시작! ===');

    while (!this.state.isGameOver) {
      await this.playHand();
      this.checkEliminations();

      const alive = this.state.players.filter(p => !p.isEliminated);
      if (alive.length <= 1) {
        this.state.isGameOver = true;
        this.log(`\n🏆 ${alive[0]?.name ?? 'Unknown'} 최종 승리!`);
        break;
      }

      // 블라인드 증가
      if (this.state.handNumber % GAME_CONFIG.BLIND_INCREASE_INTERVAL === 0 && this.state.handNumber > 0) {
        this.state.smallBlind = Math.floor(this.state.smallBlind * GAME_CONFIG.BLIND_INCREASE_MULTIPLIER);
        this.state.bigBlind = Math.floor(this.state.bigBlind * GAME_CONFIG.BLIND_INCREASE_MULTIPLIER);
        this.log(`\n📈 블라인드 증가: SB ${this.state.smallBlind} / BB ${this.state.bigBlind}`);
      }

      // 딜러 이동
      this.advanceDealer();
    }
  }

  /**
   * 한 핸드 진행
   */
  private async playHand(): Promise<void> {
    this.state.handNumber++;
    this.state.phase = 'preflop';
    this.state.communityCards = [];
    this.state.currentBet = 0;
    this.state.minimumRaise = this.state.bigBlind;
    this.potManager.reset();

    // 플레이어 상태 리셋
    for (const p of this.state.players) {
      if (!p.isEliminated) resetPlayerForNewHand(p);
    }

    const alivePlayers = this.state.players.filter(p => !p.isEliminated);
    this.log(`\n${'='.repeat(50)}`);
    this.log(`핸드 #${this.state.handNumber} | 딜러: ${alivePlayers[this.state.dealerIndex]?.name}`);
    this.log(`블라인드: SB ${this.state.smallBlind} / BB ${this.state.bigBlind}`);

    // 덱 셔플
    this.deck = new Deck();
    this.deck.shuffle();

    // 블라인드 포스팅
    this.postBlinds(alivePlayers);

    // 홀 카드 딜
    this.dealHoleCards(alivePlayers);

    // 프리플롭 베팅
    const preflopStart = this.getPreflopStartIndex(alivePlayers);
    const preflopResult = await this.runBettingRound(alivePlayers, preflopStart);
    if (preflopResult.handFinished) {
      this.finishHandByFold(alivePlayers);
      return;
    }

    // 플롭
    this.state.phase = 'flop';
    this.resetBetsForNewRound(alivePlayers);
    this.dealCommunityCards(3);
    this.log(`\n--- 플롭: ${this.state.communityCards.map(cardToString).join(' ')} ---`);

    if (!preflopResult.allInShowdown) {
      const flopStart = this.getPostflopStartIndex(alivePlayers);
      const flopResult = await this.runBettingRound(alivePlayers, flopStart);
      if (flopResult.handFinished) {
        this.finishHandByFold(alivePlayers);
        return;
      }
    }

    // 턴
    this.state.phase = 'turn';
    this.resetBetsForNewRound(alivePlayers);
    this.dealCommunityCards(1);
    this.log(`\n--- 턴: ${this.state.communityCards.map(cardToString).join(' ')} ---`);

    if (!preflopResult.allInShowdown) {
      const turnStart = this.getPostflopStartIndex(alivePlayers);
      const turnResult = await this.runBettingRound(alivePlayers, turnStart);
      if (turnResult.handFinished) {
        this.finishHandByFold(alivePlayers);
        return;
      }
    }

    // 리버
    this.state.phase = 'river';
    this.resetBetsForNewRound(alivePlayers);
    this.dealCommunityCards(1);
    this.log(`\n--- 리버: ${this.state.communityCards.map(cardToString).join(' ')} ---`);

    if (!preflopResult.allInShowdown) {
      const riverStart = this.getPostflopStartIndex(alivePlayers);
      const riverResult = await this.runBettingRound(alivePlayers, riverStart);
      if (riverResult.handFinished) {
        this.finishHandByFold(alivePlayers);
        return;
      }
    }

    // 쇼다운
    this.state.phase = 'showdown';
    this.resolveShowdown(alivePlayers);
  }

  private postBlinds(alivePlayers: Player[]): void {
    const sbIdx = getSmallBlindIndex(this.state.dealerIndex, alivePlayers);
    const bbIdx = getBigBlindIndex(this.state.dealerIndex, alivePlayers);
    const sbPlayer = alivePlayers[sbIdx]!;
    const bbPlayer = alivePlayers[bbIdx]!;

    const sbAmount = Math.min(this.state.smallBlind, sbPlayer.chips);
    sbPlayer.chips -= sbAmount;
    sbPlayer.currentBet = sbAmount;
    sbPlayer.totalBetThisRound = sbAmount;
    this.potManager.addContribution(sbPlayer.id, sbAmount);
    if (sbPlayer.chips === 0) sbPlayer.isAllIn = true;

    const bbAmount = Math.min(this.state.bigBlind, bbPlayer.chips);
    bbPlayer.chips -= bbAmount;
    bbPlayer.currentBet = bbAmount;
    bbPlayer.totalBetThisRound = bbAmount;
    this.potManager.addContribution(bbPlayer.id, bbAmount);
    if (bbPlayer.chips === 0) bbPlayer.isAllIn = true;

    this.state.currentBet = bbAmount;
    this.state.mainPot = sbAmount + bbAmount;

    this.log(`  ${sbPlayer.name} SB: ${sbAmount} | ${bbPlayer.name} BB: ${bbAmount}`);
  }

  private dealHoleCards(alivePlayers: Player[]): void {
    for (const player of alivePlayers) {
      player.holeCards = this.deck.dealMultiple(2);
    }
    this.log(`  홀 카드 딜 완료 (${alivePlayers.length}명)`);
  }

  private dealCommunityCards(count: number): void {
    // 번 카드 (1장 버림)
    this.deck.deal();
    for (let i = 0; i < count; i++) {
      this.state.communityCards.push(this.deck.deal());
    }
  }

  private async runBettingRound(
    _alivePlayers: Player[],
    startSeatIndex: number
  ): Promise<{ handFinished: boolean; allInShowdown: boolean }> {
    const bettingRound = new BettingRound(
      this.state.players,
      this.potManager,
      (playerId, action, amount) => {
        const player = this.state.players.find(p => p.id === playerId)!;
        this.log(`  ${player.name}: ${action}${amount > 0 ? ` ${amount}` : ''} (칩: ${player.chips})`);
      },
      () => {
        this.state.mainPot = this.potManager.getTotalPot();
      },
    );

    const requestAction: ActionRequestFn = async (player, currentBet, minimumRaise) => {
      return this.actionProvider(
        player,
        currentBet,
        minimumRaise,
        this.state.communityCards,
        this.state.phase
      );
    };

    const { currentBet, minimumRaise, result } = await bettingRound.run(
      startSeatIndex,
      this.state.currentBet,
      this.state.minimumRaise,
      requestAction
    );

    this.state.currentBet = currentBet;
    this.state.minimumRaise = minimumRaise;
    this.state.sidePots = this.potManager.calculateSidePots(this.state.players);

    return result;
  }

  private resetBetsForNewRound(alivePlayers: Player[]): void {
    for (const p of alivePlayers) {
      p.currentBet = 0;
    }
    this.state.currentBet = 0;
    this.state.minimumRaise = this.state.bigBlind;
  }

  private getPreflopStartIndex(alivePlayers: Player[]): number {
    // 프리플롭: BB 다음 플레이어부터
    const bbIdx = getBigBlindIndex(this.state.dealerIndex, alivePlayers);
    const nextIdx = (bbIdx + 1) % alivePlayers.length;
    return alivePlayers[nextIdx]!.seatIndex;
  }

  private getPostflopStartIndex(alivePlayers: Player[]): number {
    // 포스트플롭: SB부터 (또는 SB 폴드면 그 다음)
    const sbIdx = getSmallBlindIndex(this.state.dealerIndex, alivePlayers);
    return alivePlayers[sbIdx]!.seatIndex;
  }

  private finishHandByFold(alivePlayers: Player[]): void {
    const winner = alivePlayers.find(p => !p.folded && !p.isEliminated);
    if (!winner) return;

    const totalPot = this.potManager.getTotalPot();
    winner.chips += totalPot;
    this.state.mainPot = 0;
    this.state.phase = 'hand_complete';

    this.log(`\n  💰 ${winner.name} 승리 (상대 전원 폴드) — +${totalPot} 칩`);
    this.logChipStandings();
  }

  private resolveShowdown(alivePlayers: Player[]): void {
    const activePlayers = alivePlayers.filter(p => !p.folded);
    const rankValues = new Map<number, number>();

    this.log('\n--- 쇼다운 ---');

    for (const player of activePlayers) {
      const result = HandEvaluator.evaluate(player.holeCards, this.state.communityCards);
      rankValues.set(player.id, result.rankValue);
      this.log(`  ${player.name}: ${player.holeCards.map(cardToString).join(' ')} → ${result.description}`);
    }

    const sidePots = this.potManager.calculateSidePots(this.state.players);
    const potWinners = this.potManager.distributePots(sidePots, rankValues);

    this.log('');
    for (const { playerId, amount } of potWinners) {
      const player = this.state.players.find(p => p.id === playerId)!;
      player.chips += amount;
      this.log(`  💰 ${player.name} +${amount} 칩`);
    }

    this.state.mainPot = 0;
    this.state.sidePots = [];
    this.state.phase = 'hand_complete';
    this.logChipStandings();
  }

  private checkEliminations(): void {
    for (const player of this.state.players) {
      if (!player.isEliminated && player.chips <= 0) {
        player.isEliminated = true;
        this.log(`  ❌ ${player.name} 탈락!`);
      }
    }
  }

  private advanceDealer(): void {
    const alivePlayers = this.state.players.filter(p => !p.isEliminated);
    if (alivePlayers.length <= 1) return;
    this.state.dealerIndex = (this.state.dealerIndex + 1) % alivePlayers.length;
  }

  private logChipStandings(): void {
    this.log('  ─────────────────');
    const alive = this.state.players.filter(p => !p.isEliminated);
    alive.sort((a, b) => b.chips - a.chips);
    for (const p of alive) {
      this.log(`  ${p.name}: ${p.chips.toLocaleString()} 칩`);
    }
  }
}
