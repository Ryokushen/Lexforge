"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { playTick } from "@/lib/sounds";
import { TimerReset, Zap } from "lucide-react";
import type { AnswerMetadata, SessionWord } from "@/lib/types";

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

  // Focus Go button on mount
  useEffect(() => {
    goButtonRef.current?.focus();
  }, []);

  // Start timer when retrieval phase begins
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
  const cueText = `${sessionWord.word.word[0].toUpperCase()} \u2022 ${sessionWord.word.word.length} letters`;

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
      <Card
        size="sm"
        className="w-full max-w-2xl mx-auto border-l-4 border-l-amber-500/40 ring-1 ring-amber-500/15"
      >
        {phase === "retrieve" && (
          <div className="h-1.5 bg-muted/30 rounded-t-xl overflow-hidden mx-px mt-px">
            <motion.div
              className={`h-full rounded-t-xl transition-colors ${
                isWarning ? "bg-red-500" : "bg-amber-500"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}

        <CardContent className={`space-y-4 ${phase === "retrieve" ? "pt-3" : "pt-5"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-500">
              <Zap className="size-3.5" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                Rapid Retrieval
              </span>
            </div>
            {phase === "retrieve" && (
              <span className="text-xs font-mono tabular-nums text-muted-foreground">
                {Math.max(0, Math.ceil((timeoutMs - elapsed) / 1000))}s
              </span>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="space-y-2 py-2"
          >
            <p className="text-xs uppercase tracking-widest text-amber-500/80">
              {phase === "read"
                ? "Read the definition, then start retrieval"
                : cueRevealMs === null
                  ? "Retrieve the word without a rescue cue"
                  : "Retrieve the word before the rescue cue appears"}
            </p>
            <p className="text-lg leading-relaxed border-l-2 border-amber-500/25 pl-3">
              {sessionWord.word.definition}
            </p>
          </motion.div>

          {phase === "read" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Button
                ref={goButtonRef}
                onClick={startRetrieval}
                className="w-full gap-2"
              >
                <Zap className="size-4" />
                Start Retrieval
              </Button>
            </motion.div>
          )}

          {phase === "retrieve" && (
            <>
              {cueVisible && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm"
                >
                  <span className="flex items-center gap-1.5 text-amber-500">
                    <TimerReset className="size-4" />
                    Rescue cue
                  </span>
                  <span className="font-mono text-amber-100/90">{cueText}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-2">
                <Input
                  ref={inputRef}
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder="Type the word..."
                  className="h-10 text-base bg-muted/30 border-border/50 focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/15"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={!answer.trim()}
                >
                  <Zap className="size-4" />
                  Submit Retrieval
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
