"use client";

/**
 * FullscreenToggle -- a button that enters/exits browser fullscreen mode.
 *
 * Used on lesson pages to maximize content area, especially on tablets.
 * Hides all dashboard chrome (sidebar, mobile header, bottom nav) via CSS
 * :fullscreen pseudo-class rules in globals.css.
 *
 * On tablets, shows a one-time suggestion banner encouraging fullscreen mode
 * for a better learning experience.
 */

import { useCallback, useEffect, useState } from "react";
import { Maximize2, Minimize2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useDeviceMode, isTouchDevice } from "@/hooks/use-device-mode";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SUGGESTION_STORAGE_KEY = "tinkerschool-fullscreen-suggested";

export function FullscreenToggle() {
  const { isFullscreen, isSupported, toggle } = useFullscreen();
  const deviceMode = useDeviceMode();
  const isTouch = isTouchDevice(deviceMode);
  const [showSuggestion, setShowSuggestion] = useState(false);

  // On tablets, show a one-time suggestion to use fullscreen
  useEffect(() => {
    if (!isTouch || !isSupported) return;

    const alreadySuggested = localStorage.getItem(SUGGESTION_STORAGE_KEY);
    if (!alreadySuggested) {
      // Small delay so the page content loads first
      const timer = setTimeout(() => setShowSuggestion(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isTouch, isSupported]);

  const handleDismissSuggestion = useCallback(() => {
    setShowSuggestion(false);
    localStorage.setItem(SUGGESTION_STORAGE_KEY, "true");
  }, []);

  const handleAcceptSuggestion = useCallback(async () => {
    setShowSuggestion(false);
    localStorage.setItem(SUGGESTION_STORAGE_KEY, "true");
    await toggle();
  }, [toggle]);

  // Don't render anything if the browser doesn't support fullscreen
  if (!isSupported) return null;

  return (
    <>
      {/* Toggle button */}
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggle()}
              className={cn(
                "size-10 shrink-0 rounded-xl text-muted-foreground hover:text-foreground",
                "touch-manipulation",
              )}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isFullscreen ? (
                  <motion.div
                    key="minimize"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Minimize2 className="size-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="maximize"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Maximize2 className="size-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </TooltipTrigger>
          {!isTouch && (
            <TooltipContent side="bottom" sideOffset={4}>
              {isFullscreen ? "Exit fullscreen" : "Fullscreen mode"}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      {/* Floating exit button when in fullscreen (always visible, top-right) */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed right-4 top-4 z-[9999]"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggle()}
              className={cn(
                "gap-1.5 rounded-xl shadow-lg",
                "border-border bg-white text-foreground",
                "hover:bg-muted",
                "touch-manipulation",
              )}
            >
              <Minimize2 className="size-4" />
              <span className="text-xs font-medium">Exit Fullscreen</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tablet suggestion banner (one-time) */}
      <AnimatePresence>
        {showSuggestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-4 bottom-20 z-[9998] mx-auto max-w-md"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-lg backdrop-blur-sm">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Maximize2 className="size-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Try fullscreen mode!
                </p>
                <p className="text-xs text-muted-foreground">
                  More room for your lesson on this screen
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <Button
                  size="sm"
                  onClick={handleAcceptSuggestion}
                  className="h-9 rounded-xl px-3 text-xs touch-manipulation"
                >
                  Go Big
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDismissSuggestion}
                  className="size-9 shrink-0 rounded-xl text-muted-foreground touch-manipulation"
                  aria-label="Dismiss fullscreen suggestion"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
