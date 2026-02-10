// ---------------------------------------------------------------------------
// Sound Manager - Web Audio API synthesized sound effects for TinkerSchool
// ---------------------------------------------------------------------------
// Generates all sounds programmatically using oscillators and noise.
// Zero audio files, zero network requests, works offline.
// ---------------------------------------------------------------------------

const STORAGE_KEY = "tinkerschool-sound-prefs";

export type SoundEffect =
  | "correct"
  | "incorrect"
  | "tap"
  | "flip"
  | "match"
  | "streak"
  | "complete"
  | "star"
  | "hint"
  | "whoosh";

interface SoundPrefs {
  volume: number;
  muted: boolean;
}

function loadPrefs(): SoundPrefs {
  if (typeof window === "undefined") {
    return { volume: 0.5, muted: false };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SoundPrefs>;
      return {
        volume: typeof parsed.volume === "number" ? Math.min(1, Math.max(0, parsed.volume)) : 0.5,
        muted: typeof parsed.muted === "boolean" ? parsed.muted : false,
      };
    }
  } catch {
    // Corrupted data, use defaults
  }
  return { volume: 0.5, muted: false };
}

function savePrefs(prefs: SoundPrefs): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // localStorage full or unavailable, ignore
  }
}

// ---------------------------------------------------------------------------
// Singleton SoundManager
// ---------------------------------------------------------------------------

class SoundManager {
  private ctx: AudioContext | null = null;
  private prefs: SoundPrefs;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.prefs = loadPrefs();
  }

  // -------------------------------------------------------------------------
  // AudioContext lazy initialization
  // -------------------------------------------------------------------------

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.ctx) {
      try {
        this.ctx = new AudioContext();
      } catch {
        return null;
      }
    }

    // Resume if suspended (browser autoplay policy)
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  get volume(): number {
    return this.prefs.volume;
  }

  get muted(): boolean {
    return this.prefs.muted;
  }

  setVolume(v: number): void {
    this.prefs.volume = Math.min(1, Math.max(0, v));
    savePrefs(this.prefs);
    this.notify();
  }

  toggleMute(): void {
    this.prefs.muted = !this.prefs.muted;
    savePrefs(this.prefs);
    this.notify();
  }

  /** Subscribe to preference changes. Returns an unsubscribe function. */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const fn of this.listeners) {
      fn();
    }
  }

  /** Play a sound effect. No-op if muted or AudioContext unavailable. */
  play(effect: SoundEffect): void {
    if (this.prefs.muted) return;

    const ctx = this.ensureContext();
    if (!ctx) return;

    const gain = this.prefs.volume;

    switch (effect) {
      case "correct":
        this.playCorrect(ctx, gain);
        break;
      case "incorrect":
        this.playIncorrect(ctx, gain);
        break;
      case "tap":
        this.playTap(ctx, gain);
        break;
      case "flip":
        this.playFlip(ctx, gain);
        break;
      case "match":
        this.playMatch(ctx, gain);
        break;
      case "streak":
        this.playStreak(ctx, gain);
        break;
      case "complete":
        this.playComplete(ctx, gain);
        break;
      case "star":
        this.playStar(ctx, gain);
        break;
      case "hint":
        this.playHint(ctx, gain);
        break;
      case "whoosh":
        this.playWhoosh(ctx, gain);
        break;
    }
  }

  // -------------------------------------------------------------------------
  // Helpers for oscillator/gain creation
  // -------------------------------------------------------------------------

  private createOsc(
    ctx: AudioContext,
    type: OscillatorType,
    freq: number,
    gainValue: number,
    startTime: number,
    duration: number,
    destination?: AudioNode,
  ): OscillatorNode {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gainNode.gain.setValueAtTime(gainValue, startTime);
    // Quick fade-out to prevent click
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(gainNode);
    gainNode.connect(destination ?? ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
    return osc;
  }

  private createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const length = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // -------------------------------------------------------------------------
  // Individual sound effect synthesizers
  // -------------------------------------------------------------------------

  /** Rising two-tone chime: C5 -> E5 */
  private playCorrect(ctx: AudioContext, vol: number): void {
    const now = ctx.currentTime;
    const v = vol * 0.3;
    // C5 = 523.25 Hz
    this.createOsc(ctx, "sine", 523.25, v, now, 0.12);
    // E5 = 659.25 Hz
    this.createOsc(ctx, "sine", 659.25, v, now + 0.1, 0.15);
  }

  /** Gentle low tone: G3 */
  private playIncorrect(ctx: AudioContext, vol: number): void {
    const now = ctx.currentTime;
    const v = vol * 0.15; // Extra soft
    this.createOsc(ctx, "sine", 196.0, v, now, 0.18);
    // Slight wobble for "soft buzz" feel
    this.createOsc(ctx, "sine", 185.0, v * 0.5, now, 0.18);
  }

  /** Quick click: very short burst */
  private playTap(ctx: AudioContext, vol: number): void {
    const now = ctx.currentTime;
    const v = vol * 0.2;
    this.createOsc(ctx, "sine", 800, v, now, 0.025);
    // Tiny high harmonic for "click" texture
    this.createOsc(ctx, "triangle", 1200, v * 0.3, now, 0.015);
  }

  /** Swoosh: filtered noise sweep */
  private playFlip(ctx: AudioContext, vol: number): void {
    const now = ctx.currentTime;
    const buffer = this.createNoiseBuffer(ctx, 0.25);
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 0.12);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.25);
    filter.Q.setValueAtTime(2, now);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(vol * 0.12, now);
    gainNode.gain.linearRampToValueAtTime(vol * 0.2, now + 0.06);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start(now);
    source.stop(now + 0.26);
  }

  /** Three ascending tones: C5 -> E5 -> G5 */
  private playMatch(ctx: AudioContext, vol: number): void {
    const now = ctx.currentTime;
    const v = vol * 0.25;
    this.createOsc(ctx, "sine", 523.25, v, now, 0.1); // C5
    this.createOsc(ctx, "sine", 659.25, v, now + 0.08, 0.1); // E5
    this.createOsc(ctx, "sine", 783.99, v, now + 0.16, 0.15); // G5
  }

  /** Arpeggio run: C5-E5-G5-C6 */
  private playStreak(ctx: AudioContext, vol: number): void {
    const now = ctx.currentTime;
    const v = vol * 0.25;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      this.createOsc(ctx, "sine", freq, v, now + i * 0.06, 0.12);
      // Add a subtle triangle for shimmer
      this.createOsc(ctx, "triangle", freq * 2, v * 0.15, now + i * 0.06, 0.08);
    });
  }

  /** Major chord celebration: C-E-G held + octave C */
  private playComplete(ctx: AudioContext, vol: number): void {
    const now = ctx.currentTime;
    const v = vol * 0.2;

    // Held major chord
    const chord = [523.25, 659.25, 783.99]; // C5, E5, G5
    chord.forEach((freq) => {
      this.createOsc(ctx, "sine", freq, v, now, 0.5);
      this.createOsc(ctx, "triangle", freq, v * 0.3, now, 0.45);
    });

    // Octave C after the chord
    this.createOsc(ctx, "sine", 1046.5, v * 1.2, now + 0.35, 0.3); // C6
    this.createOsc(ctx, "triangle", 1046.5, v * 0.4, now + 0.35, 0.25);
  }

  /** Sparkle: high random-ish tones */
  private playStar(ctx: AudioContext, vol: number): void {
    const now = ctx.currentTime;
    const v = vol * 0.18;
    // Series of high tones with slight randomization for sparkle effect
    const baseTones = [1318, 1568, 2093, 1760, 2349];
    baseTones.forEach((freq, i) => {
      const variation = freq + (Math.random() * 40 - 20);
      this.createOsc(ctx, "sine", variation, v, now + i * 0.05, 0.1);
    });
  }

  /** Soft two-note: G4 -> C5 */
  private playHint(ctx: AudioContext, vol: number): void {
    const now = ctx.currentTime;
    const v = vol * 0.15;
    this.createOsc(ctx, "sine", 392.0, v, now, 0.12); // G4
    this.createOsc(ctx, "sine", 523.25, v, now + 0.1, 0.15); // C5
  }

  /** Filtered noise sweep */
  private playWhoosh(ctx: AudioContext, vol: number): void {
    const now = ctx.currentTime;
    const buffer = this.createNoiseBuffer(ctx, 0.25);
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(4000, now + 0.1);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.22);
    filter.Q.setValueAtTime(1, now);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(vol * 0.15, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start(now);
    source.stop(now + 0.25);
  }
}

// ---------------------------------------------------------------------------
// Singleton instance
// ---------------------------------------------------------------------------

let instance: SoundManager | null = null;

export function getSoundManager(): SoundManager {
  if (!instance) {
    instance = new SoundManager();
  }
  return instance;
}
