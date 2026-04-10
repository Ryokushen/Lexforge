"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/db";
import { addWordWithCard } from "@/lib/scheduler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, BookOpen, ChevronDown } from "lucide-react";
import type { Word } from "@/lib/types";

// ── Tier config ────────────────────────────────────────────────────────

const TIER_BADGE_COLORS: Record<string, string> = {
  "1": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  "2": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "3": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  custom: "bg-amber-500/10 text-amber-500 border-amber-500/20",
};

const TIER_INFO: Record<string, { label: string; color: string; bg: string; border: string }> = {
  "1": { label: "Core Articulation", color: "text-emerald-500", bg: "bg-emerald-500", border: "border-l-emerald-500/40" },
  "2": { label: "Precision Vocabulary", color: "text-blue-500", bg: "bg-blue-500", border: "border-l-blue-500/40" },
  "3": { label: "Power Words", color: "text-purple-500", bg: "bg-purple-500", border: "border-l-purple-500/40" },
  custom: { label: "Custom", color: "text-amber-500", bg: "bg-amber-500", border: "border-l-amber-500/40" },
};

type TierFilter = "all" | 1 | 2 | 3 | "custom";

// ── Word row ───────────────────────────────────────────────────────────

function WordRow({ word, isExpanded, onToggle }: { word: Word; isExpanded: boolean; onToggle: () => void }) {
  const tierKey = String(word.tier);

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/30 transition-colors border-b border-border/30 last:border-b-0 group"
      >
        <span className="font-semibold text-sm min-w-[120px] sm:min-w-[140px] shrink-0">{word.word}</span>
        <Badge
          variant="outline"
          className={`text-[10px] border shrink-0 ${TIER_BADGE_COLORS[tierKey] ?? TIER_BADGE_COLORS.custom}`}
        >
          {word.tier === "custom" ? "Custom" : `T${word.tier}`}
        </Badge>
        <span className="text-sm text-muted-foreground truncate flex-1">{word.definition}</span>
        <ChevronDown className={`size-3.5 text-muted-foreground shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 py-3 bg-muted/20 border-b border-border/30 space-y-2.5">
              <p className="text-sm">{word.definition}</p>

              {word.examples.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Examples</p>
                  {word.examples.map((ex, i) => (
                    <p key={i} className="text-sm text-muted-foreground italic pl-2 border-l-2 border-border/40">
                      {ex}
                    </p>
                  ))}
                </div>
              )}

              {word.synonyms.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-muted-foreground">Synonyms:</span>
                  {word.synonyms.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────

export default function WordsPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [search, setSearch] = useState("");
  const [activeTier, setActiveTier] = useState<TierFilter>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [newWord, setNewWord] = useState("");
  const [newDef, setNewDef] = useState("");
  const [newExample, setNewExample] = useState("");

  const loadWords = async () => {
    const all = await db.words.toArray();
    setWords(all.sort((a, b) => a.word.localeCompare(b.word)));
  };

  useEffect(() => {
    loadWords();
  }, []);

  // Filter by tier + search
  const filtered = useMemo(() => {
    return words
      .filter((w) => activeTier === "all" || w.tier === activeTier)
      .filter(
        (w) =>
          !search ||
          w.word.toLowerCase().includes(search.toLowerCase()) ||
          w.definition.toLowerCase().includes(search.toLowerCase()),
      );
  }, [words, activeTier, search]);

  // Group by tier for "all" view
  const grouped = useMemo(() => {
    if (activeTier !== "all") return null;
    const groups: { tier: string; words: Word[] }[] = [];
    for (const tier of ["1", "2", "3", "custom"] as const) {
      const tierWords = filtered.filter((w) => String(w.tier) === tier);
      if (tierWords.length > 0) {
        groups.push({ tier, words: tierWords });
      }
    }
    return groups;
  }, [filtered, activeTier]);

  // Tier counts (from all words, ignoring search)
  const tierCounts = useMemo(() => {
    const counts: Record<string, number> = { all: words.length, "1": 0, "2": 0, "3": 0, custom: 0 };
    for (const w of words) {
      counts[String(w.tier)] = (counts[String(w.tier)] || 0) + 1;
    }
    return counts;
  }, [words]);

  const handleAdd = async () => {
    if (!newWord.trim() || !newDef.trim()) return;
    await addWordWithCard({
      word: newWord.trim(),
      definition: newDef.trim(),
      examples: newExample.trim() ? [newExample.trim()] : [],
      tier: "custom",
      synonyms: [],
      createdAt: new Date(),
    });
    setNewWord("");
    setNewDef("");
    setNewExample("");
    setDialogOpen(false);
    loadWords();
  };

  const tierFilters: { key: TierFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: 1, label: "Tier 1" },
    { key: 2, label: "Tier 2" },
    { key: 3, label: "Tier 3" },
    { key: "custom", label: "Custom" },
  ];

  const renderWordList = (wordList: Word[]) => (
    <Card size="sm" className="overflow-hidden">
      <div>
        {wordList.map((w) => (
          <WordRow
            key={w.id}
            word={w}
            isExpanded={expandedId === w.id}
            onToggle={() => setExpandedId(expandedId === w.id ? null : (w.id ?? null))}
          />
        ))}
      </div>
    </Card>
  );

  return (
    <main className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="size-4.5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Word Library</h1>
            <p className="text-xs text-muted-foreground">
              {words.length} words collected
            </p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button size="sm" className="gap-1.5" />}>
            <Plus className="size-3.5" />
            Add Word
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Custom Word</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-3">
              <Input
                placeholder="Word"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
              />
              <Input
                placeholder="Definition"
                value={newDef}
                onChange={(e) => setNewDef(e.target.value)}
              />
              <Input
                placeholder="Example sentence (optional)"
                value={newExample}
                onChange={(e) => setNewExample(e.target.value)}
              />
              <Button
                onClick={handleAdd}
                className="w-full"
                disabled={!newWord.trim() || !newDef.trim()}
              >
                Add to Library
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search words or definitions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-sm bg-muted/30 border-border/50"
        />
      </div>

      {/* Tier filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto">
        {tierFilters.map(({ key, label }) => {
          const count = tierCounts[String(key)] || 0;
          const isActive = activeTier === key;
          const tierInfo = key !== "all" ? TIER_INFO[String(key)] : null;

          return (
            <Button
              key={String(key)}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTier(key)}
              className={`gap-1 text-xs shrink-0 ${
                isActive && tierInfo ? `${tierInfo.bg} hover:${tierInfo.bg}/90` : ""
              }`}
            >
              {label}
              <span className={`text-[10px] tabular-nums ${isActive ? "opacity-80" : "text-muted-foreground"}`}>
                {count}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Word list */}
      {grouped ? (
        // "All" view: grouped by tier with section headers
        <div className="space-y-4">
          {grouped.map(({ tier, words: tierWords }) => {
            const info = TIER_INFO[tier];
            return (
              <div key={tier} className="space-y-1.5">
                <div className={`flex items-center gap-2 pl-2 border-l-2 ${info.border}`}>
                  <span className={`text-xs font-semibold uppercase tracking-widest ${info.color}`}>
                    {tier === "custom" ? "Custom" : `Tier ${tier}`}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {info.label} ({tierWords.length})
                  </span>
                </div>
                {renderWordList(tierWords)}
              </div>
            );
          })}
        </div>
      ) : (
        // Filtered single-tier view
        filtered.length > 0 ? (
          renderWordList(filtered)
        ) : null
      )}

      {filtered.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="size-7 text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {search ? "No words match your search." : "No words in library."}
          </p>
        </div>
      )}
    </main>
  );
}
