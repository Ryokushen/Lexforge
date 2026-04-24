import { describe, expect, it } from "vitest";
import type { TOTCapture, Word } from "./types";
import {
  archiveTOTCapture,
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
