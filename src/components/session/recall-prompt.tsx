"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Lightbulb, Send } from "lucide-react";
import type { SessionWord } from "@/lib/types";

interface RecallPromptProps {
  sessionWord: SessionWord;
  onSubmit: (answer: string) => void;
}

export function RecallPrompt({ sessionWord, onSubmit }: RecallPromptProps) {
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { word } = sessionWord;

  useEffect(() => {
    setAnswer("");
    setShowHint(false);
    inputRef.current?.focus();
  }, [sessionWord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(answer.trim());
    }
  };

  const tierLabel = word.tier === "custom" ? "Custom" : `Tier ${word.tier}`;

  return (
    <motion.div
      key={word.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Card size="sm" className="w-full max-w-2xl mx-auto border-l-4 border-l-primary/40 ring-1 ring-primary/15">
        <CardContent className="space-y-4">
          {/* Mode header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-primary">
              <Brain className="size-3.5" />
              <span className="text-xs font-semibold uppercase tracking-widest">Recall</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {tierLabel}
              </Badge>
              {showHint && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-xs text-amber-500 font-mono"
                >
                  <Lightbulb className="size-3" />
                  &ldquo;{word.word[0].toUpperCase()}&rdquo; &middot; {word.word.length} letters
                </motion.span>
              )}
            </div>
          </div>

          {/* Definition */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg leading-relaxed pl-3 border-l-2 border-primary/25"
          >
            {word.definition}
          </motion.p>

          {/* Hint example */}
          {showHint && word.examples.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-1 rounded-lg bg-muted/50 p-2.5"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                Example
              </p>
              <p className="text-sm text-muted-foreground italic">
                {word.examples[0].replace(
                  new RegExp(word.word, "gi"),
                  "______",
                )}
              </p>
            </motion.div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <Input
              ref={inputRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type the word..."
              className="text-base h-10 bg-muted/30 border-border/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 gap-2"
                disabled={!answer.trim()}
              >
                <Send className="size-4" />
                Submit
              </Button>
              {!showHint && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowHint(true)}
                  className="gap-1.5 text-muted-foreground"
                >
                  <Lightbulb className="size-4" />
                  Hint
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
