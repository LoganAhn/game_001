# Roadmap: Texas Hold'em Poker

## 전체 진행 현황

```text
Sprint 1 ██████████ 100% ✅ Foundation
Sprint 2 ██████████ 100% ✅ Game Engine
Sprint 3 ██████████ 100% ✅ Basic UI
Sprint 4 ██████████ 100% ✅ Interactive Play
Sprint 5 ██████████ 100% ✅ AI System
Sprint 6 ██████████ 100% ✅ Animations
Sprint 7 ██████████ 100% ✅ Sound + Effects
Sprint 8 ██████████ 100% ✅ Polish
```

**전체 프로젝트 완료**

## 스프린트 요약

### Sprint 1: Foundation ✅

- Card, Deck, HandEvaluator, Player, GameState, EventBus 구현
- **커밋**: `9d02847`, `574df89`

### Sprint 2: Game Engine ✅

- GameEngine(async 상태 머신), BettingAction, BettingRound, PotManager
- Vitest 도입, 69개 단위 테스트
- **커밋**: `f68dbd4`

### Sprint 3: Basic UI ✅

- 카지노 럭셔리 테마 CSS, 타원형 테이블, CSS 카드, 6인 좌석
- Renderer 통합 + 시작 화면
- **커밋**: `fc10ccc`

### Sprint 4: Interactive Play ✅

- BettingControls (Fold/Check/Call/Raise + 슬라이더 + 프리셋)
- Promise 기반 인간 턴 입력 대기, Human/AI ActionProvider 분리
- **커밋**: `55ff3bf`

### Sprint 5: AI System ✅

- 5개 성격 프로필 (TAG, LAG, TP, LP, Balanced)
- Chen Formula(프리플롭), 핸드 강도+팟 오즈+보드 위험도(포스트플롭)
- 82개 테스트 (+13 AI)
- **커밋**: `21a8763`

### Sprint 6: Animations ✅

- AnimationManager (큐 + 속도 제어)
- 카드 딜링/플립/폴드, 칩 이동, 승리 펄스 (Web Animations API)
- **커밋**: `e3d0add`

### Sprint 7: Sound + Effects ✅

- SoundManager (Web Audio API), 7종 합성 효과음
- 승리 파티클 + 핸드명 팝업
- **커밋**: `9a988e2`

### Sprint 8: Polish ✅

- 반응형 디자인 (데스크탑/태블릿/모바일)
- 설정 메뉴, 게임 종료 화면, 핸드 랭킹 도움말
- **커밋**: `88bf78f`

## CI/CD

- **GitHub Actions CI**: 타입체크 → 테스트(커버리지) → 빌드 (push/PR to main/develop)
- **GitHub Actions Deploy**: main 푸시 시 GitHub Pages 자동 배포
- **배포 URL**: <https://loganahn.github.io/game_001/>

## 최종 빌드

```text
dist/index.html                  0.56 kB │ gzip:  0.39 kB
dist/assets/index-Gd6L-im8.css  17.39 kB │ gzip:  4.25 kB
dist/assets/index-D2Y0kqlm.js   46.12 kB │ gzip: 13.53 kB
총 gzip: 18.17 kB
```

## 테스트

- **단위 테스트**: Vitest 82개 전체 통과 (7 파일)
- **커버리지**: `npm run test:coverage`로 생성
- **수동 검증**: UI, 애니메이션, 사운드 — 브라우저에서 확인

## 의존성 그래프

```text
Sprint 1 (Foundation)
    ↓
Sprint 2 (Game Engine) ──→ Sprint 5 (AI System)
    ↓
Sprint 3 (Basic UI) ──────→ Sprint 6 (Animations)
    ↓                            ↓
Sprint 4 (Interactive Play) → Sprint 7 (Sound)
                                  ↓
                             Sprint 8 (Polish)
```
