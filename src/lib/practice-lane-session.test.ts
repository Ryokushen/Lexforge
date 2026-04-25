import { describe, expect, it } from "vitest";
import type { PracticeLaneRoute } from "./practice-lanes";
import type { SessionWord, Word } from "./types";
import {
  getForcedSessionModeForPracticeLane,
  getSessionPracticeRoute,
} from "./practice-lane-session";

function makeWord(overrides: Partial<Word> = {}): Word {
  return {
    id: 1,
    word: "lucid",
    definition: "clear",
    examples: ["A lucid explanation."],
    synonyms: [],
    tier: 1,
    createdAt: new Date("2026-04-01T00:00:00.000Z"),
    ...overrides,
  };
}

function makeSessionWord(
  word: Word,
  practiceLaneRoute?: PracticeLaneRoute,
): SessionWord {
  return {
    word,
    practiceLaneRoute,
    reviewCard: {
      id: word.id,
      wordId: word.id!,
      card: {
        due: new Date("2026-04-10T12:00:00.000Z"),
        stability: 0,
        difficulty: 0,
        elapsed_days: 0,
        scheduled_days: 0,
        reps: 0,
        lapses: 0,
        state: 0,
        last_review: undefined,
        learning_steps: 0,
      },
    },
  };
}

describe("practice lane session bridge", () => {
  it("maps coverage routes to the session modes that can exercise them", () => {
    expect(
      getForcedSessionModeForPracticeLane(
        makeSessionWord(makeWord(), { itemId: 1, lane: "retrieval", reason: "missing-retrieval" }),
      ),
    ).toBe("recall");
    expect(
      getForcedSessionModeForPracticeLane(
        makeSessionWord(makeWord(), { itemId: 1, lane: "context", reason: "missing-context" }),
      ),
    ).toBe("context");
    expect(
      getForcedSessionModeForPracticeLane(
        makeSessionWord(makeWord(), { itemId: 1, lane: "association", reason: "missing-association" }),
      ),
    ).toBe("association");
    expect(
      getForcedSessionModeForPracticeLane(
        makeSessionWord(makeWord(), { itemId: 1, lane: "collocation", reason: "missing-collocation" }),
      ),
    ).toBe("context");
  });

  it("does not force context or collocation lanes when no context prompt can be built", () => {
    const wordWithoutContext = makeWord({ word: "unbanked-example", contextSentences: [] });

    expect(
      getForcedSessionModeForPracticeLane(
        makeSessionWord(wordWithoutContext, { itemId: 1, lane: "context", reason: "missing-context" }),
      ),
    ).toBeNull();
    expect(
      getForcedSessionModeForPracticeLane(
        makeSessionWord(wordWithoutContext, { itemId: 1, lane: "collocation", reason: "missing-collocation" }),
      ),
    ).toBeNull();
  });

  it("does not force association maintenance when the route is blocked", () => {
    expect(
      getForcedSessionModeForPracticeLane(
        makeSessionWord(makeWord(), { itemId: 1, lane: null, reason: "not-training-eligible" }),
      ),
    ).toBeNull();
  });

  it("returns the attached route only when it belongs to the session word", () => {
    const word = makeWord({ id: 7 });
    const route = { itemId: 7, lane: "context", reason: "missing-context" } satisfies PracticeLaneRoute;

    expect(getSessionPracticeRoute(makeSessionWord(word, route))).toBe(route);
    expect(
      getSessionPracticeRoute(
        makeSessionWord(word, { itemId: 8, lane: "context", reason: "missing-context" }),
      ),
    ).toBeNull();
  });
});
