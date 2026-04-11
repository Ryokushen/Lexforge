"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User, Cloud } from "lucide-react";

export function AuthButton() {
  const { user, loading, signIn, signOut } = useAuth();
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

  const initial = user.user_metadata?.preferred_username?.[0]?.toUpperCase()
    ?? user.email?.[0]?.toUpperCase()
    ?? "U";

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs hover:bg-muted/50 transition-colors"
      >
        <Cloud className="size-3 text-emerald-500" />
        <div className="size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold">
          {initial}
        </div>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-lg border border-border/60 bg-card p-2 shadow-lg space-y-1">
            <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">
              <User className="size-3 inline mr-1" />
              {user.user_metadata?.preferred_username ?? user.email}
            </div>
            <div className="px-2 py-1 text-[10px] text-emerald-500 flex items-center gap-1">
              <Cloud className="size-2.5" />
              Synced to cloud
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
