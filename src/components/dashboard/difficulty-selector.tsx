"use client";

import { motion } from "framer-motion";
import type { Difficulty } from "@/lib/types";
import { RuneEasy, RuneNormal, RuneHard } from "@/components/rpg/sigils";

interface DifficultySelectorProps {
  current: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

const OPTIONS: {
  key: Difficulty;
  label: string;
  desc: string;
  sigil: React.ComponentType<{ size?: number }>;
  color: string;
}[] = [
  { key: "easy", label: "Easy", desc: "5 new/day", sigil: RuneEasy, color: "var(--sage)" },
  { key: "normal", label: "Normal", desc: "10 new/day", sigil: RuneNormal, color: "var(--gold-deep)" },
  { key: "hard", label: "Hard", desc: "20 new/day", sigil: RuneHard, color: "var(--crimson)" },
];

export function DifficultySelector({ current, onChange }: DifficultySelectorProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap px-0.5">
      <span className="uppercase-tracked text-[10px]" style={{ color: "var(--muted-foreground)" }}>
        Pace
      </span>
      {OPTIONS.map(({ key, label, desc, sigil: Sigil, color }) => {
        const active = current === key;
        return (
          <motion.button
            key={key}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(key)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[3px] font-display text-[11px] uppercase transition-colors"
            style={{
              letterSpacing: ".16em",
              background: active ? `color-mix(in oklab, ${color}, transparent 88%)` : "transparent",
              color: active ? color : "var(--muted-foreground)",
              border: `1px solid ${active ? color : "var(--line-soft)"}`,
              fontWeight: active ? 600 : 500,
            }}
          >
            <Sigil size={14} />
            {label}
            {active && (
              <span className="text-[10px] normal-case opacity-75" style={{ letterSpacing: ".06em" }}>
                · {desc}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
