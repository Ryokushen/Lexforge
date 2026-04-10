"use client";

import { motion } from "framer-motion";
import { Crown, Flame, Heart, Shield, Sparkles, Star } from "lucide-react";
import type { UserProfile } from "@/lib/types";

interface CharacterBannerProps {
  profile: UserProfile;
}

// ── Tier system — visual theme evolves with level ──────────────────────

interface BannerTier {
  title: string;
  icon: typeof Shield;
  border: string;
  ring: string;
  shadow: string;
  gradient: string;
  radialFrom: string;
  radialTo: string;
  titleGradient: string;
  xpBarColor: string;
  ringStroke: string;
  ringTrack: string;
}

function getTier(level: number): BannerTier {
  if (level <= 2) return {
    title: "Novice Scribe",
    icon: Shield,
    border: "border-muted-foreground/20",
    ring: "ring-muted-foreground/10",
    shadow: "shadow-md shadow-muted/10",
    gradient: "from-muted/15 via-background to-muted/10",
    radialFrom: "from-muted-foreground/5",
    radialTo: "from-muted-foreground/3",
    titleGradient: "from-muted-foreground to-muted-foreground/70",
    xpBarColor: "from-muted-foreground/60 to-muted-foreground/40",
    ringStroke: "text-muted-foreground/60",
    ringTrack: "text-muted/30",
  };
  if (level <= 5) return {
    title: "Word Apprentice",
    icon: Shield,
    border: "border-primary/25",
    ring: "ring-primary/10",
    shadow: "shadow-md shadow-primary/10",
    gradient: "from-primary/12 via-background to-primary/5",
    radialFrom: "from-primary/8",
    radialTo: "from-primary/5",
    titleGradient: "from-primary to-primary/70",
    xpBarColor: "from-primary to-primary/70",
    ringStroke: "text-primary",
    ringTrack: "text-muted/40",
  };
  if (level <= 8) return {
    title: "Lexicon Adept",
    icon: Shield,
    border: "border-primary/30",
    ring: "ring-primary/15",
    shadow: "shadow-lg shadow-primary/15",
    gradient: "from-primary/18 via-background to-accent/8",
    radialFrom: "from-primary/12",
    radialTo: "from-accent/8",
    titleGradient: "from-primary to-accent/80",
    xpBarColor: "from-primary to-accent/60",
    ringStroke: "text-primary",
    ringTrack: "text-primary/15",
  };
  if (level <= 12) return {
    title: "Recall Knight",
    icon: Star,
    border: "border-primary/35",
    ring: "ring-primary/20",
    shadow: "shadow-lg shadow-primary/20",
    gradient: "from-primary/20 via-background to-accent/12",
    radialFrom: "from-primary/15",
    radialTo: "from-accent/12",
    titleGradient: "from-primary via-accent to-primary",
    xpBarColor: "from-primary via-accent/50 to-primary/70",
    ringStroke: "text-accent",
    ringTrack: "text-primary/20",
  };
  if (level <= 16) return {
    title: "Memory Sage",
    icon: Sparkles,
    border: "border-accent/40",
    ring: "ring-accent/20",
    shadow: "shadow-xl shadow-accent/20",
    gradient: "from-accent/15 via-primary/10 to-accent/8",
    radialFrom: "from-accent/15",
    radialTo: "from-primary/10",
    titleGradient: "from-accent via-primary to-accent",
    xpBarColor: "from-accent to-primary",
    ringStroke: "text-accent",
    ringTrack: "text-accent/15",
  };
  if (level <= 20) return {
    title: "Arcane Scholar",
    icon: Sparkles,
    border: "border-amber-500/40",
    ring: "ring-amber-500/20",
    shadow: "shadow-xl shadow-amber-500/20",
    gradient: "from-amber-500/12 via-primary/10 to-amber-500/8",
    radialFrom: "from-amber-500/15",
    radialTo: "from-primary/12",
    titleGradient: "from-amber-400 via-amber-300 to-amber-500",
    xpBarColor: "from-amber-500 to-amber-400",
    ringStroke: "text-amber-400",
    ringTrack: "text-amber-500/15",
  };
  return {
    title: "Grand Loremaster",
    icon: Crown,
    border: "border-amber-400/50",
    ring: "ring-amber-400/25",
    shadow: "shadow-2xl shadow-amber-500/30",
    gradient: "from-amber-500/15 via-primary/12 to-amber-400/10",
    radialFrom: "from-amber-400/20",
    radialTo: "from-amber-500/15",
    titleGradient: "from-amber-300 via-amber-200 to-amber-400",
    xpBarColor: "from-amber-400 via-amber-300 to-amber-500",
    ringStroke: "text-amber-300",
    ringTrack: "text-amber-400/20",
  };
}

// ── XP Ring ────────────────────────────────────────────────────────────

function XPRing({ level, xp, xpToNextLevel, tier }: {
  level: number; xp: number; xpToNextLevel: number; tier: BannerTier;
}) {
  const size = 80;
  const strokeWidth = level > 12 ? 6 : 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = xpToNextLevel > 0 ? xp / xpToNextLevel : 0;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className={tier.ringTrack}
          strokeWidth={strokeWidth}
        />
        {/* XP progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className={tier.ringStroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      {/* Level number centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <tier.icon className={`size-4 ${tier.ringStroke} mb-0.5`} />
        <span className="text-xl font-bold tabular-nums leading-none">{level}</span>
      </div>
    </div>
  );
}

// ── Banner ──────────────────────────────────────────────────────────────

export function CharacterBanner({ profile }: CharacterBannerProps) {
  const hpPct = (profile.hp / profile.maxHp) * 100;
  const xpPct = profile.xpToNextLevel > 0 ? (profile.xp / profile.xpToNextLevel) * 100 : 0;
  const tier = getTier(profile.level);
  const isLowHp = hpPct < 30;
  const isMidHp = hpPct < 60;

  const streakGlow =
    profile.currentStreak >= 14
      ? "drop-shadow-[0_0_12px_rgba(245,158,11,0.7)]"
      : profile.currentStreak >= 7
        ? "drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
        : "";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl border ${tier.border} bg-gradient-to-br ${tier.gradient} px-4 py-4 ${tier.shadow} ring-1 ${tier.ring}`}
    >
      {/* Decorative radials — intensity scales with tier */}
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] ${tier.radialFrom} via-transparent to-transparent pointer-events-none`} />
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] ${tier.radialTo} via-transparent to-transparent pointer-events-none`} />

      {/* Corner sparkles for high tiers */}
      {profile.level > 16 && (
        <Sparkles className="absolute top-3 right-3 size-4 text-amber-400/30 animate-pulse" />
      )}
      {profile.level > 20 && (
        <Sparkles className="absolute bottom-3 left-3 size-3 text-amber-400/20 animate-pulse" />
      )}

      <div className="relative flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-4">
        {/* Level Emblem */}
        <XPRing level={profile.level} xp={profile.xp} xpToNextLevel={profile.xpToNextLevel} tier={tier} />

        {/* Title & XP */}
        <div className="flex-1 text-center md:text-left space-y-1">
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`text-xl font-bold bg-gradient-to-r ${tier.titleGradient} bg-clip-text text-transparent`}
          >
            {tier.title}
          </motion.h2>
          {/* XP Bar */}
          <div className="space-y-1 max-w-md">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>XP to Level {profile.level + 1}</span>
              <span className="tabular-nums">{profile.xp} / {profile.xpToNextLevel}</span>
            </div>
            <div className="h-2.5 bg-muted/30 rounded-full overflow-hidden ring-1 ring-muted/20">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${tier.xpBarColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(xpPct, 2)}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              />
            </div>
          </div>
        </div>

        {/* HP + Streak vitals */}
        <div className="flex items-center gap-6 md:gap-5">
          {/* HP */}
          <div className={`flex items-center gap-2 ${isLowHp ? "animate-pulse" : ""}`}>
            <Heart
              className={`size-5 ${
                isLowHp ? "text-red-500" : isMidHp ? "text-amber-500" : "text-emerald-500"
              }`}
              fill="currentColor"
            />
            <div className="space-y-0.5">
              <span className="text-sm font-semibold tabular-nums">
                {profile.hp}/{profile.maxHp}
              </span>
              <div className="h-1.5 w-16 bg-muted/50 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    isLowHp ? "bg-red-500" : isMidHp ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${hpPct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5">
            <Flame
              className={`size-5 ${
                profile.currentStreak > 0
                  ? `text-amber-500 ${streakGlow}`
                  : "text-muted-foreground"
              }`}
            />
            <div className="text-center">
              <span className="text-sm font-semibold tabular-nums">
                {profile.currentStreak}
              </span>
              <span className="text-xs text-muted-foreground ml-0.5">d</span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
