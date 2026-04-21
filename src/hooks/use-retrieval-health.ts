"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/db";
import { buildRetrievalDrillProfile } from "@/lib/session-engine";
import type { ReviewLog, Word } from "@/lib/types";

export interface RetrievalHealth {
  /** Unassisted exact recall rate for the current 7-day window (0–100), or null when no retrieval-drill reviews exist. */
  unassistedRate: number | null;
  /** Percentage-point change vs the previous 7-day window. */
  unassistedRateDelta: number | null;
  /** Median retrieval latency (ms) for correct unassisted reviews, current 7 days. */
  medianLatencyMs: number | null;
  /** Change in median latency vs previous 7 days (negative = faster). */
  latencyDeltaMs: number | null;
  /** Words where at least 2 of the last 3 reviews used a cue or were assisted. */
  cueDependentWordCount: number;
  /** Words with a TOT capture timestamped in the current calendar week. */
  totThisWeek: number;
  /** Words currently classified in the rescue drill stage. */
  rescueWordCount: number;
  loading: boolean;
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function median(values: number[]): number | undefined {
  if (values.length === 0) return undefined;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

function isRetrievalDrillLog(log: ReviewLog): boolean {
  return log.contextPromptKind !== "produce" && log.contextPromptKind !== "rewrite";
}

function isCleanExact(log: ReviewLog): boolean {
  return (
    isRetrievalDrillLog(log)
    && log.correct
    && (log.retrievalKind ?? (log.correct ? "exact" : "failed")) === "exact"
    && (log.cueLevel ?? 0) === 0
  );
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function computeWindowMetrics(logs: ReviewLog[]) {
  const retrievalLogs = logs.filter(isRetrievalDrillLog);
  if (retrievalLogs.length === 0) {
    return {
      retrievalLogCount: 0,
      unassistedRate: null as number | null,
      medianLatencyMs: null as number | null,
    };
  }

  const cleanCount = retrievalLogs.filter(isCleanExact).length;
  const unassistedRate = Math.round((cleanCount / retrievalLogs.length) * 100);

  const cleanLatencies = retrievalLogs.filter(isCleanExact).map((l) => l.responseTimeMs);
  const medianLatencyMs = median(cleanLatencies) ?? null;

  return {
    retrievalLogCount: retrievalLogs.length,
    unassistedRate,
    medianLatencyMs,
  };
}

export function useRetrievalHealth(): RetrievalHealth {
  const [health, setHealth] = useState<RetrievalHealth>({
    unassistedRate: null,
    unassistedRateDelta: null,
    medianLatencyMs: null,
    latencyDeltaMs: null,
    cueDependentWordCount: 0,
    totThisWeek: 0,
    rescueWordCount: 0,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function compute() {
      const now = new Date();
      const twoWeeksAgo = new Date(now.getTime() - 2 * WEEK_MS);
      const oneWeekAgo = new Date(now.getTime() - WEEK_MS);
      const weekStart = startOfWeek(now);

      const [recentLogs, allWords] = await Promise.all([
        db.reviewLogs.where("reviewedAt").above(twoWeeksAgo).toArray(),
        db.words.toArray(),
      ]);

      if (cancelled) return;

      // Split into current and previous 7-day windows
      const currentWeekLogs = recentLogs.filter(
        (l) => l.reviewedAt.getTime() >= oneWeekAgo.getTime(),
      );
      const prevWeekLogs = recentLogs.filter(
        (l) => l.reviewedAt.getTime() < oneWeekAgo.getTime(),
      );

      const current = computeWindowMetrics(currentWeekLogs);
      const prev = computeWindowMetrics(prevWeekLogs);

      const unassistedRateDelta =
        current.unassistedRate !== null && prev.retrievalLogCount > 0 && prev.unassistedRate !== null
          ? current.unassistedRate - prev.unassistedRate
          : null;

      const latencyDeltaMs =
        current.medianLatencyMs !== null && prev.medianLatencyMs !== null
          ? current.medianLatencyMs - prev.medianLatencyMs
          : null;

      // Cue-dependent words: 2 of last 3 reviews used cue or assisted
      const allLogs = await db.reviewLogs.toArray();
      const logsByWord = new Map<number, ReviewLog[]>();
      for (const log of allLogs) {
        const arr = logsByWord.get(log.wordId);
        if (arr) arr.push(log);
        else logsByWord.set(log.wordId, [log]);
      }

      let cueDependentWordCount = 0;
      for (const [, logs] of logsByWord) {
        const recent = [...logs]
          .filter(isRetrievalDrillLog)
          .sort((a, b) => b.reviewedAt.getTime() - a.reviewedAt.getTime())
          .slice(0, 3);
        if (recent.length < 2) continue;
        const cueCount = recent.filter(
          (l) => (l.cueLevel ?? 0) > 0 || l.retrievalKind === "assisted",
        ).length;
        if (cueCount >= 2) cueDependentWordCount++;
      }

      // TOT incidents this week
      const totThisWeek = allWords.filter((w) => {
        if (!w.totCapture?.capturedAt) return false;
        const captured = new Date(w.totCapture.capturedAt);
        return captured.getTime() >= weekStart.getTime();
      }).length;

      // Rescue-stage word count
      let rescueWordCount = 0;
      const wordMap = new Map<number, Word>();
      for (const w of allWords) {
        if (w.id !== undefined) wordMap.set(w.id, w);
      }
      for (const [wordId, logs] of logsByWord) {
        const word = wordMap.get(wordId);
        if (!word) continue;
        const profile = buildRetrievalDrillProfile(word, logs);
        if (profile.stage === "rescue") rescueWordCount++;
      }

      if (cancelled) return;

      setHealth({
        unassistedRate: current.unassistedRate,
        unassistedRateDelta,
        medianLatencyMs: current.medianLatencyMs,
        latencyDeltaMs,
        cueDependentWordCount,
        totThisWeek,
        rescueWordCount,
        loading: false,
      });
    }

    void compute();
    return () => { cancelled = true; };
  }, []);

  return health;
}
