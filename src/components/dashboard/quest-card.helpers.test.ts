import { describe, expect, it } from "vitest";
import { getAutomaticTrainingPlan } from "./quest-card.helpers";

describe("getAutomaticTrainingPlan", () => {
  it("shows FSRS reviews filling the session before eligible new words", () => {
    const plan = getAutomaticTrainingPlan({
      dueCount: 8,
      newCount: 10,
      inboxCount: 2,
      sessionSize: 10,
      difficulty: "normal",
      coverageSignalCount: 14,
    });

    expect(plan.headline).toBe("Automatic normal trial");
    expect(plan.detail).toContain("FSRS due reviews fill the session first");
    expect(plan.detail).toContain("coverage signals shape prompt type");
    expect(plan.detail).not.toMatch(/choose|recommend/i);
    expect(plan.steps).toEqual([
      {
        key: "reviews",
        label: "FSRS reviews",
        value: 8,
        caption: "scheduled first",
      },
      {
        key: "new",
        label: "Eligible new",
        value: 2,
        caption: "backfills open slots",
      },
      {
        key: "coverage",
        label: "Coverage signals",
        value: 14,
        caption: "shape prompt types",
      },
      {
        key: "inbox",
        label: "Inbox held out",
        value: 2,
        caption: "triage before training",
      },
    ]);
  });

  it("does not imply new words fit when due reviews consume the whole session", () => {
    const plan = getAutomaticTrainingPlan({
      dueCount: 12,
      newCount: 6,
      inboxCount: 0,
      sessionSize: 10,
      difficulty: "hard",
      coverageSignalCount: 3,
    });

    expect(plan.steps[0]).toMatchObject({ key: "reviews", value: 10 });
    expect(plan.steps[1]).toMatchObject({ key: "new", value: 0 });
    expect(plan.summary).toBe("Next hard trial: 10 FSRS reviews");
  });

  it("keeps quiet-day copy automatic without manual drill selection", () => {
    const plan = getAutomaticTrainingPlan({
      dueCount: 0,
      newCount: 0,
      inboxCount: 0,
      sessionSize: 10,
      difficulty: "easy",
      coverageSignalCount: 0,
    });

    expect(plan.summary).toBe("No scheduled training pressure");
    expect(plan.detail).toContain("Lexforge will resume when FSRS or new-word limits allow");
    expect(plan.detail).not.toMatch(/choose|recommend/i);
  });
});
