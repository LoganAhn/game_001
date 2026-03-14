import { Player } from '../core/Player';
import { GameState, getSmallBlindIndex, getBigBlindIndex, ActionType } from '../core/GameState';
import { AvailableActions } from '../betting/BettingAction';
import { createTableElement } from './TableView';
import { createPlayerSeat, updatePlayerSeat, PlayerSeatElements } from './PlayerView';
import { renderCommunityCards } from './CommunityCardsView';
import { renderPotDisplay } from './PotView';
import { createMessageBar, updateMessage } from './MessageView';
import { BettingControls, BettingDecision } from './BettingControls';

export class Renderer {
  private root: HTMLElement;
  private gameContainer!: HTMLElement;
  private tableWrapper!: HTMLElement;
  private communityArea!: HTMLElement;
  private messageBar!: HTMLElement;
  private headerInfo!: HTMLElement;
  private playerSeats: Map<number, PlayerSeatElements> = new Map();
  private lastActions: Map<number, ActionType | null> = new Map();
  private bettingControls!: BettingControls;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  /** 시작 화면 표시 */
  showStartScreen(onStart: () => void): void {
    this.root.replaceChildren();

    const screen = document.createElement('div');
    screen.className = 'start-screen';

    const title = document.createElement('h1');
    title.textContent = '\u2660 Texas Hold\'em';

    const subtitle = document.createElement('p');
    subtitle.className = 'subtitle';
    subtitle.textContent = 'No-Limit \ud14d\uc0ac\uc2a4 \ud640\ub364 \ud3ec\ucee4';

    const btn = document.createElement('button');
    btn.className = 'start-btn';
    btn.textContent = '\uac8c\uc784 \uc2dc\uc791';
    btn.addEventListener('click', () => {
      btn.disabled = true;
      btn.textContent = '\uc900\ube44 \uc911...';
      onStart();
    });

    screen.append(title, subtitle, btn);
    this.root.appendChild(screen);
  }

  /** 게임 UI 초기화 */
  initGameUI(players: Player[]): void {
    this.root.replaceChildren();

    // Game container
    this.gameContainer = document.createElement('div');
    this.gameContainer.className = 'game-container';

    // Header bar
    const header = document.createElement('div');
    header.className = 'header-bar';

    const headerTitle = document.createElement('div');
    headerTitle.className = 'header-title';
    headerTitle.textContent = 'TEXAS HOLD\'EM';

    this.headerInfo = document.createElement('div');
    this.headerInfo.className = 'header-info';

    header.append(headerTitle, this.headerInfo);

    // Poker table
    this.tableWrapper = createTableElement();
    this.communityArea = this.tableWrapper.querySelector('.community-area')!;

    // Player seats
    this.playerSeats.clear();
    this.lastActions.clear();

    for (const player of players) {
      const seatElements = createPlayerSeat(player, player.seatIndex);
      this.playerSeats.set(player.id, seatElements);
      this.lastActions.set(player.id, null);
      this.tableWrapper.appendChild(seatElements.container);
    }

    // Betting controls
    this.bettingControls = new BettingControls(this.tableWrapper);

    // Message bar
    this.messageBar = createMessageBar();

    this.gameContainer.append(header, this.tableWrapper, this.messageBar);
    this.root.appendChild(this.gameContainer);
  }

  /** 인간 플레이어 베팅 입력 요청 */
  requestHumanAction(available: AvailableActions, mainPot: number): Promise<BettingDecision> {
    return this.bettingControls.show(available, mainPot);
  }

  /** 베팅 컨트롤 숨기기 */
  hideBettingControls(): void {
    this.bettingControls.hide();
  }

  /** 전체 게임 상태 렌더링 */
  render(state: GameState): void {
    const alivePlayers = state.players.filter(p => !p.isEliminated);

    // Header info
    this.renderHeader(state);

    // Community cards + Pot
    renderCommunityCards(this.communityArea, state.communityCards);
    renderPotDisplay(this.communityArea, state.mainPot, state.sidePots);

    // Player seats
    for (const player of state.players) {
      const elements = this.playerSeats.get(player.id);
      if (!elements) continue;

      const aliveIndex = alivePlayers.indexOf(player);
      const isDealer = aliveIndex === state.dealerIndex;

      let blindType: 'sb' | 'bb' | null = null;
      if (alivePlayers.length >= 2 && !player.isEliminated) {
        const sbIdx = getSmallBlindIndex(state.dealerIndex, alivePlayers);
        const bbIdx = getBigBlindIndex(state.dealerIndex, alivePlayers);
        if (aliveIndex === sbIdx) blindType = 'sb';
        else if (aliveIndex === bbIdx) blindType = 'bb';
      }

      const showCards = !player.isAI || state.phase === 'showdown';

      updatePlayerSeat(elements, player, {
        isDealer,
        blindType,
        isCurrentTurn: player.id === state.currentPlayerIndex && state.phase !== 'showdown' && state.phase !== 'hand_complete' && state.phase !== 'waiting',
        showCards,
        lastAction: this.lastActions.get(player.id) ?? null,
      });
    }
  }

  /** 플레이어 액션 기록 */
  setPlayerAction(playerId: number, action: ActionType): void {
    this.lastActions.set(playerId, action);
  }

  /** 새 핸드 시작 시 액션 초기화 */
  clearActions(): void {
    for (const key of this.lastActions.keys()) {
      this.lastActions.set(key, null);
    }
  }

  /** 메시지 표시 */
  setMessage(text: string): void {
    if (this.messageBar) {
      updateMessage(this.messageBar, text);
    }
  }

  private renderHeader(state: GameState): void {
    this.headerInfo.replaceChildren();

    const handSpan = document.createElement('span');
    handSpan.textContent = `Hand #${state.handNumber}`;

    const blindSpan = document.createElement('span');
    blindSpan.textContent = `Blinds ${state.smallBlind}/${state.bigBlind}`;

    const phaseSpan = document.createElement('span');
    phaseSpan.textContent = this.getPhaseLabel(state.phase);

    this.headerInfo.append(handSpan, blindSpan, phaseSpan);
  }

  private getPhaseLabel(phase: string): string {
    switch (phase) {
      case 'waiting': return '\ub300\uae30 \uc911';
      case 'preflop': return '\ud504\ub9ac\ud50c\ub86d';
      case 'flop': return '\ud50c\ub86d';
      case 'turn': return '\ud134';
      case 'river': return '\ub9ac\ubc84';
      case 'showdown': return '\uc1fc\ub2e4\uc6b4';
      case 'hand_complete': return '\ud578\ub4dc \uc644\ub8cc';
      default: return phase;
    }
  }
}
