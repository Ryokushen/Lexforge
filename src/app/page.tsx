"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Swords, BookOpen, BarChart3, Flame, Sparkles } from "lucide-react";
import { useStats } from "@/hooks/use-stats";
import { DailySummary } from "@/components/dashboard/daily-summary";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";

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
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* ── Hero Section ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-accent/10 border border-primary/10 px-6 py-10 text-center"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold tracking-tight"
          >
            Memory & Vocabulary
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-md mx-auto"
          >
            Train your recall. Build your character. Master language one word at a time.
          </motion.p>
        </div>
      </motion.section>

      {/* ── Daily Summary Cards ── */}
      <DailySummary
        profile={profile}
        dueCount={dueCount}
        wordCount={wordCount}
      />

      {/* ── Start Training CTA ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
        className="flex justify-center"
      >
        <Link href="/session">
          <Button
            size="lg"
            className="relative text-base px-8 py-6 gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
          >
            <Swords className="size-5" />
            {dueCount > 0
              ? `Start Training (${dueCount} due)`
              : "Start Training"}
            {dueCount > 0 && (
              <Sparkles className="size-4 text-accent animate-pulse" />
            )}
          </Button>
        </Link>
      </motion.div>

      {/* ── Stats & Quick Links Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard stats={profile.stats} />

        <div className="space-y-4">
          <Link href="/words" className="block">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-card/80"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">Word Library</p>
                <p className="text-xs text-muted-foreground">{wordCount} words collected</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/stats" className="block">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-card/80"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <BarChart3 className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">Detailed Stats</p>
                <p className="text-xs text-muted-foreground">Track your growth</p>
              </div>
            </motion.div>
          </Link>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-border/40 bg-card/50 p-4 space-y-2"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Flame className="size-4 text-amber-500" />
              <span>Journey Progress</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-2xl font-bold tabular-nums">{profile.totalSessions}</span>
                <p className="text-xs text-muted-foreground">Sessions</p>
              </div>
              <div>
                <span className="text-2xl font-bold tabular-nums">{profile.longestStreak}</span>
                <p className="text-xs text-muted-foreground">Best streak (days)</p>
              </div>
              <div className="col-span-2">
                <span className="text-lg font-semibold tabular-nums">
                  {profile.totalCorrect}
                  <span className="text-muted-foreground font-normal">/{profile.totalReviewed}</span>
                </span>
                <p className="text-xs text-muted-foreground">Lifetime correct answers</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
