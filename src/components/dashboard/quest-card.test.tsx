/** @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuestCard } from "./quest-card";

describe("QuestCard", () => {
  it("separates eligible new words from pending capture inbox items", () => {
    render(
      <QuestCard
        dueCount={5}
        newCount={0}
        inboxCount={2}
        wordCount={700}
        sessionSize={10}
        difficulty="normal"
      />,
    );

    expect(screen.getByText("Eligible New")).toBeInTheDocument();
    expect(screen.getByText("Inbox")).toBeInTheDocument();
    expect(screen.getByText(/2 captures pending triage/)).toBeInTheDocument();
    expect(screen.getByText(/Next normal trial: 5 reviews/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /take the field/i })).toHaveAttribute("href", "/session");
  });

  it("points to the Word Library when only inbox triage is waiting", () => {
    render(
      <QuestCard
        dueCount={0}
        newCount={0}
        inboxCount={3}
        wordCount={700}
        sessionSize={10}
        difficulty="normal"
      />,
    );

    expect(screen.getByText("The Ledger Calls")).toBeInTheDocument();
    expect(screen.getByText("Inbox Awaits")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /review inbox/i })).toHaveAttribute("href", "/words");
  });
});
