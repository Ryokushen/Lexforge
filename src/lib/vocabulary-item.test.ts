import { describe, expect, it } from "vitest";
import type { ReviewLog, TOTCapture, Word } from "./types";
import {
  summarizeVocabularyItemCoverage,
  wordToVocabularyItem,
  wordsToVocabularyItems,
} from "./vocabulary-item";

function makeCapture(overrides: Partial<TOTCapture> = {}): TOTCapture {
  return {
    source: "speech",
    capturedAt: "2026-04-10T09:00:00.000Z",
    count: 1,
    ...overrides,
  };
}

function makeWord(overrides: Partial<Word> = {}): Word {
  return {
    id: 1,
    word: "lucid",
    definition: "clear and easy to understand",
    examples: ["A lucid explanation."],
    synonyms: ["clear"],
    tier: 1,
    createdAt: new Date("2026-04-01T00:00:00.000Z"),
    ...overrides,
  };
}

function makeLog(overrides: Partial<ReviewLog> = {}): ReviewLog {
  return {
    id: 1,
    wordId: 1,
    rating: 3,
    responseTimeMs: 1200,
    correct: true,
    reviewedAt: new Date("2026-04-12T09:00:00.000Z"),
    ...overrides,
  };
}

describe("vocabulary item bridge", () => {
  it("projects seeded words to transitional vocabulary items backed by word id", () => {
    const item = wordToVocabularyItem(
      makeWord({
        id: 42,
        tier: 2,
        contextSentences: [
          {
            sentence: "The explanation was clear.",
            weakWord: "clear",
            answer: "lucid",
            distractors: [],
          },
        ],
        pipelineStage: "reviewing",
        pipelineUpdatedAt: "2026-04-12T09:00:00.000Z",
      }),
    );

    expect(item).toMatchObject({
      id: 42,
      backingWordId: 42,
      word: "lucid",
      definition: "clear and easy to understand",
      examples: ["A lucid explanation."],
      synonyms: ["clear"],
      contextSentences: [
        {
          sentence: "The explanation was clear.",
          weakWord: "clear",
          answer: "lucid",
          distractors: [],
        },
      ],
      tier: 2,
      pipelineStage: "reviewing",
      pipelineUpdatedAt: "2026-04-12T09:00:00.000Z",
      trainingEligible: true,
      source: {
        kind: "seeded",
        isSeeded: true,
        isCustom: false,
        isCaptured: false,
        captureCount: 0,
        captureEventIds: [],
      },
    });
  });

  it("projects custom words as custom learning concepts", () => {
    const item = wordToVocabularyItem(makeWord({ id: 7, tier: "custom" }));

    expect(item.source).toMatchObject({
      kind: "custom",
      isSeeded: false,
      isCustom: true,
      isCaptured: false,
    });
  });

  it("projects pending, accepted, and archived captures into source summaries and eligibility", () => {
    const pending = wordToVocabularyItem(
      makeWord({
        id: 1,
        totCapture: makeCapture({
          triageStatus: "pending",
          count: 2,
          eventIds: ["pending-a", "pending-b"],
        }),
      }),
    );
    const accepted = wordToVocabularyItem(
      makeWord({
        id: 2,
        totCapture: makeCapture({
          triageStatus: "accepted",
          count: 1,
          eventIds: ["accepted-a"],
        }),
      }),
    );
    const archived = wordToVocabularyItem(
      makeWord({
        id: 3,
        totCapture: makeCapture({
          triageStatus: "archived",
          count: 1,
          eventIds: ["archived-a"],
        }),
      }),
    );

    expect(pending.source).toMatchObject({
      isCaptured: true,
      captureCount: 2,
      captureTriageStatus: "pending",
      captureEventIds: ["pending-a", "pending-b"],
    });
    expect(pending.trainingEligible).toBe(false);
    expect(accepted.trainingEligible).toBe(true);
    expect(archived.source.captureTriageStatus).toBe("archived");
    expect(archived.trainingEligible).toBe(false);
  });

  it("treats legacy captures without a status as pending", () => {
    const item = wordToVocabularyItem(
      makeWord({
        id: 1,
        totCapture: makeCapture({ triageStatus: undefined }),
      }),
    );

    expect(item.source.captureTriageStatus).toBe("pending");
    expect(item.trainingEligible).toBe(false);
  });

  it("rejects words without an id so bridge item ids are never fabricated", () => {
    expect(() => wordToVocabularyItem(makeWord({ id: undefined }))).toThrow(
      "Cannot project a vocabulary item without a persisted word id.",
    );
  });

  it("omits words without ids when projecting a collection", () => {
    expect(
      wordsToVocabularyItems([
        makeWord({ id: 1, word: "lucid" }),
        makeWord({ id: undefined, word: "missing" }),
        makeWord({ id: 2, word: "tenuous" }),
      ]).map((item) => item.word),
    ).toEqual(["lucid", "tenuous"]);
  });

  it("defaults coverage lanes to unknown when no current signal proves practice", () => {
    const item = wordToVocabularyItem(makeWord({ id: 1 }));

    expect(item.coverage).toEqual({
      retrieval: "unknown",
      context: "unknown",
      association: "unknown",
      collocation: "unknown",
    });
  });

  it("marks context coverage practiced from context prompt logs", () => {
    const item = wordToVocabularyItem(makeWord({ id: 1 }), {
      reviewLogs: [
        makeLog({ wordId: 1, contextPromptKind: "rewrite" }),
        makeLog({ wordId: 2, contextPromptKind: "produce" }),
      ],
    });

    expect(item.coverage.context).toBe("practiced");
    expect(item.coverage.retrieval).toBe("practiced");
  });

  it("marks association coverage practiced from an existing association", () => {
    const item = wordToVocabularyItem(
      makeWord({
        id: 1,
        association: "A clear window makes a lucid view.",
      }),
    );

    expect(item.coverage.association).toBe("practiced");
    expect(item.coverage.collocation).toBe("unknown");
  });

  it("summarizes practiced coverage lanes across projected items", () => {
    const items = wordsToVocabularyItems(
      [
        makeWord({ id: 1, association: "A clear window makes a lucid view." }),
        makeWord({ id: 2, word: "tenuous" }),
      ],
      {
        reviewLogs: [
          makeLog({ wordId: 1, contextPromptKind: "produce" }),
          makeLog({ wordId: 2, contextPromptKind: undefined }),
        ],
      },
    );

    expect(summarizeVocabularyItemCoverage(items)).toEqual({
      total: 2,
      retrievalPracticed: 2,
      contextPracticed: 1,
      associationPracticed: 1,
      collocationPracticed: 0,
      fullyCovered: 0,
    });
  });
});
