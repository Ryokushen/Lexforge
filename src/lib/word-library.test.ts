import { describe, expect, it } from "vitest";
import type { TOTCapture, Word } from "./types";
import {
  archiveTOTCapture,
  buildMergedDuplicateWord,
  findDuplicateWordGroups,
  getArchivedCaptureWords,
  getCaptureTriageStatus,
  getPendingCaptureWords,
  isArchivedCapture,
  isCaptureTrainingActive,
  isDuplicateWord,
  isPendingCapture,
  isTierLocked,
  keepTOTCapture,
  normalizeWord,
  restoreArchivedTOTCapture,
  shouldIncludeNewWordInTraining,
} from "./word-library";

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
    definition: "clear",
    examples: [],
    synonyms: [],
    tier: 1,
    createdAt: new Date("2026-04-01T00:00:00.000Z"),
    ...overrides,
  };
}

describe("word library helpers", () => {
  it("normalizes words consistently", () => {
    expect(normalizeWord("  Lucid  ")).toBe("lucid");
  });

  it("detects case-insensitive duplicate words", () => {
    expect(
      isDuplicateWord("  Lucid ", [
        { word: "lucid" },
        { word: "tenuous" },
      ]),
    ).toBe(true);
    expect(
      isDuplicateWord("novel", [
        { word: "lucid" },
        { word: "tenuous" },
      ]),
    ).toBe(false);
  });

  it("treats locked tiers consistently with level unlocks", () => {
    expect(isTierLocked("all", 1)).toBe(false);
    expect(isTierLocked("custom", 1)).toBe(false);
    expect(isTierLocked(2, 1)).toBe(true);
    expect(isTierLocked(2, 5)).toBe(false);
    expect(isTierLocked(3, 9)).toBe(true);
    expect(isTierLocked(3, 10)).toBe(false);
    expect(isTierLocked(4, 14)).toBe(true);
    expect(isTierLocked(4, 15)).toBe(false);
  });

  it("groups exact normalized duplicate words without fuzzy matching", () => {
    const groups = findDuplicateWordGroups([
      makeWord({ id: 1, word: "Lucid" }),
      makeWord({ id: 2, word: " lucid " }),
      makeWord({ id: 3, word: "lucidity" }),
      makeWord({ id: 4, word: "Tenuous" }),
      makeWord({ id: 5, word: "tenuous" }),
    ]);

    expect(groups.map((group) => group.key)).toEqual(["lucid", "tenuous"]);
    expect(groups[0].words.map((word) => word.id)).toEqual([1, 2]);
    expect(groups[1].words.map((word) => word.id)).toEqual([4, 5]);
  });

  it("merges duplicate metadata conservatively into the survivor", () => {
    const merged = buildMergedDuplicateWord(
      makeWord({
        id: 1,
        word: "Lucid",
        definition: "clear",
        examples: ["A lucid note."],
        synonyms: ["clear"],
        association: "lamp",
        associationUpdatedAt: "2026-04-03T00:00:00.000Z",
        contextSentences: [
          {
            sentence: "The explanation was clear.",
            weakWord: "clear",
            answer: "lucid",
            distractors: [],
          },
        ],
        pipelineStage: "queued",
        pipelineUpdatedAt: "2026-04-03T00:00:00.000Z",
        totCapture: makeCapture({
          count: 1,
          eventIds: ["capture-a"],
          capturedAt: "2026-04-04T00:00:00.000Z",
          updatedAt: "2026-04-04T00:00:00.000Z",
          weakSubstitute: "clear",
        }),
      }),
      [
        makeWord({
          id: 2,
          word: "lucid",
          definition: "easy to understand",
          examples: ["A lucid answer."],
          synonyms: ["plain", "clear"],
          pronunciation: "LOO-sid",
          association: "window",
          associationUpdatedAt: "2026-04-06T00:00:00.000Z",
          contextSentences: [
            {
              sentence: "Her speech was plain.",
              weakWord: "plain",
              answer: "lucid",
              distractors: [],
            },
          ],
          pipelineStage: "reviewing",
          pipelineUpdatedAt: "2026-04-07T00:00:00.000Z",
          totCapture: makeCapture({
            source: "meeting",
            count: 2,
            eventIds: ["capture-b", "capture-a"],
            capturedAt: "2026-04-05T00:00:00.000Z",
            updatedAt: "2026-04-06T00:00:00.000Z",
            context: "team meeting",
          }),
        }),
      ],
      "2026-04-08T00:00:00.000Z",
    );

    expect(merged).toMatchObject({
      definition: "clear",
      pronunciation: "LOO-sid",
      examples: ["A lucid note.", "A lucid answer."],
      synonyms: ["clear", "plain"],
      association: "window",
      associationUpdatedAt: "2026-04-06T00:00:00.000Z",
      pipelineStage: "reviewing",
      pipelineUpdatedAt: "2026-04-08T00:00:00.000Z",
    });
    expect(merged.contextSentences).toHaveLength(2);
    expect(merged.totCapture).toMatchObject({
      source: "meeting",
      count: 2,
      eventIds: ["capture-a", "capture-b"],
      capturedAt: "2026-04-05T00:00:00.000Z",
      updatedAt: "2026-04-08T00:00:00.000Z",
      weakSubstitute: "clear",
      context: "team meeting",
    });
  });
});

describe("capture triage helpers", () => {
  it("treats legacy captures without status as pending", () => {
    const legacyCapture = makeCapture();

    expect(getCaptureTriageStatus(legacyCapture)).toBe("pending");
    expect(isPendingCapture(makeWord({ totCapture: legacyCapture }))).toBe(true);
  });

  it("filters pending captures for the inbox", () => {
    const pending = makeWord({
      id: 1,
      word: "pending",
      totCapture: makeCapture({ triageStatus: "pending" }),
    });
    const accepted = makeWord({
      id: 2,
      word: "accepted",
      totCapture: makeCapture({ triageStatus: "accepted" }),
    });
    const archived = makeWord({
      id: 3,
      word: "archived",
      totCapture: makeCapture({ triageStatus: "archived" }),
    });
    const normal = makeWord({ id: 4, word: "normal" });

    expect(getPendingCaptureWords([accepted, pending, archived, normal])).toEqual([
      pending,
    ]);
  });

  it("filters archived captures separately from pending and accepted captures", () => {
    const pending = makeWord({
      id: 1,
      word: "pending",
      totCapture: makeCapture({ triageStatus: "pending" }),
    });
    const accepted = makeWord({
      id: 2,
      word: "accepted",
      totCapture: makeCapture({ triageStatus: "accepted" }),
    });
    const archived = makeWord({
      id: 3,
      word: "archived",
      totCapture: makeCapture({ triageStatus: "archived" }),
    });
    const normal = makeWord({ id: 4, word: "normal" });

    expect(isArchivedCapture(archived)).toBe(true);
    expect(isArchivedCapture(pending)).toBe(false);
    expect(isArchivedCapture(accepted)).toBe(false);
    expect(isArchivedCapture(normal)).toBe(false);
    expect(getArchivedCaptureWords([accepted, pending, archived, normal])).toEqual([
      archived,
    ]);
  });

  it("keeps captures without demoting advanced pipeline stages", () => {
    const kept = keepTOTCapture(
      makeWord({
        pipelineStage: "productive",
        pipelineUpdatedAt: "2026-04-01T00:00:00.000Z",
        totCapture: makeCapture({ triageStatus: "pending" }),
      }),
      "2026-04-24T12:00:00.000Z",
    );

    expect(kept.pipelineStage).toBe("productive");
    expect(kept.pipelineUpdatedAt).toBe("2026-04-24T12:00:00.000Z");
    expect(kept.totCapture).toMatchObject({
      triageStatus: "accepted",
      triagedAt: "2026-04-24T12:00:00.000Z",
      updatedAt: "2026-04-24T12:00:00.000Z",
    });
  });

  it("moves captured pending words to queued when kept", () => {
    const kept = keepTOTCapture(
      makeWord({
        pipelineStage: "captured",
        totCapture: makeCapture({ triageStatus: "pending" }),
      }),
      "2026-04-24T12:00:00.000Z",
    );

    expect(kept.pipelineStage).toBe("queued");
  });

  it("archives only capture metadata and keeps the word recoverable", () => {
    const archived = archiveTOTCapture(
      makeWord({
        pipelineStage: "reviewing",
        totCapture: makeCapture({ triageStatus: "pending" }),
      }),
      "2026-04-24T12:00:00.000Z",
    );

    expect(archived).not.toHaveProperty("pipelineStage");
    expect(archived.totCapture).toMatchObject({
      triageStatus: "archived",
      triagedAt: "2026-04-24T12:00:00.000Z",
      updatedAt: "2026-04-24T12:00:00.000Z",
    });
  });

  it("activates capture training support only for accepted captures", () => {
    expect(
      isCaptureTrainingActive(
        makeWord({ totCapture: makeCapture({ triageStatus: "accepted" }) }),
      ),
    ).toBe(true);
    expect(
      isCaptureTrainingActive(
        makeWord({ totCapture: makeCapture({ triageStatus: "pending" }) }),
      ),
    ).toBe(false);
    expect(
      isCaptureTrainingActive(
        makeWord({ totCapture: makeCapture({ triageStatus: "archived" }) }),
      ),
    ).toBe(false);
  });

  it("includes only normal and accepted captures in new word training", () => {
    expect(shouldIncludeNewWordInTraining(makeWord())).toBe(true);
    expect(
      shouldIncludeNewWordInTraining(
        makeWord({ totCapture: makeCapture({ triageStatus: "accepted" }) }),
      ),
    ).toBe(true);
    expect(
      shouldIncludeNewWordInTraining(
        makeWord({ totCapture: makeCapture({ triageStatus: "pending" }) }),
      ),
    ).toBe(false);
    expect(
      shouldIncludeNewWordInTraining(
        makeWord({ totCapture: makeCapture({ triageStatus: "archived" }) }),
      ),
    ).toBe(false);
  });

  it("restores archived captures to pending without activating training", () => {
    const restored = restoreArchivedTOTCapture(
      makeWord({
        pipelineStage: "captured",
        pipelineUpdatedAt: "2026-04-01T00:00:00.000Z",
        totCapture: makeCapture({
          triageStatus: "archived",
          triagedAt: "2026-04-20T12:00:00.000Z",
          updatedAt: "2026-04-20T12:00:00.000Z",
        }),
      }),
      "2026-04-24T12:00:00.000Z",
    );

    expect(restored).not.toHaveProperty("pipelineStage");
    expect(restored).not.toHaveProperty("pipelineUpdatedAt");
    expect(restored.totCapture).toMatchObject({
      triageStatus: "pending",
      updatedAt: "2026-04-24T12:00:00.000Z",
    });
    expect(restored.totCapture).toHaveProperty("triagedAt", undefined);
    expect(
      isCaptureTrainingActive(
        makeWord({ totCapture: restored.totCapture }),
      ),
    ).toBe(false);
    expect(
      shouldIncludeNewWordInTraining(
        makeWord({ totCapture: restored.totCapture }),
      ),
    ).toBe(false);
  });
});
