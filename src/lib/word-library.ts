import type {
  CaptureTriageStatus,
  ContextSentence,
  PipelineStage,
  SeedTier,
  TOTCapture,
  Word,
} from "./types";
import { maxPipelineStage } from "./pipeline-stage";
import { TIER_UNLOCK_LEVELS } from "./types";

export type LibraryTierFilter = "all" | SeedTier | "custom";
export type WordDuplicateGroup<T extends Pick<Word, "word"> = Word> = {
  key: string;
  words: T[];
};

export function normalizeWord(value: string): string {
  return value.trim().toLowerCase();
}

export function createTOTEventId(): string {
  const randomPart = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

  return `tot:${Date.now()}:${randomPart}`;
}

export function createLegacyTOTEventIds(
  normalizedWord: string,
  count: number,
  seed?: string,
): string[] {
  const safeCount = Math.max(count, 0);
  const parsedSeed = seed ? Date.parse(seed) : Number.NaN;
  const normalizedSeed = Number.isFinite(parsedSeed)
    ? new Date(parsedSeed).toISOString()
    : seed?.trim();
  const legacyPrefix = normalizedSeed
    ? `legacy:${normalizedWord}:${normalizedSeed}`
    : `legacy:${normalizedWord}`;

  return Array.from({ length: safeCount }, (_, index) => `${legacyPrefix}:${index}`);
}

export function getTOTEventIds(
  word: Pick<Word, "word">,
  capture?: Pick<TOTCapture, "capturedAt" | "updatedAt" | "count" | "eventIds"> | null,
): string[] {
  const explicitIds = (capture?.eventIds ?? [])
    .filter((eventId): eventId is string => typeof eventId === "string")
    .map((eventId) => eventId.trim())
    .filter(Boolean);

  if (explicitIds.length > 0) {
    return [...new Set(explicitIds)];
  }

  const normalizedWord = normalizeWord(word.word);
  const legacyCount = Math.max(capture?.count ?? 0, 0);

  return createLegacyTOTEventIds(
    normalizedWord,
    legacyCount,
    capture?.updatedAt ?? capture?.capturedAt,
  );
}

export function getCaptureTriageStatus(
  capture: Pick<TOTCapture, "triageStatus"> | undefined | null,
): CaptureTriageStatus | null {
  if (!capture) return null;
  return capture.triageStatus ?? "pending";
}

export function isPendingCapture(word: Pick<Word, "totCapture">): boolean {
  return getCaptureTriageStatus(word.totCapture) === "pending";
}

export function isArchivedCapture(word: Pick<Word, "totCapture">): boolean {
  return getCaptureTriageStatus(word.totCapture) === "archived";
}

export function getPendingCaptureWords<T extends Pick<Word, "totCapture">>(
  words: T[],
): T[] {
  return words.filter(isPendingCapture);
}

export function getArchivedCaptureWords<T extends Pick<Word, "totCapture">>(
  words: T[],
): T[] {
  return words.filter(isArchivedCapture);
}

export function isCaptureTrainingActive(word: Pick<Word, "totCapture">): boolean {
  return getCaptureTriageStatus(word.totCapture) === "accepted";
}

export function shouldIncludeNewWordInTraining(
  word: Pick<Word, "totCapture">,
): boolean {
  const status = getCaptureTriageStatus(word.totCapture);
  return status === null || status === "accepted";
}

export function keepTOTCapture(word: Word, triagedAt: string): Partial<Word> {
  if (!word.totCapture) return {};

  return {
    totCapture: {
      ...word.totCapture,
      triageStatus: "accepted",
      triagedAt,
      updatedAt: triagedAt,
    },
    pipelineStage: maxPipelineStage(word.pipelineStage, "queued"),
    pipelineUpdatedAt: triagedAt,
  };
}

export function archiveTOTCapture(word: Word, triagedAt: string): Partial<Word> {
  if (!word.totCapture) return {};

  return {
    totCapture: {
      ...word.totCapture,
      triageStatus: "archived",
      triagedAt,
      updatedAt: triagedAt,
    },
  };
}

export function restoreArchivedTOTCapture(word: Word, restoredAt: string): Partial<Word> {
  if (!word.totCapture) return {};

  return {
    totCapture: {
      ...word.totCapture,
      triageStatus: "pending",
      triagedAt: undefined,
      updatedAt: restoredAt,
    },
  };
}

export function isDuplicateWord(
  value: string,
  words: Pick<Word, "word">[],
): boolean {
  const normalized = normalizeWord(value);
  if (!normalized) return false;

  return words.some((word) => normalizeWord(word.word) === normalized);
}

export function findDuplicateWordGroups<T extends Pick<Word, "word">>(
  words: T[],
): WordDuplicateGroup<T>[] {
  const byKey = new Map<string, T[]>();

  for (const word of words) {
    const key = normalizeWord(word.word);
    if (!key) continue;
    byKey.set(key, [...(byKey.get(key) ?? []), word]);
  }

  return [...byKey.entries()]
    .filter(([, groupWords]) => groupWords.length > 1)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, groupWords]) => ({ key, words: groupWords }));
}

function mergeUniqueStrings(...groups: (string[] | undefined)[]): string[] {
  const merged = new Set<string>();

  for (const group of groups) {
    for (const value of group ?? []) {
      const trimmed = value.trim();
      if (trimmed) merged.add(trimmed);
    }
  }

  return [...merged];
}

function toMillis(value: string | Date | undefined | null): number {
  if (!value) return 0;
  const parsed = value instanceof Date ? value.getTime() : Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function maxIso(...values: (string | undefined | null)[]): string | undefined {
  let selected: string | undefined;
  let selectedMillis = 0;

  for (const value of values) {
    const millis = toMillis(value);
    if (millis >= selectedMillis && value) {
      selected = new Date(millis).toISOString();
      selectedMillis = millis;
    }
  }

  return selected;
}

function pickFirstText(...values: (string | undefined | null)[]): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}

function mergeContextSentences(
  ...groups: (ContextSentence[] | undefined)[]
): ContextSentence[] | undefined {
  const seen = new Set<string>();
  const merged: ContextSentence[] = [];

  for (const group of groups) {
    for (const sentence of group ?? []) {
      const key = JSON.stringify(sentence);
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(sentence);
    }
  }

  return merged.length > 0 ? merged : undefined;
}

function pickNewestAssociation(words: Word[]): {
  association?: string;
  associationUpdatedAt?: string;
} {
  const withAssociations = words
    .filter((word) => word.association?.trim())
    .sort(
      (left, right) =>
        toMillis(right.associationUpdatedAt) - toMillis(left.associationUpdatedAt),
    );
  const selected = withAssociations[0];

  return {
    association: selected?.association?.trim(),
    associationUpdatedAt: selected?.associationUpdatedAt,
  };
}

function mergeDuplicateTOTCaptures(
  canonical: Word,
  duplicates: Word[],
  mergedAt: string,
): TOTCapture | undefined {
  const words = [canonical, ...duplicates];
  const captures = words
    .map((word) => word.totCapture)
    .filter((capture): capture is TOTCapture => Boolean(capture));

  if (captures.length === 0) return undefined;

  const newestCapture = captures.reduce((selected, capture) =>
    toMillis(capture.updatedAt ?? capture.capturedAt) >=
    toMillis(selected.updatedAt ?? selected.capturedAt)
      ? capture
      : selected,
  );
  const eventIds = mergeUniqueStrings(
    ...words.map((word) => getTOTEventIds(word, word.totCapture)),
  );
  const maxCount = Math.max(...captures.map((capture) => capture.count), 0);

  return {
    source: newestCapture.source,
    weakSubstitute: pickFirstText(
      canonical.totCapture?.weakSubstitute,
      ...duplicates.map((word) => word.totCapture?.weakSubstitute),
    ),
    context: pickFirstText(
      canonical.totCapture?.context,
      ...duplicates.map((word) => word.totCapture?.context),
    ),
    capturedAt:
      maxIso(...captures.map((capture) => capture.capturedAt)) ?? mergedAt,
    updatedAt: mergedAt,
    count: Math.max(maxCount, eventIds.length),
    eventIds: eventIds.length > 0 ? eventIds : undefined,
    triageStatus:
      canonical.totCapture?.triageStatus ??
      duplicates.find((word) => word.totCapture?.triageStatus)?.totCapture
        ?.triageStatus,
    triagedAt: maxIso(
      canonical.totCapture?.triagedAt,
      ...duplicates.map((word) => word.totCapture?.triagedAt),
    ),
  };
}

export function buildMergedDuplicateWord(
  canonical: Word,
  duplicates: Word[],
  mergedAt: string,
): Partial<Word> {
  const words = [canonical, ...duplicates];
  const pipelineStage = words.reduce<PipelineStage | undefined>(
    (stage, word) =>
      word.pipelineStage ? maxPipelineStage(stage, word.pipelineStage) : stage,
    undefined,
  );
  const association = pickNewestAssociation(words);

  return {
    definition: canonical.definition || duplicates.find((word) => word.definition)?.definition || "",
    examples: mergeUniqueStrings(...words.map((word) => word.examples)),
    pronunciation: pickFirstText(
      canonical.pronunciation,
      ...duplicates.map((word) => word.pronunciation),
    ),
    synonyms: mergeUniqueStrings(...words.map((word) => word.synonyms)),
    association: association.association,
    associationUpdatedAt: association.associationUpdatedAt,
    contextSentences: mergeContextSentences(
      ...words.map((word) => word.contextSentences),
    ),
    totCapture: mergeDuplicateTOTCaptures(canonical, duplicates, mergedAt),
    pipelineStage,
    pipelineUpdatedAt: pipelineStage ? mergedAt : undefined,
    createdAt: new Date(
      Math.min(...words.map((word) => word.createdAt.getTime())),
    ),
  };
}

export function isTierLocked(
  tier: LibraryTierFilter,
  playerLevel: number,
): boolean {
  if (tier === "all" || tier === "custom") return false;

  return playerLevel < (TIER_UNLOCK_LEVELS[String(tier)] ?? 1);
}
