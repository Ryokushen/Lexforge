import { describe, expect, it } from "vitest";
import type { TOTCapture, Word } from "@/lib/types";
import { buildTierFilterLayout, buildWordGroups } from "./page.helpers";

function makeCapture(count: number): TOTCapture {
  return {
    source: "speech",
    capturedAt: "2026-04-10T09:00:00.000Z",
    count,
  };
}

function makeWord(
  id: number,
  tier: Word["tier"],
  overrides: Partial<Word> = {},
): Word {
  return {
    id,
    word: `word-${id}`,
    definition: `definition-${id}`,
    examples: [],
    synonyms: [],
    tier,
    createdAt: new Date("2026-04-01T00:00:00.000Z"),
    ...overrides,
  };
}

describe("buildTierFilterLayout", () => {
  it("keeps all phase filters reachable on narrow screens via horizontal scrolling", () => {
    const layout = buildTierFilterLayout();

    expect(layout.viewportClassName).toContain("max-w-full");
    expect(layout.viewportClassName).toContain("overflow-x-auto");
    expect(layout.stripClassName).toContain("inline-flex");
    expect(layout.stripClassName).toContain("min-w-max");
  });
});

describe("buildWordGroups", () => {
  it("keeps locked seeded phases hidden while surfacing tracked TOT words", () => {
    const groups = buildWordGroups(
      [
        makeWord(1, 1),
        makeWord(2, 4),
        makeWord(3, 4, { totCapture: makeCapture(1) }),
        makeWord(4, 4, { totCapture: makeCapture(3) }),
        makeWord(5, "custom", { totCapture: makeCapture(2) }),
      ],
      1,
    );

    const phaseFour = groups.find((group) => group.tier === "4");
    const custom = groups.find((group) => group.tier === "custom");

    expect(phaseFour).toMatchObject({
      tier: "4",
      isLocked: true,
      unlockLevel: 15,
      hiddenLockedCount: 1,
    });
    expect(phaseFour?.words).toEqual([]);
    expect(phaseFour?.trackedLockedWords.map((word) => word.word)).toEqual([
      "word-3",
      "word-4",
    ]);

    expect(custom).toMatchObject({
      tier: "custom",
      isLocked: false,
      hiddenLockedCount: 0,
    });
    expect(custom?.words.map((word) => word.word)).toEqual(["word-5"]);
    expect(custom?.trackedLockedWords).toEqual([]);
  });

  it("returns unlocked phases as normal word lists without siphoning tracked words out", () => {
    const groups = buildWordGroups(
      [
        makeWord(1, 2, { totCapture: makeCapture(2) }),
        makeWord(2, 2),
      ],
      5,
    );

    const phaseTwo = groups.find((group) => group.tier === "2");

    expect(phaseTwo).toMatchObject({
      tier: "2",
      isLocked: false,
      unlockLevel: 5,
      hiddenLockedCount: 0,
    });
    expect(phaseTwo?.words.map((word) => word.word)).toEqual([
      "word-1",
      "word-2",
    ]);
    expect(phaseTwo?.trackedLockedWords).toEqual([]);
  });
});
