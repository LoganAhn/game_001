# 의사결정 로그 (Architecture Decision Records)

프로젝트 개발 과정에서 내린 주요 기술적/설계적 의사결정을 기록합니다.

---

## ADR-001: 프레임워크 없이 순수 TypeScript + DOM API 사용

- **일시**: Sprint 1
- **맥락**: React, Vue 등 프레임워크를 사용할지, Vanilla TypeScript로 갈지 결정 필요
- **선택지**:
  1. React + TypeScript — 컴포넌트 기반, 상태 관리 용이
  2. Vue 3 + TypeScript — 템플릿 기반, 학습 곡선 낮음
  3. Vanilla TypeScript — 외부 의존성 0, 최소 번들
- **결정**: Vanilla TypeScript
- **근거**:
  - 게임 UI는 실시간 상태 변경이 빈번하여 가상 DOM 오버헤드가 비효율적
  - 번들 크기 최소화 목표 (50KB 이하 gzip) 달성에 유리
  - Web Animations API, Web Audio API를 직접 제어해야 하므로 프레임워크 추상화가 오히려 방해
  - 포커 게임 특성상 컴포넌트 재사용보다 게임 루프 제어가 중요
- **결과**: gzip 18KB 달성, TTI 0.5초 이내

---

## ADR-002: ActionProvider 패턴으로 GameEngine과 UI/AI 디커플링

- **일시**: Sprint 2
- **맥락**: GameEngine이 플레이어 턴을 처리할 때, 인간 입력과 AI 결정을 어떻게 통합할지
- **선택지**:
  1. GameEngine 내부에서 if(isHuman) 분기 — 간단하지만 결합도 높음
  2. Strategy 패턴 — 각 플레이어에 전략 객체 주입
  3. ActionProvider 콜백 — 단일 async 함수를 GameEngine에 주입
- **결정**: ActionProvider 콜백 패턴
- **근거**:
  - GameEngine이 UI/AI 모듈에 대해 전혀 모르도록 완전한 디커플링
  - async/await로 인간 입력(Promise)과 AI 결정을 동일하게 처리
  - main.ts에서 한 곳에서 분기하므로 테스트 시 mock ActionProvider 주입 용이
- **결과**: GameEngine 단위 테스트 12개 모두 mock provider로 작성, UI 없이 테스트 가능

---

## ADR-003: 핸드 평가에 숫자 인코딩 방식 사용

- **일시**: Sprint 1
- **맥락**: 7장에서 최적 5장 핸드를 평가하고 비교하는 방법
- **선택지**:
  1. 문자열 비교 — "Royal Flush" > "Straight" 등
  2. 다단계 비교 — category 비교 → 동점 시 kicker 순차 비교
  3. 단일 숫자 인코딩 — `category × 10^10 + rank components`
- **결정**: 단일 숫자 인코딩
- **근거**:
  - O(1) 비교: 두 핸드를 단일 `>` 연산으로 비교
  - 정렬, 최대값 찾기 등 모든 비교 연산에서 일관성
  - 사이드팟 분배 시 다수 플레이어 핸드를 빠르게 정렬 가능
- **결과**: `rankValue` 단일 필드로 모든 핸드 비교 처리, HandEvaluator 테스트 16개 통과

---

## ADR-004: Web Audio API 합성 사운드 (외부 오디오 파일 없음)

- **일시**: Sprint 7
- **맥락**: 효과음을 외부 오디오 파일로 제공할지, 코드로 합성할지
- **선택지**:
  1. MP3/WAV 파일 — 높은 품질, 추가 네트워크 요청
  2. Web Audio API 합성 — 파일 없음, 코드만으로 생성
  3. 하이브리드 — 핵심 효과음만 합성, 나머지 파일
- **결정**: 100% Web Audio API 합성
- **근거**:
  - 외부 에셋 0개 원칙 유지 → 단일 JS 번들로 완전한 게임
  - 7종 효과음(카드 딜, 칩 베팅, 체크, 폴드, 승리, 올인, 카드 플립)을 OscillatorNode + NoiseBuffer로 구현
  - 브라우저 자동재생 정책 대응: 첫 클릭 시 AudioContext.resume()
- **트레이드오프**: 합성 사운드는 실제 카지노 사운드보다 품질이 낮지만, 번들 크기 0 추가로 목표(18KB) 유지
- **결과**: SoundManager 싱글톤, SoundEffects 7종 구현

---

## ADR-005: Vitest + Playwright 이중 테스트 전략

- **일시**: Sprint 2 (Vitest), Sprint 8 (Playwright)
- **맥락**: 테스트 프레임워크 선정 및 테스트 전략
- **선택지**:
  1. Jest — 성숙한 생태계, TS 설정 복잡
  2. Vitest — Vite 네이티브, 빠른 실행, Jest API 호환
  3. Vitest + Playwright — 단위 + E2E 이중 검증
- **결정**: Vitest(단위) + Playwright(E2E)
- **근거**:
  - Vitest: Vite 설정 공유, esbuild로 빠른 변환, vitest.config 불필요
  - Playwright: 실제 브라우저에서 게임 플로우 검증 (DOM API, Web Audio 등 브라우저 전용 기능)
  - 핵심 로직은 Vitest로 빠르게 회귀 테스트, UI/통합은 Playwright로 검증
- **결과**: 82개 단위 테스트 (255ms) + 7개 E2E 테스트 (10초), CI에서 모두 실행

---

## ADR-006: CSS 전용 카드 렌더링 (이미지 없음)

- **일시**: Sprint 3
- **맥락**: 52장 카드를 어떻게 시각적으로 렌더링할지
- **선택지**:
  1. 스프라이트 이미지 — 높은 품질, 100KB+ 추가
  2. SVG — 벡터 기반, 파일 관리 필요
  3. CSS + HTML — 순수 코드, 외부 파일 불필요
- **결정**: CSS + HTML
- **근거**:
  - 외부 에셋 0개 원칙
  - CSS 변수로 수트별 색상(빨강/검정) 자동 적용
  - 카드 뒷면(패턴), 앞면(수트 심볼 + 랭크)을 CSS만으로 구현
  - 반응형: 뷰포트에 따라 카드 크기 자동 조절
- **결과**: CardView 컴포넌트, CSS 카드 렌더링, 번들 크기 0 추가

---

## ADR-007: EventBus + 직접 호출 하이브리드 렌더링

- **일시**: Sprint 3
- **맥락**: 게임 상태 변경 시 UI를 어떻게 업데이트할지
- **선택지**:
  1. 순수 EventBus — 모든 상태 변경을 이벤트로 전파
  2. 직접 호출 — main.ts에서 renderer.render() 직접 호출
  3. 하이브리드 — 렌더링은 직접, 애니메이션/사운드는 EventBus
- **결정**: 하이브리드
- **근거**:
  - 렌더링은 매 액션 후 즉시 동기적으로 발생해야 함 → 직접 호출이 명확
  - 애니메이션/사운드는 게임 진행과 비동기적으로 발생 → EventBus가 적합
  - 완전한 이벤트 기반은 렌더링 타이밍 제어가 어려움 (이벤트 순서 보장 문제)
- **트레이드오프**: EventBus가 완전히 활용되지 않아 일부 중복이 있지만, 게임 루프의 명확성이 우선
- **결과**: CLAUDE.md에 이 설계 결정을 명시하여 미래 개발자가 혼동하지 않도록 함
