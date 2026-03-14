# Test Report — Sprint 2: Game Engine

**날짜**: 2026-03-14
**브랜치**: `feature/sprint-2`
**프레임워크**: Vitest 4.1.0

---

## 테스트 결과 요약

| 항목 | 결과 |
| ---- | ---- |
| `npx tsc --noEmit` | ✅ 통과 (에러 0) |
| `npm test` | ✅ 69/69 통과 (6 파일) |
| `npm run build` | ✅ 성공 |
| 실행 시간 | 289ms |

---

## 테스트 파일별 결과

| 파일 | 테스트 수 | 결과 | Sprint |
| ---- | --------- | ---- | ------ |
| Card.test.ts | 8 | ✅ | 1 |
| Deck.test.ts | 8 | ✅ | 1 |
| HandEvaluator.test.ts | 16 | ✅ | 1 |
| Pot.test.ts | 11 | ✅ | 2 (신규) |
| BettingAction.test.ts | 14 | ✅ | 2 (신규) |
| GameEngine.test.ts | 7 | ✅ | 2 (신규) |

---

## Sprint 2 신규 테스트 상세

### Pot.test.ts (11 tests)

| 테스트 | 검증 내용 |
| ------ | --------- |
| 초기 팟 = 0 | 빈 상태 |
| 기여금 추가 | 총 팟 계산 |
| 기여금 누적 | 같은 플레이어 합산 |
| reset() 초기화 | 팟 0으로 복원 |
| 동일 금액 → 사이드팟 1개 | 300 = 100 × 3 |
| 1명 올인 → 사이드팟 2개 | 메인 150 + 사이드 100 |
| 폴드 기여금 포함 | 폴드한 플레이어 베팅도 팟에 반영 |
| 단일 팟 승자 전액 | 최고 핸드에게 분배 |
| 동점 split pot | 균등 분배 |
| 사이드팟별 다른 승자 | 메인/사이드 각각 분배 |
| 홀수 칩 나머지 처리 | 첫 번째 승자에게 |

### BettingAction.test.ts (14 tests)

| 테스트 | 검증 내용 |
| ------ | --------- |
| 베팅 없을 때 체크 가능 | canCheck = true |
| 베팅 있을 때 콜 가능 | canCall = true, callAmount 계산 |
| 칩 부족 시 올인만 | canCall = false, canAllIn = true |
| 최소 레이즈 계산 | minRaise = currentBet + minimumRaise |
| fold 적용 | folded = true, 칩 불변 |
| check 적용 | 칩 불변 |
| call 적용 | 콜 금액 차감 |
| raise 적용 | 레이즈 금액 차감 |
| allin 적용 | 전 칩 차감, isAllIn = true |
| call→올인 | 칩 = 0이면 isAllIn |
| fold 항상 유효 | validateAction = true |
| check 유효/무효 | 베팅 유무에 따라 |
| 최소 레이즈 미만 무효 | validateAction = false |
| 최소 레이즈 이상 유효 | validateAction = true |

### GameEngine.test.ts (7 tests)

| 테스트 | 검증 내용 |
| ------ | --------- |
| 초기 상태 | 6명, 10000칩, phase=waiting |
| 1핸드 후 handNumber | 1로 증가 |
| 1핸드 후 칩 보존 | 총 60000칩 유지 |
| 5핸드 후 칩 보존 | 총 60000칩 유지 |
| 모두 폴드 시 | 블라인드 수집자 칩 증가 |
| 핸드 완료 후 phase | hand_complete |
| 3핸드 후 생존 | 탈락자 없음 |

---

## 발견 및 수정된 버그

### Bug #1: 폴드 플레이어 기여금 누락

- **위치**: `src/core/Pot.ts` — `calculateSidePots()`
- **증상**: 폴드한 플레이어의 베팅이 사이드팟 계산에서 누락
- **원인**: 기여 레벨 계산 시 폴드 플레이어를 별도 분기로 처리하면서 레벨 간 기여금이 빠짐
- **수정**: 알고리즘 재작성 — 모든 플레이어(폴드 포함)의 기여금을 레벨별로 계산하고, 자격만 비폴드 플레이어로 제한
- **검증**: 테스트 통과 확인

---

## 커밋

- `f68dbd4` — `feat: Sprint 2 - GameEngine, 베팅 시스템, 팟 관리, 테스트 구현`
