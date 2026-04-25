import { createEmptyCard } from "ts-fsrs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReviewCard, ReviewLog, Word } from "./types";

const dbMock = vi.hoisted(() => ({
  transaction: vi.fn(),
  words: {
    get: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  reviewCards: {
    toArray: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    add: vi.fn(),
  },
  reviewLogs: {
    toArray: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("./db", () => ({
  db: dbMock,
}));

import {
  chooseCanonicalDuplicateWord,
  chooseStrongestReviewCard,
  mergeDuplicateWords,
} from "./word-merge";

function makeWord(id: number, overrides: Partial<Word> = {}): Word {
  return {
    id,
    word: "lucid",
    definition: `definition-${id}`,
    examples: [],
    synonyms: [],
    tier: "custom",
    createdAt: new Date(`2026-04-0${id}T00:00:00.000Z`),
    ...overrides,
  };
}

function makeReviewCard(
  id: number,
  wordId: number,
  overrides: Partial<ReviewCard["card"]> = {},
): ReviewCard {
  return {
    id,
    wordId,
    card: {
      ...createEmptyCard(new Date("2026-04-10T10:00:00.000Z")),
      ...overrides,
    },
    updatedAt: "2026-04-10T10:00:00.000Z",
  };
}

function makeReviewLog(id: number, wordId: number): ReviewLog {
  return {
    id,
    wordId,
    rating: 3,
    responseTimeMs: 1000,
    correct: true,
    reviewedAt: new Date("2026-04-10T10:00:00.000Z"),
  };
}

describe("word merge helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMock.transaction.mockImplementation(
      async (
        _mode: string,
        _wordsStore: unknown,
        _cardsStore: unknown,
        _logsStore: unknown,
        callback: () => Promise<void>,
      ) => callback(),
    );
  });

  it("chooses the canonical word by strongest training progress, seeded tier, then age", () => {
    const oldestCustom = makeWord(1, {
      tier: "custom",
      createdAt: new Date("2026-04-01T00:00:00.000Z"),
    });
    const seeded = makeWord(2, {
      tier: 1,
      createdAt: new Date("2026-04-02T00:00:00.000Z"),
    });
    const progressed = makeWord(3, {
      tier: "custom",
      createdAt: new Date("2026-04-03T00:00:00.000Z"),
    });

    expect(
      chooseCanonicalDuplicateWord(
        [oldestCustom, seeded, progressed],
        [
          makeReviewCard(1, 1, { state: 0, reps: 0 }),
          makeReviewCard(2, 2, { state: 0, reps: 0 }),
          makeReviewCard(3, 3, {
            state: 2,
            reps: 3,
            last_review: new Date("2026-04-12T00:00:00.000Z"),
          }),
        ],
        [],
      ),
    ).toEqual(progressed);

    expect(
      chooseCanonicalDuplicateWord(
        [oldestCustom, seeded],
        [
          makeReviewCard(1, 1, { state: 0, reps: 0 }),
          makeReviewCard(2, 2, { state: 0, reps: 0 }),
        ],
        [],
      ),
    ).toEqual(seeded);
  });

  it("keeps the strongest review card by FSRS progress", () => {
    const newCard = makeReviewCard(1, 1, { state: 0, reps: 0 });
    const reviewCard = makeReviewCard(2, 2, {
      state: 2,
      reps: 4,
      last_review: new Date("2026-04-12T00:00:00.000Z"),
    });

    expect(chooseStrongestReviewCard([newCard, reviewCard])).toEqual(reviewCard);
  });

  it("reassigns review logs, keeps the strongest card, deletes absorbed words and weaker cards", async () => {
    const canonical = makeWord(1, { definition: "clear" });
    const duplicate = makeWord(2, { definition: "easy to understand" });
    const weakCard = makeReviewCard(11, 1, { state: 0, reps: 0 });
    const strongCard = makeReviewCard(22, 2, {
      state: 2,
      reps: 5,
      last_review: new Date("2026-04-12T00:00:00.000Z"),
    });

    dbMock.words.get.mockImplementation(async (id: number) =>
      id === 1 ? canonical : duplicate,
    );
    dbMock.reviewCards.toArray.mockResolvedValue([weakCard, strongCard]);
    dbMock.reviewLogs.toArray.mockResolvedValue([
      makeReviewLog(101, 1),
      makeReviewLog(202, 2),
    ]);

    await expect(
      mergeDuplicateWords(1, [2], "2026-04-13T00:00:00.000Z"),
    ).resolves.toMatchObject({
      canonicalId: 1,
      absorbedWordIds: [2],
      reassignedLogCount: 1,
      keptCardId: 22,
      deletedCardIds: [11],
    });

    expect(dbMock.reviewLogs.update).toHaveBeenCalledWith(202, { wordId: 1 });
    expect(dbMock.reviewCards.update).toHaveBeenCalledWith(22, { wordId: 1 });
    expect(dbMock.reviewCards.delete).toHaveBeenCalledWith(11);
    expect(dbMock.words.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ definition: "clear" }),
    );
    expect(dbMock.words.delete).toHaveBeenCalledWith(2);
    expect(dbMock.reviewCards.add).not.toHaveBeenCalled();
  });

  it("retains a duplicate card under the canonical word when the canonical has no card", async () => {
    dbMock.words.get.mockImplementation(async (id: number) => makeWord(id));
    dbMock.reviewCards.toArray.mockResolvedValue([
      makeReviewCard(22, 2, { state: 1, reps: 1 }),
    ]);
    dbMock.reviewLogs.toArray.mockResolvedValue([]);

    await mergeDuplicateWords(1, [2], "2026-04-13T00:00:00.000Z");

    expect(dbMock.reviewCards.update).toHaveBeenCalledWith(22, { wordId: 1 });
    expect(dbMock.reviewCards.delete).not.toHaveBeenCalled();
    expect(dbMock.reviewCards.add).not.toHaveBeenCalled();
  });
});
