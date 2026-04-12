"use client";

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

export default function Dashboard() {
  const { seedStatus, seedError, retrySeed } = useBootstrap();
  const { profile, dueCount, newCount, wordCount, loading, setDifficulty } = useStats();

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (seedStatus === "error" && wordCount === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <AlertTriangle className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Starter library unavailable</h1>
            <p className="max-w-md text-sm text-muted-foreground">
              {seedError ?? "Lexforge couldn&apos;t finish preparing the built-in word set."}
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
    <main className="max-w-5xl mx-auto px-4 py-4 space-y-4">
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
