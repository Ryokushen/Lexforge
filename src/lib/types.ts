import type { Card } from "ts-fsrs";

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
  associationUpdatedAt?: string;
  contextSentences?: ContextSentence[];
  createdAt: Date;
}

// ── Review ──────────────────────────────────────────────────────────────

export interface ReviewCard {
  id?: number;
  wordId: number;
  card: Card; // ts-fsrs Card object (due, stability, difficulty, etc.)
  updatedAt?: string;
}

export interface ReviewLog {
  id?: number;
  wordId: number;
  sessionId?: string;
  rating: 1 | 2 | 3 | 4; // Again, Hard, Good, Easy
  responseTimeMs: number;
  correct: boolean;
  cueLevel?: CueLevel;
  retrievalKind?: RetrievalKind;
  reviewedAt: Date;
}

// ── User ────────────────────────────────────────────────────────────────

export interface RPGStats {
  recall: number;
  retention: number;
  perception: number;
  creativity: number;
}

export type Difficulty = "easy" | "normal" | "hard";

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
  difficulty: Difficulty;
  updatedAt?: string;
}

/** Difficulty settings */
export const DIFFICULTY_CONFIG: Record<Difficulty, { newWordsPerDay: number; sessionSize: number; label: string; description: string }> = {
  easy: { newWordsPerDay: 5, sessionSize: 10, label: "Easy", description: "5 new words/day, ~5 min" },
  normal: { newWordsPerDay: 10, sessionSize: 10, label: "Normal", description: "10 new words/day, ~10 min" },
  hard: { newWordsPerDay: 20, sessionSize: 15, label: "Hard", description: "20 new words/day, ~15 min" },
};

/** Tier unlock levels */
export const TIER_UNLOCK_LEVELS: Record<string, number> = {
  "1": 1,
  "2": 5,
  "3": 10,
  custom: 1,
};

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
  mode: GameMode;
  cueLevel?: CueLevel;
  retrievalKind?: RetrievalKind;
}

export type GameMode = "recall" | "context" | "speed" | "association";
export type CueLevel = 0 | 1;
export type RetrievalKind = "exact" | "assisted" | "approximate" | "failed" | "created";

export interface AnswerMetadata {
  cueLevel?: CueLevel;
}

export type SessionState =
  | "idle"
  | "loading"
  | "active"
  | "reviewing"
  | "complete";

// ── Context Mode ────────────────────────────────────────────────────────

export interface ContextSentence {
  sentence: string;     // Full sentence with the weak word
  weakWord: string;     // The vague/weak word to replace
  answer: string;       // The precise word (must be a word in the library)
  distractors: string[]; // Wrong choices shown alongside the answer
}

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
  contextSentences?: ContextSentence[];
}
