# Sprint 5: AI System

**상태**: 📋 대기
**예상 기간**: 2일
**브랜치**: `feature/sprint-5`
**선행 조건**: Sprint 4 완료

---

## 목표

개성 있는 AI 5명과 대전 가능. 각 AI가 서로 다른 전략과 성격으로 플레이.

---

## 작업 항목

### 1. AI 성격 프로필 (`src/ai/AIPersonality.ts`)
- [ ] `AIPersonality` 인터페이스:
  - `tightness` (0~1): 높을수록 적은 핸드만 플레이
  - `aggression` (0~1): 높을수록 레이즈 선호
  - `bluffFrequency` (0~1): 블러핑 확률
  - `skill` (0~1): 판단 정확도 (낮으면 랜덤성 증가)
- [ ] 5개 프로필 정의:

| 이름 | tightness | aggression | bluffFrequency | skill |
|------|-----------|------------|----------------|-------|
| Alex | 0.7 | 0.8 | 0.15 | 0.8 |
| Bella | 0.3 | 0.8 | 0.4 | 0.7 |
| Charlie | 0.8 | 0.3 | 0.05 | 0.5 |
| Diana | 0.3 | 0.3 | 0.1 | 0.4 |
| Eddie | 0.5 | 0.6 | 0.2 | 0.9 |

### 2. 프리플롭 전략 (`src/ai/PreFlopStrategy.ts`)
- [ ] Chen Formula 구현:
  1. 높은 카드 기본 점수: A=10, K=8, Q=7, J=6, 10~2=rank/2
  2. 페어: 기본점수 × 2 (최소 5)
  3. 수티드: +2
  4. 갭 패널티: gap1=-1, gap2=-2, gap3=-4, gap4+=-5
  5. Q 미만이면서 gap 0~1: +1
- [ ] Chen 점수 → 플레이 여부 결정 (tightness 기반 임계값)
- [ ] 레이즈/콜 결정 (aggression 기반)
- [ ] 블러프 레이즈 (bluffFrequency 기반)

### 3. 포스트플롭 전략 (`src/ai/PostFlopStrategy.ts`)
- [ ] 핸드 강도 계산 (`src/ai/HandStrengthCalc.ts`):
  - 현재 핸드 카테고리 기반 점수 (0~1)
  - 보드 텍스처 고려 (페어 보드, 플러시 가능 등)
- [ ] 팟 오즈 계산: call 금액 / (팟 + call 금액)
- [ ] 의사결정:
  - 핸드 강도 > 임계값 → bet/raise (aggression 가중)
  - 팟 오즈가 유리 → call
  - 둘 다 아님 → fold (또는 블러프)
- [ ] skill에 따른 노이즈: 낮은 skill → 판단에 랜덤 오차 추가

### 4. AI 컨트롤러 (`src/ai/AIController.ts`)
- [ ] GameEngine과 연결되는 진입점
- [ ] 프리플롭/포스트플롭 분기
- [ ] 성격 프로필 기반 최종 액션 결정
- [ ] 베팅 사이징: 팟 비율 기반 (1/2, 2/3, pot, overbet)
- [ ] 사고 딜레이: `AI_THINK_MIN_MS` ~ `AI_THINK_MAX_MS` 랜덤

---

## AI 성격 설명

| AI | 플레이 스타일 | 특징 |
|----|-------------|------|
| **Alex** | Tight-Aggressive | 좋은 핸드만 플레이, 공격적 베팅. 중상급 |
| **Bella** | Loose-Aggressive | 많은 핸드 참여, 블러핑 빈번. 예측 어려움 |
| **Charlie** | Tight-Passive | 보수적. 강한 핸드가 아니면 콜만 |
| **Diana** | Loose-Passive | 많은 핸드를 콜, 레이즈는 드묾. 초보 스타일 |
| **Eddie** | Balanced | 균형 잡힌 전략, 상황 적응. 가장 강함 |

---

## 완료 기준

- [ ] 5명의 AI가 각기 다른 전략으로 플레이하는 것이 체감됨
- [ ] Tight AI(Alex, Charlie)가 Loose AI(Bella, Diana)보다 적은 핸드 참여
- [ ] Aggressive AI(Alex, Bella)가 Passive AI(Charlie, Diana)보다 레이즈 빈도 높음
- [ ] Eddie가 장기적으로 가장 높은 승률
- [ ] `npx tsc --noEmit` 타입 체크 통과

---

## 산출물 (예상)

| 파일 | 설명 |
|------|------|
| `src/ai/AIPersonality.ts` | AI 성격 타입 및 5개 프로필 |
| `src/ai/PreFlopStrategy.ts` | Chen Formula 기반 프리플롭 의사결정 |
| `src/ai/PostFlopStrategy.ts` | 핸드 강도 + 팟 오즈 기반 포스트플롭 의사결정 |
| `src/ai/HandStrengthCalc.ts` | 핸드 강도 계산 |
| `src/ai/AIController.ts` | AI 의사결정 디스패처 |
