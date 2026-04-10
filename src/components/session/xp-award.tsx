"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { playXPTick } from "@/lib/sounds";
import { Trophy, Target, Percent, Timer, TrendingUp, Home } from "lucide-react";
import type { SessionSummary } from "@/lib/types";

interface XPAwardProps {
  summary: SessionSummary;
  onDone: () => void;
}

function AnimatedNumber({ target, duration = 1000 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const steps = Math.min(target, 20);
    const interval = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += Math.ceil(target / steps);
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setValue(current);
      playXPTick();
    }, interval);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <>{value}</>;
}

export function XPAward({ summary, onDone }: XPAwardProps) {
  const accuracy =
    summary.totalWords > 0
      ? Math.round((summary.totalCorrect / summary.totalWords) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card size="sm" className="w-full max-w-2xl mx-auto overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        <CardHeader className="text-center pb-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          >
            <Trophy className="size-10 text-accent mx-auto mb-2" />
          </motion.div>
          <CardTitle className="text-2xl">Session Complete</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {summary.leveledUp && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="text-center py-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-yellow-500/15 to-amber-500/10 border border-amber-500/20"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                LEVEL UP!
              </div>
              <p className="text-muted-foreground text-sm">
                You reached level {summary.newLevel}
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
            className="text-center py-1"
          >
            <div className="text-4xl font-bold text-primary">
              +<AnimatedNumber target={summary.xpEarned} /> XP
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-3"
          >
            <div className="text-center rounded-lg bg-muted/50 p-2.5">
              <Target className="size-4 text-primary mx-auto mb-1" />
              <div className="text-lg font-semibold tabular-nums">
                {summary.totalCorrect}/{summary.totalWords}
              </div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div className="text-center rounded-lg bg-muted/50 p-2.5">
              <Percent className="size-4 text-emerald-500 mx-auto mb-1" />
              <div className="text-lg font-semibold tabular-nums">{accuracy}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center rounded-lg bg-muted/50 p-2.5">
              <Timer className="size-4 text-amber-500 mx-auto mb-1" />
              <div className="text-lg font-semibold tabular-nums">
                {(summary.averageResponseTimeMs / 1000).toFixed(1)}s
              </div>
              <div className="text-xs text-muted-foreground">Avg Time</div>
            </div>
          </motion.div>

          {Object.entries(summary.statGains).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-3 rounded-xl bg-muted/30 p-3"
            >
              <p className="text-sm font-medium flex items-center gap-1.5">
                <TrendingUp className="size-4 text-primary" />
                Stat Gains
              </p>
              {Object.entries(summary.statGains).map(([stat, gain]) => (
                <div key={stat} className="flex items-center gap-3">
                  <span className="text-sm capitalize w-20 text-muted-foreground">{stat}</span>
                  <div className="flex-1">
                    <motion.div
                      className="h-1.5 bg-primary/60 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1, duration: 0.5 }}
                      style={{ originX: 0 }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-emerald-500 tabular-nums">
                    +{gain}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Button onClick={onDone} className="w-full gap-2" size="lg">
              <Home className="size-4" />
              Back to Dashboard
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
