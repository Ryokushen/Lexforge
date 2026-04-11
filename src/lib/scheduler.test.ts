import { createEmptyCard } from "ts-fsrs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReviewCard, Word } from "./types";

const dbMock = vi.hoisted(() => ({
  reviewCards: {
    add: vi.fn(),
    put: vi.fn(),
    toArray: vi.fn(),
  },
  words: {
    toArray: vi.fn(),
  },
}));

vi.mock("./db", () => ({
  db: dbMock,
}));

import { Rating, createReviewCard, getDueCards, getNewCards, gradeCard } from "./scheduler";

function makeReviewCard({
  wordId,
  due,
  state = 0,
}: {
  wordId: number;
  due: string;
  state?: number;
}): ReviewCard {
  return {
    id: wordId,
    wordId,
    card: {
      ...createEmptyCard(new Date(due)),
      due: new Date(due),
      state,
    },
  };
}

function makeWord(id: number, tier: Word["tier"]): Word {
  return {
    id,
    word: `word-${id}`,
    definition: `definition-${id}`,
    examples: [],
    synonyms: [],
    tier,
    createdAt: new Date("2026-04-01T00:00:00.000Z"),
  };
}

describe("scheduler", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-10T12:00:00.000Z"));
    vi.clearAllMocks();
  });

  it("creates a review card and persists it", async () => {
    dbMock.reviewCards.add.mockResolvedValue(42);

    const reviewCard = await createReviewCard(7);

    expect(dbMock.reviewCards.add).toHaveBeenCalledTimes(1);
    expect(reviewCard.id).toBe(42);
    expect(reviewCard.wordId).toBe(7);
    expect(reviewCard.card.state).toBe(0);
  });

  it("grades cards into increasing due windows for Again, Hard, Good, and Easy", async () => {
    const reviewCard = makeReviewCard({
      wordId: 1,
      due: "2026-04-10T12:00:00.000Z",
    });

    const again = await gradeCard(reviewCard, Rating.Again);
    const hard = await gradeCard(reviewCard, Rating.Hard);
    const good = await gradeCard(reviewCard, Rating.Good);
    const easy = await gradeCard(reviewCard, Rating.Easy);

    const dueTimes = [again, hard, good, easy].map((card) =>
      new Date(card.card.due).getTime(),
    );

    expect(dueTimes).toEqual([...dueTimes].sort((left, right) => left - right));
    expect(again.card.state).toBe(1);
    expect(hard.card.state).toBe(1);
    expect(good.card.state).toBe(1);
    expect(easy.card.state).toBe(2);
    expect(dbMock.reviewCards.put).toHaveBeenCalledTimes(4);
  });

  it("returns only due cards sorted by urgency", async () => {
    dbMock.reviewCards.toArray.mockResolvedValue([
      makeReviewCard({ wordId: 1, due: "2026-04-10T11:50:00.000Z" }),
      makeReviewCard({ wordId: 2, due: "2026-04-10T11:30:00.000Z" }),
      makeReviewCard({ wordId: 3, due: "2026-04-10T13:00:00.000Z" }),
      makeReviewCard({ wordId: 4, due: "2026-04-10T11:55:00.000Z" }),
    ]);

    const dueCards = await getDueCards(2);

    expect(dueCards.map((card) => card.wordId)).toEqual([2, 1]);
  });

  it("filters new cards by unlocked tiers and respects the requested limit", async () => {
    dbMock.reviewCards.toArray.mockResolvedValue([
      makeReviewCard({ wordId: 1, due: "2026-04-10T10:00:00.000Z", state: 0 }),
      makeReviewCard({ wordId: 2, due: "2026-04-10T10:00:00.000Z", state: 0 }),
      makeReviewCard({ wordId: 3, due: "2026-04-10T10:00:00.000Z", state: 0 }),
      makeReviewCard({ wordId: 4, due: "2026-04-10T10:00:00.000Z", state: 2 }),
    ]);
    dbMock.words.toArray.mockResolvedValue([
      makeWord(1, 1),
      makeWord(2, 2),
      makeWord(3, "custom"),
      makeWord(4, 3),
    ]);

    const newCards = await getNewCards(2, [1, "custom"]);

    expect(newCards.map((card) => card.wordId)).toEqual([1, 3]);
  });
});
