import { db } from "./db";
import { toLocalDateKey } from "./date";
import { getDueCards, getNewCards, gradeCard, Rating } from "./scheduler";
import { completeSession } from "./gamification";
import { CONTEXT_SENTENCES } from "./context-sentences";
import type {
  AnswerMetadata,
  CueLevel,
  ContextPrompt,
  ContextSentence,
  Difficulty,
  GameMode,
  RetrievalKind,
  RetrievalDrillProfile,
  ReviewCard,
  ReviewLog,
  RPGStats,
  SessionResult,
  SessionSummary,
  SessionWord,
  Word,
} from "./types";
import { DIFFICULTY_CONFIG, TIER_UNLOCK_LEVELS } from "./types";

const BATCH_SIZE = 4; // working memory capacity
const DEFAULT_RAPID_TIMEOUT_MS = 3500; // retrieval-only baseline (reading excluded)
const SPEED_FAST_RATIO = 0.6; // "fast" = under 60% of timeout
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

function normalizeProductionText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{M}+/gu, "")
    .replace(/[’ʼ`]/gu, "'")
    .replace(/[‐‑‒–—―]/gu, "-")
    .replace(/[^\p{L}\p{N}'-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeProductionText(value: string): string[] {
  const normalized = normalizeProductionText(value);
  return normalized.match(/[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*/gu) ?? [];
}

function findPhraseMatch(
  answerTokens: string[],
  expectedTokens: string[],
): { kind: "exact" | "approximate"; start: number; length: number } | null {
  if (expectedTokens.length === 0 || answerTokens.length < expectedTokens.length) {
    return null;
  }

  const expectedPhrase = expectedTokens.join(" ");
  let approximateMatch: { start: number; length: number } | null = null;

  for (let index = 0; index <= answerTokens.length - expectedTokens.length; index += 1) {
    const windowPhrase = answerTokens
      .slice(index, index + expectedTokens.length)
      .join(" ");

    if (windowPhrase === expectedPhrase) {
      return { kind: "exact", start: index, length: expectedTokens.length };
    }

    if (!approximateMatch && editDistance(windowPhrase, expectedPhrase) <= 1) {
      approximateMatch = { start: index, length: expectedTokens.length };
    }
  }

  if (!approximateMatch) {
    return null;
  }

  return { kind: "approximate", ...approximateMatch };
}

const LIKELY_VERB_TOKENS = new Set([
  "am",
  "appear",
  "appeared",
  "appears",
  "are",
  "be",
  "became",
  "become",
  "becomes",
  "been",
  "being",
  "can",
  "could",
  "did",
  "do",
  "does",
  "feel",
  "feels",
  "felt",
  "find",
  "finds",
  "found",
  "had",
  "has",
  "have",
  "is",
  "keep",
  "keeps",
  "kept",
  "look",
  "looked",
  "looks",
  "made",
  "make",
  "makes",
  "matter",
  "matters",
  "may",
  "mean",
  "means",
  "meant",
  "might",
  "must",
  "remain",
  "remained",
  "remains",
  "said",
  "say",
  "says",
  "seem",
  "seemed",
  "seems",
  "should",
  "show",
  "showed",
  "shown",
  "shows",
  "sound",
  "sounded",
  "sounds",
  "stay",
  "stayed",
  "stays",
  "was",
  "were",
  "will",
  "work",
  "worked",
  "works",
  "would",
]);

const LIKELY_PERSONAL_SUBJECT_TOKENS = new Set([
  "he",
  "i",
  "it",
  "she",
  "they",
  "we",
  "you",
]);

const LIKELY_OBJECT_CUE_TOKENS = new Set([
  "a",
  "an",
  "her",
  "him",
  "his",
  "it",
  "me",
  "my",
  "our",
  "the",
  "their",
  "them",
  "these",
  "this",
  "those",
  "us",
  "your",
]);

const LIKELY_ADVERBIAL_TAIL_TOKENS = new Set([
  "already",
  "earlier",
  "here",
  "later",
  "now",
  "soon",
  "there",
  "today",
  "tomorrow",
  "yesterday",
]);

const DISALLOWED_CLAUSE_CONTINUATION_TOKENS = new Set([
  "about",
  "after",
  "and",
  "at",
  "because",
  "before",
  "but",
  "by",
  "during",
  "for",
  "from",
  "if",
  "in",
  "into",
  "of",
  "on",
  "onto",
  "or",
  "to",
  "when",
  "while",
  "with",
  "without",
]);

const CONTEXT_ANCHOR_STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "if",
  "in",
  "into",
  "is",
  "it",
  "of",
  "on",
  "or",
  "the",
  "to",
  "was",
  "were",
  "with",
]);

function isTransferContextPromptKind(kind?: ContextPrompt["kind"]): boolean {
  return kind === "produce" || kind === "rewrite";
}

function getContextAnchorTokens(sourceSentence?: string): string[] {
  if (!sourceSentence) {
    return [];
  }

  const highlightedWeakWordMatch = sourceSentence.match(/\*\*([^*]+)\*\*/);
  const weakWordTokens = new Set(tokenizeProductionText(highlightedWeakWordMatch?.[1] ?? ""));

  return [...new Set(tokenizeProductionText(sourceSentence).filter(
    (token) => !CONTEXT_ANCHOR_STOPWORDS.has(token) && !weakWordTokens.has(token),
  ))];
}

function hasContextAnchorOverlap(answerTokens: string[], sourceSentence?: string): boolean {
  const anchorTokens = getContextAnchorTokens(sourceSentence);
  if (anchorTokens.length === 0) {
    return false;
  }

  const overlapCount = anchorTokens.filter((token) => answerTokens.includes(token)).length;
  return overlapCount >= Math.min(2, anchorTokens.length);
}

function isLikelyDerivedVerbToken(token: string): boolean {
  return /(?:ed|ing|ize|ise|ify|ate|en)$/.test(token);
}

function isLikelyModifierToken(token: string): boolean {
  return /(?:ous|ful|ive|al|ic|less|able|ible|ary|ory|ent|ant|ish|ed)$/.test(token);
}

function hasLikelyDerivedPredicate(tokens: string[]): boolean {
  return tokens.some((token, index) => {
    if (!isLikelyDerivedVerbToken(token) || index < 2) {
      return false;
    }

    const nextToken = tokens[index + 1];
    if (!nextToken) {
      return false;
    }

    const onlyTrailingToken = index === tokens.length - 2;
    if (onlyTrailingToken && (nextToken.endsWith("ly") || LIKELY_ADVERBIAL_TAIL_TOKENS.has(nextToken))) {
      return false;
    }

    const previousToken = tokens[index - 1];
    const leadingToken = tokens[index - 2];
    if (LIKELY_PERSONAL_SUBJECT_TOKENS.has(previousToken) || LIKELY_VERB_TOKENS.has(previousToken)) {
      return true;
    }

    if (DISALLOWED_CLAUSE_CONTINUATION_TOKENS.has(previousToken)) {
      return false;
    }

    if (
      index === 2
      && LIKELY_OBJECT_CUE_TOKENS.has(leadingToken)
      && isLikelyModifierToken(previousToken)
    ) {
      return false;
    }

    return true;
  });
}

function hasClauseTail(tokens: string[]): boolean {
  if (tokens.length < 2 || DISALLOWED_CLAUSE_CONTINUATION_TOKENS.has(tokens[0])) {
    return false;
  }

  return tokens.some((token) => LIKELY_OBJECT_CUE_TOKENS.has(token) || token.endsWith("ly"));
}

function hasSingleSentenceShape(
  answer: string,
  tokens: string[],
  phraseMatch: { kind: "exact" | "approximate"; start: number; length: number } | null,
): boolean {
  const trimmed = answer.trim();
  if (trimmed.length === 0 || trimmed.includes("\n")) {
    return false;
  }

  const sentenceBreaks = [...trimmed.matchAll(/[.!?]+/g)];
  const hasInternalSentenceBreak = sentenceBreaks.some(
    (match) => ((match.index ?? 0) + match[0].length) < trimmed.length,
  );
  if (hasInternalSentenceBreak) {
    return false;
  }

  const tokensAfterPhrase = phraseMatch
    ? tokens.slice(phraseMatch.start + phraseMatch.length)
    : [];
  const targetStartsWithBlockedContinuation = phraseMatch?.start === 0
    && tokensAfterPhrase.length > 0
    && DISALLOWED_CLAUSE_CONTINUATION_TOKENS.has(tokensAfterPhrase[0]);
  const hasLikelyVerb = tokens.some((token) => LIKELY_VERB_TOKENS.has(token));
  if ((hasLikelyVerb || hasLikelyDerivedPredicate(tokens)) && !targetStartsWithBlockedContinuation) {
    return true;
  }

  if (!phraseMatch || phraseMatch.length !== 1) {
    return false;
  }

  if (phraseMatch.start === 0) {
    return hasClauseTail(tokensAfterPhrase);
  }

  if (phraseMatch.start === 1 && LIKELY_PERSONAL_SUBJECT_TOKENS.has(tokens[0])) {
    return hasClauseTail(tokensAfterPhrase);
  }

  return false;
}

function normalizeComparableSentence(text: string): string {
  return tokenizeProductionText(text).join(" ");
}

function buildCanonicalRewriteSentence(sourceSentence: string, expected: string): string | undefined {
  if (!sourceSentence.includes("**")) {
    return undefined;
  }

  return sourceSentence.replace(/\*\*([^*]+)\*\*/, expected);
}

function matchesCanonicalRewrite(answer: string, expected: string, sourceSentence?: string): boolean {
  if (!sourceSentence) {
    return false;
  }

  const canonicalRewrite = buildCanonicalRewriteSentence(sourceSentence, expected);
  if (!canonicalRewrite) {
    return false;
  }

  return normalizeComparableSentence(answer) === normalizeComparableSentence(canonicalRewrite);
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

function gradeSentenceLikeContextAnswer(
  answer: string,
  expected: string,
  cueLevel: CueLevel,
  sourceSentence?: string,
): GradeResult {
  const normalizedCueLevel = normalizeCueLevel(cueLevel);
  const expectedTokens = tokenizeProductionText(expected);
  const answerTokens = tokenizeProductionText(answer);
  const phraseMatch = findPhraseMatch(answerTokens, expectedTokens);
  const expectedTokenSet = new Set(expectedTokens);
  const nonTargetTokenCount = answerTokens.filter((token, index) => {
    const insideMatchedPhrase = phraseMatch
      ? index >= phraseMatch.start && index < phraseMatch.start + phraseMatch.length
      : false;

    return !insideMatchedPhrase && !expectedTokenSet.has(token);
  }).length;
  const canonicalRewriteMatch = matchesCanonicalRewrite(answer, expected, sourceSentence);
  const sentenceLike = canonicalRewriteMatch || (
    answerTokens.length >= 3
    && nonTargetTokenCount >= 2
    && new Set(answerTokens).size > expectedTokenSet.size
    && hasSingleSentenceShape(answer, answerTokens, phraseMatch)
  );
  const preservesContextAnchor = sourceSentence
    ? hasContextAnchorOverlap(answerTokens, sourceSentence)
    : true;

  if (!sentenceLike || !phraseMatch || !preservesContextAnchor) {
    return { rating: 1, correct: false, cueLevel: normalizedCueLevel, retrievalKind: "failed" };
  }

  if (phraseMatch.kind === "exact") {
    return {
      rating: 2,
      correct: true,
      cueLevel: normalizedCueLevel,
      retrievalKind: "assisted",
    };
  }

  return { rating: 2, correct: true, cueLevel: normalizedCueLevel, retrievalKind: "approximate" };
}

/** Grade a context mode answer. Replacement prompts use exact-word grading; production/transfer prompts require target-word use inside a sentence. */
export function gradeContextAnswer(
  answer: string,
  expected: string,
  cueLevel: CueLevel = 0,
  promptKind: ContextPrompt["kind"] = "replace",
  sourceSentence?: string,
): GradeResult {
  if (promptKind === "replace") {
    return autoGrade(answer, expected, cueLevel);
  }

  return gradeSentenceLikeContextAnswer(
    answer,
    expected,
    cueLevel,
    promptKind === "rewrite" ? sourceSentence : undefined,
  );
}

const SPEED_FAST_MS = 3000; // static fallback when no timeout is known

/** Grade a rapid retrieval answer: fast clean recall scores higher. */
export function gradeSpeedAnswer(
  answer: string,
  expected: string,
  responseTimeMs: number,
  cueLevel: CueLevel = 0,
  rapidTimeoutMs?: number,
): GradeResult {
  const a = answer.trim().toLowerCase();
  const e = expected.trim().toLowerCase();
  const normalizedCueLevel = normalizeCueLevel(cueLevel);
  const fastMs = rapidTimeoutMs
    ? Math.round(rapidTimeoutMs * SPEED_FAST_RATIO)
    : SPEED_FAST_MS;

  if (a === e) {
    if (normalizedCueLevel > 0) {
      return { rating: 2, correct: true, cueLevel: normalizedCueLevel, retrievalKind: "assisted" };
    }
    if (responseTimeMs < fastMs) {
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

export function buildContextPrompt(
  word: Word,
  drillProfile?: RetrievalDrillProfile,
): ContextPrompt | null {
  const sentence = getContextSentence(word);
  if (!sentence) {
    return null;
  }

  const stage = drillProfile?.stage ?? "stabilize";
  const exactStreak = drillProfile?.exactStreak ?? 0;
  if (stage === "rescue" || exactStreak < 1) {
    return { ...sentence, kind: "replace" };
  }

  if (stage === "fluent") {
    return {
      kind: "rewrite",
      sentence: sentence.sentence,
      weakWord: sentence.weakWord,
      answer: sentence.answer,
      definition: word.definition,
      example: word.examples[0],
    };
  }

  return {
    kind: "produce",
    answer: word.word,
    definition: word.definition,
    example: word.examples[0],
  };
}

function isCleanExactLog(log: ReviewLog): boolean {
  return (
    !isTransferContextPromptKind(log.contextPromptKind)
    && log.correct
    && log.retrievalKind === "exact"
    && normalizeCueLevel(log.cueLevel) === 0
  );
}

function isSupportDependentLog(log: ReviewLog): boolean {
  return normalizeCueLevel(log.cueLevel) === 1
    || (!isTransferContextPromptKind(log.contextPromptKind) && log.retrievalKind === "assisted");
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function median(values: number[]): number | undefined {
  if (values.length === 0) {
    return undefined;
  }

  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return Math.round((sorted[middle - 1] + sorted[middle]) / 2);
  }

  return sorted[middle];
}

const DRILL_STAGE_INFLUENCE: Record<RetrievalDrillProfile["stage"], number> = {
  rescue: 0.35,
  stabilize: 0.55,
  fluent: 0.75,
};

function getDrillStatBalance(stats?: Partial<RPGStats>): {
  recallDelta: number;
  perceptionDelta: number;
} {
  const recallStat = Math.max(0, stats?.recall ?? 0);
  const perceptionStat = Math.max(0, stats?.perception ?? 0);
  const total = recallStat + perceptionStat;

  if (total <= 0) {
    return { recallDelta: 0, perceptionDelta: 0 };
  }

  const neutralShare = 0.5;
  const recallShare = recallStat / total;
  const perceptionShare = perceptionStat / total;

  return {
    recallDelta: clamp((recallShare - neutralShare) / neutralShare, -1, 1),
    perceptionDelta: clamp((perceptionShare - neutralShare) / neutralShare, -1, 1),
  };
}

function tuneRapidTimeoutMs(
  rawTimeoutMs: number,
  stage: RetrievalDrillProfile["stage"],
  stats?: Partial<RPGStats>,
): number {
  const { perceptionDelta } = getDrillStatBalance(stats);
  const stageInfluence = DRILL_STAGE_INFLUENCE[stage];
  const timeoutMultiplier = clamp(
    1 - perceptionDelta * 0.3 * stageInfluence,
    0.8,
    1.2,
  );
  const adjustedTimeout = Math.round(rawTimeoutMs * timeoutMultiplier);

  if (stage === "rescue") {
    return clamp(adjustedTimeout, 4500, 6500);
  }

  if (stage === "stabilize") {
    return clamp(adjustedTimeout, 3500, 5200);
  }

  return clamp(adjustedTimeout, 2500, 3800);
}

function tuneRapidCueRevealMs(
  stage: RetrievalDrillProfile["stage"],
  exactStreak: number,
  rapidTimeoutMs: number,
  stats?: Partial<RPGStats>,
): number | null {
  if (stage === "fluent" && exactStreak >= 3) {
    return null;
  }

  const { recallDelta } = getDrillStatBalance(stats);
  const stageInfluence = DRILL_STAGE_INFLUENCE[stage];
  const baseOffsetMs = stage === "rescue"
    ? 1800
    : stage === "stabilize"
      ? 1200
      : 800;
  const minRevealMs = stage === "fluent" ? 1500 : 1800;
  const minGapMs = stage === "fluent" ? 300 : stage === "stabilize" ? 400 : 500;
  const offsetMultiplier = clamp(
    1 - recallDelta * 0.35 * stageInfluence,
    0.7,
    1.35,
  );
  const cueOffsetMs = Math.round(baseOffsetMs * offsetMultiplier);

  return clamp(rapidTimeoutMs - cueOffsetMs, minRevealMs, rapidTimeoutMs - minGapMs);
}

export function buildRetrievalDrillProfile(
  word: Word,
  logs: ReviewLog[],
  stats?: Partial<RPGStats>,
): RetrievalDrillProfile {
  const sortedLogs = [...logs]
    .sort((left, right) => right.reviewedAt.getTime() - left.reviewedAt.getTime());
  const recentLogs = sortedLogs.slice(0, 4);
  const recentRetrievalLogs = sortedLogs
    .filter((log) => !isTransferContextPromptKind(log.contextPromptKind))
    .slice(0, 4);

  let exactStreak = 0;
  for (const log of recentRetrievalLogs) {
    if (!isCleanExactLog(log)) {
      break;
    }
    exactStreak += 1;
  }

  const cueLogs = recentLogs.filter(isSupportDependentLog);
  const failureCount = recentLogs.filter(
    (log) => !log.correct || log.retrievalKind === "failed",
  ).length;
  const exactLatencies = recentRetrievalLogs
    .filter(isCleanExactLog)
    .map((log) => log.responseTimeMs);
  const recentLatencyMs = median(exactLatencies);

  const hasTOTCapture = Boolean(word.totCapture);
  const cueRate = recentLogs.length === 0 ? 0 : cueLogs.length / recentLogs.length;

  let stage: RetrievalDrillProfile["stage"] = "rescue";
  if (exactStreak >= 2 && cueLogs.length === 0 && failureCount === 0) {
    stage = "fluent";
  } else if (exactStreak >= 1 && failureCount === 0) {
    stage = "stabilize";
  } else if (!hasTOTCapture && recentLogs.length === 0) {
    stage = "stabilize";
  }

  if (hasTOTCapture && exactStreak < 2) {
    stage = exactStreak >= 1 && failureCount === 0 ? "stabilize" : "rescue";
  }

  // Ranges measure retrieval-only time (read phase is separate)
  const baselineLatency = recentLatencyMs ?? DEFAULT_RAPID_TIMEOUT_MS;
  const rawRapidTimeoutMs = stage === "rescue"
    ? baselineLatency + 1400
    : stage === "stabilize"
      ? baselineLatency + 900
      : baselineLatency + 400;
  const rapidTimeoutMs = tuneRapidTimeoutMs(rawRapidTimeoutMs, stage, stats);
  const rapidCueRevealMs = tuneRapidCueRevealMs(
    stage,
    exactStreak,
    rapidTimeoutMs,
    stats,
  );

  return {
    stage,
    exactStreak,
    recentCueRate: cueRate,
    recentFailureCount: failureCount,
    recentLatencyMs,
    recallHintEnabled: stage !== "fluent",
    rapidTimeoutMs,
    rapidCueRevealMs,
  };
}

function getTOTCaptureTimestamp(word: Word): number {
  if (!word.totCapture?.capturedAt) {
    return 0;
  }

  const parsed = new Date(word.totCapture.capturedAt).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function prioritizeSessionWords(sessionWords: SessionWord[]): SessionWord[] {
  return [...sessionWords].sort((left, right) => {
    const leftIsNew = left.reviewCard.card.state === 0 ? 1 : 0;
    const rightIsNew = right.reviewCard.card.state === 0 ? 1 : 0;
    if (leftIsNew !== rightIsNew) {
      return leftIsNew - rightIsNew;
    }

    const leftHasTOT = left.word.totCapture ? 0 : 1;
    const rightHasTOT = right.word.totCapture ? 0 : 1;
    if (leftHasTOT !== rightHasTOT) {
      return leftHasTOT - rightHasTOT;
    }

    const stagePriority: Record<NonNullable<SessionWord["drillProfile"]>["stage"], number> = {
      rescue: 0,
      stabilize: 1,
      fluent: 2,
    };
    const leftStage = stagePriority[left.drillProfile?.stage ?? "stabilize"];
    const rightStage = stagePriority[right.drillProfile?.stage ?? "stabilize"];
    if (leftStage !== rightStage) {
      return leftStage - rightStage;
    }

    const countDelta =
      (right.word.totCapture?.count ?? 0) - (left.word.totCapture?.count ?? 0);
    if (countDelta !== 0) {
      return countDelta;
    }

    const recencyDelta =
      getTOTCaptureTimestamp(right.word) - getTOTCaptureTimestamp(left.word);
    if (recencyDelta !== 0) {
      return recencyDelta;
    }

    return left.word.word.localeCompare(right.word.word);
  });
}

/** Decide game mode for a session word. Mix of all four modes. */
type ModeWeights = Record<GameMode, number>;
type StatDrivenMode = "recall" | "speed" | "association";

const STAT_STAGE_INFLUENCE: Record<RetrievalDrillProfile["stage"], number> = {
  rescue: 0.45,
  stabilize: 0.7,
  fluent: 0.9,
};

function normalizeModeWeights(weights: ModeWeights): ModeWeights {
  const safeWeights: ModeWeights = {
    recall: Math.max(0, weights.recall),
    context: Math.max(0, weights.context),
    speed: Math.max(0, weights.speed),
    association: Math.max(0, weights.association),
  };

  const total = Object.values(safeWeights).reduce((sum, value) => sum + value, 0);
  if (total <= 0) {
    return {
      recall: 1,
      context: 0,
      speed: 0,
      association: 0,
    };
  }

  return {
    recall: safeWeights.recall / total,
    context: safeWeights.context / total,
    speed: safeWeights.speed / total,
    association: safeWeights.association / total,
  };
}

function applyStatBias(
  weights: ModeWeights,
  stage: RetrievalDrillProfile["stage"],
  stats?: Partial<RPGStats>,
): ModeWeights {
  if (!stats) {
    return normalizeModeWeights(weights);
  }

  const relevantStats = {
    recall: Math.max(0, stats.recall ?? 0),
    speed: Math.max(0, stats.perception ?? 0),
    association: Math.max(0, stats.creativity ?? 0),
  };

  const totalStat = Object.values(relevantStats).reduce((sum, value) => sum + value, 0);
  if (totalStat <= 0) {
    return normalizeModeWeights(weights);
  }

  const stageInfluence = STAT_STAGE_INFLUENCE[stage];
  const neutralShare = 1 / 3;
  const baseScale = 0.9;
  const adjusted: ModeWeights = { ...weights };

  (Object.keys(relevantStats) as StatDrivenMode[]).forEach((mode) => {
    const statShare = relevantStats[mode] / totalStat;
    const biasMultiplier = 1 + (statShare - neutralShare) * baseScale * stageInfluence;
    adjusted[mode] = Math.max(0.01, adjusted[mode] * biasMultiplier);
  });

  return normalizeModeWeights(adjusted);
}

function getBaseModeWeights(
  stage: RetrievalDrillProfile["stage"],
  hasContext: boolean,
  needsAdaptiveDrill: boolean,
): ModeWeights {
  if (needsAdaptiveDrill) {
    if (stage === "rescue") {
      return hasContext
        ? { recall: 0.6, speed: 0.3, context: 0.07, association: 0.03 }
        : { recall: 0.6, speed: 0.3, context: 0, association: 0.1 };
    }

    if (stage === "fluent") {
      return hasContext
        ? { recall: 0.4, speed: 0.25, context: 0.25, association: 0.1 }
        : { recall: 0.6, speed: 0.25, context: 0, association: 0.15 };
    }

    return hasContext
      ? { recall: 0.45, speed: 0.35, context: 0.15, association: 0.05 }
      : { recall: 0.45, speed: 0.35, context: 0, association: 0.2 };
  }

  return hasContext
    ? { recall: 0.4, speed: 0.15, context: 0.3, association: 0.15 }
    : { recall: 0.7, speed: 0.15, context: 0, association: 0.15 };
}

function pickModeFromWeights(weights: ModeWeights, roll: number): GameMode {
  const normalized = normalizeModeWeights(weights);
  let cutoff = normalized.recall;
  if (roll < cutoff) return "recall";

  cutoff += normalized.speed;
  if (roll < cutoff) return "speed";

  cutoff += normalized.context;
  if (roll < cutoff) return "context";

  return "association";
}

export function pickMode(
  word: Word,
  forceMode?: GameMode,
  drillProfile?: RetrievalDrillProfile,
  stats?: Partial<RPGStats>,
): GameMode {
  if (forceMode) return forceMode;

  const hasTOTCapture = Boolean(word.totCapture);
  const hasContext = getContextSentence(word) !== null;
  const stage = drillProfile?.stage ?? "stabilize";
  const needsAdaptiveDrill = hasTOTCapture
    || stage === "rescue"
    || (stage === "stabilize" && (drillProfile?.recentCueRate ?? 0) > 0);

  const baseWeights = getBaseModeWeights(stage, hasContext, needsAdaptiveDrill);
  const weightedModeMix = applyStatBias(baseWeights, stage, stats);

  return pickModeFromWeights(weightedModeMix, Math.random());
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
async function getNewWordsIntroducedToday(existingLogs?: ReviewLog[]): Promise<number> {
  const today = toLocalDateKey(new Date());
  const logs = existingLogs ?? await db.reviewLogs.toArray();
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
  stats?: Partial<RPGStats>,
): Promise<SessionWord[]> {
  const config = DIFFICULTY_CONFIG[difficulty];
  const sessionSize = config.sessionSize;
  const unlockedTiers = getUnlockedTiers(level);
  const reviewLogs = await db.reviewLogs.toArray();

  // Load due cards first (always allowed, no limit)
  const dueCards = await getDueCards(sessionSize);
  let cards = [...dueCards];

  // Backfill with new cards, respecting daily limit and tier gating
  if (cards.length < sessionSize) {
    const newWordsToday = await getNewWordsIntroducedToday(reviewLogs);
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
      const wordLogs = reviewLogs.filter((log) => log.wordId === rc.wordId);
      sessionWords.push({
        word,
        reviewCard: rc,
        drillProfile: buildRetrievalDrillProfile(word, wordLogs, stats),
      });
    }
  }

  return prioritizeSessionWords(sessionWords);
}

/** Get the count of new words currently available under today's limits. */
export async function getAvailableNewCount(
  difficulty: Difficulty = "normal",
  level: number = 1,
): Promise<number> {
  const config = DIFFICULTY_CONFIG[difficulty];
  const reviewLogs = await db.reviewLogs.toArray();
  const newWordsToday = await getNewWordsIntroducedToday(reviewLogs);
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
    gradeResult = gradeSpeedAnswer(
      answer, contextExpected, responseTimeMs, cueLevel,
      sessionWord.drillProfile?.rapidTimeoutMs,
    );
  } else if (mode === "context" && contextExpected) {
    gradeResult = gradeContextAnswer(
      answer,
      contextExpected,
      cueLevel,
      answerMetadata?.contextPromptKind,
      answerMetadata?.contextSourceSentence,
    );
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
    contextPromptKind: answerMetadata?.contextPromptKind,
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
    contextPromptKind: answerMetadata?.contextPromptKind,
  };

  return { result, updatedCard };
}

/** Finalize the session and update profile. */
export async function finalizeSession(
  results: SessionResult[],
): Promise<SessionSummary> {
  return completeSession(results);
}
