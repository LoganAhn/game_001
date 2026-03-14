# Sprint 4: Interactive Play

**상태**: 📋 대기
**예상 기간**: 2일
**브랜치**: `feature/sprint-4`
**선행 조건**: Sprint 2, 3 완료

---

## 목표

인간 플레이어가 실제로 게임을 플레이할 수 있게 함. 더미 AI(항상 콜)와 한 핸드를 완료할 수 있으면 성공.

---

## 작업 항목

### 1. 베팅 컨트롤 UI (`src/ui/BettingControls.ts`)
- [ ] Fold / Check / Call / Raise 버튼
- [ ] 레이즈 금액 슬라이더 (최소 레이즈 ~ 올인)
- [ ] 프리셋 버튼: 1/2 Pot, 3/4 Pot, Pot, All-In
- [ ] 현재 콜 금액 표시 ("Call $200")
- [ ] 인간 턴이 아닐 때는 비활성화

### 2. EventBus ↔ Renderer 연결
- [ ] GameEngine이 발행하는 이벤트를 Renderer가 구독
- [ ] 이벤트별 UI 갱신 매핑:
  - `HAND_START` → 테이블 초기화
  - `HOLE_CARDS_DEALT` → 카드 표시 (인간만 앞면)
  - `PHASE_CHANGE` → 커뮤니티 카드 갱신
  - `PLAYER_ACTION` → 플레이어 상태 갱신
  - `POT_UPDATE` → 팟 금액 갱신
  - `HAND_RESULT` → 승리 표시
  - `PLAYER_TURN` → 현재 턴 하이라이트

### 3. 인간 플레이어 턴 처리
- [ ] `PLAYER_TURN` 이벤트 수신 시 베팅 컨트롤 활성화
- [ ] Promise 기반 입력 대기: 버튼 클릭 시 resolve
- [ ] GameEngine에 `waitForHumanAction()` 콜백 연결
- [ ] 유효하지 않은 액션 방지 (UI 레벨)

### 4. 더미 AI 연결
- [ ] Sprint 2의 더미 AI를 GameEngine에 연결
- [ ] AI 턴 시 "thinking..." 텍스트 표시
- [ ] AI 사고 딜레이 적용 (`AI_THINK_MIN_MS` ~ `AI_THINK_MAX_MS`)

### 5. 게임 시작/재시작
- [ ] 게임 시작 버튼 또는 자동 시작
- [ ] 핸드 완료 후 자동으로 다음 핸드 진행
- [ ] 게임 오버 시 결과 화면

---

## 완료 기준

- [ ] 브라우저에서 인간 플레이어가 Fold/Check/Call/Raise 액션 수행 가능
- [ ] 더미 AI 5명과 한 핸드를 처음부터 끝까지 완료할 수 있음
- [ ] 베팅 컨트롤이 인간 턴에만 활성화됨
- [ ] 게임 상태 변경이 UI에 실시간 반영됨
- [ ] `npx tsc --noEmit` 타입 체크 통과

---

## 산출물 (예상)

| 파일 | 설명 |
|------|------|
| `src/ui/BettingControls.ts` | 베팅 컨트롤 (버튼 + 슬라이더) |
| `src/main.ts` | 게임 초기화 및 이벤트 연결 (리팩터링) |
