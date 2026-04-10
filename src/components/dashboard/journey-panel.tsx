"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, BarChart3, Flame, Trophy, Target, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserProfile } from "@/lib/types";

interface JourneyPanelProps {
  profile: UserProfile;
  wordCount: number;
}

export function JourneyPanel({ profile, wordCount }: JourneyPanelProps) {
  const accuracy =
    profile.totalReviewed > 0
      ? Math.round((profile.totalCorrect / profile.totalReviewed) * 100)
      : 0;

  const journeyStats = [
    { icon: Zap, label: "Sessions", value: profile.totalSessions, color: "text-primary" },
    { icon: Flame, label: "Best Streak", value: `${profile.longestStreak}d`, color: "text-amber-500" },
    { icon: Target, label: "Correct", value: `${profile.totalCorrect}/${profile.totalReviewed}`, color: "text-blue-400" },
    { icon: Trophy, label: "Accuracy", value: `${accuracy}%`, color: "text-emerald-400" },
  ];

  return (
    <div className="space-y-3">
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Flame className="size-4 text-amber-500" />
            Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {journeyStats.map(({ icon: Icon, label, value, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="flex items-center gap-2"
              >
                <Icon className={`size-3.5 ${color}`} />
                <div>
                  <p className="text-base font-bold tabular-nums leading-tight">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation links */}
      <Link href="/words" className="block">
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3 py-2.5 transition-colors hover:border-primary/30 hover:bg-card/80"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="size-4" />
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
          className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3 py-2.5 transition-colors hover:border-primary/30 hover:bg-card/80"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <BarChart3 className="size-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">Detailed Stats</p>
            <p className="text-xs text-muted-foreground">Track your growth</p>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}
