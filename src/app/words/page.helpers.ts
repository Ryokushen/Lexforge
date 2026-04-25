import type { PipelineStage, ReviewLog, Word } from "@/lib/types";
import {
  findDuplicateWordGroups,
  type WordDuplicateGroup,
} from "@/lib/word-library";
import { TIER_UNLOCK_LEVELS } from "@/lib/types";
import {
  wordToVocabularyItem,
  type VocabularyItem,
} from "@/lib/vocabulary-item";

const GROUP_ORDER = ["1", "2", "3", "4", "custom"] as const;

export type WordLibraryViewFilter =
  | "all"
  | Word["tier"]
  | "inbox"
  | "archive"
  | "duplicates";

export type WordLibraryItem = {
  word: Word;
  item: VocabularyItem;
};

export function buildTierFilterLayout() {
  return {
    viewportClassName: "max-w-full overflow-x-auto",
    stripClassName: "inline-flex min-w-max overflow-hidden",
  } as const;
}

export function getWordLibraryPipelineStage(word: Word): PipelineStage {
  return word.pipelineStage ?? (word.totCapture ? "captured" : "queued");
}

export function buildWordLibraryItems(
  words: Word[],
  reviewLogs: ReviewLog[] = [],
): WordLibraryItem[] {
  return words
    .filter((word) => typeof word.id === "number")
    .map((word) => ({
      word,
      item: wordToVocabularyItem(word, { reviewLogs }),
    }));
}

function matchesLibrarySearch(
  entry: WordLibraryItem,
  normalizedSearch: string,
): boolean {
  if (!normalizedSearch) return true;
  return [
    entry.item.word,
    entry.item.definition,
    entry.word.totCapture?.weakSubstitute,
    entry.word.totCapture?.context,
  ].some((value) => value?.toLowerCase().includes(normalizedSearch));
}

function matchesWordSearch(word: Word, normalizedSearch: string): boolean {
  if (!normalizedSearch) return true;
  return [
    word.word,
    word.definition,
    word.totCapture?.weakSubstitute,
    word.totCapture?.context,
  ].some((value) => value?.toLowerCase().includes(normalizedSearch));
}

export function getInboxCount(words: Word[]): number {
  return getInboxItemCount(buildWordLibraryItems(words));
}

export function getArchiveCount(words: Word[]): number {
  return getArchiveItemCount(buildWordLibraryItems(words));
}

export function getInboxItemCount(items: WordLibraryItem[]): number {
  return items.filter((entry) => entry.item.source.captureTriageStatus === "pending")
    .length;
}

export function getArchiveItemCount(items: WordLibraryItem[]): number {
  return items.filter((entry) => entry.item.source.captureTriageStatus === "archived")
    .length;
}

export function getDuplicateCount(words: Word[]): number {
  return findDuplicateWordGroups(words).length;
}

export function getDuplicateGroupsForLibraryView(
  words: Word[],
  search: string,
): WordDuplicateGroup<Word>[] {
  const normalizedSearch = search.trim().toLowerCase();

  return findDuplicateWordGroups(words).filter((group) =>
    group.words.some((word) => matchesWordSearch(word, normalizedSearch)),
  );
}

export function filterWordsForLibraryView(
  words: Word[],
  activeFilter: WordLibraryViewFilter,
  search: string,
): Word[] {
  return filterWordLibraryItemsForView(
    buildWordLibraryItems(words),
    activeFilter,
    search,
  ).map((entry) => entry.word);
}

export function filterWordLibraryItemsForView(
  items: WordLibraryItem[],
  activeFilter: WordLibraryViewFilter,
  search: string,
): WordLibraryItem[] {
  const normalizedSearch = search.trim().toLowerCase();
  return items
    .filter((entry) => {
      if (activeFilter === "inbox") {
        return entry.item.source.captureTriageStatus === "pending";
      }
      if (activeFilter === "archive") {
        return entry.item.source.captureTriageStatus === "archived";
      }
      if (activeFilter === "duplicates") return false;
      if (activeFilter === "all") return true;
      return entry.item.tier === activeFilter;
    })
    .filter((entry) => matchesLibrarySearch(entry, normalizedSearch));
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
