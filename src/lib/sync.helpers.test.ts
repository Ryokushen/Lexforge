import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  getCloudWordLookupKey,
  getLocalWordLookupKey,
  normalizeRetrievalKind,
  normalizeContextPromptKind,
  compareDateOnly,
  normalizeTextArray,
  mergeUniqueStrings,
} from "./sync";

// normalizeWord is imported by sync.ts from word-library.ts
vi.mock("./word-library", () => ({
  normalizeWord: vi.fn((value: string) => value.toLowerCase().trim()),
}));

import { normalizeWord } from "./word-library";

const normalized = (v: string) => v.toLowerCase().trim();

describe("getCloudWordLookupKey", () => {
  it("uses normalized_word_key when present", () => {
    const key = getCloudWordLookupKey({ word_key: "LUCID", normalized_word_key: "lucid" });
    expect(key).toBe(normalized("lucid"));
  });

  it("falls back to word_key when normalized_word_key is absent", () => {
    const key = getCloudWordLookupKey({ word_key: "LUCID" });
    expect(key).toBe(normalized("LUCID"));
  });

  it("falls back to word_key when normalized_word_key is null", () => {
    const key = getCloudWordLookupKey({ word_key: "LUCID", normalized_word_key: null });
    expect(key).toBe(normalized("LUCID"));
  });

  it("does NOT fall back when normalized_word_key is empty string (?? only treats null/undefined as nullish)", () => {
    // normalizeWord('''') = '' since trim/lower don't change empty string
    const key = getCloudWordLookupKey({ word_key: "LUCID", normalized_word_key: "" });
    expect(key).toBe(""); // empty string is falsy but not nullish — no fallback
  });

  it("trims and lowercases via normalizeWord", () => {
    const key = getCloudWordLookupKey({ word_key: "  OBLIQUE  ", normalized_word_key: undefined });
    expect(key).toBe(normalized("  OBLIQUE  "));
  });
});

describe("getLocalWordLookupKey", () => {
  it("normalizes the word field", () => {
    const key = getLocalWordLookupKey({ word: "LUCID" });
    expect(key).toBe(normalized("LUCID"));
  });

  it("handles already-lowercase words", () => {
    const key = getLocalWordLookupKey({ word: "lucid" });
    expect(key).toBe(normalized("lucid"));
  });

  it("trims whitespace", () => {
    const key = getLocalWordLookupKey({ word: "  oblique  " });
    expect(key).toBe(normalized("  oblique  "));
  });
});

describe("normalizeRetrievalKind", () => {
  it("returns exact for known valid value when correct=true", () => {
    expect(normalizeRetrievalKind("exact", true)).toBe("exact");
    expect(normalizeRetrievalKind("assisted", true)).toBe("assisted");
    expect(normalizeRetrievalKind("approximate", true)).toBe("approximate");
    expect(normalizeRetrievalKind("created", true)).toBe("created");
  });

  it("returns failed for known valid value when correct=false", () => {
    expect(normalizeRetrievalKind("failed", false)).toBe("failed");
    expect(normalizeRetrievalKind("exact", false)).toBe("exact");
    expect(normalizeRetrievalKind("assisted", false)).toBe("assisted");
  });

  it("returns exact when value is unknown and correct=true", () => {
    expect(normalizeRetrievalKind("garbage", true)).toBe("exact");
    expect(normalizeRetrievalKind(null, true)).toBe("exact");
    expect(normalizeRetrievalKind(undefined, true)).toBe("exact");
    expect(normalizeRetrievalKind("", true)).toBe("exact");
  });

  it("returns failed when value is unknown and correct=false", () => {
    expect(normalizeRetrievalKind("garbage", false)).toBe("failed");
    expect(normalizeRetrievalKind(null, false)).toBe("failed");
    expect(normalizeRetrievalKind(undefined, false)).toBe("failed");
    expect(normalizeRetrievalKind("", false)).toBe("failed");
  });
});

describe("normalizeContextPromptKind", () => {
  it("returns valid kinds as-is", () => {
    expect(normalizeContextPromptKind("replace")).toBe("replace");
    expect(normalizeContextPromptKind("produce")).toBe("produce");
    expect(normalizeContextPromptKind("rewrite")).toBe("rewrite");
  });

  it("returns undefined for unknown kinds", () => {
    expect(normalizeContextPromptKind("transfer")).toBeUndefined();
    expect(normalizeContextPromptKind("fill")).toBeUndefined();
    expect(normalizeContextPromptKind("context")).toBeUndefined();
  });

  it("returns undefined for null and undefined", () => {
    expect(normalizeContextPromptKind(null)).toBeUndefined();
    expect(normalizeContextPromptKind(undefined)).toBeUndefined();
    expect(normalizeContextPromptKind("")).toBeUndefined();
  });
});

describe("compareDateOnly", () => {
  it("returns 0 for equal dates", () => {
    expect(compareDateOnly("2026-04-11", "2026-04-11")).toBe(0);
  });

  it("returns negative when a is before b", () => {
    expect(compareDateOnly("2026-04-10", "2026-04-11")).toBeLessThan(0);
  });

  it("returns positive when a is after b", () => {
    expect(compareDateOnly("2026-04-12", "2026-04-11")).toBeGreaterThan(0);
  });

  it("handles ISO timestamps correctly", () => {
    expect(compareDateOnly("2026-04-11T08:00:00.000Z", "2026-04-11T09:00:00.000Z")).toBeLessThan(0);
  });

  it("returns -1 when only a is null", () => {
    expect(compareDateOnly(null, "2026-04-11")).toBe(-1);
  });

  it("returns 1 when only b is null", () => {
    expect(compareDateOnly("2026-04-11", null)).toBe(1);
  });

  it("returns 0 when both are null", () => {
    expect(compareDateOnly(null, null)).toBe(0);
  });

  it("returns -1 when only a is undefined", () => {
    expect(compareDateOnly(undefined, "2026-04-11")).toBe(-1);
  });

  it("returns 1 when only b is undefined", () => {
    expect(compareDateOnly("2026-04-11", undefined)).toBe(1);
  });
});

describe("normalizeTextArray", () => {
  it("returns array as-is when all items are non-empty strings", () => {
    expect(normalizeTextArray(["hello", "world"])).toEqual(["hello", "world"]);
  });

  it("trims whitespace from items", () => {
    expect(normalizeTextArray(["  hello  ", " world "])).toEqual(["hello", "world"]);
  });

  it("filters out empty strings", () => {
    expect(normalizeTextArray(["hello", "", "world"])).toEqual(["hello", "world"]);
  });

  it("filters out null and undefined within the array", () => {
    expect(normalizeTextArray(["hello", null as unknown as string, "world"])).toEqual(["hello", "world"]);
    expect(normalizeTextArray(["hello", undefined as unknown as string])).toEqual(["hello"]);
  });

  it("filters out non-string items", () => {
    expect(normalizeTextArray(["hello", 42 as unknown as string, true as unknown as string, "world"])).toEqual(["hello", "world"]);
  });

  it("returns empty array when input is not an array", () => {
    expect(normalizeTextArray("hello")).toEqual([]);
    expect(normalizeTextArray(null)).toEqual([]);
    expect(normalizeTextArray(undefined)).toEqual([]);
    expect(normalizeTextArray({})).toEqual([]);
    expect(normalizeTextArray(123)).toEqual([]);
  });

  it("handles already-empty array", () => {
    expect(normalizeTextArray([])).toEqual([]);
  });

  it("does NOT deduplicate actual string duplicates — Set deduplicates blank strings, not all values", () => {
    // normalizeTextArray preserves order but deduplicates empty strings via filter(Boolean)
    // Actual duplicates are preserved — deduplication is in mergeUniqueStrings, not here
    expect(normalizeTextArray(["hello", "hello", "world"])).toEqual(["hello", "hello", "world"]);
  });
});

describe("mergeUniqueStrings", () => {
  it("merges two arrays with no overlap", () => {
    expect(mergeUniqueStrings(["a", "b"], ["c", "d"])).toEqual(["a", "b", "c", "d"]);
  });

  it("deduplicates across groups", () => {
    expect(mergeUniqueStrings(["a", "b"], ["b", "c"])).toEqual(["a", "b", "c"]);
  });

  it("handles empty groups", () => {
    expect(mergeUniqueStrings([], [])).toEqual([]);
    expect(mergeUniqueStrings(["a"], [])).toEqual(["a"]);
    expect(mergeUniqueStrings([], ["b"])).toEqual(["b"]);
  });

  it("trims items and filters blanks", () => {
    expect(mergeUniqueStrings(["  hello  ", "  "], ["world"])).toEqual(["hello", "world"]);
  });

  it("handles three or more groups", () => {
    expect(mergeUniqueStrings(["a"], ["b"], ["c"])).toEqual(["a", "b", "c"]);
  });

  it("returns array (not Set) for compatibility with spread usage", () => {
    const result = mergeUniqueStrings(["a"], ["b"]);
    expect(Array.isArray(result)).toBe(true);
  });
});
