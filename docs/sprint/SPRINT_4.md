# Sprint 4: Interactive Play

**상태**: ✅ 완료
**기간**: 2일
**브랜치**: `feature/sprint-4` → `develop` 머지 완료
**선행 조건**: Sprint 2, 3 완료

---

## 목표

인간 플레이어가 실제로 게임을 플레이할 수 있게 함.

---

## 완료된 작업

### 1. 베팅 컨트롤 UI (`src/ui/BettingControls.ts`)

- [x] Fold / Check / Call / Raise 버튼
- [x] 레이즈 금액 슬라이더 (최소 레이즈 ~ 올인)
- [x] 프리셋 버튼: 1/2 Pot, 3/4 Pot, Pot
- [x] 현재 콜 금액 표시 ("Call 200")
- [x] All-In 버튼 (전액 표시)
- [x] 인간 턴이 아닐 때는 비활성화 (`betting-controls--visible` 토글)

### 2. 인간 플레이어 턴 처리

- [x] Promise 기반 입력 대기: `BettingControls.show()` → 버튼 클릭 시 resolve
- [x] `Renderer.requestHumanAction()` — AvailableActions 기반 UI 활성화
- [x] `Renderer.hideBettingControls()` — 턴 종료 후 자동 숨김
- [x] 유효하지 않은 액션 방지: canCheck/canCall/canRaise에 따라 버튼 표시/숨김

### 3. 통합 ActionProvider (`src/main.ts`)

- [x] Human: `renderer.requestHumanAction()` → Promise 대기 → resolve
- [x] AI: 더미 랜덤 AI + 사고 딜레이 (`AI_THINK_MIN_MS` ~ `AI_THINK_MAX_MS`)
- [x] `playSoundForAction()` — 액션별 사운드 재생 (Sprint 7에서 연결)
- [x] 인간 탈락 시 게임 오버 메시지
- [x] 게임 시작 → 핸드 반복 → 게임 오버 전체 루프

### 4. GameEngine ↔ UI 통합 흐름

```
main.ts: startNewGame()
    ↓
GameEngine.playHands(1)
    ↓ (각 플레이어 턴마다)
actionProvider(player, currentBet, minimumRaise)
    ├─ Human: renderer.requestHumanAction() → Promise 대기
    └─ AI: getAIAction() → 즉시 반환 (딜레이 후)
    ↓
renderer.setPlayerAction() → renderer.render()
    ↓
다음 플레이어 또는 다음 페이즈
```

---

## 완료 기준 달성

- ✅ 브라우저에서 인간 플레이어가 Fold/Check/Call/Raise 액션 수행 가능
- ✅ AI 5명과 한 핸드를 처음부터 끝까지 완료할 수 있음
- ✅ 베팅 컨트롤이 인간 턴에만 활성화됨
- ✅ 게임 상태 변경이 UI에 실시간 반영됨
- ✅ `npx tsc --noEmit` 타입 체크 통과

---

## 산출물

| 파일 | 설명 |
| ---- | ---- |
| `src/ui/BettingControls.ts` | 베팅 컨트롤 (버튼 + 슬라이더 + 프리셋 + All-In) |
| `src/ui/Renderer.ts` | requestHumanAction() / hideBettingControls() 추가 |
| `src/main.ts` | 통합 ActionProvider (Human=UI, AI=더미) |

---

## 커밋

- `55ff3bf` — `feat: Sprint 4 - 인터랙티브 베팅 컨트롤 및 Human/AI 분리`
