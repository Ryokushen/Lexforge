"use client";

import { useRef, useState, useCallback } from "react";
import type {
  ContextSentence,
  GameMode,
  SessionState,
  SessionWord,
  SessionResult,
  SessionSummary,
} from "@/lib/types";
import {
  loadSessionWords,
  processAnswer,
  finalizeSession,
  pickMode,
  getContextSentence,
  getSpeedChoices,
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
  const [currentSpeedChoices, setCurrentSpeedChoices] =
    useState<{ definitions: string[]; correctDefinition: string } | null>(null);
  const submittingRef = useRef(false);

  const currentWord = words[currentIndex] ?? null;
  const sessionSeed = words[0]?.word.id ?? 0;
  const progress = words.length > 0 ? currentIndex / words.length : 0;
  // Derive association phase from word data — no extra state needed
  const associationPhase: "create" | "recall" | null =
    currentMode === "association" && currentWord
      ? currentWord.word.association ? "recall" : "create"
      : null;

  const configurePrompt = useCallback((word: SessionWord, allWords: SessionWord[]) => {
    const mode = pickMode(word.word);
    if (mode === "context") {
      setCurrentMode("context");
      setCurrentContextSentence(getContextSentence(word.word));
      setCurrentSpeedChoices(null);
    } else if (mode === "speed" && allWords.length >= 4) {
      setCurrentMode("speed");
      setCurrentSpeedChoices(getSpeedChoices(word.word, allWords));
      setCurrentContextSentence(null);
    } else {
      // Fallback to recall if not enough words for speed
      setCurrentMode(mode === "speed" ? "recall" : mode);
      setCurrentContextSentence(null);
      setCurrentSpeedChoices(null);
    }
  }, []);

  const startSession = useCallback(async (difficulty?: "easy" | "normal" | "hard", level?: number) => {
    setState("loading");
    submittingRef.current = false;
    const sessionWords = await loadSessionWords(difficulty ?? "normal", level ?? 1);
    if (sessionWords.length === 0) {
      setState("idle");
      return;
    }
    setWords(sessionWords);
    setCurrentIndex(0);
    setResults([]);
    setSummary(null);
    setPromptStartTime(Date.now());
    configurePrompt(sessionWords[0], sessionWords);

    setState("active");
  }, [configurePrompt]);

  async function submitAnswer(answer: string, manualRating?: 1 | 2 | 3 | 4) {
    if (!currentWord || state !== "active" || submittingRef.current) return;
    submittingRef.current = true;

    try {
      const responseTimeMs = Date.now() - promptStartTime;
      const expectedAnswer = currentMode === "association" && associationPhase === "create"
        ? "__create__"
        : currentMode === "speed"
          ? currentSpeedChoices?.correctDefinition
          : currentContextSentence?.answer;

      const { result } = await processAnswer(
        currentWord,
        answer,
        responseTimeMs,
        currentMode,
        expectedAnswer,
        manualRating,
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
      configurePrompt(words[nextIndex], words);
      setState("active");
    }
  }, [configurePrompt, currentIndex, words, results]);

  const resetSession = useCallback(() => {
    submittingRef.current = false;
    setState("idle");
    setWords([]);
    setCurrentIndex(0);
    setResults([]);
    setSummary(null);
    setCurrentMode("recall");
    setCurrentContextSentence(null);
    setCurrentSpeedChoices(null);
  }, []);

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
    currentSpeedChoices,
    associationPhase,
    startSession,
    submitAnswer,
    nextWord,
    resetSession,
  };
}
