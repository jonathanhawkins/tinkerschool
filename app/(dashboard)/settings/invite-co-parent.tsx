"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  Shield,
  UserPlus,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
  inviteCoParent,
  listPendingInvitations,
  revokeInvitation,
  type FamilyParent,
  type PendingInvitation,
} from "./invite-actions";

// ---------------------------------------------------------------------------
// Family Members List
// ---------------------------------------------------------------------------

interface FamilyMembersProps {
  parents: FamilyParent[];
}

export function FamilyMembers({ parents }: FamilyMembersProps) {
  return (
    <div className="space-y-3">
      {parents.map((parent) => (
        <div key={parent.id} className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
            {parent.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">
              {parent.displayName}
              {parent.isCurrentUser && (
                <span className="ml-1.5 text-xs text-muted-foreground">
                  (you)
                </span>
              )}
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
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pending Invitations List
// ---------------------------------------------------------------------------

interface PendingInvitationsProps {
  initialInvitations: PendingInvitation[];
}

export function PendingInvitations({ initialInvitations }: PendingInvitationsProps) {
  const [invitations, setInvitations] = useState(initialInvitations);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Sync with parent when new invitations are sent
  useEffect(() => {
    setInvitations(initialInvitations);
  }, [initialInvitations]);

  const handleRevoke = useCallback(
    (invitationId: string) => {
      setRevokingId(invitationId);
      startTransition(async () => {
        const result = await revokeInvitation(invitationId);
        if (result.success) {
          setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
        }
        setRevokingId(null);
      });
    },
    [],
  );

  if (invitations.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        Pending Invitations
      </p>
      <AnimatePresence mode="popLayout">
        {invitations.map((inv) => (
          <motion.div
            key={inv.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-2.5"
          >
            <Clock className="size-4 shrink-0 text-amber-500" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">
                {inv.emailAddress}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRevoke(inv.id)}
              disabled={isPending && revokingId === inv.id}
              className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-destructive"
            >
              {isPending && revokingId === inv.id ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <X className="size-3" />
              )}
              Cancel
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Invite Co-Parent Dialog
// ---------------------------------------------------------------------------

interface InviteCoParentDialogProps {
  onInviteSent: () => void;
}

export function InviteCoParentDialog({ onInviteSent }: InviteCoParentDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Please enter an email address.");
      return;
    }

    startTransition(async () => {
      const result = await inviteCoParent(email.trim());
      if (result.success) {
        setSuccess(true);
        setEmail("");
        // Notify parent to refresh invitations list
        onInviteSent();
        // Auto-close after showing success
        setTimeout(() => {
          setOpen(false);
          setSuccess(false);
        }, 2000);
      } else {
        setError(result.error ?? "Failed to send invitation.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => {
      setOpen(v);
      if (!v) {
        setEmail("");
        setError("");
        setSuccess(false);
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 rounded-xl">
          <UserPlus className="size-4" />
          Invite Co-Parent
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="size-5 text-primary" />
            Invite Co-Parent
          </DialogTitle>
          <DialogDescription>
            Send an invitation email so your partner can access the same family
            account and see all learning progress.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-4"
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="size-6 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-emerald-600">
                Invitation sent!
              </p>
              <p className="text-center text-xs text-muted-foreground">
                They&apos;ll receive an email with a link to join your family.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="invite-email"
                  className="text-sm font-medium text-foreground"
                >
                  Email Address
                </label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="partner@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                  }}
                  className="h-11 rounded-xl"
                  autoFocus
                  disabled={isPending}
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {error}
                </motion.p>
              )}

              <Button
                onClick={handleSubmit}
                disabled={!email.trim() || isPending}
                className="w-full rounded-xl"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="size-4" />
                    Send Invitation
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Both parents will have equal access to all family data.
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Combined Family Section (used by settings page)
// ---------------------------------------------------------------------------

interface FamilySectionProps {
  initialParents: FamilyParent[];
  initialInvitations: PendingInvitation[];
}

export function FamilySection({
  initialParents,
  initialInvitations,
}: FamilySectionProps) {
  const [invitations, setInvitations] = useState(initialInvitations);
  const [refreshKey, setRefreshKey] = useState(0);
  const [, startRefreshTransition] = useTransition();

  const handleInviteSent = useCallback(() => {
    // Refresh the invitations list
    setRefreshKey((k) => k + 1);
    startRefreshTransition(async () => {
      const updated = await listPendingInvitations();
      setInvitations(updated);
    });
  }, [startRefreshTransition]);

  return (
    <div className="space-y-4">
      {/* Parents list */}
      <FamilyMembers parents={initialParents} />

      {/* Pending invitations */}
      <PendingInvitations
        key={refreshKey}
        initialInvitations={invitations}
      />

      {/* Invite button */}
      <InviteCoParentDialog onInviteSent={handleInviteSent} />
    </div>
  );
}
