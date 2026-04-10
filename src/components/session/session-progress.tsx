"use client";

import { motion } from "framer-motion";

interface SessionProgressProps {
  current: number;
  total: number;
}

export function SessionProgress({ current, total }: SessionProgressProps) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          Word <span className="font-semibold text-foreground tabular-nums">{current + 1}</span> of{" "}
          <span className="tabular-nums">{total}</span>
        </span>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
