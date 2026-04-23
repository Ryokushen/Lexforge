import type { Word } from "@/lib/types";
import { TIER_UNLOCK_LEVELS } from "@/lib/types";

const GROUP_ORDER = ["1", "2", "3", "4", "custom"] as const;

export function buildTierFilterLayout() {
  return {
    viewportClassName: "max-w-full overflow-x-auto",
    stripClassName: "inline-flex min-w-max overflow-hidden",
  } as const;
}

export type WordGroup = {
  tier: (typeof GROUP_ORDER)[number];
  words: Word[];
  isLocked: boolean;
  unlockLevel: number;
  trackedLockedWords: Word[];
  hiddenLockedCount: number;
};

export function buildWordGroups(words: Word[], playerLevel: number): WordGroup[] {
  const groups: WordGroup[] = [];

  for (const tier of GROUP_ORDER) {
    const tierWords = words.filter((word) => String(word.tier) === tier);
    if (tierWords.length === 0) {
      continue;
    }

    const unlockLevel = TIER_UNLOCK_LEVELS[tier] ?? 1;
    const isLocked = tier !== "custom" && playerLevel < unlockLevel;
    const trackedLockedWords = isLocked
      ? tierWords.filter((word) => Boolean(word.totCapture))
      : [];

    groups.push({
      tier,
      words: isLocked ? [] : tierWords,
      isLocked,
      unlockLevel,
      trackedLockedWords,
      hiddenLockedCount: isLocked
        ? Math.max(0, tierWords.length - trackedLockedWords.length)
        : 0,
    });
  }

  return groups;
}
