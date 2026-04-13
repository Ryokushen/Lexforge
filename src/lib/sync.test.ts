import { beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "@supabase/supabase-js";
import type { UserProfile, Word } from "./types";

const dbMock = vi.hoisted(() => ({
  words: {
    toArray: vi.fn(),
    update: vi.fn(),
  },
  reviewCards: {
    toArray: vi.fn(),
    where: vi.fn(() => ({
      equals: vi.fn(() => ({
        first: vi.fn().mockResolvedValue(undefined),
      })),
    })),
    add: vi.fn(),
    update: vi.fn(),
  },
  reviewLogs: {
    toArray: vi.fn(),
    add: vi.fn(),
  },
  userProfile: {
    put: vi.fn(),
  },
}));

const getOrCreateProfileMock = vi.hoisted(() => vi.fn());

const tableState = vi.hoisted(() => ({
  profiles: {
    exists: false,
    row: null as Record<string, unknown> | null,
    upserts: [] as Array<{ rows: unknown; options: unknown }>,
  },
  review_cards: {
    rows: [] as Record<string, unknown>[],
    upserts: [] as Array<{ rows: unknown; options: unknown }>,
  },
  review_logs: {
    rows: [] as Record<string, unknown>[],
    upserts: [] as Array<{ rows: unknown; options: unknown }>,
  },
  word_associations: {
    rows: [] as Record<string, unknown>[],
    upserts: [] as Array<{ rows: unknown; options: unknown }>,
  },
}));

function makeSelectResult(response: { data: unknown; error: unknown }) {
  return {
    then(resolve: (value: { data: unknown; error: unknown }) => unknown) {
      return Promise.resolve(response).then(resolve);
    },
  };
}

vi.mock("./db", () => ({
  db: dbMock,
  getOrCreateProfile: getOrCreateProfileMock,
}));

vi.mock("./supabase", () => ({
  supabase: {
    from: vi.fn((table: keyof typeof tableState) => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => {
          if (table === "profiles") {
            return makeSelectResult({
              data: tableState.profiles.exists && tableState.profiles.row
                ? [tableState.profiles.row]
                : [],
              error: null,
            });
          }

          return makeSelectResult({
            data: tableState[table].rows,
            error: null,
          });
        }),
      })),
      upsert: vi.fn(async (rows: unknown, options: unknown) => {
        tableState[table].upserts.push({ rows, options });
        return { error: null };
      }),
    })),
  },
}));

import { pushToCloud, syncOnLogin } from "./sync";

function makeUserProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: 1,
    level: 3,
    xp: 120,
    xpToNextLevel: 300,
    hp: 90,
    maxHp: 100,
    currentStreak: 4,
    longestStreak: 6,
    lastSessionDate: "2026-04-11",
    totalSessions: 12,
    totalCorrect: 87,
    totalReviewed: 105,
    stats: { recall: 3, retention: 3, perception: 1, creativity: 0 },
    difficulty: "normal",
    updatedAt: "2026-04-11T08:30:00.000Z",
    ...overrides,
  };
}

function makeWord(id: number, word: string): Word {
  return {
    id,
    word,
    definition: `${word} definition`,
    examples: [`${word} example`],
    synonyms: [],
    tier: 1,
    createdAt: new Date("2026-04-01T00:00:00.000Z"),
  };
}

function makeUser(): User {
  return { id: "user-1" } as User;
}

function makeReviewLog(
  wordId: number,
  reviewedAt: string,
  correct: boolean,
  sessionId?: string,
): {
  id: number;
  wordId: number;
  sessionId?: string;
  rating: 1 | 2 | 3 | 4;
  responseTimeMs: number;
  correct: boolean;
  cueLevel?: 0 | 1;
  retrievalKind?: "exact" | "assisted" | "approximate" | "failed" | "created";
  reviewedAt: Date;
} {
  return {
    id: wordId,
    wordId,
    sessionId,
    rating: correct ? 3 : 1,
    responseTimeMs: correct ? 1500 : 7000,
    correct,
    cueLevel: 0,
    retrievalKind: correct ? "exact" : "failed",
    reviewedAt: new Date(reviewedAt),
  };
}

describe("sync review logs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tableState.profiles.exists = false;
    tableState.profiles.row = null;
    tableState.profiles.upserts = [];
    tableState.review_cards.rows = [];
    tableState.review_cards.upserts = [];
    tableState.review_logs.rows = [];
    tableState.review_logs.upserts = [];
    tableState.word_associations.rows = [];
    tableState.word_associations.upserts = [];

    dbMock.words.toArray.mockResolvedValue([]);
    dbMock.reviewCards.toArray.mockResolvedValue([]);
    dbMock.reviewLogs.toArray.mockResolvedValue([]);
    dbMock.reviewLogs.add.mockResolvedValue(1);
    dbMock.userProfile.put.mockResolvedValue(1);
    dbMock.reviewCards.update.mockResolvedValue(1);
    getOrCreateProfileMock.mockResolvedValue(makeUserProfile());
  });

  it("pushes local review logs to Supabase with a stable composite key", async () => {
    dbMock.words.toArray.mockResolvedValue([
      makeWord(1, "lucid"),
      makeWord(2, "oblique"),
    ]);
    dbMock.reviewLogs.toArray.mockResolvedValue([
      {
        id: 1,
        wordId: 1,
        rating: 3,
        responseTimeMs: 1800,
        correct: true,
        reviewedAt: new Date("2026-04-11T08:15:00.000Z"),
      },
    ]);

    await pushToCloud(makeUser());

    expect(tableState.review_logs.upserts).toHaveLength(1);
    expect(tableState.review_logs.upserts[0]).toEqual({
      rows: [
        expect.objectContaining({
          user_id: "user-1",
          word_key: "lucid",
          rating: 3,
          response_time_ms: 1800,
          correct: true,
          cue_level: 0,
          retrieval_kind: "exact",
          reviewed_at: "2026-04-11T08:15:00.000Z",
        }),
      ],
      options: { onConflict: "user_id,word_key,reviewed_at" },
    });
  });

  it("pulls cloud review logs on login and skips logs already stored locally", async () => {
    tableState.profiles.exists = true;
    tableState.profiles.row = {
      id: "user-1",
      level: 3,
      xp: 120,
      xp_to_next_level: 300,
      hp: 90,
      max_hp: 100,
      current_streak: 4,
      longest_streak: 6,
      last_session_date: "2026-04-11",
      total_sessions: 12,
      total_correct: 87,
      total_reviewed: 105,
      stats: { recall: 3, retention: 3, perception: 1, creativity: 0 },
      difficulty: "normal",
      updated_at: "2026-04-11T08:30:00.000Z",
    };
    tableState.review_logs.rows = [
      {
        user_id: "user-1",
        word_key: "lucid",
        rating: 3,
        response_time_ms: 1800,
        correct: true,
        cue_level: 0,
        retrieval_kind: "exact",
        reviewed_at: "2026-04-11T08:15:00.000Z",
      },
      {
        user_id: "user-1",
        word_key: "oblique",
        rating: 1,
        response_time_ms: 9000,
        correct: false,
        cue_level: 1,
        retrieval_kind: "failed",
        reviewed_at: "2026-04-11T08:20:00.000Z",
      },
    ];

    dbMock.words.toArray.mockResolvedValue([
      makeWord(1, "lucid"),
      makeWord(2, "oblique"),
    ]);
    dbMock.reviewLogs.toArray.mockResolvedValue([
      {
        id: 1,
        wordId: 1,
        rating: 3,
        responseTimeMs: 1800,
        correct: true,
        cueLevel: 0,
        retrievalKind: "exact",
        reviewedAt: new Date("2026-04-11T08:15:00.000Z"),
      },
    ]);

    await syncOnLogin(makeUser());

    expect(dbMock.reviewLogs.add).toHaveBeenCalledTimes(1);
    expect(dbMock.reviewLogs.add).toHaveBeenCalledWith({
      wordId: 2,
      sessionId: undefined,
      rating: 1,
      responseTimeMs: 9000,
      correct: false,
      cueLevel: 1,
      retrievalKind: "failed",
      reviewedAt: new Date("2026-04-11T08:20:00.000Z"),
    });
    expect(tableState.review_logs.upserts).toHaveLength(1);
  });

  it("merges conflicting review cards and profile progress before pushing back to cloud", async () => {
    tableState.profiles.exists = true;
    tableState.profiles.row = {
      id: "user-1",
      level: 2,
      xp: 250,
      xp_to_next_level: 300,
      hp: 70,
      max_hp: 100,
      current_streak: 3,
      longest_streak: 8,
      last_session_date: "2026-04-10",
      total_sessions: 10,
      total_correct: 75,
      total_reviewed: 90,
      stats: { recall: 2, retention: 3, perception: 1, creativity: 1 },
      difficulty: "hard",
      updated_at: "2026-04-11T09:00:00.000Z",
    };
    tableState.review_cards.rows = [
      {
        user_id: "user-1",
        word_key: "lucid",
        card: {
          due: new Date("2026-04-20T12:00:00.000Z"),
          stability: 4,
          difficulty: 5,
          elapsed_days: 1,
          scheduled_days: 10,
          reps: 4,
          lapses: 0,
          state: 2,
          learning_steps: 0,
          last_review: new Date("2026-04-10T12:00:00.000Z"),
        },
        updated_at: "2026-04-11T09:00:00.000Z",
      },
    ];

    dbMock.words.toArray.mockResolvedValue([makeWord(1, "lucid")]);
    dbMock.reviewCards.toArray
      .mockResolvedValueOnce([
        {
          id: 7,
          wordId: 1,
          card: {
            due: new Date("2026-04-12T12:00:00.000Z"),
            stability: 2,
            difficulty: 4,
            elapsed_days: 1,
            scheduled_days: 2,
            reps: 2,
            lapses: 0,
            state: 2,
            learning_steps: 0,
            last_review: new Date("2026-04-09T12:00:00.000Z"),
          },
          updatedAt: "2026-04-10T09:00:00.000Z",
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 7,
          wordId: 1,
          card: {
            due: new Date("2026-04-20T12:00:00.000Z"),
            stability: 4,
            difficulty: 5,
            elapsed_days: 1,
            scheduled_days: 10,
            reps: 4,
            lapses: 0,
            state: 2,
            learning_steps: 0,
            last_review: new Date("2026-04-10T12:00:00.000Z"),
          },
          updatedAt: "2026-04-11T09:00:00.000Z",
        },
      ]);
    getOrCreateProfileMock.mockResolvedValue(
      makeUserProfile({
        level: 3,
        xp: 120,
        xpToNextLevel: 450,
        hp: 90,
        currentStreak: 4,
        longestStreak: 6,
        lastSessionDate: "2026-04-11",
        totalSessions: 12,
        totalCorrect: 87,
        totalReviewed: 105,
        stats: { recall: 3, retention: 3, perception: 1, creativity: 0 },
        difficulty: "normal",
        updatedAt: "2026-04-11T08:30:00.000Z",
      }),
    );

    await syncOnLogin(makeUser());

    expect(dbMock.reviewCards.update).toHaveBeenCalledWith(
      7,
      expect.objectContaining({
        wordId: 1,
        updatedAt: "2026-04-11T09:00:00.000Z",
      }),
    );
    expect(dbMock.userProfile.put).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 3,
        xp: 120,
        hp: 70,
        totalSessions: 12,
        totalCorrect: 87,
        totalReviewed: 105,
        longestStreak: 8,
        difficulty: "hard",
      }),
    );
    expect(tableState.review_cards.upserts[0]).toEqual({
      rows: [
        expect.objectContaining({
          user_id: "user-1",
          word_key: "lucid",
          updated_at: "2026-04-11T09:00:00.000Z",
        }),
      ],
      options: { onConflict: "user_id,word_key" },
    });
    expect(tableState.profiles.upserts[0]).toEqual({
      rows: expect.objectContaining({
        id: "user-1",
        level: 3,
        xp: 120,
        total_sessions: 12,
        total_correct: 87,
        total_reviewed: 105,
        difficulty: "hard",
        updated_at: "2026-04-11T09:00:00.000Z",
      }),
      options: undefined,
    });
  });

  it("keeps same-day work from both devices by using merged review-log session ids", async () => {
    tableState.profiles.exists = true;
    tableState.profiles.row = {
      id: "user-1",
      level: 3,
      xp: 118,
      xp_to_next_level: 300,
      hp: 82,
      max_hp: 100,
      current_streak: 5,
      longest_streak: 6,
      last_session_date: "2026-04-11",
      total_sessions: 3,
      total_correct: 7,
      total_reviewed: 8,
      stats: { recall: 3, retention: 2, perception: 1, creativity: 0 },
      difficulty: "hard",
      updated_at: "2026-04-11T18:00:00.000Z",
    };
    tableState.review_logs.rows = [
      {
        user_id: "user-1",
        word_key: "word-11",
        session_id: "session-remote",
        rating: 3,
        response_time_ms: 1200,
        correct: true,
        reviewed_at: "2026-04-11T18:10:00.000Z",
      },
    ];

    dbMock.words.toArray.mockResolvedValue(
      Array.from({ length: 11 }, (_, index) => makeWord(index + 1, `word-${index + 1}`)),
    );
    dbMock.reviewCards.toArray.mockResolvedValue([]);

    const localLogs = [
      makeReviewLog(1, "2026-04-11T08:00:00.000Z", true, "session-local"),
      makeReviewLog(2, "2026-04-11T08:01:00.000Z", true, "session-local"),
      makeReviewLog(3, "2026-04-11T08:02:00.000Z", true, "session-local"),
      makeReviewLog(4, "2026-04-11T08:03:00.000Z", true, "session-local"),
      makeReviewLog(5, "2026-04-11T08:04:00.000Z", true, "session-local"),
      makeReviewLog(6, "2026-04-11T08:05:00.000Z", true, "session-local"),
      makeReviewLog(7, "2026-04-11T08:06:00.000Z", true, "session-local"),
      makeReviewLog(8, "2026-04-11T08:07:00.000Z", true, "session-local"),
      makeReviewLog(9, "2026-04-11T08:08:00.000Z", false, "session-local"),
      makeReviewLog(10, "2026-04-11T08:09:00.000Z", false, "session-local"),
    ];
    dbMock.reviewLogs.toArray.mockImplementation(async () => localLogs);
    dbMock.reviewLogs.add.mockImplementation(async (log) => {
      localLogs.push({
        id: localLogs.length + 1,
        wordId: log.wordId,
        sessionId: log.sessionId,
        rating: log.rating,
        responseTimeMs: log.responseTimeMs,
        correct: log.correct,
        reviewedAt: log.reviewedAt,
      });
      return localLogs.length;
    });
    getOrCreateProfileMock.mockResolvedValue(
      makeUserProfile({
        xp: 120,
        xpToNextLevel: 300,
        hp: 90,
        currentStreak: 5,
        longestStreak: 5,
        lastSessionDate: "2026-04-11",
        totalSessions: 4,
        totalCorrect: 8,
        totalReviewed: 10,
        updatedAt: "2026-04-11T16:00:00.000Z",
      }),
    );

    await syncOnLogin(makeUser());

    expect(dbMock.userProfile.put).toHaveBeenCalledWith(
      expect.objectContaining({
        totalSessions: 5,
        totalCorrect: 9,
        totalReviewed: 11,
        currentStreak: 5,
        longestStreak: 6,
        difficulty: "hard",
      }),
    );
    expect(tableState.profiles.upserts[0]).toEqual({
      rows: expect.objectContaining({
        id: "user-1",
        total_sessions: 5,
        total_correct: 9,
        total_reviewed: 11,
        difficulty: "hard",
      }),
      options: undefined,
    });
  });
});
