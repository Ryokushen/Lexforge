import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SEED_WORDS } from "./seed-words";

function parseCanonicalPhaseByWord(): Map<string, number> {
  const csv = readFileSync(
    join(process.cwd(), "docs", "seed-curriculum-ranking.csv"),
    "utf8",
  ).trim();

  const [headerLine, ...lines] = csv.split(/\r?\n/);
  const headers = headerLine.split(",");
  const wordIndex = headers.indexOf("word");
  const phaseIndex = headers.indexOf("canonical_phase");

  return new Map(
    lines.map((line) => {
      const values = line.split(",");
      return [values[wordIndex], Number(values[phaseIndex])];
    }),
  );
}

describe("seed word curriculum alignment", () => {
  it("ships the full canonical 700-word curriculum", () => {
    const phaseByWord = parseCanonicalPhaseByWord();
    const shippedWords = new Set(SEED_WORDS.map((seed) => seed.word));
    const missingWords = [...phaseByWord.keys()].filter((word) => !shippedWords.has(word));

    expect(SEED_WORDS).toHaveLength(phaseByWord.size);
    expect(missingWords).toEqual([]);
  });

  it("keeps every shipped seed word aligned with the canonical curriculum phase", () => {
    const phaseByWord = parseCanonicalPhaseByWord();

    const mismatches = SEED_WORDS
      .filter((seed) => phaseByWord.get(seed.word) !== seed.tier)
      .map((seed) => ({
        word: seed.word,
        expected: phaseByWord.get(seed.word),
        received: seed.tier,
      }));

    expect(mismatches).toEqual([]);
  });
});
