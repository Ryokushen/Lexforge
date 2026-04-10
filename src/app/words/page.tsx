"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import type { Word } from "@/lib/types";

export default function WordsPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Add word form state
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
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Word Library</h1>
          <p className="text-sm text-muted-foreground">
            {words.length} words total
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger render={<Button />}>
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
          <Link href="/">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>
      </div>

      <Input
        placeholder="Search words..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="space-y-2">
        {filtered.map((w) => (
          <Card key={w.id}>
            <CardContent className="py-3 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{w.word}</span>
                  <Badge variant="outline" className="text-xs">
                    {w.tier === "custom" ? "Custom" : `Tier ${w.tier}`}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {w.definition}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            {search ? "No words match your search." : "No words in library."}
          </p>
        )}
      </div>
    </main>
  );
}
