"use client";

import { GraduationCap, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { useSidebarCollapse } from "@/hooks/use-sidebar-collapse";
import { SidebarNav } from "@/components/sidebar-nav";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardSidebarProps {
  displayName: string;
  avatarInitial: string;
  email: string;
}

export function DashboardSidebar({
  displayName,
  avatarInitial,
  email,
}: DashboardSidebarProps) {
  const { isCollapsed, toggle, isHydrated } = useSidebarCollapse();

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-r border-border bg-sidebar lg:flex",
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 items-center gap-2",
          isCollapsed ? "justify-center px-2" : "px-5"
        )}
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="size-5 text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <span className="text-xl font-bold text-primary">TinkerSchool</span>
        )}
      </div>

      <Separator />

      {/* Navigation */}
      <div
        className={cn(
          "flex-1 overflow-y-auto py-4",
          isCollapsed ? "px-1.5" : "px-3"
        )}
      >
        <SidebarNav isCollapsed={isCollapsed} />
      </div>

      {/* Collapse toggle */}
      {isHydrated && (
        <div
          className={cn(
            "px-3 pb-2",
            isCollapsed && "flex justify-center px-1.5"
          )}
        >
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggle}
                  className={cn(
                    "size-10 rounded-xl text-muted-foreground hover:text-foreground",
                    !isCollapsed && "w-full justify-start gap-2 px-4"
                  )}
                  aria-label={
                    isCollapsed ? "Expand sidebar" : "Collapse sidebar"
                  }
                >
                  {isCollapsed ? (
                    <PanelLeftOpen className="size-5 shrink-0" />
                  ) : (
                    <>
                      <PanelLeftClose className="size-5 shrink-0" />
                      <span className="text-sm font-medium">Collapse</span>
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" sideOffset={8}>
                  Expand sidebar
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      <Separator />

      {/* User info + sign out */}
      <div className={cn("p-4", isCollapsed && "flex flex-col items-center p-2")}>
        <div
          className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center"
          )}
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {avatarInitial}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {displayName}
              </p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <SignOutButton>
            <Button
              variant="ghost"
              className="mt-3 h-10 w-full justify-start gap-2 rounded-xl text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-5" />
              <span>Sign Out</span>
            </Button>
          </SignOutButton>
        )}
      </div>
    </aside>
  );
}
