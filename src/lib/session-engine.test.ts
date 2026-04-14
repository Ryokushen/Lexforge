import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReviewCard, ReviewLog, SessionWord, Word } from "./types";

const dbMock = vi.hoisted(() => ({
  reviewLogs: {
    add: vi.fn(),
    toArray: vi.fn(),
  },
  words: {
    get: vi.fn(),
  },
}));

const schedulerMock = vi.hoisted(() => ({
  getDueCards: vi.fn(),
  getNewCards: vi.fn(),
  gradeCard: vi.fn(),
  Rating: {
    Again: 1,
    Hard: 2,
    Good: 3,
    Easy: 4,
  },
}));

const completeSessionMock = vi.hoisted(() => vi.fn());

vi.mock("./db", () => ({
  db: dbMock,
}));

vi.mock("./scheduler", () => schedulerMock);

vi.mock("./gamification", () => ({
  completeSession: completeSessionMock,
}));

import {
  autoGrade,
  createSessionId,
  finalizeSession,
  getAvailableNewCount,
  getUnlockedTiers,
  gradeContextAnswer,
  gradeSpeedAnswer,
  loadSessionWords,
  pickMode,
  processAnswer,
} from "./session-engine";

function makeWord(
  id: number,
  tier: Word["tier"] = 1,
  totCapture?: Word["totCapture"],
): Word {
  return {
    id,
    word: `word-${id}`,
    definition: `definition-${id}`,
    examples: [`example-${id}`],
    synonyms: [],
    tier,
    contextSentences: [
      {
        sentence: "A **weak** sentence.",
        weakWord: "weak",
        answer: `word-${id}`,
        distractors: ["other-1", "other-2", "other-3"],
      },
    ],
    totCapture,
    createdAt: new Date("2026-04-01T00:00:00.000Z"),
  };
}

function makeReviewCard(wordId: number, state: number = 0): ReviewCard {
  return {
    id: wordId,
    wordId,
    card: {
      due: new Date("2026-04-10T12:00:00.000Z"),
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: 0,
      lapses: 0,
      state,
      last_review: undefined,
      learning_steps: 0,
    },
  };
}

function makeSessionWord(id: number, tier: Word["tier"] = 1): SessionWord {
  return {
    word: makeWord(id, tier),
    reviewCard: makeReviewCard(id),
  };
}

function makeTodayFirstReviewLog(wordId: number): ReviewLog {
  return {
    id: wordId,
    wordId,
    rating: 3,
    responseTimeMs: 2000,
    correct: true,
    reviewedAt: new Date("2026-04-10T09:00:00.000Z"),
  };
}

function makeReviewLog(
  wordId: number,
  reviewedAt: string,
  overrides: Partial<ReviewLog> = {},
): ReviewLog {
  return {
    id: Number(`${wordId}${Date.parse(reviewedAt)}`),
    wordId,
    rating: 3,
    responseTimeMs: 2000,
    correct: true,
    cueLevel: 0,
    retrievalKind: "exact",
    reviewedAt: new Date(reviewedAt),
    ...overrides,
  };
}

describe("session engine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-10T12:00:00.000Z"));
    vi.clearAllMocks();
  });

  it("auto-grades exact, fuzzy, and wrong answers", () => {
    expect(autoGrade("lucid", "lucid")).toEqual({
      rating: 3,
      correct: true,
      cueLevel: 0,
      retrievalKind: "exact",
    });
    expect(autoGrade("lucid", "lucid", 1)).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 1,
      retrievalKind: "assisted",
    });
    expect(autoGrade("lucif", "lucid")).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 0,
      retrievalKind: "approximate",
    });
    expect(autoGrade("opaque", "lucid")).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
  });

  it("grades speed answers by correctness and response time", () => {
    expect(gradeSpeedAnswer("lucid", "lucid", 2500)).toEqual({
      rating: 4,
      correct: true,
      cueLevel: 0,
      retrievalKind: "exact",
    });
    expect(gradeSpeedAnswer("lucid", "lucid", 5000)).toEqual({
      rating: 3,
      correct: true,
      cueLevel: 0,
      retrievalKind: "exact",
    });
    expect(gradeSpeedAnswer("lucid", "lucid", 3500, 1)).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 1,
      retrievalKind: "assisted",
    });
    expect(gradeSpeedAnswer("lucif", "lucid", 2000)).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 0,
      retrievalKind: "approximate",
    });
    expect(gradeSpeedAnswer("__timeout__", "lucid", 8000)).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
  });

  it("grades context answers by retrieval quality and fallback help", () => {
    expect(gradeContextAnswer("lucid", "lucid")).toEqual({
      rating: 3,
      correct: true,
      cueLevel: 0,
      retrievalKind: "exact",
    });
    expect(gradeContextAnswer("lucid", "lucid", 1)).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 1,
      retrievalKind: "assisted",
    });
    expect(gradeContextAnswer("lucif", "lucid")).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 0,
      retrievalKind: "approximate",
    });
    expect(gradeContextAnswer("opaque", "lucid")).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
  });

  it("unlocks tiers at the configured level thresholds", () => {
    expect(getUnlockedTiers(1)).toEqual([1, "custom"]);
    expect(getUnlockedTiers(5)).toEqual([1, 2, "custom"]);
    expect(getUnlockedTiers(10)).toEqual([1, 2, 3, "custom"]);
  });

  it("matches the intended mode distribution when context is available", () => {
    const word = makeWord(1);
    const counts = {
      recall: 0,
      context: 0,
      speed: 0,
      association: 0,
    };

    for (let index = 0; index < 20000; index++) {
      counts[pickMode(word)]++;
    }

    const ratios = Object.fromEntries(
      Object.entries(counts).map(([mode, count]) => [mode, count / 20000]),
    );

    expect(ratios.association).toBeGreaterThan(0.1);
    expect(ratios.association).toBeLessThan(0.2);
    expect(ratios.speed).toBeGreaterThan(0.1);
    expect(ratios.speed).toBeLessThan(0.2);
    expect(ratios.context).toBeGreaterThan(0.25);
    expect(ratios.context).toBeLessThan(0.35);
    expect(ratios.recall).toBeGreaterThan(0.35);
    expect(ratios.recall).toBeLessThan(0.45);
  });

  it("biases TOT-captured words toward recall and rapid retrieval", () => {
    const word = makeWord(1, 1, {
      source: "speech",
      weakSubstitute: "thing",
      context: "I kept saying thing instead of the right word.",
      capturedAt: "2026-04-10T08:00:00.000Z",
      count: 2,
    });
    const counts = {
      recall: 0,
      context: 0,
      speed: 0,
      association: 0,
    };

    for (let index = 0; index < 20000; index++) {
      counts[pickMode(word)]++;
    }

    const ratios = Object.fromEntries(
      Object.entries(counts).map(([mode, count]) => [mode, count / 20000]),
    );

    expect(ratios.recall).toBeGreaterThan(0.4);
    expect(ratios.speed).toBeGreaterThan(0.3);
    expect(ratios.context).toBeLessThan(0.2);
    expect(ratios.association).toBeLessThan(0.15);
  });

  it("always grades association create prompts as Good", async () => {
    const sessionWord = makeSessionWord(1);
    const updatedCard = makeReviewCard(1);
    schedulerMock.gradeCard.mockResolvedValue(updatedCard);

    const { result } = await processAnswer(
      sessionWord,
      "any mnemonic",
      2000,
      "session-1",
      "association",
      "__create__",
    );

    expect(result).toEqual({
      wordId: 1,
      word: "word-1",
      correct: true,
      responseTimeMs: 2000,
      rating: 3,
      mode: "association",
      cueLevel: 0,
      retrievalKind: "created",
    });
    expect(schedulerMock.gradeCard).toHaveBeenCalledWith(sessionWord.reviewCard, 3);
    expect(dbMock.reviewLogs.add).toHaveBeenCalledWith(
      expect.objectContaining({
        wordId: 1,
        sessionId: "session-1",
        rating: 3,
        correct: true,
        cueLevel: 0,
        retrievalKind: "created",
      }),
    );
  });

  it("downgrades hinted recall to assisted retrieval in the review log", async () => {
    const sessionWord = makeSessionWord(1);
    const updatedCard = makeReviewCard(1);
    schedulerMock.gradeCard.mockResolvedValue(updatedCard);

    const { result } = await processAnswer(
      sessionWord,
      "word-1",
      2500,
      "session-1",
      "recall",
      undefined,
      { cueLevel: 1 },
    );

    expect(result).toEqual({
      wordId: 1,
      word: "word-1",
      correct: true,
      responseTimeMs: 2500,
      rating: 2,
      mode: "recall",
      cueLevel: 1,
      retrievalKind: "assisted",
    });
    expect(dbMock.reviewLogs.add).toHaveBeenCalledWith(
      expect.objectContaining({
        cueLevel: 1,
        retrievalKind: "assisted",
      }),
    );
  });

  it("creates a stable session id string", () => {
    const sessionId = createSessionId();

    expect(sessionId).toEqual(expect.any(String));
    expect(sessionId.length).toBeGreaterThan(8);
  });

  it("limits new words per day based on difficulty and words introduced today", async () => {
    schedulerMock.getDueCards.mockResolvedValue([makeReviewCard(1), makeReviewCard(2)]);
    schedulerMock.getNewCards.mockResolvedValue([makeReviewCard(3)]);
    dbMock.reviewLogs.toArray.mockResolvedValue(
      Array.from({ length: 9 }, (_, index) => makeTodayFirstReviewLog(index + 10)),
    );
    dbMock.words.get.mockImplementation(async (wordId: number) => makeWord(wordId));

    await loadSessionWords("normal", 1);

    expect(schedulerMock.getDueCards).toHaveBeenCalledWith(10);
    expect(schedulerMock.getNewCards).toHaveBeenCalledWith(1, [1, "custom"]);
  });

  it("does not count yesterday's introductions against today's new-word budget", async () => {
    schedulerMock.getDueCards.mockResolvedValue([makeReviewCard(1), makeReviewCard(2)]);
    schedulerMock.getNewCards.mockResolvedValue([
      makeReviewCard(3),
      makeReviewCard(4),
      makeReviewCard(5),
      makeReviewCard(6),
      makeReviewCard(7),
      makeReviewCard(8),
      makeReviewCard(9),
      makeReviewCard(10),
    ]);
    dbMock.reviewLogs.toArray.mockResolvedValue([
      {
        ...makeTodayFirstReviewLog(99),
        reviewedAt: new Date("2026-04-09T09:00:00.000Z"),
      },
    ]);
    dbMock.words.get.mockImplementation(async (wordId: number) => makeWord(wordId));

    await loadSessionWords("normal", 1);

    expect(schedulerMock.getNewCards).toHaveBeenCalledWith(8, [1, "custom"]);
  });

  it("includes due review cards even when they are above the current unlocked tier", async () => {
    schedulerMock.getDueCards.mockResolvedValue([makeReviewCard(30)]);
    schedulerMock.getNewCards.mockResolvedValue([]);
    dbMock.reviewLogs.toArray.mockResolvedValue([]);
    dbMock.words.get.mockResolvedValue(makeWord(30, 3));

    const sessionWords = await loadSessionWords("easy", 1);

    expect(sessionWords).toHaveLength(1);
    expect(sessionWords[0].word.tier).toBe(3);
    expect(schedulerMock.getNewCards).toHaveBeenCalledWith(5, [1, "custom"]);
  });

  it("prioritizes TOT-captured words within due and new buckets", async () => {
    schedulerMock.getDueCards.mockResolvedValue([
      makeReviewCard(1, 1),
      makeReviewCard(2, 1),
    ]);
    schedulerMock.getNewCards.mockResolvedValue([
      makeReviewCard(3, 0),
      makeReviewCard(4, 0),
    ]);
    dbMock.reviewLogs.toArray.mockResolvedValue([]);
    dbMock.words.get.mockImplementation(async (wordId: number) => {
      if (wordId === 2) {
        return makeWord(2, 1, {
          source: "speech",
          capturedAt: "2026-04-10T09:00:00.000Z",
          count: 1,
        });
      }

      if (wordId === 4) {
        return makeWord(4, 1, {
          source: "writing",
          capturedAt: "2026-04-10T10:00:00.000Z",
          count: 3,
        });
      }

      return makeWord(wordId);
    });

    const sessionWords = await loadSessionWords("easy", 1);

    expect(sessionWords.map((entry) => entry.word.id)).toEqual([2, 1, 4, 3]);
  });

  it("keeps recent TOT words in rescue drilling until clean exact recalls return", async () => {
    schedulerMock.getDueCards.mockResolvedValue([makeReviewCard(1, 1)]);
    schedulerMock.getNewCards.mockResolvedValue([]);
    dbMock.reviewLogs.toArray.mockResolvedValue([
      makeReviewLog(1, "2026-04-10T11:45:00.000Z", {
        rating: 1,
        correct: false,
        responseTimeMs: 5400,
        retrievalKind: "failed",
      }),
      makeReviewLog(1, "2026-04-09T08:00:00.000Z", {
        rating: 2,
        cueLevel: 1,
        responseTimeMs: 4200,
        retrievalKind: "assisted",
      }),
    ]);
    dbMock.words.get.mockResolvedValue(
      makeWord(1, 1, {
        source: "speech",
        capturedAt: "2026-04-10T07:00:00.000Z",
        count: 2,
      }),
    );

    const [sessionWord] = await loadSessionWords("easy", 1);

    expect(sessionWord.drillProfile).toMatchObject({
      stage: "rescue",
      exactStreak: 0,
      recallHintEnabled: true,
      recentFailureCount: 1,
    });
    expect(sessionWord.drillProfile?.rapidTimeoutMs).toBeGreaterThanOrEqual(4800);
    expect(sessionWord.drillProfile?.rapidCueRevealMs).not.toBeNull();
  });

  it("backs off hints after repeated clean exact recalls on a TOT word", async () => {
    schedulerMock.getDueCards.mockResolvedValue([makeReviewCard(1, 1)]);
    schedulerMock.getNewCards.mockResolvedValue([]);
    dbMock.reviewLogs.toArray.mockResolvedValue([
      makeReviewLog(1, "2026-04-10T11:45:00.000Z", {
        responseTimeMs: 1700,
      }),
      makeReviewLog(1, "2026-04-09T11:45:00.000Z", {
        responseTimeMs: 1900,
      }),
      makeReviewLog(1, "2026-04-08T11:45:00.000Z", {
        responseTimeMs: 2100,
      }),
    ]);
    dbMock.words.get.mockResolvedValue(
      makeWord(1, 1, {
        source: "speech",
        capturedAt: "2026-04-05T07:00:00.000Z",
        count: 1,
      }),
    );

    const [sessionWord] = await loadSessionWords("easy", 1);

    expect(sessionWord.drillProfile).toMatchObject({
      stage: "fluent",
      exactStreak: 3,
      recallHintEnabled: false,
      recentFailureCount: 0,
    });
    expect(sessionWord.drillProfile?.rapidTimeoutMs).toBeLessThan(5000);
    expect(sessionWord.drillProfile?.rapidCueRevealMs).toBeNull();
  });

  it("returns only the new words available today for the selected difficulty", async () => {
    schedulerMock.getNewCards.mockResolvedValue([
      makeReviewCard(1),
      makeReviewCard(2),
    ]);
    dbMock.reviewLogs.toArray.mockResolvedValue(
      Array.from({ length: 3 }, (_, index) => makeTodayFirstReviewLog(index + 10)),
    );

    const count = await getAvailableNewCount("easy", 1);

    expect(count).toBe(2);
    expect(schedulerMock.getNewCards).toHaveBeenCalledWith(2, [1, "custom"]);
  });

  it("does not backfill new words when the daily new-word budget is exhausted", async () => {
    schedulerMock.getDueCards.mockResolvedValue([makeReviewCard(1), makeReviewCard(2)]);
    schedulerMock.getNewCards.mockResolvedValue([]);
    dbMock.reviewLogs.toArray.mockResolvedValue(
      Array.from({ length: 10 }, (_, index) => makeTodayFirstReviewLog(index + 10)),
    );
    dbMock.words.get.mockImplementation(async (wordId: number) => makeWord(wordId));

    const sessionWords = await loadSessionWords("normal", 1);

    expect(sessionWords).toHaveLength(2);
    expect(sessionWords.map((entry) => entry.word.id)).toEqual([1, 2]);
    expect(schedulerMock.getNewCards).not.toHaveBeenCalled();
  });

  it("delegates session finalization to the gamification layer", async () => {
    const summary = {
      results: [makeResult()],
      totalCorrect: 1,
      totalWords: 1,
      xpEarned: 65,
      leveledUp: false,
      statGains: {},
      averageResponseTimeMs: 2000,
    };
    completeSessionMock.mockResolvedValue(summary);

    await expect(finalizeSession(summary.results)).resolves.toEqual(summary);
    expect(completeSessionMock).toHaveBeenCalledWith(summary.results);
  });
});

function makeResult() {
  return {
    wordId: 1,
    word: "word-1",
    correct: true,
    responseTimeMs: 2000,
    rating: 3 as const,
    mode: "recall" as const,
  };
}
