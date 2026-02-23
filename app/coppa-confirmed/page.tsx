import type { Metadata } from "next";
import { CheckCircle2, AlertTriangle, XCircle, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Parental Consent Confirmation",
  description:
    "Confirm parental consent for your child's TinkerSchool account. COPPA-compliant verification for children's online safety.",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

const STATUS_CONFIG = {
  success: {
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
    title: "Consent Confirmed",
    description:
      "Thank you for confirming your parental consent. Your child's TinkerSchool account is now fully verified under COPPA guidelines.",
    showHomeLink: true,
  },
  already_confirmed: {
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
    title: "Already Confirmed",
    description:
      "Your parental consent was already confirmed. No further action is needed.",
    showHomeLink: true,
  },
  expired: {
    icon: Clock,
    iconColor: "text-amber-500",
    title: "Link Expired",
    description:
      "This confirmation link has expired (48-hour limit). Please sign in to your TinkerSchool account and re-send the confirmation email from Settings, or contact privacy@tinkerschool.ai for assistance.",
    showHomeLink: true,
  },
  invalid: {
    icon: XCircle,
    iconColor: "text-red-500",
    title: "Invalid Link",
    description:
      "This confirmation link is invalid or has already been used. If you believe this is an error, please contact privacy@tinkerschool.ai.",
    showHomeLink: false,
  },
  error: {
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    title: "Something Went Wrong",
    description:
      "We encountered an error processing your confirmation. Please try again or contact privacy@tinkerschool.ai for assistance.",
    showHomeLink: true,
  },
} as const;

export default async function CoppaConfirmedPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = params.status ?? "invalid";
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.invalid;
  const Icon = config.icon;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <Icon className={`mx-auto size-16 ${config.iconColor}`} />
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
          {config.title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {config.description}
        </p>
        {config.showHomeLink && (
          <Button asChild className="mt-8 rounded-xl" size="lg">
            <Link href="/home">Go to TinkerSchool</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
