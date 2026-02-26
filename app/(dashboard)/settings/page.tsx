import type { Metadata } from "next";
import {
  User,
  Layers,
  Sparkles,
  Users,
  Monitor,
  Usb,
  Wifi,
  Info,
  GraduationCap,
  Shield,
  ExternalLink,
  RotateCcw,
  Heart,
  ArrowRight,
  MessageSquarePlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DevResetButton } from "./dev-reset-button";
import { EditKidName } from "./edit-kid-name";
import { EditKidGrade } from "./edit-kid-grade";
import { FamilySection } from "./invite-co-parent";
import { listFamilyParents, listPendingInvitations } from "./invite-actions";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

import { requireAuth } from "@/lib/auth/require-auth";
import { getFamilyTier } from "@/lib/stripe/get-family-tier";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import type { Profile } from "@/lib/supabase/types";
import { BAND_NAMES } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const BAND_DESCRIPTIONS: Record<number, string> = {
  0: "Guided play & sensory exploration",
  1: "UIFlow2 blocks & templates",
  2: "Blocks + peek at Python",
  3: "MicroPython + block hints",
  4: "MicroPython + vibe coding",
  5: "Full MicroPython + AI",
};

const AVATAR_LABELS: Record<string, string> = {
  unicorn: "Unicorn",
  robot: "Robot",
  astronaut: "Astronaut",
  dragon: "Dragon",
  cat: "Cat",
  dog: "Dog",
  parent: "Parent",
};

const DEVICE_MODE_LABELS: Record<string, { label: string; description: string }> = {
  usb: { label: "USB Serial", description: "Connected via USB cable" },
  wifi: { label: "WiFi WebREPL", description: "Connected via WiFi" },
  simulator: { label: "Simulator", description: "Virtual device in browser" },
  none: { label: "Not Set", description: "No device mode selected" },
};

export default async function SettingsPage() {
  const { profile, supabase } = await requireAuth();

  // Fetch family members (kid profiles under this parent's family)
  const { data: familyMembers } = await supabase
    .from("profiles")
    .select("*")
    .eq("family_id", profile.family_id)
    .order("created_at");

  const safeMembers: Profile[] = familyMembers ?? [];
  const kidProfiles = safeMembers.filter((m) => m.role === "kid");
  const parentProfiles = safeMembers.filter((m) => m.role === "parent");
  const parentProfile = parentProfiles.find((m) => m.clerk_id === profile.clerk_id) ?? profile;

  // Fetch family parents, pending invitations, and subscription tier
  const [familyParents, pendingInvitations, familyTier] = await Promise.all([
    listFamilyParents(),
    listPendingInvitations(),
    getFamilyTier(supabase, profile.family_id),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Page header */}
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your family profiles and preferences.
          </p>
        </div>
      </FadeIn>

      <Stagger className="space-y-6">
        {/* ---- Your Account ---- */}
        <StaggerItem>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="size-4 text-primary" />
                Your Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
                  {parentProfile.display_name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-medium text-foreground">
                    {parentProfile.display_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Family admin
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="shrink-0 gap-1 border-primary/30 text-primary"
                >
                  <Shield className="size-3" />
                  Parent
                </Badge>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* ---- Family ---- */}
        <StaggerItem>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-4 text-primary" />
                Family
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FamilySection
                initialParents={familyParents}
                initialInvitations={pendingInvitations}
              />
            </CardContent>
          </Card>
        </StaggerItem>

        {/* ---- Kid Profiles ---- */}
        <StaggerItem>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <GraduationCap className="size-4 text-primary" />
                Learner Profiles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {kidProfiles.length > 0 ? (
                kidProfiles.map((kid) => {
                  const bandName = BAND_NAMES[kid.current_band] ?? "Unknown";
                  const bandDesc =
                    BAND_DESCRIPTIONS[kid.current_band] ?? "";
                  const avatarLabel =
                    AVATAR_LABELS[kid.avatar_id] ?? kid.avatar_id;

                  return (
                    <div key={kid.id} className="space-y-3">
                      {/* Kid header */}
                      <div className="flex items-center gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">
                          {kid.display_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="font-medium text-foreground">
                              {kid.display_name}
                            </p>
                            <EditKidName
                              kidId={kid.id}
                              currentName={kid.display_name}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {avatarLabel} avatar
                          </p>
                        </div>
                      </div>

                      {/* Kid details */}
                      <div className="space-y-2 rounded-xl bg-muted/40 p-4">
                        <div className="flex items-center gap-1">
                          <div className="flex-1">
                            <DetailRow
                              icon={GraduationCap}
                              label="Grade"
                              value={
                                kid.grade_level !== null
                                  ? kid.grade_level === -1
                                    ? "Pre-K"
                                    : kid.grade_level === 0
                                      ? "Kindergarten"
                                      : `Grade ${kid.grade_level}`
                                  : "Not set"
                              }
                            />
                          </div>
                          <EditKidGrade
                            kidId={kid.id}
                            currentGrade={kid.grade_level}
                            kidName={kid.display_name}
                          />
                        </div>
                        <DetailRow
                          icon={Layers}
                          label="Band"
                          value={`Band ${kid.current_band} - ${bandName}`}
                        />
                        <DetailRow
                          icon={Sparkles}
                          label="Mode"
                          value={bandDesc}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl bg-muted/40 py-8 text-center">
                  <Users className="mx-auto mb-2 size-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    No learner profiles yet.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Kid profiles are created during onboarding.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </StaggerItem>

        {/* ---- Device Settings ---- */}
        <StaggerItem>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Monitor className="size-4 text-primary" />
                Device
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(() => {
                const modeInfo =
                  DEVICE_MODE_LABELS[profile.device_mode] ??
                  DEVICE_MODE_LABELS.none;
                return (
                  <DetailRow
                    icon={
                      profile.device_mode === "usb" ? Usb : Wifi
                    }
                    label="Connection Mode"
                    value={modeInfo.label}
                  />
                );
              })()}
              <DetailRow
                icon={Monitor}
                label="Hardware"
                value="M5StickC Plus 2"
              />

              <Separator />

              <div className="flex items-start gap-3 pt-1">
                <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Connect your M5StickC Plus 2 via USB in the{" "}
                  <Link
                    href="/workshop"
                    className="font-medium text-primary hover:underline"
                  >
                    Workshop
                  </Link>
                  . Chrome or Edge required for USB connection. Other
                  browsers can use the simulator.
                </p>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* ---- About ---- */}
        <StaggerItem>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="size-4 text-primary" />
                About TinkerSchool
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/chip.png"
                  alt="Chip mascot"
                  width={40}
                  height={40}
                  className="shrink-0 rounded-xl"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    TinkerSchool
                  </p>
                  <p className="text-xs text-muted-foreground">
                    AI-powered learning for curious kids
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <DetailRow icon={Sparkles} label="AI Tutor" value="Chip" />
                <DetailRow
                  icon={Layers}
                  label="Subjects"
                  value="7 (Math, Reading, Science, Music, Art, Problem Solving, Coding)"
                />
              </div>

              <Separator />

              <div className="flex flex-wrap gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-1.5 rounded-xl text-xs"
                >
                  <a
                    href="https://github.com/nicholasgriffintn/tinkerschool"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="size-3" />
                    GitHub
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-1.5 rounded-xl text-xs"
                >
                  <a
                    href="https://tinkerschool.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="size-3" />
                    Website
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* ---- Support TinkerSchool (free-tier parents only) ---- */}
        {profile.role === "parent" && familyTier === "free" && (
          <StaggerItem>
            <Card className="rounded-2xl border-rose-200/60 bg-rose-50/30 dark:border-rose-500/20 dark:bg-rose-950/20">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-500/20">
                  <Heart className="size-5 text-rose-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Support TinkerSchool
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    Love TinkerSchool? Help us keep it free and open source for
                    every family.
                  </p>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="shrink-0 gap-1.5 rounded-xl bg-rose-500 text-white hover:bg-rose-600"
                >
                  <Link href="/dashboard/billing">
                    Support
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </StaggerItem>
        )}

        {/* ---- Feedback & Parent Dashboard links ---- */}
        {profile.role === "parent" && (
          <>
            <StaggerItem>
              <Button
                asChild
                variant="outline"
                className="w-full rounded-2xl py-6"
              >
                <Link href="/dashboard/feedback">
                  <MessageSquarePlus className="size-4" />
                  Send Feedback or Report a Bug
                </Link>
              </Button>
            </StaggerItem>
            <StaggerItem>
              <Button
                asChild
                variant="outline"
                className="w-full rounded-2xl py-6"
              >
                <Link href="/dashboard">
                  <Shield className="size-4" />
                  Open Parent Dashboard
                </Link>
              </Button>
            </StaggerItem>
          </>
        )}

        {/* ---- Dev Tools (development only) ---- */}
        {process.env.NODE_ENV !== "production" && (
          <StaggerItem>
            <Card className="rounded-2xl border-dashed border-destructive/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-destructive">
                  <RotateCcw className="size-4" />
                  Dev Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Reset all lesson progress, badges, XP, and streaks for the
                  current profile. Chip will treat you as a brand-new user.
                </p>
                <DevResetButton />
              </CardContent>
            </Card>
          </StaggerItem>
        )}
      </Stagger>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

import type { LucideIcon } from "lucide-react";

interface DetailRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

function DetailRow({ icon: Icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <div className="flex flex-1 items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-right text-sm font-medium text-foreground">
          {value}
        </span>
      </div>
    </div>
  );
}
