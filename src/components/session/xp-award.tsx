"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { playXPTick } from "@/lib/sounds";
import type { SessionSummary } from "@/lib/types";
import { IllumCard } from "@/components/rpg/illum-card";
import { HeronDivider } from "@/components/rpg/heron-divider";
import { HeronWheel } from "@/components/rpg/sigils";

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
    summary.totalWords > 0 ? Math.round((summary.totalCorrect / summary.totalWords) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <IllumCard className="w-full max-w-2xl mx-auto p-8 text-center">
        <div
          className="flex justify-center mb-2"
          style={{ color: "var(--gold-deep)" }}
        >
          <HeronWheel size={48} />
        </div>
        <div className="uppercase-tracked text-[11px]" style={{ color: "var(--gold-deep)" }}>
          Trial Ended
        </div>
        <h2 className="font-display text-[34px] font-bold mt-1.5 mb-1">
          {summary.totalCorrect === summary.totalWords ? "The Foe Falls" : "The Field is Ours"}
        </h2>
        <p className="italic m-0" style={{ color: "var(--muted-foreground)" }}>
          &ldquo;Bound in ink, undone by memory.&rdquo;
        </p>

        {summary.leveledUp && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="mt-5 py-3 px-4 rounded-[var(--radius)]"
            style={{
              background: "linear-gradient(180deg, color-mix(in oklab, var(--gold), transparent 80%), color-mix(in oklab, var(--gold), transparent 95%))",
              border: "1px solid var(--gold)",
            }}
          >
            <div className="font-display text-2xl font-bold" style={{ color: "var(--gold-bright)", letterSpacing: ".18em" }}>
              ASCENDED
            </div>
            <p className="text-sm italic mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Risen to rank {summary.newLevel}
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
          className="my-5"
        >
          <div
            className="font-display text-[44px] font-bold tabular-nums"
            style={{ color: "var(--crimson)" }}
          >
            +<AnimatedNumber target={summary.xpEarned} /> XP
          </div>
        </motion.div>

        <HeronDivider />

        <div className="grid grid-cols-3 gap-3.5">
          {[
            ["Strikes True", `${summary.totalCorrect}/${summary.totalWords}`, "var(--sage)"],
            ["Accuracy", `${accuracy}%`, "var(--gold-deep)"],
            [
              "Avg Cadence",
              `${(summary.averageResponseTimeMs / 1000).toFixed(1)}s`,
              "var(--ember)",
            ],
          ].map(([label, value, color]) => (
            <div
              key={label}
              className="rounded-[3px] px-2.5 py-4"
              style={{
                background: "color-mix(in oklab, var(--paper), white 5%)",
                border: "1px solid var(--line-soft)",
              }}
            >
              <div className="uppercase-tracked text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                {label}
              </div>
              <div className="font-display text-[28px] font-bold tabular-nums mt-0.5" style={{ color }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {Object.entries(summary.statGains).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-5 p-3.5 rounded-[var(--radius)]"
            style={{
              background: "linear-gradient(180deg, color-mix(in oklab, var(--gold), transparent 85%), color-mix(in oklab, var(--gold), transparent 95%))",
              border: "1px solid var(--gold)",
              textAlign: "left",
            }}
          >
            <div className="font-display text-base font-bold" style={{ color: "var(--gold-deep)" }}>
              Flame Ascendant
            </div>
            <div className="text-xs italic" style={{ color: "var(--muted-foreground)" }}>
              {Object.entries(summary.statGains)
                .map(([stat, gain]) => `${stat} +${gain}`)
                .join(" · ")}
            </div>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          onClick={onDone}
          className="btn-illum w-full mt-5"
        >
          Return to the Hall
        </motion.button>
      </IllumCard>
    </motion.div>
  );
}
