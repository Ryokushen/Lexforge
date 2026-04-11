"use client";

import { createContext, useContext } from "react";

export type BootstrapStatus = "seeding" | "ready" | "error";

interface BootstrapContextValue {
  seedStatus: BootstrapStatus;
  seedError: string | null;
}

const BootstrapContext = createContext<BootstrapContextValue>({
  seedStatus: "seeding",
  seedError: null,
});

export function BootstrapProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: BootstrapContextValue;
}) {
  return (
    <BootstrapContext.Provider value={value}>
      {children}
    </BootstrapContext.Provider>
  );
}

export function useBootstrap() {
  return useContext(BootstrapContext);
}
