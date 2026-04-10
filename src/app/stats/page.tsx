"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { useStats } from "@/hooks/use-stats";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ReviewLog } from "@/lib/types";

export default function StatsPage() {
  const { profile, dueCount, wordCount, loading } = useStats();
  const [recentLogs, setRecentLogs] = useState<ReviewLog[]>([]);

  useEffect(() => {
    db.reviewLogs
      .orderBy("reviewedAt")
      .reverse()
      .limit(50)
      .toArray()
      .then(setRecentLogs);
  }, []);

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const lifetimeAccuracy =
    profile.totalReviewed > 0
      ? Math.round((profile.totalCorrect / profile.totalReviewed) * 100)
      : 0;

  // Recent accuracy (last 50 reviews)
  const recentCorrect = recentLogs.filter((l) => l.correct).length;
  const recentAccuracy =
    recentLogs.length > 0
      ? Math.round((recentCorrect / recentLogs.length) * 100)
      : 0;

  // Average response time from recent logs
  const avgResponseTime =
    recentLogs.length > 0
      ? recentLogs.reduce((sum, l) => sum + l.responseTimeMs, 0) /
        recentLogs.length /
        1000
      : 0;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Stats &amp; Progress</h1>
        <Link href="/">
          <Button variant="outline">Dashboard</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold">{profile.level}</div>
            <p className="text-sm text-muted-foreground">Level</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold">{profile.totalSessions}</div>
            <p className="text-sm text-muted-foreground">Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold">{lifetimeAccuracy}%</div>
            <p className="text-sm text-muted-foreground">Lifetime Accuracy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold">{profile.longestStreak}</div>
            <p className="text-sm text-muted-foreground">Best Streak</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard stats={profile.stats} />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Recent Accuracy</span>
                <span>{recentAccuracy}%</span>
              </div>
              <Progress value={recentAccuracy} className="h-2" />
            </div>
            <div className="flex justify-between text-sm">
              <span>Avg Response Time</span>
              <span>{avgResponseTime.toFixed(1)}s</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Words Due</span>
              <span>{dueCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Words</span>
              <span>{wordCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Reviews Logged</span>
              <span>{profile.totalReviewed}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
