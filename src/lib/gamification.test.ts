import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SessionResult, UserProfile } from "./types";

const dbMock = vi.hoisted(() => ({
  userProfile: {
    put: vi.fn(),
  },
}));

const getOrCreateProfileMock = vi.hoisted(() => vi.fn());

vi.mock("./db", () => ({
  db: dbMock,
  getOrCreateProfile: getOrCreateProfileMock,
}));

import {
  calculateSessionXP,
  calculateStatGains,
  completeSession,
  decayHP,
  xpForLevel,
} from "./gamification";

function makeResult(overrides: Partial<SessionResult> = {}): SessionResult {
  return {
    wordId: overrides.wordId ?? 1,
    word: overrides.word ?? "lucid",
    correct: overrides.correct ?? true,
    responseTimeMs: overrides.responseTimeMs ?? 2500,
    rating: overrides.rating ?? 3,
    mode: overrides.mode ?? "recall",
  };
}

function makeProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: 1,
    level: 1,
    xp: 0,
    xpToNextLevel: 200,
    hp: 100,
    maxHp: 100,
    currentStreak: 0,
    longestStreak: 0,
    lastSessionDate: undefined,
    totalSessions: 0,
    totalCorrect: 0,
    totalReviewed: 0,
    stats: { recall: 0, retention: 0, perception: 0, creativity: 0 },
    difficulty: "normal",
    ...overrides,
  };
}

describe("gamification", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-10T12:00:00.000Z"));
    vi.clearAllMocks();
  });

  it("calculates XP from base, streak, speed, and completion bonuses", () => {
    const xp = calculateSessionXP([
      makeResult({ correct: true, responseTimeMs: 2000 }),
      makeResult({ wordId: 2, correct: true, responseTimeMs: 2500 }),
      makeResult({ wordId: 3, correct: false, responseTimeMs: 5000, rating: 1 }),
      makeResult({ wordId: 4, correct: true, responseTimeMs: 4500 }),
    ]);

    expect(xp).toBe(92);
  });

  it("scales XP thresholds by 1.5x per level", () => {
    expect([1, 2, 3, 4].map(xpForLevel)).toEqual([200, 300, 450, 675]);
  });

  it("decays HP by 10 per missed day with a floor at 20", () => {
    expect(decayHP(100, 100, 0)).toBe(100);
    expect(decayHP(100, 100, 3)).toBe(70);
    expect(decayHP(25, 100, 10)).toBe(20);
  });

  it("awards stat gains for total correct answers plus mode-specific bonuses", () => {
    const results: SessionResult[] = [
      ...Array.from({ length: 10 }, (_, index) =>
        makeResult({ wordId: index + 1, mode: "recall" }),
      ),
      ...Array.from({ length: 10 }, (_, index) =>
        makeResult({ wordId: index + 11, mode: "speed" }),
      ),
      ...Array.from({ length: 10 }, (_, index) =>
        makeResult({ wordId: index + 21, mode: "association" }),
      ),
    ];

    expect(calculateStatGains(results)).toEqual({
      recall: 3,
      retention: 3,
      perception: 1,
      creativity: 1,
    });
  });

  it("keeps the streak on same-day sessions and increments totals", async () => {
    getOrCreateProfileMock.mockResolvedValue(
      makeProfile({
        currentStreak: 4,
        longestStreak: 6,
        lastSessionDate: "2026-04-10",
      }),
    );

    const summary = await completeSession([makeResult()]);

    expect(summary.xpEarned).toBe(65);
    expect(dbMock.userProfile.put).toHaveBeenCalledWith(
      expect.objectContaining({
        currentStreak: 4,
        longestStreak: 6,
        totalSessions: 1,
        totalCorrect: 1,
        totalReviewed: 1,
        lastSessionDate: "2026-04-10",
      }),
    );
  });

  it("increments streaks on the next day and restores HP on level up", async () => {
    getOrCreateProfileMock.mockResolvedValue(
      makeProfile({
        xp: 190,
        hp: 40,
        currentStreak: 2,
        longestStreak: 2,
        lastSessionDate: "2026-04-09",
      }),
    );

    const summary = await completeSession([makeResult()]);

    expect(summary.leveledUp).toBe(true);
    expect(summary.newLevel).toBe(2);
    expect(dbMock.userProfile.put).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 2,
        xp: 55,
        xpToNextLevel: 300,
        hp: 100,
        currentStreak: 3,
        longestStreak: 3,
      }),
    );
  });

  it("resets streaks after gaps and decays HP for missed days", async () => {
    getOrCreateProfileMock.mockResolvedValue(
      makeProfile({
        hp: 95,
        currentStreak: 7,
        longestStreak: 7,
        lastSessionDate: "2026-04-07",
      }),
    );

    await completeSession([makeResult({ responseTimeMs: 4500 })]);

    expect(dbMock.userProfile.put).toHaveBeenCalledWith(
      expect.objectContaining({
        hp: 75,
        currentStreak: 1,
        longestStreak: 7,
      }),
    );
  });
});
