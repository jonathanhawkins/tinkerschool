"use client";

import { useRef, useState, useTransition } from "react";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";

import { subscribeEmail } from "@/app/actions/subscribe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EmailCaptureProps {
  /** Where this form is placed — stored with the subscriber for analytics */
  source: string;
  /** Main heading */
  heading?: string;
  /** Supporting description */
  description?: string;
  /** Submit button label */
  buttonText?: string;
  /** 'card' renders with background + padding; 'inline' is minimal */
  variant?: "card" | "inline";
  /** Additional className for the wrapper */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EmailCapture({
  source,
  heading = "Get free homeschool resources",
  description = "Schedule templates, activity ideas, and learning tips — delivered to your inbox.",
  buttonText = "Subscribe",
  variant = "card",
  className,
}: EmailCaptureProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    formData.set("source", source);
    formData.set("referrer", typeof window !== "undefined" ? window.location.pathname : "");

    startTransition(async () => {
      const result = await subscribeEmail(formData);
      if (result.success) {
        setStatus("success");
        formRef.current?.reset();
      } else {
        setStatus("error");
        setErrorMsg(result.error ?? "Something went wrong.");
      }
    });
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-3 text-center",
          variant === "card" &&
            "rounded-2xl border border-border bg-muted/30 p-8",
          className,
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="size-6" />
        </div>
        <p className="text-lg font-semibold text-foreground">You&apos;re in!</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Check your inbox for a welcome email. We&apos;ll send you free
          resources and tips — no spam, ever.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        variant === "card" &&
          "rounded-2xl border border-border bg-muted/30 p-6 sm:p-8",
        className,
      )}
    >
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Mail className="size-4" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{heading}</h3>
        </div>
        {description && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {/* Form */}
      <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3">
        {/* Honeypot — hidden from humans, bots fill it in */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="absolute -left-[9999px] opacity-0"
          aria-hidden="true"
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            type="email"
            name="email"
            placeholder="your@email.com"
            required
            autoComplete="email"
            className="h-11 rounded-xl"
            disabled={isPending}
          />
          <Button
            type="submit"
            disabled={isPending}
            className="h-11 shrink-0 rounded-xl px-6"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              buttonText
            )}
          </Button>
        </div>

        {status === "error" && (
          <p className="text-sm text-destructive">{errorMsg}</p>
        )}

        <p className="text-xs text-muted-foreground">
          No spam, ever. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}
