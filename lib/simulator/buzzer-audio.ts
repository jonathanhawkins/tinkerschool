/**
 * BuzzerAudio -- Web Audio API manager for the M5StickC Plus 2 buzzer simulator.
 *
 * Plays square-wave tones to mimic the piezo buzzer on the real device.
 * AudioContext is lazily created on first use (requires a user gesture in
 * most browsers to satisfy autoplay policy).
 *
 * Usage:
 *   const buzzer = new BuzzerAudio();
 *   buzzer.playTone(440, 200);  // A4 for 200ms
 *   buzzer.muted = true;        // silence future tones
 *   buzzer.dispose();           // clean up when done
 */
export class BuzzerAudio {
  private audioCtx: AudioContext | null = null;
  private _muted: boolean = false;

  /** Volume gain (0.0 - 1.0). Kept low since it's a buzzer simulation. */
  private static readonly GAIN = 0.08;

  /** localStorage key for persisting the mute preference */
  private static readonly MUTE_KEY = "tinkerschool:buzzer-muted";

  constructor() {
    // Restore mute preference from localStorage
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(BuzzerAudio.MUTE_KEY);
        if (stored === "true") {
          this._muted = true;
        }
      } catch {
        // localStorage may be unavailable (e.g., incognito in some browsers)
      }
    }
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /**
   * Whether audio output is muted.
   */
  get muted(): boolean {
    return this._muted;
  }

  set muted(value: boolean) {
    this._muted = value;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(BuzzerAudio.MUTE_KEY, String(value));
      } catch {
        // Ignore storage errors
      }
    }
  }

  /**
   * Play a square-wave tone at the given frequency for the given duration.
   * No-ops if muted or if frequency/duration are invalid.
   *
   * The AudioContext is lazily created on first call. This method should be
   * called from a user-gesture context (e.g., after clicking "Run") to
   * satisfy browser autoplay restrictions.
   *
   * @param frequency - Tone frequency in Hz (20 - 20000)
   * @param durationMs - Tone duration in milliseconds
   */
  playTone(frequency: number, durationMs: number): void {
    if (this._muted) return;
    if (frequency <= 0 || durationMs <= 0) return;

    // Clamp to audible range
    const freq = Math.max(20, Math.min(20000, frequency));
    const durSec = Math.min(durationMs, 5000) / 1000;

    const ctx = this.ensureContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square"; // Closest to a piezo buzzer sound
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Start at target volume, then ramp down at the end to avoid click
    gain.gain.setValueAtTime(BuzzerAudio.GAIN, ctx.currentTime);
    gain.gain.setValueAtTime(BuzzerAudio.GAIN, ctx.currentTime + durSec - 0.005);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + durSec);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + durSec);

    // Clean up nodes after the tone finishes to avoid memory leaks
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  /**
   * Resume the AudioContext if it was suspended (browser autoplay policy).
   * Call this from a user-gesture handler (e.g., the "Run" button click).
   */
  resume(): void {
    if (this.audioCtx?.state === "suspended") {
      this.audioCtx.resume().catch(() => {
        // Ignore -- context will resume on next user gesture
      });
    }
  }

  /**
   * Dispose of the AudioContext and release resources.
   * Call when the component unmounts.
   */
  dispose(): void {
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {
        // Ignore close errors
      });
      this.audioCtx = null;
    }
  }

  // -------------------------------------------------------------------------
  // Internal
  // -------------------------------------------------------------------------

  /**
   * Lazily create the AudioContext on first use.
   * Returns null if the Web Audio API is unavailable.
   */
  private ensureContext(): AudioContext | null {
    if (this.audioCtx) {
      // Resume if suspended (e.g., after tab became inactive)
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    }

    if (typeof window === "undefined") return null;

    const AudioCtxClass =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioCtxClass) return null;

    try {
      this.audioCtx = new AudioCtxClass();
      return this.audioCtx;
    } catch {
      return null;
    }
  }
}
