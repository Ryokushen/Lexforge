"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { RecallPrompt } from "@/components/session/recall-prompt";
import { ReviewResult } from "@/components/session/review-result";
import { SessionProgress } from "@/components/session/session-progress";
import { XPAward } from "@/components/session/xp-award";

export default function SessionPage() {
  const router = useRouter();
  const {
    state,
    currentWord,
    currentIndex,
    totalWords,
    results,
    summary,
    startSession,
    submitAnswer,
    nextWord,
    resetSession,
  } = useSession();

  useEffect(() => {
    if (state === "idle") {
      startSession();
    }
  }, [state, startSession]);

  if (state === "loading") {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Loading session...</p>
      </main>
    );
  }

  if (state === "idle") {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8 text-center space-y-4">
        <h2 className="text-2xl font-bold">No words available</h2>
        <p className="text-muted-foreground">
          Add words to your library or wait for reviews to become due.
        </p>
        <button
          onClick={() => router.push("/")}
          className="text-primary underline"
        >
          Back to Dashboard
        </button>
      </main>
    );
  }

  if (state === "complete" && summary) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
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
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <SessionProgress current={currentIndex} total={totalWords} />

      {state === "active" && (
        <RecallPrompt sessionWord={currentWord} onSubmit={submitAnswer} />
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
