import { animationManager } from './AnimationManager';
import { GAME_CONFIG } from '../utils/Constants';

/**
 * 카드 딜링 애니메이션 — 덱 위치에서 플레이어 위치로 이동
 */
export async function animateDeal(cardElement: HTMLElement): Promise<void> {
  cardElement.style.opacity = '0';
  cardElement.style.transform = 'translate(0, -30px) scale(0.5) rotate(-15deg)';

  await animationManager.animate(cardElement, [
    { opacity: 0, transform: 'translate(0, -30px) scale(0.5) rotate(-15deg)' },
    { opacity: 1, transform: 'translate(0, 0) scale(1) rotate(0deg)' },
  ], {
    duration: GAME_CONFIG.ANIMATION_DEAL_MS,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    fill: 'forwards',
  });

  cardElement.style.opacity = '1';
  cardElement.style.transform = '';
}

/**
 * 카드 딜링 — 여러 장을 stagger로 딜
 */
export async function animateDealMultiple(cards: HTMLElement[]): Promise<void> {
  if (!animationManager.enabled) return;

  for (const card of cards) {
    await animateDeal(card);
    await animationManager.delay(GAME_CONFIG.ANIMATION_DELAY_BETWEEN_CARDS_MS);
  }
}

/**
 * 카드 플립 — 뒷면 → 앞면 3D 회전
 */
export async function animateFlip(cardElement: HTMLElement): Promise<void> {
  // card--flipped 제거로 앞면 표시
  await animationManager.animate(cardElement, [
    { transform: 'rotateY(180deg)' },
    { transform: 'rotateY(0deg)' },
  ], {
    duration: GAME_CONFIG.ANIMATION_FLIP_MS,
    easing: 'ease-in-out',
    fill: 'forwards',
  });

  cardElement.classList.remove('card--flipped');
  cardElement.style.transform = '';
}

/**
 * 커뮤니티 카드 공개 — stagger 플립
 */
export async function animateRevealCommunity(cards: HTMLElement[]): Promise<void> {
  if (!animationManager.enabled) return;

  for (const card of cards) {
    await animateDeal(card);
    await animationManager.delay(80);
  }
}

/**
 * 카드 폴드 — 축소 + 페이드아웃
 */
export async function animateFold(cardElements: HTMLElement[]): Promise<void> {
  if (!animationManager.enabled) return;

  const promises = cardElements.map(el =>
    animationManager.animate(el, [
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(0.7) rotate(5deg)' },
    ], {
      duration: 250,
      easing: 'ease-in',
      fill: 'forwards',
    })
  );

  await Promise.all(promises);
}

/**
 * 승리 카드 하이라이트 — 펄스 효과
 */
export async function animateWinnerCards(cardElements: HTMLElement[]): Promise<void> {
  if (!animationManager.enabled) return;

  const promises = cardElements.map(el =>
    animationManager.animate(el, [
      { transform: 'scale(1)', boxShadow: '0 0 0px rgba(240, 208, 96, 0)' },
      { transform: 'scale(1.08)', boxShadow: '0 0 20px rgba(240, 208, 96, 0.6)' },
      { transform: 'scale(1)', boxShadow: '0 0 10px rgba(240, 208, 96, 0.3)' },
    ], {
      duration: 600,
      easing: 'ease-in-out',
      iterations: 2,
    })
  );

  await Promise.all(promises);
}
