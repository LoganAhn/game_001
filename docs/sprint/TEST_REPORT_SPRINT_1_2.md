# 테스트 리포트 — Sprint 1 & 2

**실행 일시**: 2026-03-14
**프레임워크**: Vitest 4.1.0
**결과**: ✅ 69/69 통과 (0 실패)
**실행 시간**: 289ms

---

## 테스트 요약

| 테스트 파일 | 테스트 수 | 결과 |
|------------|----------|------|
| Card.test.ts | 8 | ✅ 통과 |
| Deck.test.ts | 8 | ✅ 통과 |
| HandEvaluator.test.ts | 16 | ✅ 통과 |
| Pot.test.ts | 11 | ✅ 통과 |
| BettingAction.test.ts | 14 | ✅ 통과 |
| GameEngine.test.ts | 7 | ✅ 통과 |
| **합계** | **69** | **✅ 전체 통과** |

---

## Sprint 1 테스트 상세

### Card.test.ts (8 tests)
| 테스트 | 검증 내용 |
|--------|----------|
| cardToString — 에이스 스페이드 | `A♠` 변환 |
| cardToString — 10 하트 | `10♥` 변환 |
| cardToString — 2 클럽 | `2♣` 변환 |
| isRedSuit — Hearts | 빨강 판별 |
| isRedSuit — Diamonds | 빨강 판별 |
| isRedSuit — Spades | 검정 판별 |
| isRedSuit — Clubs | 검정 판별 |
| 상수 매핑 | 4 수트 심볼, 13 랭크 라벨 |

### Deck.test.ts (8 tests)
| 테스트 | 검증 내용 |
|--------|----------|
| 52장 초기화 | remaining = 52 |
| deal() | 1장 딜, remaining 감소 |
| dealMultiple() | N장 딜 |
| 덱 소진 시 에러 | 52장 후 throw |
| 셔플 후 카드 수 보존 | remaining = 52 |
| 셔플 후 순서 변경 | 순서 비교 (확률적) |
| reset() 복원 | 딜 후 리셋 시 52장 |
| 카드 고유성 | 52장 모두 다름 |

### HandEvaluator.test.ts (16 tests)
| 테스트 | 검증 내용 |
|--------|----------|
| Royal Flush 판별 | A♠K♠Q♠J♠10♠ |
| Straight Flush 판별 | 9-high |
| Straight Flush — Wheel | A-2-3-4-5 동일 수트 |
| Four of a Kind | KKKK + 키커 |
| Full House | JJJ + 44 |
| Flush | 같은 수트 5장 |
| Straight | 8-7-6-5-4 |
| Straight — Wheel | A-2-3-4-5 |
| Three of a Kind | 999 + 키커 |
| Two Pair | AA + 66 + 키커 |
| One Pair | QQ + 키커 |
| High Card | A-high |
| 7장→Royal Flush 탐색 | 7장 중 최적 조합 선택 |
| 7장→Full House 탐색 | AAA + KK 선택 |
| C(7,5) = 21 조합 | 조합 수 검증 |
| 핸드 비교 — 카테고리 | Royal > Straight Flush |
| 핸드 비교 — 같은 카테고리 | 높은 페어 > 낮은 페어 |
| 핸드 비교 — 키커 | 같은 페어, 다른 키커 |
| 핸드 비교 — 동점 | rankValue 동일 시 0 반환 |

---

## Sprint 2 테스트 상세

### Pot.test.ts (11 tests)
| 테스트 | 검증 내용 |
|--------|----------|
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
|--------|----------|
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
|--------|----------|
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

## 커맨드

```bash
npm test        # 전체 테스트 실행 (vitest run)
npm run test:watch  # 워치 모드 (vitest)
npx tsc --noEmit    # 타입 체크
```
