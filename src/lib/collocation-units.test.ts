import { describe, expect, it } from "vitest";
import type { VocabularyItem } from "./vocabulary-item";
import {
  buildCollocationPracticeUnits,
  summarizeCollocationPracticeUnits,
} from "./collocation-units";

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
      retrieval: "practiced",
      context: "practiced",
      association: "unknown",
      collocation: "unknown",
    },
    ...overrides,
  };
}

describe("collocation practice units", () => {
  it("builds stable practice units from item context sentences", () => {
    const units = buildCollocationPracticeUnits([
      makeItem({
        contextSentences: [
          {
            sentence: "The explanation was clear and useful.",
            weakWord: "clear",
            answer: "lucid",
            distractors: ["vague"],
          },
        ],
      }),
    ]);

    expect(units).toEqual([
      {
        id: "1:collocation:0",
        itemId: 1,
        answer: "lucid",
        weakWord: "clear",
        source: "context-sentence",
        promptSentence: "The explanation was clear and useful.",
        targetSentence: "The explanation was lucid and useful.",
      },
    ]);
  });

  it("does not fabricate units for items without context sentence anchors", () => {
    expect(buildCollocationPracticeUnits([makeItem()])).toEqual([]);
  });

  it("summarizes generated units", () => {
    const units = buildCollocationPracticeUnits([
      makeItem({
        id: 1,
        contextSentences: [
          {
            sentence: "The explanation was clear.",
            weakWord: "clear",
            answer: "lucid",
            distractors: [],
          },
        ],
      }),
      makeItem({
        id: 2,
        contextSentences: [
          {
            sentence: "The case was weak.",
            weakWord: "weak",
            answer: "tenuous",
            distractors: [],
          },
        ],
      }),
    ]);

    expect(summarizeCollocationPracticeUnits(units)).toEqual({
      total: 2,
      itemCount: 2,
    });
  });
});
