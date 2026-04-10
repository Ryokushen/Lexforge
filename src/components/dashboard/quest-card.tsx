"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Swords, Sparkles, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface QuestCardProps {
  dueCount: number;
  wordCount: number;
}

export function QuestCard({ dueCount, wordCount }: QuestCardProps) {
  const hasDue = dueCount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.35 }}
    >
      <Card
        size="sm"
        className={`relative overflow-hidden border-l-4 ${
          hasDue ? "border-l-amber-500" : "border-l-emerald-500"
        }`}
      >
        {/* Subtle gradient backdrop */}
        {hasDue && (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
        )}

        <CardContent className="relative space-y-3">
          {/* Status row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Swords className="size-5 text-muted-foreground" />
              <span className="font-semibold">Daily Quest</span>
            </div>
            <Badge variant={hasDue ? "default" : "secondary"} className="gap-1">
              {hasDue && <Sparkles className="size-3 animate-pulse" />}
              {hasDue ? "Quest Available" : "All Clear"}
            </Badge>
          </div>

          {/* Content: narrative + due count */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {hasDue
                  ? `${dueCount} word${dueCount === 1 ? "" : "s"} await${dueCount === 1 ? "s" : ""} your recall. Your memory grows restless.`
                  : "No words due. Your memory is strong today."}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <BookOpen className="size-3" />
                {wordCount} words in library
              </p>
            </div>

            {hasDue && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center sm:text-right"
              >
                <span className="text-4xl font-bold tabular-nums text-amber-500">
                  {dueCount}
                </span>
                <p className="text-xs text-muted-foreground">words due</p>
              </motion.div>
            )}
          </div>

          {/* CTA */}
          <Link href="/session" className="block">
            <Button
              size="lg"
              variant={hasDue ? "default" : "outline"}
              className={`w-full text-base gap-2 py-4 ${
                hasDue
                  ? "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
                  : ""
              }`}
            >
              <Swords className="size-5" />
              {hasDue ? "Embark on Training" : "Free Training"}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
