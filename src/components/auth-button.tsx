"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Cloud,
  CloudOff,
  LoaderCircle,
  LogIn,
  LogOut,
  RotateCcw,
  User,
  WifiOff,
} from "lucide-react";

function formatLastSync(lastSyncAt: string | null): string {
  if (!lastSyncAt) return "No successful sync yet";

  const timestamp = new Date(lastSyncAt);

  return `Last synced ${timestamp.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

function formatHistoryTimestamp(timestamp: string | null): string {
  if (!timestamp) return "Never";

  return new Date(timestamp).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function AuthButton() {
  const {
    user,
    loading,
    syncState,
    syncError,
    lastSyncError,
    lastSyncAt,
    lastSyncAttemptAt,
    lastSyncErrorAt,
    isOnline,
    signIn,
    signOut,
    syncNow,
    retrySync,
  } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (loading) return null;

  if (!user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={signIn}
        className="gap-1.5 text-xs text-muted-foreground"
      >
        <LogIn className="size-3.5" />
        <span className="hidden sm:inline">Sign In</span>
      </Button>
    );
  }

  const syncUi = {
    synced: {
      icon: Cloud,
      iconClassName: "text-emerald-500",
      badgeClassName: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
      label: "Synced",
      detail: formatLastSync(lastSyncAt),
    },
    syncing: {
      icon: LoaderCircle,
      iconClassName: "animate-spin text-sky-400",
      badgeClassName: "border-sky-500/20 bg-sky-500/10 text-sky-400",
      label: "Syncing",
      detail: "Updating cloud backup now",
    },
    offline: {
      icon: WifiOff,
      iconClassName: "text-amber-400",
      badgeClassName: "border-amber-500/20 bg-amber-500/10 text-amber-400",
      label: "Offline",
      detail: isOnline
        ? formatLastSync(lastSyncAt)
        : "Progress is saved locally until you reconnect",
    },
    error: {
      icon: CloudOff,
      iconClassName: "text-red-400",
      badgeClassName: "border-red-500/20 bg-red-500/10 text-red-400",
      label: "Sync Error",
      detail: syncError ?? "Local progress is safe. Retry cloud sync.",
    },
    idle: {
      icon: Cloud,
      iconClassName: "text-muted-foreground",
      badgeClassName: "border-border/60 bg-muted/40 text-muted-foreground",
      label: "Local Only",
      detail: "Sign in to back up progress across devices",
    },
  }[syncState];

  const StatusIcon = syncUi.icon;

  const initial = user.user_metadata?.preferred_username?.[0]?.toUpperCase()
    ?? user.email?.[0]?.toUpperCase()
    ?? "U";

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs hover:bg-muted/50 transition-colors"
      >
        <StatusIcon className={`size-3 ${syncUi.iconClassName}`} />
        <div className="size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold">
          {initial}
        </div>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 w-64 rounded-lg border border-border/60 bg-card p-2 shadow-lg space-y-2">
            <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">
              <User className="size-3 inline mr-1" />
              {user.user_metadata?.preferred_username ?? user.email}
            </div>
            <div className="rounded-md border border-border/50 bg-muted/20 px-2 py-2">
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant="outline"
                  className={`h-auto rounded-md px-1.5 py-1 text-[10px] ${syncUi.badgeClassName}`}
                >
                  <StatusIcon className={`size-3 ${syncUi.iconClassName}`} />
                  {syncUi.label}
                </Badge>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => void syncNow()}
                    disabled={!isOnline || syncState === "syncing"}
                    className="gap-1 px-1.5"
                  >
                    {syncState === "syncing" ? (
                      <LoaderCircle className="size-3 animate-spin" />
                    ) : (
                      <RotateCcw className="size-3" />
                    )}
                    Sync now
                  </Button>
                  {(syncState === "error" || syncState === "offline") && (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => void retrySync()}
                      disabled={!isOnline}
                      className="gap-1 px-1.5"
                    >
                      <RotateCcw className="size-3" />
                      Retry
                    </Button>
                  )}
                </div>
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {syncUi.detail}
              </p>
            </div>
            <div className="rounded-md border border-border/50 bg-muted/20 px-2 py-2 text-[10px] text-muted-foreground space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span>Last attempt</span>
                <span className="text-foreground/80">
                  {formatHistoryTimestamp(lastSyncAttemptAt)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>Last success</span>
                <span className="text-foreground/80">
                  {formatHistoryTimestamp(lastSyncAt)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span>Last error</span>
                <span className="max-w-[11rem] text-right text-foreground/80">
                  {lastSyncErrorAt
                    ? `${formatHistoryTimestamp(lastSyncErrorAt)}${lastSyncError ? `: ${lastSyncError}` : ""}`
                    : "None"}
                </span>
              </div>
            </div>
            <hr className="border-border/40" />
            <button
              onClick={() => { signOut(); setShowMenu(false); }}
              className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted/50 transition-colors"
            >
              <LogOut className="size-3" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
