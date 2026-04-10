"use client";

import { useState, useCallback } from "react";
import type {
  SessionState,
  SessionWord,
  SessionResult,
  SessionSummary,
} from "@/lib/types";
import {
  loadSessionWords,
  processAnswer,
  finalizeSession,
} from "@/lib/session-engine";

export function useSession() {
  const [state, setState] = useState<SessionState>("idle");
  const [words, setWords] = useState<SessionWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<SessionResult[]>([]);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [promptStartTime, setPromptStartTime] = useState<number>(0);

  const currentWord = words[currentIndex] ?? null;
  const progress = words.length > 0 ? currentIndex / words.length : 0;

  const startSession = useCallback(async () => {
    setState("loading");
    const sessionWords = await loadSessionWords();
    if (sessionWords.length === 0) {
      setState("idle");
      return;
    }
    setWords(sessionWords);
    setCurrentIndex(0);
    setResults([]);
    setSummary(null);
    setPromptStartTime(Date.now());
    setState("active");
  }, []);

  const submitAnswer = useCallback(
    async (answer: string, manualRating?: 1 | 2 | 3 | 4) => {
      if (!currentWord || state !== "active") return;

      const responseTimeMs = Date.now() - promptStartTime;
      const { result } = await processAnswer(
        currentWord,
        answer,
        responseTimeMs,
        manualRating,
      );

      setResults((prev) => [...prev, result]);
      setState("reviewing");
    },
    [currentWord, state, promptStartTime],
  );

  const nextWord = useCallback(async () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= words.length) {
      // Session complete
      const sessionSummary = await finalizeSession(results);
      setSummary(sessionSummary);
      setState("complete");
    } else {
      setCurrentIndex(nextIndex);
      setPromptStartTime(Date.now());
      setState("active");
    }
  }, [currentIndex, words.length, results]);

  const resetSession = useCallback(() => {
    setState("idle");
    setWords([]);
    setCurrentIndex(0);
    setResults([]);
    setSummary(null);
  }, []);

  return {
    state,
    currentWord,
    currentIndex,
    totalWords: words.length,
    progress,
    results,
    summary,
    startSession,
    submitAnswer,
    nextWord,
    resetSession,
  };
}
