import { AvailableActions } from '../betting/BettingAction';
import { ActionType } from '../core/GameState';

export interface BettingDecision {
  action: ActionType;
  amount: number;
}

/**
 * 베팅 컨트롤 UI — 인간 플레이어 턴에 표시
 * Promise 기반: show()가 호출되면 플레이어의 액션을 기다려서 resolve
 */
export class BettingControls {
  private container: HTMLElement;
  private foldBtn: HTMLButtonElement;
  private checkBtn: HTMLButtonElement;
  private callBtn: HTMLButtonElement;
  private raiseBtn: HTMLButtonElement;
  private allInBtn: HTMLButtonElement;
  private slider: HTMLInputElement;
  private sliderAmount: HTMLElement;
  private presetContainer: HTMLElement;

  private resolveFn: ((decision: BettingDecision) => void) | null = null;
  private currentAvailable: AvailableActions | null = null;

  constructor(parent: HTMLElement) {
    this.container = document.createElement('div');
    this.container.className = 'betting-controls';
    this.container.setAttribute('role', 'group');
    this.container.setAttribute('aria-label', '베팅 컨트롤');
    this.container.setAttribute('aria-hidden', 'true');

    // Fold button
    this.foldBtn = this.createButton('Fold', 'btn--fold');
    this.foldBtn.addEventListener('click', () => this.resolve('fold', 0));

    // Check button
    this.checkBtn = this.createButton('Check', 'btn--check');
    this.checkBtn.addEventListener('click', () => this.resolve('check', 0));

    // Call button
    this.callBtn = this.createButton('Call', 'btn--call');
    this.callBtn.addEventListener('click', () => {
      if (this.currentAvailable) {
        this.resolve('call', this.currentAvailable.callAmount);
      }
    });

    // Raise section
    const raiseSection = document.createElement('div');
    raiseSection.className = 'raise-slider';

    this.slider = document.createElement('input');
    this.slider.type = 'range';
    this.slider.min = '0';
    this.slider.max = '0';
    this.slider.value = '0';
    this.slider.setAttribute('aria-label', '레이즈 금액');
    this.slider.addEventListener('input', () => {
      this.sliderAmount.textContent = Number(this.slider.value).toLocaleString();
    });

    this.sliderAmount = document.createElement('span');
    this.sliderAmount.className = 'raise-amount';
    this.sliderAmount.textContent = '0';
    this.sliderAmount.setAttribute('aria-live', 'polite');

    this.raiseBtn = this.createButton('Raise', 'btn--raise');
    this.raiseBtn.addEventListener('click', () => {
      const amount = Number(this.slider.value);
      this.resolve('raise', amount);
    });

    raiseSection.append(this.slider, this.sliderAmount);

    // All-In button
    this.allInBtn = this.createButton('All In', 'btn--allin');
    this.allInBtn.addEventListener('click', () => {
      if (this.currentAvailable) {
        this.resolve('allin', this.currentAvailable.allInAmount);
      }
    });

    // Preset buttons
    this.presetContainer = document.createElement('div');
    this.presetContainer.className = 'preset-buttons';
    this.presetContainer.style.display = 'flex';
    this.presetContainer.style.gap = '4px';

    this.container.append(
      this.foldBtn,
      this.checkBtn,
      this.callBtn,
      raiseSection,
      this.raiseBtn,
      this.presetContainer,
      this.allInBtn
    );

    parent.appendChild(this.container);
  }

  /**
   * 베팅 컨트롤을 표시하고 플레이어의 액션을 기다림
   */
  show(available: AvailableActions, mainPot: number): Promise<BettingDecision> {
    this.currentAvailable = available;

    // Button states
    this.foldBtn.disabled = false;
    this.foldBtn.style.display = available.canCheck ? 'none' : 'inline-block';

    this.checkBtn.disabled = !available.canCheck;
    this.checkBtn.style.display = available.canCheck ? 'inline-block' : 'none';

    this.callBtn.disabled = !available.canCall;
    this.callBtn.style.display = available.canCall ? 'inline-block' : 'none';
    if (available.canCall) {
      this.callBtn.textContent = `Call ${available.callAmount.toLocaleString()}`;
    }

    // Raise slider
    const canRaise = available.canRaise;
    this.raiseBtn.disabled = !canRaise;
    this.raiseBtn.style.display = canRaise ? 'inline-block' : 'none';
    this.slider.style.display = canRaise ? 'inline-block' : 'none';
    this.sliderAmount.style.display = canRaise ? 'inline-block' : 'none';

    if (canRaise) {
      this.slider.min = String(available.minRaise);
      this.slider.max = String(available.maxRaise);
      this.slider.value = String(available.minRaise);
      this.sliderAmount.textContent = available.minRaise.toLocaleString();
    }

    // Preset buttons
    this.presetContainer.replaceChildren();
    if (canRaise && mainPot > 0) {
      const presets = [
        { label: '1/2', multiplier: 0.5 },
        { label: '3/4', multiplier: 0.75 },
        { label: 'Pot', multiplier: 1 },
      ];
      for (const preset of presets) {
        const potBet = Math.floor(mainPot * preset.multiplier);
        const clampedBet = Math.max(available.minRaise, Math.min(potBet, available.maxRaise));
        const btn = document.createElement('button');
        btn.className = 'btn btn--raise';
        btn.style.padding = '6px 10px';
        btn.style.fontSize = '11px';
        btn.textContent = preset.label;
        btn.addEventListener('click', () => {
          this.slider.value = String(clampedBet);
          this.sliderAmount.textContent = clampedBet.toLocaleString();
        });
        this.presetContainer.appendChild(btn);
      }
    }

    // All-In
    this.allInBtn.disabled = !available.canAllIn;
    if (available.canAllIn) {
      this.allInBtn.textContent = `All In ${available.allInAmount.toLocaleString()}`;
    }

    // Show container
    this.container.classList.add('betting-controls--visible');
    this.container.setAttribute('aria-hidden', 'false');

    return new Promise<BettingDecision>((resolve) => {
      this.resolveFn = resolve;
    });
  }

  /** 컨트롤 숨기기 */
  hide(): void {
    this.container.classList.remove('betting-controls--visible');
    this.container.setAttribute('aria-hidden', 'true');
    this.resolveFn = null;
  }

  private resolve(action: ActionType, amount: number): void {
    if (this.resolveFn) {
      const fn = this.resolveFn;
      this.hide();
      fn({ action, amount });
    }
  }

  private createButton(text: string, className: string): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.className = `btn ${className}`;
    btn.textContent = text;
    return btn;
  }
}
