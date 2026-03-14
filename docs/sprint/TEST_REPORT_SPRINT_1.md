# Test Report — Sprint 1: Foundation

**날짜**: 2026-03-14
**브랜치**: `feature/sprint-1`

---

## 테스트 결과 요약

Sprint 1 시점에는 Vitest가 아직 도입되지 않았으며, `npm run dev` 후 브라우저 콘솔에서 핸드 평가 결과를 수동 검증했습니다.

| 항목 | 결과 |
| ---- | ---- |
| `npx tsc --noEmit` | ✅ 통과 (에러 0) |
| `npm run dev` | ✅ 정상 실행 |
| 콘솔 핸드 평가 | ✅ 5회 핸드 평가 정상 출력 |

---

## 수동 검증 항목

### Card.ts

| 검증 항목 | 결과 |
| --------- | ---- |
| Suit enum (Spades=0, Hearts=1, Diamonds=2, Clubs=3) | ✅ |
| Rank enum (Two=2 ~ Ace=14) | ✅ |
| SUIT_SYMBOLS 매핑 (♠♥♦♣) | ✅ |
| RANK_LABELS 매핑 (2~A) | ✅ |
| cardToString() 출력 | ✅ |
| isRedSuit() 판별 | ✅ |

### Deck.ts

| 검증 항목 | 결과 |
| --------- | ---- |
| 52장 초기화 | ✅ |
| Fisher-Yates 셔플 | ✅ |
| deal() / dealMultiple() | ✅ |
| 덱 소진 시 에러 throw | ✅ |

### HandEvaluator.ts

| 검증 항목 | 결과 |
| --------- | ---- |
| C(7,5) = 21 조합 생성 | ✅ |
| 10개 핸드 카테고리 판별 (Royal Flush ~ High Card) | ✅ |
| Wheel (A-2-3-4-5) 스트레이트 처리 | ✅ |
| rankValue 인코딩 및 비교 | ✅ |

### Player.ts / GameState.ts / EventBus.ts

| 검증 항목 | 결과 |
| --------- | ---- |
| createPlayer() 팩토리 | ✅ |
| resetPlayerForNewHand() | ✅ |
| GamePhase 타입 7단계 | ✅ |
| getSmallBlindIndex() / getBigBlindIndex() | ✅ |
| EventBus on/onAll/emit | ✅ |

---

## 산출물

| 파일 | 설명 |
| ---- | ---- |
| `src/core/Card.ts` | 카드 타입 및 유틸리티 |
| `src/core/Deck.ts` | 덱 관리 (셔플, 딜) |
| `src/core/HandRank.ts` | 핸드 카테고리 및 결과 타입 |
| `src/core/HandEvaluator.ts` | 핸드 평가 알고리즘 |
| `src/core/Player.ts` | 플레이어 상태 관리 |
| `src/core/GameState.ts` | 게임 상태 타입 정의 |
| `src/utils/EventBus.ts` | 이벤트 버스 (Pub/Sub) |
| `src/utils/Constants.ts` | 게임 설정 상수 |

---

## 커밋

- `9d02847` — `feat: Sprint 1 - 프로젝트 초기 셋업 및 핵심 게임 로직 구현`
