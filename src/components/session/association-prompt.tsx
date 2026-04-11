"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, Send, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import type { SessionWord } from "@/lib/types";

interface AssociationPromptProps {
  sessionWord: SessionWord;
  phase: "create" | "recall";
  onSubmit: (answer: string) => void;
}

export function AssociationPrompt({ sessionWord, phase, onSubmit }: AssociationPromptProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { word } = sessionWord;

  useEffect(() => {
    setInput("");
    if (phase === "create") {
      textareaRef.current?.focus();
    } else {
      inputRef.current?.focus();
    }
  }, [sessionWord, phase]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    // Save association to the word
    await db.words.update(word.id!, { association: input.trim() });
    // Submit the word itself as the answer (always correct for create)
    onSubmit(word.word);
  };

  const handleRecall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit(input.trim());
  };

  if (phase === "create") {
    return (
      <motion.div
        key={`create-${word.id}`}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Card size="sm" className="w-full max-w-2xl mx-auto border-l-4 border-l-rose-500/40 ring-1 ring-rose-500/15">
          <CardContent className="space-y-4">
            {/* Mode header */}
            <div className="flex items-center gap-1.5 text-rose-500">
              <Palette className="size-3.5" />
              <span className="text-xs font-semibold uppercase tracking-widest">Associate</span>
              <span className="text-xs text-muted-foreground ml-1">Create a mental image</span>
            </div>

            {/* Word + definition */}
            <div className="text-center py-1">
              <motion.p
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-2xl font-bold"
              >
                {word.word}
              </motion.p>
              <p className="text-sm text-muted-foreground mt-1">{word.definition}</p>
            </div>

            {/* Association input */}
            <form onSubmit={handleCreate} className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">
                  Describe a vivid image, scene, or memory that connects to this word:
                </label>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='e.g., "A giant stone wall cracking under pressure, pieces flying everywhere"'
                  className="flex w-full rounded-md border border-border/50 bg-muted/30 px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-rose-500/40 focus:ring-2 focus:ring-rose-500/15 focus:outline-none resize-none h-20"
                  autoComplete="off"
                />
              </div>
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={!input.trim()}
              >
                <Sparkles className="size-4" />
                Save Association
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Recall phase — show association, type the word
  return (
    <motion.div
      key={`recall-${word.id}`}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Card size="sm" className="w-full max-w-2xl mx-auto border-l-4 border-l-rose-500/40 ring-1 ring-rose-500/15">
        <CardContent className="space-y-4">
          {/* Mode header */}
          <div className="flex items-center gap-1.5 text-rose-500">
            <Palette className="size-3.5" />
            <span className="text-xs font-semibold uppercase tracking-widest">Associate</span>
            <span className="text-xs text-muted-foreground ml-1">Recall from your image</span>
          </div>

          {/* Association text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="pl-3 border-l-2 border-rose-500/25 italic text-base leading-relaxed text-muted-foreground"
          >
            &ldquo;{word.association}&rdquo;
          </motion.div>

          <p className="text-xs text-muted-foreground text-center">What word does this remind you of?</p>

          {/* Word input */}
          <form onSubmit={handleRecall} className="space-y-2.5">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type the word..."
              className="text-base h-10 bg-muted/30 border-border/50 focus:border-rose-500/40 focus:ring-2 focus:ring-rose-500/15"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <Button
              type="submit"
              className="w-full gap-2"
              disabled={!input.trim()}
            >
              <Send className="size-4" />
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
