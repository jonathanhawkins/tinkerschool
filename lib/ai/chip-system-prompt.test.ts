import { describe, it, expect } from "vitest";

import { getChipSystemPrompt } from "./chip-system-prompt";
import type { ChipContext } from "./chip-system-prompt";

describe("getChipSystemPrompt", () => {
  const baseParams: ChipContext = {
    childName: "Cassidy",
    age: 7,
    gradeLevel: 2,
  };

  it("returns a non-empty string", () => {
    const result = getChipSystemPrompt(baseParams);
    expect(result.length).toBeGreaterThan(0);
  });

  it("contains the child's name", () => {
    const result = getChipSystemPrompt(baseParams);
    expect(result).toContain("Cassidy");
  });

  it("contains the child's age", () => {
    const result = getChipSystemPrompt(baseParams);
    expect(result).toContain("age 7");
  });

  it("contains the grade level", () => {
    const result = getChipSystemPrompt(baseParams);
    expect(result).toContain("grade 2");
  });

  it("contains the band name derived from grade level", () => {
    const result = getChipSystemPrompt(baseParams);
    expect(result).toContain("Builder");
  });

  it("uses correct band names for all grade levels", () => {
    const gradeToExpectedBand: Record<number, string> = {
      0: "Explorer",
      1: "Explorer",
      2: "Builder",
      3: "Inventor",
      4: "Hacker",
      5: "Creator",
      6: "Creator",
    };

    for (const [grade, expectedBand] of Object.entries(gradeToExpectedBand)) {
      const result = getChipSystemPrompt({
        childName: "Test",
        age: 7,
        gradeLevel: Number(grade),
      });
      expect(result).toContain(expectedBand);
    }
  });

  describe("language complexity by age/gradeLevel", () => {
    it("uses very simple language for age 5 / grade 1", () => {
      const result = getChipSystemPrompt({
        childName: "Leo",
        age: 5,
        gradeLevel: 1,
      });

      expect(result).toContain("very simple words");
      expect(result).toContain("1-2 short sentences");
    });

    it("uses 2nd grader language for age 7 / grade 2", () => {
      const result = getChipSystemPrompt({
        childName: "Cassidy",
        age: 7,
        gradeLevel: 2,
      });

      expect(result).toContain("2nd grader");
      expect(result).toContain("2-3 sentences");
    });

    it("uses 3rd-4th grader language for age 9 / grade 3", () => {
      const result = getChipSystemPrompt({
        childName: "Alex",
        age: 9,
        gradeLevel: 3,
      });

      expect(result).toContain("3rd-4th grader");
    });

    it("uses 4th-5th grader language for age 10 / grade 4", () => {
      const result = getChipSystemPrompt({
        childName: "Sam",
        age: 10,
        gradeLevel: 4,
      });

      expect(result).toContain("4th-5th grader");
    });

    it("uses 5th-6th grader language for age 12 / grade 5", () => {
      const result = getChipSystemPrompt({
        childName: "Jordan",
        age: 12,
        gradeLevel: 5,
      });

      expect(result).toContain("5th-6th grader");
    });
  });

  describe("subject-specific guidance", () => {
    it("includes math guidance when subject is math", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentSubject: "math",
      });

      expect(result).toContain("Subject: Math");
      expect(result).toContain("concrete objects");
      expect(result).toContain("NEVER just give the answer");
    });

    it("includes reading guidance when subject is reading", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentSubject: "reading",
      });

      expect(result).toContain("Subject: Reading");
      expect(result).toContain("Sound out words");
      expect(result).toContain("phonics");
    });

    it("includes science guidance when subject is science", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentSubject: "science",
      });

      expect(result).toContain("Subject: Science");
      expect(result).toContain("What do you notice");
      expect(result).toContain("What do you think will happen");
    });

    it("includes music guidance when subject is music", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentSubject: "music",
      });

      expect(result).toContain("Subject: Music");
      expect(result).toContain("rhythm");
      expect(result).toContain("buzzer");
    });

    it("includes art guidance when subject is art", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentSubject: "art",
      });

      expect(result).toContain("Subject: Art");
      expect(result).toContain("no wrong answer");
      expect(result).toContain("color");
    });

    it("includes problem solving guidance when subject is problem_solving", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentSubject: "problem_solving",
      });

      expect(result).toContain("Subject: Problem Solving");
      expect(result).toContain("What's the first step");
      expect(result).toContain("Do you see a pattern");
    });

    it("includes coding guidance when subject is coding", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentSubject: "coding",
      });

      expect(result).toContain("Subject: Coding");
      expect(result).toContain("hints, not solutions");
      expect(result).toContain("Celebrate debugging");
    });

    it("omits subject section when no subject is provided", () => {
      const result = getChipSystemPrompt(baseParams);

      expect(result).not.toContain("## Subject:");
    });

    it("uses subject display name in intro", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentSubject: "problem_solving",
      });

      expect(result).toContain("learn Problem Solving");
    });

    it("falls back to problem_solving guidance for unknown subjects", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentSubject: "underwater_basket_weaving",
      });

      expect(result).toContain("Subject: Problem Solving");
    });
  });

  describe("learning style adaptation", () => {
    it("adapts for visual learners", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: {
            visual: 0.5,
            auditory: 0.2,
            kinesthetic: 0.2,
            reading_writing: 0.1,
          },
          interests: [],
          preferredEncouragement: "enthusiastic",
          chipNotes: "",
        },
      });

      expect(result).toContain("Learning Style Adaptation");
      expect(result).toContain("VISUALLY");
      expect(result).toContain("picture this");
    });

    it("adapts for auditory learners", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: {
            visual: 0.1,
            auditory: 0.6,
            kinesthetic: 0.2,
            reading_writing: 0.1,
          },
          interests: [],
          preferredEncouragement: "enthusiastic",
          chipNotes: "",
        },
      });

      expect(result).toContain("LISTENING and SOUND");
      expect(result).toContain("listen to this");
    });

    it("adapts for kinesthetic learners", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: {
            visual: 0.1,
            auditory: 0.1,
            kinesthetic: 0.7,
            reading_writing: 0.1,
          },
          interests: [],
          preferredEncouragement: "enthusiastic",
          chipNotes: "",
        },
      });

      expect(result).toContain("DOING and MOVING");
      expect(result).toContain("Try shaking it");
    });

    it("adapts for reading/writing learners", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: {
            visual: 0.1,
            auditory: 0.1,
            kinesthetic: 0.1,
            reading_writing: 0.7,
          },
          interests: [],
          preferredEncouragement: "enthusiastic",
          chipNotes: "",
        },
      });

      expect(result).toContain("READING and WRITING");
      expect(result).toContain("written words");
    });

    it("omits learning style section when no profile is provided", () => {
      const result = getChipSystemPrompt(baseParams);

      expect(result).not.toContain("Learning Style Adaptation");
    });
  });

  describe("encouragement style", () => {
    it("uses enthusiastic encouragement when preferred", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: { visual: 1 },
          interests: [],
          preferredEncouragement: "enthusiastic",
          chipNotes: "",
        },
      });

      expect(result).toContain("Encouragement Style");
      expect(result).toContain("SUPERSTAR");
    });

    it("uses quiet encouragement when preferred", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: { visual: 1 },
          interests: [],
          preferredEncouragement: "quiet",
          chipNotes: "",
        },
      });

      expect(result).toContain("calm, warm encouragement");
    });

    it("uses humor encouragement when preferred", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: { visual: 1 },
          interests: [],
          preferredEncouragement: "humor",
          chipNotes: "",
        },
      });

      expect(result).toContain("silly jokes");
    });
  });

  describe("interest weaving", () => {
    it("includes interests when provided", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: { visual: 1 },
          interests: ["dinosaurs", "space", "animals"],
          preferredEncouragement: "enthusiastic",
          chipNotes: "",
        },
      });

      expect(result).toContain("Weave In Their Interests");
      expect(result).toContain("dinosaurs");
      expect(result).toContain("space");
      expect(result).toContain("animals");
    });

    it("omits interest section when interests are empty", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: { visual: 1 },
          interests: [],
          preferredEncouragement: "enthusiastic",
          chipNotes: "",
        },
      });

      expect(result).not.toContain("Weave In Their Interests");
    });

    it("omits interest section when no profile", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).not.toContain("Weave In Their Interests");
    });
  });

  describe("skill proficiency", () => {
    it("groups skills by proficiency level", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        skillProficiency: {
          addition: "mastered",
          subtraction: "proficient",
          multiplication: "developing",
          division: "beginning",
          fractions: "not_started",
        },
      });

      expect(result).toContain("Skill Awareness");
      expect(result).toContain("Strong skills");
      expect(result).toContain("addition");
      expect(result).toContain("subtraction");
      expect(result).toContain("Developing skills");
      expect(result).toContain("multiplication");
      expect(result).toContain("Beginning skills");
      expect(result).toContain("division");
    });

    it("converts underscored skill slugs to readable names", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        skillProficiency: {
          two_digit_addition: "developing",
        },
      });

      expect(result).toContain("two digit addition");
    });

    it("omits skill section when no proficiency data", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).not.toContain("Skill Awareness");
    });

    it("omits skill section when all skills are not_started", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        skillProficiency: {
          addition: "not_started",
          subtraction: "not_started",
        },
      });

      expect(result).not.toContain("Skill Awareness");
    });
  });

  describe("recent lessons", () => {
    it("includes recent lessons when provided", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        recentLessons: ["Counting to 20", "Addition with Pictures", "Shapes"],
      });

      expect(result).toContain("Recent Lessons Completed");
      expect(result).toContain("Counting to 20");
      expect(result).toContain("Addition with Pictures");
      expect(result).toContain("Shapes");
    });

    it("omits recent lessons section when not provided", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).not.toContain("Recent Lessons Completed");
    });

    it("omits recent lessons section when empty array", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        recentLessons: [],
      });
      expect(result).not.toContain("Recent Lessons Completed");
    });
  });

  describe("chip notes", () => {
    it("includes chip notes when provided", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: { visual: 1 },
          interests: [],
          preferredEncouragement: "enthusiastic",
          chipNotes:
            "Cassidy gets frustrated with word problems. Use extra patience and break into smaller steps.",
        },
      });

      expect(result).toContain("Your Notes About This Child");
      expect(result).toContain("gets frustrated with word problems");
    });

    it("omits chip notes when empty", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: { visual: 1 },
          interests: [],
          preferredEncouragement: "enthusiastic",
          chipNotes: "",
        },
      });

      expect(result).not.toContain("Your Notes About This Child");
    });
  });

  describe("lesson context", () => {
    it("includes lesson context when provided", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentLesson: "Blinking LED",
      });

      expect(result).toContain("Blinking LED");
      expect(result).toContain("Current Context");
    });

    it("omits lesson context when not provided", () => {
      const result = getChipSystemPrompt(baseParams);

      expect(result).not.toContain("Current Context");
    });
  });

  describe("code context", () => {
    it("includes code context when provided", () => {
      const code = 'M5.Lcd.drawString("Hi", 10, 20)';
      const result = getChipSystemPrompt({
        ...baseParams,
        currentCode: code,
      });

      expect(result).toContain(code);
      expect(result).toContain("```python");
      expect(result).toContain("Current Context");
    });

    it("omits code context when not provided", () => {
      const result = getChipSystemPrompt(baseParams);

      expect(result).not.toContain("```python");
    });
  });

  describe("both lesson and code context", () => {
    it("includes both when both are provided", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentLesson: "Display Fun",
        currentCode: "print('hello')",
      });

      expect(result).toContain("Display Fun");
      expect(result).toContain("print('hello')");
    });
  });

  describe("cross-subject connections", () => {
    it("includes cross-subject connection guidance", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("Cross-Subject Connections");
      expect(result).toContain(
        "connect what the child is learning to other subjects"
      );
    });
  });

  describe("M5StickC Plus 2 multi-subject features", () => {
    it("describes display for multi-subject use", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("flashcards");
      expect(result).toContain("number lines");
    });

    it("describes buzzer for multi-subject use", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("phonics sounds");
      expect(result).toContain("musical notes");
    });

    it("describes buttons for multi-subject use", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("answer choices");
    });

    it("describes IMU for multi-subject use", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("tilt to sort");
      expect(result).toContain("shake to shuffle");
    });

    it("describes LED for multi-subject use", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("even/odd indicator");
      expect(result).toContain("beat pulse");
    });
  });

  describe("safety guardrails", () => {
    it("includes the rule about not giving complete answers", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("NEVER give complete answers");
    });

    it("includes expanded topic allowances for all subjects", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("all school subjects");
      expect(result).toContain("math");
      expect(result).toContain("reading");
      expect(result).toContain("science");
    });

    it("includes the off-topic redirection guidance", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("get back to our");
    });

    it("includes the rule about keeping responses short", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("Keep responses SHORT");
    });

    it("includes encouragement for all kids", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain(
        "every child learns at their own pace"
      );
    });
  });

  describe("personality", () => {
    it("identifies itself as Chip", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("You are Chip");
    });

    it("describes a friendly robot learning buddy persona", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("friendly robot learning buddy");
    });

    it("mentions the M5StickC Plus 2 device", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("M5StickC Plus 2");
    });

    it("mentions TinkerSchool", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("TinkerSchool");
    });
  });

  describe("full integration", () => {
    it("generates a complete prompt with all optional fields", () => {
      const result = getChipSystemPrompt({
        childName: "Cassidy",
        age: 7,
        gradeLevel: 2,
        currentSubject: "math",
        currentLesson: "Addition with Pictures",
        currentCode: "count = 3 + 4",
        learningProfile: {
          learningStyle: {
            visual: 0.4,
            auditory: 0.3,
            kinesthetic: 0.2,
            reading_writing: 0.1,
          },
          interests: ["dinosaurs", "space"],
          preferredEncouragement: "enthusiastic",
          chipNotes: "Loves counting games. Gets frustrated with word problems.",
        },
        skillProficiency: {
          counting: "mastered",
          addition: "developing",
          subtraction: "beginning",
        },
        recentLessons: ["Counting to 20", "Number Lines"],
      });

      // Core identity
      expect(result).toContain("You are Chip");
      expect(result).toContain("Cassidy");
      expect(result).toContain("age 7");
      expect(result).toContain("grade 2");

      // Subject
      expect(result).toContain("Subject: Math");
      expect(result).toContain("learn Math");

      // Learning style
      expect(result).toContain("VISUALLY");

      // Encouragement
      expect(result).toContain("SUPERSTAR");

      // Interests
      expect(result).toContain("dinosaurs");
      expect(result).toContain("space");

      // Skills
      expect(result).toContain("counting");
      expect(result).toContain("addition");
      expect(result).toContain("subtraction");

      // Recent lessons
      expect(result).toContain("Counting to 20");
      expect(result).toContain("Number Lines");

      // Chip notes
      expect(result).toContain("Loves counting games");

      // Context
      expect(result).toContain("Addition with Pictures");
      expect(result).toContain("count = 3 + 4");

      // Cross-subject connections
      expect(result).toContain("Cross-Subject Connections");

      // Safety rules
      expect(result).toContain("NEVER give complete answers");
    });

    it("generates a minimal prompt with only required fields", () => {
      const result = getChipSystemPrompt({
        childName: "Test",
        age: 8,
        gradeLevel: 3,
      });

      expect(result).toContain("You are Chip");
      expect(result).toContain("Test");
      expect(result).toContain("age 8");
      expect(result).toContain("grade 3");
      expect(result).toContain("learn learning");
      expect(result).not.toContain("Subject:");
      expect(result).not.toContain("Learning Style Adaptation");
      expect(result).not.toContain("Encouragement Style");
      expect(result).not.toContain("Weave In Their Interests");
      expect(result).not.toContain("Skill Awareness");
      expect(result).not.toContain("Recent Lessons Completed");
      expect(result).not.toContain("Your Notes About This Child");
      expect(result).not.toContain("Current Context");
    });
  });
});
