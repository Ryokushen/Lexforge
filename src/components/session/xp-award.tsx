"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SessionSummary } from "@/lib/types";

interface XPAwardProps {
  summary: SessionSummary;
  onDone: () => void;
}

export function XPAward({ summary, onDone }: XPAwardProps) {
  const accuracy =
    summary.totalWords > 0
      ? Math.round((summary.totalCorrect / summary.totalWords) * 100)
      : 0;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Session Complete</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {summary.leveledUp && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-center py-4"
          >
            <div className="text-4xl font-bold text-yellow-500">
              LEVEL UP!
            </div>
            <p className="text-muted-foreground">
              You reached level {summary.newLevel}
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="text-5xl font-bold text-primary">
            +{summary.xpEarned} XP
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-semibold">
              {summary.totalCorrect}/{summary.totalWords}
            </div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </div>
          <div>
            <div className="text-2xl font-semibold">{accuracy}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
          <div>
            <div className="text-2xl font-semibold">
              {(summary.averageResponseTimeMs / 1000).toFixed(1)}s
            </div>
            <div className="text-sm text-muted-foreground">Avg Time</div>
          </div>
        </div>

        {Object.entries(summary.statGains).length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Stat Gains</p>
            {Object.entries(summary.statGains).map(([stat, gain]) => (
              <div key={stat} className="flex items-center gap-2">
                <span className="text-sm capitalize w-20">{stat}</span>
                <Progress value={100} className="h-2 flex-1" />
                <span className="text-sm font-medium text-green-500">
                  +{gain}
                </span>
              </div>
            ))}
          </div>
        )}

        <Button onClick={onDone} className="w-full" size="lg">
          Back to Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}
