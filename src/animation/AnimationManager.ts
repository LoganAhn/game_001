/**
 * 애니메이션 큐 시스템 — Promise 기반 순차 실행
 */
export class AnimationManager {
  private queue: (() => Promise<void>)[] = [];
  private running = false;
  private _speed: 'slow' | 'normal' | 'fast' = 'normal';
  private _enabled = true;

  get speedMultiplier(): number {
    switch (this._speed) {
      case 'slow': return 1.5;
      case 'normal': return 1;
      case 'fast': return 0.4;
    }
  }

  set speed(value: 'slow' | 'normal' | 'fast') {
    this._speed = value;
  }

  set enabled(value: boolean) {
    this._enabled = value;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  /** 애니메이션을 큐에 추가하고 완료될 때까지 대기 */
  async enqueue(fn: () => Promise<void>): Promise<void> {
    if (!this._enabled) return;

    return new Promise<void>((resolve) => {
      this.queue.push(async () => {
        await fn();
        resolve();
      });
      if (!this.running) {
        this.processQueue();
      }
    });
  }

  /** 즉시 실행 (큐 안 거침) */
  async play(fn: () => Promise<void>): Promise<void> {
    if (!this._enabled) return;
    await fn();
  }

  /** 지정 시간만큼 대기 (speed 반영) */
  async delay(ms: number): Promise<void> {
    if (!this._enabled) return;
    const adjusted = ms * this.speedMultiplier;
    return new Promise(r => setTimeout(r, adjusted));
  }

  /** Web Animations API 래퍼 — speed 반영, 미지원 브라우저 폴백 */
  async animate(
    element: HTMLElement,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions,
  ): Promise<void> {
    if (!this._enabled) return;

    // Web Animations API 미지원 브라우저 폴백: 즉시 최종 상태 적용
    if (typeof element.animate !== 'function') {
      const lastFrame = keyframes[keyframes.length - 1];
      if (lastFrame) Object.assign(element.style, lastFrame);
      return;
    }

    const duration = typeof options.duration === 'number'
      ? options.duration * this.speedMultiplier
      : options.duration;

    const anim = element.animate(keyframes, { ...options, duration });
    await anim.finished;
  }

  /** 큐 클리어 */
  clear(): void {
    this.queue = [];
  }

  private async processQueue(): Promise<void> {
    this.running = true;
    while (this.queue.length > 0) {
      const fn = this.queue.shift()!;
      await fn();
    }
    this.running = false;
  }
}

/** 싱글톤 인스턴스 */
export const animationManager = new AnimationManager();
