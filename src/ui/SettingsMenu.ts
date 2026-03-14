import { soundManager } from '../sound/SoundManager';
import { animationManager } from '../animation/AnimationManager';

/**
 * 설정 메뉴 — 사운드/애니메이션 조절
 */
export class SettingsMenu {
  private toggle: HTMLButtonElement;
  private panel: HTMLElement;
  private isOpen = false;

  constructor(parent: HTMLElement) {
    // Toggle button
    this.toggle = document.createElement('button');
    this.toggle.className = 'settings-toggle';
    this.toggle.textContent = '\u2699';
    this.toggle.title = '\uc124\uc815';
    this.toggle.setAttribute('aria-expanded', 'false');
    this.toggle.setAttribute('aria-controls', 'settings-panel');
    this.toggle.addEventListener('click', () => this.togglePanel());

    // Panel
    this.panel = document.createElement('div');
    this.panel.className = 'settings-panel';
    this.panel.id = 'settings-panel';
    this.panel.setAttribute('role', 'dialog');
    this.panel.setAttribute('aria-label', '설정');

    // Sound toggle
    this.panel.appendChild(this.createToggleRow(
      '\uc0ac\uc6b4\ub4dc', !soundManager.muted, (on) => { soundManager.muted = !on; }
    ));

    // Volume slider
    this.panel.appendChild(this.createSliderRow(
      '\ubcfc\ub968', soundManager.volume, (v) => { soundManager.volume = v; }
    ));

    // Animation speed
    this.panel.appendChild(this.createSelectRow(
      '\uc560\ub2c8\uba54\uc774\uc158', 'normal',
      [
        { value: 'slow', label: '\ub290\ub9ac\uac8c' },
        { value: 'normal', label: '\ubcf4\ud1b5' },
        { value: 'fast', label: '\ube60\ub974\uac8c' },
      ],
      (v) => { animationManager.speed = v as 'slow' | 'normal' | 'fast'; }
    ));

    parent.append(this.toggle, this.panel);

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.toggle.contains(e.target as Node) && !this.panel.contains(e.target as Node)) {
        this.closePanel();
      }
    });
  }

  private togglePanel(): void {
    this.isOpen = !this.isOpen;
    this.panel.classList.toggle('settings-panel--open', this.isOpen);
    this.toggle.setAttribute('aria-expanded', String(this.isOpen));
  }

  private closePanel(): void {
    this.isOpen = false;
    this.panel.classList.remove('settings-panel--open');
    this.toggle.setAttribute('aria-expanded', 'false');
  }

  private createToggleRow(label: string, initial: boolean, onChange: (on: boolean) => void): HTMLElement {
    const row = document.createElement('div');
    row.className = 'settings-row';

    const labelEl = document.createElement('span');
    labelEl.className = 'settings-label';
    labelEl.textContent = label;

    const btn = document.createElement('button');
    btn.className = `toggle-switch${initial ? ' toggle-switch--on' : ''}`;
    btn.addEventListener('click', () => {
      const isOn = btn.classList.toggle('toggle-switch--on');
      onChange(isOn);
    });

    row.append(labelEl, btn);
    return row;
  }

  private createSliderRow(label: string, initial: number, onChange: (v: number) => void): HTMLElement {
    const row = document.createElement('div');
    row.className = 'settings-row';

    const labelEl = document.createElement('span');
    labelEl.className = 'settings-label';
    labelEl.textContent = label;

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '1';
    slider.step = '0.1';
    slider.value = String(initial);
    slider.addEventListener('input', () => onChange(Number(slider.value)));

    row.append(labelEl, slider);
    return row;
  }

  private createSelectRow(
    label: string,
    initial: string,
    options: { value: string; label: string }[],
    onChange: (v: string) => void,
  ): HTMLElement {
    const row = document.createElement('div');
    row.className = 'settings-row';

    const labelEl = document.createElement('span');
    labelEl.className = 'settings-label';
    labelEl.textContent = label;

    const select = document.createElement('select');
    for (const opt of options) {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      if (opt.value === initial) option.selected = true;
      select.appendChild(option);
    }
    select.addEventListener('change', () => onChange(select.value));

    row.append(labelEl, select);
    return row;
  }
}
