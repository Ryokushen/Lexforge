import { db, getOrCreateProfile } from "./db";
import type { RPGStats, SessionResult, SessionSummary, UserProfile } from "./types";

// ── XP ──────────────────────────────────────────────────────────────────

const BASE_XP = 10;
const STREAK_BONUS = 2;
const SPEED_BONUS = 5;
const SPEED_THRESHOLD_MS = 3000;
const SESSION_COMPLETION_XP = 50;
const LEVEL_SCALE = 1.5;
const BASE_XP_TO_LEVEL = 200;

/** Calculate XP earned from session results. */
export function calculateSessionXP(results: SessionResult[]): number {
  let xp = 0;
  let consecutiveCorrect = 0;

  for (const r of results) {
    if (r.correct) {
      xp += BASE_XP;
      consecutiveCorrect++;
      xp += STREAK_BONUS * (consecutiveCorrect - 1);
      if (r.responseTimeMs < SPEED_THRESHOLD_MS) {
        xp += SPEED_BONUS;
      }
    } else {
      consecutiveCorrect = 0;
    }
  }

  if (results.length > 0) {
    xp += SESSION_COMPLETION_XP;
  }

  return xp;
}

/** Calculate XP required for a given level. */
export function xpForLevel(level: number): number {
  return Math.floor(BASE_XP_TO_LEVEL * Math.pow(LEVEL_SCALE, level - 1));
}

// ── HP ──────────────────────────────────────────────────────────────────

const HP_DECAY_PER_DAY = 10;
const HP_FLOOR = 20;

/** Calculate HP after missed days. */
export function decayHP(
  currentHp: number,
  maxHp: number,
  daysMissed: number,
): number {
  if (daysMissed <= 0) return currentHp;
  const decayed = currentHp - HP_DECAY_PER_DAY * daysMissed;
  return Math.max(HP_FLOOR, decayed);
}

// ── Stat growth ─────────────────────────────────────────────────────────

const CORRECT_PER_STAT_POINT = 10;

/** Calculate stat gains from session results. */
export function calculateStatGains(results: SessionResult[]): Partial<RPGStats> {
  const correct = results.filter((r) => r.correct).length;
  const speedCorrect = results.filter((r) => r.correct && r.mode === "speed").length;

  const recallGain = Math.floor(correct / CORRECT_PER_STAT_POINT);
  const retentionGain = Math.floor(correct / CORRECT_PER_STAT_POINT);
  const perceptionGain = Math.floor(speedCorrect / CORRECT_PER_STAT_POINT);

  const gains: Partial<RPGStats> = {};
  if (recallGain > 0) gains.recall = recallGain;
  if (retentionGain > 0) gains.retention = retentionGain;
  if (perceptionGain > 0) gains.perception = perceptionGain;
  return gains;
}

// ── Session completion ──────────────────────────────────────────────────

/** Process a completed session: update profile with XP, stats, streaks, HP. */
export async function completeSession(
  results: SessionResult[],
): Promise<SessionSummary> {
  const profile = await getOrCreateProfile();
  const today = new Date().toISOString().slice(0, 10);

  // Calculate gains
  const xpEarned = calculateSessionXP(results);
  const statGains = calculateStatGains(results);
  const totalCorrect = results.filter((r) => r.correct).length;
  const avgResponse =
    results.length > 0
      ? results.reduce((sum, r) => sum + r.responseTimeMs, 0) / results.length
      : 0;

  // HP decay for missed days
  let hp = profile.hp;
  if (profile.lastSessionDate && profile.lastSessionDate !== today) {
    const lastDate = new Date(profile.lastSessionDate);
    const todayDate = new Date(today);
    const daysMissed =
      Math.floor(
        (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
      ) - 1;
    hp = decayHP(hp, profile.maxHp, daysMissed);
  }

  // Streak
  let streak = profile.currentStreak;
  if (profile.lastSessionDate) {
    const lastDate = new Date(profile.lastSessionDate);
    const todayDate = new Date(today);
    const dayDiff = Math.floor(
      (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (dayDiff === 1) {
      streak += 1;
    } else if (dayDiff > 1) {
      streak = 1;
    }
    // dayDiff === 0 means same day, keep streak
  } else {
    streak = 1;
  }

  // Apply XP and check level-up
  let newXp = profile.xp + xpEarned;
  let newLevel = profile.level;
  let newXpToNext = profile.xpToNextLevel;
  let leveledUp = false;

  while (newXp >= newXpToNext) {
    newXp -= newXpToNext;
    newLevel++;
    newXpToNext = xpForLevel(newLevel);
    leveledUp = true;
    hp = profile.maxHp; // restore HP on level-up
  }

  // Apply stat gains
  const newStats = { ...profile.stats };
  if (statGains.recall) newStats.recall += statGains.recall;
  if (statGains.retention) newStats.retention += statGains.retention;
  if (statGains.perception) newStats.perception += statGains.perception;
  if (statGains.creativity) newStats.creativity += statGains.creativity;

  // Persist
  const updated: UserProfile = {
    ...profile,
    level: newLevel,
    xp: newXp,
    xpToNextLevel: newXpToNext,
    hp,
    currentStreak: streak,
    longestStreak: Math.max(streak, profile.longestStreak),
    lastSessionDate: today,
    totalSessions: profile.totalSessions + 1,
    totalCorrect: profile.totalCorrect + totalCorrect,
    totalReviewed: profile.totalReviewed + results.length,
    stats: newStats,
  };
  await db.userProfile.put(updated);

  return {
    results,
    totalCorrect,
    totalWords: results.length,
    xpEarned,
    leveledUp,
    newLevel: leveledUp ? newLevel : undefined,
    statGains,
    averageResponseTimeMs: avgResponse,
  };
}
