import type { Metadata } from "next";
import { Settings, Download, Shield, AlertTriangle } from "lucide-react";

import { requireAuth, getActiveKidProfile } from "@/lib/auth/require-auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DeleteAccountButton } from "./delete-account-button";
import { ExportDataButton } from "./export-data-button";

export const metadata: Metadata = {
  title: "Settings | Parent Dashboard",
  robots: { index: false, follow: false },
};

export default async function ParentSettingsPage() {
  const { profile, supabase } = await requireAuth();
  const kidProfile = await getActiveKidProfile(profile, supabase);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <Settings className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your family&apos;s account and data
          </p>
        </div>
      </div>

      {/* Data Export Section */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Download className="size-4 text-primary" />
            Export Child Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl bg-muted/40 p-4">
            <Shield className="mt-0.5 size-5 shrink-0 text-primary" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Your data, your right
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Under COPPA, you have the right to download all data we&apos;ve
                collected about your child. The export includes their profile,
                learning progress, chat conversations, voice session metadata,
                projects, and badges as a JSON file.
              </p>
            </div>
          </div>

          {kidProfile ? (
            <ExportDataButton
              kidProfileId={kidProfile.id}
              kidName={kidProfile.display_name}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              No child profile found. Complete onboarding to set up your
              child&apos;s profile first.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Delete Account Section */}
      <Card className="rounded-2xl border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="size-4 text-destructive" />
            Delete Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl bg-destructive/5 p-4">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                This action is permanent
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Deleting your account will permanently remove all family data
                including your child&apos;s profile, learning progress, chat
                history, projects, and badges. This cannot be undone.
              </p>
            </div>
          </div>
          <DeleteAccountButton />
        </CardContent>
      </Card>
    </div>
  );
}
