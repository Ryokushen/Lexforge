"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import type { SessionWord, SessionResult } from "@/lib/types";
import { Check, Cross, ChevronRight } from "@/components/rpg/sigils";

interface ReviewResultProps {
  sessionWord: SessionWord;
  result: SessionResult;
  onNext: () => void;
}

export function ReviewResult({ sessionWord, result, onNext }: ReviewResultProps) {
  const { word } = sessionWord;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      event.preventDefault();
      onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext]);

  const ratingLabel =
    result.rating === 1 ? "Again" : result.rating === 2 ? "Hard" : result.rating === 3 ? "Good" : "Easy";

  const modeLabel =
    result.mode === "context"
      ? "CTX"
      : result.mode === "speed"
        ? "RTR"
        : result.mode === "association"
          ? "ASC"
          : "RCL";

  const retrievalKind = result.retrievalKind ?? (result.correct ? "exact" : "failed");
  const isTransferContext =
    result.mode === "context" &&
    (result.contextPromptKind === "produce" || result.contextPromptKind === "rewrite");
  const retrievalLabel = isTransferContext
    ? retrievalKind === "approximate"
      ? "Close"
      : retrievalKind === "failed"
        ? "Miss"
        : "Used"
    : retrievalKind === "assisted"
      ? "Cue"
      : retrievalKind === "approximate"
        ? "Close"
        : retrievalKind === "created"
          ? "Created"
          : retrievalKind === "failed"
            ? "Miss"
            : "Clean";

  const accent = result.correct ? "var(--sage)" : "var(--crimson)";
  const headline = result.correct ? "A true strike." : "The foe evades.";
  const subtext = result.correct
    ? "The word answers to your call."
    : "Commit it to memory. It will come again.";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        className="relative overflow-hidden rounded-[var(--radius)]"
        style={{
          background: `linear-gradient(180deg,
            color-mix(in oklab, var(--paper-2), ${accent} 5%),
            var(--paper))`,
          border: "1px solid var(--line)",
          borderLeft: `4px solid ${accent}`,
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div className="relative z-[1] p-6">
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.05 }}
              className="flex items-center justify-center size-11 rounded-[3px] shrink-0"
              style={{
                background: accent,
                color: "#fff",
                boxShadow: "0 4px 10px rgba(0,0,0,.2)",
              }}
            >
              {result.correct ? <Check size={24} /> : <Cross size={24} />}
            </motion.div>
            <div>
              <div className="font-display text-[22px] font-bold" style={{ color: accent }}>
                {headline}
              </div>
              <div className="text-sm italic" style={{ color: "var(--muted-foreground)" }}>
                {subtext}
              </div>
            </div>
          </div>

          <div
            className="px-4 py-3 rounded-[3px]"
            style={{
              background: "color-mix(in oklab, var(--paper), var(--gold) 3%)",
              border: "1px solid var(--line-soft)",
            }}
          >
            <div
              className="font-display text-[28px] font-bold leading-tight"
              style={{ color: "var(--ink)", letterSpacing: ".02em" }}
            >
              {word.word}
            </div>
            <div className="text-[15px] mt-1.5" style={{ color: "var(--ink-2)" }}>
              {word.definition}
            </div>

            {word.examples.length > 0 && (
              <div
                className="italic mt-2 text-sm pl-2.5"
                style={{ color: "var(--muted-foreground)", borderLeft: "2px solid var(--line-soft)" }}
              >
                &ldquo;{word.examples[0]}&rdquo;
              </div>
            )}
            {word.synonyms.length > 0 && (
              <div className="mt-2.5 flex gap-1.5 flex-wrap">
                {word.synonyms.map((s) => (
                  <span key={s} className="lex-badge">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex items-center justify-between text-[11px] mt-3 flex-wrap gap-2"
            style={{ color: "var(--muted-foreground)" }}
          >
            <span className="font-mono-num">{(result.responseTimeMs / 1000).toFixed(1)}s</span>
            <span className="flex items-center gap-2">
              <span className="lex-badge">{modeLabel}</span>
              <span
                className="font-display uppercase text-[10px] px-2 py-0.5 rounded-[3px]"
                style={{
                  letterSpacing: ".18em",
                  background: `color-mix(in oklab, ${accent}, transparent 85%)`,
                  color: accent,
                }}
              >
                {retrievalLabel}
              </span>
              <span
                className="font-display uppercase text-[10px] px-2 py-0.5 rounded-[3px]"
                style={{
                  letterSpacing: ".18em",
                  background:
                    result.rating >= 3
                      ? "color-mix(in oklab, var(--sage), transparent 85%)"
                      : result.rating === 2
                        ? "color-mix(in oklab, var(--ember), transparent 85%)"
                        : "color-mix(in oklab, var(--crimson), transparent 85%)",
                  color:
                    result.rating >= 3
                      ? "var(--sage)"
                      : result.rating === 2
                        ? "var(--ember)"
                        : "var(--crimson)",
                }}
              >
                {ratingLabel}
              </span>
            </span>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={onNext}
            className="btn-illum w-full mt-4"
          >
            Onward <ChevronRight size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
