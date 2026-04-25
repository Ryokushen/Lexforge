import { beforeEach, describe, expect, it, vi } from "vitest";
import { CONTEXT_SENTENCES } from "./context-sentences";
import type {
  GameMode,
  ReviewCard,
  ReviewLog,
  RetrievalDrillProfile,
  SessionWord,
  Word,
} from "./types";

const dbMock = vi.hoisted(() => ({
  reviewLogs: {
    add: vi.fn(),
    toArray: vi.fn(),
    where: vi.fn(),
  },
  words: {
    get: vi.fn(),
    update: vi.fn(),
  },
}));

const schedulerMock = vi.hoisted(() => ({
  getDueCards: vi.fn(),
  getNewCards: vi.fn(),
  gradeCard: vi.fn(),
  Rating: {
    Again: 1,
    Hard: 2,
    Good: 3,
    Easy: 4,
  },
}));

const completeSessionMock = vi.hoisted(() => vi.fn());

vi.mock("./db", () => ({
  db: dbMock,
}));

vi.mock("./scheduler", () => schedulerMock);

vi.mock("./gamification", () => ({
  completeSession: completeSessionMock,
}));

import {
  autoGrade,
  buildContextPrompt,
  buildRetrievalDrillProfile,
  createSessionId,
  finalizeSession,
  getAvailableNewCount,
  getUnlockedTiers,
  gradeContextAnswer,
  gradeSpeedAnswer,
  loadSessionWords,
  pickMode,
  processAnswer,
} from "./session-engine";

function makeWord(
  id: number,
  tier: Word["tier"] = 1,
  totCapture?: Word["totCapture"],
): Word {
  return {
    id,
    word: `word-${id}`,
    definition: `definition-${id}`,
    examples: [`example-${id}`],
    synonyms: [],
    tier,
    contextSentences: [
      {
        sentence: "A **weak** sentence.",
        weakWord: "weak",
        answer: `word-${id}`,
        distractors: ["other-1", "other-2", "other-3"],
      },
    ],
    totCapture,
    createdAt: new Date("2026-04-01T00:00:00.000Z"),
  };
}

function makeReviewCard(wordId: number, state: number = 0): ReviewCard {
  return {
    id: wordId,
    wordId,
    card: {
      due: new Date("2026-04-10T12:00:00.000Z"),
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: 0,
      lapses: 0,
      state,
      last_review: undefined,
      learning_steps: 0,
    },
  };
}

function makeSessionWord(id: number, tier: Word["tier"] = 1): SessionWord {
  return {
    word: makeWord(id, tier),
    reviewCard: makeReviewCard(id),
  };
}

function makeTodayFirstReviewLog(wordId: number): ReviewLog {
  return {
    id: wordId,
    wordId,
    rating: 3,
    responseTimeMs: 2000,
    correct: true,
    reviewedAt: new Date("2026-04-10T09:00:00.000Z"),
  };
}

function makeReviewLog(
  wordId: number,
  reviewedAt: string,
  overrides: Partial<ReviewLog> = {},
): ReviewLog {
  return {
    id: Number(`${wordId}${Date.parse(reviewedAt)}`),
    wordId,
    rating: 3,
    responseTimeMs: 2000,
    correct: true,
    cueLevel: 0,
    retrievalKind: "exact",
    reviewedAt: new Date(reviewedAt),
    ...overrides,
  };
}

function mockWordLogs(logs: ReviewLog[]) {
  dbMock.reviewLogs.where.mockReturnValue({
    equals: vi.fn().mockReturnValue({
      toArray: vi.fn().mockResolvedValue(logs),
    }),
  });
}

function sampleModeRatios(
  picker: () => GameMode,
  iterations: number = 20000,
): Record<GameMode, number> {
  const counts: Record<GameMode, number> = {
    recall: 0,
    context: 0,
    speed: 0,
    association: 0,
  };

  for (let index = 0; index < iterations; index++) {
    counts[picker()] += 1;
  }

  return {
    recall: counts.recall / iterations,
    context: counts.context / iterations,
    speed: counts.speed / iterations,
    association: counts.association / iterations,
  };
}

function makeDrillProfile(
  overrides: Partial<RetrievalDrillProfile> = {},
): RetrievalDrillProfile {
  return {
    stage: "stabilize",
    exactStreak: 1,
    recentCueRate: 0,
    recentFailureCount: 0,
    recallHintEnabled: true,
    rapidTimeoutMs: 3000,
    rapidCueRevealMs: 1800,
    ...overrides,
  };
}

describe("session engine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-10T12:00:00.000Z"));
    vi.clearAllMocks();
    dbMock.words.update.mockResolvedValue(1);
    mockWordLogs([]);
  });

  it("auto-grades exact, fuzzy, and wrong answers", () => {
    expect(autoGrade("lucid", "lucid")).toEqual({
      rating: 3,
      correct: true,
      cueLevel: 0,
      retrievalKind: "exact",
    });
    expect(autoGrade("lucid", "lucid", 1)).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 1,
      retrievalKind: "assisted",
    });
    expect(autoGrade("lucif", "lucid")).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 0,
      retrievalKind: "approximate",
    });
    expect(autoGrade("opaque", "lucid")).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
  });

  it("grades speed answers by correctness and response time", () => {
    expect(gradeSpeedAnswer("lucid", "lucid", 2500)).toEqual({
      rating: 4,
      correct: true,
      cueLevel: 0,
      retrievalKind: "exact",
    });
    expect(gradeSpeedAnswer("lucid", "lucid", 5000)).toEqual({
      rating: 3,
      correct: true,
      cueLevel: 0,
      retrievalKind: "exact",
    });
    expect(gradeSpeedAnswer("lucid", "lucid", 3500, 1)).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 1,
      retrievalKind: "assisted",
    });
    expect(gradeSpeedAnswer("lucif", "lucid", 2000)).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 0,
      retrievalKind: "approximate",
    });
    expect(gradeSpeedAnswer("__timeout__", "lucid", 8000)).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
  });

  it("uses proportional fast threshold when rapidTimeoutMs is provided", () => {
    // 5000ms timeout → fast threshold = 5000 * 0.6 = 3000ms
    expect(gradeSpeedAnswer("lucid", "lucid", 2500, 0, 5000)).toEqual({
      rating: 4,
      correct: true,
      cueLevel: 0,
      retrievalKind: "exact",
    });
    expect(gradeSpeedAnswer("lucid", "lucid", 3500, 0, 5000)).toEqual({
      rating: 3,
      correct: true,
      cueLevel: 0,
      retrievalKind: "exact",
    });
    // 3000ms timeout → fast threshold = 3000 * 0.6 = 1800ms
    expect(gradeSpeedAnswer("lucid", "lucid", 1500, 0, 3000)).toEqual({
      rating: 4,
      correct: true,
      cueLevel: 0,
      retrievalKind: "exact",
    });
    expect(gradeSpeedAnswer("lucid", "lucid", 2000, 0, 3000)).toEqual({
      rating: 3,
      correct: true,
      cueLevel: 0,
      retrievalKind: "exact",
    });
  });

  it("grades context answers by retrieval quality and fallback help", () => {
    expect(gradeContextAnswer("lucid", "lucid")).toEqual({
      rating: 3,
      correct: true,
      cueLevel: 0,
      retrievalKind: "exact",
    });
    expect(gradeContextAnswer("lucid", "lucid", 1)).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 1,
      retrievalKind: "assisted",
    });
    expect(gradeContextAnswer("lucif", "lucid")).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 0,
      retrievalKind: "approximate",
    });
    expect(gradeContextAnswer("opaque", "lucid")).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
  });

  it("grades production-style context answers by target-word usage and sentence shape", () => {
    expect(
      gradeContextAnswer(
        "The inspector was meticulous during the final review.",
        "meticulous",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 0,
      retrievalKind: "assisted",
    });
    expect(
      gradeContextAnswer(
        "The inspector was meticulous during the final review.",
        "meticulous",
        1,
        "produce",
      ),
    ).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 1,
      retrievalKind: "assisted",
    });
    expect(
      gradeContextAnswer(
        "The inspector was meticulus during the final review.",
        "meticulous",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 0,
      retrievalKind: "approximate",
    });
    expect(
      gradeContextAnswer(
        "Reducing latency is the product's raison d'etre.",
        "raison d'être",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 0,
      retrievalKind: "assisted",
    });
    expect(
      gradeContextAnswer(
        "The change made the process meticulous.",
        "meticulous",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 0,
      retrievalKind: "assisted",
    });
    expect(
      gradeContextAnswer(
        "The design seems meticulous on paper.",
        "meticulous",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 0,
      retrievalKind: "assisted",
    });
    expect(
      gradeContextAnswer(
        "The meticulous process works.",
        "meticulous",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 0,
      retrievalKind: "assisted",
    });
    expect(
      gradeContextAnswer(
        "We discern patterns quickly.",
        "discern",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 0,
      retrievalKind: "assisted",
    });
    expect(
      gradeContextAnswer(
        "Discern patterns quickly.",
        "discern",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 0,
      retrievalKind: "assisted",
    });
    expect(
      gradeContextAnswer(
        "We outline risks clearly.",
        "outline",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 0,
      retrievalKind: "assisted",
    });
    expect(
      gradeContextAnswer(
        "Outline the risks clearly.",
        "outline",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 0,
      retrievalKind: "assisted",
    });
    expect(
      gradeContextAnswer(
        "Their candor matters here.",
        "candor",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 0,
      retrievalKind: "assisted",
    });
    expect(
      gradeContextAnswer(
        "Reducing latency is the product's raisin d'etre.",
        "raison d'être",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 0,
      retrievalKind: "approximate",
    });
    expect(
      gradeContextAnswer(
        "The meticulous process",
        "meticulous",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
    expect(
      gradeContextAnswer(
        "The meticulous confused team.",
        "meticulous",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
    expect(
      gradeContextAnswer(
        "My meticulous confused team.",
        "meticulous",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
    expect(
      gradeContextAnswer(
        "The catalyst caused.",
        "catalyst",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
    expect(
      gradeContextAnswer(
        "The meticulous plan drafted yesterday.",
        "meticulous",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
    expect(
      gradeContextAnswer(
        "meticulous if it works",
        "meticulous",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
    expect(
      gradeContextAnswer(
        "meticulous because it works",
        "meticulous",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
    expect(
      gradeContextAnswer(
        "meticulous and careful",
        "meticulous",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
    expect(
      gradeContextAnswer(
        "meticulous and working",
        "meticulous",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
    expect(
      gradeContextAnswer(
        "meticulous when tested",
        "meticulous",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
    expect(
      gradeContextAnswer(
        "Meticulous. Another thing.",
        "meticulous",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
    expect(
      gradeContextAnswer(
        "The inspector was careful during the final review.",
        "meticulous",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
    expect(
      gradeContextAnswer(
        "meticulous meticulous meticulous",
        "meticulous",
        0,
        "produce",
      ),
    ).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
  });

  it("grades rewrite-style context answers by target-word usage and scenario anchors", () => {
    const sourceSentence = "The **weak** sentence confused everyone.";

    expect(
      gradeContextAnswer(
        "The meticulous sentence confused everyone.",
        "meticulous",
        0,
        "rewrite",
        sourceSentence,
      ),
    ).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 0,
      retrievalKind: "assisted",
    });
    expect(
      gradeContextAnswer(
        "The meticulus sentence confused everyone.",
        "meticulous",
        0,
        "rewrite",
        sourceSentence,
      ),
    ).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 0,
      retrievalKind: "approximate",
    });
    expect(
      gradeContextAnswer(
        "The meticulous sentence confused everyone.",
        "meticulous",
        1,
        "rewrite",
        sourceSentence,
      ),
    ).toEqual({
      rating: 2,
      correct: true,
      cueLevel: 1,
      retrievalKind: "assisted",
    });
    expect(
      gradeContextAnswer(
        "Our meticulous office feels calm.",
        "meticulous",
        0,
        "rewrite",
        sourceSentence,
      ),
    ).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
    expect(
      gradeContextAnswer(
        "The meticulous confused team.",
        "meticulous",
        0,
        "rewrite",
        sourceSentence,
      ),
    ).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
    expect(
      gradeContextAnswer(
        "My meticulous confused team.",
        "meticulous",
        0,
        "rewrite",
        sourceSentence,
      ),
    ).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
    expect(
      gradeContextAnswer(
        "Catalyst work is cause.",
        "catalyst",
        0,
        "rewrite",
        "The incident was the **cause** of a complete policy overhaul.",
      ),
    ).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
    expect(
      gradeContextAnswer(
        "The meticulous sentence confused everyone. Another one.",
        "meticulous",
        0,
        "rewrite",
        sourceSentence,
      ),
    ).toEqual({
      rating: 1,
      correct: false,
      cueLevel: 0,
      retrievalKind: "failed",
    });
  });

  it("accepts canonical rewrites from the shipped context-sentence bank", () => {
    const allSentences = Object.values(CONTEXT_SENTENCES).flat();

    expect(allSentences.length).toBeGreaterThan(0);

    for (const prompt of allSentences) {
      const canonicalRewrite = prompt.sentence.replace(`**${prompt.weakWord}**`, prompt.answer);
      expect(
        gradeContextAnswer(
          canonicalRewrite,
          prompt.answer,
          0,
          "rewrite",
          prompt.sentence,
        ),
      ).toMatchObject({
        correct: true,
      });
    }
  });

  it("uses the context sentence's canonical answer for fluent rewrite prompts", () => {
    const word: Word = {
      ...makeWord(99),
      word: "concur",
      definition: "to agree",
      examples: ["The reviewers concurred."],
      contextSentences: [
        {
          sentence: "All three reviewers **agreed** that the proposal was technically sound.",
          weakWord: "agreed",
          answer: "concurred",
          distractors: ["concluded", "confirmed", "decided"],
        },
      ],
    };

    const prompt = buildContextPrompt(word, {
      stage: "fluent",
      exactStreak: 3,
      recentCueRate: 0,
      recentFailureCount: 0,
      recallHintEnabled: false,
      rapidTimeoutMs: 3200,
      rapidCueRevealMs: null,
    });

    expect(prompt).toMatchObject({
      kind: "rewrite",
      answer: "concurred",
      sentence: "All three reviewers **agreed** that the proposal was technically sound.",
      weakWord: "agreed",
    });
  });

  it("builds collocation prompts when the session route asks for collocation practice", () => {
    const word: Word = {
      ...makeWord(99),
      word: "concurred",
      definition: "agreed",
      examples: ["The reviewers concurred."],
      contextSentences: [
        {
          sentence: "All three reviewers **agreed** that the proposal was technically sound.",
          weakWord: "agreed",
          answer: "concurred",
          distractors: ["concluded", "confirmed", "decided"],
        },
      ],
    };

    const prompt = buildContextPrompt(
      word,
      makeDrillProfile({ stage: "fluent", exactStreak: 3 }),
      { itemId: 99, lane: "collocation", reason: "missing-collocation" },
    );

    expect(prompt).toMatchObject({
      kind: "collocation",
      answer: "concurred",
      sentence: "All three reviewers **agreed** that the proposal was technically sound.",
      targetSentence: "All three reviewers concurred that the proposal was technically sound.",
      weakWord: "agreed",
    });
  });

  it("grades collocation answers against the source scene anchors", () => {
    const sourceSentence = "All three reviewers **agreed** that the proposal was technically sound.";

    expect(
      gradeContextAnswer(
        "All three reviewers concurred that the proposal was technically sound.",
        "concurred",
        0,
        "collocation",
        sourceSentence,
      ),
    ).toMatchObject({
      correct: true,
      retrievalKind: "assisted",
    });
    expect(
      gradeContextAnswer(
        "The committee concurred after lunch.",
        "concurred",
        0,
        "collocation",
        sourceSentence,
      ),
    ).toMatchObject({
      correct: false,
      retrievalKind: "failed",
    });
  });

  it("builds replacement prompts until a word has clean retrieval history, then upgrades from produce to rewrite", () => {
    const word = makeWord(1);

    const rescuePrompt = buildContextPrompt(word, {
      stage: "rescue",
      exactStreak: 0,
      recentCueRate: 0.5,
      recentFailureCount: 2,
      recallHintEnabled: true,
      rapidTimeoutMs: 5600,
      rapidCueRevealMs: 3400,
    });
    const tentativeStabilizePrompt = buildContextPrompt(word, {
      stage: "stabilize",
      exactStreak: 0,
      recentCueRate: 0,
      recentFailureCount: 0,
      recallHintEnabled: true,
      rapidTimeoutMs: 4200,
      rapidCueRevealMs: 2400,
    });
    const stabilizePrompt = buildContextPrompt(word, {
      stage: "stabilize",
      exactStreak: 1,
      recentCueRate: 0,
      recentFailureCount: 0,
      recallHintEnabled: true,
      rapidTimeoutMs: 3800,
      rapidCueRevealMs: 2200,
    });
    const fluentPrompt = buildContextPrompt(word, {
      stage: "fluent",
      exactStreak: 3,
      recentCueRate: 0,
      recentFailureCount: 0,
      recallHintEnabled: false,
      rapidTimeoutMs: 3200,
      rapidCueRevealMs: null,
    });

    expect(rescuePrompt).toMatchObject({
      kind: "replace",
      answer: "word-1",
      weakWord: "weak",
    });
    expect(tentativeStabilizePrompt).toMatchObject({
      kind: "replace",
      answer: "word-1",
      weakWord: "weak",
    });
    expect(stabilizePrompt).toMatchObject({
      kind: "produce",
      answer: "word-1",
      definition: "definition-1",
      example: "example-1",
    });
    expect(fluentPrompt).toMatchObject({
      kind: "rewrite",
      answer: "word-1",
      weakWord: "weak",
      sentence: "A **weak** sentence.",
      definition: "definition-1",
      example: "example-1",
    });
  });

  it("keeps fluent retrieval profiles stable after successful production-context reviews", () => {
    const word = makeWord(1);
    const logs: ReviewLog[] = [
      {
        ...makeReviewLog(1, "2026-04-10T11:45:00.000Z", {
          rating: 2,
          correct: true,
          cueLevel: 0,
          retrievalKind: "assisted",
        }),
        contextPromptKind: "produce",
      } as ReviewLog,
      makeReviewLog(1, "2026-04-09T11:45:00.000Z", {
        responseTimeMs: 1700,
      }),
      makeReviewLog(1, "2026-04-08T11:45:00.000Z", {
        responseTimeMs: 1900,
      }),
    ];

    const profile = buildRetrievalDrillProfile(word, logs);

    expect(profile).toMatchObject({
      stage: "fluent",
      exactStreak: 2,
      recentCueRate: 0,
      recentFailureCount: 0,
    });
  });

  it("keeps fluent retrieval profiles stable when successful production reviews crowd the recent window", () => {
    const word = makeWord(1);
    const profile = buildRetrievalDrillProfile(word, [
      {
        ...makeReviewLog(1, "2026-04-10T11:45:00.000Z", {
          rating: 2,
          correct: true,
          cueLevel: 0,
          retrievalKind: "assisted",
        }),
        contextPromptKind: "produce",
      } as ReviewLog,
      {
        ...makeReviewLog(1, "2026-04-09T11:45:00.000Z", {
          rating: 2,
          correct: true,
          cueLevel: 0,
          retrievalKind: "assisted",
        }),
        contextPromptKind: "produce",
      } as ReviewLog,
      {
        ...makeReviewLog(1, "2026-04-08T11:45:00.000Z", {
          rating: 2,
          correct: true,
          cueLevel: 0,
          retrievalKind: "assisted",
        }),
        contextPromptKind: "produce",
      } as ReviewLog,
      {
        ...makeReviewLog(1, "2026-04-07T11:45:00.000Z", {
          rating: 2,
          correct: true,
          cueLevel: 0,
          retrievalKind: "assisted",
        }),
        contextPromptKind: "produce",
      } as ReviewLog,
      makeReviewLog(1, "2026-04-06T11:45:00.000Z", {
        responseTimeMs: 1700,
      }),
      makeReviewLog(1, "2026-04-05T11:45:00.000Z", {
        responseTimeMs: 1900,
      }),
    ]);

    expect(profile).toMatchObject({
      stage: "fluent",
      exactStreak: 2,
      recentCueRate: 0,
      recentFailureCount: 0,
    });
  });

  it("demotes fluent retrieval profiles when recent production-context reviews need help or fail", () => {
    const word = makeWord(1);

    const cueFallbackProfile = buildRetrievalDrillProfile(word, [
      {
        ...makeReviewLog(1, "2026-04-10T11:45:00.000Z", {
          rating: 2,
          correct: true,
          cueLevel: 1,
          retrievalKind: "assisted",
        }),
        contextPromptKind: "produce",
      } as ReviewLog,
      makeReviewLog(1, "2026-04-09T11:45:00.000Z", {
        responseTimeMs: 1700,
      }),
      makeReviewLog(1, "2026-04-08T11:45:00.000Z", {
        responseTimeMs: 1900,
      }),
    ]);

    expect(cueFallbackProfile).toMatchObject({
      stage: "stabilize",
      exactStreak: 2,
      recentCueRate: 1 / 3,
      recentFailureCount: 0,
    });

    const failedProductionProfile = buildRetrievalDrillProfile(word, [
      {
        ...makeReviewLog(1, "2026-04-10T11:45:00.000Z", {
          rating: 1,
          correct: false,
          cueLevel: 0,
          retrievalKind: "failed",
        }),
        contextPromptKind: "produce",
      } as ReviewLog,
      makeReviewLog(1, "2026-04-09T11:45:00.000Z", {
        responseTimeMs: 1700,
      }),
      makeReviewLog(1, "2026-04-08T11:45:00.000Z", {
        responseTimeMs: 1900,
      }),
    ]);

    expect(failedProductionProfile).toMatchObject({
      stage: "rescue",
      exactStreak: 2,
      recentCueRate: 0,
      recentFailureCount: 1,
    });
  });

  it("does not keep pending captures in rescue solely because they were captured", () => {
    const profile = buildRetrievalDrillProfile(
      makeWord(1, 1, {
        source: "speech",
        capturedAt: "2026-04-10T00:00:00.000Z",
        count: 1,
        triageStatus: "pending",
      }),
      [],
    );

    expect(profile.stage).toBe("stabilize");
  });

  it("keeps accepted captures eligible for capture recovery support", () => {
    const profile = buildRetrievalDrillProfile(
      makeWord(1, 1, {
        source: "speech",
        capturedAt: "2026-04-10T00:00:00.000Z",
        count: 1,
        triageStatus: "accepted",
      }),
      [],
    );

    expect(profile.stage).toBe("rescue");
  });

  it("does not bias mode selection toward adaptive drills for archived captures", () => {
    const word = {
      ...makeWord(
        1,
        1,
        {
          source: "speech",
          capturedAt: "2026-04-10T00:00:00.000Z",
          count: 1,
          triageStatus: "archived",
        },
      ),
      contextSentences: [],
    };

    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.5);

    try {
      expect(
        pickMode(
          word,
          undefined,
          { ...makeDrillProfile(), stage: "stabilize", recentCueRate: 0 },
        ),
      ).toBe("recall");
    } finally {
      randomSpy.mockRestore();
    }
  });

  it("does not prioritize inactive captures over normal words by capture metadata", async () => {
    schedulerMock.getDueCards.mockResolvedValue([
      makeReviewCard(2, 1),
      makeReviewCard(1, 1),
    ]);
    schedulerMock.getNewCards.mockResolvedValue([]);
    dbMock.reviewLogs.toArray.mockResolvedValue([]);
    dbMock.words.get.mockImplementation(async (wordId: number) => {
      if (wordId === 2) {
        return makeWord(2, 1, {
          source: "speech",
          capturedAt: "2026-04-10T11:00:00.000Z",
          count: 99,
          triageStatus: "pending",
        });
      }

      return makeWord(1);
    });

    const sessionWords = await loadSessionWords("easy", 1);

    expect(sessionWords.map((entry) => entry.word.id)).toEqual([1, 2]);
  });

  it("prioritizes accepted captures by count and recency", async () => {
    schedulerMock.getDueCards.mockResolvedValue([
      makeReviewCard(1, 1),
      makeReviewCard(2, 1),
      makeReviewCard(3, 1),
    ]);
    schedulerMock.getNewCards.mockResolvedValue([]);
    dbMock.reviewLogs.toArray.mockResolvedValue([]);
    dbMock.words.get.mockImplementation(async (wordId: number) =>
      makeWord(wordId, 1, {
        source: "speech",
        capturedAt:
          wordId === 2
            ? "2026-04-10T11:00:00.000Z"
            : "2026-04-10T10:00:00.000Z",
        count: wordId === 3 ? 3 : 1,
        triageStatus: "accepted",
      }),
    );

    const sessionWords = await loadSessionWords("easy", 1);

    expect(sessionWords.map((entry) => entry.word.id)).toEqual([3, 2, 1]);
  });

  it("unlocks tiers at the configured level thresholds", () => {
    expect(getUnlockedTiers(1)).toEqual([1, "custom"]);
    expect(getUnlockedTiers(5)).toEqual([1, 2, "custom"]);
    expect(getUnlockedTiers(10)).toEqual([1, 2, 3, "custom"]);
    expect(getUnlockedTiers(15)).toEqual([1, 2, 3, 4, "custom"]);
  });

  it("matches the intended mode distribution when context is available", () => {
    const word = makeWord(1);
    const ratios = sampleModeRatios(() => pickMode(word));

    expect(ratios.association).toBeGreaterThan(0.1);
    expect(ratios.association).toBeLessThan(0.2);
    expect(ratios.speed).toBeGreaterThan(0.1);
    expect(ratios.speed).toBeLessThan(0.2);
    expect(ratios.context).toBeGreaterThan(0.25);
    expect(ratios.context).toBeLessThan(0.35);
    expect(ratios.recall).toBeGreaterThan(0.35);
    expect(ratios.recall).toBeLessThan(0.45);
  });

  it("biases fluent-mode weighting toward the strongest RPG stat", () => {
    const word = makeWord(1);
    const fluentProfile: RetrievalDrillProfile = {
      stage: "fluent",
      exactStreak: 3,
      recentCueRate: 0,
      recentFailureCount: 0,
      recallHintEnabled: false,
      rapidTimeoutMs: 3200,
      rapidCueRevealMs: null,
    };

    const baseline = sampleModeRatios(() =>
      pickMode(word, undefined, fluentProfile, {
        recall: 10,
        retention: 10,
        perception: 10,
        creativity: 10,
      }),
    );

    const recallFocused = sampleModeRatios(() =>
      pickMode(word, undefined, fluentProfile, {
        recall: 40,
        retention: 10,
        perception: 5,
        creativity: 5,
      }),
    );

    const perceptionFocused = sampleModeRatios(() =>
      pickMode(word, undefined, fluentProfile, {
        recall: 5,
        retention: 10,
        perception: 40,
        creativity: 5,
      }),
    );

    const creativityFocused = sampleModeRatios(() =>
      pickMode(word, undefined, fluentProfile, {
        recall: 5,
        retention: 10,
        perception: 5,
        creativity: 40,
      }),
    );

    expect(recallFocused.recall).toBeGreaterThan(baseline.recall + 0.03);
    expect(perceptionFocused.speed).toBeGreaterThan(baseline.speed + 0.03);
    expect(creativityFocused.association).toBeGreaterThan(baseline.association + 0.02);
  });

  it("keeps rescue drilling recall-first even when perception is much higher", () => {
    const word = makeWord(1, 1, {
      source: "speech",
      weakSubstitute: "thing",
      context: "I kept saying thing instead of the right word.",
      capturedAt: "2026-04-10T08:00:00.000Z",
      count: 2,
      triageStatus: "accepted",
    });

    const rescueProfile: RetrievalDrillProfile = {
      stage: "rescue",
      exactStreak: 0,
      recentCueRate: 0.5,
      recentFailureCount: 2,
      recallHintEnabled: true,
      rapidTimeoutMs: 5600,
      rapidCueRevealMs: 3400,
    };

    const balanced = sampleModeRatios(() =>
      pickMode(word, undefined, rescueProfile, {
        recall: 20,
        retention: 20,
        perception: 20,
        creativity: 20,
      }),
    );

    const perceptionFocused = sampleModeRatios(() =>
      pickMode(word, undefined, rescueProfile, {
        recall: 5,
        retention: 10,
        perception: 40,
        creativity: 5,
      }),
    );

    expect(perceptionFocused.speed).toBeGreaterThan(balanced.speed + 0.02);
    expect(perceptionFocused.recall).toBeGreaterThan(perceptionFocused.speed);
    expect(perceptionFocused.recall).toBeGreaterThan(0.45);
  });

  it("biases TOT-captured words toward recall and rapid retrieval", () => {
    const word = makeWord(1, 1, {
      source: "speech",
      weakSubstitute: "thing",
      context: "I kept saying thing instead of the right word.",
      capturedAt: "2026-04-10T08:00:00.000Z",
      count: 2,
      triageStatus: "accepted",
    });

    const ratios = sampleModeRatios(() => pickMode(word));

    expect(ratios.recall).toBeGreaterThan(0.4);
    expect(ratios.speed).toBeGreaterThan(0.3);
    expect(ratios.context).toBeLessThan(0.2);
    expect(ratios.association).toBeLessThan(0.15);
  });

  it("tightens rescue timers when perception is stronger while keeping rescue safeguards", () => {
    const word = makeWord(1, 1, {
      source: "speech",
      capturedAt: "2026-04-10T07:00:00.000Z",
      count: 2,
    });
    const logs = [
      makeReviewLog(1, "2026-04-10T11:45:00.000Z", {
        rating: 1,
        correct: false,
        responseTimeMs: 5400,
        retrievalKind: "failed",
      }),
      makeReviewLog(1, "2026-04-09T09:10:00.000Z", {
        rating: 2,
        cueLevel: 1,
        responseTimeMs: 4300,
        retrievalKind: "assisted",
      }),
    ];

    const lowPerception = buildRetrievalDrillProfile(word, logs, {
      recall: 20,
      retention: 12,
      perception: 4,
      creativity: 8,
    });
    const highPerception = buildRetrievalDrillProfile(word, logs, {
      recall: 20,
      retention: 12,
      perception: 42,
      creativity: 8,
    });

    expect(lowPerception.stage).toBe("rescue");
    expect(highPerception.stage).toBe("rescue");
    expect(highPerception.rapidTimeoutMs).toBeLessThan(lowPerception.rapidTimeoutMs);
    expect(highPerception.rapidTimeoutMs).toBeGreaterThanOrEqual(4500);
    expect(highPerception.recallHintEnabled).toBe(true);
  });

  it("delays rescue cue reveal in stabilize stage when recall is stronger", () => {
    const word = makeWord(1);
    const logs = [
      makeReviewLog(1, "2026-04-10T11:45:00.000Z", {
        responseTimeMs: 2600,
      }),
    ];

    const lowRecall = buildRetrievalDrillProfile(word, logs, {
      recall: 4,
      retention: 12,
      perception: 20,
      creativity: 8,
    });
    const highRecall = buildRetrievalDrillProfile(word, logs, {
      recall: 44,
      retention: 12,
      perception: 20,
      creativity: 8,
    });

    expect(lowRecall.stage).toBe("stabilize");
    expect(highRecall.stage).toBe("stabilize");
    expect(lowRecall.rapidCueRevealMs).not.toBeNull();
    expect(highRecall.rapidCueRevealMs).not.toBeNull();
    expect((highRecall.rapidCueRevealMs ?? 0)).toBeGreaterThan(lowRecall.rapidCueRevealMs ?? 0);
  });

  it("keeps fluent safeguards even when stats differ", () => {
    const word = makeWord(1);
    const logs = [
      makeReviewLog(1, "2026-04-10T11:45:00.000Z", {
        responseTimeMs: 1900,
      }),
      makeReviewLog(1, "2026-04-09T11:45:00.000Z", {
        responseTimeMs: 2000,
      }),
      makeReviewLog(1, "2026-04-08T11:45:00.000Z", {
        responseTimeMs: 2100,
      }),
    ];

    const lowStats = buildRetrievalDrillProfile(word, logs, {
      recall: 2,
      retention: 2,
      perception: 2,
      creativity: 2,
    });
    const highStats = buildRetrievalDrillProfile(word, logs, {
      recall: 50,
      retention: 35,
      perception: 45,
      creativity: 30,
    });

    expect(lowStats.stage).toBe("fluent");
    expect(highStats.stage).toBe("fluent");
    expect(lowStats.recallHintEnabled).toBe(false);
    expect(highStats.recallHintEnabled).toBe(false);
    expect(lowStats.rapidCueRevealMs).toBeNull();
    expect(highStats.rapidCueRevealMs).toBeNull();
  });

  it("always grades association create prompts as Good", async () => {
    const sessionWord = makeSessionWord(1);
    const updatedCard = makeReviewCard(1);
    schedulerMock.gradeCard.mockResolvedValue(updatedCard);

    const { result } = await processAnswer(
      sessionWord,
      "any mnemonic",
      2000,
      "session-1",
      "association",
      "__create__",
    );

    expect(result).toEqual({
      wordId: 1,
      word: "word-1",
      correct: true,
      responseTimeMs: 2000,
      rating: 3,
      mode: "association",
      cueLevel: 0,
      retrievalKind: "created",
    });
    expect(schedulerMock.gradeCard).toHaveBeenCalledWith(sessionWord.reviewCard, 3);
    expect(dbMock.reviewLogs.add).toHaveBeenCalledWith(
      expect.objectContaining({
        wordId: 1,
        sessionId: "session-1",
        rating: 3,
        correct: true,
        cueLevel: 0,
        retrievalKind: "created",
      }),
    );
  });

  it("advances pipeline stage after clean recall without changing FSRS grading", async () => {
    const sessionWord: SessionWord = {
      ...makeSessionWord(1),
      word: {
        ...makeWord(1),
        pipelineStage: "learning",
      },
    };
    const updatedCard = makeReviewCard(1);
    schedulerMock.gradeCard.mockResolvedValue(updatedCard);
    mockWordLogs([
      makeReviewLog(1, "2026-04-10T11:45:00.000Z", {
        retrievalKind: "exact",
        correct: true,
      }),
    ]);

    await processAnswer(
      sessionWord,
      "word-1",
      1600,
      "session-1",
      "recall",
    );

    expect(schedulerMock.gradeCard).toHaveBeenCalledWith(
      sessionWord.reviewCard,
      3,
    );
    expect(dbMock.words.update).toHaveBeenCalledWith(1, {
      pipelineStage: "reviewing",
      pipelineUpdatedAt: "2026-04-10T12:00:00.000Z",
    });
  });

  it("does not demote mature words after successful production context", async () => {
    const sessionWord: SessionWord = {
      ...makeSessionWord(1),
      word: {
        ...makeWord(1),
        word: "meticulous",
        pipelineStage: "mature",
      },
    };
    schedulerMock.gradeCard.mockResolvedValue(sessionWord.reviewCard);
    mockWordLogs([
      makeReviewLog(1, "2026-04-10T11:45:00.000Z", {
        rating: 2,
        correct: true,
        retrievalKind: "assisted",
        contextPromptKind: "produce",
      }),
    ]);

    await processAnswer(
      sessionWord,
      "The inspector was meticulous during the final review.",
      2200,
      "session-1",
      "context",
      "meticulous",
      { contextPromptKind: "produce" },
    );

    expect(dbMock.words.update).not.toHaveBeenCalled();
  });

  it("treats production-context answers as assisted usage so they do not inflate clean recall", async () => {
    const sessionWord: SessionWord = {
      ...makeSessionWord(1),
      word: {
        ...makeWord(1),
        word: "meticulous",
      },
    };
    const updatedCard = makeReviewCard(1);
    schedulerMock.gradeCard.mockResolvedValue(updatedCard);

    const { result } = await processAnswer(
      sessionWord,
      "The inspector was meticulous during the final review.",
      2200,
      "session-1",
      "context",
      "meticulous",
      { contextPromptKind: "produce" },
    );

    expect(result).toEqual({
      wordId: 1,
      word: "meticulous",
      correct: true,
      responseTimeMs: 2200,
      rating: 2,
      mode: "context",
      cueLevel: 0,
      retrievalKind: "assisted",
      contextPromptKind: "produce",
    });
    expect(schedulerMock.gradeCard).toHaveBeenCalledWith(sessionWord.reviewCard, 2);
    expect(dbMock.reviewLogs.add).toHaveBeenCalledWith(
      expect.objectContaining({
        rating: 2,
        cueLevel: 0,
        retrievalKind: "assisted",
        contextPromptKind: "produce",
      }),
    );
  });

  it("treats transfer-style context answers as assisted usage so they do not inflate clean recall", async () => {
    const sessionWord = makeSessionWord(1);
    schedulerMock.gradeCard.mockResolvedValue(sessionWord.reviewCard);
    const sourceSentence = "The **weak** sentence confused everyone.";

    const { result } = await processAnswer(
      sessionWord,
      "The meticulous sentence confused everyone.",
      1800,
      "session-1",
      "context",
      "meticulous",
      {
        contextPromptKind: "rewrite",
        contextSourceSentence: sourceSentence,
      },
    );

    expect(result).toMatchObject({
      mode: "context",
      rating: 2,
      correct: true,
      retrievalKind: "assisted",
      contextPromptKind: "rewrite",
    });
    expect(dbMock.reviewLogs.add).toHaveBeenCalledWith(expect.objectContaining({
      rating: 2,
      retrievalKind: "assisted",
      contextPromptKind: "rewrite",
    }));
  });

  it("downgrades hinted recall to assisted retrieval in the review log", async () => {
    const sessionWord = makeSessionWord(1);
    const updatedCard = makeReviewCard(1);
    schedulerMock.gradeCard.mockResolvedValue(updatedCard);

    const { result } = await processAnswer(
      sessionWord,
      "word-1",
      2500,
      "session-1",
      "recall",
      undefined,
      { cueLevel: 1 },
    );

    expect(result).toEqual({
      wordId: 1,
      word: "word-1",
      correct: true,
      responseTimeMs: 2500,
      rating: 2,
      mode: "recall",
      cueLevel: 1,
      retrievalKind: "assisted",
    });
    expect(dbMock.reviewLogs.add).toHaveBeenCalledWith(
      expect.objectContaining({
        cueLevel: 1,
        retrievalKind: "assisted",
      }),
    );
  });

  it("creates a stable session id string", () => {
    const sessionId = createSessionId();

    expect(sessionId).toEqual(expect.any(String));
    expect(sessionId.length).toBeGreaterThan(8);
  });

  it("limits new words per day based on difficulty and words introduced today", async () => {
    schedulerMock.getDueCards.mockResolvedValue([makeReviewCard(1), makeReviewCard(2)]);
    schedulerMock.getNewCards.mockResolvedValue([makeReviewCard(3)]);
    dbMock.reviewLogs.toArray.mockResolvedValue(
      Array.from({ length: 9 }, (_, index) => makeTodayFirstReviewLog(index + 10)),
    );
    dbMock.words.get.mockImplementation(async (wordId: number) => makeWord(wordId));

    await loadSessionWords("normal", 1);

    expect(schedulerMock.getDueCards).toHaveBeenCalledWith(10);
    expect(schedulerMock.getNewCards).toHaveBeenCalledWith(1, [1, "custom"]);
  });

  it("does not count yesterday's introductions against today's new-word budget", async () => {
    schedulerMock.getDueCards.mockResolvedValue([makeReviewCard(1), makeReviewCard(2)]);
    schedulerMock.getNewCards.mockResolvedValue([
      makeReviewCard(3),
      makeReviewCard(4),
      makeReviewCard(5),
      makeReviewCard(6),
      makeReviewCard(7),
      makeReviewCard(8),
      makeReviewCard(9),
      makeReviewCard(10),
    ]);
    dbMock.reviewLogs.toArray.mockResolvedValue([
      {
        ...makeTodayFirstReviewLog(99),
        reviewedAt: new Date("2026-04-09T09:00:00.000Z"),
      },
    ]);
    dbMock.words.get.mockImplementation(async (wordId: number) => makeWord(wordId));

    await loadSessionWords("normal", 1);

    expect(schedulerMock.getNewCards).toHaveBeenCalledWith(8, [1, "custom"]);
  });

  it("includes due review cards even when they are above the current unlocked tier", async () => {
    schedulerMock.getDueCards.mockResolvedValue([makeReviewCard(30)]);
    schedulerMock.getNewCards.mockResolvedValue([]);
    dbMock.reviewLogs.toArray.mockResolvedValue([]);
    dbMock.words.get.mockResolvedValue(makeWord(30, 4));

    const sessionWords = await loadSessionWords("easy", 1);

    expect(sessionWords).toHaveLength(1);
    expect(sessionWords[0].word.tier).toBe(4);
    expect(schedulerMock.getNewCards).toHaveBeenCalledWith(5, [1, "custom"]);
  });

  it("prioritizes TOT-captured words within due and new buckets", async () => {
    schedulerMock.getDueCards.mockResolvedValue([
      makeReviewCard(1, 1),
      makeReviewCard(2, 1),
    ]);
    schedulerMock.getNewCards.mockResolvedValue([
      makeReviewCard(3, 0),
      makeReviewCard(4, 0),
    ]);
    dbMock.reviewLogs.toArray.mockResolvedValue([]);
    dbMock.words.get.mockImplementation(async (wordId: number) => {
      if (wordId === 2) {
        return makeWord(2, 1, {
          source: "speech",
          capturedAt: "2026-04-10T09:00:00.000Z",
          count: 1,
          triageStatus: "accepted",
        });
      }

      if (wordId === 4) {
        return makeWord(4, 1, {
          source: "writing",
          capturedAt: "2026-04-10T10:00:00.000Z",
          count: 3,
          triageStatus: "accepted",
        });
      }

      return makeWord(wordId);
    });

    const sessionWords = await loadSessionWords("easy", 1);

    expect(sessionWords.map((entry) => entry.word.id)).toEqual([2, 1, 4, 3]);
  });

  it("keeps recent TOT words in rescue drilling until clean exact recalls return", async () => {
    schedulerMock.getDueCards.mockResolvedValue([makeReviewCard(1, 1)]);
    schedulerMock.getNewCards.mockResolvedValue([]);
    dbMock.reviewLogs.toArray.mockResolvedValue([
      makeReviewLog(1, "2026-04-10T11:45:00.000Z", {
        rating: 1,
        correct: false,
        responseTimeMs: 5400,
        retrievalKind: "failed",
      }),
      makeReviewLog(1, "2026-04-09T08:00:00.000Z", {
        rating: 2,
        cueLevel: 1,
        responseTimeMs: 4200,
        retrievalKind: "assisted",
      }),
    ]);
    dbMock.words.get.mockResolvedValue(
      makeWord(1, 1, {
        source: "speech",
        capturedAt: "2026-04-10T07:00:00.000Z",
        count: 2,
      }),
    );

    const [sessionWord] = await loadSessionWords("easy", 1);

    expect(sessionWord.drillProfile).toMatchObject({
      stage: "rescue",
      exactStreak: 0,
      recallHintEnabled: true,
      recentFailureCount: 1,
    });
    expect(sessionWord.drillProfile?.rapidTimeoutMs).toBeGreaterThanOrEqual(4800);
    expect(sessionWord.drillProfile?.rapidCueRevealMs).not.toBeNull();
  });

  it("attaches practice lane routes from vocabulary coverage when loading session words", async () => {
    schedulerMock.getDueCards.mockResolvedValue([makeReviewCard(1, 1)]);
    schedulerMock.getNewCards.mockResolvedValue([]);
    dbMock.reviewLogs.toArray.mockResolvedValue([
      makeReviewLog(1, "2026-04-09T11:45:00.000Z", {
        retrievalKind: "exact",
        correct: true,
      }),
    ]);
    dbMock.words.get.mockResolvedValue(makeWord(1));

    const [sessionWord] = await loadSessionWords("easy", 1);

    expect(sessionWord.practiceLaneRoute).toEqual({
      itemId: 1,
      lane: "context",
      reason: "missing-context",
    });
  });

  it("backs off hints after repeated clean exact recalls on a TOT word", async () => {
    schedulerMock.getDueCards.mockResolvedValue([makeReviewCard(1, 1)]);
    schedulerMock.getNewCards.mockResolvedValue([]);
    dbMock.reviewLogs.toArray.mockResolvedValue([
      makeReviewLog(1, "2026-04-10T11:45:00.000Z", {
        responseTimeMs: 1700,
      }),
      makeReviewLog(1, "2026-04-09T11:45:00.000Z", {
        responseTimeMs: 1900,
      }),
      makeReviewLog(1, "2026-04-08T11:45:00.000Z", {
        responseTimeMs: 2100,
      }),
    ]);
    dbMock.words.get.mockResolvedValue(
      makeWord(1, 1, {
        source: "speech",
        capturedAt: "2026-04-05T07:00:00.000Z",
        count: 1,
      }),
    );

    const [sessionWord] = await loadSessionWords("easy", 1);

    expect(sessionWord.drillProfile).toMatchObject({
      stage: "fluent",
      exactStreak: 3,
      recallHintEnabled: false,
      recentFailureCount: 0,
    });
    expect(sessionWord.drillProfile?.rapidTimeoutMs).toBeLessThan(5000);
    expect(sessionWord.drillProfile?.rapidCueRevealMs).toBeNull();
  });

  it("returns only the new words available today for the selected difficulty", async () => {
    schedulerMock.getNewCards.mockResolvedValue([
      makeReviewCard(1),
      makeReviewCard(2),
    ]);
    dbMock.reviewLogs.toArray.mockResolvedValue(
      Array.from({ length: 3 }, (_, index) => makeTodayFirstReviewLog(index + 10)),
    );

    const count = await getAvailableNewCount("easy", 1);

    expect(count).toBe(2);
    expect(schedulerMock.getNewCards).toHaveBeenCalledWith(2, [1, "custom"]);
  });

  it("does not backfill new words when the daily new-word budget is exhausted", async () => {
    schedulerMock.getDueCards.mockResolvedValue([makeReviewCard(1), makeReviewCard(2)]);
    schedulerMock.getNewCards.mockResolvedValue([]);
    dbMock.reviewLogs.toArray.mockResolvedValue(
      Array.from({ length: 10 }, (_, index) => makeTodayFirstReviewLog(index + 10)),
    );
    dbMock.words.get.mockImplementation(async (wordId: number) => makeWord(wordId));

    const sessionWords = await loadSessionWords("normal", 1);

    expect(sessionWords).toHaveLength(2);
    expect(sessionWords.map((entry) => entry.word.id)).toEqual([1, 2]);
    expect(schedulerMock.getNewCards).not.toHaveBeenCalled();
  });

  it("delegates session finalization to the gamification layer", async () => {
    const summary = {
      results: [makeResult()],
      totalCorrect: 1,
      totalWords: 1,
      xpEarned: 65,
      leveledUp: false,
      statGains: {},
      averageResponseTimeMs: 2000,
    };
    completeSessionMock.mockResolvedValue(summary);

    await expect(finalizeSession(summary.results)).resolves.toEqual(summary);
    expect(completeSessionMock).toHaveBeenCalledWith(summary.results);
  });
});

function makeResult() {
  return {
    wordId: 1,
    word: "word-1",
    correct: true,
    responseTimeMs: 2000,
    rating: 3 as const,
    mode: "recall" as const,
  };
}
