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
  finalizeSession,
  getSpeedChoices,
  getUnlockedTiers,
  gradeSpeedAnswer,
  loadSessionWords,
  pickMode,
  processAnswer,
} from "./session-engine";

function makeWord(id: number, tier: Word["tier"] = 1): Word {
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
    createdAt: new Date("2026-04-01T00:00:00.000Z"),
  };
}

function makeReviewCard(wordId: number): ReviewCard {
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
      state: 0,
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

describe("session engine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-10T12:00:00.000Z"));
    vi.clearAllMocks();
  });

  it("auto-grades exact, fuzzy, and wrong answers", () => {
    expect(autoGrade("lucid", "lucid")).toEqual({ rating: 3, correct: true });
    expect(autoGrade("lucif", "lucid")).toEqual({ rating: 2, correct: true });
    expect(autoGrade("opaque", "lucid")).toEqual({ rating: 1, correct: false });
  });

  it("grades speed answers by correctness and response time", () => {
    expect(gradeSpeedAnswer("lucid", "lucid", 2500)).toEqual({
      rating: 4,
      correct: true,
    });
    expect(gradeSpeedAnswer("lucid", "lucid", 5000)).toEqual({
      rating: 3,
      correct: true,
    });
    expect(gradeSpeedAnswer("__timeout__", "lucid", 8000)).toEqual({
      rating: 1,
      correct: false,
    });
  });

  it("returns four speed choices including the correct definition", () => {
    const words = [1, 2, 3, 4, 5].map((id) => makeSessionWord(id));

    const choices = getSpeedChoices(words[0].word, words);

    expect(choices.correctDefinition).toBe("definition-1");
    expect(choices.definitions).toHaveLength(4);
    expect(new Set(choices.definitions).size).toBe(4);
    expect(choices.definitions).toContain("definition-1");
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

  it("always grades association create prompts as Good", async () => {
    const sessionWord = makeSessionWord(1);
    const updatedCard = makeReviewCard(1);
    schedulerMock.gradeCard.mockResolvedValue(updatedCard);

    const { result } = await processAnswer(
      sessionWord,
      "any mnemonic",
      2000,
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
    });
    expect(schedulerMock.gradeCard).toHaveBeenCalledWith(sessionWord.reviewCard, 3);
    expect(dbMock.reviewLogs.add).toHaveBeenCalledWith(
      expect.objectContaining({ wordId: 1, rating: 3, correct: true }),
    );
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
