"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <Card className="w-full max-w-2xl mx-auto border-primary/10">
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 text-xs">
              <Replace className="size-3" />
              Context Mode
            </Badge>
            <span className="text-xs text-muted-foreground">
              Replace the weak word with a more precise one
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg leading-relaxed"
          >
            {parts[0]}
            <span className="inline-block bg-amber-500/15 text-amber-400 dark:text-amber-300 px-1.5 py-0.5 rounded-md font-semibold border border-amber-500/20">
              {sentence.weakWord}
            </span>
            {parts[1]}
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            {choices.map((choice, i) => (
              <motion.div
                key={choice}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
              >
                <Button
                  variant={selected === choice ? "default" : "outline"}
                  className={`h-12 text-base w-full transition-all ${
                    selected === choice
                      ? "scale-95 shadow-md shadow-primary/20"
                      : selected !== null
                        ? "opacity-40"
                        : "hover:border-primary/40"
                  }`}
                  onClick={() => handleSelect(choice)}
                  disabled={selected !== null}
                >
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
