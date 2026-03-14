# Test Strategy: Texas Hold'em Poker

## 1. 테스트 피라미드

```text
        ┌─────────┐
        │  E2E    │  Playwright (3 시나리오)
        │ (느림)  │  브라우저 전체 플로우
       ─┼─────────┼─
       │ 통합 테스트 │  GameEngine + BettingRound 연동
       │  (중간)    │  ActionProvider 통합
      ─┼───────────┼─
      │   단위 테스트  │  82개 (Vitest)
      │   (빠름)      │  핵심 로직 개별 검증
      └───────────────┘
```

| 계층 | 프레임워크 | 테스트 수 | 실행 시간 |
| ---- | --------- | --------- | --------- |
| 단위 | Vitest | 82개 | ~250ms |
| E2E | Playwright | 3개 | ~10s |

---

## 2. 현재 커버리지

`npm run test:coverage` 실행 결과 (v8 프로바이더):

### 모듈별 커버리지

| 모듈 | Stmts | Branch | Funcs | Lines |
| ---- | ----- | ------ | ----- | ----- |
| **core/** | 87.78% | 73.41% | 95.23% | 89.68% |
| Card.ts | 100% | 100% | 100% | 100% |
| Deck.ts | 100% | 100% | 100% | 100% |
| HandEvaluator.ts | 99.07% | 96.66% | 100% | 100% |
| HandRank.ts | 100% | 100% | 100% | 100% |
| Player.ts | 100% | 100% | 100% | 100% |
| Pot.ts | 92.85% | 78.12% | 100% | 98.21% |
| GameEngine.ts | 76.04% | 40.38% | 87.5% | 78.03% |
| GameState.ts | 66.66% | 50% | 100% | 100% |
| **betting/** | 84.31% | 70.49% | 100% | 85.71% |
| BettingAction.ts | 91.48% | 72% | 100% | 95.45% |
| BettingRound.ts | 78.18% | 69.44% | 100% | 76.59% |
| **ai/** | 50.81% | 38.12% | 76.92% | 54.71% |
| AIPersonality.ts | 100% | 100% | 100% | 100% |
| PreFlopStrategy.ts | 84.09% | 79.48% | 100% | 92.1% |
| HandStrengthCalc.ts | 72.22% | 56.66% | 100% | 79.06% |
| AIController.ts | 30.35% | 25% | 50% | 36.17% |
| PostFlopStrategy.ts | 0% | 0% | 0% | 0% |
| **utils/** | 100% | 100% | 100% | 100% |
| **전체** | **77.94%** | **58.04%** | **93.51%** | **80.28%** |

### 커버리지 분석

- **높은 커버리지**: 핵심 게임 로직 (Card, Deck, HandEvaluator, Player, HandRank) — 100%
- **중간 커버리지**: 베팅 시스템, 팟 관리, 프리플롭 전략 — 78~95%
- **낮은 커버리지**: GameEngine(비동기 통합), AIController(디스패처), PostFlopStrategy — 0~36%
- **미측정**: UI, Animation, Sound 모듈 — 브라우저 전용 API 의존으로 단위 테스트 불가, E2E로 커버

---

## 3. 커버리지 목표

| 모듈 | 현재 Lines | 목표 | 전략 |
| ---- | ---------- | ---- | ---- |
| core/ | 89.68% | 95%+ | GameEngine 엣지케이스 테스트 추가 |
| betting/ | 85.71% | 90%+ | BettingRound 종료 조건 테스트 강화 |
| ai/ | 54.71% | 80%+ | PostFlopStrategy, AIController 테스트 추가 |
| utils/ | 100% | 100% | 유지 |
| UI/Animation/Sound | 0% (수동) | E2E 커버 | Playwright로 통합 검증 |

---

## 4. 단위 테스트 상세

### 테스트 파일별 구성 (82개)

| 파일 | 테스트 수 | 검증 대상 |
| ---- | --------- | --------- |
| Card.test.ts | 8 | 카드 문자열 변환, 수트 색상 판별, 상수 매핑 |
| Deck.test.ts | 8 | 52장 초기화, Fisher-Yates 셔플, 딜, 소진 에러, 리셋 |
| HandEvaluator.test.ts | 18 | 10개 핸드 카테고리 판별, 7장→5장 최적 선택, rankValue 비교, Wheel 스트레이트 |
| Pot.test.ts | 13 | 메인팟, 사이드팟 계산, 분배, split pot, 폴드 기여금, 홀수 칩 |
| BettingAction.test.ts | 14 | 가능 액션 계산, 액션 적용(칩 차감), 유효성 검증, 올인 처리 |
| GameEngine.test.ts | 12 | 초기 상태, 핸드 진행, 칩 보존 원칙, 폴드 처리, 페이즈 전환 |
| AISystem.test.ts | 13 | Chen Formula(AA=20, KK=16, 72o 저점), 핸드 강도 정규화, 보드 위험도, AI 프로필 유효성 |

---

## 5. E2E 테스트 계획 (Playwright)

### 테스트 시나리오

| # | 시나리오 | 검증 항목 |
| --- | -------- | --------- |
| 1 | 페이지 로드 | 타이틀 확인, 시작 버튼 표시 |
| 2 | 게임 시작 | 시작 클릭 → 6인 좌석 렌더링, 커뮤니티 카드 영역 표시 |
| 3 | 베팅 컨트롤 | 인간 턴 대기 → Fold/Call/Raise 버튼 표시 확인 |

### 기술 구성

- 프레임워크: `@playwright/test`
- 브라우저: Chromium (최소), Firefox/WebKit (선택)
- 서버: Vite dev server (`npm run dev`) 자동 시작
- CI 통합: GitHub Actions에서 `npx playwright test` 실행

---

## 6. 수동 테스트 체크리스트

### UI/UX 검증

- [ ] 시작 화면 → 게임 시작 → 핸드 진행 → 게임 오버 전체 플로우
- [ ] Fold/Check/Call/Raise/All-In 모든 베팅 액션
- [ ] 사이드팟 시나리오 (다중 올인)
- [ ] 설정 메뉴 (사운드 on/off, 볼륨, 애니메이션 속도)
- [ ] 핸드 랭킹 도움말 팝업
- [ ] 게임 종료 → 새 게임 재시작

### 애니메이션 검증

- [ ] 카드 딜링 (이동 + 스케일 + 회전)
- [ ] 카드 플립 (3D rotateY)
- [ ] 커뮤니티 카드 stagger 공개
- [ ] 팟 금액 변경 펄스
- [ ] 승리 파티클 + 핸드명 팝업

### 사운드 검증

- [ ] 카드 딜 (화이트 노이즈 + 하이패스)
- [ ] 칩 베팅 (사인파 클릭음)
- [ ] 체크 (노크음)
- [ ] 폴드 (스와이프음)
- [ ] 승리 (상승 멜로디 C5-E5-G5-C6)
- [ ] 올인 (톱니파 + 사인파)
- [ ] 음소거/볼륨 조절 동작

### 크로스 브라우저

- [ ] Chrome 최신
- [ ] Firefox 최신
- [ ] Safari 최신
- [ ] Edge 최신

### 반응형

- [ ] Desktop (1200px+)
- [ ] Tablet (768~1199px)
- [ ] Mobile (767px 이하)

---

## 7. 품질 게이트

### PR 머지 조건

1. `npx tsc --noEmit` — 타입 체크 통과 (에러 0)
2. `npm test` — 전체 단위 테스트 통과 (82+개)
3. `npm run build` — 빌드 성공
4. 커버리지 감소 없음 (이전 커밋 대비)

### 배포 조건 (main 브랜치)

1. 위 PR 조건 전체 충족
2. E2E 테스트 통과 (`npx playwright test`)
3. 번들 크기 50KB 미만 (gzip)

### CI 파이프라인 (`ci.yml`)

```text
1. actions/checkout@v4
2. actions/setup-node@v4 (Node 20, npm cache)
3. npm ci
4. npx tsc --noEmit              ← 타입 체크
5. npx vitest run --coverage     ← 82개 단위 테스트 + 커버리지
6. npm run build                 ← Vite 빌드
7. npx playwright install chromium ← E2E 브라우저 설치
8. npx playwright test           ← 3개 E2E 테스트
9. Upload coverage artifact      ← 30일 보존
10. Upload playwright report     ← 30일 보존
```

### 배포 파이프라인 (`deploy.yml`)

```text
1. actions/checkout@v4
2. actions/setup-node@v4 (Node 20, npm cache)
3. npm ci
4. npx tsc --noEmit              ← 타입 체크
5. npx vitest run                ← 단위 테스트
6. npm run build (BASE_URL=/game_001/) ← 빌드
7. actions/upload-pages-artifact@v3
8. actions/deploy-pages@v4 → https://loganahn.github.io/game_001/
```
