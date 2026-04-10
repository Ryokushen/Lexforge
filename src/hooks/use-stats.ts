"use client";

import { useState, useEffect, useCallback } from "react";
import { db, getOrCreateProfile } from "@/lib/db";
import { getDueCount, getWordCount } from "@/lib/scheduler";
import type { UserProfile } from "@/lib/types";

export function useStats() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dueCount, setDueCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [p, due, total] = await Promise.all([
      getOrCreateProfile(),
      getDueCount(),
      getWordCount(),
    ]);
    setProfile(p);
    setDueCount(due);
    setWordCount(total);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { profile, dueCount, wordCount, loading, refresh };
}
