# Sprint 7: Sound + Effects

**상태**: 📋 대기
**예상 기간**: 1일
**브랜치**: `feature/sprint-7`
**선행 조건**: Sprint 6 완료

---

## 목표

청각적 피드백 및 승리 연출. 모든 게임 액션에 사운드가 재생됨.

---

## 작업 항목

### 1. SoundManager (`src/sound/SoundManager.ts`)
- [ ] Web Audio API 기반 사운드 시스템
- [ ] AudioContext 초기화 (사용자 인터랙션 후 resume)
- [ ] 마스터 볼륨 조절
- [ ] 음소거 on/off 토글
- [ ] 동시 재생 지원 (여러 사운드 오버랩)

### 2. 효과음 합성 (`src/sound/SoundEffects.ts`)
- [ ] 외부 파일 없이 Web Audio API로 사운드 합성:

| 효과음 | 합성 방식 | 트리거 |
|--------|----------|--------|
| 카드 딜 | 짧은 화이트 노이즈 + 하이패스 | 카드 배분 |
| 카드 플립 | 노이즈 + 피치 다운 | 커뮤니티 카드 공개 |
| 칩 베팅 | 짧은 클릭음 (사인파 여러 개 합성) | 베팅/콜/레이즈 |
| 체크 | 낮은 노크음 (사인파 + 감쇠) | 체크 액션 |
| 폴드 | 부드러운 스와이프 (필터드 노이즈) | 폴드 액션 |
| 승리 | 상승 멜로디 (사인파 시퀀스) | 팟 획득 |
| 올인 | 드라마틱 사운드 (로우 + 하이 합성) | 올인 액션 |

### 3. 승리 시각 효과 (`src/animation/WinEffects.ts`)
- [ ] 파티클 이펙트: 승자 주변에 빛나는 입자
- [ ] 핸드명 팝업: "Full House!" 텍스트 스케일업 + 페이드
- [ ] 칩 카운트 롤링 숫자 애니메이션
- [ ] 큰 승리(All-in 승, 탈락시킴) 시 강화된 이펙트

### 4. EventBus 연결
- [ ] GameEvent → 사운드 매핑
- [ ] 애니메이션과 사운드 동기화

---

## 기술 방식

- **Web Audio API**: `OscillatorNode`, `GainNode`, `BiquadFilterNode`
- 외부 오디오 파일 없음 — 모든 사운드를 코드로 합성
- `AudioContext.state` 체크 → `resume()` (자동재생 정책 대응)

---

## 완료 기준

- [ ] 카드 딜, 플립 시 사운드 재생
- [ ] 베팅/콜/레이즈/체크/폴드 시 각기 다른 사운드
- [ ] 승리 시 시각 + 청각 피드백
- [ ] 음소거/볼륨 조절 동작
- [ ] `npx tsc --noEmit` 타입 체크 통과

---

## 산출물 (예상)

| 파일 | 설명 |
|------|------|
| `src/sound/SoundManager.ts` | Web Audio API 관리자 |
| `src/sound/SoundEffects.ts` | 합성 효과음 |
| `src/animation/WinEffects.ts` | 승리 시각 효과 |
