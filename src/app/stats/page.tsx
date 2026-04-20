"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/db";
import { useBootstrap } from "@/lib/bootstrap-context";
import { useStats } from "@/hooks/use-stats";
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
  Brain,
  Eye,
  Lightbulb,
  Gauge,
  Lock,
  TrendingUp,
  HeartPulse,
  ShieldAlert,
  AlertTriangle,
  LifeBuoy,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { useRetrievalHealth } from "@/hooks/use-retrieval-health";
import type { ReviewLog } from "@/lib/types";
import { DIFFICULTY_CONFIG, TIER_UNLOCK_LEVELS } from "@/lib/types";
import { getRecentRetrievalMetrics } from "./page.helpers";

// ── Animation helpers ────────────────────────────────────────────────────

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
});

// ── Accuracy color helper ────────────────────────────────────────────────

function accuracyColor(pct: number): string {
  if (pct > 70) return "text-emerald-400";
  if (pct >= 40) return "text-amber-400";
  return "text-red-400";
}

function accuracyBarColor(pct: number): string {
  if (pct > 70) return "bg-emerald-500";
  if (pct >= 40) return "bg-amber-500";
  return "bg-red-500";
}

// ── RPG stat config (mirrors stat-diamond) ──────────────────────────────

const STAT_CONFIG = [
  {
    key: "recall" as const,
    label: "Recall",
    desc: "Word retrieval",
    icon: Target,
    color: "text-blue-400",
    bg: "bg-blue-500",
    bgLight: "bg-blue-500/10",
    gradient: "from-blue-500/8 to-transparent",
  },
  {
    key: "retention" as const,
    label: "Retention",
    desc: "Long-term memory",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-500",
    bgLight: "bg-purple-500/10",
    gradient: "from-purple-500/8 to-transparent",
  },
  {
    key: "perception" as const,
    label: "Perception",
    desc: "Processing speed",
    icon: Eye,
    color: "text-amber-400",
    bg: "bg-amber-500",
    bgLight: "bg-amber-500/10",
    gradient: "from-amber-500/8 to-transparent",
  },
  {
    key: "creativity" as const,
    label: "Creativity",
    desc: "Visual association",
    icon: Lightbulb,
    color: "text-emerald-400",
    bg: "bg-emerald-500",
    bgLight: "bg-emerald-500/10",
    gradient: "from-emerald-500/8 to-transparent",
  },
];

// ── Difficulty display ───────────────────────────────────────────────────

const DIFFICULTY_DISPLAY = {
  easy: { label: "Easy", color: "text-emerald-400", bg: "bg-emerald-500/10", icon: Gauge },
  normal: { label: "Normal", color: "text-amber-400", bg: "bg-amber-500/10", icon: Flame },
  hard: { label: "Hard", color: "text-red-400", bg: "bg-red-500/10", icon: Zap },
};

// ── Tier info ────────────────────────────────────────────────────────────

const TIER_INFO: Record<string, { label: string; color: string; bg: string; border: string }> = {
  "1": { label: "Core Articulation", color: "text-emerald-500", bg: "bg-emerald-500", border: "border-emerald-500/30" },
  "2": { label: "Precision Vocabulary", color: "text-blue-500", bg: "bg-blue-500", border: "border-blue-500/30" },
  "3": { label: "Power Words", color: "text-purple-500", bg: "bg-purple-500", border: "border-purple-500/30" },
};

// ── Page ─────────────────────────────────────────────────────────────────

export default function StatsPage() {
  const { seedStatus } = useBootstrap();
  const { profile, dueCount, wordCount, loading } = useStats();
  const retrieval = useRetrievalHealth();
  const [recentLogs, setRecentLogs] = useState<ReviewLog[]>([]);

  useEffect(() => {
    db.reviewLogs
      .orderBy("reviewedAt")
      .reverse()
      .limit(50)
      .toArray()
      .then(setRecentLogs);
  }, [seedStatus]);

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // ── Derived values ─────────────────────────────────────────────────────

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
  const recentRetrievalMetrics = getRecentRetrievalMetrics(recentLogs);

  const maxStat = Math.max(...Object.values(profile.stats), 10);

  const diffDisplay = DIFFICULTY_DISPLAY[profile.difficulty];
  const diffConfig = DIFFICULTY_CONFIG[profile.difficulty];

  // ── Overview tiles ─────────────────────────────────────────────────────

  const overviewTiles = [
    {
      icon: Trophy,
      label: "Level",
      value: profile.level,
      color: "text-amber-400",
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
      label: "Accuracy",
      value: `${lifetimeAccuracy}%`,
      color: accuracyColor(lifetimeAccuracy),
      bg:
        lifetimeAccuracy > 70
          ? "bg-emerald-500/10"
          : lifetimeAccuracy >= 40
            ? "bg-amber-500/10"
            : "bg-red-500/10",
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
    <main className="max-w-5xl mx-auto px-4 py-4 space-y-4">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0)} className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
          <BarChart3 className="size-4.5" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Stats & Progress</h1>
          <p className="text-xs text-muted-foreground">Your journey at a glance</p>
        </div>
      </motion.div>

      {/* ── Overview Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {overviewTiles.map(({ icon: Icon, label, value, color, bg }, i) => (
          <motion.div key={label} {...fadeUp(0.05 + i * 0.07)}>
            <Card size="sm" className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
              <CardContent className="pt-4 pb-3 text-center relative">
                <div
                  className={`inline-flex items-center justify-center size-8 rounded-full ${bg} ${color} mb-1.5`}
                >
                  <Icon className="size-4" />
                </div>
                <div className={`text-xl font-bold tabular-nums ${color}`}>{value}</div>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── RPG Stats + Recent Performance ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* RPG Stats */}
        <motion.div {...fadeUp(0.25)}>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="text-base">&#x2694;&#xFE0F;</span>
                RPG Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {STAT_CONFIG.map(({ key, label, desc, icon: Icon, color, bg, bgLight, gradient }, i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.07, duration: 0.28 }}
                    className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${gradient} bg-muted/30 p-3`}
                  >
                    {/* Watermark icon */}
                    <Icon
                      className={`absolute -right-2 -bottom-2 size-14 ${color} opacity-[0.06]`}
                    />
                    <div className="relative space-y-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex items-center justify-center size-8 rounded-lg ${bgLight} ${color}`}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
                          <p className="text-xl font-bold tabular-nums leading-tight">
                            {profile.stats[key]}
                          </p>
                        </div>
                      </div>
                      <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${bg}`}
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(profile.stats[key] / maxStat) * 100}%`,
                          }}
                          transition={{
                            duration: 0.6,
                            ease: "easeOut",
                            delay: 0.45 + i * 0.1,
                          }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground/60">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Performance */}
        <motion.div {...fadeUp(0.32)}>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <ScrollText className="size-4 text-primary" />
                Recent Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Accuracy bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-muted-foreground">Recent Accuracy</span>
                  <span
                    className={`text-sm font-bold tabular-nums ${accuracyColor(recentAccuracy)}`}
                  >
                    {recentAccuracy}%
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${accuracyBarColor(recentAccuracy)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${recentAccuracy}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground/60">
                  Last {recentLogs.length} reviews
                </p>
              </div>

              {/* Stat rows */}
              <div className="space-y-2 pt-0.5">
                {[
                  {
                    icon: Clock,
                    label: "Avg Response",
                    value: `${avgResponseTime.toFixed(1)}s`,
                    color: "text-muted-foreground",
                  },
                  {
                    icon: Target,
                    label: "Clean Retrieval",
                    value: recentRetrievalMetrics.cleanRate !== null ? `${recentRetrievalMetrics.cleanRate}%` : "—",
                    color: recentRetrievalMetrics.cleanRate === null
                      ? "text-muted-foreground"
                      : recentRetrievalMetrics.cleanRate >= 70
                        ? "text-emerald-400"
                        : recentRetrievalMetrics.cleanRate >= 40
                          ? "text-amber-400"
                          : "text-red-400",
                  },
                  {
                    icon: Lightbulb,
                    label: "Cue Use",
                    value: recentRetrievalMetrics.cueUseRate !== null ? `${recentRetrievalMetrics.cueUseRate}%` : "—",
                    color: recentRetrievalMetrics.cueUseRate === null
                      ? "text-muted-foreground"
                      : recentRetrievalMetrics.cueUseRate <= 20
                        ? "text-emerald-400"
                        : recentRetrievalMetrics.cueUseRate <= 40
                          ? "text-amber-400"
                          : "text-red-400",
                  },
                  {
                    icon: Target,
                    label: "To Review",
                    value: dueCount,
                    color: dueCount > 0 ? "text-amber-400" : "text-emerald-400",
                  },
                  {
                    icon: BookOpen,
                    label: "Total Words",
                    value: wordCount,
                    color: "text-primary",
                  },
                  {
                    icon: ScrollText,
                    label: "Reviews Logged",
                    value: profile.totalReviewed,
                    color: "text-muted-foreground",
                  },
                  {
                    icon: TrendingUp,
                    label: "Total Correct",
                    value: profile.totalCorrect,
                    color: "text-emerald-400",
                  },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Icon className="size-3.5" />
                      {label}
                    </span>
                    <span className={`text-xs font-bold tabular-nums ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Retrieval Health ──────────────────────────────────────────── */}
      {!retrieval.loading && (
        <motion.div {...fadeUp(0.36)}>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <HeartPulse className="size-4 text-rose-400" />
                Retrieval Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Headline metrics with trend arrows */}
              <div className="grid grid-cols-2 gap-3">
                {/* Unassisted Recall */}
                <div className="rounded-xl bg-muted/30 p-3 space-y-1">
                  <p className="text-[10px] font-medium text-muted-foreground">Unassisted Recall</p>
                  <p className={`text-2xl font-bold tabular-nums ${
                    retrieval.unassistedRate !== null
                      ? accuracyColor(retrieval.unassistedRate)
                      : "text-muted-foreground"
                  }`}>
                    {retrieval.unassistedRate !== null ? `${retrieval.unassistedRate}%` : "\u2014"}
                  </p>
                  {retrieval.unassistedRateDelta !== null && (
                    <p className="flex items-center gap-0.5 text-[10px]">
                      {retrieval.unassistedRateDelta > 0 ? (
                        <ArrowUpRight className="size-3 text-emerald-400" />
                      ) : retrieval.unassistedRateDelta < 0 ? (
                        <ArrowDownRight className="size-3 text-red-400" />
                      ) : (
                        <Minus className="size-3 text-muted-foreground" />
                      )}
                      <span className={
                        retrieval.unassistedRateDelta > 0
                          ? "text-emerald-400"
                          : retrieval.unassistedRateDelta < 0
                            ? "text-red-400"
                            : "text-muted-foreground"
                      }>
                        {retrieval.unassistedRateDelta > 0 ? "+" : ""}
                        {retrieval.unassistedRateDelta}pp vs last week
                      </span>
                    </p>
                  )}
                </div>

                {/* Retrieval Speed */}
                <div className="rounded-xl bg-muted/30 p-3 space-y-1">
                  <p className="text-[10px] font-medium text-muted-foreground">Retrieval Speed</p>
                  <p className="text-2xl font-bold tabular-nums text-muted-foreground">
                    {retrieval.medianLatencyMs !== null
                      ? `${(retrieval.medianLatencyMs / 1000).toFixed(1)}s`
                      : "\u2014"}
                  </p>
                  {retrieval.latencyDeltaMs !== null && (
                    <p className="flex items-center gap-0.5 text-[10px]">
                      {retrieval.latencyDeltaMs < -50 ? (
                        <ArrowDownRight className="size-3 text-emerald-400" />
                      ) : retrieval.latencyDeltaMs > 50 ? (
                        <ArrowUpRight className="size-3 text-red-400" />
                      ) : (
                        <Minus className="size-3 text-muted-foreground" />
                      )}
                      <span className={
                        retrieval.latencyDeltaMs < -50
                          ? "text-emerald-400"
                          : retrieval.latencyDeltaMs > 50
                            ? "text-red-400"
                            : "text-muted-foreground"
                      }>
                        {retrieval.latencyDeltaMs > 0 ? "+" : ""}
                        {(retrieval.latencyDeltaMs / 1000).toFixed(1)}s vs last week
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Supporting counts */}
              <div className="space-y-2">
                {[
                  {
                    icon: ShieldAlert,
                    label: "Cue-Dependent Words",
                    value: retrieval.cueDependentWordCount,
                    color: retrieval.cueDependentWordCount > 0 ? "text-amber-400" : "text-emerald-400",
                  },
                  {
                    icon: AlertTriangle,
                    label: "TOT This Week",
                    value: retrieval.totThisWeek,
                    color: retrieval.totThisWeek > 0 ? "text-amber-400" : "text-emerald-400",
                  },
                  {
                    icon: LifeBuoy,
                    label: "In Rescue Stage",
                    value: retrieval.rescueWordCount,
                    color: retrieval.rescueWordCount > 3
                      ? "text-red-400"
                      : retrieval.rescueWordCount > 0
                        ? "text-amber-400"
                        : "text-emerald-400",
                  },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Icon className="size-3.5" />
                      {label}
                    </span>
                    <span className={`text-xs font-bold tabular-nums ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Training History ────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0.42)}>
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="size-4 text-primary" />
              Training History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Difficulty row */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Current Pace</span>
              <div
                className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold ${diffDisplay.bg} ${diffDisplay.color}`}
              >
                <diffDisplay.icon className="size-3" />
                {diffDisplay.label}
                <span className="font-normal opacity-70">{diffConfig.description}</span>
              </div>
            </div>

            {/* Tier unlock progress */}
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Tier Unlocks</p>
              <div className="space-y-2">
                {(["1", "2", "3"] as const).map((tier) => {
                  const unlockLevel = TIER_UNLOCK_LEVELS[tier] ?? 1;
                  const isUnlocked = profile.level >= unlockLevel;
                  const info = TIER_INFO[tier];

                  return (
                    <div key={tier} className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center size-6 rounded-md text-[10px] font-bold ${
                          isUnlocked
                            ? `${info.bg} text-white`
                            : "bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        {isUnlocked ? tier : <Lock className="size-3" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-medium ${isUnlocked ? info.color : "text-muted-foreground"}`}
                          >
                            {info.label}
                          </span>
                          {!isUnlocked && (
                            <span className="text-[10px] text-muted-foreground/60">
                              Lv. {unlockLevel}
                            </span>
                          )}
                        </div>
                      </div>
                      {isUnlocked && (
                        <span className="text-[10px] text-muted-foreground/60 shrink-0">
                          Unlocked
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Words learned vs total */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline">
                <p className="text-xs text-muted-foreground">Words Collected</p>
                <span className="text-xs font-bold tabular-nums text-primary">
                  {wordCount}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "To Review", value: dueCount, color: dueCount > 0 ? "text-amber-400" : "text-emerald-400" },
                  { label: "Reviewed", value: profile.totalReviewed, color: "text-primary" },
                  { label: "Correct %", value: `${lifetimeAccuracy}%`, color: accuracyColor(lifetimeAccuracy) },
                ].map(({ label, value, color }) => (
                  <div key={label} className="text-center rounded-lg bg-muted/20 px-2 py-2">
                    <p className={`text-sm font-bold tabular-nums ${color}`}>{value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
