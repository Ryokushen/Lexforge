"use client";

import { useState, useEffect, useCallback } from "react";
import { db, getOrCreateProfile } from "@/lib/db";
import { getDueCount, getNewCount, getWordCount } from "@/lib/scheduler";
import type { Difficulty, UserProfile } from "@/lib/types";

async function loadStatsSnapshot() {
  const [profile, dueCount, newCount, wordCount] = await Promise.all([
    getOrCreateProfile(),
    getDueCount(),
    getNewCount(),
    getWordCount(),
  ]);

  return { profile, dueCount, newCount, wordCount };
}

export function useStats() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dueCount, setDueCount] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const snapshot = await loadStatsSnapshot();
    setProfile(snapshot.profile);
    setDueCount(snapshot.dueCount);
    setNewCount(snapshot.newCount);
    setWordCount(snapshot.wordCount);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialStats() {
      const snapshot = await loadStatsSnapshot();
      if (cancelled) return;

      setProfile(snapshot.profile);
      setDueCount(snapshot.dueCount);
      setWordCount(snapshot.wordCount);
      setLoading(false);
    }

    void loadInitialStats();

    return () => {
      cancelled = true;
    };
  }, []);

  const setDifficulty = useCallback(async (difficulty: Difficulty) => {
    await db.userProfile.update(1, { difficulty });
    await refresh();
  }, [refresh]);

  return { profile, dueCount, newCount, wordCount, loading, refresh, setDifficulty };
}
