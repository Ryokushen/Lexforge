"use client";

import { motion } from "framer-motion";
import { Flame, Target } from "lucide-react";
import type { SessionResult, GameMode } from "@/lib/types";

interface SessionProgressProps {
  current: number;
  total: number;
  results: SessionResult[];
  currentMode: GameMode;
}

export function SessionProgress({ current, total, results, currentMode }: SessionProgressProps) {
  const pct = total > 0 ? (current / total) * 100 : 0;
  const correctCount = results.filter(r => r.correct).length;
  const attemptedCount = results.length;

  // Count consecutive correct from end of results
  let streak = 0;
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i].correct) streak++;
    else break;
  }

  const barGradient = currentMode === "recall"
    ? "from-primary to-primary/70"
    : currentMode === "speed"
      ? "from-amber-500 to-amber-400"
      : "from-emerald-500 to-emerald-400";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Word <span className="font-semibold text-foreground tabular-nums">{current + 1}</span> of{" "}
          <span className="tabular-nums">{total}</span>
        </span>

        <div className="flex items-center gap-2">
          {/* Score pill */}
          {attemptedCount > 0 && (
            <div className="flex items-center gap-1 text-xs font-mono tabular-nums text-muted-foreground bg-muted/50 rounded-md px-1.5 py-0.5">
              <Target className="size-3" />
              {correctCount}/{attemptedCount}
            </div>
          )}

          {/* Streak flame */}
          {streak >= 2 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="flex items-center gap-0.5 text-xs font-mono tabular-nums text-amber-500 bg-amber-500/10 rounded-md px-1.5 py-0.5"
            >
              <Flame className="size-3" />
              {streak}
            </motion.div>
          )}
        </div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${barGradient} rounded-full`}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
