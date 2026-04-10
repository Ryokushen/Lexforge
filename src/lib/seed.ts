import { db } from "./db";
import { addWordWithCard } from "./scheduler";
import { SEED_WORDS } from "./seed-words";

/** Seed the database with words, adding any new ones from SEED_WORDS. */
export async function seedDatabase(): Promise<void> {
  const existing = await db.words.toArray();
  const existingWords = new Set(existing.map((w) => w.word.toLowerCase()));

  for (const seed of SEED_WORDS) {
    if (existingWords.has(seed.word.toLowerCase())) continue;
    await addWordWithCard({
      word: seed.word,
      definition: seed.definition,
      examples: seed.examples,
      pronunciation: undefined,
      tier: seed.tier,
      synonyms: seed.synonyms,
      association: undefined,
      createdAt: new Date(),
    });
  }
}
