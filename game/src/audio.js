// Twin Worlds — all sound, synthesised live with Web Audio.
// No audio files, no network: every effect is a short oscillator phrase
// built when it is needed. The engine stays silent until the first user
// gesture creates the audio context.
export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      } catch {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  tone(freq, at, dur, type, vol) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const t0 = ctx.currentTime + at;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  // Two bright notes: a find should feel like a small reward.
  found() {
    this.tone(880, 0, 0.16, 'sine', 0.22);
    this.tone(1318, 0.09, 0.24, 'sine', 0.2);
  }

  wrong() {
    this.tone(160, 0, 0.22, 'sawtooth', 0.12);
    this.tone(110, 0.05, 0.25, 'sawtooth', 0.1);
  }

  hint() {
    this.tone(1568, 0, 0.12, 'triangle', 0.16);
    this.tone(2093, 0.08, 0.18, 'triangle', 0.14);
  }

  levelClear() {
    [523, 659, 784, 1047].forEach((f, i) => this.tone(f, i * 0.11, 0.22, 'triangle', 0.18));
  }

  win() {
    [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => this.tone(f, i * 0.12, 0.3, 'triangle', 0.18));
  }

  gameOver() {
    [392, 330, 262].forEach((f, i) => this.tone(f, i * 0.16, 0.3, 'sine', 0.16));
  }

  // A soft tick while the clock is in the red.
  hurryTick() {
    this.tone(1200, 0, 0.05, 'square', 0.05);
  }
}
