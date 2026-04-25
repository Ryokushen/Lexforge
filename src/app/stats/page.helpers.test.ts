import { describe, expect, it } from "vitest";
import type { ReviewLog, Word } from "@/lib/types";
import type { VocabularyItem } from "@/lib/vocabulary-item";
import {
  getPipelineStats,
  getRecentRetrievalMetrics,
  getTrainingCoverageTransparency,
} from "./page.helpers";

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

function makeVocabularyItem(
  overrides: Partial<VocabularyItem> = {},
): VocabularyItem {
  return {
    id: 1,
    backingWordId: 1,
    word: "lucid",
    definition: "clear",
    examples: [],
    synonyms: [],
    contextSentences: [],
    tier: 1,
    createdAt: new Date("2026-04-01T00:00:00.000Z"),
    trainingEligible: true,
    source: {
      kind: "seeded",
      isSeeded: true,
      isCustom: false,
      isCaptured: false,
      captureCount: 0,
      captureTriageStatus: null,
      captureEventIds: [],
    },
    coverage: {
      retrieval: "unknown",
      context: "unknown",
      association: "unknown",
      collocation: "unknown",
    },
    ...overrides,
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
      makeReviewLog("2026-04-08T11:45:00.000Z", {
        rating: 2,
        retrievalKind: "assisted",
        contextPromptKind: "collocation",
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
      makeReviewLog("2026-04-06T11:45:00.000Z", {
        contextPromptKind: "collocation",
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

describe("getTrainingCoverageTransparency", () => {
  it("summarizes eligible lane coverage and blocked captures without making manual drill choices", () => {
    const transparency = getTrainingCoverageTransparency([
      makeVocabularyItem({ id: 1, backingWordId: 1 }),
      makeVocabularyItem({
        id: 2,
        backingWordId: 2,
        coverage: {
          retrieval: "practiced",
          context: "unknown",
          association: "unknown",
          collocation: "unknown",
        },
      }),
      makeVocabularyItem({
        id: 3,
        backingWordId: 3,
        trainingEligible: false,
      }),
      makeVocabularyItem({
        id: 4,
        backingWordId: 4,
        coverage: {
          retrieval: "practiced",
          context: "practiced",
          association: "practiced",
          collocation: "practiced",
        },
      }),
    ]);

    expect(transparency.summary).toEqual({
      eligibleCount: 3,
      blockedCount: 1,
      fullyCoveredCount: 1,
      automaticFillCount: 2,
    });
    expect(transparency.engineCopy).toContain("FSRS due reviews stay first");
    expect(transparency.engineCopy).not.toMatch(/choose|recommend/i);
    expect(transparency.lanes).toEqual([
      {
        lane: "retrieval",
        label: "Recall",
        practicedCount: 2,
        missingCount: 1,
        eligibleCount: 3,
        coveragePercent: 67,
        automaticFillCount: 1,
      },
      {
        lane: "context",
        label: "Context",
        practicedCount: 1,
        missingCount: 2,
        eligibleCount: 3,
        coveragePercent: 33,
        automaticFillCount: 1,
      },
      {
        lane: "association",
        label: "Association",
        practicedCount: 1,
        missingCount: 2,
        eligibleCount: 3,
        coveragePercent: 33,
        automaticFillCount: 0,
      },
      {
        lane: "collocation",
        label: "Collocation",
        practicedCount: 1,
        missingCount: 2,
        eligibleCount: 3,
        coveragePercent: 33,
        automaticFillCount: 0,
      },
    ]);
  });

  it("handles an empty eligible training pool", () => {
    const transparency = getTrainingCoverageTransparency([
      makeVocabularyItem({ trainingEligible: false }),
    ]);

    expect(transparency.summary).toEqual({
      eligibleCount: 0,
      blockedCount: 1,
      fullyCoveredCount: 0,
      automaticFillCount: 0,
    });
    expect(transparency.lanes.every((lane) => lane.coveragePercent === null)).toBe(
      true,
    );
  });
});
