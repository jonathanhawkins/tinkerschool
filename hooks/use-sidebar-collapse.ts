"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "tinkerschool-sidebar-collapsed";

export function useSidebarCollapse() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setIsCollapsed(true);
    }
    setIsHydrated(true);
  }, []);

  const toggle = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return { isCollapsed, toggle, isHydrated };
}
