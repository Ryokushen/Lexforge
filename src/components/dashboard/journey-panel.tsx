"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { UserProfile } from "@/lib/types";
import { IllumCard } from "@/components/rpg/illum-card";
import { Compass, FlameSm, Shield, Star, Tome, Scroll, ChevronRight } from "@/components/rpg/sigils";

interface JourneyPanelProps {
  profile: UserProfile;
  wordCount: number;
}

export function JourneyPanel({ profile, wordCount }: JourneyPanelProps) {
  const accuracy =
    profile.totalReviewed > 0 ? Math.round((profile.totalCorrect / profile.totalReviewed) * 100) : 0;

  const items = [
    { label: "Sessions", value: profile.totalSessions.toString(), Icon: Compass },
    { label: "Best streak", value: `${profile.longestStreak}d`, Icon: FlameSm },
    {
      label: "Correct",
      value: `${profile.totalCorrect}/${profile.totalReviewed}`,
      Icon: Shield,
    },
    { label: "Accuracy", value: `${accuracy}%`, Icon: Star },
  ];

  return (
    <IllumCard>
      <div className="uppercase-tracked text-[11px] mb-3" style={{ color: "var(--gold-deep)" }}>
        Chronicle
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map(({ label, value, Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.06 }}
            className="flex items-center gap-2.5"
          >
            <span style={{ color: "var(--gold-deep)" }}>
              <Icon size={18} />
            </span>
            <div>
              <div className="font-display text-[20px] font-bold leading-none tabular-nums">{value}</div>
              <div className="text-[11.5px] italic" style={{ color: "var(--muted-foreground)" }}>
                {label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div
        className="my-4 h-px"
        style={{ background: "linear-gradient(90deg, transparent, var(--line), transparent)" }}
      />

      <div className="flex flex-col gap-2">
        <Link href="/words" className="journey-link">
          <span style={{ color: "var(--gold-deep)" }} aria-hidden>
            <Tome size={18} />
          </span>
          <span className="flex-1 text-left">
            <div className="font-display text-sm font-semibold">The Lexicon</div>
            <div className="text-xs italic" style={{ color: "var(--muted-foreground)" }}>
              {wordCount} words gathered
            </div>
          </span>
          <ChevronRight />
        </Link>
        <Link href="/stats" className="journey-link">
          <span style={{ color: "var(--gold-deep)" }} aria-hidden>
            <Scroll size={18} />
          </span>
          <span className="flex-1 text-left">
            <div className="font-display text-sm font-semibold">The Chronicle</div>
            <div className="text-xs italic" style={{ color: "var(--muted-foreground)" }}>
              Deeds, failings, omens
            </div>
          </span>
          <ChevronRight />
        </Link>
      </div>
    </IllumCard>
  );
}
