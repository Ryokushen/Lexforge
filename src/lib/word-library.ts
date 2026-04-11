import type { Word } from "./types";
import { TIER_UNLOCK_LEVELS } from "./types";

export type LibraryTierFilter = "all" | 1 | 2 | 3 | "custom";

export function normalizeWord(value: string): string {
  return value.trim().toLowerCase();
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
