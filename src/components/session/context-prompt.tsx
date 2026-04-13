"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { playTick } from "@/lib/sounds";
import { Replace, Lightbulb, Send } from "lucide-react";
import type { AnswerMetadata, ContextSentence } from "@/lib/types";

interface ContextPromptProps {
  sentence: ContextSentence;
  onSubmit: (answer: string, metadata?: AnswerMetadata) => void;
}

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index++) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase();
}

function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0),
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function getChoices(sentence: ContextSentence) {
  const seed = hashString(`${sentence.sentence}:${sentence.answer}`);

  return [...sentence.distractors, sentence.answer].sort((left, right) => {
    const leftScore = hashString(`${seed}:${left}`);
    const rightScore = hashString(`${seed}:${right}`);
    return leftScore - rightScore || left.localeCompare(right);
  });
}

export function ContextPrompt({ sentence, onSubmit }: ContextPromptProps) {
  const [typedAnswer, setTypedAnswer] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [showChoices, setShowChoices] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const choices = getChoices(sentence);

  const parts = sentence.sentence.split(`**${sentence.weakWord}**`);

  useEffect(() => {
    if (!showChoices) {
      inputRef.current?.focus();
    }
  }, [showChoices, sentence.sentence]);

  const revealChoices = useCallback(() => {
    if (showChoices || selected !== null) return;
    setShowChoices(true);
  }, [selected, showChoices]);

  const handleTypedSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!typedAnswer.trim()) return;

    const normalizedTyped = normalizeAnswer(typedAnswer);
    const normalizedExpected = normalizeAnswer(sentence.answer);

    if (
      normalizedTyped === normalizedExpected
      || editDistance(normalizedTyped, normalizedExpected) <= 1
    ) {
      playTick();
      onSubmit(typedAnswer.trim(), { cueLevel: 0 });
      return;
    }

    revealChoices();
  };

  const handleSelect = useCallback((choice: string) => {
    if (selected !== null) return;
    playTick();
    setSelected(choice);
    setTimeout(() => onSubmit(choice, { cueLevel: 1 }), 300);
  }, [onSubmit, selected]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showChoices || selected !== null) return;
      if (
        document.activeElement?.tagName === "INPUT"
        || document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      const index = ["1", "2", "3", "4"].indexOf(event.key);
      if (index !== -1 && index < choices.length) {
        handleSelect(choices[index]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, choices, handleSelect, showChoices]);

  return (
    <motion.div
      key={sentence.sentence}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Card size="sm" className="w-full max-w-2xl mx-auto border-l-4 border-l-emerald-500/40 ring-1 ring-emerald-500/15">
        <CardContent className="space-y-4">
          <div className="flex items-center gap-1.5 text-emerald-500">
            <Replace className="size-3.5" />
            <span className="text-xs font-semibold uppercase tracking-widest">Context</span>
            <span className="text-xs text-muted-foreground ml-1">Retrieve the stronger replacement first</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base leading-relaxed pl-3 border-l-2 border-emerald-500/25"
          >
            {parts[0]}
            <span className="inline-block bg-amber-500/15 text-amber-400 dark:text-amber-300 px-1.5 py-0.5 rounded-md font-semibold border border-amber-500/20">
              {sentence.weakWord}
            </span>
            {parts[1]}
          </motion.div>

          {!showChoices && (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              onSubmit={handleTypedSubmit}
              className="space-y-2.5"
            >
              <Input
                ref={inputRef}
                value={typedAnswer}
                onChange={(event) => setTypedAnswer(event.target.value)}
                placeholder="Type the stronger word..."
                className="text-base h-10 bg-muted/30 border-border/50 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/15"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 gap-2"
                  disabled={!typedAnswer.trim()}
                >
                  <Send className="size-4" />
                  Submit Replacement
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={revealChoices}
                  className="gap-1.5 text-muted-foreground"
                >
                  <Lightbulb className="size-4" />
                  Need options
                </Button>
              </div>
            </motion.form>
          )}

          {showChoices && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm">
                <span className="flex items-center gap-1.5 text-emerald-500">
                  <Lightbulb className="size-4" />
                  Assisted fallback
                </span>
                <span className="text-xs text-muted-foreground">
                  Choosing here counts as assisted retrieval
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {choices.map((choice, i) => (
                  <motion.div
                    key={choice}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                  >
                    <Button
                      variant={selected === choice ? "default" : "outline"}
                      className={`h-10 text-sm w-full transition-all gap-2 ${
                        selected === choice
                          ? "scale-[0.97] shadow-md shadow-emerald-500/20"
                          : selected !== null
                            ? "opacity-40"
                            : "hover:border-emerald-500/30"
                      }`}
                      onClick={() => handleSelect(choice)}
                      disabled={selected !== null}
                    >
                      <span className="text-xs text-muted-foreground font-mono w-4">{i + 1}</span>
                      {choice}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
