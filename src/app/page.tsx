"use client";

import { useState } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { useStats } from "@/hooks/use-stats";
import { useBootstrap } from "@/lib/bootstrap-context";
import { CharacterBanner } from "@/components/dashboard/character-banner";
import { QuestCard } from "@/components/dashboard/quest-card";
import { StatDiamond } from "@/components/dashboard/stat-diamond";
import { JourneyPanel } from "@/components/dashboard/journey-panel";
import { DifficultySelector } from "@/components/dashboard/difficulty-selector";
import { Button } from "@/components/ui/button";
import { DIFFICULTY_CONFIG } from "@/lib/types";

const SESSION_EXIT_STORAGE_KEY = "lexforge-session-exit-summary";

export default function Dashboard() {
  const { seedStatus, seedError, retrySeed } = useBootstrap();
  const { profile, dueCount, newCount, wordCount, loading, setDifficulty } = useStats();
  const [savedProgressMessage] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;

    const raw = window.sessionStorage.getItem(SESSION_EXIT_STORAGE_KEY);
    if (!raw) return null;

    window.sessionStorage.removeItem(SESSION_EXIT_STORAGE_KEY);

    try {
      const parsed = JSON.parse(raw) as { savedCount?: number };
      if (!parsed.savedCount) return null;

      return `${parsed.savedCount} ${parsed.savedCount === 1 ? "word" : "words"} saved from your last session.`;
    } catch {
      return null;
    }
  });

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground font-display uppercase-tracked text-xs">Loading…</p>
      </div>
    );
  }

  if (seedStatus === "error" && wordCount === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
          <div
            className="flex size-14 items-center justify-center rounded-[var(--radius)]"
            style={{
              background: "color-mix(in oklab, var(--crimson), transparent 88%)",
              color: "var(--crimson)",
              border: "1px solid color-mix(in oklab, var(--crimson), transparent 60%)",
            }}
          >
            <AlertTriangle className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-bold">Starter library unavailable</h1>
            <p className="max-w-md text-sm text-muted-foreground italic">
              {seedError ?? "Lexforge couldn't finish preparing the built-in word set."}
            </p>
          </div>
          <Button onClick={retrySeed} className="gap-2">
            <RotateCcw className="size-4" />
            Retry Setup
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      {savedProgressMessage && (
        <div
          className="rounded-[var(--radius)] px-4 py-3 text-sm italic"
          style={{
            background: "color-mix(in oklab, var(--sage), transparent 88%)",
            border: "1px solid color-mix(in oklab, var(--sage), transparent 60%)",
            color: "var(--ink)",
          }}
        >
          {savedProgressMessage}
        </div>
      )}
      <CharacterBanner profile={profile} />
      <QuestCard
        dueCount={dueCount}
        newCount={newCount}
        wordCount={wordCount}
        sessionSize={DIFFICULTY_CONFIG[profile.difficulty].sessionSize}
        difficulty={profile.difficulty}
      />
      <DifficultySelector current={profile.difficulty} onChange={setDifficulty} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatDiamond stats={profile.stats} />
        <JourneyPanel profile={profile} wordCount={wordCount} />
      </div>
    </main>
  );
}
