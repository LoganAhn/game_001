# Test Report — Sprint 5: AI System

**날짜**: 2026-03-14
**브랜치**: `feature/sprint-5`

---

## 테스트 결과 요약

| 항목 | 결과 |
| ---- | ---- |
| `npx tsc --noEmit` | ✅ 통과 (에러 0) |
| `npm test` | ✅ 82/82 통과 (7 파일) |
| `npm run build` | ✅ 성공 (JS 35KB, CSS 12KB, gzip 14KB) |

---

## 테스트 파일별 결과

| 파일 | 테스트 수 | 결과 |
| ---- | --------- | ---- |
| Card.test.ts | 8 | ✅ |
| Deck.test.ts | 8 | ✅ |
| HandEvaluator.test.ts | 16 | ✅ |
| Pot.test.ts | 11 | ✅ |
| BettingAction.test.ts | 14 | ✅ |
| GameEngine.test.ts | 12 | ✅ |
| **AISystem.test.ts** | **13** | **✅ (신규)** |

---

## Sprint 5 신규 테스트 상세

### AISystem.test.ts (13 tests)

#### Chen Formula (6 tests)

| 테스트 | 검증 내용 |
| ------ | --------- |
| AA = 20 | 최고 페어 점수 |
| KK = 16 | 킹 페어 점수 |
| 22 = 5 | 최소 페어 점수 (floor 5) |
| AKs > AKo | 수티드 보너스 +2 |
| 72o = 매우 낮은 점수 | 갭 패널티 적용 확인 |
| 카드 순서 무관 | (A,K) = (K,A) |

#### Hand Strength Calculation (3 tests)

| 테스트 | 검증 내용 |
| ------ | --------- |
| 원페어 > 하이카드 | AA 보드 vs AK 보드 |
| 플러시 > 스트레이트 | 카테고리 순서 정확 |
| 0~1 범위 반환 | 정규화 범위 검증 |

#### Board Danger (2 tests)

| 테스트 | 검증 내용 |
| ------ | --------- |
| 모노톤 보드 위험도 높음 | 같은 수트 3장 → danger ≥ 0.2 |
| 레인보우 보드 위험도 낮음 | 다른 수트 3장 → danger < 0.2 |

#### AI Controller (2 tests)

| 테스트 | 검증 내용 |
| ------ | --------- |
| Alex가 72o에 fold/check 경향 | tight(0.7) 프로필, 50회 중 25+회 fold/check |
| 모든 AI 프로필 유효 액션 반환 | 5개 프로필 × AKo, 유효 액션 타입 확인 |

---

## 빌드 산출물

```
dist/index.html                  0.56 kB │ gzip:  0.39 kB
dist/assets/index-CR9HAcMc.css  12.22 kB │ gzip:  3.39 kB
dist/assets/index-DVnL5Slj.js   34.62 kB │ gzip: 10.58 kB
총 gzip: 14.36 kB
```

---

## 누적 테스트 현황

| Sprint | 추가 테스트 | 누적 |
| ------ | ----------- | ---- |
| 1-2 | 69 | 69 |
| 3 | 0 | 69 |
| 4 | 0 | 69 |
| 5 | 13 | 82 |
