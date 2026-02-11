"use server";

import { clerkClient } from "@clerk/nextjs/server";

import { requireAuth } from "@/lib/auth/require-auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ActionResult {
  success: boolean;
  error?: string;
}

export interface PendingInvitation {
  id: string;
  emailAddress: string;
  createdAt: number;
}

export interface FamilyParent {
  id: string;
  displayName: string;
  clerkId: string;
  createdAt: string;
  isCurrentUser: boolean;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------------------------
// Helper: Check if a clerk_org_id is a real Clerk Organization
// Legacy families have the parent's userId as a placeholder.
// Real Clerk org IDs start with "org_".
// ---------------------------------------------------------------------------

function isRealClerkOrgId(clerkOrgId: string): boolean {
  return clerkOrgId.startsWith("org_");
}

// ---------------------------------------------------------------------------
// Helper: get clerk_org_id for the current user's family.
// Returns null if the family doesn't have a real Clerk Organization yet.
// ---------------------------------------------------------------------------

async function getFamilyOrgId(
  supabase: Awaited<ReturnType<typeof requireAuth>>["supabase"],
  familyId: string,
): Promise<string | null> {
  const { data: family } = (await supabase
    .from("families")
    .select("clerk_org_id")
    .eq("id", familyId)
    .single()) as { data: { clerk_org_id: string } | null };

  const orgId = family?.clerk_org_id;
  if (!orgId || !isRealClerkOrgId(orgId)) {
    return null;
  }

  return orgId;
}

// ---------------------------------------------------------------------------
// Helper: Ensure a real Clerk Organization exists for a legacy family.
// Creates one if needed, updates the family record, and returns the org ID.
// ---------------------------------------------------------------------------

async function ensureFamilyOrg(
  userId: string,
  familyId: string,
  supabase: Awaited<ReturnType<typeof requireAuth>>["supabase"],
): Promise<string | null> {
  // First check if we already have a real org
  const existing = await getFamilyOrgId(supabase, familyId);
  if (existing) return existing;

  // Fetch family name for the org
  const { data: family } = (await supabase
    .from("families")
    .select("clerk_org_id, name")
    .eq("id", familyId)
    .single()) as { data: { clerk_org_id: string; name: string } | null };

  if (!family) return null;

  // Already a real org (race condition check)
  if (isRealClerkOrgId(family.clerk_org_id)) {
    return family.clerk_org_id;
  }

  // Create a real Clerk Organization
  try {
    const clerk = await clerkClient();
    const org = await clerk.organizations.createOrganization({
      name: family.name,
      createdBy: userId,
    });

    // Update the family record with the real org ID.
    // Use admin client to bypass RLS for this migration update.
    const adminSupabase = createAdminSupabaseClient();
    await adminSupabase
      .from("families")
      .update({ clerk_org_id: org.id } as never)
      .eq("id", familyId);

    return org.id;
  } catch (err) {
    console.error("Failed to create Clerk Organization for legacy family:", err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Invite a co-parent
// ---------------------------------------------------------------------------

export async function inviteCoParent(email: string): Promise<ActionResult> {
  const { userId, profile, supabase } = await requireAuth();

  if (profile.role !== "parent") {
    return { success: false, error: "Only parents can send invitations." };
  }

  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail || !EMAIL_PATTERN.test(trimmedEmail)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  // Ensure we have a real Clerk org (creates one for legacy families)
  const clerkOrgId = await ensureFamilyOrg(userId, profile.family_id, supabase);
  if (!clerkOrgId) {
    return { success: false, error: "Failed to set up family organization. Please try again." };
  }

  try {
    const clerk = await clerkClient();
    await clerk.organizations.createOrganizationInvitation({
      organizationId: clerkOrgId,
      emailAddress: trimmedEmail,
      role: "org:admin",
      inviterUserId: userId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    // Clerk throws specific errors for duplicate invitations
    if (message.includes("already been invited") || message.includes("already a member")) {
      return { success: false, error: "This person has already been invited or is already a member." };
    }

    console.error("Failed to create invitation:", err);
    return { success: false, error: "Failed to send invitation. Please try again." };
  }

  return { success: true };
}

// ---------------------------------------------------------------------------
// List pending invitations
// ---------------------------------------------------------------------------

export async function listPendingInvitations(): Promise<PendingInvitation[]> {
  const { profile, supabase } = await requireAuth();

  if (profile.role !== "parent") {
    return [];
  }

  // Don't try to query Clerk if we don't have a real org yet
  const clerkOrgId = await getFamilyOrgId(supabase, profile.family_id);
  if (!clerkOrgId) {
    return [];
  }

  try {
    const clerk = await clerkClient();
    const invitations = await clerk.organizations.getOrganizationInvitationList({
      organizationId: clerkOrgId,
      status: ["pending"],
    });

    return invitations.data.map((inv) => ({
      id: inv.id,
      emailAddress: inv.emailAddress,
      createdAt: inv.createdAt,
    }));
  } catch (err) {
    console.error("Failed to list invitations:", err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Revoke a pending invitation
// ---------------------------------------------------------------------------

export async function revokeInvitation(invitationId: string): Promise<ActionResult> {
  const { profile, supabase } = await requireAuth();

  if (profile.role !== "parent") {
    return { success: false, error: "Only parents can revoke invitations." };
  }

  const clerkOrgId = await getFamilyOrgId(supabase, profile.family_id);
  if (!clerkOrgId) {
    return { success: false, error: "Family organization not found." };
  }

  try {
    const clerk = await clerkClient();
    await clerk.organizations.revokeOrganizationInvitation({
      organizationId: clerkOrgId,
      invitationId,
      requestingUserId: profile.clerk_id,
    });
  } catch (err) {
    console.error("Failed to revoke invitation:", err);
    return { success: false, error: "Failed to revoke invitation." };
  }

  return { success: true };
}

// ---------------------------------------------------------------------------
// List all parent profiles in the family
// ---------------------------------------------------------------------------

export async function listFamilyParents(): Promise<FamilyParent[]> {
  const { userId, profile, supabase } = await requireAuth();

  const { data: parents } = (await supabase
    .from("profiles")
    .select("id, display_name, clerk_id, created_at")
    .eq("family_id", profile.family_id)
    .eq("role", "parent")
    .order("created_at")) as {
    data: Array<{
      id: string;
      display_name: string;
      clerk_id: string;
      created_at: string;
    }> | null;
  };

  if (!parents) return [];

  return parents.map((p) => ({
    id: p.id,
    displayName: p.display_name,
    clerkId: p.clerk_id,
    createdAt: p.created_at,
    isCurrentUser: p.clerk_id === userId,
  }));
}
