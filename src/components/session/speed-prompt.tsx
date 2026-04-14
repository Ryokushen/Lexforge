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
const WARNING_MS = 2000;
const DEFAULT_CUE_REVEAL_MS = 2500;

interface SpeedPromptProps {
  sessionWord: SessionWord;
  onSubmit: (answer: string, metadata?: AnswerMetadata) => void;
}

export function SpeedPrompt({ sessionWord, onSubmit }: SpeedPromptProps) {
  const [answer, setAnswer] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [cueVisible, setCueVisible] = useState(false);
  const onSubmitRef = useRef(onSubmit);
  const inputRef = useRef<HTMLInputElement>(null);
  const startTime = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const submittedRef = useRef(false);
  const timeoutMs = sessionWord.drillProfile?.rapidTimeoutMs ?? DEFAULT_TIMEOUT_MS;
  const cueRevealMs = sessionWord.drillProfile?.rapidCueRevealMs ?? DEFAULT_CUE_REVEAL_MS;

  useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  const submitAttempt = useCallback((attempt: string) => {
    if (!attempt.trim() || submittedRef.current) return;

    playTick();
    submittedRef.current = true;
    clearInterval(timerRef.current);

    setTimeout(
      () => onSubmitRef.current(attempt.trim(), { cueLevel: cueVisible ? 1 : 0 }),
      200,
    );
  }, [cueVisible]);

  useEffect(() => {
    startTime.current = Date.now();
    submittedRef.current = false;
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
        onSubmitRef.current("__timeout__", {
          cueLevel: cueRevealMs !== null && ms >= cueRevealMs ? 1 : 0,
        });
      }
    }, 50);

    return () => clearInterval(timerRef.current);
  }, [cueRevealMs, sessionWord, timeoutMs]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
  }, [answer, submitAttempt]);

  const pct = Math.max(0, 1 - elapsed / timeoutMs) * 100;
  const isWarning = elapsed > timeoutMs - WARNING_MS;
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
      <Card
        size="sm"
        className="w-full max-w-2xl mx-auto border-l-4 border-l-amber-500/40 ring-1 ring-amber-500/15"
      >
        <div className="h-1.5 bg-muted/30 rounded-t-xl overflow-hidden mx-px mt-px">
          <motion.div
            className={`h-full rounded-t-xl transition-colors ${
              isWarning ? "bg-red-500" : "bg-amber-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <CardContent className="space-y-4 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-500">
              <Zap className="size-3.5" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                Rapid Retrieval
              </span>
            </div>
            <span className="text-xs font-mono tabular-nums text-muted-foreground">
              {Math.max(0, Math.ceil((timeoutMs - elapsed) / 1000))}s
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="space-y-2 py-2"
          >
            <p className="text-xs uppercase tracking-widest text-amber-500/80">
              {cueRevealMs === null
                ? "Retrieve the word without a rescue cue"
                : "Retrieve the word before the rescue cue appears"}
            </p>
            <p className="text-lg leading-relaxed border-l-2 border-amber-500/25 pl-3">
              {sessionWord.word.definition}
            </p>
          </motion.div>

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
        </CardContent>
      </Card>
    </motion.div>
  );
}
