"use client";

import { useStats } from "@/hooks/use-stats";
import { CharacterBanner } from "@/components/dashboard/character-banner";
import { QuestCard } from "@/components/dashboard/quest-card";
import { StatDiamond } from "@/components/dashboard/stat-diamond";
import { JourneyPanel } from "@/components/dashboard/journey-panel";

export default function Dashboard() {
  const { profile, dueCount, wordCount, loading } = useStats();

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-4 space-y-4">
      <CharacterBanner profile={profile} />
      <QuestCard dueCount={dueCount} wordCount={wordCount} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatDiamond stats={profile.stats} />
        <JourneyPanel profile={profile} wordCount={wordCount} />
      </div>
    </main>
  );
}
