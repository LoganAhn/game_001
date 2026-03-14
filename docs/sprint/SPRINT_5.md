# Sprint 5: AI System

**상태**: ✅ 완료
**기간**: 2일
**브랜치**: `feature/sprint-5` → `develop` 머지 완료
**선행 조건**: Sprint 4 완료

---

## 목표

개성 있는 AI 5명과 대전 가능. 각 AI가 서로 다른 전략과 성격으로 플레이.

---

## 완료된 작업

### 1. AI 성격 프로필 (`src/ai/AIPersonality.ts`)

- [x] `AIPersonality` 인터페이스: tightness, aggression, bluffFrequency, skill (각 0~1)
- [x] 5개 프로필 정의 (playerId 1~5에 매핑):

| 이름 | tightness | aggression | bluffFrequency | skill | 스타일 |
| ---- | --------- | ---------- | -------------- | ----- | ------ |
| Alex | 0.7 | 0.8 | 0.15 | 0.8 | Tight-Aggressive |
| Bella | 0.3 | 0.8 | 0.4 | 0.7 | Loose-Aggressive |
| Charlie | 0.8 | 0.3 | 0.05 | 0.5 | Tight-Passive |
| Diana | 0.3 | 0.3 | 0.1 | 0.4 | Loose-Passive |
| Eddie | 0.5 | 0.6 | 0.2 | 0.9 | Balanced |

### 2. 프리플롭 전략 (`src/ai/PreFlopStrategy.ts`)

- [x] Chen Formula 구현:
  1. 높은 카드 기본 점수: A=10, K=8, Q=7, J=6, 10~2=rank/2
  2. 페어: 기본점수 x 2 (최소 5)
  3. 수티드: +2
  4. 갭 패널티: gap1=-1, gap2=-2, gap3=-4, gap4+=-5
  5. Q 미만이면서 gap 0~1: +1
- [x] tightness 기반 플레이 임계값: `playThreshold = 2 + tightness * 8`
- [x] aggression 기반 레이즈 결정
- [x] bluffFrequency 기반 블러프 레이즈
- [x] skill 기반 노이즈: `(1 - skill) * random(-3, +3)`

### 3. 포스트플롭 전략 (`src/ai/PostFlopStrategy.ts`)

- [x] 핸드 강도 계산 (`HandStrengthCalc.ts`):
  - 카테고리별 기본 점수 (HighCard=0.05 ~ RoyalFlush=1.0)
  - rankValue 내 상대 위치 가중치
  - 0~1 정규화 반환
- [x] 보드 위험도 분석 (`boardDanger()`):
  - 플러시 가능성 (같은 수트 3장+=0.2, 4장+=0.4)
  - 스트레이트 가능성 (연속 3장+=0.15, 4장+=0.3)
  - 페어 보드 (+0.1)
- [x] 팟 오즈 계산: `toCall / (pot + toCall)`
- [x] 의사결정 로직:
  - 강한 핸드(0.7+): 벨류 베팅/레이즈 (aggression 가중)
  - 중간 핸드(0.4~0.7): 팟 오즈 비교, 보드 위험도 고려
  - 약한 핸드(0.4-): 블러프 또는 체크/폴드
- [x] 베팅 사이징: 팟 비율 기반 (0.33~1.0, aggression에 따라)

### 4. AI 컨트롤러 (`src/ai/AIController.ts`)

- [x] `getAIAction()` — GameEngine의 ActionProvider와 연결되는 진입점
- [x] 프리플롭/포스트플롭 자동 분기
- [x] 성격 프로필 자동 로드 (`AI_PROFILES[player.id]`)
- [x] 유효 액션 범위 내 클램핑 (minRaise~maxRaise)
- [x] 폴백: 프로필 없으면 기본 성격 적용

### 5. 테스트 (`src/__tests__/AISystem.test.ts`)

- [x] Chen Formula 6개 테스트 (AA=20, KK=16, 22=5, AKs>AKo, 72o 저점, 순서 무관)
- [x] HandStrength 3개 테스트 (원페어>하이카드, 플러시>스트레이트, 0~1 범위)
- [x] BoardDanger 2개 테스트 (모노톤 위험, 레인보우 안전)
- [x] AIController 2개 테스트 (Alex의 72o fold 경향, 전 프로필 유효 액션)

---

## 완료 기준 달성

- ✅ 5명의 AI가 각기 다른 전략으로 플레이
- ✅ Tight AI(Alex, Charlie)가 적은 핸드 참여
- ✅ Aggressive AI(Alex, Bella)가 높은 레이즈 빈도
- ✅ `npx tsc --noEmit` 타입 체크 통과
- ✅ `npm test` — 82/82 테스트 통과 (+13 AI 테스트)

---

## 산출물

| 파일 | 설명 |
| ---- | ---- |
| `src/ai/AIPersonality.ts` | AI 성격 타입 및 5개 프로필 |
| `src/ai/PreFlopStrategy.ts` | Chen Formula 기반 프리플롭 의사결정 |
| `src/ai/PostFlopStrategy.ts` | 핸드 강도 + 팟 오즈 기반 포스트플롭 의사결정 |
| `src/ai/HandStrengthCalc.ts` | 핸드 강도 0~1 정규화 + 보드 위험도 |
| `src/ai/AIController.ts` | AI 의사결정 디스패처 |
| `src/__tests__/AISystem.test.ts` | AI 시스템 테스트 13개 |

---

## 커밋

- `21a8763` — `feat: Sprint 5 - AI 시스템 구현 (5개 성격 프로필, Chen Formula, 팟 오즈)`
