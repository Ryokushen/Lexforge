"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { AnswerMetadata, SessionWord } from "@/lib/types";
import { IllumCard } from "@/components/rpg/illum-card";
import { Sword, Lantern } from "@/components/rpg/sigils";

interface RecallPromptProps {
  sessionWord: SessionWord;
  onSubmit: (answer: string, metadata?: AnswerMetadata) => void;
}

export function RecallPrompt({ sessionWord, onSubmit }: RecallPromptProps) {
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { word } = sessionWord;
  const allowHint = sessionWord.drillProfile?.recallHintEnabled ?? true;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(answer.trim(), { cueLevel: showHint ? 1 : 0 });
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
      <IllumCard className="w-full max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
          <div className="flex items-center gap-2" style={{ color: "var(--crimson)" }}>
            <Sword size={16} />
            <span className="uppercase-tracked text-[11px]">Recall — Retrieve the word</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="lex-badge">{tierLabel}</span>
            {showHint && (
              <motion.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 font-mono-num text-[11px]"
                style={{ color: "var(--ember)" }}
              >
                <Lantern size={12} />
                &ldquo;{word.word[0].toUpperCase()}&rdquo; · {word.word.length} letters
              </motion.span>
            )}
          </div>
        </div>

        <div
          className="px-5 py-4 mb-4"
          style={{
            borderLeft: "3px solid var(--gold)",
            background: "color-mix(in oklab, var(--paper), var(--gold) 4%)",
            borderRadius: 2,
          }}
        >
          <div className="uppercase-tracked text-[10px] mb-1.5" style={{ color: "var(--muted-foreground)" }}>
            Definition
          </div>
          <p className="font-serif m-0 text-[20px] leading-[1.4]" style={{ color: "var(--ink)" }}>
            {word.definition}
          </p>
        </div>

        {showHint && word.examples.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="px-3.5 py-3 mb-4 text-sm italic overflow-hidden"
            style={{
              background: "color-mix(in oklab, var(--paper), var(--ember) 6%)",
              border: "1px dashed color-mix(in oklab, var(--ember), transparent 60%)",
              borderRadius: 3,
              color: "var(--ink-2)",
            }}
          >
            <span className="uppercase-tracked text-[10px] mr-2" style={{ color: "var(--ember)" }}>
              Omen
            </span>
            {word.examples[0].replace(new RegExp(word.word, "gi"), "______")}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="inkwell"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Speak the word…"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <div className="flex gap-2.5 mt-3">
            <button type="submit" className="btn-illum flex-1" disabled={!answer.trim()}>
              <Sword size={14} />
              Strike
            </button>
            {!showHint && allowHint && (
              <button
                type="button"
                className="btn-illum btn-illum-ghost"
                onClick={() => setShowHint(true)}
              >
                <Lantern size={14} />
                Invoke Lantern
              </button>
            )}
          </div>
        </form>
      </IllumCard>
    </motion.div>
  );
}
