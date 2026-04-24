"use client";

import { AlertTriangle, CloudOff, LoaderCircle, RotateCcw, WifiOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useBootstrap } from "@/lib/bootstrap-context";
import { Button } from "@/components/ui/button";

export function AppStatusBanner() {
  const { user, isOnline, syncState, syncError, retrySync } = useAuth();
  const { seedStatus, seedError, retrySeed } = useBootstrap();

  if (seedStatus === "error") {
    return (
      <div className="border-b border-red-500/20 bg-red-500/8">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2 text-red-200">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-300" />
            <div>
              <p>Couldn&apos;t finish preparing your starter library.</p>
              <p className="text-xs text-red-200/80">
                {seedError ?? "Retry setup to restore the built-in word set."}
              </p>
            </div>
          </div>
          <Button
            size="xs"
            variant="outline"
            onClick={retrySeed}
            className="gap-1 self-start border-red-400/30 bg-transparent text-red-100 hover:bg-red-500/10"
          >
            <RotateCcw className="size-3" />
            Retry Setup
          </Button>
        </div>
      </div>
    );
  }

  if (seedStatus === "seeding") {
    return (
      <div className="border-b border-blue-500/20 bg-blue-500/8">
        <div className="mx-auto flex max-w-5xl items-start gap-2 px-4 py-2 text-sm text-blue-100">
          <LoaderCircle className="mt-0.5 size-4 shrink-0 animate-spin text-blue-300" />
          <div>
            <p>Preparing your starter library in the background.</p>
            <p className="text-xs text-blue-100/80">
              You can browse now, and cloud backup is available once you sign in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="border-b border-amber-500/20 bg-amber-500/8">
        <div className="mx-auto flex max-w-5xl items-start gap-2 px-4 py-2 text-sm text-amber-100">
          <WifiOff className="mt-0.5 size-4 shrink-0 text-amber-300" />
          <div>
            <p>Offline mode is active. Your progress is still saved on this device.</p>
            <p className="text-xs text-amber-100/80">
              {user
                ? "Cloud sync resumes automatically when you reconnect."
                : "Sign in later to enable cloud backup across devices."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (user && syncState === "error") {
    return (
      <div className="border-b border-red-500/20 bg-red-500/8">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2 text-red-100">
            <CloudOff className="mt-0.5 size-4 shrink-0 text-red-300" />
            <div>
              <p>Cloud sync failed, but your local progress is safe.</p>
              <p className="text-xs text-red-100/80">
                {syncError ?? "Retry when you're ready."}
              </p>
            </div>
          </div>
          <Button
            size="xs"
            variant="outline"
            onClick={() => void retrySync()}
            className="gap-1 self-start border-red-400/30 bg-transparent text-red-100 hover:bg-red-500/10"
          >
            <RotateCcw className="size-3" />
            Retry Sync
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
