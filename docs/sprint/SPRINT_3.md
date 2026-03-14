# Sprint 3: Basic UI

**상태**: 📋 대기
**예상 기간**: 2일
**브랜치**: `feature/sprint-3`
**선행 조건**: Sprint 2 완료

---

## 목표

시각적 게임 테이블 완성. 정적 UI가 브라우저에 렌더링되는 것을 확인.

---

## 작업 항목

### 1. 글로벌 스타일 (`src/style.css`)
- [ ] CSS Reset / 기본 스타일
- [ ] 색상 변수 (CSS Custom Properties): 테이블 녹색, 카드 흰색, 칩 색상 등
- [ ] 타이포그래피: 게임에 어울리는 폰트 설정

### 2. 포커 테이블 (`src/ui/TableView.ts`)
- [ ] 타원형 녹색 펠트 테이블 (CSS border-radius + gradient)
- [ ] 테이블 테두리 (나무 재질 느낌)
- [ ] 반응형 크기 (viewport 기반)

### 3. 카드 렌더링 (`src/ui/CardView.ts`)
- [ ] CSS 전용 카드 디자인 (이미지 없음)
- [ ] 카드 앞면: 랭크 + 수트 심볼, 빨강/검정 색상
- [ ] 카드 뒷면: 패턴 디자인
- [ ] 카드 크기: 데스크탑/모바일 대응

### 4. 플레이어 좌석 (`src/ui/PlayerView.ts`)
- [ ] 6인 좌석 배치 (타원형 테이블 주변)
  - Player 0 (인간): 하단 중앙
  - Player 1~5 (AI): 시계 방향 배치
- [ ] 좌석 정보: 이름, 칩 수량, 아바타/아이콘
- [ ] 딜러 버튼(D), SB, BB 마커 표시
- [ ] 폴드/탈락 상태 시각화 (흐리게 처리)

### 5. 커뮤니티 카드 (`src/ui/CommunityCardsView.ts`)
- [ ] 테이블 중앙에 5장 카드 슬롯
- [ ] 페이즈에 따라 카드 표시 (플롭 3장, 턴 4장, 리버 5장)
- [ ] 미공개 카드는 빈 슬롯으로 표시

### 6. 팟 표시 (`src/ui/PotView.ts`)
- [ ] 테이블 중앙에 총 팟 금액 표시
- [ ] 사이드팟이 있으면 구분하여 표시

### 7. 메시지 표시 (`src/ui/MessageView.ts`)
- [ ] 게임 상황 안내 텍스트 (하단 또는 테이블 위)
- [ ] "OO님 차례입니다", "플롭!", "AA wins $1,500" 등

### 8. Renderer (`src/ui/Renderer.ts`)
- [ ] 모든 View 모듈을 통합하는 메인 렌더러
- [ ] `GameState`를 받아 전체 UI 갱신
- [ ] DOM 요소 캐싱으로 불필요한 재생성 방지

---

## 완료 기준

- [ ] 브라우저에서 포커 테이블이 시각적으로 렌더링됨
- [ ] 6명의 플레이어 좌석이 테이블 주변에 배치됨
- [ ] 카드(앞면/뒷면)가 CSS로 깔끔하게 표시됨
- [ ] 팟 금액과 커뮤니티 카드 영역이 중앙에 표시됨
- [ ] `npx tsc --noEmit` 타입 체크 통과

---

## UI 레이아웃 참고

```
┌──────────────────────────────────────────┐
│              [Player 3]                  │
│       [Player 4]     [Player 2]          │
│                                          │
│          ┌─────────────────┐             │
│          │ Community Cards │             │
│          │   Pot: $1,500   │             │
│          └─────────────────┘             │
│                                          │
│       [Player 5]     [Player 1]          │
│              [Player 0 - You]            │
└──────────────────────────────────────────┘
```

---

## 산출물 (예상)

| 파일 | 설명 |
|------|------|
| `src/style.css` | 글로벌 스타일 + CSS 변수 |
| `src/ui/Renderer.ts` | 메인 렌더러 (View 통합) |
| `src/ui/TableView.ts` | 포커 테이블 |
| `src/ui/CardView.ts` | CSS 카드 렌더링 |
| `src/ui/PlayerView.ts` | 플레이어 좌석 |
| `src/ui/CommunityCardsView.ts` | 커뮤니티 카드 |
| `src/ui/PotView.ts` | 팟 표시 |
| `src/ui/MessageView.ts` | 메시지 표시 |
