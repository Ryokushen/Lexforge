"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import type {
  AnswerMetadata,
  ContextSentence,
  GameMode,
  SessionState,
  SessionWord,
  SessionResult,
  SessionSummary,
} from "@/lib/types";
import {
  createSessionId,
  loadSessionWords,
  processAnswer,
  finalizeSession,
  pickMode,
  getContextSentence,
} from "@/lib/session-engine";
import {
  playCorrect,
  playStreakCorrect,
  playIncorrect,
  playSessionComplete,
  playLevelUp,
} from "@/lib/sounds";

export function useSession() {
  const [state, setState] = useState<SessionState>("idle");
  const [words, setWords] = useState<SessionWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<SessionResult[]>([]);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [promptStartTime, setPromptStartTime] = useState<number>(0);
  const [currentMode, setCurrentMode] = useState<GameMode>("recall");
  const [currentContextSentence, setCurrentContextSentence] =
    useState<ContextSentence | null>(null);
  const submittingRef = useRef(false);
  const sessionIdRef = useRef<string | null>(null);
  const stateRef = useRef<SessionState>("idle");
  const resultsRef = useRef<SessionResult[]>([]);
  const summaryRef = useRef<SessionSummary | null>(null);
  const partialCommitPromiseRef = useRef<Promise<void> | null>(null);
  const partialCommitDoneRef = useRef(false);

  const currentWord = words[currentIndex] ?? null;
  const sessionSeed = words[0]?.word.id ?? 0;
  const progress = words.length > 0 ? currentIndex / words.length : 0;
  // Derive association phase from word data — no extra state needed
  const associationPhase: "create" | "recall" | null =
    currentMode === "association" && currentWord
      ? currentWord.word.association ? "recall" : "create"
      : null;

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  useEffect(() => {
    summaryRef.current = summary;
  }, [summary]);

  const configurePrompt = useCallback((word: SessionWord) => {
    const mode = pickMode(word.word, undefined, word.drillProfile);
    if (mode === "context") {
      setCurrentMode("context");
      setCurrentContextSentence(getContextSentence(word.word));
    } else if (mode === "speed") {
      setCurrentMode("speed");
      setCurrentContextSentence(null);
    } else {
      setCurrentMode(mode);
      setCurrentContextSentence(null);
    }
  }, []);

  const startSession = useCallback(async (difficulty?: "easy" | "normal" | "hard", level?: number) => {
    setState("loading");
    submittingRef.current = false;
    partialCommitDoneRef.current = false;
    partialCommitPromiseRef.current = null;
    const sessionWords = await loadSessionWords(difficulty ?? "normal", level ?? 1);
    if (sessionWords.length === 0) {
      setState("idle");
      return;
    }
    setWords(sessionWords);
    sessionIdRef.current = createSessionId();
    setCurrentIndex(0);
    setResults([]);
    setSummary(null);
    setPromptStartTime(Date.now());
    configurePrompt(sessionWords[0]);

    setState("active");
  }, [configurePrompt]);

  const commitPartialSession = useCallback(async () => {
    if (partialCommitDoneRef.current) {
      return partialCommitPromiseRef.current ?? Promise.resolve();
    }

    const currentState = stateRef.current;
    const currentResults = resultsRef.current;

    if (
      (currentState !== "active" && currentState !== "reviewing")
      || currentResults.length === 0
      || summaryRef.current
    ) {
      partialCommitDoneRef.current = true;
      return;
    }

    const commitPromise = finalizeSession(currentResults)
      .then((sessionSummary) => {
        summaryRef.current = sessionSummary;
      })
      .catch((error) => {
        console.error("Partial session commit failed:", error);
        throw error;
      })
      .finally(() => {
        partialCommitDoneRef.current = true;
      });

    partialCommitPromiseRef.current = commitPromise.then(() => {});
    return partialCommitPromiseRef.current;
  }, []);

  async function submitAnswer(answer: string, answerMetadata?: AnswerMetadata) {
    if (!currentWord || state !== "active" || submittingRef.current) return;
    submittingRef.current = true;

    try {
      const responseTimeMs = Date.now() - promptStartTime;
      const expectedAnswer = currentMode === "association" && associationPhase === "create"
        ? "__create__"
        : currentMode === "speed"
          ? currentWord.word.word
          : currentContextSentence?.answer;

      const { result } = await processAnswer(
        currentWord,
        answer,
        responseTimeMs,
        sessionIdRef.current ?? undefined,
        currentMode,
        expectedAnswer,
        answerMetadata,
      );

      // Play sound based on result
      if (result.correct) {
        // Count consecutive correct for streak sound
        const prevCorrectStreak = results
          .slice()
          .reverse()
          .findIndex((r) => !r.correct);
        const streak =
          prevCorrectStreak === -1 ? results.length : prevCorrectStreak;
        if (streak >= 2) {
          playStreakCorrect();
        } else {
          playCorrect();
        }
      } else {
        playIncorrect();
      }

      setResults((prev) => [...prev, result]);
      setState("reviewing");
    } catch (error) {
      submittingRef.current = false;
      throw error;
    }
  }

  const nextWord = useCallback(async () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= words.length) {
      const sessionSummary = await finalizeSession(results);
      setSummary(sessionSummary);
      if (sessionSummary.leveledUp) {
        playLevelUp();
      } else {
        playSessionComplete();
      }
      setState("complete");
    } else {
      setCurrentIndex(nextIndex);
      setPromptStartTime(Date.now());
      submittingRef.current = false;
      configurePrompt(words[nextIndex]);
      setState("active");
    }
  }, [configurePrompt, currentIndex, words, results]);

  const resetSession = useCallback(() => {
    submittingRef.current = false;
    sessionIdRef.current = null;
    partialCommitDoneRef.current = false;
    partialCommitPromiseRef.current = null;
    summaryRef.current = null;
    setState("idle");
    setWords([]);
    setCurrentIndex(0);
    setResults([]);
    setSummary(null);
    setCurrentMode("recall");
    setCurrentContextSentence(null);
  }, []);

  useEffect(() => {
    return () => {
      void commitPartialSession();
    };
  }, [commitPartialSession]);

  return {
    state,
    currentWord,
    sessionSeed,
    currentIndex,
    totalWords: words.length,
    progress,
    results,
    summary,
    currentMode,
    currentContextSentence,
    associationPhase,
    startSession,
    submitAnswer,
    nextWord,
    resetSession,
    commitPartialSession,
  };
}
