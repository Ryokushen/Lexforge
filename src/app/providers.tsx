"use client";

import { useEffect, useState } from "react";
import { seedDatabase } from "@/lib/seed";
import { NavBar } from "@/components/nav-bar";

export function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedDatabase().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <span className="text-3xl animate-pulse">&#x1F4DC;</span>
          <p className="text-muted-foreground text-sm">Preparing your quest...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="flex-1">{children}</div>
    </>
  );
}
