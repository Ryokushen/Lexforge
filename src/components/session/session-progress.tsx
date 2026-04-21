"use client";

import { motion } from "framer-motion";
import type { SessionResult, GameMode } from "@/lib/types";
import { FlameSm } from "@/components/rpg/sigils";

interface SessionProgressProps {
  current: number;
  total: number;
  results: SessionResult[];
  currentMode: GameMode;
}

export function SessionProgress({ current, total, results, currentMode }: SessionProgressProps) {
  const correctCount = results.filter((r) => r.correct).length;

  let streak = 0;
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i].correct) streak++;
    else break;
  }

  const modeLabel =
    currentMode === "recall"
      ? "Recall"
      : currentMode === "speed"
        ? "Rapid"
        : currentMode === "association"
          ? "Associate"
          : "Context";

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-1.5">
        <span className="uppercase-tracked text-[10px]" style={{ color: "var(--muted-foreground)" }}>
          {modeLabel} · Strike {current + 1} of {total}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono-num text-[11px]" style={{ color: "var(--muted-foreground)" }}>
            {correctCount} true / {results.length} answered
          </span>
          {streak >= 2 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="flex items-center gap-1 text-[11px] font-mono-num rounded-sm px-1.5 py-0.5 tabular-nums"
              style={{
                background: "color-mix(in oklab, var(--ember), transparent 85%)",
                color: "var(--ember)",
                border: "1px solid color-mix(in oklab, var(--ember), transparent 60%)",
              }}
            >
              <FlameSm size={12} />
              {streak}
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex gap-[3px]">
        {Array.from({ length: total }).map((_, i) => {
          const r = results[i];
          let bg = "color-mix(in oklab, var(--paper), black 8%)";
          let border = "var(--line)";
          if (r) {
            if (r.correct) {
              bg = "var(--sage)";
              border = "color-mix(in oklab, var(--sage), black 20%)";
            } else {
              bg = "var(--crimson)";
              border = "color-mix(in oklab, var(--crimson), black 20%)";
            }
          } else if (i === current) {
            bg = "var(--gold)";
            border = "var(--gold-deep)";
          }
          return (
            <div
              key={i}
              className="flex-1 transition-colors"
              style={{
                height: 6,
                background: bg,
                border: `1px solid ${border}`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
