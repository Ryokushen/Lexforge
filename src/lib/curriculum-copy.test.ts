import { describe, expect, it } from "vitest";
import {
  CUSTOM_CURRICULUM_INFO,
  SEEDED_PHASE_INFO,
  getCurriculumBadgeLabel,
  getLexiconSummary,
} from "./curriculum-copy";

describe("curriculum copy", () => {
  it("describes the four seeded phases with stable user-facing labels", () => {
    expect(SEEDED_PHASE_INFO[1]).toMatchObject({
      label: "Core Articulation",
      numeral: "I",
    });
    expect(SEEDED_PHASE_INFO[4]).toMatchObject({
      label: "Rarefied Lexicon",
      numeral: "IV",
    });
    expect(CUSTOM_CURRICULUM_INFO).toMatchObject({
      label: "Custom",
      numeral: "★",
    });
  });

  it("formats curriculum badges with phase language instead of legacy tier wording", () => {
    expect(getCurriculumBadgeLabel(1)).toBe("Phase I");
    expect(getCurriculumBadgeLabel(4)).toBe("Phase IV");
    expect(getCurriculumBadgeLabel("custom")).toBe("Custom");
  });

  it("summarizes the lexicon using four seeded phases and optional custom additions", () => {
    expect(getLexiconSummary(700, 0)).toBe(
      "700 words gathered across four seeded phases.",
    );
    expect(getLexiconSummary(703, 3)).toBe(
      "703 words gathered across four seeded phases and 3 custom additions.",
    );
    expect(getLexiconSummary(701, 1)).toBe(
      "701 words gathered across four seeded phases and 1 custom addition.",
    );
  });
});
