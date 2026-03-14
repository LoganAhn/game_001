/**
 * 게임 메시지 표시
 */
export function createMessageBar(): HTMLElement {
  const bar = document.createElement('div');
  bar.className = 'message-bar';
  bar.id = 'message-bar';
  bar.setAttribute('role', 'status');
  bar.setAttribute('aria-live', 'polite');
  bar.textContent = 'Texas Hold\'em에 오신 것을 환영합니다';
  return bar;
}

export function updateMessage(bar: HTMLElement, text: string): void {
  bar.textContent = text;
  bar.style.opacity = '1';
}

let fadeTimer: ReturnType<typeof setTimeout> | null = null;

export function showTemporaryMessage(bar: HTMLElement, text: string, durationMs = 3000): void {
  if (fadeTimer) clearTimeout(fadeTimer);
  bar.textContent = text;
  bar.style.opacity = '1';
  fadeTimer = setTimeout(() => {
    bar.style.opacity = '0.5';
  }, durationMs);
}
