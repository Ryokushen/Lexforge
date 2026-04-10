import type { Card, RecordLog } from "ts-fsrs";

// ── Word ────────────────────────────────────────────────────────────────

export interface Word {
  id?: number;
  word: string;
  definition: string;
  examples: string[];
  pronunciation?: string;
  tier: 1 | 2 | 3 | "custom";
  synonyms: string[];
  association?: string;
  createdAt: Date;
}

// ── Review ──────────────────────────────────────────────────────────────

export interface ReviewCard {
  id?: number;
  wordId: number;
  card: Card; // ts-fsrs Card object (due, stability, difficulty, etc.)
}

export interface ReviewLog {
  id?: number;
  wordId: number;
  rating: 1 | 2 | 3 | 4; // Again, Hard, Good, Easy
  responseTimeMs: number;
  correct: boolean;
  reviewedAt: Date;
}

// ── User ────────────────────────────────────────────────────────────────

export interface RPGStats {
  recall: number;
  retention: number;
  perception: number;
  creativity: number;
}

export interface UserProfile {
  id: 1;
  level: number;
  xp: number;
  xpToNextLevel: number;
  hp: number;
  maxHp: number;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate?: string; // ISO date "YYYY-MM-DD"
  totalSessions: number;
  totalCorrect: number;
  totalReviewed: number;
  stats: RPGStats;
}

// ── Session ─────────────────────────────────────────────────────────────

export interface SessionWord {
  word: Word;
  reviewCard: ReviewCard;
}

export interface SessionResult {
  wordId: number;
  word: string;
  correct: boolean;
  responseTimeMs: number;
  rating: 1 | 2 | 3 | 4;
}

export type SessionState =
  | "idle"
  | "loading"
  | "active"
  | "reviewing"
  | "complete";

export interface SessionSummary {
  results: SessionResult[];
  totalCorrect: number;
  totalWords: number;
  xpEarned: number;
  leveledUp: boolean;
  newLevel?: number;
  statGains: Partial<RPGStats>;
  averageResponseTimeMs: number;
}

// ── Seed word format ────────────────────────────────────────────────────

export interface SeedWord {
  word: string;
  definition: string;
  examples: string[];
  synonyms: string[];
  tier: 1 | 2 | 3;
}
