import { db } from "./db";
import { addWordWithCard } from "./scheduler";
import { SEED_WORDS } from "./seed-words";

/** Seed the database with Tier 1 words if empty. */
export async function seedDatabase(): Promise<void> {
  const count = await db.words.count();
  if (count > 0) return; // already seeded

  for (const seed of SEED_WORDS) {
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
