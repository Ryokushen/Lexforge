import type {
  CaptureTriageStatus,
  ContextSentence,
  PipelineStage,
  ReviewLog,
  Word,
  WordTier,
} from "./types";
import {
  getCaptureTriageStatus,
  getTOTEventIds,
  shouldIncludeNewWordInTraining,
} from "./word-library";

export type VocabularyItemId = number;
export type VocabularyItemSourceKind = "seeded" | "custom";
export type VocabularyItemCoverageState = "unknown" | "practiced";

export type VocabularyItemSourceSummary = {
  kind: VocabularyItemSourceKind;
  isSeeded: boolean;
  isCustom: boolean;
  isCaptured: boolean;
  captureCount: number;
  captureTriageStatus: CaptureTriageStatus | null;
  captureEventIds: string[];
};

export type VocabularyItemCoverage = {
  retrieval: VocabularyItemCoverageState;
  context: VocabularyItemCoverageState;
  association: VocabularyItemCoverageState;
  collocation: VocabularyItemCoverageState;
};

export type VocabularyItemCoverageSummary = {
  total: number;
  retrievalPracticed: number;
  contextPracticed: number;
  associationPracticed: number;
  collocationPracticed: number;
  fullyCovered: number;
};

export type VocabularyItem = {
  id: VocabularyItemId;
  backingWordId: number;
  word: string;
  definition: string;
  examples: string[];
  synonyms: string[];
  contextSentences: ContextSentence[];
  tier: WordTier;
  createdAt: Date;
  pipelineStage?: PipelineStage;
  pipelineUpdatedAt?: string;
  trainingEligible: boolean;
  source: VocabularyItemSourceSummary;
  coverage: VocabularyItemCoverage;
};

export type VocabularyItemProjectionOptions = {
  reviewLogs?: ReviewLog[];
};

function getPersistedWordId(word: Word): number {
  if (typeof word.id !== "number") {
    throw new Error("Cannot project a vocabulary item without a persisted word id.");
  }

  return word.id;
}

function projectSourceSummary(word: Word): VocabularyItemSourceSummary {
  const isCustom = word.tier === "custom";
  const captureTriageStatus = getCaptureTriageStatus(word.totCapture);

  return {
    kind: isCustom ? "custom" : "seeded",
    isSeeded: !isCustom,
    isCustom,
    isCaptured: Boolean(word.totCapture),
    captureCount: word.totCapture?.count ?? 0,
    captureTriageStatus,
    captureEventIds: word.totCapture ? getTOTEventIds(word, word.totCapture) : [],
  };
}

function projectCoverage(
  word: Word,
  wordId: number,
  options: VocabularyItemProjectionOptions,
): VocabularyItemCoverage {
  const wordLogs = (options.reviewLogs ?? []).filter((log) => log.wordId === wordId);
  const hasRetrievalPractice = wordLogs.length > 0;
  const hasContextPractice = wordLogs.some((log) => Boolean(log.contextPromptKind));
  const hasAssociationPractice = Boolean(word.association?.trim());

  return {
    retrieval: hasRetrievalPractice ? "practiced" : "unknown",
    context: hasContextPractice ? "practiced" : "unknown",
    association: hasAssociationPractice ? "practiced" : "unknown",
    collocation: "unknown",
  };
}

export function wordToVocabularyItem(
  word: Word,
  options: VocabularyItemProjectionOptions = {},
): VocabularyItem {
  const wordId = getPersistedWordId(word);

  return {
    id: wordId,
    backingWordId: wordId,
    word: word.word,
    definition: word.definition,
    examples: word.examples,
    synonyms: word.synonyms,
    contextSentences: word.contextSentences ?? [],
    tier: word.tier,
    createdAt: word.createdAt,
    pipelineStage: word.pipelineStage,
    pipelineUpdatedAt: word.pipelineUpdatedAt,
    trainingEligible: shouldIncludeNewWordInTraining(word),
    source: projectSourceSummary(word),
    coverage: projectCoverage(word, wordId, options),
  };
}

export function wordsToVocabularyItems(
  words: Word[],
  options: VocabularyItemProjectionOptions = {},
): VocabularyItem[] {
  return words
    .filter((word) => typeof word.id === "number")
    .map((word) => wordToVocabularyItem(word, options));
}

export function summarizeVocabularyItemCoverage(
  items: VocabularyItem[],
): VocabularyItemCoverageSummary {
  const summary: VocabularyItemCoverageSummary = {
    total: items.length,
    retrievalPracticed: 0,
    contextPracticed: 0,
    associationPracticed: 0,
    collocationPracticed: 0,
    fullyCovered: 0,
  };

  for (const item of items) {
    const coverage = item.coverage;
    if (coverage.retrieval === "practiced") summary.retrievalPracticed += 1;
    if (coverage.context === "practiced") summary.contextPracticed += 1;
    if (coverage.association === "practiced") summary.associationPracticed += 1;
    if (coverage.collocation === "practiced") summary.collocationPracticed += 1;
    if (
      coverage.retrieval === "practiced" &&
      coverage.context === "practiced" &&
      coverage.association === "practiced" &&
      coverage.collocation === "practiced"
    ) {
      summary.fullyCovered += 1;
    }
  }

  return summary;
}
