import {
  createEmptyCard,
  fsrs,
  generatorParameters,
  type Card,
  type Grade,
  Rating,
} from "ts-fsrs";
import { db } from "./db";
import type { ReviewCard, Word } from "./types";

// ── FSRS instance ───────────────────────────────────────────────────────

const params = generatorParameters({ enable_fuzz: true });
const f = fsrs(params);

// ── Public API ──────────────────────────────────────────────────────────

/** Create a new review card for a word. */
export async function createReviewCard(wordId: number): Promise<ReviewCard> {
  const card = createEmptyCard();
  const reviewCard: ReviewCard = { wordId, card };
  const id = await db.reviewCards.add(reviewCard);
  return { ...reviewCard, id: id as number };
}

/** Grade a card and persist the updated schedule. */
export async function gradeCard(
  reviewCard: ReviewCard,
  grade: Grade,
): Promise<ReviewCard> {
  const result = f.repeat(reviewCard.card, new Date());
  const updated = result[grade].card;
  const next: ReviewCard = { ...reviewCard, card: updated };
  await db.reviewCards.put(next);
  return next;
}

/** Get all cards due for review right now, sorted by urgency (most overdue first). */
export async function getDueCards(limit: number = 10): Promise<ReviewCard[]> {
  const now = new Date();
  const all = await db.reviewCards.toArray();
  const due = all
    .filter((rc) => new Date(rc.card.due) <= now)
    .sort(
      (a, b) =>
        new Date(a.card.due).getTime() - new Date(b.card.due).getTime(),
    );
  return due.slice(0, limit);
}

/** Get cards for new/unseen words (state === 0 = New), filtered by unlocked tiers. */
export async function getNewCards(
  limit: number = 10,
  unlockedTiers?: (1 | 2 | 3 | "custom")[],
): Promise<ReviewCard[]> {
  const all = await db.reviewCards.toArray();
  let newCards = all.filter((rc) => rc.card.state === 0);

  // Filter by unlocked tiers if specified
  if (unlockedTiers) {
    const wordIds = new Set<number>();
    const words = await db.words.toArray();
    for (const w of words) {
      if (unlockedTiers.includes(w.tier as 1 | 2 | 3 | "custom")) {
        wordIds.add(w.id!);
      }
    }
    newCards = newCards.filter((rc) => wordIds.has(rc.wordId));
  }

  return newCards.slice(0, limit);
}

/** Add a word and its review card in one transaction. */
export async function addWordWithCard(word: Omit<Word, "id">): Promise<{
  word: Word;
  reviewCard: ReviewCard;
}> {
  let savedWord!: Word;
  let savedCard!: ReviewCard;

  await db.transaction("rw", db.words, db.reviewCards, async () => {
    const wordId = (await db.words.add(word as Word)) as number;
    savedWord = { ...word, id: wordId } as Word;
    const card = createEmptyCard();
    const rc: ReviewCard = { wordId, card };
    const cardId = (await db.reviewCards.add(rc)) as number;
    savedCard = { ...rc, id: cardId };
  });

  return { word: savedWord, reviewCard: savedCard };
}

/** Get the total count of words in the database. */
export async function getWordCount(): Promise<number> {
  return db.words.count();
}

/** Get count of cards currently due. */
export async function getDueCount(): Promise<number> {
  const now = new Date();
  const all = await db.reviewCards.toArray();
  return all.filter((rc) => new Date(rc.card.due) <= now).length;
}

export { Rating };
