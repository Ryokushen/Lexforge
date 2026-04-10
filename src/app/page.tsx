"use client";

import Link from "next/link";
import { useStats } from "@/hooks/use-stats";
import { DailySummary } from "@/components/dashboard/daily-summary";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { profile, dueCount, wordCount, loading } = useStats();

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Memory &amp; Vocabulary</h1>
        <p className="text-muted-foreground">
          Train your recall. Build your character.
        </p>
      </div>

      <DailySummary
        profile={profile}
        dueCount={dueCount}
        wordCount={wordCount}
      />

      <div className="flex justify-center">
        <Link href="/session">
          <Button size="lg" className="text-lg px-8 py-6">
            {dueCount > 0
              ? `Start Training (${dueCount} due)`
              : "Start Training"}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard stats={profile.stats} />

        <div className="space-y-4">
          <Link href="/words">
            <Button variant="outline" className="w-full">
              Word Library ({wordCount})
            </Button>
          </Link>
          <Link href="/stats">
            <Button variant="outline" className="w-full">
              Detailed Stats
            </Button>
          </Link>
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>
              Sessions: {profile.totalSessions} &middot; Best streak:{" "}
              {profile.longestStreak} days
            </p>
            <p>
              Lifetime: {profile.totalCorrect}/{profile.totalReviewed} correct
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
