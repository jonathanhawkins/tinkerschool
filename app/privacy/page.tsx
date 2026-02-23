import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  Eye,
  Database,
  Users,
  Trash2,
  Lock,
  MessageCircle,
  Mail,
  ArrowLeft,
  FileText,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "TinkerSchool's privacy policy explains how we protect your child's data. COPPA-compliant, family-scoped, and designed with children's safety first.",
  alternates: {
    canonical: "https://tinkerschool.ai/privacy",
  },
};

const LAST_UPDATED = "February 22, 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation bar */}
      <nav className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to TinkerSchool
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/chip.png"
              alt="TinkerSchool"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span className="text-sm font-semibold text-foreground">
              TinkerSchool
            </span>
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-12">
        {/* Page header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <Shield className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Privacy Policy
              </h1>
              <p className="text-sm text-muted-foreground">
                Last updated: {LAST_UPDATED}
              </p>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            TinkerSchool is built for kids, so protecting your child's privacy
            is our highest priority. This policy is written in plain language so
            you know exactly what we collect, why, and how to control it.
          </p>
        </div>

        <div className="space-y-6">
          {/* COPPA notice */}
          <Card className="rounded-2xl border-primary/20 bg-primary/5">
            <CardContent className="flex items-start gap-3 pt-6">
              <Lock className="mt-0.5 size-5 shrink-0 text-primary" />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  Children&apos;s Privacy &amp; COPPA Compliance
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  TinkerSchool is designed for children ages 5-12 and complies
                  with the Children&apos;s Online Privacy Protection Act
                  (COPPA). We never collect personal information from children
                  under 13 without verifiable parental consent.
                </p>
                {/* COPPA PLACEHOLDER: Update the address and phone below with your real operator info */}
                <div className="rounded-lg bg-background/60 p-3 text-sm text-muted-foreground space-y-0.5">
                  <p className="font-medium text-foreground">Operator:</p>
                  <p>TinkerSchool, Inc.</p>
                  <p>7736 Winter Snow Ct, Newcastle, CA 95658</p>
                  <p>Phone: (424) 234-6720</p>
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:privacy@tinkerschool.ai"
                      className="font-medium text-primary hover:underline"
                    >
                      privacy@tinkerschool.ai
                    </a>
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  A parent or legal guardian must create and manage all
                  accounts. During account setup, parents must affirmatively
                  consent to data collection by checking a consent box
                  acknowledging this privacy policy. We record the consent
                  timestamp and the consenting IP address. A confirmation
                  email is sent to the parent&apos;s registered email address
                  summarizing what data is collected and how to exercise
                  parental rights.
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <strong className="font-medium text-foreground">
                    You may refuse consent at any time.
                  </strong>{" "}
                  If you do not consent or later withdraw consent, you may
                  request deletion of all data collected from your child by
                  emailing{" "}
                  <a
                    href="mailto:privacy@tinkerschool.ai"
                    className="font-medium text-primary hover:underline"
                  >
                    privacy@tinkerschool.ai
                  </a>{" "}
                  or by using the Delete Account feature in the{" "}
                  <a
                    href="/dashboard/settings"
                    className="font-medium text-primary hover:underline"
                  >
                    parent dashboard
                  </a>
                  . Your child&apos;s ability to use the platform is not
                  conditioned on providing more data than is reasonably
                  necessary for the educational activities.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 1: What we collect */}
          <PolicySection
            icon={Database}
            title="What We Collect"
            id="what-we-collect"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              We collect only what is necessary to provide a personalized
              learning experience. Here is the complete list:
            </p>
            <div className="space-y-3 pt-2">
              <DataItem
                label="Child's first name"
                reason="So Chip (our AI tutor) can address your child by name"
              />
              <DataItem
                label="Grade level"
                reason="To match lesson difficulty to your child's age"
              />
              <DataItem
                label="Avatar choice"
                reason="A fun profile icon your child picks during setup"
              />
              <DataItem
                label="Learning progress"
                reason="Completed lessons, quiz scores, and skill levels so we can personalize their learning path"
              />
              <DataItem
                label="AI chat conversations"
                reason="Conversations with Chip are logged so parents can review them and so Chip can remember context"
              />
              <DataItem
                label="Projects created"
                reason="Code blocks and projects your child builds in the workshop"
              />
              <DataItem
                label="Learning profile"
                reason="Learning style preferences, interests, and skill proficiency levels to personalize Chip's tutoring"
              />
              <DataItem
                label="Voice session metadata"
                reason="When using Chip's voice mode, we store session duration and timestamps (not audio recordings)"
              />
              <DataItem
                label="IP address at signup"
                reason="Recorded once during account creation for COPPA consent verification"
              />
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                What we do NOT collect from children:
              </p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                  Email addresses, phone numbers, or physical addresses
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                  Photos or videos
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                  Stored audio recordings (voice audio is streamed to Hume AI
                  in real-time for voice tutoring but is not recorded or stored
                  by TinkerSchool)
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                  Location data or device identifiers
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                  Browsing history or tracking cookies
                </li>
              </ul>
            </div>
          </PolicySection>

          {/* Section 2: How we use data */}
          <PolicySection
            icon={Eye}
            title="How We Use Your Data"
            id="how-we-use-data"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              All data collected is used exclusively for educational
              personalization. Specifically:
            </p>
            <ul className="space-y-2 pt-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                Adapting lesson content and difficulty to your child's level
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                Powering Chip's personalized tutoring conversations
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                Tracking learning progress and awarding achievement badges
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                Providing parents with learning reports in the parent dashboard
              </li>
            </ul>
            <p className="pt-3 text-sm leading-relaxed text-muted-foreground">
              We never use your child's data for advertising, profiling, or any
              purpose unrelated to their education.
            </p>
          </PolicySection>

          {/* Section 3: Who can access */}
          <PolicySection
            icon={Users}
            title="Who Can Access Your Data"
            id="data-access"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your family's data is strictly scoped. Here is who can see what:
            </p>
            <div className="mt-3 space-y-3">
              <AccessRow
                who="Parents / Guardians"
                access="Full access to all child data, chat history, progress reports, and projects within your family"
              />
              <AccessRow
                who="Your child"
                access="Their own progress, projects, and conversations only"
              />
              <AccessRow
                who="Other families"
                access="Nothing. All data is family-scoped and isolated through row-level security policies"
              />
            </div>
          </PolicySection>

          {/* Section 4: Third-party services */}
          <PolicySection
            icon={Lock}
            title="Third-Party Services"
            id="third-party"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              We use a small number of trusted services to run TinkerSchool. We
              do not sell or share your child's personal data with anyone.
            </p>
            <div className="mt-3 space-y-3">
              <ServiceRow
                name="Clerk"
                purpose="Authentication (parent accounts)"
                data="Parent email and login credentials only. Child profiles use a PIN under the parent's account with no personal data shared."
              />
              <ServiceRow
                name="Supabase"
                purpose="Database hosting"
                data="All learning data, with row-level security ensuring family isolation. Hosted on secure, SOC 2 compliant infrastructure."
              />
              <ServiceRow
                name="Anthropic (Claude)"
                purpose="AI tutoring (authenticated users)"
                data="Each conversation sends the child's first name, age, grade level, current subject, lesson context, learning profile (learning style and interests), skill proficiency levels, recent lesson titles, and the chat message to generate Chip's responses. No email, address, photo, or other identifying information is included. Per Anthropic's commercial API data usage policy, conversations sent through their API are not used to train AI models. Anthropic retains API inputs for up to 30 days for safety monitoring, then deletes them."
              />
              <ServiceRow
                name="OpenAI"
                purpose="AI demo on landing page (unauthenticated)"
                data="The anonymous Try Chip demo on the landing page uses OpenAI to generate responses. Messages are not persisted and no account data is sent. The demo does not ask for or store any personal information. Per OpenAI's API data usage policy, data sent through their API is not used to train models."
              />
              <ServiceRow
                name="Hume AI"
                purpose="Voice tutoring (requires parental voice consent)"
                data={`Voice audio is streamed in real-time from your child's microphone to generate Chip's spoken responses. Voice mode requires a separate parental consent step before first use. TinkerSchool does not store audio recordings -- only session duration and timestamps are stored. Hume AI processes voice data to generate speech and does not use it for model training. See Hume AI's privacy policy at hume.ai/privacy for full details on their data handling.`}
              />
              <ServiceRow
                name="Stripe"
                purpose="Payment processing"
                data="Processes parent subscription payments. Stripe receives parent billing information (name, email, payment method) but never receives any child data. Stripe is PCI DSS Level 1 compliant."
              />
              <ServiceRow
                name="Vercel"
                purpose="Application hosting and analytics"
                data="Hosts the application. Vercel Analytics and Speed Insights collect anonymous page view metrics and Web Vitals performance data. These analytics scripts are only loaded on public marketing pages and the parent dashboard -- they are never loaded on kid-facing authenticated pages. Standard web server logs include IP addresses and request metadata. No personal child data is stored by Vercel."
              />
              <ServiceRow
                name="Cloudflare"
                purpose="Web analytics"
                data="Collects anonymous, aggregated page view statistics on public marketing pages and the parent dashboard only. Cloudflare analytics scripts are never loaded on kid-facing authenticated pages. No cookies are set and no personal data is collected. Used to understand overall site traffic."
              />
              <ServiceRow
                name="Upstash"
                purpose="Rate limiting"
                data="Stores anonymous rate limit counters (keyed by parent account ID) to prevent AI chat abuse. No child data or conversation content is sent to Upstash."
              />
            </div>
          </PolicySection>

          {/* Section 5: Anonymous demo */}
          <PolicySection
            icon={Eye}
            title="Anonymous Demo (Landing Page)"
            id="anonymous-demo"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              The &quot;Try Chip&quot; demo on our landing page is fully
              anonymous. It does not require an account, does not set
              tracking cookies, and does not collect or store any personal
              information. Messages typed into the demo are sent to OpenAI
              to generate responses and are not persisted by TinkerSchool.
              The demo reminds visitors not to share personal information
              such as their name or school.
            </p>
          </PolicySection>

          {/* Section 6: Data retention */}
          <PolicySection
            icon={Trash2}
            title="Data Retention"
            id="data-retention"
          >
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                Your data is kept for as long as your account is active.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                If you delete your account, all associated data (profiles,
                progress, chat history, projects) is permanently deleted within
                30 days.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                You can request data deletion at any time without deleting your
                account by contacting us.
              </li>
            </ul>
          </PolicySection>

          {/* Section 6: Parental rights */}
          <PolicySection
            icon={FileText}
            title="Your Rights as a Parent"
            id="parental-rights"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              Under COPPA and applicable privacy laws, you have the right to:
            </p>
            <ul className="space-y-2 pt-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                <strong className="font-medium text-foreground">
                  Review your child's data
                </strong>{" "}
                -- view all collected information through the parent dashboard
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                <strong className="font-medium text-foreground">
                  Request deletion
                </strong>{" "}
                -- ask us to delete any or all of your child's data at any time
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                <strong className="font-medium text-foreground">
                  Revoke consent
                </strong>{" "}
                -- withdraw permission for data collection, which will
                deactivate your child's profile
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                <strong className="font-medium text-foreground">
                  Export your child's data
                </strong>{" "}
                -- download all collected information as a JSON file from the{" "}
                <a
                  href="/dashboard/settings"
                  className="font-medium text-primary hover:underline"
                >
                  parent dashboard settings
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                <strong className="font-medium text-foreground">
                  Data portability
                </strong>{" "}
                -- request a copy of your child's data in a machine-readable
                format
              </li>
            </ul>
            <p className="pt-3 text-sm leading-relaxed text-muted-foreground">
              To exercise any of these rights, email us at{" "}
              <a
                href="mailto:privacy@tinkerschool.ai"
                className="font-medium text-primary hover:underline"
              >
                privacy@tinkerschool.ai
              </a>
              . We will respond within 30 days.
            </p>
          </PolicySection>

          {/* Section 7: Security */}
          <PolicySection
            icon={Shield}
            title="How We Protect Your Data"
            id="security"
          >
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                All data is encrypted in transit (TLS) and at rest
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                Database access is enforced through row-level security policies,
                so each family can only see their own data
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                Authentication is handled by Clerk, a SOC 2 compliant auth
                provider
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                AI conversations are rate-limited to prevent misuse and all
                conversations are available for parent review
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                The platform is open source, so our code and security practices
                can be audited by anyone
              </li>
            </ul>
          </PolicySection>

          {/* Section 8: Changes */}
          <PolicySection
            icon={MessageCircle}
            title="Changes to This Policy"
            id="changes"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              If we make material changes to this privacy policy, we will notify
              parents via email before the changes take effect. Minor
              clarifications or formatting updates will be reflected by updating
              the "Last updated" date at the top of this page.
            </p>
          </PolicySection>

          {/* Section 9: Contact / Operator Information */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="size-4 text-primary" />
                Contact Us (Operator Information)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-relaxed text-muted-foreground">
                If you have questions about this privacy policy, want to
                exercise your parental rights, or need to request data
                deletion, contact the operator:
              </p>
              <div className="rounded-xl bg-muted/40 p-4 space-y-1.5">
                <p className="text-sm font-medium text-foreground">
                  TinkerSchool, Inc.
                </p>
                <p className="text-sm text-foreground">
                  <strong className="font-medium">Email:</strong>{" "}
                  <a
                    href="mailto:privacy@tinkerschool.ai"
                    className="text-primary hover:underline"
                  >
                    privacy@tinkerschool.ai
                  </a>
                </p>
                <p className="text-sm text-foreground">
                  <strong className="font-medium">Website:</strong>{" "}
                  <a
                    href="https://tinkerschool.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    tinkerschool.ai
                  </a>
                </p>
                {/* COPPA PLACEHOLDER: Update the address and phone below with your real operator info */}
                <p className="text-sm text-foreground">
                  <strong className="font-medium">Address:</strong>{" "}
                  TinkerSchool, Inc., 7736 Winter Snow Ct, Newcastle, CA 95658
                </p>
                <p className="text-sm text-foreground">
                  <strong className="font-medium">Phone:</strong>{" "}
                  (424) 234-6720
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                We aim to respond to all privacy inquiries within 30 days.
                If you believe we have collected personal information from
                your child without proper consent, please contact us
                immediately and we will promptly investigate and delete the
                data if appropriate.
              </p>
            </CardContent>
          </Card>

          {/* Related link */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              variant="outline"
              className="flex-1 gap-2 rounded-2xl py-6"
            >
              <Link href="/terms">
                <FileText className="size-4" />
                Terms of Service
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 gap-2 rounded-2xl py-6"
            >
              <Link href="/">
                <ArrowLeft className="size-4" />
                Back to TinkerSchool
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

import type { LucideIcon } from "lucide-react";

interface PolicySectionProps {
  icon: LucideIcon;
  title: string;
  id: string;
  children: React.ReactNode;
}

function PolicySection({ icon: Icon, title, id, children }: PolicySectionProps) {
  return (
    <Card className="rounded-2xl" id={id}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="size-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

interface DataItemProps {
  label: string;
  reason: string;
}

function DataItem({ label, reason }: DataItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-muted/40 p-3">
      <Database className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {reason}
        </p>
      </div>
    </div>
  );
}

interface AccessRowProps {
  who: string;
  access: string;
}

function AccessRow({ who, access }: AccessRowProps) {
  return (
    <div className="rounded-xl bg-muted/40 p-3">
      <p className="text-sm font-medium text-foreground">{who}</p>
      <p className="text-xs leading-relaxed text-muted-foreground">{access}</p>
    </div>
  );
}

interface ServiceRowProps {
  name: string;
  purpose: string;
  data: string;
}

function ServiceRow({ name, purpose, data }: ServiceRowProps) {
  return (
    <div className="rounded-xl bg-muted/40 p-3">
      <div className="flex items-baseline gap-2">
        <p className="text-sm font-medium text-foreground">{name}</p>
        <span className="text-xs text-muted-foreground">-- {purpose}</span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {data}
      </p>
    </div>
  );
}
