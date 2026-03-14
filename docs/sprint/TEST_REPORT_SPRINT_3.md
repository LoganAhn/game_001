# Test Report — Sprint 3: Basic UI

**날짜**: 2026-03-14
**브랜치**: `feature/sprint-3`

---

## 테스트 결과 요약

| 항목 | 결과 |
| ---- | ---- |
| `npx tsc --noEmit` | ✅ 통과 (에러 0) |
| `npm test` | ✅ 69/69 통과 (6 파일) |
| `npm run build` | ✅ 성공 (JS 26KB, CSS 12KB, gzip 12KB) |

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

---

## Sprint 3 검증 사항

Sprint 3은 UI 모듈로 구성되어 자동화 단위 테스트 대상이 아닙니다.
기존 69개 테스트가 UI 리팩터링 후에도 모두 통과하는 것으로 회귀 없음을 확인합니다.

### 수동 브라우저 검증

| 검증 항목 | 결과 |
| --------- | ---- |
| 포커 테이블 렌더링 (타원형 그린 펠트) | ✅ |
| CSS 카드 렌더링 (앞면: 랭크+수트, 뒷면: 패턴) | ✅ |
| 6인 좌석 배치 (타원형 주변) | ✅ |
| 딜러 버튼(D), SB/BB 마커 표시 | ✅ |
| 커뮤니티 카드 5장 슬롯 | ✅ |
| 팟 금액 표시 (골드 텍스트) | ✅ |
| 메시지 바 표시 | ✅ |
| 시작 화면 → 게임 화면 전환 | ✅ |
| 폴드/탈락 상태 시각화 (흐림 처리) | ✅ |
| 헤더 (핸드 번호, 블라인드, 페이즈) | ✅ |

---

## 빌드 산출물

```
dist/index.html                  0.56 kB │ gzip:  0.39 kB
dist/assets/index-CR9HAcMc.css  12.22 kB │ gzip:  3.39 kB
dist/assets/index-DN261dsI.js   25.55 kB │ gzip:  8.16 kB
총 gzip: 11.94 kB
```

---

## 누적 테스트 현황

| Sprint | 추가 테스트 | 누적 |
| ------ | ----------- | ---- |
| 1-2 | 69 | 69 |
| 3 | 0 (UI, 수동 검증) | 69 |
