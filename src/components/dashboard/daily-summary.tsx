"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Flame, TrendingUp } from "lucide-react";
import type { UserProfile } from "@/lib/types";

interface DailySummaryProps {
  profile: UserProfile;
  dueCount: number;
  wordCount: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
};

export function DailySummary({
  profile,
  dueCount,
  wordCount,
}: DailySummaryProps) {
  const hpPct = (profile.hp / profile.maxHp) * 100;
  const xpPct = (profile.xp / profile.xpToNextLevel) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Words Due */}
      <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none" />
          <CardContent className="pt-6 text-center relative">
            <div className="inline-flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary mb-3">
              <Clock className="size-5" />
            </div>
            <div className="text-4xl font-bold tabular-nums">{dueCount}</div>
            <p className="text-sm text-muted-foreground mt-1">Words due</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {wordCount} total in library
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Streak & HP */}
      <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />
          <CardContent className="pt-6 space-y-3 relative">
            <div className="flex justify-between items-center">
              <div className="inline-flex items-center gap-2">
                <div className="inline-flex items-center justify-center size-8 rounded-full bg-amber-500/10 text-amber-500">
                  <Flame className="size-4" />
                </div>
                <span className="text-sm font-medium">Streak</span>
              </div>
              <span className="text-2xl font-bold tabular-nums">
                {profile.currentStreak}
                <span className="text-sm font-normal text-muted-foreground ml-0.5">
                  d
                </span>
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>HP</span>
                <span className="tabular-nums">
                  {profile.hp}/{profile.maxHp}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    hpPct < 30
                      ? "bg-red-500"
                      : hpPct < 60
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${hpPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Level & XP */}
      <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none" />
          <CardContent className="pt-6 space-y-3 relative">
            <div className="flex justify-between items-center">
              <div className="inline-flex items-center gap-2">
                <div className="inline-flex items-center justify-center size-8 rounded-full bg-emerald-500/10 text-emerald-500">
                  <TrendingUp className="size-4" />
                </div>
                <span className="text-sm font-medium">Level</span>
              </div>
              <span className="text-2xl font-bold tabular-nums">{profile.level}</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>XP</span>
                <span className="tabular-nums">
                  {profile.xp}/{profile.xpToNextLevel}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
