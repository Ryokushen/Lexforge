import { describe, expect, it } from "vitest";
import type { TOTCapture, Word } from "@/lib/types";
import {
  buildTierFilterLayout,
  buildWordGroups,
  filterWordsForLibraryView,
  getArchiveCount,
  getInboxCount,
  getWordLibraryPipelineStage,
} from "./page.helpers";

function makeCapture(
  count: number,
  overrides: Partial<TOTCapture> = {},
): TOTCapture {
  return {
    source: "speech",
    capturedAt: "2026-04-10T09:00:00.000Z",
    count,
    ...overrides,
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

describe("getWordLibraryPipelineStage", () => {
  it("uses explicit pipeline stages before TOT or queued fallbacks", () => {
    expect(
      getWordLibraryPipelineStage(
        makeWord(1, 1, {
          pipelineStage: "productive",
          totCapture: makeCapture(1),
        }),
      ),
    ).toBe("productive");
  });

  it("falls back to captured for TOT words and queued for normal words", () => {
    expect(
      getWordLibraryPipelineStage(makeWord(1, 1, { totCapture: makeCapture(1) })),
    ).toBe("captured");
    expect(getWordLibraryPipelineStage(makeWord(2, 1))).toBe("queued");
  });
});

describe("inbox helpers", () => {
  it("counts only pending capture words", () => {
    expect(
      getInboxCount([
        makeWord(1, 1, { totCapture: makeCapture(1) }),
        makeWord(2, 1, {
          totCapture: makeCapture(1, { triageStatus: "accepted" }),
        }),
        makeWord(3, 1, {
          totCapture: makeCapture(1, { triageStatus: "archived" }),
        }),
        makeWord(4, 1),
      ]),
    ).toBe(1);
  });

  it("filters the inbox to pending captures before search", () => {
    const pending = makeWord(1, 1, {
      word: "meticulous",
      definition: "careful",
      totCapture: makeCapture(1, { context: "inspection meeting" }),
    });
    const accepted = makeWord(2, 1, {
      word: "lucid",
      definition: "clear",
      totCapture: makeCapture(1, { triageStatus: "accepted" }),
    });

    expect(
      filterWordsForLibraryView([pending, accepted], "inbox", "").map(
        (word) => word.word,
      ),
    ).toEqual(["meticulous"]);
    expect(
      filterWordsForLibraryView([pending, accepted], "inbox", "inspection"),
    ).toEqual([pending]);
    expect(
      filterWordsForLibraryView([pending, accepted], "inbox", "lucid"),
    ).toEqual([]);
  });
});

describe("archive helpers", () => {
  it("counts only archived capture words", () => {
    expect(
      getArchiveCount([
        makeWord(1, 1, { totCapture: makeCapture(1) }),
        makeWord(2, 1, {
          totCapture: makeCapture(1, { triageStatus: "accepted" }),
        }),
        makeWord(3, 1, {
          totCapture: makeCapture(1, { triageStatus: "archived" }),
        }),
        makeWord(4, 1),
      ]),
    ).toBe(1);
  });

  it("filters the archive to archived captures before search", () => {
    const archived = makeWord(1, 1, {
      word: "meticulous",
      definition: "careful",
      totCapture: makeCapture(1, {
        triageStatus: "archived",
        weakSubstitute: "picky",
        context: "inspection meeting",
      }),
    });
    const pending = makeWord(2, 1, {
      word: "lucid",
      definition: "clear",
      totCapture: makeCapture(1, { triageStatus: "pending" }),
    });

    expect(
      filterWordsForLibraryView([archived, pending], "archive", "").map(
        (word) => word.word,
      ),
    ).toEqual(["meticulous"]);
    expect(
      filterWordsForLibraryView([archived, pending], "archive", "inspection"),
    ).toEqual([archived]);
    expect(
      filterWordsForLibraryView([archived, pending], "archive", "picky"),
    ).toEqual([archived]);
    expect(
      filterWordsForLibraryView([archived, pending], "archive", "careful"),
    ).toEqual([archived]);
    expect(
      filterWordsForLibraryView([archived, pending], "archive", "lucid"),
    ).toEqual([]);
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
