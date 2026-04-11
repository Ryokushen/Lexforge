/** @vitest-environment jsdom */

import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SessionResult, SessionSummary, SessionWord } from "@/lib/types";

const loadSessionWordsMock = vi.hoisted(() => vi.fn());
const processAnswerMock = vi.hoisted(() => vi.fn());
const finalizeSessionMock = vi.hoisted(() => vi.fn());
const pickModeMock = vi.hoisted(() => vi.fn());
const getContextSentenceMock = vi.hoisted(() => vi.fn());
const getSpeedChoicesMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/session-engine", () => ({
  loadSessionWords: loadSessionWordsMock,
  processAnswer: processAnswerMock,
  finalizeSession: finalizeSessionMock,
  pickMode: pickModeMock,
  getContextSentence: getContextSentenceMock,
  getSpeedChoices: getSpeedChoicesMock,
}));

vi.mock("@/lib/sounds", () => ({
  playCorrect: vi.fn(),
  playStreakCorrect: vi.fn(),
  playIncorrect: vi.fn(),
  playSessionComplete: vi.fn(),
  playLevelUp: vi.fn(),
}));

import { useSession } from "./use-session";

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

function makeSessionWord(id: number): SessionWord {
  return {
    word: {
      id,
      word: `word-${id}`,
      definition: `definition-${id}`,
      examples: [],
      synonyms: [],
      tier: 1,
      createdAt: new Date("2026-04-01T00:00:00.000Z"),
    },
    reviewCard: {
      id,
      wordId: id,
      card: {
        due: new Date("2026-04-10T12:00:00.000Z"),
        stability: 0,
        difficulty: 0,
        elapsed_days: 0,
        scheduled_days: 0,
        reps: 0,
        lapses: 0,
        state: 0,
        learning_steps: 0,
        last_review: undefined,
      },
    },
  };
}

function makeResult(wordId: number): SessionResult {
  return {
    wordId,
    word: `word-${wordId}`,
    correct: true,
    responseTimeMs: 1000,
    rating: 3,
    mode: "recall",
  };
}

describe("useSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-10T12:00:00.000Z"));
    pickModeMock.mockReturnValue("recall");
    getContextSentenceMock.mockReturnValue(null);
    getSpeedChoicesMock.mockReturnValue(null);
    finalizeSessionMock.mockResolvedValue({
      results: [],
      totalCorrect: 0,
      totalWords: 0,
      xpEarned: 0,
      leveledUp: false,
      statGains: {},
      averageResponseTimeMs: 0,
    } satisfies SessionSummary);
  });

  it("ignores duplicate submissions while an answer is processing and allows the next word afterward", async () => {
    const words = [makeSessionWord(1), makeSessionWord(2)];
    loadSessionWordsMock.mockResolvedValue(words);

    const firstAnswer = createDeferred<{
      result: SessionResult;
      updatedCard: SessionWord["reviewCard"];
    }>();
    const secondAnswer = createDeferred<{
      result: SessionResult;
      updatedCard: SessionWord["reviewCard"];
    }>();

    processAnswerMock
      .mockReturnValueOnce(firstAnswer.promise)
      .mockReturnValueOnce(secondAnswer.promise);

    const { result } = renderHook(() => useSession());

    await act(async () => {
      await result.current.startSession("normal", 1);
    });

    await act(async () => {
      void result.current.submitAnswer("word-1");
      void result.current.submitAnswer("word-1");
      await Promise.resolve();
    });

    expect(processAnswerMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      firstAnswer.resolve({
        result: makeResult(1),
        updatedCard: words[0].reviewCard,
      });
      await firstAnswer.promise;
    });

    expect(result.current.state).toBe("reviewing");

    await act(async () => {
      await result.current.nextWord();
    });

    expect(result.current.state).toBe("active");
    expect(result.current.currentIndex).toBe(1);

    await act(async () => {
      void result.current.submitAnswer("word-2");
      await Promise.resolve();
    });

    expect(processAnswerMock).toHaveBeenCalledTimes(2);

    await act(async () => {
      secondAnswer.resolve({
        result: makeResult(2),
        updatedCard: words[1].reviewCard,
      });
      await secondAnswer.promise;
    });
  });
});
