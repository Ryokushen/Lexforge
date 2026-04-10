"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/db";
import { useStats } from "@/hooks/use-stats";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Trophy,
  Zap,
  Target,
  Flame,
  Clock,
  BookOpen,
  ScrollText,
} from "lucide-react";
import type { ReviewLog } from "@/lib/types";

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
});

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const lifetimeAccuracy =
    profile.totalReviewed > 0
      ? Math.round((profile.totalCorrect / profile.totalReviewed) * 100)
      : 0;

  const recentCorrect = recentLogs.filter((l) => l.correct).length;
  const recentAccuracy =
    recentLogs.length > 0
      ? Math.round((recentCorrect / recentLogs.length) * 100)
      : 0;

  const avgResponseTime =
    recentLogs.length > 0
      ? recentLogs.reduce((sum, l) => sum + l.responseTimeMs, 0) /
        recentLogs.length /
        1000
      : 0;

  const statItems = [
    {
      icon: Trophy,
      label: "Level",
      value: profile.level,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      icon: Zap,
      label: "Sessions",
      value: profile.totalSessions,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Target,
      label: "Lifetime Accuracy",
      value: `${lifetimeAccuracy}%`,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      icon: Flame,
      label: "Best Streak",
      value: `${profile.longestStreak}d`,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
          <BarChart3 className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Stats & Progress</h1>
          <p className="text-sm text-muted-foreground">Your journey at a glance</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map(({ icon: Icon, label, value, color, bg }, i) => (
          <motion.div key={label} {...fadeIn(i * 0.08)}>
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
              <CardContent className="pt-5 pb-4 text-center relative">
                <div className={`inline-flex items-center justify-center size-9 rounded-full ${bg} ${color} mb-2`}>
                  <Icon className="size-4" />
                </div>
                <div className="text-2xl font-bold tabular-nums">{value}</div>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* RPG Stats & Recent Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div {...fadeIn(0.3)}>
          <StatCard stats={profile.stats} />
        </motion.div>

        <motion.div {...fadeIn(0.4)}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ScrollText className="size-4 text-primary" />
                Recent Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Recent Accuracy</span>
                  <span className="font-semibold tabular-nums">{recentAccuracy}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${recentAccuracy}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {[
                  { icon: Clock, label: "Avg Response Time", value: `${avgResponseTime.toFixed(1)}s` },
                  { icon: Target, label: "Words Due", value: dueCount },
                  { icon: BookOpen, label: "Total Words", value: wordCount },
                  { icon: ScrollText, label: "Reviews Logged", value: profile.totalReviewed },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Icon className="size-3.5" />
                      {label}
                    </span>
                    <span className="font-medium tabular-nums">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
