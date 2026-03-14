import { animationManager } from './AnimationManager';
import { GAME_CONFIG } from '../utils/Constants';

/**
 * 베팅 칩 애니메이션 — 플레이어 → 팟 중앙
 */
export async function animateChipToPot(
  chipElement: HTMLElement,
): Promise<void> {
  await animationManager.animate(chipElement, [
    { opacity: 1, transform: 'scale(1)' },
    { opacity: 0.8, transform: 'scale(0.8) translateY(-10px)' },
    { opacity: 1, transform: 'scale(1) translateY(0)' },
  ], {
    duration: GAME_CONFIG.ANIMATION_CHIP_MS,
    easing: 'ease-out',
    fill: 'forwards',
  });
}

/**
 * 팟 금액 변경 애니메이션 — 숫자 펄스
 */
export async function animatePotChange(potElement: HTMLElement): Promise<void> {
  await animationManager.animate(potElement, [
    { transform: 'scale(1)' },
    { transform: 'scale(1.15)', color: '#f0d060' },
    { transform: 'scale(1)' },
  ], {
    duration: 300,
    easing: 'ease-out',
  });
}

/**
 * 팟 수집 애니메이션 — 팟 → 승자
 */
export async function animatePotCollect(potElement: HTMLElement): Promise<void> {
  await animationManager.animate(potElement, [
    { transform: 'scale(1)', opacity: 1 },
    { transform: 'scale(1.2)', opacity: 1 },
    { transform: 'scale(0)', opacity: 0 },
  ], {
    duration: 400,
    easing: 'ease-in',
    fill: 'forwards',
  });

  // 리셋
  potElement.style.transform = '';
  potElement.style.opacity = '';
}

/**
 * 칩 카운트 변경 — 숫자 깜빡이며 업데이트
 */
export async function animateChipCount(
  element: HTMLElement,
  newText: string,
): Promise<void> {
  await animationManager.animate(element, [
    { opacity: 1 },
    { opacity: 0.3, transform: 'scale(0.9)' },
  ], {
    duration: 100,
    fill: 'forwards',
  });

  element.textContent = newText;

  await animationManager.animate(element, [
    { opacity: 0.3, transform: 'scale(0.9)' },
    { opacity: 1, transform: 'scale(1.1)' },
    { opacity: 1, transform: 'scale(1)' },
  ], {
    duration: 200,
    fill: 'forwards',
  });

  element.style.transform = '';
  element.style.opacity = '';
}
