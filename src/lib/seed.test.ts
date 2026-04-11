import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SeedWord, Word } from "./types";

const dbMock = vi.hoisted(() => ({
  words: {
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

function makeExistingWord(word: string): Word {
  return {
    id: 1,
    word,
    definition: `${word} definition`,
    examples: [],
    synonyms: [],
    tier: 1,
    createdAt: new Date("2026-04-01T00:00:00.000Z"),
  };
}

describe("seed database", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds only missing seed words and leaves existing progress alone", async () => {
    dbMock.words.toArray.mockResolvedValue([makeExistingWord("lucid")]);

    await seedDatabase();

    expect(addWordWithCardMock).toHaveBeenCalledTimes(1);
    expect(addWordWithCardMock).toHaveBeenCalledWith(
      expect.objectContaining({
        word: "tenuous",
        tier: 2,
        association: undefined,
      }),
    );
  });
});
