"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { playTick } from "@/lib/sounds";
import { Replace } from "lucide-react";
import type { ContextSentence } from "@/lib/types";

interface ContextPromptProps {
  sentence: ContextSentence;
  wordDisplay: string;
  onSubmit: (answer: string) => void;
}

export function ContextPrompt({
  sentence,
  wordDisplay,
  onSubmit,
}: ContextPromptProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const choices = useMemo(() => {
    const all = [...sentence.distractors, sentence.answer];
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all;
  }, [sentence]);

  useEffect(() => {
    setSelected(null);
  }, [sentence]);

  const parts = sentence.sentence.split(`**${sentence.weakWord}**`);

  const handleSelect = (choice: string) => {
    playTick();
    setSelected(choice);
    setTimeout(() => onSubmit(choice), 300);
  };

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
          {/* Mode header */}
          <div className="flex items-center gap-1.5 text-emerald-500">
            <Replace className="size-3.5" />
            <span className="text-xs font-semibold uppercase tracking-widest">Context</span>
            <span className="text-xs text-muted-foreground ml-1">Replace the weak word</span>
          </div>

          {/* Sentence */}
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

          {/* MCQ choices */}
          <div className="grid grid-cols-2 gap-2">
            {choices.map((choice, i) => (
              <motion.div
                key={choice}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
