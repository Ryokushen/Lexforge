import type { User } from "@supabase/supabase-js";
import {
  createLegacyTOTEventIds,
  createTOTEventId,
  getTOTEventIds,
  normalizeWord,
} from "./word-library";
import { toLocalDateKey } from "./date";
import { supabase } from "./supabase";
import { db, getOrCreateProfile } from "./db";
import type {
  RetrievalKind,
  ReviewCard,
  ReviewLog,
  TOTCaptureSource,
  UserProfile,
  Word,
} from "./types";

const SYNC_BATCH_SIZE = 100;
export const CLOUD_SYNC_EVENT = "lexforge-cloud-sync";

export type CloudSyncEventDetail = {
  state: "syncing" | "synced" | "error";
  error?: string;
  lastSyncAt?: string;
};

type CloudProfileRow = {
  id: string;
  level: number;
  xp: number;
  xp_to_next_level: number;
  hp: number;
  max_hp: number;
  current_streak: number;
  longest_streak: number;
  last_session_date?: string | null;
  total_sessions: number;
  total_correct: number;
  total_reviewed: number;
  stats: UserProfile["stats"];
  difficulty: UserProfile["difficulty"];
  updated_at?: string | null;
};

type CloudReviewCardRow = {
  user_id: string;
  word_key: string;
  normalized_word_key?: string | null;
  card: ReviewCard["card"];
  updated_at?: string | null;
};

type CloudReviewLogRow = {
  user_id: string;
  word_key: string;
  normalized_word_key?: string | null;
  session_id?: string | null;
  rating: number;
  response_time_ms: number;
  correct: boolean;
  cue_level?: number | null;
  retrieval_kind?: string | null;
  context_prompt_kind?: string | null;
  reviewed_at: string;
  updated_at?: string | null;
};

type CloudAssociationRow = {
  user_id: string;
  word_key: string;
  normalized_word_key?: string | null;
  association: string;
  updated_at?: string | null;
};

type CloudCustomWordRow = {
  user_id: string;
  word_key: string;
  normalized_word_key?: string | null;
  definition: string;
  examples?: unknown;
  pronunciation?: string | null;
  synonyms?: unknown;
  created_at?: string | null;
  updated_at?: string | null;
};

type CloudTOTCaptureRow = {
  user_id: string;
  word_key: string;
  normalized_word_key?: string | null;
  source: TOTCaptureSource;
  weak_substitute?: string | null;
  context?: string | null;
  captured_at: string;
  count: number;
  event_ids?: unknown;
  updated_at?: string | null;
};

type CloudSnapshot = {
  profile: CloudProfileRow | null;
  reviewCards: CloudReviewCardRow[];
  reviewLogs: CloudReviewLogRow[];
  associations: CloudAssociationRow[];
  customWords: CloudCustomWordRow[];
  totCaptures: CloudTOTCaptureRow[];
};

type MergedReviewStats = {
  totalReviewed: number;
  totalCorrect: number;
  estimatedSessions: number;
  sessionCountsByDay: Record<string, number>;
};

export function getCloudWordLookupKey(row: {
  word_key: string;
  normalized_word_key?: string | null;
}): string {
  return normalizeWord(row.normalized_word_key ?? row.word_key);
}

export function getLocalWordLookupKey(word: Pick<Word, "word">): string {
  return normalizeWord(word.word);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown cloud sync error";
}

function emitCloudSyncEvent(detail: CloudSyncEventDetail) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<CloudSyncEventDetail>(CLOUD_SYNC_EVENT, { detail }),
  );
}

function toMillis(value?: string | Date | null): number {
  if (!value) return 0;
  const timestamp = value instanceof Date ? value.getTime() : Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function maxIso(...values: Array<string | null | undefined>): string {
  const winner = values.reduce<string | null>((latest, current) => {
    if (!current) return latest;
    if (!latest) return current;
    return toMillis(current) >= toMillis(latest) ? current : latest;
  }, null);

  return winner ?? new Date(0).toISOString();
}

export function compareDateOnly(a?: string | null, b?: string | null): number {
  if (!a && !b) return 0;
  if (!a) return -1;
  if (!b) return 1;
  return a.localeCompare(b);
}

export function normalizeTextArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function mergeUniqueStrings(...groups: string[][]): string[] {
  const merged = new Set<string>();

  for (const group of groups) {
    for (const item of group) {
      const normalized = item.trim();
      if (normalized) {
        merged.add(normalized);
      }
    }
  }

  return [...merged];
}

function pickRicherText(localValue?: string | null, remoteValue?: string | null): string | undefined {
  const local = localValue?.trim() ?? "";
  const remote = remoteValue?.trim() ?? "";

  if (!local) return remote || undefined;
  if (!remote) return local;

  return remote.length > local.length ? remote : local;
}

function getWordSyncUpdatedAt(word: Word): string {
  return maxIso(
    word.createdAt.toISOString(),
    word.associationUpdatedAt,
    word.totCapture?.updatedAt ?? word.totCapture?.capturedAt,
  );
}

function cloudCustomWordToLocal(row: CloudCustomWordRow): Omit<Word, "id"> {
  return {
    word: row.word_key,
    definition: row.definition,
    examples: normalizeTextArray(row.examples),
    pronunciation: row.pronunciation ?? undefined,
    tier: "custom",
    synonyms: normalizeTextArray(row.synonyms),
    createdAt: new Date(row.created_at ?? new Date(0).toISOString()),
  };
}

function mergeCustomWord(localWord: Word, remoteWord: Omit<Word, "id">): Partial<Word> {
  return {
    definition: pickRicherText(localWord.definition, remoteWord.definition) ?? localWord.definition,
    examples: mergeUniqueStrings(localWord.examples, remoteWord.examples),
    pronunciation: pickRicherText(localWord.pronunciation, remoteWord.pronunciation),
    synonyms: mergeUniqueStrings(localWord.synonyms, remoteWord.synonyms),
    createdAt: new Date(
      Math.min(localWord.createdAt.getTime(), remoteWord.createdAt.getTime()),
    ),
  };
}

function getCloudTOTEventIds(
  row: CloudTOTCaptureRow): string[] {
  const explicitIds = normalizeTextArray(row.event_ids);
  if (explicitIds.length > 0) {
    return [...new Set(explicitIds)];
  }

  return createLegacyTOTEventIds(
    getCloudWordLookupKey(row),
    row.count,
    row.updated_at ?? row.captured_at,
  );
}

function mergeTOTCapture(
  localWord: Word,
  remoteRow: CloudTOTCaptureRow,
): NonNullable<Word["totCapture"]> {
  const localCapture = localWord.totCapture;
  const remoteUpdatedAt = remoteRow.updated_at ?? remoteRow.captured_at;
  const localUpdatedAt = localCapture?.updatedAt ?? localCapture?.capturedAt;
  const remoteIsNewer = toMillis(remoteUpdatedAt) >= toMillis(localUpdatedAt);
  const localEventIds = getTOTEventIds(localWord, localCapture);
  const remoteEventIds = getCloudTOTEventIds(remoteRow);
  const mergedEventIds = mergeUniqueStrings(localEventIds, remoteEventIds);
  const mergedCount = Math.max(
    localCapture?.count ?? 0,
    remoteRow.count,
    mergedEventIds.length,
  );

  return {
    source: remoteIsNewer
      ? remoteRow.source
      : (localCapture?.source ?? remoteRow.source),
    weakSubstitute: pickRicherText(localCapture?.weakSubstitute, remoteRow.weak_substitute),
    context: pickRicherText(localCapture?.context, remoteRow.context),
    capturedAt: maxIso(localCapture?.capturedAt, remoteRow.captured_at),
    count: mergedCount,
    eventIds: mergedEventIds.length > 0 ? mergedEventIds : undefined,
    updatedAt: maxIso(localUpdatedAt, remoteUpdatedAt),
  };
}

function chunkRows<T>(rows: T[]): T[][] {
  const chunks: T[][] = [];

  for (let i = 0; i < rows.length; i += SYNC_BATCH_SIZE) {
    chunks.push(rows.slice(i, i + SYNC_BATCH_SIZE));
  }

  return chunks;
}

export function normalizeRetrievalKind(value: string | null | undefined, correct: boolean): RetrievalKind {
  if (
    value === "exact"
    || value === "assisted"
    || value === "approximate"
    || value === "failed"
    || value === "created"
  ) {
    return value;
  }

  return correct ? "exact" : "failed";
}

export function normalizeContextPromptKind(value: string | null | undefined): ReviewLog["contextPromptKind"] {
  if (value === "replace" || value === "produce" || value === "rewrite") {
    return value;
  }

  return undefined;
}

function normalizeProfile(profile: UserProfile): UserProfile {
  return {
    ...profile,
    updatedAt:
      profile.updatedAt
      ?? (profile.lastSessionDate
        ? new Date(profile.lastSessionDate).toISOString()
        : new Date(0).toISOString()),
  };
}

function cloudProfileToLocal(profile: CloudProfileRow): UserProfile {
  return {
    id: 1,
    level: profile.level,
    xp: profile.xp,
    xpToNextLevel: profile.xp_to_next_level,
    hp: profile.hp,
    maxHp: profile.max_hp,
    currentStreak: profile.current_streak,
    longestStreak: profile.longest_streak,
    lastSessionDate: profile.last_session_date ?? undefined,
    totalSessions: profile.total_sessions,
    totalCorrect: profile.total_correct,
    totalReviewed: profile.total_reviewed,
    stats: profile.stats,
    difficulty: profile.difficulty,
    updatedAt: profile.updated_at ?? new Date(0).toISOString(),
  };
}

function normalizeReviewCard(card: ReviewCard): ReviewCard {
  return {
    ...card,
    updatedAt:
      card.updatedAt
      ?? (card.card.last_review
        ? new Date(card.card.last_review).toISOString()
        : new Date(0).toISOString()),
  };
}

function cloudCardToLocal(row: CloudReviewCardRow, wordId: number): ReviewCard {
  return normalizeReviewCard({
    wordId,
    card: row.card,
    updatedAt:
      row.updated_at
      ?? (row.card.last_review
        ? new Date(row.card.last_review).toISOString()
        : new Date(0).toISOString()),
  });
}

function getCardProgressScore(card: ReviewCard["card"]): [number, number, number, number] {
  return [
    card.state === 0 ? 0 : 1,
    card.reps ?? 0,
    toMillis(card.last_review),
    toMillis(card.due),
  ];
}

function shouldKeepLocalCard(localCard: ReviewCard, remoteCard: ReviewCard): boolean {
  const [localSeen, localReps, localLastReview, localDue] = getCardProgressScore(localCard.card);
  const [remoteSeen, remoteReps, remoteLastReview, remoteDue] = getCardProgressScore(remoteCard.card);

  if (localSeen !== remoteSeen) return localSeen > remoteSeen;
  if (localReps !== remoteReps) return localReps > remoteReps;
  if (localLastReview !== remoteLastReview) return localLastReview > remoteLastReview;
  if (localDue !== remoteDue) return localDue > remoteDue;

  const localUpdated = toMillis(localCard.updatedAt);
  const remoteUpdated = toMillis(remoteCard.updatedAt);

  if (localUpdated !== remoteUpdated) {
    return localUpdated > remoteUpdated;
  }

  return true;
}

function mergeStats(
  localStats: UserProfile["stats"],
  remoteStats: UserProfile["stats"],
): UserProfile["stats"] {
  return {
    recall: Math.max(localStats.recall, remoteStats.recall),
    retention: Math.max(localStats.retention, remoteStats.retention),
    perception: Math.max(localStats.perception, remoteStats.perception),
    creativity: Math.max(localStats.creativity, remoteStats.creativity),
  };
}

function pickMoreProgressedProfile(local: UserProfile, remote: UserProfile): UserProfile {
  if (local.level !== remote.level) {
    return local.level > remote.level ? local : remote;
  }

  if (local.xp !== remote.xp) {
    return local.xp >= remote.xp ? local : remote;
  }

  return toMillis(local.updatedAt) >= toMillis(remote.updatedAt) ? local : remote;
}

function estimateLegacySessionCount(logs: ReviewLog[]): number {
  if (logs.length === 0) return 0;

  const sortedLogs = [...logs].sort(
    (left, right) => left.reviewedAt.getTime() - right.reviewedAt.getTime(),
  );
  let sessions = 0;
  let previousLog: ReviewLog | null = null;

  for (const log of sortedLogs) {
    if (!previousLog) {
      sessions += 1;
      previousLog = log;
      continue;
    }

    const changedDay = toLocalDateKey(log.reviewedAt) !== toLocalDateKey(previousLog.reviewedAt);
    const gapMs = log.reviewedAt.getTime() - previousLog.reviewedAt.getTime();

    if (changedDay || gapMs > 45 * 60 * 1000) {
      sessions += 1;
    }

    previousLog = log;
  }

  return sessions;
}

function countSessionsByDay(logs: ReviewLog[]): Record<string, number> {
  const counts = new Map<string, number>();
  const logsBySessionId = new Map<string, ReviewLog[]>();
  const legacyLogsByDay = new Map<string, ReviewLog[]>();

  for (const log of logs) {
    if (log.sessionId) {
      const bucket = logsBySessionId.get(log.sessionId) ?? [];
      bucket.push(log);
      logsBySessionId.set(log.sessionId, bucket);
      continue;
    }

    const dayKey = toLocalDateKey(log.reviewedAt);
    const bucket = legacyLogsByDay.get(dayKey) ?? [];
    bucket.push(log);
    legacyLogsByDay.set(dayKey, bucket);
  }

  for (const sessionLogs of logsBySessionId.values()) {
    const sorted = [...sessionLogs].sort(
      (left, right) => left.reviewedAt.getTime() - right.reviewedAt.getTime(),
    );
    const dayKey = toLocalDateKey(sorted[0].reviewedAt);
    counts.set(dayKey, (counts.get(dayKey) ?? 0) + 1);
  }

  for (const [dayKey, legacyLogs] of legacyLogsByDay.entries()) {
    counts.set(dayKey, (counts.get(dayKey) ?? 0) + estimateLegacySessionCount(legacyLogs));
  }

  return Object.fromEntries(counts);
}

function estimateSessionCount(logs: ReviewLog[]): number {
  const explicitSessionIds = new Set(
    logs.flatMap((log) => (log.sessionId ? [log.sessionId] : [])),
  );
  const legacyLogs = logs.filter((log) => !log.sessionId);

  return explicitSessionIds.size + estimateLegacySessionCount(legacyLogs);
}

function summarizeMergedReviewLogs(logs: ReviewLog[]): MergedReviewStats {
  return {
    totalReviewed: logs.length,
    totalCorrect: logs.filter((log) => log.correct).length,
    estimatedSessions: estimateSessionCount(logs),
    sessionCountsByDay: countSessionsByDay(logs),
  };
}

function mergeProfiles(
  localProfile: UserProfile,
  cloudProfile: CloudProfileRow | null,
  mergedReviewStats?: MergedReviewStats,
): UserProfile {
  const local = normalizeProfile(localProfile);

  if (!cloudProfile) return local;

  const remote = cloudProfileToLocal(cloudProfile);
  const newer = toMillis(local.updatedAt) >= toMillis(remote.updatedAt) ? local : remote;
  const progressed = pickMoreProgressedProfile(local, remote);
  const latestSessionDate =
    compareDateOnly(local.lastSessionDate, remote.lastSessionDate) >= 0
      ? local.lastSessionDate
      : remote.lastSessionDate;

  let currentStreak = newer.currentStreak;
  if (compareDateOnly(local.lastSessionDate, remote.lastSessionDate) === 0) {
    currentStreak = Math.max(local.currentStreak, remote.currentStreak);
  } else if (latestSessionDate === local.lastSessionDate) {
    currentStreak = local.currentStreak;
  } else if (latestSessionDate === remote.lastSessionDate) {
    currentStreak = remote.currentStreak;
  }

  const sameLatestSessionDay = Boolean(
    latestSessionDate
    && local.lastSessionDate === latestSessionDate
    && remote.lastSessionDate === latestSessionDate,
  );
  const reviewedFloor = mergedReviewStats?.totalReviewed ?? 0;
  const correctFloor = mergedReviewStats?.totalCorrect ?? 0;
  const sessionFloor = mergedReviewStats?.estimatedSessions ?? 0;
  const independentSameDayWork = sameLatestSessionDay
    && (
      reviewedFloor > Math.max(local.totalReviewed, remote.totalReviewed)
      || correctFloor > Math.max(local.totalCorrect, remote.totalCorrect)
    );
  const latestDaySessions = latestSessionDate
    ? (mergedReviewStats?.sessionCountsByDay[latestSessionDate] ?? 0)
    : 0;
  let totalSessions = Math.max(local.totalSessions, remote.totalSessions, sessionFloor);
  if (sameLatestSessionDay && latestDaySessions > 1) {
    totalSessions = Math.max(
      totalSessions,
      Math.max(local.totalSessions, remote.totalSessions) + latestDaySessions - 1,
    );
  }
  if (independentSameDayWork) {
    totalSessions = Math.max(
      totalSessions,
      Math.max(local.totalSessions, remote.totalSessions) + 1,
    );
  }

  return {
    id: 1,
    level: progressed.level,
    xp: progressed.xp,
    xpToNextLevel: progressed.xpToNextLevel,
    hp: newer.hp,
    maxHp: Math.max(local.maxHp, remote.maxHp),
    currentStreak,
    longestStreak: Math.max(local.longestStreak, remote.longestStreak, currentStreak),
    lastSessionDate: latestSessionDate,
    totalSessions,
    totalCorrect: Math.max(local.totalCorrect, remote.totalCorrect, correctFloor),
    totalReviewed: Math.max(local.totalReviewed, remote.totalReviewed, reviewedFloor),
    stats: mergeStats(local.stats, remote.stats),
    difficulty: newer.difficulty,
    updatedAt: maxIso(local.updatedAt, remote.updatedAt),
  };
}

async function fetchCloudSnapshot(user: User): Promise<CloudSnapshot> {
  const [
    profileResponse,
    reviewCardsResponse,
    reviewLogsResponse,
    associationsResponse,
    customWordsResponse,
    totCapturesResponse,
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id),
    supabase.from("review_cards").select("*").eq("user_id", user.id),
    supabase.from("review_logs").select("*").eq("user_id", user.id),
    supabase.from("word_associations").select("*").eq("user_id", user.id),
    supabase.from("custom_words").select("*").eq("user_id", user.id),
    supabase.from("word_tot_captures").select("*").eq("user_id", user.id),
  ]);

  if (profileResponse.error) throw profileResponse.error;
  if (reviewCardsResponse.error) throw reviewCardsResponse.error;
  if (reviewLogsResponse.error) throw reviewLogsResponse.error;
  if (associationsResponse.error) throw associationsResponse.error;
  if (customWordsResponse.error) throw customWordsResponse.error;
  if (totCapturesResponse.error) throw totCapturesResponse.error;

  return {
    profile: ((profileResponse.data as CloudProfileRow[] | null) ?? [])[0] ?? null,
    reviewCards: (reviewCardsResponse.data as CloudReviewCardRow[] | null) ?? [],
    reviewLogs: (reviewLogsResponse.data as CloudReviewLogRow[] | null) ?? [],
    associations: (associationsResponse.data as CloudAssociationRow[] | null) ?? [],
    customWords: (customWordsResponse.data as CloudCustomWordRow[] | null) ?? [],
    totCaptures: (totCapturesResponse.data as CloudTOTCaptureRow[] | null) ?? [],
  };
}

async function reconcileProfile(
  cloudProfile: CloudProfileRow | null,
  mergedReviewStats?: MergedReviewStats,
) {
  const localProfile = await getOrCreateProfile();
  const mergedProfile = mergeProfiles(localProfile, cloudProfile, mergedReviewStats);

  await db.userProfile.put(mergedProfile);
  return mergedProfile;
}

async function reconcileReviewCards(cloudCards: CloudReviewCardRow[], words: Word[]) {
  const wordIdMap = new Map(words.map((word) => [getLocalWordLookupKey(word), word.id]));
  const localCards = (await db.reviewCards.toArray()).map(normalizeReviewCard);
  const localCardsByWordId = new Map(localCards.map((card) => [card.wordId, card]));

  for (const row of cloudCards) {
    const wordId = wordIdMap.get(getCloudWordLookupKey(row));
    if (!wordId) continue;

    const remoteCard = cloudCardToLocal(row, wordId);
    const localCard = localCardsByWordId.get(wordId);

    if (!localCard) {
      await db.reviewCards.add(remoteCard);
      localCardsByWordId.set(wordId, remoteCard);
      continue;
    }

    const winner = shouldKeepLocalCard(localCard, remoteCard) ? localCard : remoteCard;
    if (winner !== localCard) {
      await db.reviewCards.update(localCard.id!, winner);
      localCardsByWordId.set(wordId, winner);
      continue;
    }

    if (localCard.updatedAt !== winner.updatedAt) {
      await db.reviewCards.update(localCard.id!, { updatedAt: winner.updatedAt });
    }
  }
}

async function reconcileReviewLogs(
  cloudLogs: CloudReviewLogRow[],
  words: Word[],
): Promise<MergedReviewStats> {
  const wordIdMap = new Map(words.map((word) => [getLocalWordLookupKey(word), word.id]));
  const existingLogs = await db.reviewLogs.toArray();
  const existingLogsByKey = new Map(
    existingLogs.map((log) => [`${log.wordId}:${log.reviewedAt.toISOString()}`, log]),
  );

  for (const row of cloudLogs) {
    const wordId = wordIdMap.get(getCloudWordLookupKey(row));
    if (!wordId) continue;

    const reviewedAt = new Date(row.reviewed_at);
    const logKey = `${wordId}:${reviewedAt.toISOString()}`;
    const contextPromptKind = normalizeContextPromptKind(row.context_prompt_kind);
    const existingLog = existingLogsByKey.get(logKey);

    if (existingLog) {
      if (!existingLog.contextPromptKind && contextPromptKind && existingLog.id !== undefined) {
        await db.reviewLogs.update(existingLog.id, { contextPromptKind });
        existingLogsByKey.set(logKey, { ...existingLog, contextPromptKind });
      }
      continue;
    }

    await db.reviewLogs.add({
      wordId,
      sessionId: row.session_id ?? undefined,
      rating: row.rating as 1 | 2 | 3 | 4,
      responseTimeMs: row.response_time_ms,
      correct: row.correct,
      cueLevel: row.cue_level === 1 ? 1 : 0,
      retrievalKind: normalizeRetrievalKind(row.retrieval_kind, row.correct),
      contextPromptKind,
      reviewedAt,
    });
    existingLogsByKey.set(logKey, {
      wordId,
      sessionId: row.session_id ?? undefined,
      rating: row.rating as 1 | 2 | 3 | 4,
      responseTimeMs: row.response_time_ms,
      correct: row.correct,
      cueLevel: row.cue_level === 1 ? 1 : 0,
      retrievalKind: normalizeRetrievalKind(row.retrieval_kind, row.correct),
      contextPromptKind,
      reviewedAt,
    });
  }

  const mergedLogs = await db.reviewLogs.toArray();
  return summarizeMergedReviewLogs(mergedLogs);
}

async function reconcileAssociations(cloudAssociations: CloudAssociationRow[], words: Word[]) {
  const localWordsByKey = new Map(words.map((word) => [getLocalWordLookupKey(word), word]));

  for (const row of cloudAssociations) {
    const localWord = localWordsByKey.get(getCloudWordLookupKey(row));
    if (!localWord) continue;

    const localAssociation = localWord.association?.trim();
    const cloudAssociation = row.association.trim();

    if (!localAssociation) {
      await db.words.update(localWord.id!, {
        association: cloudAssociation,
        associationUpdatedAt: row.updated_at ?? new Date(0).toISOString(),
      });
      localWordsByKey.set(getCloudWordLookupKey(row), {
        ...localWord,
        association: cloudAssociation,
        associationUpdatedAt: row.updated_at ?? new Date(0).toISOString(),
      });
      continue;
    }

    if (localAssociation === cloudAssociation) {
      const mergedUpdatedAt = maxIso(localWord.associationUpdatedAt, row.updated_at);
      if (localWord.associationUpdatedAt !== mergedUpdatedAt) {
        await db.words.update(localWord.id!, { associationUpdatedAt: mergedUpdatedAt });
      }
      continue;
    }

    const localUpdated = toMillis(localWord.associationUpdatedAt);
    const cloudUpdated = toMillis(row.updated_at);

    if (cloudUpdated > localUpdated) {
      await db.words.update(localWord.id!, {
        association: cloudAssociation,
        associationUpdatedAt: row.updated_at ?? new Date(0).toISOString(),
      });
      localWordsByKey.set(getCloudWordLookupKey(row), {
        ...localWord,
        association: cloudAssociation,
        associationUpdatedAt: row.updated_at ?? new Date(0).toISOString(),
      });
    } else if (!localWord.associationUpdatedAt) {
      await db.words.update(localWord.id!, {
        associationUpdatedAt: localWord.createdAt.toISOString(),
      });
    }
  }
}

async function reconcileCustomWords(cloudCustomWords: CloudCustomWordRow[]) {
  const localWords = await db.words.toArray();
  const localCustomWordsByKey = new Map(
    localWords
      .filter((word) => word.tier === "custom")
      .map((word) => [getLocalWordLookupKey(word), word]),
  );

  for (const row of cloudCustomWords) {
    const localWord = localCustomWordsByKey.get(getCloudWordLookupKey(row));
    const remoteWord = cloudCustomWordToLocal(row);

    if (!localWord) {
      const id = await db.words.add(remoteWord as Word);
      localCustomWordsByKey.set(getLocalWordLookupKey({ word: remoteWord.word }), { ...remoteWord, id });
      continue;
    }

    const mergedWord = mergeCustomWord(localWord, remoteWord);
    await db.words.update(localWord.id!, mergedWord);
    localCustomWordsByKey.set(getLocalWordLookupKey(localWord), { ...localWord, ...mergedWord });
  }
}

async function reconcileTOTCaptures(cloudTOTCaptures: CloudTOTCaptureRow[], words: Word[]) {
  const localWordsByKey = new Map(words.map((word) => [getLocalWordLookupKey(word), word]));

  for (const row of cloudTOTCaptures) {
    const localWord = localWordsByKey.get(getCloudWordLookupKey(row));
    if (!localWord) continue;

    const mergedTOTCapture = mergeTOTCapture(localWord, row);
    await db.words.update(localWord.id!, { totCapture: mergedTOTCapture });
    localWordsByKey.set(getCloudWordLookupKey(row), { ...localWord, totCapture: mergedTOTCapture });
  }
}

async function reconcileCloudState(user: User) {
  const snapshot = await fetchCloudSnapshot(user);
  await reconcileCustomWords(snapshot.customWords);
  const words = await db.words.toArray();

  const mergedReviewStats = await reconcileReviewLogs(snapshot.reviewLogs, words);
  await reconcileReviewCards(snapshot.reviewCards, words);
  await reconcileAssociations(snapshot.associations, words);
  await reconcileTOTCaptures(snapshot.totCaptures, words);
  const profile = await reconcileProfile(snapshot.profile, mergedReviewStats);

  return { profile };
}

/** Push local profile to Supabase. */
async function pushProfile(user: User, profileOverride?: UserProfile) {
  const profile = normalizeProfile(profileOverride ?? await getOrCreateProfile());
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
    updated_at: profile.updatedAt,
  });

  if (error) throw error;
}

/** Push all review cards to Supabase. */
async function pushReviewCards(user: User) {
  const cards = (await db.reviewCards.toArray()).map(normalizeReviewCard);
  const words = await db.words.toArray();
  const wordMap = new Map(words.map((word) => [word.id, word.word]));

  const rows = cards
    .filter((card) => wordMap.has(card.wordId))
    .map((card) => ({
      user_id: user.id,
      word_key: wordMap.get(card.wordId)!,
      normalized_word_key: normalizeWord(wordMap.get(card.wordId)!),
      card: card.card,
      updated_at: card.updatedAt,
    }));

  for (const chunk of chunkRows(rows)) {
    const { error } = await supabase
      .from("review_cards")
      .upsert(chunk, { onConflict: "user_id,normalized_word_key" });

    if (error) throw error;
  }
}

/** Push review logs to Supabase so daily limits stay consistent across browsers. */
async function pushReviewLogs(user: User) {
  const logs = await db.reviewLogs.toArray();
  const words = await db.words.toArray();
  const wordMap = new Map(words.map((word) => [word.id, word.word]));

  const rows = logs
    .filter((log) => wordMap.has(log.wordId))
    .map((log) => ({
      user_id: user.id,
      word_key: wordMap.get(log.wordId)!,
      normalized_word_key: normalizeWord(wordMap.get(log.wordId)!),
      session_id: log.sessionId ?? null,
      rating: log.rating,
      response_time_ms: log.responseTimeMs,
      correct: log.correct,
      cue_level: log.cueLevel ?? 0,
      retrieval_kind: normalizeRetrievalKind(log.retrievalKind, log.correct),
      context_prompt_kind: log.contextPromptKind ?? null,
      reviewed_at: log.reviewedAt.toISOString(),
      updated_at: log.reviewedAt.toISOString(),
    }));

  for (const chunk of chunkRows(rows)) {
    const { error } = await supabase
      .from("review_logs")
      .upsert(chunk, { onConflict: "user_id,normalized_word_key,reviewed_at" });

    if (error) throw error;
  }
}

/** Push word associations to Supabase. */
async function pushAssociations(user: User) {
  const words = await db.words.toArray();
  const rows = words
    .filter((word) => word.association)
    .map((word) => ({
      user_id: user.id,
      word_key: word.word,
      normalized_word_key: normalizeWord(word.word),
      association: word.association!,
      updated_at: word.associationUpdatedAt ?? word.createdAt.toISOString(),
    }));

  for (const chunk of chunkRows(rows)) {
    const { error } = await supabase
      .from("word_associations")
      .upsert(chunk, { onConflict: "user_id,normalized_word_key" });

    if (error) throw error;
  }
}

/** Push custom words so they can be restored on other devices. */
async function pushCustomWords(user: User) {
  const words = await db.words.toArray();
  const rows = words
    .filter((word) => word.tier === "custom")
    .map((word) => ({
      user_id: user.id,
      word_key: word.word,
      normalized_word_key: normalizeWord(word.word),
      definition: word.definition,
      examples: word.examples,
      pronunciation: word.pronunciation ?? null,
      synonyms: word.synonyms,
      created_at: word.createdAt.toISOString(),
      updated_at: getWordSyncUpdatedAt(word),
    }));

  for (const chunk of chunkRows(rows)) {
    const { error } = await supabase
      .from("custom_words")
      .upsert(chunk, { onConflict: "user_id,normalized_word_key" });

    if (error) throw error;
  }
}

/** Push TOT capture summaries for cross-device recovery drilling. */
async function pushTOTCaptures(user: User) {
  const words = await db.words.toArray();
  const rows = words
    .filter((word) => word.totCapture)
    .map((word) => {
      const eventIds = getTOTEventIds(word, word.totCapture);

      return {
        user_id: user.id,
        word_key: word.word,
        normalized_word_key: normalizeWord(word.word),
        source: word.totCapture!.source,
        weak_substitute: word.totCapture!.weakSubstitute ?? null,
        context: word.totCapture!.context ?? null,
        captured_at: word.totCapture!.capturedAt,
        count: Math.max(word.totCapture!.count, eventIds.length),
        event_ids: eventIds,
        updated_at: word.totCapture!.updatedAt ?? word.totCapture!.capturedAt,
      };
    });

  for (const chunk of chunkRows(rows)) {
    const { error } = await supabase
      .from("word_tot_captures")
      .upsert(chunk, { onConflict: "user_id,normalized_word_key" });

    if (error) throw error;
  }
}

async function pushToCloudInternal(
  user: User,
  reconciledState?: { profile: UserProfile },
) {
  await Promise.all([
    pushProfile(user, reconciledState?.profile),
    pushCustomWords(user),
    pushReviewCards(user),
    pushReviewLogs(user),
    pushAssociations(user),
    pushTOTCaptures(user),
  ]);
}

async function reconcileAndPush(user: User) {
  const reconciledState = await reconcileCloudState(user);
  await pushToCloudInternal(user, reconciledState);
}

/** Full push to cloud. Call after session completion or manual sync. */
export async function pushToCloud(user: User) {
  emitCloudSyncEvent({ state: "syncing" });

  try {
    await reconcileAndPush(user);
    const lastSyncAt = new Date().toISOString();
    emitCloudSyncEvent({ state: "synced", lastSyncAt });
    return { lastSyncAt };
  } catch (error) {
    console.error("Cloud sync push failed:", error);
    emitCloudSyncEvent({ state: "error", error: getErrorMessage(error) });
    throw error;
  }
}

/** Sync on login by reconciling local and cloud data, then pushing the merged result. */
export async function syncOnLogin(user: User) {
  emitCloudSyncEvent({ state: "syncing" });

  try {
    await reconcileAndPush(user);
    const lastSyncAt = new Date().toISOString();
    emitCloudSyncEvent({ state: "synced", lastSyncAt });
    return { lastSyncAt };
  } catch (error) {
    console.error("Sync on login failed:", error);
    emitCloudSyncEvent({ state: "error", error: getErrorMessage(error) });
    throw error;
  }
}
