import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";

import { getAllPosts, getPostBySlug } from "@/lib/blog/posts";
import { markdownToHtml } from "@/lib/blog/markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
    alternates: {
      canonical: `https://tinkerschool.ai/blog/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const contentHtml = markdownToHtml(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.updatedDate ?? post.date,
        author: {
          "@type": "Person",
          name: post.author,
        },
        publisher: {
          "@type": "Organization",
          name: "TinkerSchool",
          url: "https://tinkerschool.ai",
          logo: "https://tinkerschool.ai/images/chip.png",
        },
        keywords: post.tags.join(", "),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://tinkerschool.ai/blog/${post.slug}`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://tinkerschool.ai",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: "https://tinkerschool.ai/blog",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: `https://tinkerschool.ai/blog/${post.slug}`,
          },
        ],
      },
    ],
  };

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

      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Article Content */}
      <article className="mx-auto w-full max-w-2xl px-6 pb-20 pt-12">
        {/* Back link */}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mb-8 -ml-2 rounded-xl text-sm text-muted-foreground"
        >
          <Link href="/blog">
            <ArrowLeft className="size-4" />
            Back to Blog
          </Link>
        </Button>

        {/* Post header */}
        <header className="mb-8 flex flex-col gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {post.title}
          </h1>

          <p className="text-base leading-relaxed text-muted-foreground">
            {post.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="size-3.5" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {post.readingTime} min read
            </span>
          </div>

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

          <hr className="border-border" />
        </header>

        {/* Post body */}
        <div
          className="blog-prose"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Post footer */}
        <footer className="mt-12 border-t border-border pt-8">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-xl text-sm"
          >
            <Link href="/blog">
              <ArrowLeft className="size-4" />
              Back to all posts
            </Link>
          </Button>
        </footer>
      </article>

      {/* Page Footer */}
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
