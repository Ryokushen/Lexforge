import type { PipelineStage, Word } from "@/lib/types";
import { isArchivedCapture, isPendingCapture } from "@/lib/word-library";
import { TIER_UNLOCK_LEVELS } from "@/lib/types";

const GROUP_ORDER = ["1", "2", "3", "4", "custom"] as const;

export type WordLibraryViewFilter = "all" | Word["tier"] | "inbox" | "archive";

export function buildTierFilterLayout() {
  return {
    viewportClassName: "max-w-full overflow-x-auto",
    stripClassName: "inline-flex min-w-max overflow-hidden",
  } as const;
}

export function getWordLibraryPipelineStage(word: Word): PipelineStage {
  return word.pipelineStage ?? (word.totCapture ? "captured" : "queued");
}

function matchesLibrarySearch(word: Word, normalizedSearch: string): boolean {
  if (!normalizedSearch) return true;
  return [
    word.word,
    word.definition,
    word.totCapture?.weakSubstitute,
    word.totCapture?.context,
  ].some((value) => value?.toLowerCase().includes(normalizedSearch));
}

export function getInboxCount(words: Word[]): number {
  return words.filter(isPendingCapture).length;
}

export function getArchiveCount(words: Word[]): number {
  return words.filter(isArchivedCapture).length;
}

export function filterWordsForLibraryView(
  words: Word[],
  activeFilter: WordLibraryViewFilter,
  search: string,
): Word[] {
  const normalizedSearch = search.trim().toLowerCase();
  return words
    .filter((word) => {
      if (activeFilter === "inbox") return isPendingCapture(word);
      if (activeFilter === "archive") return isArchivedCapture(word);
      if (activeFilter === "all") return true;
      return word.tier === activeFilter;
    })
    .filter((word) => matchesLibrarySearch(word, normalizedSearch));
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
