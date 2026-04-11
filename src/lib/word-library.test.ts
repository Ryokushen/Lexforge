import { describe, expect, it } from "vitest";
import {
  isDuplicateWord,
  isTierLocked,
  normalizeWord,
} from "./word-library";

describe("word library helpers", () => {
  it("normalizes words consistently", () => {
    expect(normalizeWord("  Lucid  ")).toBe("lucid");
  });

  it("detects case-insensitive duplicate words", () => {
    expect(
      isDuplicateWord("  Lucid ", [
        { word: "lucid" },
        { word: "tenuous" },
      ]),
    ).toBe(true);
    expect(
      isDuplicateWord("novel", [
        { word: "lucid" },
        { word: "tenuous" },
      ]),
    ).toBe(false);
  });

  it("treats locked tiers consistently with level unlocks", () => {
    expect(isTierLocked("all", 1)).toBe(false);
    expect(isTierLocked("custom", 1)).toBe(false);
    expect(isTierLocked(2, 1)).toBe(true);
    expect(isTierLocked(2, 5)).toBe(false);
    expect(isTierLocked(3, 9)).toBe(true);
    expect(isTierLocked(3, 10)).toBe(false);
  });
});
