import { describe, it, expect, vi, beforeEach } from "vitest";
import { BuzzerAudio } from "./buzzer-audio";

// ---------------------------------------------------------------------------
// Mock Web Audio API
// ---------------------------------------------------------------------------

function createMockOsc() {
  return {
    type: "",
    frequency: { setValueAtTime: vi.fn() },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    disconnect: vi.fn(),
    onended: null as (() => void) | null,
  };
}

function createMockGain() {
  return {
    gain: {
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
    disconnect: vi.fn(),
  };
}

let lastOsc: ReturnType<typeof createMockOsc>;
let lastGain: ReturnType<typeof createMockGain>;

const storage = new Map<string, string>();

beforeEach(() => {
  vi.clearAllMocks();
  storage.clear();

  vi.stubGlobal("localStorage", {
    getItem: vi.fn((key: string) => storage.get(key) ?? null),
    setItem: vi.fn((key: string, val: string) => storage.set(key, val)),
  });

  // Create fresh mocks for each test
  lastOsc = createMockOsc();
  lastGain = createMockGain();

  // Use a proper class mock for AudioContext
  vi.stubGlobal("AudioContext", class MockAudioContext {
    currentTime = 0;
    state = "running";
    destination = {};
    createOscillator() { return lastOsc; }
    createGain() { return lastGain; }
    resume() { return Promise.resolve(); }
    close() { return Promise.resolve(); }
  });
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("BuzzerAudio", () => {
  describe("constructor", () => {
    it("restores mute preference from localStorage", () => {
      storage.set("tinkerschool:buzzer-muted", "true");
      const buzzer = new BuzzerAudio();
      expect(buzzer.muted).toBe(true);
    });

    it("defaults to unmuted", () => {
      const buzzer = new BuzzerAudio();
      expect(buzzer.muted).toBe(false);
    });
  });

  describe("muted property", () => {
    it("persists mute state to localStorage", () => {
      const buzzer = new BuzzerAudio();
      buzzer.muted = true;
      expect(storage.get("tinkerschool:buzzer-muted")).toBe("true");

      buzzer.muted = false;
      expect(storage.get("tinkerschool:buzzer-muted")).toBe("false");
    });
  });

  describe("playTone", () => {
    it("creates oscillator with square wave type", () => {
      const buzzer = new BuzzerAudio();
      buzzer.playTone(440, 200);
      expect(lastOsc.type).toBe("square");
    });

    it("does nothing when muted", () => {
      const buzzer = new BuzzerAudio();
      buzzer.muted = true;
      buzzer.playTone(440, 200);
      expect(lastOsc.start).not.toHaveBeenCalled();
    });

    it("does nothing for invalid frequency", () => {
      const buzzer = new BuzzerAudio();
      buzzer.playTone(0, 200);
      expect(lastOsc.start).not.toHaveBeenCalled();
    });

    it("does nothing for invalid duration", () => {
      const buzzer = new BuzzerAudio();
      buzzer.playTone(440, 0);
      expect(lastOsc.start).not.toHaveBeenCalled();
    });

    it("clamps frequency to audible range", () => {
      const buzzer = new BuzzerAudio();
      buzzer.playTone(5, 200);
      expect(lastOsc.frequency.setValueAtTime).toHaveBeenCalledWith(20, 0);
    });

    it("connects oscillator through gain to destination", () => {
      const buzzer = new BuzzerAudio();
      buzzer.playTone(440, 200);
      expect(lastOsc.connect).toHaveBeenCalledWith(lastGain);
      expect(lastGain.connect).toHaveBeenCalled();
    });

    it("starts and schedules stop for oscillator", () => {
      const buzzer = new BuzzerAudio();
      buzzer.playTone(440, 200);
      expect(lastOsc.start).toHaveBeenCalled();
      expect(lastOsc.stop).toHaveBeenCalled();
    });
  });

  describe("dispose", () => {
    it("allows playTone to be called without error after dispose", () => {
      const buzzer = new BuzzerAudio();
      buzzer.playTone(440, 100);
      buzzer.dispose();
      // After dispose, next playTone creates a new context
      buzzer.playTone(440, 100);
      expect(lastOsc.start).toHaveBeenCalled();
    });
  });
});
