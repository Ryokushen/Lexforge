/** @vitest-environment jsdom */

import { renderHook, act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getOrCreateProfileMock = vi.hoisted(() => vi.fn());
const getDueCountMock = vi.hoisted(() => vi.fn());
const getWordCountMock = vi.hoisted(() => vi.fn());
const getAvailableNewCountMock = vi.hoisted(() => vi.fn());
const wordsToArrayMock = vi.hoisted(() => vi.fn());
const reviewLogsToArrayMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/db", () => ({
  db: {
    words: {
      toArray: wordsToArrayMock,
    },
    reviewLogs: {
      toArray: reviewLogsToArrayMock,
    },
    userProfile: {
      update: vi.fn(),
    },
  },
  getOrCreateProfile: getOrCreateProfileMock,
}));

vi.mock("@/lib/scheduler", () => ({
  getDueCount: getDueCountMock,
  getWordCount: getWordCountMock,
}));

vi.mock("@/lib/session-engine", () => ({
  getAvailableNewCount: getAvailableNewCountMock,
}));

vi.mock("@/lib/bootstrap-context", () => ({
  useBootstrap: () => ({
    seedStatus: "ready",
    seedError: null,
    retrySeed: vi.fn(),
  }),
}));

vi.mock("@/lib/sync", () => ({
  CLOUD_SYNC_EVENT: "lexforge-cloud-sync",
}));

import { useStats } from "./use-stats";

function makeProfile(overrides?: Partial<Awaited<ReturnType<typeof getOrCreateProfileMock>>>) {
  return {
    id: 1 as const,
    level: 1,
    xp: 0,
    xpToNextLevel: 200,
    hp: 100,
    maxHp: 100,
    currentStreak: 0,
    longestStreak: 0,
    totalSessions: 0,
    totalCorrect: 0,
    totalReviewed: 0,
    stats: { recall: 0, retention: 0, perception: 0, creativity: 0 },
    difficulty: "normal" as const,
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("useStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getOrCreateProfileMock.mockResolvedValue(makeProfile());
    getDueCountMock.mockResolvedValue(2);
    getWordCountMock.mockResolvedValue(100);
    getAvailableNewCountMock.mockResolvedValue(5);
    wordsToArrayMock.mockResolvedValue([]);
    reviewLogsToArrayMock.mockResolvedValue([]);
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
  });

  it("refreshes stats after a successful cloud sync", async () => {
    const updatedProfile = makeProfile({ level: 3, totalReviewed: 20 });

    getOrCreateProfileMock
      .mockResolvedValueOnce(makeProfile({ level: 1, totalReviewed: 10 }))
      .mockResolvedValueOnce(updatedProfile);
    getDueCountMock
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(6);
    getAvailableNewCountMock
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(1);
    getWordCountMock
      .mockResolvedValueOnce(100)
      .mockResolvedValueOnce(100);
    wordsToArrayMock
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        {
          id: 1,
          word: "lucid",
          definition: "clear",
          examples: [],
          synonyms: [],
          tier: 1,
          createdAt: new Date("2026-04-01T00:00:00.000Z"),
          totCapture: {
            source: "speech",
            capturedAt: "2026-04-10T12:00:00.000Z",
            count: 1,
            triageStatus: "pending",
          },
        },
      ]);
    reviewLogsToArrayMock
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    const { result } = renderHook(() => useStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.profile?.level).toBe(1);
      expect(result.current.dueCount).toBe(2);
      expect(result.current.newCount).toBe(5);
      expect(result.current.inboxCount).toBe(0);
      expect(result.current.coverageSignalCount).toBe(0);
    });

    await act(async () => {
      window.dispatchEvent(
        new CustomEvent("lexforge-cloud-sync", {
          detail: { state: "synced", lastSyncAt: new Date().toISOString() },
        }),
      );
    });

    await waitFor(() => {
      expect(result.current.profile?.level).toBe(3);
      expect(result.current.profile?.totalReviewed).toBe(20);
      expect(result.current.dueCount).toBe(6);
      expect(result.current.newCount).toBe(1);
      expect(result.current.inboxCount).toBe(1);
    });
  });

  it("refreshes stats when the window regains focus", async () => {
    getOrCreateProfileMock
      .mockResolvedValueOnce(makeProfile({ level: 1 }))
      .mockResolvedValueOnce(makeProfile({ level: 2 }));

    const { result } = renderHook(() => useStats());

    await waitFor(() => {
      expect(result.current.profile?.level).toBe(1);
    });

    await act(async () => {
      window.dispatchEvent(new Event("focus"));
    });

    await waitFor(() => {
      expect(result.current.profile?.level).toBe(2);
    });
  });

  it("counts transfer coverage gaps in the automatic coverage signal total", async () => {
    wordsToArrayMock.mockResolvedValue([
      {
        id: 1,
        word: "lucid",
        definition: "clear",
        examples: [],
        synonyms: [],
        association: "A clear window makes a lucid view.",
        tier: 1,
        createdAt: new Date("2026-04-01T00:00:00.000Z"),
      },
    ]);
    reviewLogsToArrayMock.mockResolvedValue([
      {
        wordId: 1,
        rating: 3,
        responseTimeMs: 1200,
        correct: true,
        retrievalKind: "exact",
        reviewedAt: new Date("2026-04-10T09:00:00.000Z"),
      },
      {
        wordId: 1,
        rating: 2,
        responseTimeMs: 1500,
        correct: true,
        retrievalKind: "assisted",
        contextPromptKind: "produce",
        reviewedAt: new Date("2026-04-10T10:00:00.000Z"),
      },
      {
        wordId: 1,
        rating: 2,
        responseTimeMs: 1800,
        correct: true,
        retrievalKind: "assisted",
        contextPromptKind: "collocation",
        reviewedAt: new Date("2026-04-10T11:00:00.000Z"),
      },
    ]);

    const { result } = renderHook(() => useStats());

    await waitFor(() => {
      expect(result.current.coverageSignalCount).toBe(1);
    });
  });
});
