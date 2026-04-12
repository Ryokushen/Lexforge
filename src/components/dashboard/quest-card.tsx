"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Swords, Sparkles, BookOpen, RotateCcw, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Difficulty } from "@/lib/types";

interface QuestCardProps {
  dueCount: number;
  newCount: number;
  wordCount: number;
  sessionSize: number;
  difficulty: Difficulty;
}

function pluralize(count: number, singular: string) {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

export function QuestCard({
  dueCount,
  newCount,
  wordCount,
  sessionSize,
  difficulty,
}: QuestCardProps) {
  const hasWork = dueCount > 0 || newCount > 0;
  const nextReviewCount = Math.min(dueCount, sessionSize);
  const nextNewCount = Math.min(newCount, Math.max(0, sessionSize - nextReviewCount));
  const backlogText =
    dueCount > 0 && newCount > 0
      ? `${pluralize(dueCount, "review")} waiting, ${pluralize(newCount, "new word")} available today`
      : dueCount > 0
        ? `${pluralize(dueCount, "review")} waiting`
        : newCount > 0
          ? `${pluralize(newCount, "new word")} available today`
          : `${wordCount} words in library`;
  const summaryText =
    nextReviewCount > 0 && nextNewCount > 0
      ? `Next ${difficulty} quest: ${pluralize(nextReviewCount, "review")} + ${pluralize(nextNewCount, "new word")}`
      : nextReviewCount > 0
        ? `Next ${difficulty} quest: ${pluralize(nextReviewCount, "review")}`
        : nextNewCount > 0
          ? `Next ${difficulty} quest: ${pluralize(nextNewCount, "new word")}`
          : `${wordCount} words in library`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.35 }}
    >
      <Card
        size="sm"
        className={`relative overflow-hidden border-l-4 ${
          hasWork ? "border-l-amber-500" : "border-l-emerald-500"
        }`}
      >
        {hasWork && (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
        )}

        <CardContent className="relative space-y-3">
          {/* Status row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Swords className="size-5 text-muted-foreground" />
              <span className="font-semibold">Daily Quest</span>
            </div>
            <Badge variant={hasWork ? "default" : "secondary"} className="gap-1">
              {hasWork && <Sparkles className="size-3 animate-pulse" />}
              {hasWork ? "Quest Available" : "All Clear"}
            </Badge>
          </div>

          {/* Content: two stat boxes */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {hasWork
                  ? "Your training awaits. Keep your streak alive."
                  : "No words due. Your memory is strong today."}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <BookOpen className="size-3" />
                {backlogText}
              </p>
              <p className="text-xs font-medium text-foreground/80">
                {summaryText}
              </p>
            </div>

            {hasWork && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3"
              >
                {dueCount > 0 && (
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-amber-500">
                      <RotateCcw className="size-3.5" />
                      <span className="text-2xl font-bold tabular-nums">{dueCount}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">to review</p>
                  </div>
                )}
                {newCount > 0 && (
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-emerald-500">
                      <GraduationCap className="size-3.5" />
                      <span className="text-2xl font-bold tabular-nums">{newCount}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">new</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* CTA */}
          <Link href="/session" className="block">
            <Button
              size="lg"
              variant={hasWork ? "default" : "outline"}
              className={`w-full text-base gap-2 py-4 ${
                hasWork
                  ? "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
                  : ""
              }`}
            >
              <Swords className="size-5" />
              {hasWork ? "Embark on Training" : "Free Training"}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
