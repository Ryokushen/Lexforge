import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { db, getOrCreateProfile } from "./db";

/** Push local profile to Supabase. */
async function pushProfile(user: User) {
  const profile = await getOrCreateProfile();
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    level: profile.level,
    xp: profile.xp,
    xp_to_next_level: profile.xpToNextLevel,
    hp: profile.hp,
    max_hp: profile.maxHp,
    current_streak: profile.currentStreak,
    longest_streak: profile.longestStreak,
    last_session_date: profile.lastSessionDate ?? null,
    total_sessions: profile.totalSessions,
    total_correct: profile.totalCorrect,
    total_reviewed: profile.totalReviewed,
    stats: profile.stats,
    difficulty: profile.difficulty,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error("Push profile error:", error);
}

/** Pull profile from Supabase into Dexie. */
async function pullProfile(user: User): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) return false;

  await db.userProfile.put({
    id: 1,
    level: data.level,
    xp: data.xp,
    xpToNextLevel: data.xp_to_next_level,
    hp: data.hp,
    maxHp: data.max_hp,
    currentStreak: data.current_streak,
    longestStreak: data.longest_streak,
    lastSessionDate: data.last_session_date ?? undefined,
    totalSessions: data.total_sessions,
    totalCorrect: data.total_correct,
    totalReviewed: data.total_reviewed,
    stats: data.stats,
    difficulty: data.difficulty,
  });
  return true;
}

/** Push all review cards to Supabase. */
async function pushReviewCards(user: User) {
  const cards = await db.reviewCards.toArray();
  const words = await db.words.toArray();
  const wordMap = new Map(words.map((w) => [w.id, w.word]));

  const rows = cards
    .filter((rc) => wordMap.has(rc.wordId))
    .map((rc) => ({
      user_id: user.id,
      word_key: wordMap.get(rc.wordId)!,
      card: rc.card,
      updated_at: new Date().toISOString(),
    }));

  if (rows.length === 0) return;

  // Batch upsert in chunks of 100
  for (let i = 0; i < rows.length; i += 100) {
    const chunk = rows.slice(i, i + 100);
    const { error } = await supabase
      .from("review_cards")
      .upsert(chunk, { onConflict: "user_id,word_key" });
    if (error) console.error("Push cards error:", error);
  }
}

/** Pull review cards from Supabase into Dexie. */
async function pullReviewCards(user: User) {
  const { data, error } = await supabase
    .from("review_cards")
    .select("*")
    .eq("user_id", user.id);

  if (error || !data || data.length === 0) return;

  const words = await db.words.toArray();
  const wordIdMap = new Map(words.map((w) => [w.word, w.id]));

  for (const row of data) {
    const wordId = wordIdMap.get(row.word_key);
    if (!wordId) continue;

    const existing = await db.reviewCards
      .where("wordId")
      .equals(wordId)
      .first();

    if (existing) {
      await db.reviewCards.update(existing.id!, { card: row.card });
    } else {
      await db.reviewCards.add({ wordId, card: row.card });
    }
  }
}

/** Push word associations to Supabase. */
async function pushAssociations(user: User) {
  const words = await db.words.toArray();
  const rows = words
    .filter((w) => w.association)
    .map((w) => ({
      user_id: user.id,
      word_key: w.word,
      association: w.association!,
      updated_at: new Date().toISOString(),
    }));

  if (rows.length === 0) return;

  const { error } = await supabase
    .from("word_associations")
    .upsert(rows, { onConflict: "user_id,word_key" });
  if (error) console.error("Push associations error:", error);
}

/** Pull associations from Supabase into Dexie. */
async function pullAssociations(user: User) {
  const { data, error } = await supabase
    .from("word_associations")
    .select("*")
    .eq("user_id", user.id);

  if (error || !data || data.length === 0) return;

  const words = await db.words.toArray();
  const wordIdMap = new Map(words.map((w) => [w.word, w.id]));

  for (const row of data) {
    const wordId = wordIdMap.get(row.word_key);
    if (wordId) {
      await db.words.update(wordId, { association: row.association });
    }
  }
}

/** Full push to cloud. Call after session completion. */
export async function pushToCloud(user: User) {
  try {
    await Promise.all([
      pushProfile(user),
      pushReviewCards(user),
      pushAssociations(user),
    ]);
  } catch (err) {
    console.error("Cloud sync push failed:", err);
  }
}

/** Full pull from cloud. Call on login. */
async function pullFromCloud(user: User) {
  try {
    await Promise.all([
      pullProfile(user),
      pullReviewCards(user),
      pullAssociations(user),
    ]);
  } catch (err) {
    console.error("Cloud sync pull failed:", err);
  }
}

/** Sync on login: check if cloud has data, pull if yes, push if no. */
export async function syncOnLogin(user: User) {
  try {
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (data) {
      // Cloud has data — pull it
      await pullFromCloud(user);
    } else {
      // First login — push local data to cloud
      await pushToCloud(user);
    }
  } catch (err) {
    console.error("Sync on login failed:", err);
  }
}
