import { soundManager } from './SoundManager';

/**
 * Web Audio API로 합성하는 효과음
 * 외부 오디오 파일 불필요
 */

/** 카드 딜 — 짧은 화이트 노이즈 + 하이패스 */
export function playCardDeal(): void {
  const ctx = soundManager.context;
  const out = soundManager.output;
  if (!ctx || !out) return;

  const duration = 0.06;
  const noise = createNoiseBuffer(ctx, duration);
  const source = ctx.createBufferSource();
  source.buffer = noise;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 4000;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  source.connect(filter).connect(gain).connect(out);
  source.start();
  source.stop(ctx.currentTime + duration);
}

/** 카드 플립 — 노이즈 + 피치 다운 */
export function playCardFlip(): void {
  const ctx = soundManager.context;
  const out = soundManager.output;
  if (!ctx || !out) return;

  const duration = 0.1;
  const noise = createNoiseBuffer(ctx, duration);
  const source = ctx.createBufferSource();
  source.buffer = noise;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(3000, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + duration);
  filter.Q.value = 2;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  source.connect(filter).connect(gain).connect(out);
  source.start();
  source.stop(ctx.currentTime + duration);
}

/** 칩 베팅 — 짧은 클릭음 (사인파 합성) */
export function playChipBet(): void {
  const ctx = soundManager.context;
  const out = soundManager.output;
  if (!ctx || !out) return;

  const freqs = [2500, 3200, 4000];
  for (const freq of freqs) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    const offset = (freq - 2500) * 0.00005;
    gain.gain.setValueAtTime(0.08, ctx.currentTime + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.04);

    osc.connect(gain).connect(out);
    osc.start(ctx.currentTime + offset);
    osc.stop(ctx.currentTime + offset + 0.05);
  }
}

/** 체크 — 낮은 노크음 */
export function playCheck(): void {
  const ctx = soundManager.context;
  const out = soundManager.output;
  if (!ctx || !out) return;

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

  osc.connect(gain).connect(out);
  osc.start();
  osc.stop(ctx.currentTime + 0.12);
}

/** 폴드 — 부드러운 스와이프 */
export function playFold(): void {
  const ctx = soundManager.context;
  const out = soundManager.output;
  if (!ctx || !out) return;

  const duration = 0.15;
  const noise = createNoiseBuffer(ctx, duration);
  const source = ctx.createBufferSource();
  source.buffer = noise;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2000, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  source.connect(filter).connect(gain).connect(out);
  source.start();
  source.stop(ctx.currentTime + duration);
}

/** 승리 — 상승 멜로디 */
export function playWin(): void {
  const ctx = soundManager.context;
  const out = soundManager.output;
  if (!ctx || !out) return;

  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    const start = ctx.currentTime + i * 0.12;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.2, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);

    osc.connect(gain).connect(out);
    osc.start(start);
    osc.stop(start + 0.35);
  });
}

/** 올인 — 드라마틱 로우+하이 */
export function playAllIn(): void {
  const ctx = soundManager.context;
  const out = soundManager.output;
  if (!ctx || !out) return;

  // Low rumble
  const lowOsc = ctx.createOscillator();
  lowOsc.type = 'sawtooth';
  lowOsc.frequency.value = 80;
  const lowGain = ctx.createGain();
  lowGain.gain.setValueAtTime(0.15, ctx.currentTime);
  lowGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
  lowOsc.connect(lowGain).connect(out);
  lowOsc.start();
  lowOsc.stop(ctx.currentTime + 0.45);

  // High impact
  const highOsc = ctx.createOscillator();
  highOsc.type = 'sine';
  highOsc.frequency.setValueAtTime(800, ctx.currentTime);
  highOsc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
  const highGain = ctx.createGain();
  highGain.gain.setValueAtTime(0.2, ctx.currentTime);
  highGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  highOsc.connect(highGain).connect(out);
  highOsc.start();
  highOsc.stop(ctx.currentTime + 0.35);
}

// ─── 헬퍼 ───

function createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}
