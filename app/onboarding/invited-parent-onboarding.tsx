"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Loader2, Sparkles, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { completeInvitedParentOnboarding } from "./actions";

interface InvitedParentOnboardingProps {
  familyName: string;
  parentNameDefault: string;
}

export function InvitedParentOnboarding({
  familyName,
  parentNameDefault,
}: InvitedParentOnboardingProps) {
  const [displayName, setDisplayName] = useState(parentNameDefault);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!displayName.trim()) {
      setError("Please enter your name.");
      return;
    }

    const formData = new FormData();
    formData.set("display_name", displayName.trim());

    startTransition(async () => {
      const result = await completeInvitedParentOnboarding(formData);
      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
      } else {
        window.location.href = "/home";
      }
    });
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Card className="w-full rounded-2xl border-border/60 shadow-md">
        <CardContent className="pb-2 pt-2">
          <div className="flex flex-col items-center gap-5 py-6 text-center">
            {/* Chip mascot */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
            >
              <Image
                src="/images/chip.png"
                alt="Chip the learning buddy"
                width={100}
                height={100}
                className="rounded-3xl"
                priority
              />
            </motion.div>

            {/* Welcome text */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="flex flex-col gap-2"
            >
              <div className="mx-auto flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
                <Users className="size-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Family Invitation
                </span>
              </div>

              <h1 className="text-2xl font-bold text-foreground">
                Welcome to TinkerSchool!
              </h1>

              {familyName && (
                <p className="text-muted-foreground">
                  You&apos;ve been invited to join the{" "}
                  <span className="font-semibold text-foreground">
                    {familyName}
                  </span>{" "}
                  family.
                </p>
              )}
            </motion.div>

            {/* Name input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="w-full max-w-sm space-y-4"
            >
              <div className="flex flex-col gap-1.5 text-left">
                <label
                  htmlFor="display-name"
                  className="text-sm font-medium text-foreground"
                >
                  Your Name
                </label>
                <Input
                  id="display-name"
                  placeholder="Your display name"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                  }}
                  className="h-11 rounded-xl text-base"
                  autoFocus
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-destructive"
                >
                  {error}
                </motion.p>
              )}

              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={!displayName.trim() || isPending}
                className="w-full rounded-xl"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Get Started
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground">
                You&apos;ll be able to see your kids&apos; progress, AI
                conversations, and learning data.
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
