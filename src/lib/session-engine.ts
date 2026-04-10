import { db } from "./db";
import { getDueCards, getNewCards, gradeCard, Rating } from "./scheduler";
import { completeSession } from "./gamification";
import { CONTEXT_SENTENCES } from "./context-sentences";
import type {
  ContextSentence,
  GameMode,
  ReviewCard,
  ReviewLog,
  SessionResult,
  SessionSummary,
  SessionWord,
  Word,
} from "./types";

const SESSION_SIZE = 10;
const BATCH_SIZE = 4; // working memory capacity

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
): { rating: 1 | 2 | 3 | 4; correct: boolean } {
  const a = answer.trim().toLowerCase();
  const e = expected.trim().toLowerCase();

  if (a === e) return { rating: 3, correct: true }; // Good
  if (editDistance(a, e) <= 1) return { rating: 2, correct: true }; // Hard (close)
  return { rating: 1, correct: false }; // Again
}

/** Grade a context mode answer (multiple choice — exact match only). */
export function gradeContextAnswer(
  answer: string,
  expected: string,
): { rating: 1 | 2 | 3 | 4; correct: boolean } {
  const a = answer.trim().toLowerCase();
  const e = expected.trim().toLowerCase();
  if (a === e) return { rating: 3, correct: true };
  return { rating: 1, correct: false };
}

const SPEED_FAST_MS = 3000;
const SPEED_TIMEOUT_MS = 8000;

/** Grade a speed mode answer: time-based rating. */
export function gradeSpeedAnswer(
  answer: string,
  expected: string,
  responseTimeMs: number,
): { rating: 1 | 2 | 3 | 4; correct: boolean } {
  const a = answer.trim().toLowerCase();
  const e = expected.trim().toLowerCase();
  if (a !== e) return { rating: 1, correct: false };
  if (responseTimeMs < SPEED_FAST_MS) return { rating: 4, correct: true }; // Easy
  return { rating: 3, correct: true }; // Good
}

/** Get 4 definition choices for speed mode: correct + 3 distractors. */
export function getSpeedChoices(
  word: Word,
  allWords: SessionWord[],
): { definitions: string[]; correctDefinition: string } {
  const correctDef = word.definition;
  const otherDefs = allWords
    .filter((sw) => sw.word.id !== word.id)
    .map((sw) => sw.word.definition);

  // Shuffle and pick 3 distractors
  const shuffled = [...otherDefs].sort(() => Math.random() - 0.5);
  const distractors = shuffled.slice(0, 3);

  // Combine and shuffle
  const definitions = [...distractors, correctDef].sort(() => Math.random() - 0.5);

  return { definitions, correctDefinition: correctDef };
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

/** Decide game mode for a session word. Mix of recall, context, and speed. */
export function pickMode(word: Word, forceMode?: GameMode): GameMode {
  if (forceMode) return forceMode;
  const roll = Math.random();
  // ~20% speed, ~30% context (if available), ~50% recall
  if (roll < 0.2) return "speed";
  const hasContext = getContextSentence(word) !== null;
  if (hasContext && roll < 0.5) return "context";
  return "recall";
}

/** Load words for a session: due cards first, backfill with new. */
export async function loadSessionWords(): Promise<SessionWord[]> {
  const dueCards = await getDueCards(SESSION_SIZE);
  let cards = [...dueCards];

  if (cards.length < SESSION_SIZE) {
    const newCards = await getNewCards(SESSION_SIZE - cards.length);
    cards = [...cards, ...newCards];
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
  mode: GameMode = "recall",
  contextExpected?: string,
  manualRating?: 1 | 2 | 3 | 4,
): Promise<{ result: SessionResult; updatedCard: ReviewCard }> {
  let gradeResult: { rating: 1 | 2 | 3 | 4; correct: boolean };

  if (manualRating) {
    gradeResult = { rating: manualRating, correct: manualRating >= 2 };
  } else if (mode === "speed" && contextExpected) {
    gradeResult = gradeSpeedAnswer(answer, contextExpected, responseTimeMs);
  } else if (mode === "context" && contextExpected) {
    gradeResult = gradeContextAnswer(answer, contextExpected);
  } else {
    gradeResult = autoGrade(answer, sessionWord.word.word);
  }

  const { rating, correct } = gradeResult;

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
    rating,
    responseTimeMs,
    correct,
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
  };

  return { result, updatedCard };
}

/** Finalize the session and update profile. */
export async function finalizeSession(
  results: SessionResult[],
): Promise<SessionSummary> {
  return completeSession(results);
}
