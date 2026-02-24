import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

// ---------------------------------------------------------------------------
// Clerk webhook event types we handle
// ---------------------------------------------------------------------------

interface ClerkUserEventData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email_addresses: Array<{ email_address: string }>;
  image_url: string | null;
  public_metadata: Record<string, unknown>;
}

interface ClerkOrganizationMembershipEventData {
  organization: {
    id: string;
    name: string;
  };
  public_user_data: {
    user_id: string;
    first_name: string | null;
    last_name: string | null;
  };
  role: string;
}

interface ClerkWebhookEvent {
  type: string;
  data: ClerkUserEventData | ClerkOrganizationMembershipEventData;
}

// ---------------------------------------------------------------------------
// POST /api/webhooks/clerk
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("[clerk-webhook] Missing CLERK_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // 1. Verify the svix signature
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  const body = await request.text();

  let event: ClerkWebhookEvent;
  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("[clerk-webhook] Signature verification failed:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 }
    );
  }

  // 2. Handle events
  const supabase = createAdminSupabaseClient();

  try {
    switch (event.type) {
      case "user.created":
      case "user.updated": {
        // User events don't automatically create profiles — that happens
        // during onboarding. But we can log them for debugging.
        const userData = event.data as ClerkUserEventData;
        console.log(
          `[clerk-webhook] ${event.type}: clerk_id=${userData.id}`
        );
        break;
      }

      case "organizationMembership.created": {
        // When a user is added to an organization (family), ensure the
        // family record exists and create a profile stub if needed.
        const memberData =
          event.data as ClerkOrganizationMembershipEventData;

        const clerkOrgId = memberData.organization.id;
        const orgName = memberData.organization.name;
        const clerkUserId = memberData.public_user_data.user_id;
        const displayName = [
          memberData.public_user_data.first_name,
          memberData.public_user_data.last_name,
        ].filter(Boolean).join(" ") || "Member";
        const isAdmin = memberData.role === "org:admin";

        // Upsert the family record
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: family } = await (supabase.from("families") as any)
          .upsert(
            { clerk_org_id: clerkOrgId, name: orgName },
            { onConflict: "clerk_org_id" }
          )
          .select("id")
          .single();

        if (!family) {
          console.error(
            `[clerk-webhook] Failed to upsert family for org=${clerkOrgId}`
          );
          break;
        }

        // Check if a profile already exists for this user
        const { data: existingProfile } = (await supabase
          .from("profiles")
          .select("id")
          .eq("clerk_id", clerkUserId)
          .maybeSingle()) as { data: { id: string } | null };

        if (!existingProfile) {
          // Create a stub profile — the user can complete it during onboarding
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: newProfile } = await (supabase.from("profiles") as any)
            .insert({
              clerk_id: clerkUserId,
              family_id: family.id,
              display_name: displayName,
              avatar_id: "chip",
              role: isAdmin ? "parent" : "kid",
              current_band: isAdmin ? 0 : 2,
            })
            .select("id")
            .single();

          // Create a learning profile for kid accounts so Chip's memory
          // features (interest discovery, chip notes synthesis) work
          // from the very first interaction.
          if (newProfile && !isAdmin) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error: lpError } = await (supabase.from("learning_profiles") as any).insert({
              profile_id: newProfile.id,
              learning_style: { visual: 0.4, kinesthetic: 0.3, auditory: 0.2, reading: 0.1 },
              interests: [],
              preferred_session_length: 15,
              preferred_encouragement: "enthusiastic",
            });

            if (lpError) {
              console.error(
                `[clerk-webhook] Failed to create learning profile for kid=${newProfile.id}:`,
                lpError instanceof Error ? lpError.message : "unknown error",
              );
            }
          }
        }

        console.log(
          `[clerk-webhook] organizationMembership.created: user=${clerkUserId} org=${clerkOrgId} role=${memberData.role}`
        );
        break;
      }

      case "organizationMembership.deleted": {
        // When a user is removed from an organization, we log it but
        // don't delete their data (preservation for safety).
        const memberData =
          event.data as ClerkOrganizationMembershipEventData;
        console.log(
          `[clerk-webhook] organizationMembership.deleted: user=${memberData.public_user_data.user_id} org=${memberData.organization.id}`
        );
        break;
      }

      default:
        console.log(`[clerk-webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error(`[clerk-webhook] Error handling ${event.type}:`, err instanceof Error ? err.message : "unknown error");
    return NextResponse.json(
      { error: "Internal error processing webhook" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
