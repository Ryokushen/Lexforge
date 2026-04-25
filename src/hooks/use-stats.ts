"use client";

import { useState, useEffect, useCallback } from "react";
import { db, getOrCreateProfile } from "@/lib/db";
import { useBootstrap } from "@/lib/bootstrap-context";
import { getDueCount, getWordCount } from "@/lib/scheduler";
import { getAvailableNewCount } from "@/lib/session-engine";
import {
  routeVocabularyPracticeLanes,
  summarizePracticeLaneRoutes,
} from "@/lib/practice-lanes";
import { wordsToVocabularyItems } from "@/lib/vocabulary-item";
import { getPendingCaptureWords } from "@/lib/word-library";
import {
  CLOUD_SYNC_EVENT,
  type CloudSyncEventDetail,
} from "@/lib/sync";
import type { Difficulty, UserProfile } from "@/lib/types";

async function loadStatsSnapshot() {
  const profile = await getOrCreateProfile();
  const [dueCount, newCount, wordCount, words, reviewLogs] = await Promise.all([
    getDueCount(),
    getAvailableNewCount(profile.difficulty, profile.level),
    getWordCount(),
    db.words.toArray(),
    db.reviewLogs.toArray(),
  ]);
  const inboxCount = getPendingCaptureWords(words).length;
  const laneSummary = summarizePracticeLaneRoutes(
    routeVocabularyPracticeLanes(wordsToVocabularyItems(words, { reviewLogs })),
  );
  const coverageSignalCount =
    laneSummary.retrieval +
    laneSummary.context +
    laneSummary.association +
    laneSummary.collocation +
    laneSummary.transfer;

  return { profile, dueCount, newCount, inboxCount, wordCount, coverageSignalCount };
}

export function useStats() {
  const { seedStatus } = useBootstrap();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dueCount, setDueCount] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const [inboxCount, setInboxCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [coverageSignalCount, setCoverageSignalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const applySnapshot = useCallback((snapshot: Awaited<ReturnType<typeof loadStatsSnapshot>>) => {
    setProfile(snapshot.profile);
    setDueCount(snapshot.dueCount);
    setNewCount(snapshot.newCount);
    setInboxCount(snapshot.inboxCount);
    setWordCount(snapshot.wordCount);
    setCoverageSignalCount(snapshot.coverageSignalCount);
    setLoading(seedStatus === "seeding" && snapshot.wordCount === 0);
  }, [seedStatus]);

  const refresh = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setLoading(true);
    }
    const snapshot = await loadStatsSnapshot();
    applySnapshot(snapshot);
  }, [applySnapshot]);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialStats() {
      const snapshot = await loadStatsSnapshot();
      if (cancelled) return;
      applySnapshot(snapshot);
    }

    void loadInitialStats();

    return () => {
      cancelled = true;
    };
  }, [applySnapshot]);

  useEffect(() => {
    function refreshSilently() {
      void refresh({ silent: true });
    }

    function handleSyncEvent(event: Event) {
      const detail = (event as CustomEvent<CloudSyncEventDetail>).detail;
      if (detail.state === "synced") {
        refreshSilently();
      }
    }

    function handleFocus() {
      refreshSilently();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        refreshSilently();
      }
    }

    window.addEventListener(CLOUD_SYNC_EVENT, handleSyncEvent as EventListener);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener(
        CLOUD_SYNC_EVENT,
        handleSyncEvent as EventListener,
      );
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refresh]);

  const setDifficulty = useCallback(async (difficulty: Difficulty) => {
    await db.userProfile.update(1, {
      difficulty,
      updatedAt: new Date().toISOString(),
    });
    await refresh();
  }, [refresh]);

  return {
    profile,
    dueCount,
    newCount,
    inboxCount,
    wordCount,
    coverageSignalCount,
    loading,
    refresh,
    setDifficulty,
  };
}
