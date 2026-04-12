import { beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "@supabase/supabase-js";
import type { ReviewCard, ReviewLog, UserProfile, Word } from "./types";

type DeviceState = {
  words: Word[];
  reviewCards: ReviewCard[];
  reviewLogs: ReviewLog[];
  profile: UserProfile;
};

const activeDevice = vi.hoisted(() => ({
  state: null as DeviceState | null,
}));

const cloudState = vi.hoisted(() => ({
  profiles: {
    exists: false,
    row: null as Record<string, unknown> | null,
  },
  review_cards: [] as Record<string, unknown>[],
  review_logs: [] as Record<string, unknown>[],
  word_associations: [] as Record<string, unknown>[],
}));

const dbMock = vi.hoisted(() => ({
  words: {
    toArray: vi.fn(async () => activeDevice.state?.words ?? []),
    update: vi.fn(async (id: number, changes: Partial<Word>) => {
      const words = activeDevice.state?.words ?? [];
      const index = words.findIndex((word) => word.id === id);
      if (index === -1) return 0;
      words[index] = { ...words[index], ...changes };
      return 1;
    }),
  },
  reviewCards: {
    toArray: vi.fn(async () => activeDevice.state?.reviewCards ?? []),
    add: vi.fn(async (card: ReviewCard) => {
      const cards = activeDevice.state?.reviewCards ?? [];
      const id = card.id ?? cards.length + 1;
      cards.push({ ...card, id });
      return id;
    }),
    update: vi.fn(async (id: number, changes: Partial<ReviewCard> | ReviewCard) => {
      const cards = activeDevice.state?.reviewCards ?? [];
      const index = cards.findIndex((card) => card.id === id);
      if (index === -1) return 0;
      cards[index] = { ...cards[index], ...changes };
      return 1;
    }),
  },
  reviewLogs: {
    toArray: vi.fn(async () => activeDevice.state?.reviewLogs ?? []),
    add: vi.fn(async (log: ReviewLog) => {
      const logs = activeDevice.state?.reviewLogs ?? [];
      const id = log.id ?? logs.length + 1;
      logs.push({ ...log, id });
      return id;
    }),
  },
  userProfile: {
    put: vi.fn(async (profile: UserProfile) => {
      if (activeDevice.state) {
        activeDevice.state.profile = profile;
      }
      return profile.id;
    }),
  },
}));

const getOrCreateProfileMock = vi.hoisted(
  () => vi.fn(async () => activeDevice.state!.profile),
);

function makeSelectResult(response: { data: unknown; error: unknown }) {
  return {
    then(resolve: (value: { data: unknown; error: unknown }) => unknown) {
      return Promise.resolve(response).then(resolve);
    },
  };
}

function upsertCloudRows(
  rows: Record<string, unknown>[],
  cloudRows: Record<string, unknown>[],
  keyBuilder: (row: Record<string, unknown>) => string,
) {
  for (const row of rows) {
    const key = keyBuilder(row);
    const existingIndex = cloudRows.findIndex((candidate) => keyBuilder(candidate) === key);
    if (existingIndex >= 0) {
      cloudRows[existingIndex] = { ...cloudRows[existingIndex], ...row };
    } else {
      cloudRows.push({ ...row });
    }
  }
}

vi.mock("./db", () => ({
  db: dbMock,
  getOrCreateProfile: getOrCreateProfileMock,
}));

vi.mock("./supabase", () => ({
  supabase: {
    from: vi.fn((table: keyof typeof cloudState) => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => {
          if (table === "profiles") {
            return makeSelectResult({
              data: cloudState.profiles.exists && cloudState.profiles.row
                ? [cloudState.profiles.row]
                : [],
              error: null,
            });
          }

          return makeSelectResult({
            data: cloudState[table],
            error: null,
          });
        }),
      })),
      upsert: vi.fn(async (rows: unknown) => {
        if (table === "profiles") {
          cloudState.profiles.exists = true;
          cloudState.profiles.row = { ...(rows as Record<string, unknown>) };
          return { error: null };
        }

        const normalizedRows = Array.isArray(rows) ? rows as Record<string, unknown>[] : [rows as Record<string, unknown>];
        if (table === "review_cards") {
          upsertCloudRows(
            normalizedRows,
            cloudState.review_cards,
            (row) => `${row.user_id}:${row.word_key}`,
          );
        } else if (table === "review_logs") {
          upsertCloudRows(
            normalizedRows,
            cloudState.review_logs,
            (row) => `${row.user_id}:${row.word_key}:${row.reviewed_at}`,
          );
        } else if (table === "word_associations") {
          upsertCloudRows(
            normalizedRows,
            cloudState.word_associations,
            (row) => `${row.user_id}:${row.word_key}`,
          );
        }

        return { error: null };
      }),
    })),
  },
}));

import { pushToCloud, syncOnLogin } from "./sync";

function makeUser(): User {
  return { id: "user-1" } as User;
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

function makeCard(
  id: number,
  wordId: number,
  reviewedAt: string,
  updatedAt: string,
): ReviewCard {
  return {
    id,
    wordId,
    card: {
      due: new Date(reviewedAt),
      stability: 2,
      difficulty: 4,
      elapsed_days: 1,
      scheduled_days: 2,
      reps: 2,
      lapses: 0,
      state: 2,
      learning_steps: 0,
      last_review: new Date(reviewedAt),
    },
    updatedAt,
  };
}

function makeLog(
  id: number,
  wordId: number,
  reviewedAt: string,
  correct: boolean,
  sessionId: string,
): ReviewLog {
  return {
    id,
    wordId,
    sessionId,
    rating: correct ? 3 : 1,
    responseTimeMs: correct ? 1500 : 7000,
    correct,
    reviewedAt: new Date(reviewedAt),
  };
}

function makeProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: 1,
    level: 2,
    xp: 80,
    xpToNextLevel: 300,
    hp: 85,
    maxHp: 100,
    currentStreak: 2,
    longestStreak: 2,
    lastSessionDate: "2026-04-11",
    totalSessions: 1,
    totalCorrect: 2,
    totalReviewed: 3,
    stats: { recall: 2, retention: 1, perception: 0, creativity: 0 },
    difficulty: "normal",
    updatedAt: "2026-04-11T09:10:00.000Z",
    ...overrides,
  };
}

describe("sync integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    activeDevice.state = null;
    cloudState.profiles.exists = false;
    cloudState.profiles.row = null;
    cloudState.review_cards = [];
    cloudState.review_logs = [];
    cloudState.word_associations = [];
  });

  it("pushes device A progress to cloud, then lets device B merge and continue without losing distinct sessions", async () => {
    const sharedWords = [
      makeWord(1, "lucid"),
      makeWord(2, "oblique"),
      makeWord(3, "resolute"),
      makeWord(4, "tactile"),
    ];

    activeDevice.state = {
      words: sharedWords,
      reviewCards: [
        makeCard(1, 1, "2026-04-11T08:10:00.000Z", "2026-04-11T08:10:00.000Z"),
        makeCard(2, 2, "2026-04-11T08:12:00.000Z", "2026-04-11T08:12:00.000Z"),
      ],
      reviewLogs: [
        makeLog(1, 1, "2026-04-11T08:10:00.000Z", true, "device-a-session"),
        makeLog(2, 2, "2026-04-11T08:12:00.000Z", false, "device-a-session"),
        makeLog(3, 3, "2026-04-11T08:14:00.000Z", true, "device-a-session"),
      ],
      profile: makeProfile(),
    };

    await pushToCloud(makeUser());

    expect(cloudState.review_logs).toHaveLength(3);
    expect(
      new Set(cloudState.review_logs.map((row) => row.session_id)),
    ).toEqual(new Set(["device-a-session"]));

    activeDevice.state = {
      words: sharedWords,
      reviewCards: [
        makeCard(4, 4, "2026-04-11T18:05:00.000Z", "2026-04-11T18:05:00.000Z"),
      ],
      reviewLogs: [
        makeLog(4, 4, "2026-04-11T18:05:00.000Z", true, "device-b-session"),
      ],
      profile: makeProfile({
        xp: 95,
        hp: 92,
        totalSessions: 1,
        totalCorrect: 1,
        totalReviewed: 1,
        difficulty: "hard",
        updatedAt: "2026-04-11T18:10:00.000Z",
      }),
    };

    await syncOnLogin(makeUser());

    expect(activeDevice.state.reviewLogs).toHaveLength(4);
    expect(
      new Set(activeDevice.state.reviewLogs.map((log) => log.sessionId)),
    ).toEqual(new Set(["device-a-session", "device-b-session"]));
    expect(activeDevice.state.reviewCards).toHaveLength(3);
    expect(activeDevice.state.profile).toEqual(
      expect.objectContaining({
        xp: 95,
        hp: 92,
        difficulty: "hard",
        totalSessions: 2,
        totalCorrect: 3,
        totalReviewed: 4,
      }),
    );
    expect(cloudState.profiles.row).toEqual(
      expect.objectContaining({
        total_sessions: 2,
        total_correct: 3,
        total_reviewed: 4,
        difficulty: "hard",
      }),
    );
    expect(cloudState.review_logs).toHaveLength(4);
    expect(
      new Set(cloudState.review_logs.map((row) => row.session_id)),
    ).toEqual(new Set(["device-a-session", "device-b-session"]));
  });
});
