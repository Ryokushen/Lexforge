import { db } from "./db";
import type { ReviewCard, ReviewLog, Word } from "./types";
import { buildMergedDuplicateWord } from "./word-library";

type ProgressScore = [number, number, number, number, number];

export type DuplicateMergeResult = {
  canonicalId: number;
  absorbedWordIds: number[];
  reassignedLogCount: number;
  keptCardId?: number;
  deletedCardIds: number[];
};

function toMillis(value: Date | string | undefined | null): number {
  if (!value) return 0;
  const millis = value instanceof Date ? value.getTime() : Date.parse(value);
  return Number.isFinite(millis) ? millis : 0;
}

function compareScores(left: ProgressScore, right: ProgressScore): number {
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}

export function getReviewCardProgressScore(card: ReviewCard["card"]): ProgressScore {
  return [
    card.state === 0 ? 0 : 1,
    card.reps ?? 0,
    toMillis(card.last_review),
    toMillis(card.due),
    0,
  ];
}

function getCardScore(card: ReviewCard): ProgressScore {
  const score = getReviewCardProgressScore(card.card);
  score[4] = toMillis(card.updatedAt);
  return score;
}

export function chooseStrongestReviewCard(
  cards: ReviewCard[],
): ReviewCard | undefined {
  return [...cards].sort((left, right) => {
    const scoreComparison = compareScores(getCardScore(right), getCardScore(left));
    if (scoreComparison !== 0) return scoreComparison;
    return (right.id ?? 0) - (left.id ?? 0);
  })[0];
}

function getWordLogCount(word: Word, logs: ReviewLog[]): number {
  if (!word.id) return 0;
  return logs.filter((log) => log.wordId === word.id).length;
}

function isSeededWord(word: Word): boolean {
  return word.tier !== "custom";
}

export function chooseCanonicalDuplicateWord(
  words: Word[],
  cards: ReviewCard[] = [],
  logs: ReviewLog[] = [],
): Word | undefined {
  return [...words].sort((left, right) => {
    const leftCard = chooseStrongestReviewCard(
      left.id ? cards.filter((card) => card.wordId === left.id) : [],
    );
    const rightCard = chooseStrongestReviewCard(
      right.id ? cards.filter((card) => card.wordId === right.id) : [],
    );
    const cardComparison = compareScores(
      rightCard ? getCardScore(rightCard) : [0, 0, 0, 0, 0],
      leftCard ? getCardScore(leftCard) : [0, 0, 0, 0, 0],
    );
    if (cardComparison !== 0) return cardComparison;

    const logComparison = getWordLogCount(right, logs) - getWordLogCount(left, logs);
    if (logComparison !== 0) return logComparison;

    const seededComparison = Number(isSeededWord(right)) - Number(isSeededWord(left));
    if (seededComparison !== 0) return seededComparison;

    const ageComparison = left.createdAt.getTime() - right.createdAt.getTime();
    if (ageComparison !== 0) return ageComparison;

    return (left.id ?? 0) - (right.id ?? 0);
  })[0];
}

export async function mergeDuplicateWords(
  canonicalId: number,
  duplicateIds: number[],
  mergedAt: string,
): Promise<DuplicateMergeResult> {
  const absorbedWordIds = [...new Set(duplicateIds)].filter(
    (id) => id !== canonicalId,
  );
  if (absorbedWordIds.length === 0) {
    return {
      canonicalId,
      absorbedWordIds: [],
      reassignedLogCount: 0,
      deletedCardIds: [],
    };
  }

  let result: DuplicateMergeResult | undefined;

  await db.transaction("rw", db.words, db.reviewCards, db.reviewLogs, async () => {
    const targetIds = [canonicalId, ...absorbedWordIds];
    const words = await Promise.all(targetIds.map((id) => db.words.get(id)));
    const canonical = words.find((word) => word?.id === canonicalId);
    const duplicates = words.filter(
      (word): word is Word => Boolean(word?.id && word.id !== canonicalId),
    );

    if (!canonical) {
      throw new Error(`Cannot merge duplicate words without canonical word ${canonicalId}.`);
    }
    if (duplicates.length !== absorbedWordIds.length) {
      throw new Error("Cannot merge duplicate words because one or more duplicates are missing.");
    }

    const cards = (await db.reviewCards.toArray()).filter((card) =>
      targetIds.includes(card.wordId),
    );
    const logs = (await db.reviewLogs.toArray()).filter((log) =>
      targetIds.includes(log.wordId),
    );
    const keptCard = chooseStrongestReviewCard(cards);
    const deletedCardIds: number[] = [];

    await db.words.update(
      canonicalId,
      buildMergedDuplicateWord(canonical, duplicates, mergedAt),
    );

    for (const log of logs) {
      if (log.id && absorbedWordIds.includes(log.wordId)) {
        await db.reviewLogs.update(log.id, { wordId: canonicalId });
      }
    }

    if (keptCard?.id && keptCard.wordId !== canonicalId) {
      await db.reviewCards.update(keptCard.id, { wordId: canonicalId });
    }

    for (const card of cards) {
      if (card.id && card.id !== keptCard?.id) {
        await db.reviewCards.delete(card.id);
        deletedCardIds.push(card.id);
      }
    }

    for (const id of absorbedWordIds) {
      await db.words.delete(id);
    }

    result = {
      canonicalId,
      absorbedWordIds,
      reassignedLogCount: logs.filter((log) =>
        absorbedWordIds.includes(log.wordId),
      ).length,
      keptCardId: keptCard?.id,
      deletedCardIds,
    };
  });

  if (!result) {
    throw new Error("Duplicate word merge did not complete.");
  }

  return result;
}
