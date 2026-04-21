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
  totCapture?: TOTCapture;
  createdAt: Date;
}

export type TOTCaptureSource = "speech" | "writing" | "reading" | "meeting" | "other";

export const TOT_CAPTURE_SOURCES: TOTCaptureSource[] = [
  "speech",
  "writing",
  "reading",
  "meeting",
  "other",
];

export interface TOTCapture {
  source: TOTCaptureSource;
  weakSubstitute?: string;
  context?: string;
  capturedAt: string;
  updatedAt?: string;
  count: number;
  eventIds?: string[];
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
  contextPromptKind?: ContextPromptKind;
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
  drillProfile?: RetrievalDrillProfile;
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
  contextPromptKind?: ContextPromptKind;
}

export type GameMode = "recall" | "context" | "speed" | "association";
export type CueLevel = 0 | 1;
export type RetrievalKind = "exact" | "assisted" | "approximate" | "failed" | "created";

export type RetrievalDrillStage = "rescue" | "stabilize" | "fluent";

export interface RetrievalDrillProfile {
  stage: RetrievalDrillStage;
  exactStreak: number;
  recentCueRate: number;
  recentFailureCount: number;
  recentLatencyMs?: number;
  recallHintEnabled: boolean;
  rapidTimeoutMs: number;
  rapidCueRevealMs: number | null;
}

export interface AnswerMetadata {
  cueLevel?: CueLevel;
  /** Retrieval-only time in ms (excludes read phase). Used by Rapid Retrieval. */
  retrievalTimeMs?: number;
  contextPromptKind?: ContextPromptKind;
  /** Source sentence for deterministic rewrite-context grading. Ephemeral; not persisted to review logs. */
  contextSourceSentence?: string;
}

export type SessionState =
  | "idle"
  | "loading"
  | "active"
  | "reviewing"
  | "complete";

// ── Context Mode ────────────────────────────────────────────────────────

export type ContextPromptKind = "replace" | "produce" | "rewrite";

export interface ContextSentence {
  kind?: "replace";
  sentence: string;     // Full sentence with the weak word
  weakWord: string;     // The vague/weak word to replace
  answer: string;       // The precise word (must be a word in the library)
  distractors: string[]; // Wrong choices shown alongside the answer
}

export interface ContextProductionPrompt {
  kind: "produce";
  answer: string;
  definition: string;
  example?: string;
}

export interface ContextRewritePrompt {
  kind: "rewrite";
  sentence: string;
  weakWord: string;
  answer: string;
  definition: string;
  example?: string;
}

export type ContextPrompt = ContextSentence | ContextProductionPrompt | ContextRewritePrompt;

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
