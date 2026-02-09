"use server";

import bcrypt from "bcryptjs";

import { auth } from "@clerk/nextjs/server";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** bcrypt cost factor. 10 is the standard default. */
const BCRYPT_ROUNDS = 10;

/** Bcrypt hashes always start with "$2a$" or "$2b$". */
const BCRYPT_PREFIX = "$2";

// ---------------------------------------------------------------------------
// Hash a PIN (used during onboarding / PIN reset)
// ---------------------------------------------------------------------------

/**
 * Hash a 4-digit PIN string using bcrypt.
 * This is a pure utility -- no auth checks, no database access.
 */
export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, BCRYPT_ROUNDS);
}

// ---------------------------------------------------------------------------
// Verify a PIN (used during kid login)
// ---------------------------------------------------------------------------

interface VerifyPinResult {
  success: boolean;
  error?: string;
  kidProfileId?: string;
  kidClerkId?: string;
}

/**
 * Verify a kid's PIN for login.
 *
 * The parent must be authenticated (via Clerk). This action looks up all kid
 * profiles in the parent's family, finds the one matching `kidProfileId`,
 * and verifies the supplied PIN against the stored hash.
 *
 * Legacy migration: if the stored value is plaintext (does not start with
 * "$2"), the PIN is compared directly. On success the hash is upgraded
 * in-place so subsequent logins use bcrypt.
 */
export async function verifyKidPin(
  kidProfileId: string,
  pin: string,
): Promise<VerifyPinResult> {
  // 1. Require parent authentication
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated." };
  }

  // 2. Validate inputs
  if (!/^\d{4}$/.test(pin)) {
    return { success: false, error: "PIN must be exactly 4 digits." };
  }

  if (!kidProfileId || typeof kidProfileId !== "string") {
    return { success: false, error: "Invalid kid profile ID." };
  }

  // 3. Look up the parent profile to get the family_id
  const supabase = await createServerSupabaseClient();
  const { data: parentProfile } = (await supabase
    .from("profiles")
    .select("family_id")
    .eq("clerk_id", userId)
    .single()) as { data: { family_id: string } | null };

  if (!parentProfile) {
    return { success: false, error: "Parent profile not found." };
  }

  // 4. Use admin client to read the kid's pin_hash (bypasses RLS since
  //    the pin_hash column should not be exposed to regular queries)
  const admin = createAdminSupabaseClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: kidProfile } = (await (admin.from("profiles") as any)
    .select("id, clerk_id, pin_hash, family_id, role")
    .eq("id", kidProfileId)
    .single()) as {
    data: {
      id: string;
      clerk_id: string;
      pin_hash: string | null;
      family_id: string;
      role: string;
    } | null;
  };

  if (!kidProfile) {
    return { success: false, error: "Kid profile not found." };
  }

  // 5. Verify the kid belongs to the parent's family
  if (kidProfile.family_id !== parentProfile.family_id) {
    return { success: false, error: "Kid profile not found." };
  }

  if (kidProfile.role !== "kid") {
    return { success: false, error: "Invalid profile." };
  }

  // 6. Check that a PIN has been set
  if (!kidProfile.pin_hash) {
    return { success: false, error: "No PIN has been set for this profile." };
  }

  // 7. Verify the PIN
  const storedValue = kidProfile.pin_hash;
  let isValid = false;

  if (storedValue.startsWith(BCRYPT_PREFIX)) {
    // Modern bcrypt hash -- use constant-time comparison
    isValid = await bcrypt.compare(pin, storedValue);
  } else {
    // Legacy plaintext PIN -- direct comparison
    isValid = storedValue === pin;

    if (isValid) {
      // Upgrade to bcrypt hash on successful login
      const newHash = await hashPin(pin);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (admin.from("profiles") as any)
        .update({ pin_hash: newHash })
        .eq("id", kidProfileId);
    }
  }

  if (!isValid) {
    return { success: false, error: "Incorrect PIN." };
  }

  return {
    success: true,
    kidProfileId: kidProfile.id,
    kidClerkId: kidProfile.clerk_id,
  };
}
