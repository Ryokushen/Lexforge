import { describe, expect, it } from "vitest";
import type { VocabularyItem } from "./vocabulary-item";
import {
  getRecommendedPracticeLane,
  routeVocabularyPracticeLanes,
  summarizePracticeLaneRoutes,
} from "./practice-lanes";

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

describe("practice lane routing", () => {
  it("routes eligible items to the first missing practice lane", () => {
    expect(getRecommendedPracticeLane(makeItem())).toBe("retrieval");
    expect(
      getRecommendedPracticeLane(
        makeItem({
          coverage: {
            retrieval: "practiced",
            context: "unknown",
            association: "unknown",
            collocation: "unknown",
          },
        }),
      ),
    ).toBe("context");
    expect(
      getRecommendedPracticeLane(
        makeItem({
          coverage: {
            retrieval: "practiced",
            context: "practiced",
            association: "unknown",
            collocation: "unknown",
          },
        }),
      ),
    ).toBe("association");
  });

  it("does not route items that are not eligible for training", () => {
    expect(
      getRecommendedPracticeLane(makeItem({ trainingEligible: false })),
    ).toBeNull();
  });

  it("returns maintenance recall for fully covered eligible items", () => {
    expect(
      getRecommendedPracticeLane(
        makeItem({
          coverage: {
            retrieval: "practiced",
            context: "practiced",
            association: "practiced",
            collocation: "practiced",
          },
        }),
      ),
    ).toBe("retrieval");
  });

  it("summarizes generated lane routes", () => {
    const routes = routeVocabularyPracticeLanes([
      makeItem({ id: 1 }),
      makeItem({
        id: 2,
        coverage: {
          retrieval: "practiced",
          context: "unknown",
          association: "unknown",
          collocation: "unknown",
        },
      }),
      makeItem({ id: 3, trainingEligible: false }),
    ]);

    expect(routes).toEqual([
      { itemId: 1, lane: "retrieval", reason: "missing-retrieval" },
      { itemId: 2, lane: "context", reason: "missing-context" },
      { itemId: 3, lane: null, reason: "not-training-eligible" },
    ]);
    expect(summarizePracticeLaneRoutes(routes)).toEqual({
      retrieval: 1,
      context: 1,
      association: 0,
      collocation: 0,
      blocked: 1,
    });
  });
});
