"use client";

import { Progress } from "@/components/ui/progress";

interface SessionProgressProps {
  current: number;
  total: number;
}

export function SessionProgress({ current, total }: SessionProgressProps) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-1">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>
          Word {current + 1} of {total}
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );
}
