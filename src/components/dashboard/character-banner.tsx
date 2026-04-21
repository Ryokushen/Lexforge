"use client";

import { motion } from "framer-motion";
import type { UserProfile } from "@/lib/types";
import { IllumCard } from "@/components/rpg/illum-card";
import { Plate } from "@/components/rpg/plate";
import { HeronWheel, FlameSm } from "@/components/rpg/sigils";

interface CharacterBannerProps {
  profile: UserProfile;
}

function tierTitle(level: number): string {
  if (level <= 2) return "Novice Scribe";
  if (level <= 5) return "Word Apprentice";
  if (level <= 8) return "Lexicon Adept";
  if (level <= 12) return "Recall Knight";
  if (level <= 16) return "Memory Sage";
  if (level <= 20) return "Arcane Scholar";
  return "Grand Loremaster";
}

function XPRing({
  level,
  xp,
  xpToNextLevel,
}: {
  level: number;
  xp: number;
  xpToNextLevel: number;
}) {
  const size = 108;
  const r = 48;
  const circumference = 2 * Math.PI * r;
  const progress = xpToNextLevel > 0 ? xp / xpToNextLevel : 0;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth="2" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--gold)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={42}
          fill="none"
          stroke="var(--line-soft)"
          strokeDasharray="2 4"
          opacity=".6"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div style={{ color: "var(--gold-deep)" }} className="mb-1">
          <HeronWheel size={24} />
        </div>
        <div className="font-display text-[36px] font-extrabold leading-none tabular-nums">{level}</div>
        <div className="uppercase-tracked text-[9px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          Rank
        </div>
      </div>
    </div>
  );
}

export function CharacterBanner({ profile }: CharacterBannerProps) {
  const title = tierTitle(profile.level);

  return (
    <IllumCard className="p-[26px]">
      <div className="grid gap-6 items-center grid-cols-1 md:grid-cols-[auto_1fr_auto]">
        {/* Left: level emblem */}
        <div className="flex justify-center md:justify-start">
          <XPRing level={profile.level} xp={profile.xp} xpToNextLevel={profile.xpToNextLevel} />
        </div>

        {/* Center: title + XP */}
        <div className="text-center md:text-left">
          <div
            className="uppercase-tracked text-[10.5px] mb-0.5"
            style={{ color: "var(--muted-foreground)" }}
          >
            Al&apos;Thoren of the Two Rivers
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="font-display text-[32px] font-bold leading-[1.05]"
            style={{ color: "var(--ink)" }}
          >
            {title}
          </motion.h2>
          <div
            className="italic text-sm mt-1"
            style={{ color: "var(--muted-foreground)" }}
          >
            &ldquo;The wheel weaves as the wheel wills.&rdquo;
          </div>
          <div className="mt-3 md:max-w-[420px] mx-auto md:mx-0">
            <Plate
              value={profile.xp}
              max={profile.xpToNextLevel}
              tone="gold"
              label={`To rank ${profile.level + 1}`}
              sublabel={`${profile.xp} / ${profile.xpToNextLevel} xp`}
            />
          </div>
        </div>

        {/* Right: HP + streak vitals */}
        <div className="flex flex-col gap-3 min-w-[170px] mx-auto md:mx-0">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="uppercase-tracked text-[10px]" style={{ color: "var(--crimson)" }}>
                Vitality
              </span>
              <span className="font-mono-num text-[12px] tabular-nums">
                {profile.hp}/{profile.maxHp}
              </span>
            </div>
            <Plate value={profile.hp} max={profile.maxHp} tone="crimson" height={8} />
          </div>
          <div
            className="flex items-center gap-2.5 rounded-[var(--radius)] px-3 py-2"
            style={{
              background: "color-mix(in oklab, var(--ember), transparent 88%)",
              border: "1px solid color-mix(in oklab, var(--ember), transparent 60%)",
            }}
          >
            <span style={{ color: "var(--ember)" }}>
              <FlameSm size={20} />
            </span>
            <div>
              <div className="font-display text-[20px] font-bold leading-none tabular-nums">
                {profile.currentStreak}d
              </div>
              <div className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                streak · best {profile.longestStreak}d
              </div>
            </div>
          </div>
        </div>
      </div>
    </IllumCard>
  );
}
