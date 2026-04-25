/** @vitest-environment jsdom */

import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SessionResult, SessionSummary, SessionWord } from "@/lib/types";

const loadSessionWordsMock = vi.hoisted(() => vi.fn());
const processAnswerMock = vi.hoisted(() => vi.fn());
const finalizeSessionMock = vi.hoisted(() => vi.fn());
const pickModeMock = vi.hoisted(() => vi.fn());
const buildContextPromptMock = vi.hoisted(() => vi.fn());
const createSessionIdMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/session-engine", () => ({
  createSessionId: createSessionIdMock,
  loadSessionWords: loadSessionWordsMock,
  processAnswer: processAnswerMock,
  finalizeSession: finalizeSessionMock,
  pickMode: pickModeMock,
  buildContextPrompt: buildContextPromptMock,
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
    buildContextPromptMock.mockReturnValue(null);
    createSessionIdMock.mockReturnValue("session-abc");
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

  it("passes profile stats into session loading so drill tuning can adapt", async () => {
    const words = [makeSessionWord(1)];
    loadSessionWordsMock.mockResolvedValue(words);

    const { result } = renderHook(() => useSession());
    const stats = {
      recall: 12,
      retention: 9,
      perception: 15,
      creativity: 7,
    };

    await act(async () => {
      await result.current.startSession("normal", 3, stats);
    });

    expect(loadSessionWordsMock).toHaveBeenCalledWith("normal", 3, stats);
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

    expect(processAnswerMock).toHaveBeenNthCalledWith(
      1,
      words[0],
      "word-1",
      expect.any(Number),
      "session-abc",
      "recall",
      undefined,
      undefined,
    );
    expect(processAnswerMock).toHaveBeenNthCalledWith(
      2,
      words[1],
      "word-2",
      expect.any(Number),
      "session-abc",
      "recall",
      undefined,
      undefined,
    );
  });

  it("commits answered words when the session is abandoned before completion", async () => {
    const words = [makeSessionWord(1), makeSessionWord(2)];
    loadSessionWordsMock.mockResolvedValue(words);
    processAnswerMock.mockResolvedValue({
      result: makeResult(1),
      updatedCard: words[0].reviewCard,
    });
    const partialSummary: SessionSummary = {
      results: [makeResult(1)],
      totalCorrect: 1,
      totalWords: 1,
      xpEarned: 65,
      leveledUp: false,
      statGains: {},
      averageResponseTimeMs: 1000,
    };
    finalizeSessionMock.mockResolvedValue(partialSummary);

    const { result, unmount } = renderHook(() => useSession());

    await act(async () => {
      await result.current.startSession("normal", 1);
    });

    await act(async () => {
      await result.current.submitAnswer("word-1");
    });

    expect(result.current.state).toBe("reviewing");

    await act(async () => {
      unmount();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(finalizeSessionMock).toHaveBeenCalledTimes(1);
    expect(finalizeSessionMock).toHaveBeenCalledWith([makeResult(1)]);
  });

  it("passes the target word into rapid retrieval grading when speed mode is active", async () => {
    const words = [makeSessionWord(1)];
    loadSessionWordsMock.mockResolvedValue(words);
    pickModeMock.mockReturnValue("speed");
    processAnswerMock.mockResolvedValue({
      result: {
        ...makeResult(1),
        mode: "speed",
      },
      updatedCard: words[0].reviewCard,
    });

    const { result } = renderHook(() => useSession());

    await act(async () => {
      await result.current.startSession("normal", 1);
    });

    await act(async () => {
      await result.current.submitAnswer("word-1");
    });

    expect(processAnswerMock).toHaveBeenCalledWith(
      words[0],
      "word-1",
      expect.any(Number),
      "session-abc",
      "speed",
      "word-1",
      undefined,
    );
  });

  it("uses the attached practice lane route as a preferred session mode", async () => {
    const words = [
      {
        ...makeSessionWord(1),
        practiceLaneRoute: {
          itemId: 1,
          lane: "association",
          reason: "missing-association",
        },
      } satisfies SessionWord,
    ];
    loadSessionWordsMock.mockResolvedValue(words);
    pickModeMock.mockReturnValue("association");

    const { result } = renderHook(() => useSession());

    await act(async () => {
      await result.current.startSession("normal", 1);
    });

    expect(pickModeMock).toHaveBeenCalledWith(
      words[0].word,
      "association",
      words[0].drillProfile,
      undefined,
    );
    expect(result.current.currentMode).toBe("association");
  });

  it("passes context prompt metadata into grading when context mode is active", async () => {
    const words = [makeSessionWord(1)];
    loadSessionWordsMock.mockResolvedValue(words);
    pickModeMock.mockReturnValue("context");
    buildContextPromptMock.mockReturnValue({
      kind: "rewrite",
      answer: "meticulous",
      sentence: "The **weak** sentence confused everyone.",
      weakWord: "weak",
      definition: "definition-1",
      example: "example-1",
    });
    processAnswerMock.mockResolvedValue({
      result: {
        ...makeResult(1),
        mode: "context",
      },
      updatedCard: words[0].reviewCard,
    });

    const { result } = renderHook(() => useSession());

    await act(async () => {
      await result.current.startSession("normal", 1);
    });

    await act(async () => {
      await result.current.submitAnswer("The meticulous sentence confused everyone.", {
        cueLevel: 1,
        contextPromptKind: "rewrite",
        contextSourceSentence: "The **weak** sentence confused everyone.",
      });
    });

    expect(processAnswerMock).toHaveBeenCalledWith(
      words[0],
      "The meticulous sentence confused everyone.",
      expect.any(Number),
      "session-abc",
      "context",
      "meticulous",
      {
        cueLevel: 1,
        contextPromptKind: "rewrite",
        contextSourceSentence: "The **weak** sentence confused everyone.",
      },
    );
  });

  it("defaults rewrite-context metadata from the active prompt when the UI omits it", async () => {
    const words = [makeSessionWord(1)];
    loadSessionWordsMock.mockResolvedValue(words);
    pickModeMock.mockReturnValue("context");
    buildContextPromptMock.mockReturnValue({
      kind: "rewrite",
      answer: "meticulous",
      sentence: "The **weak** sentence confused everyone.",
      weakWord: "weak",
      definition: "definition-1",
      example: "example-1",
    });
    processAnswerMock.mockResolvedValue({
      result: {
        ...makeResult(1),
        mode: "context",
      },
      updatedCard: words[0].reviewCard,
    });

    const { result } = renderHook(() => useSession());

    await act(async () => {
      await result.current.startSession("normal", 1);
    });

    await act(async () => {
      await result.current.submitAnswer("The meticulous sentence confused everyone.");
    });

    expect(processAnswerMock).toHaveBeenCalledWith(
      words[0],
      "The meticulous sentence confused everyone.",
      expect.any(Number),
      "session-abc",
      "context",
      "meticulous",
      {
        contextPromptKind: "rewrite",
        contextSourceSentence: "The **weak** sentence confused everyone.",
      },
    );
  });

  it("defaults collocation metadata from the active prompt when the UI omits it", async () => {
    const words = [
      {
        ...makeSessionWord(1),
        word: {
          ...makeSessionWord(1).word,
          contextSentences: [
            {
              sentence: "The team **agreed** on the plan.",
              weakWord: "agreed",
              answer: "concurred",
              distractors: [],
            },
          ],
        },
        practiceLaneRoute: {
          itemId: 1,
          lane: "collocation",
          reason: "missing-collocation",
        },
      } satisfies SessionWord,
    ];
    loadSessionWordsMock.mockResolvedValue(words);
    pickModeMock.mockReturnValue("context");
    buildContextPromptMock.mockReturnValue({
      kind: "collocation",
      answer: "concurred",
      sentence: "The team **agreed** on the plan.",
      targetSentence: "The team concurred on the plan.",
      weakWord: "agreed",
      definition: "definition-1",
      example: "example-1",
    });
    processAnswerMock.mockResolvedValue({
      result: {
        ...makeResult(1),
        mode: "context",
      },
      updatedCard: words[0].reviewCard,
    });

    const { result } = renderHook(() => useSession());

    await act(async () => {
      await result.current.startSession("normal", 1);
    });

    await act(async () => {
      await result.current.submitAnswer("The team concurred on the plan.");
    });

    expect(buildContextPromptMock).toHaveBeenCalledWith(
      words[0].word,
      words[0].drillProfile,
      words[0].practiceLaneRoute,
    );
    expect(processAnswerMock).toHaveBeenCalledWith(
      words[0],
      "The team concurred on the plan.",
      expect.any(Number),
      "session-abc",
      "context",
      "concurred",
      {
        contextPromptKind: "collocation",
        contextSourceSentence: "The team **agreed** on the plan.",
      },
    );
  });

  it("defaults production-context metadata from the active prompt when the UI omits it", async () => {
    const words = [makeSessionWord(1)];
    loadSessionWordsMock.mockResolvedValue(words);
    pickModeMock.mockReturnValue("context");
    buildContextPromptMock.mockReturnValue({
      kind: "produce",
      answer: "word-1",
      definition: "definition-1",
      example: "example-1",
    });
    processAnswerMock.mockResolvedValue({
      result: {
        ...makeResult(1),
        mode: "context",
      },
      updatedCard: words[0].reviewCard,
    });

    const { result } = renderHook(() => useSession());

    await act(async () => {
      await result.current.startSession("normal", 1);
    });

    await act(async () => {
      await result.current.submitAnswer("I used word-1 in a sentence.");
    });

    expect(processAnswerMock).toHaveBeenCalledWith(
      words[0],
      "I used word-1 in a sentence.",
      expect.any(Number),
      "session-abc",
      "context",
      "word-1",
      { contextPromptKind: "produce" },
    );
  });

  it("passes cue metadata through to grading when a prompt uses assistance", async () => {
    const words = [makeSessionWord(1)];
    loadSessionWordsMock.mockResolvedValue(words);
    processAnswerMock.mockResolvedValue({
      result: {
        ...makeResult(1),
        rating: 2,
        cueLevel: 1,
        retrievalKind: "assisted",
      },
      updatedCard: words[0].reviewCard,
    });

    const { result } = renderHook(() => useSession());

    await act(async () => {
      await result.current.startSession("normal", 1);
    });

    await act(async () => {
      await result.current.submitAnswer("word-1", { cueLevel: 1 });
    });

    expect(processAnswerMock).toHaveBeenCalledWith(
      words[0],
      "word-1",
      expect.any(Number),
      "session-abc",
      "recall",
      undefined,
      { cueLevel: 1 },
    );
  });
});
