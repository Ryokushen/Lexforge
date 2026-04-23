import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReviewLog, SeedWord, Word } from "./types";

const dbMock = vi.hoisted(() => ({
  words: {
    toArray: vi.fn(),
    update: vi.fn(),
  },
  reviewLogs: {
    toArray: vi.fn(),
  },
}));

const addWordWithCardMock = vi.hoisted(() => vi.fn());

const seedWordsMock = vi.hoisted<SeedWord[]>(() => [
  {
    word: "lucid",
    definition: "clear and easy to understand",
    examples: ["A lucid explanation."],
    synonyms: ["clear"],
    tier: 1,
  },
  {
    word: "tenuous",
    definition: "very weak or slight",
    examples: ["A tenuous link."],
    synonyms: ["fragile"],
    tier: 2,
  },
  {
    word: "recondite",
    definition: "difficult to understand; obscure",
    examples: ["A recondite treatise."],
    synonyms: ["obscure"],
    tier: 4,
  },
]);

vi.mock("./db", () => ({
  db: dbMock,
}));

vi.mock("./scheduler", () => ({
  addWordWithCard: addWordWithCardMock,
}));

vi.mock("./seed-words", () => ({
  SEED_WORDS: seedWordsMock,
}));

import { seedDatabase } from "./seed";

function makeExistingWord(
  word: string,
  overrides: Partial<Word> = {},
): Word {
  return {
    id: 1,
    word,
    definition: `${word} definition`,
    examples: [],
    synonyms: [],
    tier: 1,
    pipelineStage: "queued",
    createdAt: new Date("2026-04-01T00:00:00.000Z"),
    ...overrides,
  };
}

function makeLog(overrides: Partial<ReviewLog> = {}): ReviewLog {
  return {
    id: 1,
    wordId: 1,
    rating: 3,
    responseTimeMs: 1500,
    correct: true,
    cueLevel: 0,
    retrievalKind: "exact",
    reviewedAt: new Date("2026-04-10T12:00:00.000Z"),
    ...overrides,
  };
}

describe("seed database", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMock.reviewLogs.toArray.mockResolvedValue([]);
  });

  it("adds only missing seed words and leaves existing progress alone", async () => {
    dbMock.words.toArray.mockResolvedValue([
      makeExistingWord("lucid"),
      makeExistingWord("recondite", { id: 13, tier: 4 }),
    ]);

    await seedDatabase();

    expect(addWordWithCardMock).toHaveBeenCalledTimes(1);
    expect(addWordWithCardMock).toHaveBeenCalledWith(
      expect.objectContaining({
        word: "tenuous",
        tier: 2,
        association: undefined,
        pipelineStage: "queued",
        pipelineUpdatedAt: expect.any(String),
      }),
    );
    expect(dbMock.words.update).not.toHaveBeenCalled();
  });

  it("reconciles tier on existing non-custom words when seed tier changed", async () => {
    dbMock.words.toArray.mockResolvedValue([
      makeExistingWord("lucid", { id: 11, tier: 2 }),
      makeExistingWord("tenuous", { id: 12, tier: 1 }),
      makeExistingWord("recondite", { id: 13, tier: 3 }),
    ]);

    await seedDatabase();

    expect(addWordWithCardMock).not.toHaveBeenCalled();
    expect(dbMock.words.update).toHaveBeenCalledTimes(3);
    expect(dbMock.words.update).toHaveBeenCalledWith(11, { tier: 1 });
    expect(dbMock.words.update).toHaveBeenCalledWith(12, { tier: 2 });
    expect(dbMock.words.update).toHaveBeenCalledWith(13, { tier: 4 });
  });

  it("leaves custom words and unchanged tiers untouched", async () => {
    dbMock.words.toArray.mockResolvedValue([
      makeExistingWord("lucid", { id: 21, tier: 1 }),
      makeExistingWord("tenuous", { id: 22, tier: 2 }),
      makeExistingWord("recondite", { id: 24, tier: 4 }),
      makeExistingWord("mytag", { id: 23, tier: "custom" }),
    ]);

    await seedDatabase();

    expect(dbMock.words.update).not.toHaveBeenCalled();
    expect(addWordWithCardMock).not.toHaveBeenCalled();
  });

  it("backfills missing pipeline stage for existing words without changing existing stages", async () => {
    dbMock.words.toArray.mockResolvedValue([
      makeExistingWord("lucid", { id: 11, pipelineStage: undefined }),
      makeExistingWord("tenuous", {
        id: 12,
        tier: 2,
        pipelineStage: "productive",
      }),
      makeExistingWord("recondite", {
        id: 13,
        tier: 4,
        pipelineStage: undefined,
        totCapture: {
          source: "speech",
          capturedAt: "2026-04-10T12:00:00.000Z",
          count: 1,
        },
      }),
    ]);

    await seedDatabase();

    expect(dbMock.words.update).toHaveBeenCalledWith(11, {
      pipelineStage: "queued",
      pipelineUpdatedAt: expect.any(String),
    });
    expect(dbMock.words.update).toHaveBeenCalledWith(13, {
      pipelineStage: "captured",
      pipelineUpdatedAt: expect.any(String),
    });
    expect(dbMock.words.update).not.toHaveBeenCalledWith(
      12,
      expect.objectContaining({ pipelineStage: expect.any(String) }),
    );
  });

  it("uses review history when backfilling missing pipeline stage", async () => {
    dbMock.words.toArray.mockResolvedValue([
      makeExistingWord("lucid", { id: 11, pipelineStage: undefined }),
    ]);
    dbMock.reviewLogs.toArray.mockResolvedValue([
      makeLog({ wordId: 11, retrievalKind: "exact", correct: true }),
    ]);

    await seedDatabase();

    expect(dbMock.words.update).toHaveBeenCalledWith(11, {
      pipelineStage: "reviewing",
      pipelineUpdatedAt: expect.any(String),
    });
  });
});
