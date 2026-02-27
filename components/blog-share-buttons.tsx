"use client";

import { useState } from "react";
import { Check, Copy, Facebook, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BlogShareButtonsProps {
  /** The full URL to share */
  url: string;
  /** Post title for share text */
  title: string;
  /** Optional className */
  className?: string;
}

// ---------------------------------------------------------------------------
// Pinterest SVG icon (not in Lucide)
// ---------------------------------------------------------------------------

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// X (Twitter) SVG icon
// ---------------------------------------------------------------------------

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BlogShareButtons({
  url,
  title,
  className,
}: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Share2 className="size-3.5" />
        Share
      </span>

      {/* Facebook */}
      <Button
        asChild
        variant="outline"
        size="icon"
        className="size-8 rounded-lg"
        aria-label="Share on Facebook"
      >
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook className="size-3.5" />
        </a>
      </Button>

      {/* Pinterest */}
      <Button
        asChild
        variant="outline"
        size="icon"
        className="size-8 rounded-lg"
        aria-label="Pin on Pinterest"
      >
        <a
          href={`https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <PinterestIcon className="size-3.5" />
        </a>
      </Button>

      {/* X / Twitter */}
      <Button
        asChild
        variant="outline"
        size="icon"
        className="size-8 rounded-lg"
        aria-label="Share on X"
      >
        <a
          href={`https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <XIcon className="size-3.5" />
        </a>
      </Button>

      {/* Copy Link */}
      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-lg"
        aria-label="Copy link"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="size-3.5 text-emerald-600" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </Button>
    </div>
  );
}
