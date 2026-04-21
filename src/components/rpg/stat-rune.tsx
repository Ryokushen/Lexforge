"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface StatRuneProps {
  name: string;
  desc: string;
  value: number;
  max: number;
  color: string;
  sigil: React.ComponentType<{ size?: number }>;
  delay?: number;
}

export function StatRune({ name, desc, value, max, color, sigil: Sigil, delay = 0 }: StatRuneProps) {
  const pct = Math.max(6, Math.min(100, max > 0 ? (value / max) * 100 : 0));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      className="relative overflow-hidden rounded-[var(--radius)] p-4"
      style={{
        background: "color-mix(in oklab, var(--paper), transparent 20%)",
        border: "1px solid var(--line)",
        boxShadow: "inset 0 1px 0 rgba(255,240,200,.25)",
      }}
    >
      {/* Watermark sigil */}
      <div
        className="absolute -right-3 -bottom-3 pointer-events-none"
        style={{ color, opacity: 0.08 }}
      >
        <Sigil size={110} />
      </div>

      {/* Left border accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] opacity-60"
        style={{ background: `linear-gradient(180deg, ${color}, transparent)` }}
      />

      <div className="relative flex items-center gap-3">
        <div
          className="flex items-center justify-center size-11 rounded-[3px]"
          style={{
            color,
            border: `1px solid ${color}`,
            background: `color-mix(in oklab, ${color}, transparent 88%)`,
          }}
        >
          <Sigil size={30} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="uppercase-tracked text-[10.5px] text-muted-foreground">{name}</div>
          <div className="font-display text-[28px] font-bold leading-none mt-0.5 tabular-nums">
            {value}
          </div>
        </div>
      </div>

      <div className="relative mt-3">
        <div className="plate" style={{ height: 6 }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut", delay: delay + 0.15 }}
            style={{ height: "100%", background: color, opacity: 0.85 }}
          />
        </div>
        <p
          className="mt-2 text-[11.5px] italic text-muted-foreground"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {desc}
        </p>
      </div>
    </motion.div>
  );
}
