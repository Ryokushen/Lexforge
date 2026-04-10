"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Eye, Lightbulb, Target } from "lucide-react";
import type { RPGStats } from "@/lib/types";

interface StatCardProps {
  stats: RPGStats;
}

const STAT_CONFIG = [
  { key: "recall" as const, label: "Recall", icon: Target, color: "text-blue-400", bg: "bg-blue-500", bgLight: "bg-blue-500/10" },
  { key: "retention" as const, label: "Retention", icon: Brain, color: "text-purple-400", bg: "bg-purple-500", bgLight: "bg-purple-500/10" },
  { key: "perception" as const, label: "Perception", icon: Eye, color: "text-amber-400", bg: "bg-amber-500", bgLight: "bg-amber-500/10" },
  { key: "creativity" as const, label: "Creativity", icon: Lightbulb, color: "text-emerald-400", bg: "bg-emerald-500", bgLight: "bg-emerald-500/10" },
];

export function StatCard({ stats }: StatCardProps) {
  const maxStat = Math.max(...Object.values(stats), 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <span className="text-lg">&#x2694;&#xFE0F;</span>
          RPG Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {STAT_CONFIG.map(({ key, label, icon: Icon, color, bg, bgLight }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="flex items-center gap-3"
          >
            <div className={`inline-flex items-center justify-center size-7 rounded-md ${bgLight} ${color}`}>
              <Icon className="size-3.5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{label}</span>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {stats[key]}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${bg}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats[key] / maxStat) * 100}%` }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 + i * 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
