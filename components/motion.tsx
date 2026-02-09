"use client";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Shared animation wrapper components using CSS animations.
// Reliable across SSR hydration — no JS animation engine dependency.
// ---------------------------------------------------------------------------

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  return (
    <div
      className={cn("animate-fade-in-up fill-mode-both", className)}
      style={delay > 0 ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
}

export function Stagger({ children, className }: StaggerProps) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({ children, className }: StaggerProps) {
  return (
    <div className={cn("animate-fade-in-up fill-mode-both", className)}>
      {children}
    </div>
  );
}

interface HoverLiftProps {
  children: React.ReactNode;
  className?: string;
}

export function HoverLift({ children, className }: HoverLiftProps) {
  return (
    <div className={cn("transition-transform duration-200 ease-out hover:-translate-y-1", className)}>
      {children}
    </div>
  );
}
