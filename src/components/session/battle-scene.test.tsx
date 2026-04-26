/** @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { SessionResult } from "@/lib/types";
import { BattleScene, getBattleEvent, getMonsterHp } from "./battle-scene";

function makeResult(overrides: Partial<SessionResult> = {}): SessionResult {
  return {
    wordId: 1,
    word: "lucid",
    correct: true,
    responseTimeMs: 1200,
    rating: 3,
    mode: "recall",
    ...overrides,
  };
}

describe("BattleScene", () => {
  it("reduces monster HP for correct answers", () => {
    const results = [
      makeResult({ wordId: 1, correct: true }),
      makeResult({ wordId: 2, correct: true }),
    ];

    render(
      <BattleScene
        sessionSeed={0}
        totalWords={10}
        results={results}
        lastResult={results[1]}
      />,
    );

    expect(screen.getByText("8/10")).toBeInTheDocument();
    expect(getMonsterHp(10, results)).toBe(8);
  });

  it("does not reduce monster HP for incorrect answers", () => {
    const results = [
      makeResult({ wordId: 1, correct: true }),
      makeResult({ wordId: 2, correct: false, rating: 1 }),
    ];

    render(
      <BattleScene
        sessionSeed={0}
        totalWords={10}
        results={results}
        lastResult={results[1]}
      />,
    );

    expect(screen.getByText("9/10")).toBeInTheDocument();
    expect(getMonsterHp(10, results)).toBe(9);
  });

  it("shows defeat state when the final HP is removed", () => {
    const results = [
      makeResult({ wordId: 1, correct: true }),
      makeResult({ wordId: 2, correct: true }),
    ];

    render(
      <BattleScene
        sessionSeed={0}
        totalWords={2}
        results={results}
        lastResult={results[1]}
      />,
    );

    expect(screen.getByText("0/2")).toBeInTheDocument();
    expect(screen.getByText("FALLEN")).toBeInTheDocument();
  });

  it("derives battle events from review results and remaining HP", () => {
    expect(getBattleEvent(null, 5)).toBe("idle");
    expect(getBattleEvent(makeResult({ correct: true }), 4)).toBe("player-hit");
    expect(getBattleEvent(makeResult({ correct: true }), 0)).toBe(
      "monster-defeated",
    );
    expect(getBattleEvent(makeResult({ correct: false, rating: 1 }), 4)).toBe(
      "monster-attack",
    );
  });
});
