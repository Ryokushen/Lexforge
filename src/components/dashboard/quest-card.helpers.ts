import type { Difficulty } from "@/lib/types";

export type AutomaticTrainingPlanStep = {
  key: "reviews" | "new" | "coverage" | "inbox";
  label: string;
  value: number;
  caption: string;
};

export type AutomaticTrainingPlan = {
  headline: string;
  summary: string;
  detail: string;
  steps: AutomaticTrainingPlanStep[];
};

export type AutomaticTrainingPlanInput = {
  dueCount: number;
  newCount: number;
  inboxCount: number;
  sessionSize: number;
  difficulty: Difficulty;
  coverageSignalCount: number;
};

function pluralize(count: number, singular: string): string {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

export function getAutomaticTrainingPlan({
  dueCount,
  newCount,
  inboxCount,
  sessionSize,
  difficulty,
  coverageSignalCount,
}: AutomaticTrainingPlanInput): AutomaticTrainingPlan {
  const reviewSlots = Math.min(dueCount, sessionSize);
  const newSlots = Math.min(newCount, Math.max(0, sessionSize - reviewSlots));
  const summaryParts = [
    reviewSlots > 0 ? pluralize(reviewSlots, "FSRS review") : null,
    newSlots > 0 ? pluralize(newSlots, "eligible new word") : null,
  ].filter(Boolean);

  return {
    headline: `Automatic ${difficulty} trial`,
    summary:
      summaryParts.length > 0
        ? `Next ${difficulty} trial: ${summaryParts.join(" + ")}`
        : "No scheduled training pressure",
    detail:
      summaryParts.length > 0
        ? "FSRS due reviews fill the session first. Eligible new words backfill open slots, and coverage signals shape prompt type inside the selected words."
        : "Lexforge will resume when FSRS or new-word limits allow. Captured words still wait for triage before training.",
    steps: [
      {
        key: "reviews",
        label: "FSRS reviews",
        value: reviewSlots,
        caption: "scheduled first",
      },
      {
        key: "new",
        label: "Eligible new",
        value: newSlots,
        caption: "backfills open slots",
      },
      {
        key: "coverage",
        label: "Coverage signals",
        value: coverageSignalCount,
        caption: "shape prompt types",
      },
      {
        key: "inbox",
        label: "Inbox held out",
        value: inboxCount,
        caption: "triage before training",
      },
    ],
  };
}
