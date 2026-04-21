/** @vitest-environment jsdom */

import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReviewLog } from "@/lib/types";

const recentLogsQueryMock = vi.hoisted(() => vi.fn());
const reviewLogsToArrayMock = vi.hoisted(() => vi.fn());
const wordsToArrayMock = vi.hoisted(() => vi.fn());
const buildRetrievalDrillProfileMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/db", () => ({
  db: {
    reviewLogs: {
      where: vi.fn(() => ({
        above: vi.fn(() => ({
          toArray: recentLogsQueryMock,
        })),
      })),
      toArray: reviewLogsToArrayMock,
    },
    words: {
      toArray: wordsToArrayMock,
    },
  },
}));

vi.mock("@/lib/session-engine", () => ({
  buildRetrievalDrillProfile: buildRetrievalDrillProfileMock,
}));

import { useRetrievalHealth } from "./use-retrieval-health";

function makeReviewLog(
  wordId: number,
  reviewedAt: string,
  overrides: Partial<ReviewLog> = {},
): ReviewLog {
  return {
    wordId,
    rating: 3,
    responseTimeMs: 1800,
    correct: true,
    cueLevel: 0,
    retrievalKind: "exact",
    reviewedAt: new Date(reviewedAt),
    ...overrides,
  };
}

describe("useRetrievalHealth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-10T12:00:00.000Z"));
    wordsToArrayMock.mockResolvedValue([]);
    buildRetrievalDrillProfileMock.mockReturnValue({
      stage: "stabilize",
      exactStreak: 1,
      recentCueRate: 0,
      recentFailureCount: 0,
      recallHintEnabled: true,
      rapidTimeoutMs: 4000,
      rapidCueRevealMs: 2500,
    });
  });

  it("excludes production-context reviews from retrieval-rate and cue-dependence metrics", async () => {
    const logs = [
      makeReviewLog(1, "2026-04-09T12:00:00.000Z", {
        rating: 2,
        retrievalKind: "assisted",
        contextPromptKind: "produce",
      }),
      makeReviewLog(1, "2026-04-08T12:00:00.000Z", {
        rating: 2,
        retrievalKind: "assisted",
        contextPromptKind: "produce",
      }),
      makeReviewLog(2, "2026-04-07T12:00:00.000Z", {
        responseTimeMs: 1500,
      }),
    ];

    recentLogsQueryMock.mockResolvedValue(logs);
    reviewLogsToArrayMock.mockResolvedValue(logs);

    const { result, unmount } = renderHook(() => useRetrievalHealth());

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.unassistedRate).toBe(100);
    expect(result.current.medianLatencyMs).toBe(1500);
    expect(result.current.cueDependentWordCount).toBe(0);

    unmount();
  });

  it("returns a null delta when the previous window only has production-context reviews", async () => {
    const logs = [
      makeReviewLog(2, "2026-04-09T12:00:00.000Z", {
        responseTimeMs: 1400,
      }),
      makeReviewLog(1, "2026-04-02T12:00:00.000Z", {
        rating: 2,
        retrievalKind: "assisted",
        contextPromptKind: "produce",
      }),
    ];

    recentLogsQueryMock.mockResolvedValue(logs);
    reviewLogsToArrayMock.mockResolvedValue(logs);

    const { result, unmount } = renderHook(() => useRetrievalHealth());

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.unassistedRate).toBe(100);
    expect(result.current.unassistedRateDelta).toBeNull();

    unmount();
  });

  it("reports no current retrieval rate when the week only contains transfer-context reviews", async () => {
    const logs = [
      makeReviewLog(1, "2026-04-09T12:00:00.000Z", {
        rating: 2,
        retrievalKind: "assisted",
        contextPromptKind: "produce",
      }),
      makeReviewLog(2, "2026-04-08T12:00:00.000Z", {
        rating: 2,
        retrievalKind: "assisted",
        contextPromptKind: "rewrite",
      }),
    ];

    recentLogsQueryMock.mockResolvedValue(logs);
    reviewLogsToArrayMock.mockResolvedValue(logs);

    const { result, unmount } = renderHook(() => useRetrievalHealth());

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.unassistedRate).toBeNull();
    expect(result.current.unassistedRateDelta).toBeNull();

    unmount();
  });
});
