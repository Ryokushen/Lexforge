import { db } from "./db";
import { toLocalDateKey } from "./date";
import { getDueCards, getNewCards, gradeCard, Rating } from "./scheduler";
import { completeSession } from "./gamification";
import { CONTEXT_SENTENCES } from "./context-sentences";
import type {
  AnswerMetadata,
  CueLevel,
  ContextSentence,
  Difficulty,
  GameMode,
  RetrievalKind,
  ReviewCard,
  ReviewLog,
  SessionResult,
  SessionSummary,
  SessionWord,
  Word,
} from "./types";
import { DIFFICULTY_CONFIG, TIER_UNLOCK_LEVELS } from "./types";

const BATCH_SIZE = 4; // working memory capacity
type GradeResult = {
  rating: 1 | 2 | 3 | 4;
  correct: boolean;
  cueLevel: CueLevel;
  retrievalKind: RetrievalKind;
};

function normalizeCueLevel(cueLevel?: CueLevel): CueLevel {
  return cueLevel === 1 ? 1 : 0;
}

export function createSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Levenshtein distance for fuzzy matching. */
function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0),
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/** Auto-grade an answer based on edit distance. */
export function autoGrade(
  answer: string,
  expected: string,
  cueLevel: CueLevel = 0,
): GradeResult {
  const a = answer.trim().toLowerCase();
  const e = expected.trim().toLowerCase();
  const normalizedCueLevel = normalizeCueLevel(cueLevel);

  if (a === e) {
    if (normalizedCueLevel > 0) {
      return { rating: 2, correct: true, cueLevel: normalizedCueLevel, retrievalKind: "assisted" };
    }
    return { rating: 3, correct: true, cueLevel: normalizedCueLevel, retrievalKind: "exact" };
  }

  if (editDistance(a, e) <= 1) {
    return { rating: 2, correct: true, cueLevel: normalizedCueLevel, retrievalKind: "approximate" };
  }

  return { rating: 1, correct: false, cueLevel: normalizedCueLevel, retrievalKind: "failed" };
}

/** Grade a context mode answer (multiple choice — exact match only). */
export function gradeContextAnswer(
  answer: string,
  expected: string,
  cueLevel: CueLevel = 0,
): GradeResult {
  return autoGrade(answer, expected, cueLevel);
}

const SPEED_FAST_MS = 3000;

/** Grade a rapid retrieval answer: fast clean recall scores higher. */
export function gradeSpeedAnswer(
  answer: string,
  expected: string,
  responseTimeMs: number,
  cueLevel: CueLevel = 0,
): GradeResult {
  const a = answer.trim().toLowerCase();
  const e = expected.trim().toLowerCase();
  const normalizedCueLevel = normalizeCueLevel(cueLevel);

  if (a === e) {
    if (normalizedCueLevel > 0) {
      return { rating: 2, correct: true, cueLevel: normalizedCueLevel, retrievalKind: "assisted" };
    }
    if (responseTimeMs < SPEED_FAST_MS) {
      return { rating: 4, correct: true, cueLevel: normalizedCueLevel, retrievalKind: "exact" };
    }
    return { rating: 3, correct: true, cueLevel: normalizedCueLevel, retrievalKind: "exact" };
  }
  if (editDistance(a, e) <= 1) {
    return { rating: 2, correct: true, cueLevel: normalizedCueLevel, retrievalKind: "approximate" };
  }
  return { rating: 1, correct: false, cueLevel: normalizedCueLevel, retrievalKind: "failed" };
}

/** Get a random context sentence for a word, if available. */
export function getContextSentence(word: Word): ContextSentence | null {
  // Check word's own context sentences first
  if (word.contextSentences && word.contextSentences.length > 0) {
    return word.contextSentences[
      Math.floor(Math.random() * word.contextSentences.length)
    ];
  }
  // Fall back to the global context sentence bank
  const sentences = CONTEXT_SENTENCES[word.word];
  if (sentences && sentences.length > 0) {
    return sentences[Math.floor(Math.random() * sentences.length)];
  }
  return null;
}

/** Decide game mode for a session word. Mix of all four modes. */
export function pickMode(word: Word, forceMode?: GameMode): GameMode {
  if (forceMode) return forceMode;
  const roll = Math.random();
  // ~15% association, ~15% speed, ~30% context (if available), ~40% recall
  if (roll < 0.15) return "association";
  if (roll < 0.30) return "speed";
  const hasContext = getContextSentence(word) !== null;
  if (hasContext && roll < 0.60) return "context";
  return "recall";
}

/** Get unlocked tiers for a given level. */
export function getUnlockedTiers(level: number): (1 | 2 | 3 | "custom")[] {
  const tiers: (1 | 2 | 3 | "custom")[] = [];
  for (const [tier, unlockLevel] of Object.entries(TIER_UNLOCK_LEVELS)) {
    if (level >= unlockLevel) {
      tiers.push(tier === "custom" ? "custom" : (Number(tier) as 1 | 2 | 3));
    }
  }
  return tiers;
}

/** Count how many new words were introduced today. */
async function getNewWordsIntroducedToday(): Promise<number> {
  const today = toLocalDateKey(new Date());
  const logs = await db.reviewLogs.toArray();
  // Count unique wordIds reviewed today that were first-time reviews
  const todayLogs = logs.filter(
    (l) => toLocalDateKey(l.reviewedAt) === today,
  );
  const wordIds = new Set(todayLogs.map((l) => l.wordId));

  // Check which of those were their first-ever review
  let newCount = 0;
  for (const wordId of wordIds) {
    const allLogsForWord = logs.filter((l) => l.wordId === wordId);
    const firstReview = allLogsForWord.sort(
      (a, b) => a.reviewedAt.getTime() - b.reviewedAt.getTime(),
    )[0];
    if (firstReview && toLocalDateKey(firstReview.reviewedAt) === today) {
      newCount++;
    }
  }
  return newCount;
}

/** Load words for a session: due cards first, backfill with new (respecting limits). */
export async function loadSessionWords(
  difficulty: Difficulty = "normal",
  level: number = 1,
): Promise<SessionWord[]> {
  const config = DIFFICULTY_CONFIG[difficulty];
  const sessionSize = config.sessionSize;
  const unlockedTiers = getUnlockedTiers(level);

  // Load due cards first (always allowed, no limit)
  const dueCards = await getDueCards(sessionSize);
  let cards = [...dueCards];

  // Backfill with new cards, respecting daily limit and tier gating
  if (cards.length < sessionSize) {
    const newWordsToday = await getNewWordsIntroducedToday();
    const remainingNewAllowed = Math.max(0, config.newWordsPerDay - newWordsToday);
    const slotsForNew = Math.min(sessionSize - cards.length, remainingNewAllowed);

    if (slotsForNew > 0) {
      const newCards = await getNewCards(slotsForNew, unlockedTiers);
      cards = [...cards, ...newCards];
    }
  }

  // Resolve words
  const sessionWords: SessionWord[] = [];
  for (const rc of cards) {
    const word = await db.words.get(rc.wordId);
    if (word) {
      sessionWords.push({ word, reviewCard: rc });
    }
  }

  return sessionWords;
}

/** Get the count of new words currently available under today's limits. */
export async function getAvailableNewCount(
  difficulty: Difficulty = "normal",
  level: number = 1,
): Promise<number> {
  const config = DIFFICULTY_CONFIG[difficulty];
  const newWordsToday = await getNewWordsIntroducedToday();
  const remainingNewAllowed = Math.max(
    0,
    config.newWordsPerDay - newWordsToday,
  );

  if (remainingNewAllowed === 0) return 0;

  const unlockedTiers = getUnlockedTiers(level);
  const newCards = await getNewCards(remainingNewAllowed, unlockedTiers);
  return newCards.length;
}

/** Get the current batch from session words. */
export function getCurrentBatch(
  words: SessionWord[],
  currentIndex: number,
): SessionWord[] {
  const batchStart =
    Math.floor(currentIndex / BATCH_SIZE) * BATCH_SIZE;
  return words.slice(batchStart, batchStart + BATCH_SIZE);
}

/** Process a single answer: grade the card, log the review, return result. */
export async function processAnswer(
  sessionWord: SessionWord,
  answer: string,
  responseTimeMs: number,
  sessionId?: string,
  mode: GameMode = "recall",
  contextExpected?: string,
  answerMetadata?: AnswerMetadata,
): Promise<{ result: SessionResult; updatedCard: ReviewCard }> {
  let gradeResult: GradeResult;
  const cueLevel = normalizeCueLevel(answerMetadata?.cueLevel);

  if (mode === "association" && contextExpected === "__create__") {
    // Creating an association is always Good
    gradeResult = {
      rating: 3,
      correct: true,
      cueLevel,
      retrievalKind: "created",
    };
  } else if (mode === "speed" && contextExpected) {
    gradeResult = gradeSpeedAnswer(answer, contextExpected, responseTimeMs, cueLevel);
  } else if (mode === "context" && contextExpected) {
    gradeResult = gradeContextAnswer(answer, contextExpected, cueLevel);
  } else {
    gradeResult = autoGrade(answer, sessionWord.word.word, cueLevel);
  }

  const {
    rating,
    correct,
    cueLevel: resolvedCueLevel,
    retrievalKind,
  } = gradeResult;

  // Map our rating to ts-fsrs Rating
  const fsrsRating =
    rating === 1
      ? Rating.Again
      : rating === 2
        ? Rating.Hard
        : rating === 3
          ? Rating.Good
          : Rating.Easy;

  // Grade the card
  const updatedCard = await gradeCard(sessionWord.reviewCard, fsrsRating);

  // Log the review
  const log: ReviewLog = {
    wordId: sessionWord.word.id!,
    sessionId,
    rating,
    responseTimeMs,
    correct,
    cueLevel: resolvedCueLevel,
    retrievalKind,
    reviewedAt: new Date(),
  };
  await db.reviewLogs.add(log);

  const result: SessionResult = {
    wordId: sessionWord.word.id!,
    word: sessionWord.word.word,
    correct,
    responseTimeMs,
    rating,
    mode,
    cueLevel: resolvedCueLevel,
    retrievalKind,
  };

  return { result, updatedCard };
}

/** Finalize the session and update profile. */
export async function finalizeSession(
  results: SessionResult[],
): Promise<SessionSummary> {
  return completeSession(results);
}
