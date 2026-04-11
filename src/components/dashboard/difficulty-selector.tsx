"use client";

import { motion } from "framer-motion";
import { Flame, Gauge, Zap } from "lucide-react";
import type { Difficulty } from "@/lib/types";

interface DifficultySelectorProps {
  current: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

const OPTIONS: { key: Difficulty; icon: typeof Gauge; label: string; desc: string; color: string; activeBg: string }[] = [
  { key: "easy", icon: Gauge, label: "Easy", desc: "5 new/day", color: "text-emerald-500", activeBg: "bg-emerald-500/15 ring-emerald-500/30" },
  { key: "normal", icon: Flame, label: "Normal", desc: "10 new/day", color: "text-amber-500", activeBg: "bg-amber-500/15 ring-amber-500/30" },
  { key: "hard", icon: Zap, label: "Hard", desc: "20 new/day", color: "text-red-500", activeBg: "bg-red-500/15 ring-red-500/30" },
];

export function DifficultySelector({ current, onChange }: DifficultySelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground shrink-0">Pace:</span>
      {OPTIONS.map(({ key, icon: Icon, label, desc, color, activeBg }) => {
        const isActive = current === key;
        return (
          <motion.button
            key={key}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(key)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-all ring-1 ${
              isActive
                ? `${activeBg} ${color} font-semibold`
                : "ring-border/30 text-muted-foreground hover:ring-border/50"
            }`}
          >
            <Icon className="size-3" />
            <span>{label}</span>
            {isActive && <span className="text-[10px] opacity-70">{desc}</span>}
          </motion.button>
        );
      })}
    </div>
  );
}
