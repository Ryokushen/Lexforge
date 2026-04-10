"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline">{tierLabel}</Badge>
          {showHint && (
            <span className="text-sm text-muted-foreground font-mono">
              Starts with &ldquo;{word.word[0].toUpperCase()}&rdquo; &middot;{" "}
              {word.word.length} letters
            </span>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Definition
          </p>
          <p className="text-xl leading-relaxed">{word.definition}</p>
        </div>

        {showHint && word.examples.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Example
            </p>
            <p className="text-sm text-muted-foreground italic">
              {word.examples[0].replace(
                new RegExp(word.word, "gi"),
                "______",
              )}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            ref={inputRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type the word..."
            className="text-lg h-12"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={!answer.trim()}>
              Submit
            </Button>
            {!showHint && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowHint(true)}
              >
                Hint
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
