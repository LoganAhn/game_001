# Sprint 2: Game Engine

**상태**: ✅ 완료
**기간**: 2일
**브랜치**: `feature/sprint-2` → `develop` → `main` 머지 완료

---

## 목표

전체 게임 로직 완성. 콘솔 로그로 AI끼리 전체 핸드가 자동 진행되는 것을 확인.

---

## 완료된 작업

### 1. Pot 관리 (`src/core/Pot.ts`)
- [x] `PotManager` 클래스
- [x] 메인팟 + 사이드팟 계산
- [x] 사이드팟 알고리즘: 올인 금액 오름차순 정렬 → 레벨별 팟 분리
- [x] 팟 분배: 각 팟별 자격 있는 플레이어 중 최고 핸드에게 분배
- [x] 팟 분할(split pot): 동일 핸드 시 균등 분배

### 2. 베팅 액션 (`src/betting/BettingAction.ts`)
- [x] `BettingAction` 타입 정의 (fold, check, call, raise, allin)
- [x] `getAvailableActions()` — 현재 상황에서 가능한 액션 목록 반환
- [x] 액션 유효성 검증: 최소 레이즈 금액, 콜 금액 계산
- [x] 액션 적용: 플레이어 칩 차감, currentBet 갱신

### 3. 베팅 라운드 (`src/betting/BettingRound.ts`)
- [x] `BettingRound` 클래스
- [x] 베팅 순서 결정: 프리플롭은 BB 다음부터, 포스트플롭은 SB부터
- [x] 라운드 종료 조건: 모든 액티브 플레이어가 동일 베팅이거나 올인/폴드
- [x] 폴드로 1명만 남으면 즉시 핸드 종료
- [x] 올인 플레이어는 추가 베팅 스킵

### 4. GameEngine (`src/core/GameEngine.ts`)
- [x] async 기반 게임 루프 (상태 머신)
- [x] 핸드 플로우: 딜러 이동 → 블라인드 → 딜 → 프리플롭~리버 → 쇼다운 → 팟 분배
- [x] 블라인드 증가: 10핸드마다 1.5배
- [x] 쇼다운: HandEvaluator로 승자 결정, 팟 분배
- [x] 플레이어 탈락 처리: 칩 0 → isEliminated
- [x] 게임 종료 조건: 1명만 남으면 승리

### 5. 테스트 (`src/__tests__/`)
- [x] Vitest 도입 및 설정
- [x] 69개 단위 테스트 작성 및 전체 통과
  - Card.test.ts, Deck.test.ts, HandEvaluator.test.ts
  - Pot.test.ts, BettingAction.test.ts, GameEngine.test.ts

---

## 완료 기준 달성

- ✅ `npm run dev` 실행 후 콘솔에서 AI 6명이 자동으로 핸드 진행
- ✅ 프리플롭 → 플롭 → 턴 → 리버 → 쇼다운 전체 플로우 동작
- ✅ 사이드팟이 올바르게 계산되고 분배됨
- ✅ 블라인드가 10핸드마다 증가
- ✅ 칩이 0인 플레이어가 탈락 처리됨
- ✅ `npx tsc --noEmit` 타입 체크 통과
- ✅ `npm test` — 69/69 테스트 통과
- ✅ `npm run build` — 빌드 성공

---

## 산출물

| 파일 | 설명 |
|------|------|
| `src/core/Pot.ts` | 팟 관리 (메인팟 + 사이드팟) |
| `src/core/GameEngine.ts` | 게임 플로우 상태 머신 |
| `src/betting/BettingAction.ts` | 베팅 액션 타입 및 검증 |
| `src/betting/BettingRound.ts` | 베팅 라운드 진행 로직 |
| `src/__tests__/*.test.ts` | 단위 테스트 6개 파일 |
| `docs/sprint/TEST_REPORT_SPRINT_1_2.md` | 테스트 리포트 |

---

## 커밋

- `f68dbd4` — `feat: Sprint 2 - GameEngine, 베팅 시스템, 팟 관리, 테스트 구현`
