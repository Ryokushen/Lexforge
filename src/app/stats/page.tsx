"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/db";
import { useBootstrap } from "@/lib/bootstrap-context";
import { useStats } from "@/hooks/use-stats";
import {
  Lock,
  HeartPulse,
  ShieldAlert,
  AlertTriangle,
  LifeBuoy,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { useRetrievalHealth } from "@/hooks/use-retrieval-health";
import type { ReviewLog } from "@/lib/types";
import { DIFFICULTY_CONFIG, TIER_UNLOCK_LEVELS } from "@/lib/types";
import { getRecentRetrievalMetrics } from "./page.helpers";
import { IllumCard } from "@/components/rpg/illum-card";
import { HeronDivider } from "@/components/rpg/heron-divider";
import {
  Compass,
  FlameSm,
  Shield,
  Tome,
  Flame,
  Star,
  Sun,
  Vine,
  RuneEasy,
  RuneNormal,
  RuneHard,
} from "@/components/rpg/sigils";

// ── Animation helpers ────────────────────────────────────────────────────

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
});

// ── Tier + stat configs ──────────────────────────────────────────────────

const STAT_CONFIG = [
  { key: "recall" as const, label: "Recall", sigil: Flame, color: "var(--ajah-recall)", note: "Word retrieval" },
  { key: "retention" as const, label: "Retention", sigil: Star, color: "var(--ajah-retention)", note: "Long-term memory" },
  { key: "perception" as const, label: "Perception", sigil: Sun, color: "var(--ajah-perception)", note: "Processing speed" },
  { key: "creativity" as const, label: "Creativity", sigil: Vine, color: "var(--ajah-creativity)", note: "Visual association" },
];

const DIFFICULTY_DISPLAY = {
  easy: { label: "Easy", color: "var(--sage)", sigil: RuneEasy },
  normal: { label: "Normal", color: "var(--gold-deep)", sigil: RuneNormal },
  hard: { label: "Hard", color: "var(--crimson)", sigil: RuneHard },
};

const TIER_INFO: Record<string, { label: string; numeral: string; color: string }> = {
  "1": { label: "Core Articulation", numeral: "I", color: "var(--sage)" },
  "2": { label: "Precision Vocabulary", numeral: "II", color: "var(--lapis)" },
  "3": { label: "Power Words", numeral: "III", color: "var(--crimson)" },
};

// ── Utilities ────────────────────────────────────────────────────────────

function accuracyColor(pct: number): string {
  if (pct > 70) return "var(--sage)";
  if (pct >= 40) return "var(--ember)";
  return "var(--crimson)";
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function StatsPage() {
  const { seedStatus } = useBootstrap();
  const { profile, dueCount, wordCount, loading } = useStats();
  const retrieval = useRetrievalHealth();
  const [recentLogs, setRecentLogs] = useState<ReviewLog[]>([]);
  const [trend, setTrend] = useState<number[]>(() => Array(14).fill(0));

  useEffect(() => {
    db.reviewLogs
      .orderBy("reviewedAt")
      .reverse()
      .limit(50)
      .toArray()
      .then(setRecentLogs);
  }, [seedStatus]);

  useEffect(() => {
    async function loadTrend() {
      const logs = await db.reviewLogs.orderBy("reviewedAt").reverse().toArray();
      const now = new Date();
      const counts = Array(14).fill(0) as number[];
      for (const log of logs) {
        const d = new Date(log.reviewedAt);
        const diffDays = Math.floor(
          (now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000),
        );
        if (diffDays >= 0 && diffDays < 14) {
          // bucket index: 0 = oldest (14 days ago), 13 = today
          const idx = 13 - diffDays;
          counts[idx] += 1;
        }
      }
      setTrend(counts);
    }
    void loadTrend();
  }, [seedStatus, recentLogs.length]);

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="uppercase-tracked text-xs" style={{ color: "var(--muted-foreground)" }}>
          Loading…
        </p>
      </div>
    );
  }

  // ── Derived values ─────────────────────────────────────────────────────

  const lifetimeAccuracy =
    profile.totalReviewed > 0
      ? Math.round((profile.totalCorrect / profile.totalReviewed) * 100)
      : 0;

  const recentCorrect = recentLogs.filter((l) => l.correct).length;
  const recentAccuracy =
    recentLogs.length > 0 ? Math.round((recentCorrect / recentLogs.length) * 100) : 0;

  const avgResponseTime =
    recentLogs.length > 0
      ? recentLogs.reduce((sum, l) => sum + l.responseTimeMs, 0) / recentLogs.length / 1000
      : 0;
  const recentRetrievalMetrics = getRecentRetrievalMetrics(recentLogs);

  const maxStat = Math.max(...Object.values(profile.stats), 40);
  const diffDisplay = DIFFICULTY_DISPLAY[profile.difficulty];
  const diffConfig = DIFFICULTY_CONFIG[profile.difficulty];

  const trendMax = Math.max(...trend, 1);

  const overviewTiles = [
    {
      label: "Trials Fought",
      value: profile.totalSessions,
      color: "var(--gold-deep)",
      Icon: Compass,
    },
    {
      label: "Best Flame",
      value: `${profile.longestStreak}d`,
      color: "var(--ember)",
      Icon: FlameSm,
    },
    {
      label: "Accuracy",
      value: `${lifetimeAccuracy}%`,
      color: accuracyColor(lifetimeAccuracy),
      Icon: Shield,
    },
    {
      label: "Words Bound",
      value: wordCount,
      color: "var(--lapis)",
      Icon: Tome,
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <motion.div {...fadeUp(0)}>
        <div className="uppercase-tracked text-[11px]" style={{ color: "var(--gold-deep)" }}>
          Chronicle
        </div>
        <h1 className="font-display text-[34px] font-bold mt-0.5" style={{ color: "var(--ink)" }}>
          Deeds &amp; Omens
        </h1>
        <p className="italic mt-1" style={{ color: "var(--muted-foreground)" }}>
          A record of strikes true and strikes false, kept since the first rising.
        </p>
      </motion.div>

      <HeronDivider />

      {/* Overview tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {overviewTiles.map(({ label, value, color, Icon }, i) => (
          <motion.div key={label} {...fadeUp(0.05 + i * 0.07)}>
            <IllumCard className="p-4" corners={false}>
              <div className="flex items-center gap-3">
                <span style={{ color }}>
                  <Icon size={22} />
                </span>
                <div>
                  <div
                    className="uppercase-tracked text-[10px]"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {label}
                  </div>
                  <div
                    className="font-display text-[26px] font-bold tabular-nums"
                    style={{ color }}
                  >
                    {value}
                  </div>
                </div>
              </div>
            </IllumCard>
          </motion.div>
        ))}
      </div>

      {/* Disciplines + 14-day chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div {...fadeUp(0.25)}>
          <IllumCard>
            <div
              className="uppercase-tracked text-[11px] mb-3"
              style={{ color: "var(--gold-deep)" }}
            >
              Disciplines — Current Aspect
            </div>
            <div className="flex flex-col gap-2.5">
              {STAT_CONFIG.map((s) => (
                <div
                  key={s.key}
                  className="grid items-center gap-3 py-2.5 px-3 rounded-[2px]"
                  style={{
                    gridTemplateColumns: "36px 1fr auto",
                    border: "1px solid var(--line-soft)",
                    borderLeft: `3px solid ${s.color}`,
                    background: `color-mix(in oklab, ${s.color}, transparent 94%)`,
                  }}
                >
                  <span style={{ color: s.color }}>
                    <s.sigil size={26} />
                  </span>
                  <div>
                    <div className="flex justify-between items-baseline">
                      <span className="font-display text-sm font-semibold">{s.label}</span>
                      <span
                        className="font-mono-num text-xs tabular-nums"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {profile.stats[s.key]}
                      </span>
                    </div>
                    <div className="plate mt-1" style={{ height: 5 }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(100, (profile.stats[s.key] / maxStat) * 100)}%`,
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{ height: "100%", background: s.color, opacity: 0.85 }}
                      />
                    </div>
                  </div>
                  <span
                    className="text-[11px] italic"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {s.note}
                  </span>
                </div>
              ))}
            </div>
          </IllumCard>
        </motion.div>

        <motion.div {...fadeUp(0.32)}>
          <IllumCard>
            <div className="flex justify-between items-center mb-3">
              <div
                className="uppercase-tracked text-[11px]"
                style={{ color: "var(--gold-deep)" }}
              >
                Recent Trials — 14 days
              </div>
              <span className="lex-badge">Words struck per day</span>
            </div>
            <svg viewBox="0 0 400 160" width="100%" height="160" aria-hidden>
              {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                <line
                  key={t}
                  x1="30"
                  x2="395"
                  y1={20 + t * 120}
                  y2={20 + t * 120}
                  stroke="var(--line-soft)"
                  strokeDasharray="2 3"
                  opacity=".6"
                />
              ))}
              {trend.map((v, i) => {
                const x = 36 + i * 25;
                const h = (v / trendMax) * 120;
                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y={140 - h}
                      width="16"
                      height={h}
                      fill="var(--gold)"
                      stroke="var(--gold-deep)"
                      strokeWidth=".6"
                    />
                    {h > 0 && (
                      <rect x={x} y={140 - h} width="16" height="3" fill="var(--gold-bright)" />
                    )}
                  </g>
                );
              })}
              {[0, Math.max(1, Math.round(trendMax / 2)), trendMax].map((v, i) => (
                <text
                  key={i}
                  x="26"
                  y={144 - (v / trendMax) * 120}
                  fontSize="9"
                  fill="var(--muted-foreground)"
                  textAnchor="end"
                  fontFamily="var(--font-mono), monospace"
                >
                  {v}
                </text>
              ))}
            </svg>
            <div
              className="flex justify-between mt-1.5 text-[10px]"
              style={{
                color: "var(--muted-foreground)",
                fontFamily: "var(--font-display), serif",
                letterSpacing: ".12em",
              }}
            >
              <span>14d ago</span>
              <span>7d</span>
              <span>today</span>
            </div>

            <div
              className="mt-3 pt-3 grid grid-cols-2 gap-3"
              style={{ borderTop: "1px solid var(--line-soft)" }}
            >
              <div>
                <div
                  className="uppercase-tracked text-[10px]"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Recent accuracy
                </div>
                <div
                  className="font-display text-2xl font-bold tabular-nums"
                  style={{ color: accuracyColor(recentAccuracy) }}
                >
                  {recentAccuracy}%
                </div>
                <div className="text-[11px] italic" style={{ color: "var(--muted-foreground)" }}>
                  last {recentLogs.length} reviews
                </div>
              </div>
              <div>
                <div
                  className="uppercase-tracked text-[10px]"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Avg cadence
                </div>
                <div
                  className="font-display text-2xl font-bold tabular-nums"
                  style={{ color: "var(--ember)" }}
                >
                  {avgResponseTime.toFixed(1)}s
                </div>
                <div className="text-[11px] italic" style={{ color: "var(--muted-foreground)" }}>
                  per word
                </div>
              </div>
            </div>
          </IllumCard>
        </motion.div>
      </div>

      <HeronDivider label="Retrieval Health" />

      {/* Retrieval health */}
      {!retrieval.loading && (
        <motion.div {...fadeUp(0.36)}>
          <IllumCard>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                [
                  "Rescue",
                  retrieval.rescueWordCount,
                  "Words clinging to memory by a thread.",
                  "var(--crimson)",
                ],
                [
                  "Stabilize",
                  recentRetrievalMetrics.cueUseRate ?? 0,
                  recentRetrievalMetrics.cueUseRate !== null
                    ? `${recentRetrievalMetrics.cueUseRate}% leaning on cues — gaining steadiness.`
                    : "Gaining steadiness.",
                  "var(--ember)",
                ],
                [
                  "Fluent",
                  recentRetrievalMetrics.cleanRate ?? 0,
                  recentRetrievalMetrics.cleanRate !== null
                    ? `${recentRetrievalMetrics.cleanRate}% clean strikes — answering without pause.`
                    : "Answering without pause.",
                  "var(--sage)",
                ],
              ].map(([label, value, desc, color]) => {
                const stringValue = typeof value === "string" ? value : String(value);
                const displayValue =
                  label === "Rescue" ? stringValue : `${stringValue}%`;
                return (
                  <div key={String(label)}>
                    <div
                      className="font-display text-[30px] font-bold tabular-nums"
                      style={{ color: color as string }}
                    >
                      {displayValue}
                    </div>
                    <div
                      className="uppercase-tracked text-[11px] mt-0.5"
                      style={{ color: color as string }}
                    >
                      {label}
                    </div>
                    <div
                      className="text-[13px] italic mt-1"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </IllumCard>
        </motion.div>
      )}

      {/* Retrieval metrics (unassisted, latency) */}
      {!retrieval.loading && (
        <motion.div {...fadeUp(0.40)}>
          <IllumCard>
            <div
              className="uppercase-tracked text-[11px] mb-3 flex items-center gap-2"
              style={{ color: "var(--gold-deep)" }}
            >
              <HeartPulse className="size-4" />
              Pulse of Retrieval
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="rounded-[3px] p-3.5"
                style={{
                  background: "color-mix(in oklab, var(--paper), var(--gold) 2%)",
                  border: "1px solid var(--line-soft)",
                }}
              >
                <p
                  className="uppercase-tracked text-[10px]"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Unassisted Recall
                </p>
                <p
                  className="font-display text-[28px] font-bold tabular-nums"
                  style={{
                    color:
                      retrieval.unassistedRate !== null
                        ? accuracyColor(retrieval.unassistedRate)
                        : "var(--muted-foreground)",
                  }}
                >
                  {retrieval.unassistedRate !== null
                    ? `${retrieval.unassistedRate}%`
                    : "—"}
                </p>
                {retrieval.unassistedRateDelta !== null && (
                  <p className="flex items-center gap-1 text-[11px] italic mt-0.5">
                    {retrieval.unassistedRateDelta > 0 ? (
                      <ArrowUpRight className="size-3" style={{ color: "var(--sage)" }} />
                    ) : retrieval.unassistedRateDelta < 0 ? (
                      <ArrowDownRight className="size-3" style={{ color: "var(--crimson)" }} />
                    ) : (
                      <Minus
                        className="size-3"
                        style={{ color: "var(--muted-foreground)" }}
                      />
                    )}
                    <span
                      style={{
                        color:
                          retrieval.unassistedRateDelta > 0
                            ? "var(--sage)"
                            : retrieval.unassistedRateDelta < 0
                              ? "var(--crimson)"
                              : "var(--muted-foreground)",
                      }}
                    >
                      {retrieval.unassistedRateDelta > 0 ? "+" : ""}
                      {retrieval.unassistedRateDelta}pp vs last week
                    </span>
                  </p>
                )}
              </div>

              <div
                className="rounded-[3px] p-3.5"
                style={{
                  background: "color-mix(in oklab, var(--paper), var(--gold) 2%)",
                  border: "1px solid var(--line-soft)",
                }}
              >
                <p
                  className="uppercase-tracked text-[10px]"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Cadence of Retrieval
                </p>
                <p
                  className="font-display text-[28px] font-bold tabular-nums"
                  style={{ color: "var(--ember)" }}
                >
                  {retrieval.medianLatencyMs !== null
                    ? `${(retrieval.medianLatencyMs / 1000).toFixed(1)}s`
                    : "—"}
                </p>
                {retrieval.latencyDeltaMs !== null && (
                  <p className="flex items-center gap-1 text-[11px] italic mt-0.5">
                    {retrieval.latencyDeltaMs < -50 ? (
                      <ArrowDownRight className="size-3" style={{ color: "var(--sage)" }} />
                    ) : retrieval.latencyDeltaMs > 50 ? (
                      <ArrowUpRight className="size-3" style={{ color: "var(--crimson)" }} />
                    ) : (
                      <Minus
                        className="size-3"
                        style={{ color: "var(--muted-foreground)" }}
                      />
                    )}
                    <span
                      style={{
                        color:
                          retrieval.latencyDeltaMs < -50
                            ? "var(--sage)"
                            : retrieval.latencyDeltaMs > 50
                              ? "var(--crimson)"
                              : "var(--muted-foreground)",
                      }}
                    >
                      {retrieval.latencyDeltaMs > 0 ? "+" : ""}
                      {(retrieval.latencyDeltaMs / 1000).toFixed(1)}s vs last week
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div
              className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {[
                {
                  Icon: ShieldAlert,
                  label: "Cue-dependent",
                  value: retrieval.cueDependentWordCount,
                  color:
                    retrieval.cueDependentWordCount > 0
                      ? "var(--ember)"
                      : "var(--sage)",
                },
                {
                  Icon: AlertTriangle,
                  label: "TOT this week",
                  value: retrieval.totThisWeek,
                  color:
                    retrieval.totThisWeek > 0 ? "var(--ember)" : "var(--sage)",
                },
                {
                  Icon: LifeBuoy,
                  label: "In rescue",
                  value: retrieval.rescueWordCount,
                  color:
                    retrieval.rescueWordCount > 3
                      ? "var(--crimson)"
                      : retrieval.rescueWordCount > 0
                        ? "var(--ember)"
                        : "var(--sage)",
                },
              ].map(({ Icon, label, value, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-[2px]"
                  style={{ border: "1px solid var(--line-soft)" }}
                >
                  <Icon className="size-4" style={{ color }} />
                  <div
                    className="uppercase-tracked text-[10px] flex-1"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {label}
                  </div>
                  <div
                    className="font-display text-sm font-bold tabular-nums"
                    style={{ color }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </IllumCard>
        </motion.div>
      )}

      {/* Training history */}
      <motion.div {...fadeUp(0.42)}>
        <IllumCard>
          <div
            className="uppercase-tracked text-[11px] mb-3"
            style={{ color: "var(--gold-deep)" }}
          >
            Training History
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="uppercase-tracked text-[10px]" style={{ color: "var(--muted-foreground)" }}>
              Current pace
            </span>
            <div
              className="inline-flex items-center gap-2 rounded-[3px] px-3 py-1.5 font-display uppercase text-[11px]"
              style={{
                letterSpacing: ".16em",
                background: `color-mix(in oklab, ${diffDisplay.color}, transparent 88%)`,
                color: diffDisplay.color,
                border: `1px solid ${diffDisplay.color}`,
              }}
            >
              <diffDisplay.sigil size={14} />
              {diffDisplay.label}
              <span className="opacity-75 text-[10px] normal-case" style={{ letterSpacing: ".06em" }}>
                · {diffConfig.description}
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <p className="uppercase-tracked text-[10px]" style={{ color: "var(--muted-foreground)" }}>
              Tier Unlocks
            </p>
            <div className="space-y-1.5">
              {(["1", "2", "3"] as const).map((tier) => {
                const unlockLevel = TIER_UNLOCK_LEVELS[tier] ?? 1;
                const isUnlocked = profile.level >= unlockLevel;
                const info = TIER_INFO[tier];
                return (
                  <div
                    key={tier}
                    className="flex items-center gap-3 px-2.5 py-2 rounded-[2px]"
                    style={{
                      border: "1px solid var(--line-soft)",
                      opacity: isUnlocked ? 1 : 0.6,
                    }}
                  >
                    <div
                      className="flex items-center justify-center size-7 rounded-[2px] font-display font-bold"
                      style={{
                        background: isUnlocked ? info.color : "color-mix(in oklab, var(--paper), black 10%)",
                        color: isUnlocked ? "#fff" : "var(--muted-foreground)",
                      }}
                    >
                      {isUnlocked ? info.numeral : <Lock className="size-3" />}
                    </div>
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <span
                        className="font-display text-sm font-semibold"
                        style={{ color: isUnlocked ? info.color : "var(--muted-foreground)" }}
                      >
                        {info.label}
                      </span>
                      <span
                        className="text-[11px] italic"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {isUnlocked ? "Unlocked" : `Rank ${unlockLevel}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-baseline">
              <span
                className="uppercase-tracked text-[10px]"
                style={{ color: "var(--muted-foreground)" }}
              >
                Words Collected
              </span>
              <span
                className="font-display text-sm font-bold tabular-nums"
                style={{ color: "var(--gold-deep)" }}
              >
                {wordCount}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-1.5">
              {[
                {
                  label: "To Review",
                  value: dueCount,
                  color:
                    dueCount > 0 ? "var(--crimson)" : "var(--sage)",
                },
                { label: "Reviewed", value: profile.totalReviewed, color: "var(--gold-deep)" },
                {
                  label: "Correct",
                  value: `${lifetimeAccuracy}%`,
                  color: accuracyColor(lifetimeAccuracy),
                },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="text-center rounded-[2px] py-2.5"
                  style={{
                    background: "color-mix(in oklab, var(--paper), var(--gold) 2%)",
                    border: "1px solid var(--line-soft)",
                  }}
                >
                  <div
                    className="font-display text-base font-bold tabular-nums"
                    style={{ color }}
                  >
                    {value}
                  </div>
                  <div
                    className="uppercase-tracked text-[9px] mt-0.5"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </IllumCard>
      </motion.div>
    </main>
  );
}
