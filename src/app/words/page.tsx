"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { Plus, Search, BookOpen } from "lucide-react";
import type { Word } from "@/lib/types";

const TIER_COLORS: Record<string, string> = {
  "1": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  "2": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "3": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  custom: "bg-amber-500/10 text-amber-500 border-amber-500/20",
};

export default function WordsPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [search, setSearch] = useState("");
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

  const filtered = search
    ? words.filter(
        (w) =>
          w.word.toLowerCase().includes(search.toLowerCase()) ||
          w.definition.toLowerCase().includes(search.toLowerCase()),
      )
    : words;

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

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Word Library</h1>
            <p className="text-sm text-muted-foreground">
              {words.length} words collected
            </p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button className="gap-1.5" />}>
            <Plus className="size-4" />
            Add Word
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Custom Word</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
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
          className="pl-9 bg-muted/30 border-border/60"
        />
      </div>

      {/* Word List */}
      <div className="space-y-2">
        {filtered.map((w, i) => (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 0.5) }}
          >
            <Card className="hover:border-primary/20 transition-colors">
              <CardContent className="py-3 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{w.word}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs border ${TIER_COLORS[String(w.tier)] ?? TIER_COLORS.custom}`}
                    >
                      {w.tier === "custom" ? "Custom" : `Tier ${w.tier}`}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                    {w.definition}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="size-8 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">
              {search ? "No words match your search." : "No words in library."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
