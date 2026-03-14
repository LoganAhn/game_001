/**
 * 핸드 랭킹 참조 팝업 — 10개 핸드 순위 표시
 *
 * 통합: Renderer.initGameUI()에서 생성, 게임 컨테이너에 마운트
 * UI: ? 버튼 → 패널 토글 (aria-expanded, aria-controls)
 * 내용: Royal Flush ~ High Card, 한국어 설명
 */

const HAND_RANKINGS = [
  { name: 'Royal Flush', desc: 'A-K-Q-J-10 \uac19\uc740 \ubb34\ub298' },
  { name: 'Straight Flush', desc: '\uc5f0\uc18d 5\uc7a5 \uac19\uc740 \ubb34\ub298' },
  { name: 'Four of a Kind', desc: '\uac19\uc740 \uc22b\uc790 4\uc7a5' },
  { name: 'Full House', desc: '3\uc7a5 + 2\uc7a5 \uac19\uc740 \uc22b\uc790' },
  { name: 'Flush', desc: '\uac19\uc740 \ubb34\ub291 5\uc7a5' },
  { name: 'Straight', desc: '\uc5f0\uc18d 5\uc7a5' },
  { name: 'Three of a Kind', desc: '\uac19\uc740 \uc22b\uc790 3\uc7a5' },
  { name: 'Two Pair', desc: '\ud398\uc5b4 2\uac1c' },
  { name: 'One Pair', desc: '\uac19\uc740 \uc22b\uc790 2\uc7a5' },
  { name: 'High Card', desc: '\uc704\uc5d0 \ud574\ub2f9 \uc5c6\uc74c' },
];

export class HandRankingHelp {
  private toggle: HTMLButtonElement;
  private panel: HTMLElement;
  private isOpen = false;

  constructor(parent: HTMLElement) {
    this.toggle = document.createElement('button');
    this.toggle.className = 'help-toggle';
    this.toggle.textContent = '?';
    this.toggle.title = '\ud578\ub4dc \ub7ad\ud0b9';
    this.toggle.setAttribute('aria-expanded', 'false');
    this.toggle.setAttribute('aria-controls', 'help-panel');
    this.toggle.addEventListener('click', () => this.togglePanel());

    this.panel = document.createElement('div');
    this.panel.className = 'help-panel';
    this.panel.id = 'help-panel';
    this.panel.setAttribute('role', 'dialog');
    this.panel.setAttribute('aria-label', '핸드 랭킹');

    const heading = document.createElement('h3');
    heading.textContent = 'Hand Rankings';
    this.panel.appendChild(heading);

    for (const hand of HAND_RANKINGS) {
      const row = document.createElement('div');
      row.className = 'help-rank-row';

      const nameEl = document.createElement('span');
      nameEl.className = 'help-rank-name';
      nameEl.textContent = hand.name;

      const descEl = document.createElement('span');
      descEl.className = 'help-rank-desc';
      descEl.textContent = hand.desc;

      row.append(nameEl, descEl);
      this.panel.appendChild(row);
    }

    parent.append(this.toggle, this.panel);

    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.toggle.contains(e.target as Node) && !this.panel.contains(e.target as Node)) {
        this.closePanel();
      }
    });
  }

  private togglePanel(): void {
    this.isOpen = !this.isOpen;
    this.panel.classList.toggle('help-panel--open', this.isOpen);
    this.toggle.setAttribute('aria-expanded', String(this.isOpen));
  }

  private closePanel(): void {
    this.isOpen = false;
    this.panel.classList.remove('help-panel--open');
    this.toggle.setAttribute('aria-expanded', 'false');
  }
}
