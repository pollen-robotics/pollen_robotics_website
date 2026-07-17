"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AppItem } from "@/lib/apps";

interface AppsContextValue {
  apps: AppItem[];
  loading: boolean;
  error: string | null;
}

const AppsContext = createContext<AppsContextValue | null>(null);

/**
 * Provider seeded with the JS-only app catalog fetched on the server (SSR/ISR).
 * The list ships in the initial HTML - no client round-trip, indexable, no CORS.
 */
export function AppsProvider({
  initialApps,
  children,
}: {
  initialApps: AppItem[];
  children: ReactNode;
}) {
  return (
    <AppsContext.Provider
      value={{ apps: initialApps, loading: false, error: null }}
    >
      {children}
    </AppsContext.Provider>
  );
}

export function useApps(): AppsContextValue {
  const context = useContext(AppsContext);
  if (!context) {
    throw new Error("useApps must be used within an AppsProvider");
  }
  return context;
}
