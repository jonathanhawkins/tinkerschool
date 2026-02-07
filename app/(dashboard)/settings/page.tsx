import { Settings, User, Layers, Sparkles } from "lucide-react";

import { requireAuth } from "@/lib/auth/require-auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const BAND_NAMES: Record<number, string> = {
  1: "Explorer",
  2: "Builder",
  3: "Inventor",
  4: "Hacker",
  5: "Creator",
};

export default async function SettingsPage() {
  const { profile } = await requireAuth();

  const bandName = BAND_NAMES[profile.current_band] ?? "Unknown";

  return (
    <div className="mx-auto max-w-2xl">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your profile and preferences.
        </p>
      </div>

      {/* Profile card */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="size-4 text-primary" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
              {profile.display_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">
                {profile.display_name}
              </p>
              <p className="text-sm text-muted-foreground capitalize">
                {profile.role}
              </p>
            </div>
          </div>

          <Separator />

          {/* Details */}
          <div className="space-y-3">
            <DetailRow
              icon={Layers}
              label="Current Band"
              value={`Band ${profile.current_band} - ${bandName}`}
            />
            {profile.grade_level !== null && (
              <DetailRow
                icon={Sparkles}
                label="Grade Level"
                value={`Grade ${profile.grade_level}`}
              />
            )}
            <DetailRow
              icon={Settings}
              label="Avatar"
              value={profile.avatar_id}
            />
          </div>

          <Separator />

          {/* Coming soon */}
          <div className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3">
            <Badge variant="outline" className="shrink-0 text-xs">
              Coming Soon
            </Badge>
            <p className="text-sm text-muted-foreground">
              Profile editing, theme preferences, and notification
              settings are on the way!
            </p>
          </div>
        </CardContent>
      </Card>
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
        <span className="text-sm font-medium text-foreground">{value}</span>
      </div>
    </div>
  );
}
