# Sprint 7: Sound + Effects

**상태**: ✅ 완료
**기간**: 1일
**브랜치**: `feature/sprint-7` → `develop` 머지 완료
**선행 조건**: Sprint 6 완료

---

## 목표

청각적 피드백 및 승리 연출. 모든 게임 액션에 사운드가 재생됨.

---

## 완료된 작업

### 1. SoundManager (`src/sound/SoundManager.ts`)

- [x] Web Audio API 기반 사운드 시스템
- [x] AudioContext 초기화 (사용자 인터랙션 후 `init()`)
- [x] `resume()` — 자동재생 정책 대응
- [x] 마스터 볼륨 조절 (0~1)
- [x] 음소거 on/off 토글 (`toggleMute()`)
- [x] 싱글톤 `soundManager` export

### 2. 효과음 합성 (`src/sound/SoundEffects.ts`)

외부 오디오 파일 없이 Web Audio API로 합성:

| 효과음 | 합성 방식 | 함수 |
| ------ | --------- | ---- |
| 카드 딜 | 화이트 노이즈 + 하이패스(4kHz) + 지수 감쇠(60ms) | `playCardDeal()` |
| 카드 플립 | 노이즈 + 밴드패스(3kHz→800Hz) + 감쇠(100ms) | `playCardFlip()` |
| 칩 베팅 | 사인파 3개(2.5k/3.2k/4kHz) stagger + 감쇠(40ms) | `playChipBet()` |
| 체크 | 사인파(300→100Hz) + 감쇠(100ms) | `playCheck()` |
| 폴드 | 노이즈 + 로우패스(2kHz→200Hz) + 감쇠(150ms) | `playFold()` |
| 승리 | 사인파 시퀀스(C5-E5-G5-C6) stagger(120ms) | `playWin()` |
| 올인 | 톱니파(80Hz) + 사인파(800→200Hz) 동시 | `playAllIn()` |

### 3. 승리 시각 효과 (`src/animation/WinEffects.ts`)

- [x] `showHandPopup()` — 핸드명 + 승자 + 금액 팝업 (스케일인 500ms → 유지 1.5s → 페이드아웃 400ms)
- [x] `showWinParticles()` — 20개 골드/크림 입자, 중심에서 방사형 분산 (800~1200ms)
- [x] `showBigWinEffect()` — 파티클 + 팝업 동시 실행

### 4. main.ts 연결

- [x] `playSoundForAction()` — 액션별 사운드 매핑 (fold/check/call/raise/allin)
- [x] 핸드 시작 시 `playCardDeal()`, 승리 시 `playWin()` + `showHandPopup()`
- [x] 게임 시작 시 `soundManager.init()` + `resume()`

---

## 완료 기준 달성

- ✅ 카드 딜, 플립 시 사운드 재생
- ✅ 베팅/콜/레이즈/체크/폴드 시 각기 다른 사운드
- ✅ 승리 시 시각(파티클+팝업) + 청각(멜로디) 피드백
- ✅ 음소거/볼륨 조절 동작
- ✅ `npx tsc --noEmit` 타입 체크 통과
- ✅ `npm test` — 82/82 테스트 유지

---

## 산출물

| 파일 | 설명 |
| ---- | ---- |
| `src/sound/SoundManager.ts` | Web Audio API 관리자 (볼륨/음소거) |
| `src/sound/SoundEffects.ts` | 7종 합성 효과음 |
| `src/animation/WinEffects.ts` | 승리 파티클 + 핸드명 팝업 |

---

## 커밋

- `9a988e2` — `feat: Sprint 7 - 사운드 시스템 및 승리 효과 구현`
