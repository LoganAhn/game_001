# Sprint 3: Basic UI

**상태**: ✅ 완료
**기간**: 2일
**브랜치**: `feature/sprint-3`
**선행 조건**: Sprint 2 완료

---

## 목표

시각적 게임 테이블 완성. 브라우저에서 포커 테이블이 렌더링되고, AI끼리 자동 게임 진행이 화면에 표시됨.

---

## 완료된 작업

### 1. 글로벌 스타일 (`src/style.css`)

- [x] CSS Reset / 기본 스타일
- [x] CSS Custom Properties: 펠트, 카드, 칩, 골드, UI 색상 등 50+ 변수
- [x] 타이포그래피: Playfair Display (디스플레이), DM Sans (본문), JetBrains Mono (숫자)
- [x] 카지노 럭셔리 테마: 딥 에메랄드 그린 + 골드 악센트 + 스포트라이트 효과

### 2. 포커 테이블 (`src/ui/TableView.ts`)

- [x] 타원형 녹색 펠트 테이블 (CSS radial-gradient)
- [x] 나무 재질 테두리 (다층 그라디언트)
- [x] 펠트 노이즈 텍스처 (SVG 인라인)
- [x] 골드 장식선 (테이블 내부)
- [x] 반응형 크기 (viewport 기반 min())

### 3. 카드 렌더링 (`src/ui/CardView.ts`)

- [x] CSS 전용 카드 디자인 (이미지 없음)
- [x] 카드 앞면: 랭크 + 수트 심볼, 빨강/검정 색상, 코너 + 중앙 수트
- [x] 카드 뒷면: 다이아몬드 패턴 + 수트 심볼
- [x] 카드 플립: CSS transform + backface-visibility
- [x] 빈 슬롯: 점선 테두리 + 반투명 배경

### 4. 플레이어 좌석 (`src/ui/PlayerView.ts`)

- [x] 6인 좌석 배치 (타원형 테이블 주변, absolute positioning)
- [x] Player 0 (인간): 하단 중앙 / Player 1~5 (AI): 시계 방향
- [x] 좌석 정보: 이름, 칩 수량 (K/M 포맷)
- [x] 딜러 버튼(D), SB/BB 마커 표시
- [x] 폴드 상태 (opacity + grayscale), 탈락 상태 (완전 흐림)
- [x] 현재 턴 플레이어 하이라이트 (골드 테두리 + 글로우)
- [x] 액션 배지 (Fold/Check/Call/Raise/All-In 컬러별 구분)
- [x] 플레이어별 베팅 금액 표시

### 5. 커뮤니티 카드 (`src/ui/CommunityCardsView.ts`)

- [x] 테이블 중앙에 5장 카드 슬롯
- [x] 페이즈에 따라 카드 표시 (플롭 3장, 턴 4장, 리버 5장)
- [x] 미공개 카드는 빈 슬롯으로 표시
- [x] 딜 애니메이션 (staggered delay)

### 6. 팟 표시 (`src/ui/PotView.ts`)

- [x] 테이블 중앙에 총 팟 금액 표시 (골드 텍스트 + 글로우)
- [x] 사이드팟이 있으면 구분하여 칩 형태로 표시

### 7. 메시지 표시 (`src/ui/MessageView.ts`)

- [x] 하단 메시지 바 (backdrop-filter 블러)
- [x] 게임 상황 안내 텍스트
- [x] 임시 메시지 (페이드 아웃)

### 8. Renderer (`src/ui/Renderer.ts`)

- [x] 모든 View 모듈을 통합하는 메인 렌더러
- [x] `GameState`를 받아 전체 UI 갱신
- [x] DOM 요소 캐싱 (PlayerSeatElements Map)
- [x] 시작 화면 (타이틀 + 시작 버튼)
- [x] 헤더 바 (핸드 번호, 블라인드, 페이즈)
- [x] 플레이어 액션 추적 및 배지 표시

---

## 완료 기준 달성

- ✅ 브라우저에서 포커 테이블이 시각적으로 렌더링됨
- ✅ 6명의 플레이어 좌석이 테이블 주변에 배치됨
- ✅ 카드(앞면/뒷면)가 CSS로 깔끔하게 표시됨
- ✅ 팟 금액과 커뮤니티 카드 영역이 중앙에 표시됨
- ✅ `npx tsc --noEmit` 타입 체크 통과
- ✅ `npm run build` — 빌드 성공 (CSS 12KB + JS 26KB)
- ✅ `npm test` — 69/69 테스트 유지

---

## 산출물

| 파일 | 설명 |
| ---- | ---- |
| `src/style.css` | 글로벌 스타일 + CSS 변수 (카지노 럭셔리 테마) |
| `src/ui/Renderer.ts` | 메인 렌더러 (View 통합) |
| `src/ui/TableView.ts` | 포커 테이블 |
| `src/ui/CardView.ts` | CSS 카드 렌더링 |
| `src/ui/PlayerView.ts` | 플레이어 좌석 |
| `src/ui/CommunityCardsView.ts` | 커뮤니티 카드 |
| `src/ui/PotView.ts` | 팟 표시 |
| `src/ui/MessageView.ts` | 메시지 표시 |

---

## 커밋

- `35f0ced` — `feat: Sprint 3 - 포커 테이블 UI 구현`
