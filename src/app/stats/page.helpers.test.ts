import { describe, expect, it } from "vitest";
import type { ReviewLog } from "@/lib/types";
import { getRecentRetrievalMetrics } from "./page.helpers";

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
