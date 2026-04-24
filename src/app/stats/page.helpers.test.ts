import { describe, expect, it } from "vitest";
import type { ReviewLog, Word } from "@/lib/types";
import { getPipelineStats, getRecentRetrievalMetrics } from "./page.helpers";

function makeReviewLog(
  reviewedAt: string,
  overrides: Partial<ReviewLog> = {},
): ReviewLog {
  return {
    wordId: 1,
    rating: 3,
    responseTimeMs: 1800,
    correct: true,
    cueLevel: 0,
    retrievalKind: "exact",
    reviewedAt: new Date(reviewedAt),
    ...overrides,
  };
}

function makeWord(id: number, stage: Word["pipelineStage"]): Word {
  return {
    id,
    word: `word-${id}`,
    definition: "definition",
    examples: [],
    synonyms: [],
    tier: 1,
    pipelineStage: stage,
    createdAt: new Date("2026-04-01T00:00:00.000Z"),
  };
}

describe("getRecentRetrievalMetrics", () => {
  it("returns no data when recent reviews are transfer-context only", () => {
    const metrics = getRecentRetrievalMetrics([
      makeReviewLog("2026-04-10T11:45:00.000Z", {
        rating: 2,
        retrievalKind: "assisted",
        contextPromptKind: "produce",
      }),
      makeReviewLog("2026-04-09T11:45:00.000Z", {
        rating: 2,
        retrievalKind: "assisted",
        contextPromptKind: "rewrite",
      }),
    ]);

    expect(metrics).toEqual({
      cleanRate: null,
      cueUseRate: null,
      retrievalLogCount: 0,
    });
  });

  it("computes clean retrieval and cue use rates from retrieval-only reviews", () => {
    const metrics = getRecentRetrievalMetrics([
      makeReviewLog("2026-04-10T11:45:00.000Z"),
      makeReviewLog("2026-04-09T11:45:00.000Z", {
        cueLevel: 1,
        retrievalKind: "assisted",
      }),
      makeReviewLog("2026-04-08T11:45:00.000Z", {
        correct: false,
        rating: 1,
        retrievalKind: "failed",
      }),
      makeReviewLog("2026-04-07T11:45:00.000Z", {
        contextPromptKind: "produce",
        rating: 2,
        retrievalKind: "assisted",
      }),
    ]);

    expect(metrics).toEqual({
      cleanRate: 33,
      cueUseRate: 33,
      retrievalLogCount: 3,
    });
  });
});

describe("getPipelineStats", () => {
  it("summarizes lifecycle distribution and production conversion", () => {
    const stats = getPipelineStats([
      makeWord(1, "captured"),
      makeWord(2, "queued"),
      makeWord(3, "learning"),
      makeWord(4, "reviewing"),
      makeWord(5, "contextualizing"),
      makeWord(6, "productive"),
      makeWord(7, "mature"),
    ]);

    expect(stats.summary.counts).toMatchObject({
      captured: 1,
      queued: 1,
      learning: 1,
      reviewing: 1,
      contextualizing: 1,
      productive: 1,
      mature: 1,
    });
    expect(stats.summary.recognitionToProductionRate).toBe(50);
    expect(stats.tiles).toEqual([
      { label: "Captured", value: 1, stage: "captured" },
      { label: "Learning", value: 1, stage: "learning" },
      { label: "Reviewing", value: 1, stage: "reviewing" },
      { label: "Productive", value: 1, stage: "productive" },
      { label: "Mature", value: 1, stage: "mature" },
    ]);
  });
});
