"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "@/hooks/use-session";
import { useStats } from "@/hooks/use-stats";
import { useBootstrap } from "@/lib/bootstrap-context";
import { RecallPrompt } from "@/components/session/recall-prompt";
import { ContextPrompt } from "@/components/session/context-prompt";
import { ReviewResult } from "@/components/session/review-result";
import { SpeedPrompt } from "@/components/session/speed-prompt";
import { AssociationPrompt } from "@/components/session/association-prompt";
import { SessionProgress } from "@/components/session/session-progress";
import { XPAward } from "@/components/session/xp-award";
import { BattleScene } from "@/components/session/battle-scene";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft } from "lucide-react";

export default function SessionPage() {
  const router = useRouter();
  const { profile, loading: statsLoading } = useStats();
  const { seedStatus } = useBootstrap();
  const {
    state,
    currentWord,
    sessionSeed,
    currentIndex,
    totalWords,
    results,
    summary,
    currentMode,
    currentContextSentence,
    currentSpeedChoices,
    associationPhase,
    startSession,
    submitAnswer,
    nextWord,
    resetSession,
  } = useSession();

  useEffect(() => {
    if (state === "idle" && profile && seedStatus !== "seeding") {
      startSession(profile.difficulty, profile.level);
    }
  }, [state, startSession, profile, seedStatus]);

  if (state === "loading" || statsLoading || (state === "idle" && seedStatus === "seeding")) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-4 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-3xl animate-pulse">&#x2694;&#xFE0F;</span>
          <p className="text-muted-foreground text-sm">
            {seedStatus === "seeding" ? "Preparing your library..." : "Preparing session..."}
          </p>
        </motion.div>
      </main>
    );
  }

  if (state === "idle") {
    return (
      <main className="max-w-2xl mx-auto px-4 py-4 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="size-16 rounded-2xl bg-muted/50 flex items-center justify-center">
            <BookOpen className="size-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold">No words available</h2>
          <p className="text-muted-foreground max-w-sm">
            Add words to your library or wait for reviews to become due.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Button>
        </motion.div>
      </main>
    );
  }

  if (state === "complete" && summary) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-4">
        <XPAward
          summary={summary}
          onDone={() => {
            resetSession();
            router.push("/");
          }}
        />
      </main>
    );
  }

  if (!currentWord) return null;

  const lastResult = results[results.length - 1] ?? null;
  return (
    <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
      <SessionProgress current={currentIndex} total={totalWords} results={results} currentMode={currentMode} />

      <BattleScene
        sessionSeed={sessionSeed}
        totalWords={totalWords}
        results={results}
        lastResult={state === "reviewing" ? lastResult : null}
      />

      {state === "active" && currentMode === "recall" && (
        <RecallPrompt
          key={currentWord.word.id}
          sessionWord={currentWord}
          onSubmit={submitAnswer}
        />
      )}

      {state === "active" &&
        currentMode === "association" &&
        associationPhase && (
          <AssociationPrompt
            key={`${currentWord.word.id}-${associationPhase}`}
            sessionWord={currentWord}
            phase={associationPhase}
            onSubmit={submitAnswer}
          />
        )}

      {state === "active" &&
        currentMode === "speed" &&
        currentSpeedChoices && (
          <SpeedPrompt
            key={currentWord.word.id}
            sessionWord={currentWord}
            choices={currentSpeedChoices}
            onSubmit={submitAnswer}
          />
        )}

      {state === "active" &&
        currentMode === "context" &&
        currentContextSentence && (
          <ContextPrompt
            key={currentContextSentence.sentence}
            sentence={currentContextSentence}
            onSubmit={submitAnswer}
          />
        )}

      {state === "reviewing" && lastResult && (
        <ReviewResult
          sessionWord={currentWord}
          result={lastResult}
          onNext={nextWord}
        />
      )}
    </main>
  );
}
