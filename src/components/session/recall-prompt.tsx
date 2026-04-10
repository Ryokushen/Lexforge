"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Send } from "lucide-react";
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
      <Card className="w-full max-w-2xl mx-auto border-primary/10">
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {tierLabel}
            </Badge>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-sm text-amber-500 font-mono"
              >
                <Lightbulb className="size-3.5" />
                &ldquo;{word.word[0].toUpperCase()}&rdquo; &middot;{" "}
                {word.word.length} letters
              </motion.div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              Definition
            </p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl leading-relaxed"
            >
              {word.definition}
            </motion.p>
          </div>

          {showHint && word.examples.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-1.5 rounded-lg bg-muted/50 p-3"
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

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              ref={inputRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type the word..."
              className="text-lg h-12 bg-muted/30 border-border/60 focus:border-primary/50"
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
