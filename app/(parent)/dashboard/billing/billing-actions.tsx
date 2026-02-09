"use client";

import { useState } from "react";
import { CheckCircle2, Heart, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SubscriptionTier, BillingInterval } from "@/lib/stripe/config";

import { createCheckoutSession, createPortalSession } from "./actions";

interface BillingActionsProps {
  tier: SubscriptionTier;
}

const plans: Array<{
  interval: BillingInterval;
  label: string;
  price: string;
  perMonth: string;
  badge?: string;
}> = [
  {
    interval: "monthly",
    label: "Monthly",
    price: "$5",
    perMonth: "$5/mo",
  },
  {
    interval: "yearly",
    label: "Yearly",
    price: "$49",
    perMonth: "$4.08/mo",
    badge: "Save 18%",
  },
];

const benefits = [
  "Premium AI tutoring with Claude Sonnet",
  "Supporter badge on your family profile",
  "Help fund free education for all kids",
  "Priority access to new features",
];

export function BillingActions({ tier }: BillingActionsProps) {
  const [loading, setLoading] = useState<BillingInterval | "portal" | null>(
    null,
  );
  const isSupporter = tier === "supporter";

  async function handleCheckout(interval: BillingInterval) {
    setLoading(interval);
    try {
      const result = await createCheckoutSession(interval);
      if (result.url) {
        window.location.href = result.url;
      } else {
        console.error("[billing] Checkout error:", result.error);
        setLoading(null);
      }
    } catch {
      setLoading(null);
    }
  }

  async function handlePortal() {
    setLoading("portal");
    try {
      const result = await createPortalSession();
      if (result.url) {
        window.location.href = result.url;
      } else {
        console.error("[billing] Portal error:", result.error);
        setLoading(null);
      }
    } catch {
      setLoading(null);
    }
  }

  // -- Supporter: show manage subscription button --
  if (isSupporter) {
    return (
      <div className="space-y-6">
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Manage Subscription</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Update your payment method, change plans, or cancel anytime.
            </p>
            <Button
              className="mt-4 rounded-xl"
              onClick={handlePortal}
              disabled={loading !== null}
            >
              {loading === "portal" ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : null}
              Manage Subscription
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-pink-200 bg-pink-50/50 dark:border-pink-800 dark:bg-pink-950/20">
          <CardContent className="flex items-center gap-4 p-6">
            <Heart className="size-8 shrink-0 text-pink-500" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Thank you for supporting TinkerSchool!
              </p>
              <p className="text-xs text-muted-foreground">
                Your contribution helps keep education free and open source for
                every family.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // -- Free tier: show pricing cards --
  return (
    <div className="space-y-8">
      {/* Pricing cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {plans.map((plan) => (
          <Card
            key={plan.interval}
            className={cn(
              "relative rounded-2xl transition-shadow duration-200 hover:shadow-md",
              plan.badge && "border-primary/40",
            )}
          >
            {plan.badge && (
              <Badge className="absolute -top-2.5 right-4 rounded-full bg-primary px-3 text-xs text-primary-foreground">
                {plan.badge}
              </Badge>
            )}
            <CardContent className="flex flex-col gap-4 p-6">
              <div>
                <h3 className="text-lg font-semibold">{plan.label}</h3>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    /{plan.interval === "monthly" ? "month" : "year"}
                  </span>
                </div>
                {plan.interval === "yearly" && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    That&apos;s just {plan.perMonth}
                  </p>
                )}
              </div>

              <ul className="flex flex-col gap-2">
                {benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <Button
                className="mt-2 rounded-xl"
                size="lg"
                onClick={() => handleCheckout(plan.interval)}
                disabled={loading !== null}
              >
                {loading === plan.interval ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 size-4" />
                )}
                Become a Supporter
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Free tier callout */}
      <Card className="rounded-2xl bg-muted/30">
        <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
          <p className="text-sm font-semibold text-foreground">
            Everything stays free
          </p>
          <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
            TinkerSchool will always be free and open source. Supporting is
            completely optional -- it helps cover AI costs and fund development.
            Think of it like supporting Wikipedia or the Blender Foundation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
