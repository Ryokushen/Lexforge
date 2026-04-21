"use client";

import type { RPGStats } from "@/lib/types";
import { IllumCard } from "@/components/rpg/illum-card";
import { StatRune } from "@/components/rpg/stat-rune";
import { Flame, Star, Sun, Vine } from "@/components/rpg/sigils";

interface StatDiamondProps {
  stats: RPGStats;
}

const STAT_CONFIG = [
  { key: "recall" as const, label: "Recall", desc: "Word retrieval", sigil: Flame, color: "var(--ajah-recall)" },
  { key: "retention" as const, label: "Retention", desc: "Long-term memory", sigil: Star, color: "var(--ajah-retention)" },
  { key: "perception" as const, label: "Perception", desc: "Processing speed", sigil: Sun, color: "var(--ajah-perception)" },
  { key: "creativity" as const, label: "Creativity", desc: "Visual association", sigil: Vine, color: "var(--ajah-creativity)" },
];

export function StatDiamond({ stats }: StatDiamondProps) {
  const max = Math.max(...Object.values(stats), 40);

  return (
    <IllumCard>
      <div className="flex items-center justify-between mb-3">
        <div className="uppercase-tracked text-[11px]" style={{ color: "var(--gold-deep)" }}>
          Disciplines
        </div>
        <span className="lex-badge">4 of 4 awakened</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {STAT_CONFIG.map((c, i) => (
          <StatRune
            key={c.key}
            name={c.label}
            desc={c.desc}
            value={stats[c.key]}
            max={max}
            sigil={c.sigil}
            color={c.color}
            delay={0.1 + i * 0.08}
          />
        ))}
      </div>
    </IllumCard>
  );
}
