import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Calendar, Clock, Tag } from "lucide-react";

import { getAllPosts } from "@/lib/blog/posts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Blog - Homeschool Resources & Learning Tips",
  description:
    "Expert guides on homeschooling, afterschooling, STEM activities, AI-powered learning, and hands-on education for kids ages 5-12. Free resources for parents.",
  openGraph: {
    title: "TinkerSchool Blog - Homeschool Resources & Learning Tips",
    description:
      "Expert guides on homeschooling, afterschooling, STEM activities, and hands-on education for kids ages 5-12.",
  },
  alternates: {
    canonical: "https://tinkerschool.ai/blog",
  },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/images/chip.png"
              alt="Chip"
              width={36}
              height={36}
              className="rounded-xl"
            />
            <span className="text-xl font-bold text-foreground">
              TinkerSchool
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-xl text-sm"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full px-6 text-sm">
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center gap-4 px-6 pb-12 pt-16 text-center">
        <div className="flex items-center gap-2">
          <BookOpen className="size-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Homeschool Resources &amp; Learning Tips
          </h1>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Practical guides for homeschool parents, afterschool families, and
          educators. STEM activities, AI-powered learning strategies, and
          hands-on project ideas for kids ages 5-12.
        </p>
      </section>

      {/* Posts Grid */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-20">
        {posts.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
              <BookOpen className="size-10 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">
                Coming Soon
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                We are working on helpful guides about homeschooling, STEM
                activities, and AI-powered learning. Check back soon!
              </p>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/">Back to Home</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="rounded-2xl border shadow-sm transition-shadow duration-200 hover:shadow-md">
                  <CardContent className="flex flex-col gap-3 p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {formatDate(post.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {post.readingTime} min read
                      </span>
                      <span className="text-muted-foreground/60">
                        {post.author}
                      </span>
                    </div>

                    <h2 className="text-lg font-semibold text-foreground">
                      {post.title}
                    </h2>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {post.description}
                    </p>

                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag className="size-3.5 text-muted-foreground" />
                        {post.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs text-muted-foreground"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Read more
                      <ArrowRight className="size-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-muted/20 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/images/chip.png"
              alt="Chip"
              width={24}
              height={24}
              className="rounded-md"
            />
            <span className="text-sm font-medium text-foreground">
              TinkerSchool.ai
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              Terms
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} TinkerSchool. Open Source.
          </p>
        </div>
      </footer>
    </div>
  );
}
