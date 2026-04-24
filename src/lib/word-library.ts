import type { CaptureTriageStatus, SeedTier, TOTCapture, Word } from "./types";
import { maxPipelineStage } from "./pipeline-stage";
import { TIER_UNLOCK_LEVELS } from "./types";

export type LibraryTierFilter = "all" | SeedTier | "custom";

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

export function isTierLocked(
  tier: LibraryTierFilter,
  playerLevel: number,
): boolean {
  if (tier === "all" || tier === "custom") return false;

  return playerLevel < (TIER_UNLOCK_LEVELS[String(tier)] ?? 1);
}
