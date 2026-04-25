import { describe, expect, it } from "vitest";
import type { TOTCapture, Word } from "@/lib/types";
import type { VocabularyItem } from "@/lib/vocabulary-item";
import {
  buildWordLibraryItems,
  buildTierFilterLayout,
  buildWordGroups,
  filterWordLibraryItemsForView,
  filterWordsForLibraryView,
  getCoverageLaneDisplays,
  getArchiveCount,
  getArchiveItemCount,
  getDuplicateCount,
  getDuplicateGroupsForLibraryView,
  getInboxCount,
  getInboxItemCount,
  getNextPracticeLaneDisplay,
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

function makeItem(
  overrides: Partial<VocabularyItem> = {},
): VocabularyItem {
  return {
    id: 1,
    backingWordId: 1,
    word: "lucid",
    definition: "clear",
    examples: [],
    synonyms: [],
    contextSentences: [],
    tier: 1,
    createdAt: new Date("2026-04-01T00:00:00.000Z"),
    trainingEligible: true,
    source: {
      kind: "seeded",
      isSeeded: true,
      isCustom: false,
      isCaptured: false,
      captureCount: 0,
      captureTriageStatus: null,
      captureEventIds: [],
    },
    coverage: {
      retrieval: "unknown",
      context: "unknown",
      association: "unknown",
      collocation: "unknown",
    },
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

  it("supports item-backed inbox counts and filters without changing word results", () => {
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
    const items = buildWordLibraryItems([pending, accepted]);

    expect(getInboxItemCount(items)).toBe(1);
    expect(
      filterWordLibraryItemsForView(items, "inbox", "inspection").map(
        (entry) => entry.word,
      ),
    ).toEqual([pending]);
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

  it("supports item-backed archive counts and filters without changing word results", () => {
    const archived = makeWord(1, 1, {
      word: "meticulous",
      definition: "careful",
      totCapture: makeCapture(1, {
        triageStatus: "archived",
        weakSubstitute: "picky",
      }),
    });
    const pending = makeWord(2, 1, {
      word: "lucid",
      definition: "clear",
      totCapture: makeCapture(1, { triageStatus: "pending" }),
    });
    const items = buildWordLibraryItems([archived, pending]);

    expect(getArchiveItemCount(items)).toBe(1);
    expect(
      filterWordLibraryItemsForView(items, "archive", "picky").map(
        (entry) => entry.word,
      ),
    ).toEqual([archived]);
  });
});

describe("practice lane display helpers", () => {
  it("formats all coverage lanes in a stable order with practiced and missing states", () => {
    const displays = getCoverageLaneDisplays(
      makeItem({
        coverage: {
          retrieval: "practiced",
          context: "unknown",
          association: "practiced",
          collocation: "unknown",
        },
      }),
    );

    expect(displays).toEqual([
      { key: "retrieval", label: "Recall", practiced: true, statusLabel: "Practiced" },
      { key: "context", label: "Context", practiced: false, statusLabel: "Needed" },
      { key: "association", label: "Association", practiced: true, statusLabel: "Practiced" },
      { key: "collocation", label: "Collocation", practiced: false, statusLabel: "Needed" },
    ]);
  });

  it("describes the automatic coverage signal from item coverage", () => {
    expect(
      getNextPracticeLaneDisplay(
        makeItem({
          coverage: {
            retrieval: "practiced",
            context: "unknown",
            association: "unknown",
            collocation: "unknown",
          },
        }),
      ),
    ).toEqual({
      label: "Automatic: Context",
      description: "Lexforge can use sentence-level prompts when session mix allows.",
      blocked: false,
    });
  });

  it("marks fully covered and training-ineligible items distinctly", () => {
    expect(
      getNextPracticeLaneDisplay(
        makeItem({
          coverage: {
            retrieval: "practiced",
            context: "practiced",
            association: "practiced",
            collocation: "practiced",
          },
        }),
      ),
    ).toEqual({
      label: "Maintenance: Recall",
      description: "All lanes have coverage; FSRS reviews keep recall fresh.",
      blocked: false,
    });

    expect(
      getNextPracticeLaneDisplay(makeItem({ trainingEligible: false })),
    ).toEqual({
      label: "Not in training",
      description: "Pending or archived captures stay out of sessions until kept.",
      blocked: true,
    });
  });
});

describe("duplicate helpers", () => {
  it("counts only exact normalized duplicate groups", () => {
    expect(
      getDuplicateCount([
        makeWord(1, 1, { word: "Lucid" }),
        makeWord(2, "custom", { word: " lucid " }),
        makeWord(3, 1, { word: "lucidity" }),
        makeWord(4, 1, { word: "Tenuous" }),
        makeWord(5, "custom", { word: "tenuous" }),
      ]),
    ).toBe(2);
  });

  it("filters duplicate groups by word, definition, weak substitute, and context", () => {
    const duplicateA = makeWord(1, 1, {
      word: "Lucid",
      definition: "clear",
      totCapture: makeCapture(1, {
        weakSubstitute: "plain",
        context: "inspection meeting",
      }),
    });
    const duplicateB = makeWord(2, "custom", {
      word: " lucid ",
      definition: "easy to understand",
    });
    const singleton = makeWord(3, 1, {
      word: "Tenuous",
      definition: "thin",
      totCapture: makeCapture(1, {
        weakSubstitute: "weak",
        context: "debate",
      }),
    });

    expect(
      getDuplicateGroupsForLibraryView(
        [duplicateA, duplicateB, singleton],
        "",
      ).map((group) => group.key),
    ).toEqual(["lucid"]);
    expect(
      getDuplicateGroupsForLibraryView(
        [duplicateA, duplicateB, singleton],
        "inspection",
      )[0].words,
    ).toEqual([duplicateA, duplicateB]);
    expect(
      getDuplicateGroupsForLibraryView(
        [duplicateA, duplicateB, singleton],
        "plain",
      )[0].words,
    ).toEqual([duplicateA, duplicateB]);
    expect(
      getDuplicateGroupsForLibraryView(
        [duplicateA, duplicateB, singleton],
        "easy",
      )[0].words,
    ).toEqual([duplicateA, duplicateB]);
    expect(
      getDuplicateGroupsForLibraryView(
        [duplicateA, duplicateB, singleton],
        "debate",
      ),
    ).toEqual([]);
  });

  it("keeps non-duplicate library filters unchanged", () => {
    const pending = makeWord(1, 1, {
      word: "lucid",
      totCapture: makeCapture(1, { triageStatus: "pending" }),
    });
    const archived = makeWord(2, 1, {
      word: "lucid",
      totCapture: makeCapture(1, { triageStatus: "archived" }),
    });
    const normal = makeWord(3, "custom", { word: "tenuous" });

    expect(
      filterWordsForLibraryView([pending, archived, normal], "inbox", ""),
    ).toEqual([pending]);
    expect(
      filterWordsForLibraryView([pending, archived, normal], "archive", ""),
    ).toEqual([archived]);
    expect(
      filterWordsForLibraryView([pending, archived, normal], "custom", ""),
    ).toEqual([normal]);
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
