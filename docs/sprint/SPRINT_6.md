# Sprint 6: Animations

**상태**: ✅ 완료
**기간**: 1일
**브랜치**: `feature/sprint-6` → `develop` 머지 완료
**선행 조건**: Sprint 4 완료

---

## 목표

모든 게임 액션에 시각적 피드백. 애니메이션이 게임 진행과 동기화.

---

## 완료된 작업

### 1. AnimationManager (`src/animation/AnimationManager.ts`)

- [x] Promise 기반 큐 시스템 (순차 실행)
- [x] `enqueue()` — 큐에 추가 후 순서대로 실행
- [x] `play()` — 즉시 실행 (큐 안 거침)
- [x] `delay(ms)` — speed 반영 대기
- [x] `animate(element, keyframes, options)` — Web Animations API 래퍼
- [x] 속도 설정: slow(1.5x), normal(1x), fast(0.4x)
- [x] `enabled` 토글로 전체 비활성화 가능
- [x] `clear()` — 큐 초기화
- [x] 싱글톤 `animationManager` export

### 2. 카드 애니메이션 (`src/animation/CardAnimations.ts`)

- [x] `animateDeal()` — 이동 + 스케일 + 회전 (ease-out, 200ms)
- [x] `animateDealMultiple()` — stagger 딜레이 (150ms 간격)
- [x] `animateFlip()` — Y축 3D 회전, card--flipped 클래스 제거 (400ms)
- [x] `animateRevealCommunity()` — 커뮤니티 카드 stagger 공개
- [x] `animateFold()` — 축소(0.7x) + 페이드아웃 + 5도 회전 (250ms)
- [x] `animateWinnerCards()` — 골드 글로우 펄스 (600ms, 2회 반복)

### 3. 칩 애니메이션 (`src/animation/ChipAnimations.ts`)

- [x] `animateChipToPot()` — 스케일 바운스 (300ms)
- [x] `animatePotChange()` — 팟 금액 펄스 + 골드 색상 강조
- [x] `animatePotCollect()` — 스케일 확대 후 축소+페이드 (400ms)
- [x] `animateChipCount()` — 깜빡임(100ms) + 스케일 바운스(200ms)

### 4. GameEngine 동기화

- [x] `animationManager.delay()` 로 핸드 간 대기 (main.ts)
- [x] `renderer.animatePotUpdate()` 로 팟 변경 시 펄스
- [x] GPU 가속: transform/opacity 위주 애니메이션

---

## 기술 구현

- **Web Animations API** (`element.animate()`) 사용
- Promise 기반 완료 대기: `animation.finished`
- CSS `transform`과 `opacity` 위주 (GPU 가속)
- `speedMultiplier`로 모든 duration 일괄 조절

---

## 완료 기준 달성

- ✅ 카드 딜링, 플립, 폴드 애니메이션
- ✅ 칩 이동, 팟 변경 애니메이션
- ✅ 승리 카드 하이라이트
- ✅ 속도 조절 (slow/normal/fast)
- ✅ `npx tsc --noEmit` 타입 체크 통과
- ✅ `npm test` — 82/82 테스트 유지

---

## 산출물

| 파일 | 설명 |
| ---- | ---- |
| `src/animation/AnimationManager.ts` | 애니메이션 큐 + 속도 제어 |
| `src/animation/CardAnimations.ts` | 카드 딜링/플립/폴드/승리 |
| `src/animation/ChipAnimations.ts` | 칩→팟, 팟 펄스, 팟 수집, 칩카운트 |

---

## 커밋

- `e3d0add` — `feat: Sprint 6 - 애니메이션 시스템 (카드 딜링/플립, 칩 이동, 승리 효과)`
