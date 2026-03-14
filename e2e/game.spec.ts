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

  test('설정 메뉴 — 설정 버튼 클릭 시 메뉴 표시, 볼륨 슬라이더 존재', async ({ page }) => {
    await page.goto('/');
    await page.click('.start-btn');

    // 게임 시작 대기
    await expect(page.locator('.game-container')).toBeVisible({ timeout: 5000 });

    // 설정 토글 버튼 클릭
    const settingsToggle = page.locator('.settings-toggle');
    await expect(settingsToggle).toBeVisible();
    await settingsToggle.click();

    // 설정 패널이 열림
    const settingsPanel = page.locator('.settings-panel--open');
    await expect(settingsPanel).toBeVisible();

    // 볼륨 슬라이더(input[type="range"]) 존재
    const volumeSlider = settingsPanel.locator('input[type="range"]');
    await expect(volumeSlider).toBeVisible();
  });

  test('핸드 랭킹 도움말 — 도움말 버튼 클릭 시 팝업 표시', async ({ page }) => {
    await page.goto('/');
    await page.click('.start-btn');

    // 게임 시작 대기
    await expect(page.locator('.game-container')).toBeVisible({ timeout: 5000 });

    // 도움말 토글 버튼 클릭
    const helpToggle = page.locator('.help-toggle');
    await expect(helpToggle).toBeVisible();
    await helpToggle.click();

    // 도움말 패널이 열림
    const helpPanel = page.locator('.help-panel--open');
    await expect(helpPanel).toBeVisible();

    // 핸드 랭킹 행이 표시됨
    const rankRows = helpPanel.locator('.help-rank-row');
    expect(await rankRows.count()).toBeGreaterThan(0);
  });

  test('Fold 액션 — 인간 턴에 Fold 버튼 클릭 시 베팅 컨트롤 사라짐', async ({ page }) => {
    await page.goto('/');
    await page.click('.start-btn');

    // 게임 시작 대기
    await expect(page.locator('.game-container')).toBeVisible({ timeout: 5000 });

    // 베팅 컨트롤이 인간 턴에 표시될 때까지 대기
    const bettingControls = page.locator('.betting-controls--visible');
    await expect(bettingControls).toBeVisible({ timeout: 30000 });

    // Fold 버튼 클릭
    const foldBtn = page.locator('.btn--fold');
    await expect(foldBtn).toBeVisible();
    await foldBtn.click();

    // 베팅 컨트롤이 사라짐
    await expect(bettingControls).not.toBeVisible({ timeout: 5000 });
  });

  test('반응형 — 모바일 뷰포트(375x667)에서 테이블 표시', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 },
    });
    const page = await context.newPage();

    await page.goto('/');
    await page.click('.start-btn');

    // 게임 시작 대기
    await expect(page.locator('.game-container')).toBeVisible({ timeout: 5000 });

    // 포커 테이블이 뷰포트 내에 표시됨
    const table = page.locator('.poker-table');
    await expect(table).toBeVisible();

    // 테이블이 뷰포트 너비를 초과하지 않음
    const tableBox = await table.boundingBox();
    expect(tableBox).not.toBeNull();
    expect(tableBox!.width).toBeLessThanOrEqual(375);

    // 6명의 플레이어 좌석이 여전히 렌더링됨
    const seats = page.locator('.player-seat');
    await expect(seats).toHaveCount(6);

    await context.close();
  });

});
