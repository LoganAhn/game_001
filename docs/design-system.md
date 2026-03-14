# Design System: Texas Hold'em Poker

## 1. 디자인 철학

**Casino Luxury** — 고급 카지노의 분위기를 웹에서 재현하는 것이 핵심 테마.

| 원칙 | 설명 |
| ---- | ---- |
| **Dark-first** | 깊은 다크 배경(#0a0a12) 위에 골드 악센트로 럭셔리한 대비 |
| **Code-synthesized** | 모든 에셋을 코드로 생성 — CSS 카드, Web Audio 사운드, Web Animations |
| **Immersive Felt** | 타원형 그린 펠트 + SVG 노이즈 텍스처 + 스포트라이트 그라디언트 |
| **Glassmorphism** | backdrop-filter blur로 UI 패널에 깊이감 부여 |

---

## 2. 디자인 토큰

모든 토큰은 `src/style.css`의 `:root`에 CSS Custom Properties로 정의.

### 2.1 색상 팔레트

#### Felt & Table (테이블 표면)

| Token | Value | 용도 |
| ----- | ----- | ---- |
| `--felt-dark` | `#0b3d1e` | 펠트 외곽 (가장 어두운 녹색) |
| `--felt-mid` | `#145a2e` | 펠트 중간 영역 |
| `--felt-light` | `#1a7a3e` | 펠트 밝은 영역 |
| `--felt-highlight` | `#22944a` | 펠트 중심 하이라이트 |
| `--table-border-outer` | `#1a0e08` | 나무 테두리 외곽 |
| `--table-border-inner` | `#3d2517` | 나무 테두리 내부 |
| `--table-border-rim` | `#5c3a25` | 나무 테두리 가장자리 |

#### Gold Accents (골드 악센트)

| Token | Value | 용도 |
| ----- | ----- | ---- |
| `--gold` | `#d4a843` | 기본 골드 (테두리, 텍스트) |
| `--gold-bright` | `#f0d060` | 강조 골드 (팟 금액, 승리) |
| `--gold-dim` | `#8a6d2b` | 어두운 골드 (비활성) |

#### Cards (카드)

| Token | Value | 용도 |
| ----- | ----- | ---- |
| `--card-face` | `#f5f0e8` | 카드 앞면 배경 (아이보리) |
| `--card-back` | `#1a3a6a` | 카드 뒷면 배경 (네이비) |
| `--card-red` | `#c0392b` | 하트/다이아몬드 (빨강) |
| `--card-black` | `#1a1a1a` | 스페이드/클럽 (검정) |
| `--card-width` | `58px` | 기본 카드 너비 |
| `--card-height` | `82px` | 기본 카드 높이 |
| `--card-radius` | `6px` | 카드 모서리 반경 |

#### Chips (칩)

| Token | Value | 용도 |
| ----- | ----- | ---- |
| `--chip-red` | `#e74c3c` | 빨강 칩 / BB 마커 |
| `--chip-blue` | `#2980b9` | 파랑 칩 / SB 마커 |
| `--chip-green` | `#27ae60` | 초록 칩 |
| `--chip-black` | `#2c3e50` | 검정 칩 |

#### UI Surface & Text

| Token | Value | 용도 | WCAG 대비율 (vs bg) |
| ----- | ----- | ---- | ------------------- |
| `--bg-deep` | `#0a0a12` | 최하단 배경 | — |
| `--bg-surface` | `#14141f` | 패널 배경 | — |
| `--text-primary` | `#e8e4dc` | 주요 텍스트 | 13.5:1 ✅ AAA |
| `--text-secondary` | `#9a9488` | 보조 텍스트 | 5.2:1 ✅ AA |
| `--text-muted` | `#5a5650` | 비활성 텍스트 | 2.8:1 (장식용) |
| `--danger` | `#e74c3c` | 위험/폴드 | 4.6:1 ✅ AA |
| `--success` | `#2ecc71` | 성공/인간 | 5.8:1 ✅ AA |

### 2.2 타이포그래피

| Token | Font Family | 용도 |
| ----- | ----------- | ---- |
| `--font-display` | Playfair Display, Georgia, serif | 제목, 시작 화면, 팟 금액 |
| `--font-body` | DM Sans, -apple-system, sans-serif | 본문, 버튼, 플레이어 이름 |
| `--font-mono` | JetBrains Mono, Courier New, monospace | 칩 수량, 베팅 금액, 카드 |

폰트 크기 스케일:

| 요소 | Desktop | Tablet | Mobile |
| ---- | ------- | ------ | ------ |
| 시작 화면 제목 | 48px | 36px | 28px |
| 팟 금액 | 22px | 18px | 16px |
| 헤더 제목 | 18px | 15px | 13px |
| 버튼 텍스트 | 14px | 12px | 11px |
| 플레이어 이름 | 13px | 13px | 11px |
| 칩 수량 | 11px | 11px | 9px |

### 2.3 간격 & 크기

| Token | Desktop | Tablet | Mobile |
| ----- | ------- | ------ | ------ |
| `--table-width` | min(95vw, 1100px) | min(95vw, 900px) | 98vw |
| `--table-height` | min(70vh, 580px) | min(65vh, 480px) | 55vh |
| `--card-width` | 58px | 50px | 38px |
| `--card-height` | 82px | 72px | 54px |
| 플레이어 카드 | 44x62px | 44x62px | 32x46px |

### 2.4 효과

| 효과 | 구현 | 용도 |
| ---- | ---- | ---- |
| 펠트 노이즈 | SVG `feTurbulence` 인라인 (opacity 0.4) | 펠트 질감 |
| 스포트라이트 | `radial-gradient(ellipse 70% 50%)` | 테이블 중심 조명 |
| 글래스모피즘 | `backdrop-filter: blur(6~12px)` | 패널, 메시지 바 |
| 골드 글로우 | `text-shadow: 0 0 20px rgba(240,208,96,0.3)` | 팟 금액 강조 |
| 카드 그림자 | `box-shadow: 0 2px 8px rgba(0,0,0,0.4)` | 카드 입체감 |
| 올인 펄스 | `@keyframes pulse-allin` (box-shadow 애니메이션) | 올인 배지 |

---

## 3. 컴포넌트 인벤토리

### 3.1 Poker Table

| 클래스 | 설명 |
| ------ | ---- |
| `.poker-table-wrapper` | 테이블 컨테이너 (상대 위치 기준) |
| `.poker-table` | 나무 테두리 (radial-gradient) |
| `.poker-table-felt` | 녹색 펠트 (radial-gradient + noise texture) |
| `.poker-table-felt::before` | SVG 노이즈 텍스처 오버레이 |
| `.poker-table-felt::after` | 골드 장식선 |

### 3.2 Card

| 클래스 | 설명 |
| ------ | ---- |
| `.card` | 카드 컨테이너 (3D transform-style) |
| `.card-face` | 앞면 (아이보리 배경 + 랭크/수트) |
| `.card-back` | 뒷면 (네이비 + 다이아몬드 패턴) |
| `.card--red` | 빨강 수트 (하트/다이아몬드) |
| `.card--black` | 검정 수트 (스페이드/클럽) |
| `.card--flipped` | 뒷면 표시 상태 (rotateY 180deg) |
| `.card-slot` | 빈 카드 슬롯 (점선 테두리) |

### 3.3 Player Seat

| 클래스 | 설명 |
| ------ | ---- |
| `.player-seat` | 좌석 컨테이너 (absolute positioning) |
| `.player-seat--human` | 인간 플레이어 (녹색 테두리) |
| `.player-seat--active` | 현재 턴 (골드 테두리 + 글로우) |
| `.player-seat--folded` | 폴드 상태 (opacity 0.35 + grayscale) |
| `.player-seat--eliminated` | 탈락 (opacity 0.15 + grayscale 100%) |
| `.player-info` | 이름/칩 정보 박스 (glassmorphism) |
| `.player-action-badge` | 액션 표시 (Fold/Check/Call/Raise/All-In) |
| `.dealer-button` | 딜러 버튼 (D, 원형) |
| `.blind-marker--sb/--bb` | 블라인드 마커 (파랑/빨강) |

### 3.4 Betting Controls

| 클래스 | 설명 |
| ------ | ---- |
| `.betting-controls` | 컨트롤 컨테이너 (하단 중앙) |
| `.betting-controls--visible` | 활성 상태 (opacity 1) |
| `.btn` | 기본 버튼 스타일 |
| `.btn--fold` | Fold (빨강 테두리) |
| `.btn--check`, `.btn--call` | Check/Call (파랑 테두리) |
| `.btn--raise` | Raise (골드 테두리) |
| `.btn--allin` | All-In (빨강 그라디언트) |
| `.raise-slider` | 레이즈 슬라이더 + 금액 표시 |

### 3.5 Overlays & Panels

| 클래스 | 설명 |
| ------ | ---- |
| `.settings-panel` | 설정 패널 (glassmorphism) |
| `.help-panel` | 핸드 랭킹 도움말 |
| `.game-over-overlay` | 게임 종료 오버레이 (backdrop blur) |
| `.message-bar` | 하단 메시지 바 |

---

## 4. 반응형 브레이크포인트

| 구분 | 범위 | 주요 변경 |
| ---- | ---- | --------- |
| **Desktop** | 1200px+ | 기본 레이아웃. 테이블 1100px, 카드 58x82px |
| **Tablet** | 768~1199px | 테이블 900px, 카드 50x72px, 폰트 15~20% 축소, 버튼 패딩 축소 |
| **Mobile** | ~767px | 테이블 98vw, 카드 38x54px, 베팅 버튼 wrap, 펠트 여백 축소, 터치 대응 크기 |

모바일 터치 최적화:
- 버튼 최소 터치 영역: 44x44px (iOS HIG 권장)
- 설정/도움말 토글: 30x30px
- 슬라이더: 80px 너비 + accent-color 골드

---

## 5. 접근성 가이드라인

### 5.1 WCAG 2.1 AA 준수

| 항목 | 현황 |
| ---- | ---- |
| 색상 대비 (텍스트) | `--text-primary` 13.5:1, `--text-secondary` 5.2:1 ✅ AA |
| 색상 대비 (골드) | `--gold` on `--bg-deep` = 7.2:1 ✅ AA |
| 색상 대비 (위험) | `--danger` on `--bg-deep` = 4.6:1 ✅ AA |
| 포커스 인디케이터 | `focus-visible` outline 2px solid gold |
| 키보드 접근 | Tab으로 버튼 순회, Enter로 액션 실행 |
| 색맹 대응 | 카드 수트를 심볼(♠♥♦♣)로 구분 + 색상 |

### 5.2 ARIA 역할

| 요소 | ARIA 속성 |
| ---- | --------- |
| 게임 컨테이너 | `role="main"` |
| 베팅 컨트롤 | `role="group"`, `aria-label="베팅 컨트롤"` |
| 각 버튼 | `aria-label` (예: "Fold", "Call 200") |
| 레이즈 슬라이더 | `aria-label="레이즈 금액"` |
| 카드 | `role="img"`, `aria-label` (예: "Ace of Spades") |
| 플레이어 좌석 | `role="region"`, `aria-label` (예: "Alex, 10,000 칩") |
| 메시지 바 | `role="status"`, `aria-live="polite"` |
| 게임 종료 | `role="alertdialog"`, `aria-modal="true"` |
| 설정/도움말 토글 | `aria-expanded`, `aria-controls` |

### 5.3 키보드 내비게이션

| 키 | 동작 |
| --- | ---- |
| Tab | 베팅 버튼 간 이동 |
| Enter/Space | 선택한 버튼 실행 |
| Escape | 설정/도움말 패널 닫기 |

---

## 6. 디자인 검토 프로세스

새로운 UI 변경 시 아래 체크리스트 확인:

- [ ] 디자인 토큰(CSS 변수) 사용 여부 — 하드코딩 색상/크기 금지
- [ ] 3개 브레이크포인트에서 레이아웃 확인
- [ ] WCAG AA 색상 대비율 충족 (4.5:1 이상)
- [ ] 키보드만으로 모든 기능 접근 가능
- [ ] `focus-visible` 포커스 인디케이터 표시
- [ ] ARIA 속성 적절히 부여
- [ ] 애니메이션 `prefers-reduced-motion` 대응 고려
- [ ] 카지노 럭셔리 테마와 시각적 일관성 유지
