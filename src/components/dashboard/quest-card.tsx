"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Difficulty } from "@/lib/types";
import { Sword, ChevronRight } from "@/components/rpg/sigils";

interface QuestCardProps {
  dueCount: number;
  newCount: number;
  inboxCount: number;
  wordCount: number;
  sessionSize: number;
  difficulty: Difficulty;
}

function pluralize(count: number, singular: string) {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

export function QuestCard({
  dueCount,
  newCount,
  inboxCount,
  wordCount,
  sessionSize,
  difficulty,
}: QuestCardProps) {
  const hasTrainingWork = dueCount > 0 || newCount > 0;
  const hasInboxWork = inboxCount > 0;
  const hasWork = hasTrainingWork || hasInboxWork;

  const nextReviewCount = Math.min(dueCount, sessionSize);
  const nextNewCount = Math.min(newCount, Math.max(0, sessionSize - nextReviewCount));
  const backlogParts = [
    dueCount > 0 ? `${pluralize(dueCount, "review")} waiting` : null,
    newCount > 0 ? `${pluralize(newCount, "eligible new word")} available today` : null,
    inboxCount > 0 ? `${pluralize(inboxCount, "capture")} pending triage` : null,
  ].filter(Boolean);

  const backlog = backlogParts.length > 0
    ? backlogParts.join(", ")
    : `${wordCount} words in library`;

  const summary =
    nextReviewCount > 0 && nextNewCount > 0
      ? `Next ${difficulty} trial: ${pluralize(nextReviewCount, "review")} + ${pluralize(nextNewCount, "eligible new word")}`
      : nextReviewCount > 0
        ? `Next ${difficulty} trial: ${pluralize(nextReviewCount, "review")}`
        : nextNewCount > 0
          ? `Next ${difficulty} trial: ${pluralize(nextNewCount, "eligible new word")}`
          : `${wordCount} words in library`;

  const accent = hasTrainingWork
    ? "var(--crimson)"
    : hasInboxWork
      ? "var(--gold-deep)"
      : "var(--sage)";
  const heading = hasTrainingWork
    ? "The Foe at the Crossroads"
    : hasInboxWork
      ? "The Ledger Calls"
      : "The Road is Quiet";
  const subtext = hasTrainingWork
    ? "Your training awaits - strike true, and words fall to your ledger."
    : hasInboxWork
      ? "Captured words await judgment before they enter the training road."
      : "No foe presses you today. The Wheel turns; return when it wills.";
  const actionHref = hasTrainingWork ? "/session" : hasInboxWork ? "/words" : "/session";
  const actionLabel = hasTrainingWork ? "Take the Field" : hasInboxWork ? "Review Inbox" : "Free Training";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.35 }}
      className="relative overflow-hidden rounded-[var(--radius)] px-6 py-5"
      style={{
        background: `linear-gradient(180deg,
          color-mix(in oklab, var(--paper-2), ${accent} 4%),
          color-mix(in oklab, var(--paper), var(--gold) 3%))`,
        border: "1px solid var(--line)",
        borderLeft: `4px solid ${accent}`,
        boxShadow: "var(--shadow-md)",
      }}
    >
      <svg
        aria-hidden
        className="absolute pointer-events-none"
        style={{ right: -40, top: -40, color: accent, opacity: 0.06 }}
        width="260"
        height="260"
        viewBox="0 0 260 260"
      >
        <g stroke="currentColor" strokeWidth="1" fill="none">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={i} x1={i * 18} y1="0" x2={i * 18 + 260} y2="260" />
          ))}
        </g>
      </svg>

      <div className="relative grid gap-5 items-center grid-cols-1 md:grid-cols-[1fr_auto]">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="uppercase-tracked text-[11px]" style={{ color: accent }}>
              Daily Trial
            </span>
            <span
              className="lex-badge"
              style={{
                borderColor: accent,
                color: accent,
                background: `color-mix(in oklab, ${accent}, transparent 92%)`,
              }}
            >
              {hasTrainingWork ? "Trial Awaits" : hasInboxWork ? "Inbox Awaits" : "All Clear"}
            </span>
          </div>
          <h2 className="font-display text-[26px] font-bold leading-[1.15] m-0">{heading}</h2>
          <p className="mt-2 text-[15px] max-w-[520px]" style={{ color: "var(--muted-foreground)" }}>
            {subtext}
          </p>

          <div className="flex gap-5 mt-4 flex-wrap">
            {hasWork ? (
              <>
                <div>
                  <div className="uppercase-tracked text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                    To Review
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-[30px] font-bold tabular-nums" style={{ color: "var(--crimson)" }}>
                      {dueCount}
                    </span>
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      words
                    </span>
                  </div>
                </div>
                <div className="pl-5" style={{ borderLeft: "1px solid var(--line)" }}>
                  <div className="uppercase-tracked text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                    Eligible New
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-[30px] font-bold tabular-nums" style={{ color: "var(--sage)" }}>
                      {newCount}
                    </span>
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      new
                    </span>
                  </div>
                </div>
                {hasInboxWork && (
                  <div className="pl-5" style={{ borderLeft: "1px solid var(--line)" }}>
                    <div className="uppercase-tracked text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                      Inbox
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-[30px] font-bold tabular-nums" style={{ color: "var(--gold-deep)" }}>
                        {inboxCount}
                      </span>
                      <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                        pending
                      </span>
                    </div>
                  </div>
                )}
                <div className="pl-5" style={{ borderLeft: "1px solid var(--line)" }}>
                  <div className="uppercase-tracked text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                    Pace
                  </div>
                  <div className="font-display text-[18px] font-semibold mt-1 capitalize">{difficulty}</div>
                </div>
              </>
            ) : (
              <div>
                <div className="uppercase-tracked text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  Library
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-[30px] font-bold tabular-nums" style={{ color: "var(--gold-deep)" }}>
                    {wordCount}
                  </span>
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    words gathered
                  </span>
                </div>
              </div>
            )}
          </div>

          <p className="mt-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
            {backlog} - {summary}
          </p>
        </div>

        <Link href={actionHref} className={hasWork ? "btn-illum pulse-gold" : "btn-illum"}>
          <Sword size={18} />
          {actionLabel}
          <ChevronRight size={16} />
        </Link>
      </div>
    </motion.div>
  );
}
