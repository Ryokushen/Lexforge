"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { playTick } from "@/lib/sounds";
import type { AnswerMetadata, SessionWord } from "@/lib/types";
import { IllumCard } from "@/components/rpg/illum-card";
import { Lantern, Sword } from "@/components/rpg/sigils";

const DEFAULT_TIMEOUT_MS = 5000;
const WARNING_RATIO = 0.30;
const DEFAULT_CUE_REVEAL_MS = 2500;

interface SpeedPromptProps {
  sessionWord: SessionWord;
  onSubmit: (answer: string, metadata?: AnswerMetadata) => void;
}

export function SpeedPrompt({ sessionWord, onSubmit }: SpeedPromptProps) {
  const [phase, setPhase] = useState<"read" | "retrieve">("read");
  const [answer, setAnswer] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [cueVisible, setCueVisible] = useState(false);
  const onSubmitRef = useRef(onSubmit);
  const inputRef = useRef<HTMLInputElement>(null);
  const goButtonRef = useRef<HTMLButtonElement>(null);
  const startTime = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const submittedRef = useRef(false);
  const timeoutMs = sessionWord.drillProfile?.rapidTimeoutMs ?? DEFAULT_TIMEOUT_MS;
  const cueRevealMs = sessionWord.drillProfile?.rapidCueRevealMs ?? DEFAULT_CUE_REVEAL_MS;
  const warningMs = Math.round(timeoutMs * WARNING_RATIO);

  useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  const startRetrieval = useCallback(() => {
    setPhase("retrieve");
    startTime.current = Date.now();
    submittedRef.current = false;
  }, []);

  const submitAttempt = useCallback((attempt: string) => {
    if (!attempt.trim() || submittedRef.current) return;

    playTick();
    submittedRef.current = true;
    clearInterval(timerRef.current);

    const retrievalTimeMs = Date.now() - startTime.current;
    setTimeout(
      () => onSubmitRef.current(attempt.trim(), {
        cueLevel: cueVisible ? 1 : 0,
        retrievalTimeMs,
      }),
      200,
    );
  }, [cueVisible]);

  useEffect(() => {
    goButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (phase !== "retrieve") return;

    inputRef.current?.focus();

    timerRef.current = setInterval(() => {
      const ms = Date.now() - startTime.current;
      setElapsed(ms);

      if (cueRevealMs !== null && ms >= cueRevealMs) {
        setCueVisible(true);
      }

      if (ms >= timeoutMs && !submittedRef.current) {
        submittedRef.current = true;
        clearInterval(timerRef.current);
        const retrievalTimeMs = Date.now() - startTime.current;
        onSubmitRef.current("__timeout__", {
          cueLevel: cueRevealMs !== null && ms >= cueRevealMs ? 1 : 0,
          retrievalTimeMs,
        });
      }
    }, 50);

    return () => clearInterval(timerRef.current);
  }, [phase, cueRevealMs, timeoutMs]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (phase === "read") {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          startRetrieval();
        }
        return;
      }

      if (submittedRef.current) return;
      if (
        document.activeElement?.tagName === "INPUT"
        || document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (event.key === "Enter" && answer.trim()) {
        event.preventDefault();
        submitAttempt(answer);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, answer, startRetrieval, submitAttempt]);

  const pct = phase === "retrieve" ? Math.max(0, 1 - elapsed / timeoutMs) * 100 : 100;
  const isWarning = phase === "retrieve" && elapsed > timeoutMs - warningMs;
  const cueText = `${sessionWord.word.word[0].toUpperCase()} • ${sessionWord.word.word.length} letters`;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitAttempt(answer);
  };

  return (
    <motion.div
      key={sessionWord.word.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <IllumCard className="w-full max-w-2xl mx-auto p-0 overflow-hidden">
        {phase === "retrieve" && (
          <div className="h-1.5 overflow-hidden" style={{ background: "color-mix(in oklab, var(--paper), black 10%)" }}>
            <motion.div
              className="h-full"
              style={{
                width: `${pct}%`,
                background: isWarning ? "var(--crimson)" : "var(--ember)",
                transition: "background-color .2s",
              }}
            />
          </div>
        )}

        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2" style={{ color: "var(--ember)" }}>
              <Sword size={16} />
              <span className="uppercase-tracked text-[11px]">Rapid Retrieval</span>
            </div>
            {phase === "retrieve" && (
              <span
                className="font-mono-num text-[12px] tabular-nums"
                style={{ color: isWarning ? "var(--crimson)" : "var(--muted-foreground)" }}
              >
                {Math.max(0, Math.ceil((timeoutMs - elapsed) / 1000))}s
              </span>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="space-y-2"
          >
            <p className="uppercase-tracked text-[10px]" style={{ color: "var(--ember)" }}>
              {phase === "read"
                ? "Read the definition, then begin the strike"
                : cueRevealMs === null
                  ? "Retrieve the word — no cue will come"
                  : "Retrieve the word before the cue breaks"}
            </p>
            <p
              className="font-serif text-[19px] leading-[1.4] pl-3"
              style={{ borderLeft: "3px solid var(--ember)", color: "var(--ink)" }}
            >
              {sessionWord.word.definition}
            </p>
          </motion.div>

          {phase === "read" && (
            <motion.button
              ref={goButtonRef}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              onClick={startRetrieval}
              className="btn-illum w-full"
            >
              <Sword size={14} />
              Begin Strike
            </motion.button>
          )}

          {phase === "retrieve" && (
            <>
              {cueVisible && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between rounded-[3px] px-3 py-2 text-sm"
                  style={{
                    background: "color-mix(in oklab, var(--ember), transparent 85%)",
                    border: "1px solid color-mix(in oklab, var(--ember), transparent 60%)",
                  }}
                >
                  <span className="flex items-center gap-1.5" style={{ color: "var(--ember)" }}>
                    <Lantern size={14} />
                    <span className="uppercase-tracked text-[10px]">Rescue cue</span>
                  </span>
                  <span className="font-mono-num text-[12px]" style={{ color: "var(--ink-2)" }}>
                    {cueText}
                  </span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-2.5">
                <input
                  ref={inputRef}
                  className="inkwell"
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder="Speak the word…"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <button type="submit" className="btn-illum w-full" disabled={!answer.trim()}>
                  <Sword size={14} />
                  Strike
                </button>
              </form>
            </>
          )}
        </div>
      </IllumCard>
    </motion.div>
  );
}
