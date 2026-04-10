"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, ArrowRight, Timer } from "lucide-react";
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

  const ratingLabel =
    result.rating === 1
      ? "Again"
      : result.rating === 2
        ? "Hard"
        : result.rating === 3
          ? "Good"
          : "Easy";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        size="sm"
        className={`w-full max-w-2xl mx-auto transition-colors border-l-4 ${
          result.correct
            ? "border-l-emerald-500 ring-1 ring-emerald-500/15 bg-emerald-500/5"
            : "border-l-red-500 ring-1 ring-red-500/15 bg-red-500/5"
        }`}
      >
        <CardContent className="space-y-4">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 15,
                delay: 0.05,
              }}
              className="mb-2 inline-flex"
            >
              {result.correct ? (
                <CheckCircle2 className="size-10 text-emerald-500" />
              ) : (
                <XCircle className="size-10 text-red-500" />
              )}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-2xl font-bold"
            >
              {word.word}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-muted-foreground mt-1"
            >
              {word.definition}
            </motion.p>
          </div>

          {word.examples.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-lg bg-muted/50 p-3 space-y-1"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                Example
              </p>
              <p className="text-sm italic">{word.examples[0]}</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex items-center justify-between text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <Timer className="size-3.5" />
              {(result.responseTimeMs / 1000).toFixed(1)}s
            </span>
            <span className="flex items-center gap-2">
              {result.mode === "context" && (
                <span className="text-xs bg-muted px-2 py-0.5 rounded-md font-medium">
                  CTX
                </span>
              )}
              <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                result.rating >= 3
                  ? "bg-emerald-500/10 text-emerald-500"
                  : result.rating === 2
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-red-500/10 text-red-500"
              }`}>
                {ratingLabel}
              </span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button onClick={onNext} className="w-full gap-2" size="lg">
              Next
              <ArrowRight className="size-4" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
