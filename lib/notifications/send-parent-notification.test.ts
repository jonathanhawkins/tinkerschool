import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  sendParentNotification,
  sendLessonCompletionNotification,
} from "./send-parent-notification";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockGetUser = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
  clerkClient: () => ({
    users: {
      getUser: mockGetUser,
    },
  }),
}));

// ---------------------------------------------------------------------------
// Mock Supabase builder
// ---------------------------------------------------------------------------

interface MockConfig {
  kidProfile: { id: string; family_id: string; display_name: string } | null;
  parentProfiles: Array<{ id: string; clerk_id: string }> | null;
  lesson: {
    title: string;
    subject_id: string | null;
    subjects: { name: string; slug: string } | null;
  } | null;
  insertError: { message: string } | null;
}

function createMockSupabase(config: MockConfig) {
  const insertFn = vi.fn().mockResolvedValue({ error: config.insertError });

  const fromFn = vi.fn().mockImplementation((table: string) => {
    if (table === "profiles") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockImplementation((_col: string, value: string) => {
            // If selecting by id (kid profile lookup), return kidProfile
            // If selecting by family_id + role, return parentProfiles
            return {
              single: vi.fn().mockResolvedValue({
                data: value === config.kidProfile?.id
                  ? config.kidProfile
                  : config.kidProfile, // fallback for display_name lookup
              }),
              eq: vi.fn().mockImplementation((_col2: string, value2: string) => {
                if (value2 === "parent") {
                  return Promise.resolve({ data: config.parentProfiles });
                }
                // kid profile by id lookup
                return {
                  single: vi.fn().mockResolvedValue({
                    data: config.kidProfile,
                  }),
                };
              }),
            };
          }),
        }),
      };
    }

    if (table === "lessons") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: config.lesson }),
          }),
        }),
      };
    }

    if (table === "notifications") {
      return {
        insert: insertFn,
      };
    }

    return {};
  });

  return {
    client: { from: fromFn } as unknown as Parameters<
      typeof sendParentNotification
    >[0],
    fromFn,
    insertFn,
  };
}

/**
 * Build a more precise mock Supabase that tracks the exact query chain
 * for sendParentNotification (which makes 2 profiles queries + 1 insert).
 */
function createPreciseMockSupabase(config: MockConfig) {
  const insertFn = vi.fn().mockResolvedValue({ error: config.insertError });
  let profilesCallCount = 0;

  const fromFn = vi.fn().mockImplementation((table: string) => {
    if (table === "profiles") {
      profilesCallCount++;
      const callNum = profilesCallCount;

      if (callNum === 1) {
        // First call: kid profile by id
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: config.kidProfile }),
            }),
          }),
        };
      }

      // Second call: parent profiles by family_id + role
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: config.parentProfiles }),
          }),
        }),
      };
    }

    if (table === "notifications") {
      return { insert: insertFn };
    }

    return {};
  });

  return {
    client: { from: fromFn } as unknown as Parameters<
      typeof sendParentNotification
    >[0],
    fromFn,
    insertFn,
  };
}

/**
 * Build a mock for sendLessonCompletionNotification which makes:
 * 1. lessons query (by id)
 * 2. profiles query (kid display_name by id)
 * 3. profiles query (kid profile by id -- from sendParentNotification)
 * 4. profiles query (parent profiles by family_id + role)
 * 5. notifications insert
 */
function createLessonNotificationMock(config: MockConfig) {
  const insertFn = vi.fn().mockResolvedValue({ error: config.insertError });
  let profilesCallCount = 0;

  const fromFn = vi.fn().mockImplementation((table: string) => {
    if (table === "lessons") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: config.lesson }),
          }),
        }),
      };
    }

    if (table === "profiles") {
      profilesCallCount++;
      const callNum = profilesCallCount;

      if (callNum <= 2) {
        // Kid profile lookups (display_name + id)
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: config.kidProfile }),
            }),
          }),
        };
      }

      // Parent profiles by family_id + role
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: config.parentProfiles }),
          }),
        }),
      };
    }

    if (table === "notifications") {
      return { insert: insertFn };
    }

    return {};
  });

  return {
    client: { from: fromFn } as unknown as Parameters<
      typeof sendLessonCompletionNotification
    >[0],
    fromFn,
    insertFn,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("sendParentNotification", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns failure when kid profile is not found", async () => {
    const { client } = createPreciseMockSupabase({
      kidProfile: null,
      parentProfiles: null,
      lesson: null,
      insertError: null,
    });

    const result = await sendParentNotification(client, {
      kidProfileId: "missing-id",
      type: "lesson_completed",
      title: "Test",
      body: "Test body",
    });

    expect(result.success).toBe(false);
    expect(result.notificationCount).toBe(0);
  });

  it("returns failure when no parent profiles exist", async () => {
    const { client } = createPreciseMockSupabase({
      kidProfile: {
        id: "kid-1",
        family_id: "family-1",
        display_name: "Cassidy",
      },
      parentProfiles: [],
      lesson: null,
      insertError: null,
    });

    const result = await sendParentNotification(client, {
      kidProfileId: "kid-1",
      type: "lesson_completed",
      title: "Test",
      body: "Test body",
    });

    expect(result.success).toBe(false);
    expect(result.notificationCount).toBe(0);
  });

  it("creates notification records for each parent", async () => {
    mockGetUser.mockResolvedValue({
      emailAddresses: [
        { id: "email-1", emailAddress: "parent@example.com" },
      ],
      primaryEmailAddressId: "email-1",
    });

    const { client, insertFn } = createPreciseMockSupabase({
      kidProfile: {
        id: "kid-1",
        family_id: "family-1",
        display_name: "Cassidy",
      },
      parentProfiles: [{ id: "parent-1", clerk_id: "clerk-parent-1" }],
      lesson: null,
      insertError: null,
    });

    const result = await sendParentNotification(client, {
      kidProfileId: "kid-1",
      type: "lesson_completed",
      title: "Cassidy completed a lesson!",
      body: "Great job!",
      metadata: { score: 95 },
    });

    expect(result.success).toBe(true);
    expect(result.notificationCount).toBe(1);
    expect(result.parentEmails).toEqual(["parent@example.com"]);

    // Verify the insert was called with correct data
    expect(insertFn).toHaveBeenCalledWith([
      expect.objectContaining({
        family_id: "family-1",
        recipient_profile_id: "parent-1",
        kid_profile_id: "kid-1",
        type: "lesson_completed",
        title: "Cassidy completed a lesson!",
        body: "Great job!",
        metadata: expect.objectContaining({
          score: 95,
          kid_name: "Cassidy",
        }),
      }),
    ]);
  });

  it("creates notifications for multiple parents", async () => {
    mockGetUser
      .mockResolvedValueOnce({
        emailAddresses: [
          { id: "e1", emailAddress: "mom@example.com" },
        ],
        primaryEmailAddressId: "e1",
      })
      .mockResolvedValueOnce({
        emailAddresses: [
          { id: "e2", emailAddress: "dad@example.com" },
        ],
        primaryEmailAddressId: "e2",
      });

    const { client, insertFn } = createPreciseMockSupabase({
      kidProfile: {
        id: "kid-1",
        family_id: "family-1",
        display_name: "Cassidy",
      },
      parentProfiles: [
        { id: "parent-1", clerk_id: "clerk-mom" },
        { id: "parent-2", clerk_id: "clerk-dad" },
      ],
      lesson: null,
      insertError: null,
    });

    const result = await sendParentNotification(client, {
      kidProfileId: "kid-1",
      type: "badge_earned",
      title: "Badge earned!",
      body: "Cassidy earned a new badge",
    });

    expect(result.success).toBe(true);
    expect(result.notificationCount).toBe(2);
    expect(result.parentEmails).toContain("mom@example.com");
    expect(result.parentEmails).toContain("dad@example.com");
    expect(insertFn).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ recipient_profile_id: "parent-1" }),
        expect.objectContaining({ recipient_profile_id: "parent-2" }),
      ]),
    );
  });

  it("still inserts notifications when Clerk email lookup fails", async () => {
    mockGetUser.mockRejectedValue(new Error("Clerk API down"));

    const { client, insertFn } = createPreciseMockSupabase({
      kidProfile: {
        id: "kid-1",
        family_id: "family-1",
        display_name: "Cassidy",
      },
      parentProfiles: [{ id: "parent-1", clerk_id: "clerk-parent-1" }],
      lesson: null,
      insertError: null,
    });

    const result = await sendParentNotification(client, {
      kidProfileId: "kid-1",
      type: "lesson_completed",
      title: "Test",
      body: "Test",
    });

    // Notification record should still be created even without email
    expect(result.success).toBe(true);
    expect(result.notificationCount).toBe(1);
    expect(result.parentEmails).toEqual([]);
    expect(insertFn).toHaveBeenCalled();
  });

  it("returns failure when database insert fails", async () => {
    mockGetUser.mockResolvedValue({
      emailAddresses: [
        { id: "e1", emailAddress: "parent@example.com" },
      ],
      primaryEmailAddressId: "e1",
    });

    const { client } = createPreciseMockSupabase({
      kidProfile: {
        id: "kid-1",
        family_id: "family-1",
        display_name: "Cassidy",
      },
      parentProfiles: [{ id: "parent-1", clerk_id: "clerk-parent-1" }],
      lesson: null,
      insertError: { message: "RLS violation" },
    });

    const result = await sendParentNotification(client, {
      kidProfileId: "kid-1",
      type: "lesson_completed",
      title: "Test",
      body: "Test",
    });

    expect(result.success).toBe(false);
    expect(result.notificationCount).toBe(0);
  });
});

describe("sendLessonCompletionNotification", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("builds a descriptive notification from lesson data", async () => {
    mockGetUser.mockResolvedValue({
      emailAddresses: [
        { id: "e1", emailAddress: "parent@example.com" },
      ],
      primaryEmailAddressId: "e1",
    });

    const { client, insertFn } = createLessonNotificationMock({
      kidProfile: {
        id: "kid-1",
        family_id: "family-1",
        display_name: "Cassidy",
      },
      parentProfiles: [{ id: "parent-1", clerk_id: "clerk-parent-1" }],
      lesson: {
        title: "Counting to 20",
        subject_id: "subj-math",
        subjects: { name: "Math", slug: "math" },
      },
      insertError: null,
    });

    const result = await sendLessonCompletionNotification(
      client,
      "kid-1",
      "lesson-1",
      95,
    );

    expect(result.success).toBe(true);
    expect(insertFn).toHaveBeenCalledWith([
      expect.objectContaining({
        type: "lesson_completed",
        title: "Cassidy completed a Math lesson!",
        body: 'Cassidy finished "Counting to 20" with a score of 95%. Great job!',
        metadata: expect.objectContaining({
          lesson_id: "lesson-1",
          lesson_title: "Counting to 20",
          subject_name: "Math",
          subject_slug: "math",
          score: 95,
          kid_name: "Cassidy",
        }),
      }),
    ]);
  });

  it("uses fallback text when lesson is not found", async () => {
    mockGetUser.mockResolvedValue({
      emailAddresses: [
        { id: "e1", emailAddress: "parent@example.com" },
      ],
      primaryEmailAddressId: "e1",
    });

    const { client, insertFn } = createLessonNotificationMock({
      kidProfile: {
        id: "kid-1",
        family_id: "family-1",
        display_name: "Cassidy",
      },
      parentProfiles: [{ id: "parent-1", clerk_id: "clerk-parent-1" }],
      lesson: null,
      insertError: null,
    });

    const result = await sendLessonCompletionNotification(
      client,
      "kid-1",
      "missing-lesson",
      80,
    );

    expect(result.success).toBe(true);
    expect(insertFn).toHaveBeenCalledWith([
      expect.objectContaining({
        title: "Cassidy completed a TinkerSchool lesson!",
        body: 'Cassidy finished "a lesson" with a score of 80%. Great job!',
      }),
    ]);
  });
});
