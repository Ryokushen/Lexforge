"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/db";
import { useBootstrap } from "@/lib/bootstrap-context";
import { addWordWithCard } from "@/lib/scheduler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle, Lock, Plus, RotateCcw, Search } from "lucide-react";
import { useStats } from "@/hooks/use-stats";
import {
  CUSTOM_CURRICULUM_INFO,
  SEEDED_PHASE_INFO,
  getCurriculumBadgeLabel,
  getLexiconSummary,
} from "@/lib/curriculum-copy";
import type { TOTCaptureSource, Word } from "@/lib/types";
import { TIER_UNLOCK_LEVELS, TOT_CAPTURE_SOURCES } from "@/lib/types";
import {
  createTOTEventId,
  getTOTEventIds,
  isDuplicateWord,
  isTierLocked,
  normalizeWord,
  type LibraryTierFilter,
} from "@/lib/word-library";
import {
  buildTierFilterLayout,
  buildWordGroups,
} from "./page.helpers";
import { IllumCard } from "@/components/rpg/illum-card";
import { HeronDivider } from "@/components/rpg/heron-divider";
import { Anvil, ChevronRight, Tome } from "@/components/rpg/sigils";

// ── Tier config ────────────────────────────────────────────────────────

const TIER_INFO: Record<
  string,
  { label: string; numeral: string; color: string }
> = {
  ...SEEDED_PHASE_INFO,
  custom: CUSTOM_CURRICULUM_INFO,
};

const TOT_SOURCE_LABELS: Record<TOTCaptureSource, string> = {
  speech: "Speech",
  writing: "Writing",
  reading: "Reading",
  meeting: "Meeting",
  other: "Other",
};

const INITIAL_TOT_FORM = {
  word: "",
  definition: "",
  weakSubstitute: "",
  context: "",
  source: "speech" as TOTCaptureSource,
};

function trimOptional(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed || undefined;
}

function formatCaptureDate(capturedAt: string): string {
  const parsed = new Date(capturedAt);
  if (Number.isNaN(parsed.getTime())) return "Unknown";
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function tierBadgeStyle(color: string) {
  return {
    borderColor: color,
    color,
    background: `color-mix(in oklab, ${color}, transparent 90%)`,
  } as const;
}

// ── Word row ───────────────────────────────────────────────────────────

function WordRow({
  word,
  isExpanded,
  onToggle,
  isLast,
}: {
  word: Word;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  const tierKey = String(word.tier);
  const tier = TIER_INFO[tierKey] ?? TIER_INFO.custom;

  return (
    <div
      style={{
        borderBottom: isLast ? "none" : "1px solid var(--line-soft)",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full text-left grid items-center gap-3 py-3 px-5 transition-colors hover:bg-[color-mix(in_oklab,var(--paper),var(--gold)_4%)]"
        style={{
          gridTemplateColumns: "20px 1fr auto auto",
          borderLeft: `4px solid ${tier.color}`,
        }}
      >
        <span
          style={{
            color: "var(--gold-deep)",
            transform: isExpanded ? "rotate(90deg)" : "none",
            transition: "transform .15s",
          }}
          aria-hidden
        >
          <ChevronRight size={14} />
        </span>
        <div className="min-w-0">
          <div
            className="font-display text-[19px] font-bold"
            style={{ color: "var(--ink)" }}
          >
            {word.word}
          </div>
          <div
            className="text-[13.5px] truncate mt-0.5"
            style={{ color: "var(--muted-foreground)" }}
          >
            {word.definition}
          </div>
        </div>
        <span className="lex-badge shrink-0" style={tierBadgeStyle(tier.color)}>
          {getCurriculumBadgeLabel(word.tier)}
        </span>
        {word.totCapture && (
          <span
            className="lex-badge shrink-0"
            style={tierBadgeStyle("var(--ember)")}
          >
            TOT ×{word.totCapture.count}
          </span>
        )}
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
            <div
              className="py-4 pl-16 pr-5 space-y-3"
              style={{
                background: "color-mix(in oklab, var(--paper), var(--gold) 2%)",
              }}
            >
              {word.examples.length > 0 && (
                <div className="space-y-1.5">
                  <p
                    className="uppercase-tracked text-[10px]"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Omens
                  </p>
                  {word.examples.map((ex, i) => (
                    <p
                      key={i}
                      className="italic text-sm pl-2.5"
                      style={{
                        color: "var(--ink-2)",
                        borderLeft: "2px solid var(--gold)",
                      }}
                    >
                      &ldquo;{ex}&rdquo;
                    </p>
                  ))}
                </div>
              )}

              {word.synonyms.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="uppercase-tracked text-[10px]"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Kin
                  </span>
                  {word.synonyms.map((s) => (
                    <span key={s} className="lex-badge">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {word.totCapture && (
                <div
                  className="space-y-2 rounded-[var(--radius)] p-3"
                  style={{
                    background: "color-mix(in oklab, var(--ember), transparent 92%)",
                    border: "1px solid color-mix(in oklab, var(--ember), transparent 70%)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className="size-4"
                      style={{ color: "var(--ember)" }}
                    />
                    <p
                      className="uppercase-tracked text-[10px]"
                      style={{ color: "var(--ember)" }}
                    >
                      Blanking Capture
                    </p>
                    <span className="lex-badge" style={tierBadgeStyle("var(--ember)")}>
                      {word.totCapture.count} logged
                    </span>
                  </div>
                  <div
                    className="grid gap-1 text-sm sm:grid-cols-2"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    <p>
                      <span style={{ color: "var(--ink)" }}>Source:</span>{" "}
                      {TOT_SOURCE_LABELS[word.totCapture.source]}
                    </p>
                    <p>
                      <span style={{ color: "var(--ink)" }}>Last captured:</span>{" "}
                      {formatCaptureDate(word.totCapture.capturedAt)}
                    </p>
                  </div>
                  {word.totCapture.weakSubstitute && (
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                      <span style={{ color: "var(--ink)" }}>Used instead:</span>{" "}
                      {word.totCapture.weakSubstitute}
                    </p>
                  )}
                  {word.totCapture.context && (
                    <p
                      className="text-sm whitespace-pre-wrap"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      <span style={{ color: "var(--ink)" }}>Context:</span>{" "}
                      {word.totCapture.context}
                    </p>
                  )}
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
  const { profile } = useStats();
  const { seedStatus, seedError, retrySeed } = useBootstrap();
  const playerLevel = profile?.level ?? 1;
  const [words, setWords] = useState<Word[]>([]);
  const [search, setSearch] = useState("");
  const [activeTier, setActiveTier] = useState<LibraryTierFilter>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [totDialogOpen, setTotDialogOpen] = useState(false);

  const [newWord, setNewWord] = useState("");
  const [newDef, setNewDef] = useState("");
  const [newExample, setNewExample] = useState("");
  const [totForm, setTotForm] = useState(INITIAL_TOT_FORM);
  const duplicateWord = isDuplicateWord(newWord, words);
  const selectedTierLocked = isTierLocked(activeTier, playerLevel);
  const normalizedTOTWord = normalizeWord(totForm.word);
  const existingTOTWord = useMemo(
    () => words.find((word) => normalizeWord(word.word) === normalizedTOTWord),
    [normalizedTOTWord, words],
  );
  const totNeedsDefinition = Boolean(normalizedTOTWord) && !existingTOTWord;

  const loadWords = useCallback(async () => {
    const all = await db.words.toArray();
    setWords(all.sort((a, b) => a.word.localeCompare(b.word)));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialWords() {
      const all = await db.words.toArray();
      if (cancelled) return;
      setWords(all.sort((a, b) => a.word.localeCompare(b.word)));
    }

    void loadInitialWords();
    return () => {
      cancelled = true;
    };
  }, [seedStatus]);

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return words
      .filter((w) => activeTier === "all" || w.tier === activeTier)
      .filter((w) => {
        if (!normalizedSearch) return true;
        return [
          w.word,
          w.definition,
          w.totCapture?.weakSubstitute,
          w.totCapture?.context,
        ].some((value) => value?.toLowerCase().includes(normalizedSearch));
      });
  }, [words, activeTier, search]);

  const grouped = useMemo(() => {
    if (activeTier !== "all") return null;
    return buildWordGroups(filtered, playerLevel);
  }, [filtered, activeTier, playerLevel]);

  const tierCounts = useMemo(() => {
    const counts: Record<string, number> = { all: words.length, "1": 0, "2": 0, "3": 0, "4": 0, custom: 0 };
    for (const w of words) {
      counts[String(w.tier)] = (counts[String(w.tier)] || 0) + 1;
    }
    return counts;
  }, [words]);
  const customWordCount = tierCounts.custom ?? 0;

  const handleAdd = async () => {
    if (!newWord.trim() || !newDef.trim() || duplicateWord) return;
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
    await loadWords();
  };

  const resetTOTForm = useCallback(() => {
    setTotForm(INITIAL_TOT_FORM);
  }, []);

  const handleTOTDialogChange = useCallback(
    (open: boolean) => {
      setTotDialogOpen(open);
      if (!open) resetTOTForm();
    },
    [resetTOTForm],
  );

  const handleCaptureTOT = async () => {
    const targetWord = totForm.word.trim();
    const definition = totForm.definition.trim();
    if (!targetWord || (totNeedsDefinition && !definition)) return;

    const weakSubstitute = trimOptional(totForm.weakSubstitute);
    const context = trimOptional(totForm.context);
    const capturedAt = new Date().toISOString();

    if (existingTOTWord?.id) {
      const eventIds = [
        ...getTOTEventIds(existingTOTWord, existingTOTWord.totCapture),
        createTOTEventId(),
      ];

      await db.words.update(existingTOTWord.id, {
        totCapture: {
          source: totForm.source,
          weakSubstitute,
          context,
          capturedAt,
          updatedAt: capturedAt,
          count: Math.max(existingTOTWord.totCapture?.count ?? 0, eventIds.length),
          eventIds,
        },
      });
    } else {
      const eventIds = [createTOTEventId()];
      await addWordWithCard({
        word: targetWord,
        definition,
        examples: context ? [context] : [],
        tier: "custom",
        synonyms: [],
        totCapture: {
          source: totForm.source,
          weakSubstitute,
          context,
          capturedAt,
          updatedAt: capturedAt,
          count: eventIds.length,
          eventIds,
        },
        createdAt: new Date(),
      });
    }

    handleTOTDialogChange(false);
    await loadWords();
  };

  const tierFilters: { key: LibraryTierFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: 1, label: "I" },
    { key: 2, label: "II" },
    { key: 3, label: "III" },
    { key: 4, label: "IV" },
    { key: "custom", label: "★" },
  ];
  const tierFilterLayout = buildTierFilterLayout();

  const renderWordList = (wordList: Word[]) => (
    <IllumCard className="p-0 overflow-hidden" corners={false} innerBorder={false}>
      <div>
        {wordList.map((w, i) => (
          <WordRow
            key={w.id}
            word={w}
            isExpanded={expandedId === w.id}
            onToggle={() => setExpandedId(expandedId === w.id ? null : (w.id ?? null))}
            isLast={i === wordList.length - 1}
          />
        ))}
      </div>
    </IllumCard>
  );

  if (seedStatus === "seeding" && words.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
          <span className="uppercase-tracked text-xs" style={{ color: "var(--gold-deep)" }}>
            Stocking the lexicon…
          </span>
        </div>
      </main>
    );
  }

  if (seedStatus === "error" && words.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
          <div
            className="flex size-14 items-center justify-center rounded-[var(--radius)]"
            style={{
              background: "color-mix(in oklab, var(--crimson), transparent 88%)",
              color: "var(--crimson)",
              border: "1px solid color-mix(in oklab, var(--crimson), transparent 60%)",
            }}
          >
            <AlertTriangle className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-bold">Library setup failed</h1>
            <p className="max-w-md text-sm italic" style={{ color: "var(--muted-foreground)" }}>
              {seedError ?? "Retry setup to load the built-in word library."}
            </p>
          </div>
          <Button onClick={retrySeed} className="gap-2">
            <RotateCcw className="size-4" />
            Retry Setup
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <div className="uppercase-tracked text-[11px]" style={{ color: "var(--gold-deep)" }}>
            Tome of Words
          </div>
          <h1
            className="font-display text-[34px] font-bold mt-0.5"
            style={{ color: "var(--ink)" }}
          >
            The Lexicon
          </h1>
          <p className="italic mt-1" style={{ color: "var(--muted-foreground)" }}>
            {getLexiconSummary(words.length, customWordCount)}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Dialog open={totDialogOpen} onOpenChange={handleTOTDialogChange}>
            <DialogTrigger render={<button className="btn-illum btn-illum-ghost" />}>
              <AlertTriangle className="size-3.5" />
              Capture TOT
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">Capture Blanking Moment</DialogTitle>
                <DialogDescription>
                  Save the exact word that stalled, what you used instead, and where it happened.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 pt-1">
                <Input
                  placeholder="Target word"
                  value={totForm.word}
                  onChange={(event) =>
                    setTotForm((c) => ({ ...c, word: event.target.value }))
                  }
                />
                {normalizedTOTWord &&
                  (existingTOTWord ? (
                    <p className="text-sm italic" style={{ color: "var(--sage)" }}>
                      This word is already in your library. Saving here will reinforce that entry.
                    </p>
                  ) : (
                    <p className="text-sm italic" style={{ color: "var(--muted-foreground)" }}>
                      This will create a new custom word, so add a definition before saving.
                    </p>
                  ))}
                {totNeedsDefinition && (
                  <Input
                    placeholder="Definition"
                    value={totForm.definition}
                    onChange={(event) =>
                      setTotForm((c) => ({ ...c, definition: event.target.value }))
                    }
                  />
                )}
                <Input
                  placeholder="What you said instead (optional)"
                  value={totForm.weakSubstitute}
                  onChange={(event) =>
                    setTotForm((c) => ({ ...c, weakSubstitute: event.target.value }))
                  }
                />
                <div className="space-y-1.5">
                  <label
                    className="uppercase-tracked text-[10px]"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Context
                  </label>
                  <textarea
                    value={totForm.context}
                    onChange={(event) =>
                      setTotForm((c) => ({ ...c, context: event.target.value }))
                    }
                    placeholder="Where did it happen? Paste the sentence or describe the moment."
                    className="flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    className="uppercase-tracked text-[10px]"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Source
                  </label>
                  <select
                    value={totForm.source}
                    onChange={(event) =>
                      setTotForm((c) => ({
                        ...c,
                        source: event.target.value as TOTCaptureSource,
                      }))
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    {TOT_CAPTURE_SOURCES.map((source) => (
                      <option key={source} value={source}>
                        {TOT_SOURCE_LABELS[source]}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleCaptureTOT}
                  className="btn-illum w-full"
                  disabled={
                    !totForm.word.trim() || (totNeedsDefinition && !totForm.definition.trim())
                  }
                >
                  <AlertTriangle className="size-4" />
                  Save Blanking Moment
                </button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger render={<button className="btn-illum" />}>
              <Anvil size={14} />
              Forge a Word
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Forge a Custom Word</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 pt-3">
                <Input
                  placeholder="Word"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                />
                {duplicateWord && (
                  <p className="text-sm italic" style={{ color: "var(--crimson)" }}>
                    This word is already in your library.
                  </p>
                )}
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
                <button
                  onClick={handleAdd}
                  className="btn-illum w-full"
                  disabled={!newWord.trim() || !newDef.trim() || duplicateWord}
                >
                  <Plus className="size-4" />
                  Add to Lexicon
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <HeronDivider />

      {/* Search + tier filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none"
            style={{ color: "var(--muted-foreground)" }}
          />
          <input
            className="inkwell pl-9"
            style={{ fontSize: 15 }}
            placeholder="Seek a word…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={tierFilterLayout.viewportClassName}>
          <div
            className={tierFilterLayout.stripClassName}
            style={{ border: "1px solid var(--line)", borderRadius: 3 }}
          >
            {tierFilters.map(({ key, label }, i) => {
              const active = activeTier === key;
              const count = tierCounts[String(key)] || 0;
              const locked = isTierLocked(key, playerLevel);
              return (
                <button
                  key={String(key)}
                  onClick={() => setActiveTier(key)}
                  disabled={locked}
                  className="font-display uppercase text-[11px] px-3 py-2 flex items-center gap-1.5 disabled:opacity-40"
                  style={{
                    letterSpacing: ".18em",
                    background: active ? "var(--gold)" : "transparent",
                    color: active ? "#1b1204" : "var(--muted-foreground)",
                    borderRight: i < tierFilters.length - 1 ? "1px solid var(--line)" : "none",
                  }}
                >
                  {locked && <Lock className="size-3" />}
                  {label}
                  <span
                    className="tabular-nums text-[10px]"
                    style={{ opacity: active ? 0.8 : 0.6 }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Word list */}
      {grouped ? (
        <div className="space-y-5">
          {grouped.map((group) => {
            const info = TIER_INFO[group.tier];
            return (
              <div key={group.tier} className="space-y-2">
                <div
                  className="flex items-center gap-3 pl-3 py-1"
                  style={{ borderLeft: `2px solid ${info.color}` }}
                >
                  <span
                    className="uppercase-tracked text-[11px]"
                    style={{ color: info.color }}
                  >
                    {group.tier === "custom" ? "Custom" : getCurriculumBadgeLabel(group.tier)}
                  </span>
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {info.label} · {(group.words.length + group.trackedLockedWords.length + group.hiddenLockedCount)} gathered
                  </span>
                  {group.isLocked && (
                    <span
                      className="flex items-center gap-1 text-[10px]"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      <Lock className="size-3" />
                      Unlocks at Rank {group.unlockLevel}
                    </span>
                  )}
                </div>
                {group.isLocked ? (
                  <IllumCard
                    className="p-6 text-center"
                    corners={false}
                    innerBorder={false}
                  >
                    <Lock
                      className="size-5 mx-auto mb-2 opacity-50"
                      style={{ color: "var(--muted-foreground)" }}
                    />
                    <p className="text-sm italic" style={{ color: "var(--muted-foreground)" }}>
                      Reach Rank {group.unlockLevel} to unlock {info.label}
                    </p>
                    {group.trackedLockedWords.length > 0 && (
                      <div
                        className="mt-4 space-y-2 rounded-[var(--radius)] p-3 text-left"
                        style={{
                          background: "color-mix(in oklab, var(--ember), transparent 94%)",
                          border: "1px solid color-mix(in oklab, var(--ember), transparent 72%)",
                        }}
                      >
                        <p
                          className="uppercase-tracked text-[10px]"
                          style={{ color: "var(--ember)" }}
                        >
                          Tracked while locked
                        </p>
                        <p className="text-sm italic" style={{ color: "var(--muted-foreground)" }}>
                          These words are saved from your blanking captures. They stay tracked, but they will not enter normal sessions until this phase unlocks.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {group.trackedLockedWords.map((word) => (
                            <span
                              key={word.id}
                              className="lex-badge"
                              style={tierBadgeStyle("var(--ember)")}
                            >
                              {word.word}
                              {word.totCapture ? ` · TOT ×${word.totCapture.count}` : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {group.hiddenLockedCount > 0 && (
                      <p className="mt-3 text-xs italic" style={{ color: "var(--muted-foreground)" }}>
                        {group.hiddenLockedCount} other {group.hiddenLockedCount === 1 ? "word remains" : "words remain"} locked until Rank {group.unlockLevel}.
                      </p>
                    )}
                  </IllumCard>
                ) : (
                  renderWordList(group.words)
                )}
              </div>
            );
          })}
        </div>
      ) : selectedTierLocked ? (
        <IllumCard className="p-6 text-center" corners={false} innerBorder={false}>
          <Lock
            className="size-5 mx-auto mb-2 opacity-50"
            style={{ color: "var(--muted-foreground)" }}
          />
          <p className="text-sm italic" style={{ color: "var(--muted-foreground)" }}>
            Reach Rank {TIER_UNLOCK_LEVELS[String(activeTier)]} to unlock{" "}
            {TIER_INFO[String(activeTier)]?.label ?? "this tier"}
          </p>
        </IllumCard>
      ) : filtered.length > 0 ? (
        renderWordList(filtered)
      ) : null}

      {filtered.length === 0 && !selectedTierLocked && (
        <div className="text-center py-10">
          <Tome
            size={28}
            className="mx-auto mb-2"
          />
          <p className="text-sm italic" style={{ color: "var(--muted-foreground)" }}>
            {search ? "No words match your search." : "No words in the lexicon."}
          </p>
        </div>
      )}
    </main>
  );
}
