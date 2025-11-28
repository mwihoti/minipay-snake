// Audio manager - generates simple beep sounds without external dependencies
export class AudioManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioContextClass();
      } catch (e) {
        console.warn('Web Audio API not available');
        this.enabled = false;
      }
    }
  }

  private playTone(frequency: number, duration: number, volume: number = 0.3): void {
    if (!this.enabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  playMove(): void {
    this.playTone(400, 0.05, 0.1);
  }

  playEat(): void {
    this.playTone(600, 0.1, 0.2);
    setTimeout(() => this.playTone(800, 0.1, 0.2), 50);
  }

  playCollision(): void {
    this.playTone(200, 0.3, 0.3);
  }

  playPowerup(): void {
    this.playTone(1000, 0.1, 0.2);
    setTimeout(() => this.playTone(1200, 0.1, 0.2), 100);
  }

  playGameOver(): void {
    this.playTone(300, 0.2, 0.3);
    setTimeout(() => this.playTone(200, 0.4, 0.3), 200);
  }

  playSunsetUnlock(): void {
    // Ascending tones for celebration
    this.playTone(400, 0.1, 0.2);
    setTimeout(() => this.playTone(600, 0.1, 0.2), 100);
    setTimeout(() => this.playTone(800, 0.2, 0.2), 200);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

export const audioManager = new AudioManager();
