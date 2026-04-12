/** @vitest-environment jsdom */

import { renderHook, act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getOrCreateProfileMock = vi.hoisted(() => vi.fn());
const getDueCountMock = vi.hoisted(() => vi.fn());
const getWordCountMock = vi.hoisted(() => vi.fn());
const getAvailableNewCountMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/db", () => ({
  db: {
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

    const { result } = renderHook(() => useStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.profile?.level).toBe(1);
      expect(result.current.dueCount).toBe(2);
      expect(result.current.newCount).toBe(5);
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
});
