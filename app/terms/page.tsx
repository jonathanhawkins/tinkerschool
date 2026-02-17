import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Scale,
  BookOpen,
  Users,
  ShieldCheck,
  Lightbulb,
  AlertTriangle,
  FileText,
  Mail,
  ArrowLeft,
  Ban,
  Gavel,
  Globe,
  Link2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "TinkerSchool's terms of service. Simple, readable terms for our AI-powered education platform for kids ages 5-12.",
};

const LAST_UPDATED = "February 17, 2026";

export default function TermsOfServicePage() {
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
              <Scale className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Terms of Service
              </h1>
              <p className="text-sm text-muted-foreground">
                Last updated: {LAST_UPDATED}
              </p>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            These terms are written in plain language. By using TinkerSchool, you
            agree to these terms. If anything is unclear, please reach out to us.
          </p>
        </div>

        <div className="space-y-6">
          {/* Section 1: What TinkerSchool is */}
          <TermsSection
            icon={BookOpen}
            title="What TinkerSchool Is"
            id="what-is-tinkerschool"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              TinkerSchool is an open-source, AI-powered education platform
              designed for children in grades K-6 (ages 5-12). It pairs kids
              with an AI tutor named Chip to learn math, reading, science,
              music, art, problem solving, and coding through interactive
              projects and hands-on activities with an M5StickC Plus 2 device.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              TinkerSchool is a supplementary educational tool. It is not a
              replacement for school, professional tutoring, or certified
              educational programs.
            </p>
          </TermsSection>

          {/* Section 2: Accounts & parental consent */}
          <TermsSection
            icon={Users}
            title="Accounts & Parental Consent"
            id="accounts"
          >
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                A parent or legal guardian must create and manage the account.
                Children cannot create accounts on their own.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                By creating a child profile, you consent to the collection and
                use of your child's data as described in our{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-primary hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                You are responsible for all activity under your account,
                including your child's use of the platform.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                Keep your account credentials secure. If you suspect
                unauthorized access, contact us immediately.
              </li>
            </ul>
          </TermsSection>

          {/* Section 3: Acceptable use */}
          <TermsSection
            icon={ShieldCheck}
            title="Acceptable Use"
            id="acceptable-use"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              TinkerSchool is designed for educational purposes. When using the
              platform, you and your child agree to:
            </p>
            <ul className="space-y-2 pt-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                Use the platform for learning and creative educational projects
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                Treat the AI tutor (Chip) and any community features with
                respect
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                Not attempt to bypass safety features, content filters, or
                rate limits
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                Not use the platform to create, upload, or distribute harmful,
                offensive, or inappropriate content
              </li>
            </ul>
          </TermsSection>

          {/* Section 4: Prohibited use */}
          <TermsSection
            icon={Ban}
            title="Prohibited Uses"
            id="prohibited-use"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              You may not use TinkerSchool to:
            </p>
            <ul className="space-y-2 pt-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive/60" />
                Attempt to extract, reverse-engineer, or abuse the AI system
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive/60" />
                Interfere with or disrupt the platform's operation or security
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive/60" />
                Impersonate another user or misrepresent your identity
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive/60" />
                Use the platform for any commercial purpose unrelated to
                education
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive/60" />
                Scrape, data-mine, or programmatically access the platform
                without written permission
              </li>
            </ul>
          </TermsSection>

          {/* Section 5: Intellectual property */}
          <TermsSection
            icon={Lightbulb}
            title="Intellectual Property"
            id="intellectual-property"
          >
            <div className="space-y-3">
              <div className="rounded-xl bg-muted/40 p-3">
                <p className="text-sm font-medium text-foreground">
                  Your child's creations belong to your family
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  All projects, code, artwork, and other content your child
                  creates using TinkerSchool are owned by you and your child. We
                  do not claim ownership of user-generated content.
                </p>
              </div>
              <div className="rounded-xl bg-muted/40 p-3">
                <p className="text-sm font-medium text-foreground">
                  TinkerSchool platform content
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  The TinkerSchool platform, curriculum, lessons, Chip's
                  personality and responses, and the TinkerSchool brand are
                  provided under the MIT License. The full license text is
                  available in our GitHub repository.
                </p>
              </div>
              <div className="rounded-xl bg-muted/40 p-3">
                <p className="text-sm font-medium text-foreground">
                  Shared projects
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  If you choose to share a project publicly (requires parent
                  approval), you grant TinkerSchool a non-exclusive license to
                  display it in the gallery. You can remove shared projects at
                  any time.
                </p>
              </div>
            </div>
          </TermsSection>

          {/* Section 6: AI tutor disclaimer */}
          <TermsSection
            icon={AlertTriangle}
            title="AI Tutor Disclaimer"
            id="ai-disclaimer"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              Chip is an AI-powered tutor that provides educational guidance. A
              few important things to understand:
            </p>
            <ul className="space-y-2 pt-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                Chip may occasionally provide incorrect or incomplete
                information. It is a learning aid, not an authority.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                AI conversations are logged and available for parent review in
                the parent dashboard.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                Chip has content guardrails to keep conversations appropriate for
                children, but no system is perfect. Please report any concerning
                interactions.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                AI usage is rate-limited to encourage healthy screen time habits.
              </li>
            </ul>
          </TermsSection>

          {/* Section 7: Limitation of liability */}
          <TermsSection
            icon={Scale}
            title="Limitation of Liability"
            id="liability"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              TinkerSchool is provided "as is" without warranties of any kind,
              either express or implied. To the fullest extent permitted by law:
            </p>
            <ul className="space-y-2 pt-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                We are not liable for any indirect, incidental, or
                consequential damages arising from your use of the platform.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                We do not guarantee uninterrupted access or error-free
                operation.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                Physical devices (M5StickC Plus 2) are subject to their
                manufacturer's warranty and safety guidelines. TinkerSchool is
                not responsible for device hardware issues.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                Educational content is provided as a supplement and should not
                be relied upon as a sole educational resource.
              </li>
            </ul>
          </TermsSection>

          {/* Section 8: Account termination */}
          <TermsSection
            icon={FileText}
            title="Account Termination"
            id="termination"
          >
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                You can delete your account at any time. Upon deletion, all
                data will be removed within 30 days as described in our{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-primary hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                We reserve the right to suspend or terminate accounts that
                violate these terms, with notice when reasonably possible.
              </li>
            </ul>
          </TermsSection>

          {/* Section 9: Changes */}
          <TermsSection
            icon={FileText}
            title="Changes to These Terms"
            id="changes"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              We may update these terms from time to time. Material changes will
              be communicated via email to registered parents. Continued use of
              TinkerSchool after changes take effect constitutes acceptance of
              the updated terms.
            </p>
          </TermsSection>

          {/* Section 10: Governing law */}
          <TermsSection
            icon={Globe}
            title="Governing Law & Jurisdiction"
            id="governing-law"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              These terms are governed by and construed in accordance with the
              laws of the State of Delaware, United States, without regard to
              its conflict of law provisions. Any legal action or proceeding
              arising under these terms shall be brought exclusively in the
              federal or state courts located in Delaware, and you consent to
              the personal jurisdiction of such courts.
            </p>
          </TermsSection>

          {/* Section 11: Dispute resolution */}
          <TermsSection
            icon={Gavel}
            title="Dispute Resolution"
            id="dispute-resolution"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              We encourage you to contact us first at{" "}
              <a
                href="mailto:hello@tinkerschool.ai"
                className="font-medium text-primary hover:underline"
              >
                hello@tinkerschool.ai
              </a>{" "}
              to resolve any disputes informally. If a dispute cannot be
              resolved informally within 30 days, either party may pursue
              resolution through the courts described in the Governing Law
              section above. For claims under $10,000, either party may choose
              to resolve the dispute through small claims court.
            </p>
          </TermsSection>

          {/* Section 12: General provisions */}
          <TermsSection
            icon={Link2}
            title="General Provisions"
            id="general-provisions"
          >
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                <strong className="font-medium text-foreground">
                  Severability
                </strong>{" "}
                -- If any provision of these terms is found to be unenforceable
                or invalid, that provision will be limited or eliminated to the
                minimum extent necessary, and the remaining provisions will
                remain in full force and effect.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                <strong className="font-medium text-foreground">
                  Entire agreement
                </strong>{" "}
                -- These terms, together with our{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-primary hover:underline"
                >
                  Privacy Policy
                </Link>
                , constitute the entire agreement between you and TinkerSchool
                regarding your use of the platform.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                <strong className="font-medium text-foreground">
                  Indemnification
                </strong>{" "}
                -- You agree to indemnify and hold harmless TinkerSchool, its
                contributors, and affiliates from any claims, damages, or
                expenses arising from your violation of these terms or misuse of
                the platform.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                <strong className="font-medium text-foreground">
                  Waiver
                </strong>{" "}
                -- Our failure to enforce any provision of these terms shall not
                be considered a waiver of our right to enforce that or any other
                provision in the future.
              </li>
            </ul>
          </TermsSection>

          {/* Contact */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="size-4 text-primary" />
                Questions?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-relaxed text-muted-foreground">
                If you have questions about these terms, we are happy to help.
              </p>
              <div className="rounded-xl bg-muted/40 p-4">
                <p className="text-sm text-foreground">
                  <strong className="font-medium">Email:</strong>{" "}
                  <a
                    href="mailto:hello@tinkerschool.ai"
                    className="text-primary hover:underline"
                  >
                    hello@tinkerschool.ai
                  </a>
                </p>
                <p className="mt-1 text-sm text-foreground">
                  <strong className="font-medium">Privacy inquiries:</strong>{" "}
                  <a
                    href="mailto:privacy@tinkerschool.ai"
                    className="text-primary hover:underline"
                  >
                    privacy@tinkerschool.ai
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Related links */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              variant="outline"
              className="flex-1 gap-2 rounded-2xl py-6"
            >
              <Link href="/privacy">
                <FileText className="size-4" />
                Privacy Policy
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

interface TermsSectionProps {
  icon: LucideIcon;
  title: string;
  id: string;
  children: React.ReactNode;
}

function TermsSection({ icon: Icon, title, id, children }: TermsSectionProps) {
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
