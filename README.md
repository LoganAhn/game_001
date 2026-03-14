# ♠ Texas Hold'em Poker

[![CI](https://github.com/LoganAhn/game_001/actions/workflows/ci.yml/badge.svg)](https://github.com/LoganAhn/game_001/actions/workflows/ci.yml)
[![Deploy](https://github.com/LoganAhn/game_001/actions/workflows/deploy.yml/badge.svg)](https://github.com/LoganAhn/game_001/actions/workflows/deploy.yml)

웹 브라우저에서 바로 플레이할 수 있는 **싱글플레이어 노리밋 텍사스 홀덤** 포커 게임.
1명의 인간 플레이어가 개성 있는 AI 5명과 대결합니다.

> **[Play Now](https://loganahn.github.io/game_001/)** — 설치 없이 브라우저에서 즉시 플레이

**테스트**: 82개 단위 테스트 + 3개 E2E 테스트 | **커버리지**: Stmts 78% / Lines 80% / Funcs 94% | **빌드**: gzip 18KB

---

## 주요 특징

- **완전한 포커 규칙** — 핸드 랭킹, 사이드팟, 블라인드 증가, 올인 등 모든 규칙 구현
- **5명의 개성 있는 AI** — Tight-Aggressive, Loose-Aggressive, Tight-Passive, Loose-Passive, Balanced 각기 다른 전략
- **카지노 럭셔리 UI** — CSS 전용 카드 렌더링, 타원형 그린 펠트 테이블, 골드 악센트
- **애니메이션 & 사운드** — Web Animations API + Web Audio API로 구현, 외부 파일 없음
- **반응형 디자인** — 데스크탑, 태블릿, 모바일 대응
- **외부 의존성 0개** — 런타임 의존성 없이 순수 브라우저 API만 사용

## 기술 스택

| 영역 | 기술 |
|------|------|
| 언어 | TypeScript (strict mode) |
| 빌드 | Vite 6 |
| 테스트 | Vitest (단위 82개) |
| 프레임워크 | 없음 (Vanilla DOM) |
| 애니메이션 | Web Animations API |
| 사운드 | Web Audio API (합성) |
| CI/CD | GitHub Actions |
| 배포 | GitHub Pages |

## 시작하기

```bash
# 설치
npm install

# 개발 서버
npm run dev

# 테스트
npm test

# 테스트 + 커버리지
npm run test:coverage

# 빌드
npm run build
```

## 프로젝트 구조

```
src/
├── core/           # 핵심 게임 로직 (Card, Deck, HandEvaluator, GameEngine, Pot)
├── betting/        # 베팅 시스템 (BettingAction, BettingRound)
├── ai/             # AI 시스템 (AIController, PreFlop/PostFlop Strategy, Chen Formula)
├── ui/             # DOM 렌더링 (Renderer, CardView, PlayerView, BettingControls)
├── animation/      # Web Animations API (카드 딜링/플립, 칩 이동, 승리 효과)
├── sound/          # Web Audio API (7종 합성 효과음)
├── utils/          # EventBus, Constants
└── __tests__/      # Vitest 단위 테스트 (82개)
```

## AI 시스템

| AI | 스타일 | 특징 |
|----|--------|------|
| Alex | Tight-Aggressive | 좋은 핸드만 플레이, 공격적 베팅 |
| Bella | Loose-Aggressive | 많은 핸드 참여, 블러핑 빈번 |
| Charlie | Tight-Passive | 보수적, 강한 핸드가 아니면 콜만 |
| Diana | Loose-Passive | 많은 핸드를 콜, 레이즈는 드묾 |
| Eddie | Balanced | 균형 잡힌 전략, 가장 강함 |

- **프리플롭**: Chen Formula로 핸드 강도 계산 → tightness 기반 플레이 여부 결정
- **포스트플롭**: 핸드 강도(0~1 정규화) + 팟 오즈 + 보드 위험도 종합 판단
- **성격 반영**: tightness, aggression, bluffFrequency, skill 파라미터로 의사결정 가중치 조절

## 핵심 알고리즘

### 핸드 평가
7장에서 C(7,5)=21개 조합을 생성하여 최적의 5장을 선택. `rankValue = category × 10^10 + rank components`로 단일 숫자 비교.

### 사이드팟
올인 금액 오름차순 정렬 → 레벨별 팟 분리 → 각 팟별 자격 플레이어 중 최고 핸드에게 분배.

## 문서

- [PRD (제품 요구사항)](docs/prd.md)
- [로드맵](docs/roadmap.md)
- [프로젝트 기획서](docs/PROJECT_PLAN.md)
- [스프린트 문서](docs/sprint/)

## 개발 과정

8개 스프린트를 통해 애자일하게 개발:

| Sprint | 내용 | 테스트 |
|--------|------|--------|
| 1 | Foundation (Card, Deck, HandEvaluator) | 수동 검증 |
| 2 | GameEngine, 베팅, 팟 관리 | 69개 |
| 3 | 포커 테이블 UI (카지노 럭셔리 테마) | 회귀 69개 |
| 4 | 인터랙티브 플레이 (베팅 컨트롤) | 회귀 69개 |
| 5 | AI 시스템 (Chen Formula, 팟 오즈) | +13 = 82개 |
| 6 | 애니메이션 (Web Animations API) | 회귀 82개 |
| 7 | 사운드 (Web Audio API 합성) | 회귀 82개 |
| 8 | 반응형, 설정, 게임 종료, 도움말 | 회귀 82개 |

## 라이선스

MIT
