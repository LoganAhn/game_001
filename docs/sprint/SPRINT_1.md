# Sprint 1: Foundation

**상태**: ✅ 완료
**기간**: 2일
**브랜치**: `feature/sprint-1` → `develop` 머지 완료

---

## 목표

핵심 데이터 구조 및 알고리즘 구현. 콘솔에서 핸드 평가가 올바르게 동작하는지 확인.

---

## 완료된 작업

### 1. 프로젝트 셋업
- [x] Vite 6 + TypeScript (strict mode) 프로젝트 초기화
- [x] `tsconfig.json` — `noUncheckedIndexedAccess` 포함 strict 설정
- [x] `index.html` — SPA 엔트리, SVG 파비콘(♠)
- [x] `.gitignore` — node_modules, dist, .vite, .claude 등

### 2. Card 시스템 (`src/core/Card.ts`)
- [x] `Suit` enum: Spades(0), Hearts(1), Diamonds(2), Clubs(3)
- [x] `Rank` enum: Two(2) ~ Ace(14)
- [x] `Card` interface: `{ suit, rank }`
- [x] `SUIT_SYMBOLS` — ♠♥♦♣ 매핑
- [x] `RANK_LABELS` — 2~A 문자열 매핑
- [x] `cardToString()`, `isRedSuit()` 유틸리티

### 3. Deck (`src/core/Deck.ts`)
- [x] 52장 카드 생성 (`reset()`)
- [x] Fisher-Yates 셔플 알고리즘 (`shuffle()`)
- [x] `deal()`, `dealMultiple()` — 덱 소진 시 에러 throw
- [x] `remaining` getter

### 4. HandRank (`src/core/HandRank.ts`)
- [x] `HandCategory` enum: HighCard(0) ~ RoyalFlush(9)
- [x] `HAND_CATEGORY_NAMES` — 카테고리별 영문 이름
- [x] `HandResult` interface: `{ category, rankValue, bestFive, description }`

### 5. HandEvaluator (`src/core/HandEvaluator.ts`)
- [x] `evaluate(holeCards, communityCards)` — 7장에서 C(7,5)=21 조합 생성, 최적 5장 선택
- [x] `evaluateFive(cards)` — 5장 핸드 판별 (Royal Flush ~ High Card)
- [x] `compare(a, b)` — rankValue 단일 비교로 O(1) 승패 결정
- [x] rankValue 인코딩: `category × 10^10 + rank components (positional weight)`
- [x] Wheel(A-2-3-4-5) 스트레이트 처리

### 6. Player (`src/core/Player.ts`)
- [x] `Player` interface: id, name, chips, holeCards, currentBet, totalBetThisRound, folded, isAllIn, isAI, isEliminated, seatIndex
- [x] `createPlayer()` 팩토리 함수
- [x] `resetPlayerForNewHand()` — 핸드 간 상태 초기화

### 7. GameState (`src/core/GameState.ts`)
- [x] `GamePhase` 타입: waiting → preflop → flop → turn → river → showdown → hand_complete
- [x] `SidePot` interface: `{ amount, eligiblePlayerIds }`
- [x] `GameState` interface: 전체 게임 상태 (players, communityCards, pots, blinds, phase 등)
- [x] `getSmallBlindIndex()`, `getBigBlindIndex()` — 2인/다인 테이블 대응

### 8. EventBus (`src/utils/EventBus.ts`)
- [x] `GameEvent` discriminated union 타입 (14개 이벤트)
- [x] `on(eventType, callback)` — 특정 이벤트 구독, 해제 함수 반환
- [x] `onAll(callback)` — 전체 이벤트 구독
- [x] `emit(event)` — 이벤트 발행

### 9. Constants (`src/utils/Constants.ts`)
- [x] `GAME_CONFIG` — 플레이어 수(6), 시작 칩(10000), 블라인드(50/100), 증가 간격/배율, AI 딜레이, 애니메이션 타이밍

---

## 완료 기준 달성

- ✅ `npm run dev`로 개발 서버 실행
- ✅ 브라우저 콘솔(F12)에서 5회 핸드 평가 결과 출력 확인
- ✅ `npx tsc --noEmit` 타입 체크 통과

---

## 산출물

| 파일 | 설명 |
|------|------|
| `src/core/Card.ts` | 카드 타입 및 유틸리티 |
| `src/core/Deck.ts` | 덱 관리 (셔플, 딜) |
| `src/core/HandRank.ts` | 핸드 카테고리 및 결과 타입 |
| `src/core/HandEvaluator.ts` | 핸드 평가 알고리즘 |
| `src/core/Player.ts` | 플레이어 상태 관리 |
| `src/core/GameState.ts` | 게임 상태 타입 정의 |
| `src/utils/EventBus.ts` | 이벤트 버스 (Pub/Sub) |
| `src/utils/Constants.ts` | 게임 설정 상수 |
| `src/main.ts` | 콘솔 테스트 엔트리포인트 |
| `docs/PROJECT_PLAN.md` | 프로젝트 기획서 |

---

## 커밋

- `9d02847` — `feat: Sprint 1 - 프로젝트 초기 셋업 및 핵심 게임 로직 구현`
- `574df89` — `docs: CLAUDE.md 프로젝트 가이드 및 워크스페이스 설정 추가`
