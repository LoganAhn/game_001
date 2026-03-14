import { test, expect } from '@playwright/test';

test.describe('Texas Hold\'em Poker', () => {

  test('페이지 로드 — 타이틀과 시작 버튼 표시', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Texas Hold\'em Poker');
    const startBtn = page.locator('.start-btn');
    await expect(startBtn).toBeVisible();
    await expect(startBtn).toHaveText('게임 시작');
  });

  test('게임 시작 — 6인 좌석 및 테이블 렌더링', async ({ page }) => {
    await page.goto('/');
    await page.click('.start-btn');

    // 게임 컨테이너가 표시됨
    const gameContainer = page.locator('.game-container');
    await expect(gameContainer).toBeVisible({ timeout: 5000 });

    // 포커 테이블 렌더링
    await expect(page.locator('.poker-table')).toBeVisible();
    await expect(page.locator('.poker-table-felt')).toBeVisible();

    // 6명의 플레이어 좌석
    const seats = page.locator('.player-seat');
    await expect(seats).toHaveCount(6);

    // 커뮤니티 카드 영역
    await expect(page.locator('.community-area')).toBeVisible();

    // 헤더 정보
    await expect(page.locator('.header-title')).toHaveText('TEXAS HOLD\'EM');
  });

  test('베팅 컨트롤 — 인간 턴에 표시', async ({ page }) => {
    await page.goto('/');
    await page.click('.start-btn');

    // 게임 시작 대기
    await expect(page.locator('.game-container')).toBeVisible({ timeout: 5000 });

    // 베팅 컨트롤이 인간 턴에 표시될 때까지 대기 (최대 30초 — AI 딜레이 포함)
    const bettingControls = page.locator('.betting-controls--visible');
    await expect(bettingControls).toBeVisible({ timeout: 30000 });

    // Fold 또는 Check 버튼 중 하나가 표시됨
    const foldBtn = page.locator('.btn--fold:visible');
    const checkBtn = page.locator('.btn--check:visible');
    const eitherVisible = await foldBtn.isVisible() || await checkBtn.isVisible();
    expect(eitherVisible).toBe(true);
  });

});
