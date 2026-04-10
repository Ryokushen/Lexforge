"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SessionWord, SessionResult } from "@/lib/types";

interface ReviewResultProps {
  sessionWord: SessionWord;
  result: SessionResult;
  onNext: () => void;
}

export function ReviewResult({
  sessionWord,
  result,
  onNext,
}: ReviewResultProps) {
  const { word } = sessionWord;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6 space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-center"
        >
          <div
            className={`text-6xl mb-2 ${result.correct ? "text-green-500" : "text-red-500"}`}
          >
            {result.correct ? "+" : "x"}
          </div>
          <h2 className="text-3xl font-bold">{word.word}</h2>
          <p className="text-muted-foreground mt-1">{word.definition}</p>
        </motion.div>

        {word.examples.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Example
            </p>
            <p className="text-sm italic">{word.examples[0]}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Response time:{" "}
            {(result.responseTimeMs / 1000).toFixed(1)}s
          </span>
          <span>
            Rating:{" "}
            {result.rating === 1
              ? "Again"
              : result.rating === 2
                ? "Hard"
                : result.rating === 3
                  ? "Good"
                  : "Easy"}
          </span>
        </div>

        <Button onClick={onNext} className="w-full" size="lg">
          Next
        </Button>
      </CardContent>
    </Card>
  );
}
