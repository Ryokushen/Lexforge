import type { SeedTier, TOTCapture, Word } from "./types";
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
