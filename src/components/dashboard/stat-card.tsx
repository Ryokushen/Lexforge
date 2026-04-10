"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { RPGStats } from "@/lib/types";

interface StatCardProps {
  stats: RPGStats;
}

const STAT_CONFIG = [
  { key: "recall" as const, label: "Recall", color: "[&>div]:bg-blue-500" },
  { key: "retention" as const, label: "Retention", color: "[&>div]:bg-purple-500" },
  { key: "perception" as const, label: "Perception", color: "[&>div]:bg-amber-500" },
  { key: "creativity" as const, label: "Creativity", color: "[&>div]:bg-emerald-500" },
];

export function StatCard({ stats }: StatCardProps) {
  const maxStat = Math.max(...Object.values(stats), 10); // min scale of 10

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">RPG Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {STAT_CONFIG.map(({ key, label, color }) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{label}</span>
              <span className="font-mono">{stats[key]}</span>
            </div>
            <Progress
              value={(stats[key] / maxStat) * 100}
              className={`h-2 ${color}`}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
