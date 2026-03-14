# Sprint 6: Animations

**상태**: 📋 대기
**예상 기간**: 1일
**브랜치**: `feature/sprint-6`
**선행 조건**: Sprint 4 완료

---

## 목표

모든 게임 액션에 시각적 피드백. 애니메이션이 게임 진행과 동기화.

---

## 작업 항목

### 1. AnimationManager (`src/animation/AnimationManager.ts`)
- [ ] 애니메이션 큐 시스템 (순차 실행)
- [ ] Promise 기반 완료 대기 (`await animate(...)`)
- [ ] 애니메이션 속도 설정 (빠르게/보통/느리게)
- [ ] 애니메이션 스킵 기능

### 2. 카드 애니메이션 (`src/animation/CardAnimations.ts`)
- [ ] **카드 딜링**: 덱 위치 → 플레이어 위치로 이동 (200ms)
  - 각 카드 사이 딜레이 (150ms)
  - 인간 카드는 도착 후 플립
- [ ] **카드 플립**: Y축 3D 회전, 뒷면 → 앞면 (400ms)
  - 커뮤니티 카드 공개 시
  - 쇼다운 시 AI 카드 공개
- [ ] **카드 폴드**: 약간 축소 + 페이드아웃

### 3. 칩 애니메이션 (`src/animation/ChipAnimations.ts`)
- [ ] **베팅**: 플레이어 위치 → 팟 중앙 이동 (300ms)
- [ ] **팟 수집**: 팟 중앙 → 승자 위치 이동 (300ms)
- [ ] 칩 금액 텍스트 애니메이션 (증가/감소)

### 4. EventBus 연결
- [ ] GameEvent → 애니메이션 매핑
- [ ] GameEngine이 애니메이션 완료를 `await`한 후 다음 단계 진행
- [ ] 애니메이션과 게임 로직의 동기화 보장

---

## 기술 방식

- **Web Animations API** (`element.animate()`) 사용
- Promise 기반: `animation.finished`로 완료 대기
- CSS `transform`과 `opacity` 위주 (GPU 가속)
- `will-change` 힌트로 성능 최적화

---

## 애니메이션 타이밍

| 애니메이션 | 지속시간 | 이징 |
|-----------|---------|------|
| 카드 딜링 | 200ms | ease-out |
| 카드 간 딜레이 | 150ms | — |
| 카드 플립 | 400ms | ease-in-out |
| 칩 베팅 | 300ms | ease-out |
| 팟 수집 | 300ms | ease-in |

---

## 완료 기준

- [ ] 카드가 딜링될 때 덱에서 플레이어 방향으로 이동하는 애니메이션
- [ ] 커뮤니티 카드가 뒤집히는 3D 플립 애니메이션
- [ ] 베팅 시 칩이 팟으로 이동하는 애니메이션
- [ ] 승리 시 팟이 승자에게 이동하는 애니메이션
- [ ] 애니메이션이 끝난 후에 다음 게임 단계로 진행
- [ ] `npx tsc --noEmit` 타입 체크 통과

---

## 산출물 (예상)

| 파일 | 설명 |
|------|------|
| `src/animation/AnimationManager.ts` | 애니메이션 큐 + 오케스트레이션 |
| `src/animation/CardAnimations.ts` | 카드 딜링/플립/폴드 애니메이션 |
| `src/animation/ChipAnimations.ts` | 칩 이동 애니메이션 |
