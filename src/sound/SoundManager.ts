/**
 * Web Audio API 기반 사운드 매니저
 * 외부 파일 없이 모든 사운드를 코드로 합성
 */
export class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private _muted = false;
  private _volume = 0.5;

  /** AudioContext 초기화 (사용자 인터랙션 후 호출, 미지원 브라우저 폴백) */
  init(): void {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) {
      console.warn('Web Audio API not supported — sound disabled');
      return;
    }
    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this._volume;
    this.masterGain.connect(this.ctx.destination);
  }

  /** 자동재생 정책 대응 — resume */
  async resume(): Promise<void> {
    if (this.ctx?.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  get context(): AudioContext | null {
    return this.ctx;
  }

  get output(): GainNode | null {
    return this.masterGain;
  }

  get muted(): boolean {
    return this._muted;
  }

  set muted(value: boolean) {
    this._muted = value;
    if (this.masterGain) {
      this.masterGain.gain.value = value ? 0 : this._volume;
    }
  }

  get volume(): number {
    return this._volume;
  }

  set volume(value: number) {
    this._volume = Math.max(0, Math.min(1, value));
    if (this.masterGain && !this._muted) {
      this.masterGain.gain.value = this._volume;
    }
  }

  toggleMute(): void {
    this.muted = !this._muted;
  }
}

/** 싱글톤 */
export const soundManager = new SoundManager();
