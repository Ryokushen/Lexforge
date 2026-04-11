"use client";

import { useEffect, useState } from "react";
import { ensureSeedDatabase } from "@/lib/seed";
import { NavBar } from "@/components/nav-bar";
import { AuthProvider } from "@/lib/auth-context";
import { BootstrapProvider, type BootstrapStatus } from "@/lib/bootstrap-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const [seedStatus, setSeedStatus] = useState<BootstrapStatus>("seeding");
  const [seedError, setSeedError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void ensureSeedDatabase()
      .then(() => {
        if (cancelled) return;
        setSeedStatus("ready");
      })
      .catch((error) => {
        console.error("Database seed failed:", error);
        if (cancelled) return;
        setSeedStatus("error");
        setSeedError(
          error instanceof Error ? error.message : "Unknown seed error",
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <BootstrapProvider value={{ seedStatus, seedError }}>
      <AuthProvider>
        <NavBar />
        <div className="flex-1">{children}</div>
      </AuthProvider>
    </BootstrapProvider>
  );
}
