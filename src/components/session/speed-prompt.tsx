"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { playTick } from "@/lib/sounds";
import { Zap } from "lucide-react";
import type { SessionWord } from "@/lib/types";

const TIMEOUT_MS = 8000;
const WARNING_MS = 2000;

interface SpeedPromptProps {
  sessionWord: SessionWord;
  choices: { definitions: string[]; correctDefinition: string };
  onSubmit: (answer: string) => void;
}

export function SpeedPrompt({ sessionWord, choices, onSubmit }: SpeedPromptProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const startTime = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const submittedRef = useRef(false);

  // Reset on new word
  useEffect(() => {
    setSelected(null);
    setElapsed(0);
    startTime.current = Date.now();
    submittedRef.current = false;

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const ms = now - startTime.current;
      setElapsed(ms);

      if (ms >= TIMEOUT_MS && !submittedRef.current) {
        submittedRef.current = true;
        clearInterval(timerRef.current);
        onSubmit("__timeout__");
      }
    }, 50);

    return () => clearInterval(timerRef.current);
  }, [sessionWord, onSubmit]);

  const handleSelect = (definition: string) => {
    if (selected || submittedRef.current) return;
    playTick();
    setSelected(definition);
    submittedRef.current = true;
    clearInterval(timerRef.current);
    setTimeout(() => onSubmit(definition), 200);
  };

  const pct = Math.max(0, 1 - elapsed / TIMEOUT_MS) * 100;
  const isWarning = elapsed > TIMEOUT_MS - WARNING_MS;

  return (
    <motion.div
      key={sessionWord.word.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Card size="sm" className="w-full max-w-2xl mx-auto border-l-4 border-l-amber-500/40 ring-1 ring-amber-500/15">
        {/* Countdown bar */}
        <div className="h-1.5 bg-muted/30 rounded-t-xl overflow-hidden mx-px mt-px">
          <motion.div
            className={`h-full rounded-t-xl transition-colors ${
              isWarning ? "bg-red-500" : "bg-amber-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <CardContent className="space-y-4 pt-3">
          {/* Mode header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-500">
              <Zap className="size-3.5" />
              <span className="text-xs font-semibold uppercase tracking-widest">Speed</span>
            </div>
            <span className="text-xs font-mono tabular-nums text-muted-foreground">
              {Math.max(0, Math.ceil((TIMEOUT_MS - elapsed) / 1000))}s
            </span>
          </div>

          {/* Word to match */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="text-center py-2"
          >
            <p className="text-2xl font-bold">{sessionWord.word.word}</p>
            <p className="text-xs text-muted-foreground mt-1">Match the correct definition</p>
          </motion.div>

          {/* Definition choices — vertical stack */}
          <div className="space-y-2">
            {choices.definitions.map((def, i) => (
              <motion.div
                key={def}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Button
                  variant={selected === def ? "default" : "outline"}
                  className={`w-full h-auto py-2.5 px-3 text-left text-sm leading-snug whitespace-normal transition-all ${
                    selected === def
                      ? "scale-[0.97] shadow-md shadow-amber-500/20"
                      : selected !== null
                        ? "opacity-40"
                        : "hover:border-amber-500/30"
                  }`}
                  onClick={() => handleSelect(def)}
                  disabled={selected !== null}
                >
                  <span className="text-xs text-muted-foreground font-mono w-5 shrink-0">{i + 1}</span>
                  <span className="flex-1">{def}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
