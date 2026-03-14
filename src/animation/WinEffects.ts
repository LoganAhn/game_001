import { animationManager } from './AnimationManager';

/**
 * 승리 시각 효과 — 파티클 + 핸드명 팝업
 */

/** 핸드명 팝업 — 스케일업 + 페이드 */
export async function showHandPopup(
  container: HTMLElement,
  handDescription: string,
  winnerName: string,
  amount: number,
): Promise<void> {
  const popup = document.createElement('div');
  popup.style.cssText = `
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    z-index: 200;
    text-align: center;
    pointer-events: none;
  `;

  const handText = document.createElement('div');
  handText.textContent = handDescription;
  handText.style.cssText = `
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 900;
    color: #f0d060;
    text-shadow: 0 0 30px rgba(240, 208, 96, 0.5), 0 2px 4px rgba(0,0,0,0.5);
    white-space: nowrap;
  `;

  const winnerText = document.createElement('div');
  winnerText.textContent = `${winnerName} +${amount.toLocaleString()}`;
  winnerText.style.cssText = `
    font-family: 'DM Sans', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #e8e4dc;
    margin-top: 8px;
    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
  `;

  popup.append(handText, winnerText);
  container.appendChild(popup);

  // Scale in
  await animationManager.animate(popup, [
    { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
    { transform: 'translate(-50%, -50%) scale(1.1)', opacity: 1, offset: 0.6 },
    { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
  ], {
    duration: 500,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    fill: 'forwards',
  });

  // Hold
  await animationManager.delay(1500);

  // Fade out
  await animationManager.animate(popup, [
    { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
    { transform: 'translate(-50%, -50%) scale(0.8) translateY(-20px)', opacity: 0 },
  ], {
    duration: 400,
    easing: 'ease-in',
    fill: 'forwards',
  });

  popup.remove();
}

/** 파티클 이펙트 — 승자 주변에 빛나는 입자 */
export async function showWinParticles(container: HTMLElement): Promise<void> {
  const particles: HTMLElement[] = [];
  const count = 20;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = 4 + Math.random() * 6;
    const angle = (Math.PI * 2 * i) / count;
    const distance = 60 + Math.random() * 80;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    p.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${Math.random() > 0.5 ? '#f0d060' : '#ffeaa7'};
      box-shadow: 0 0 ${size * 2}px ${Math.random() > 0.5 ? 'rgba(240,208,96,0.6)' : 'rgba(255,234,167,0.6)'};
      pointer-events: none;
      z-index: 199;
    `;

    container.appendChild(p);
    particles.push(p);

    // Animate each particle
    p.animate([
      { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
      { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1)`, opacity: 0.8, offset: 0.4 },
      { transform: `translate(calc(-50% + ${tx * 1.3}px), calc(-50% + ${ty * 1.3 + 30}px)) scale(0)`, opacity: 0 },
    ], {
      duration: 800 + Math.random() * 400,
      easing: 'cubic-bezier(0, 0.5, 0.5, 1)',
      delay: Math.random() * 200,
      fill: 'forwards',
    });
  }

  await animationManager.delay(1200);

  for (const p of particles) {
    p.remove();
  }
}

/** 큰 승리 효과 (올인 승, 탈락시킴) */
export async function showBigWinEffect(
  container: HTMLElement,
  handDescription: string,
  winnerName: string,
  amount: number,
): Promise<void> {
  // 파티클 + 팝업 동시 실행
  await Promise.all([
    showWinParticles(container),
    showHandPopup(container, handDescription, winnerName, amount),
  ]);
}
