import Dexie, { type EntityTable } from "dexie";
import type { Word, ReviewCard, ReviewLog, UserProfile } from "./types";

const db = new Dexie("MemoryVocab") as Dexie & {
  words: EntityTable<Word, "id">;
  reviewCards: EntityTable<ReviewCard, "id">;
  reviewLogs: EntityTable<ReviewLog, "id">;
  userProfile: EntityTable<UserProfile, "id">;
};

db.version(1).stores({
  words: "++id, word, tier",
  reviewCards: "++id, wordId, card.due, card.state",
  reviewLogs: "++id, wordId, reviewedAt",
  userProfile: "id",
});

db.version(2).stores({
  words: "++id, word, tier",
  reviewCards: "++id, wordId, card.due, card.state",
  reviewLogs: "++id, wordId, reviewedAt",
  userProfile: "id",
}).upgrade((tx) => {
  return tx.table("userProfile").toCollection().modify((profile) => {
    if (!profile.difficulty) {
      profile.difficulty = "normal";
    }
  });
});

export { db };

// ── Default profile ─────────────────────────────────────────────────────

const DEFAULT_PROFILE: UserProfile = {
  id: 1,
  level: 1,
  xp: 0,
  xpToNextLevel: 200,
  hp: 100,
  maxHp: 100,
  currentStreak: 0,
  longestStreak: 0,
  totalSessions: 0,
  totalCorrect: 0,
  totalReviewed: 0,
  stats: { recall: 0, retention: 0, perception: 0, creativity: 0 },
  difficulty: "normal" as const,
};

export async function getOrCreateProfile(): Promise<UserProfile> {
  const existing = await db.userProfile.get(1);
  if (existing) return existing;
  await db.userProfile.put(DEFAULT_PROFILE);
  return DEFAULT_PROFILE;
}
