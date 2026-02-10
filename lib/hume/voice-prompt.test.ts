import { describe, it, expect } from "vitest";

import { buildVoiceSystemPrompt } from "./voice-prompt";
import type { VoicePageContext } from "./types";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const baseContext: VoicePageContext = {
  childName: "Cassidy",
  age: 7,
  gradeLevel: 1,
  currentStreak: 0,
  xp: 0,
  deviceMode: "none",
  subjects: [
    { name: "Math", slug: "math" },
    { name: "Reading", slug: "reading" },
    { name: "Coding", slug: "coding" },
  ],
  completedLessonCount: 0,
};

const newUserCtx: VoicePageContext = { ...baseContext };

const returningCtx: VoicePageContext = {
  ...baseContext,
  completedLessonCount: 5,
  xp: 250,
  currentStreak: 3,
};

// ---------------------------------------------------------------------------
// Basic prompt content
// ---------------------------------------------------------------------------

describe("buildVoiceSystemPrompt", () => {
  describe("basic prompt content", () => {
    it("contains child name, age, and grade level", () => {
      const prompt = buildVoiceSystemPrompt(newUserCtx, "/home");
      expect(prompt).toContain("Cassidy");
      expect(prompt).toContain("age 7");
      expect(prompt).toContain("grade 1");
    });

    it("contains Chip identity", () => {
      const prompt = buildVoiceSystemPrompt(newUserCtx, "/home");
      expect(prompt).toContain("Chip");
      expect(prompt).toContain("friendly robot learning buddy");
    });

    it.each([
      ["/home", "Mission Control"],
      ["/workshop", "Workshop"],
      ["/subjects", "Explore Subjects"],
      ["/gallery", "Gallery"],
      ["/achievements", "Achievements"],
      ["/lessons/abc-123", "Lesson"],
      ["/setup", "Device Setup"],
      ["/help", "Help"],
      ["/settings", "Settings"],
    ])("contains page name %s -> %s", (pathname, expectedPageName) => {
      const prompt = buildVoiceSystemPrompt(newUserCtx, pathname);
      expect(prompt).toContain(expectedPageName);
    });

    it("contains navigation destinations", () => {
      const prompt = buildVoiceSystemPrompt(newUserCtx, "/home");
      expect(prompt).toContain("## Navigation");
      expect(prompt).toContain("/home");
      expect(prompt).toContain("/workshop");
      expect(prompt).toContain("/gallery");
      expect(prompt).toContain("/achievements");
      expect(prompt).toContain("/setup");
      expect(prompt).toContain("/settings");
      expect(prompt).toContain("/help");
    });

    it("contains voice conversation rules", () => {
      const prompt = buildVoiceSystemPrompt(newUserCtx, "/home");
      expect(prompt).toContain("## Voice Conversation Rules");
      expect(prompt).toContain("Keep responses SHORT");
      expect(prompt).toContain("Always end with a question");
    });
  });

  // ---------------------------------------------------------------------------
  // New user (completedLessonCount: 0, no inProgressLesson)
  // ---------------------------------------------------------------------------

  describe("new user (completedLessonCount: 0)", () => {
    it("contains First-Time User onboarding section", () => {
      const prompt = buildVoiceSystemPrompt(newUserCtx, "/home");
      expect(prompt).toContain("First-Time User");
      expect(prompt).toContain("Guided Onboarding");
    });

    it("does NOT contain Returning User section", () => {
      const prompt = buildVoiceSystemPrompt(newUserCtx, "/home");
      expect(prompt).not.toContain("## Returning User Context");
    });

    it("home page: contains subject list and asks to pick a subject", () => {
      const prompt = buildVoiceSystemPrompt(newUserCtx, "/home");
      expect(prompt).toContain("Mission Control");
      expect(prompt).toContain("Math, Reading, Coding");
      expect(prompt).toContain("What sounds fun");
    });

    it("subjects page: contains guidance about lesson cards", () => {
      const prompt = buildVoiceSystemPrompt(newUserCtx, "/subjects");
      expect(prompt).toContain("Subject Browser");
      expect(prompt).toContain("all the subjects");
    });

    it("specific subject page (/subjects/math): contains that subject name", () => {
      const prompt = buildVoiceSystemPrompt(newUserCtx, "/subjects/math");
      expect(prompt).toContain("Math");
      expect(prompt).toContain("Math Subject Page");
      expect(prompt).toContain("lesson cards");
    });

    it("lessons page: contains guidance about lesson content", () => {
      const prompt = buildVoiceSystemPrompt(newUserCtx, "/lessons/some-id");
      expect(prompt).toContain("A Lesson Page");
      expect(prompt).toContain("lesson");
      expect(prompt).toContain("Socratic method");
    });

    it("workshop page: contains guidance about code editor and simulator", () => {
      const prompt = buildVoiceSystemPrompt(newUserCtx, "/workshop");
      expect(prompt).toContain("Code Workshop");
      expect(prompt).toContain("Code editor");
      expect(prompt).toContain("simulator");
    });

    it("achievements page: mentions empty badges and suggests starting a lesson", () => {
      const prompt = buildVoiceSystemPrompt(newUserCtx, "/achievements");
      expect(prompt).toContain("badges");
      expect(prompt).toContain("empty");
      expect(prompt).toContain("start a lesson");
    });

    it("gallery page: mentions empty gallery", () => {
      const prompt = buildVoiceSystemPrompt(newUserCtx, "/gallery");
      expect(prompt).toContain("Gallery");
      expect(prompt).toContain("empty right now");
    });

    it("help page: offers to answer questions", () => {
      const prompt = buildVoiceSystemPrompt(newUserCtx, "/help");
      expect(prompt).toContain("Help");
      expect(prompt).toContain("ask me anything");
    });

    it("fallback (unknown page): greets by name and offers Mission Control", () => {
      const prompt = buildVoiceSystemPrompt(newUserCtx, "/some-unknown-page");
      expect(prompt).toContain("Cassidy");
      expect(prompt).toContain("Mission Control");
    });
  });

  // ---------------------------------------------------------------------------
  // Returning user (completedLessonCount > 0)
  // ---------------------------------------------------------------------------

  describe("returning user (completedLessonCount > 0)", () => {
    it("contains Returning User section", () => {
      const prompt = buildVoiceSystemPrompt(returningCtx, "/home");
      expect(prompt).toContain("## Returning User Context");
    });

    it("does NOT contain First-Time User section", () => {
      const prompt = buildVoiceSystemPrompt(returningCtx, "/home");
      expect(prompt).not.toContain("First-Time User");
    });

    it("with inProgressLesson on home: mentions lesson title and suggests continuing", () => {
      const ctx: VoicePageContext = {
        ...returningCtx,
        inProgressLesson: {
          title: "Rainbow LED",
          subject: "Coding",
          id: "lesson-42",
        },
      };
      const prompt = buildVoiceSystemPrompt(ctx, "/home");
      expect(prompt).toContain("Rainbow LED");
      expect(prompt).toContain("Coding");
      expect(prompt).toContain("/lessons/lesson-42");
      expect(prompt).toContain("jump back in");
    });

    it("with currentStreak > 0: celebrates the streak", () => {
      const prompt = buildVoiceSystemPrompt(returningCtx, "/home");
      expect(prompt).toContain("3-day streak");
    });

    it("home page without inProgressLesson: suggests learning adventure", () => {
      const prompt = buildVoiceSystemPrompt(returningCtx, "/home");
      expect(prompt).toContain("Page Guidance (Mission Control)");
      expect(prompt).toContain("learning adventure");
    });

    it("workshop page: references the workspace and device mode", () => {
      const prompt = buildVoiceSystemPrompt(returningCtx, "/workshop");
      expect(prompt).toContain("Page Guidance (Workshop)");
      expect(prompt).toContain("Workshop");
      expect(prompt).toContain("simulator");
    });

    it("workshop page with USB device: mentions M5Stick connected", () => {
      const ctx: VoicePageContext = { ...returningCtx, deviceMode: "usb" };
      const prompt = buildVoiceSystemPrompt(ctx, "/workshop");
      expect(prompt).toContain("M5Stick is connected");
    });

    it("achievements page: celebrates badges and suggests earning more", () => {
      const prompt = buildVoiceSystemPrompt(returningCtx, "/achievements");
      expect(prompt).toContain("Page Guidance (Achievements)");
      expect(prompt).toContain("badges");
      expect(prompt).toContain("5 lessons");
    });

    it("subjects page: helps pick a subject", () => {
      const prompt = buildVoiceSystemPrompt(returningCtx, "/subjects");
      expect(prompt).toContain("Page Guidance (Subject Browser)");
      expect(prompt).toContain("in the mood for");
    });

    it("specific subject page (/subjects/math): references that subject", () => {
      const prompt = buildVoiceSystemPrompt(returningCtx, "/subjects/math");
      expect(prompt).toContain("Page Guidance (Math)");
      expect(prompt).toContain("Math lessons");
    });

    it("lessons page: offers help with the current lesson", () => {
      const prompt = buildVoiceSystemPrompt(returningCtx, "/lessons/some-id");
      expect(prompt).toContain("Page Guidance (Lesson)");
      expect(prompt).toContain("Socratic method");
    });

    it("gallery page: references projects", () => {
      const prompt = buildVoiceSystemPrompt(returningCtx, "/gallery");
      expect(prompt).toContain("Page Guidance (Gallery)");
      expect(prompt).toContain("projects");
    });

    it("setup page: references device setup", () => {
      const prompt = buildVoiceSystemPrompt(returningCtx, "/setup");
      expect(prompt).toContain("Page Guidance (Device Setup)");
    });

    it("help page: offers assistance", () => {
      const prompt = buildVoiceSystemPrompt(returningCtx, "/help");
      expect(prompt).toContain("Page Guidance (Help)");
      expect(prompt).toContain("help you with");
    });

    it("settings page: acknowledges settings", () => {
      const prompt = buildVoiceSystemPrompt(returningCtx, "/settings");
      expect(prompt).toContain("Page Guidance (Settings)");
    });

    it("unknown page: falls back to generic greeting", () => {
      const prompt = buildVoiceSystemPrompt(returningCtx, "/some-random-page");
      expect(prompt).toContain("Page Guidance");
      expect(prompt).toContain("Cassidy");
    });
  });

  // ---------------------------------------------------------------------------
  // Progress data
  // ---------------------------------------------------------------------------

  describe("progress data", () => {
    it("XP value appears in prompt", () => {
      const prompt = buildVoiceSystemPrompt(returningCtx, "/home");
      expect(prompt).toContain("XP: 250");
    });

    it("completed lesson count appears in prompt", () => {
      const prompt = buildVoiceSystemPrompt(returningCtx, "/home");
      expect(prompt).toContain("Lessons completed: 5");
    });

    it("device mode 'none' shows no device set up", () => {
      const prompt = buildVoiceSystemPrompt(newUserCtx, "/home");
      expect(prompt).toContain("No device set up yet");
    });

    it("device mode 'usb' shows M5StickC connected", () => {
      const ctx: VoicePageContext = { ...newUserCtx, deviceMode: "usb" };
      const prompt = buildVoiceSystemPrompt(ctx, "/home");
      expect(prompt).toContain("M5StickC Plus 2 connected via USB");
    });

    it("device mode 'simulator' shows simulator usage", () => {
      const ctx: VoicePageContext = {
        ...newUserCtx,
        deviceMode: "simulator",
      };
      const prompt = buildVoiceSystemPrompt(ctx, "/home");
      expect(prompt).toContain("Using the simulator");
    });
  });

  // ---------------------------------------------------------------------------
  // Subject list and navigation links
  // ---------------------------------------------------------------------------

  describe("subject list and navigation links", () => {
    it("subject navigation targets appear in prompt", () => {
      const prompt = buildVoiceSystemPrompt(newUserCtx, "/home");
      expect(prompt).toContain("/subjects/math");
      expect(prompt).toMatch(/\/subjects\/math\s.*Math/);
      expect(prompt).toContain("/subjects/reading");
      expect(prompt).toMatch(/\/subjects\/reading\s.*Reading/);
      expect(prompt).toContain("/subjects/coding");
      expect(prompt).toMatch(/\/subjects\/coding\s.*Coding/);
    });

    it("in-progress lesson navigation link appears when set", () => {
      const ctx: VoicePageContext = {
        ...returningCtx,
        inProgressLesson: {
          title: "Buzzer Beat",
          subject: "Music",
          id: "lesson-99",
        },
      };
      const prompt = buildVoiceSystemPrompt(ctx, "/home");
      expect(prompt).toContain('/lessons/lesson-99 — Continue "Buzzer Beat"');
    });

    it("no in-progress lesson link when none is set", () => {
      const prompt = buildVoiceSystemPrompt(newUserCtx, "/home");
      expect(prompt).not.toContain("Continue");
    });
  });
});
