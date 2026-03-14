# Roadmap: Texas Hold'em Poker

## 전체 진행 현황

```
Sprint 1 ██████████ 100% ✅ Foundation
Sprint 2 ██████████ 100% ✅ Game Engine
Sprint 3 ██████████ 100% ✅ Basic UI
Sprint 4 ░░░░░░░░░░   0% 🔜 Interactive Play  ← 현재
Sprint 5 ░░░░░░░░░░   0%    AI System
Sprint 6 ░░░░░░░░░░   0%    Animations
Sprint 7 ░░░░░░░░░░   0%    Sound + Effects
Sprint 8 ░░░░░░░░░░   0%    Polish + E2E
```

## 스프린트 요약

### Sprint 1: Foundation ✅
**목표**: 핵심 데이터 구조 및 알고리즘
- Card, Deck, HandEvaluator, Player, GameState, EventBus 구현
- 콘솔에서 핸드 평가 동작 확인
- **커밋**: `9d02847`, `574df89`

### Sprint 2: Game Engine ✅
**목표**: 전체 게임 로직 완성
- GameEngine(async 상태 머신), BettingAction, BettingRound, PotManager 구현
- Vitest 도입, 69개 단위 테스트 작성 및 통과
- 더미 AI로 콘솔 자동 게임 데모
- **커밋**: `f68dbd4`

### Sprint 3: Basic UI ✅
**목표**: 시각적 게임 테이블 완성
- 카지노 럭셔리 테마 CSS (Playfair Display, 골드 악센트)
- 타원형 그린 펠트 테이블, CSS 전용 카드 렌더링
- 6인 좌석 배치, 커뮤니티 카드, 팟/메시지 표시
- Renderer 통합 + 시작 화면
- **커밋**: `35f0ced`

### Sprint 4: Interactive Play (다음)
**목표**: 인간이 실제로 게임을 플레이
- 베팅 컨트롤 (Fold/Check/Call/Raise + 슬라이더)
- 인간 턴 Promise 기반 입력 대기
- 프리셋 버튼 (1/2 Pot, 3/4 Pot, Pot, All-In)
- **상세**: [docs/sprint/SPRINT_4.md](sprint/SPRINT_4.md)

### Sprint 5: AI System
**목표**: 개성 있는 AI 5명과 대전
- AIPersonality 타입 + 5개 프로필
- Chen Formula (프리플롭), 핸드 강도 + 팟 오즈 (포스트플롭)
- 성격 파라미터 기반 의사결정
- **상세**: [docs/sprint/SPRINT_5.md](sprint/SPRINT_5.md)

### Sprint 6: Animations
**목표**: 모든 게임 액션에 시각적 피드백
- AnimationManager (큐 + 오케스트레이션)
- 카드 딜링/플립, 칩 이동 애니메이션
- Web Animations API, GameEngine과 동기화
- **상세**: [docs/sprint/SPRINT_6.md](sprint/SPRINT_6.md)

### Sprint 7: Sound + Effects
**목표**: 청각적 피드백 및 승리 연출
- SoundManager (Web Audio API), 이벤트별 효과음
- 승리 파티클 + 핸드명 표시
- **상세**: [docs/sprint/SPRINT_7.md](sprint/SPRINT_7.md)

### Sprint 8: Polish + E2E
**목표**: 완성도 높은 최종 제품
- 반응형 디자인 (모바일/태블릿)
- Playwright E2E 테스트
- 설정 메뉴, 버그 수정, 밸런스 조정
- **상세**: [docs/sprint/SPRINT_8.md](sprint/SPRINT_8.md)

## 기술 부채 & 개선 사항

| 항목 | 우선순위 | 관련 스프린트 |
|------|----------|--------------|
| Playwright E2E 테스트 도입 | 높음 | Sprint 8 |
| CLAUDE.md에 미구현 모듈 기술됨 | 중간 | 문서 정비 |
| Sprint 2~3 문서에 완료 상태 미반영 | 중간 | 문서 정비 |
| 더미 AI → 진짜 AI 전환 | 높음 | Sprint 5 |
| 인간 플레이어 입력 UI | 높음 | Sprint 4 |

## 의존성 그래프

```
Sprint 1 (Foundation)
    ↓
Sprint 2 (Game Engine) ──→ Sprint 5 (AI System)
    ↓
Sprint 3 (Basic UI) ──────→ Sprint 6 (Animations)
    ↓                            ↓
Sprint 4 (Interactive Play) → Sprint 7 (Sound)
                                  ↓
                             Sprint 8 (Polish + E2E)
```
