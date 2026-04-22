import { describe, expect, it } from "vitest";
import {
  DEFAULT_PHASE_THRESHOLDS,
  assignCanonicalPhase,
  buildCanonicalCurriculum,
  mergeCurriculumInputs,
  renderCanonicalCurriculumSummaryMarkdown,
  serializeCanonicalCurriculumCsv,
} from "./curriculum-ranking.mjs";

describe("curriculum ranking helpers", () => {
  it("assigns canonical phases using the agreed zipf thresholds", () => {
    expect(assignCanonicalPhase(4.2, DEFAULT_PHASE_THRESHOLDS)).toBe(1);
    expect(assignCanonicalPhase(3.85, DEFAULT_PHASE_THRESHOLDS)).toBe(2);
    expect(assignCanonicalPhase(3.2, DEFAULT_PHASE_THRESHOLDS)).toBe(2);
    expect(assignCanonicalPhase(3.19, DEFAULT_PHASE_THRESHOLDS)).toBe(3);
    expect(assignCanonicalPhase(2.47, DEFAULT_PHASE_THRESHOLDS)).toBe(3);
    expect(assignCanonicalPhase(2.45, DEFAULT_PHASE_THRESHOLDS)).toBe(4);
  });

  it("deduplicates overlapping candidate rows while preferring seeded rows", () => {
    const currentRows = [
      {
        word: "framework",
        zipfFrequency: 4.1,
        source: "current",
        currentTier: 1,
      },
      {
        word: "lucid",
        zipfFrequency: 3.2,
        source: "current",
        currentTier: 2,
      },
    ];
    const additionRows = [
      {
        word: "framework",
        zipfFrequency: 4.1,
        source: "addition",
        suggestedCurrentTier: 1,
      },
      {
        word: "durable",
        zipfFrequency: 3.6,
        source: "addition",
        suggestedCurrentTier: 2,
      },
    ];

    const result = mergeCurriculumInputs({ currentRows, additionRows, targetWordCount: 4 });

    expect(result.overlaps).toEqual(["framework"]);
    expect(result.summary.currentCount).toBe(2);
    expect(result.summary.additionCount).toBe(2);
    expect(result.summary.uniqueCount).toBe(3);
    expect(result.summary.gapToTarget).toBe(1);
    expect(result.rows.map((row) => row.word)).toEqual(["framework", "durable", "lucid"]);
    expect(result.rows[0]).toMatchObject({
      word: "framework",
      source: "current",
      currentTier: 1,
      canonicalPhase: 1,
      rank: 1,
    });
  });

  it("builds the current corpus regression from the shipped ranking inputs", async () => {
    const result = await buildCanonicalCurriculum();

    expect(result.summary.currentCount).toBe(531);
    expect(result.summary.additionCount).toBe(169);
    expect(result.summary.uniqueCount).toBe(700);
    expect(result.summary.targetWordCount).toBe(700);
    expect(result.summary.gapToTarget).toBe(0);
    expect(result.summary.overlapCount).toBe(0);
    expect(result.summary.phaseCounts).toEqual({
      1: 235,
      2: 240,
      3: 156,
      4: 69,
    });
    expect(result.rows).toHaveLength(700);
    expect(result.rows[0]).toMatchObject({
      rank: 1,
      word: "potential",
      source: "current",
      canonicalPhase: 1,
    });
    expect(result.rows.at(-1)).toMatchObject({
      rank: 700,
      word: "inefficacious",
      source: "current",
      canonicalPhase: 4,
    });
    expect(result.overlaps).toEqual([]);
  });

  it("serializes the canonical curriculum rows as csv", () => {
    const csv = serializeCanonicalCurriculumCsv([
      {
        rank: 1,
        word: "framework",
        zipfFrequency: 4.1,
        source: "current",
        currentTier: 1,
        currentRecommendedPhase3: 1,
        currentRecommendedPhase4: 1,
        suggestedCurrentTier: undefined,
        selectionBucket: undefined,
        canonicalPhase: 1,
      },
    ]);

    expect(csv).toContain(
      "rank,word,zipf_frequency,source,current_tier,current_recommended_phase_3,current_recommended_phase_4,suggested_current_tier,selection_bucket,canonical_phase",
    );
    expect(csv).toContain("1,framework,4.1,current,1,1,1,,,1");
  });

  it("renders a readable markdown summary", () => {
    const markdown = renderCanonicalCurriculumSummaryMarkdown({
      summary: {
        currentCount: 531,
        additionCount: 169,
        uniqueCount: 665,
        targetWordCount: 700,
        gapToTarget: 35,
        overlapCount: 35,
        phaseCounts: { 1: 207, 2: 233, 3: 156, 4: 69 },
      },
      overlaps: ["framework", "robust"],
    });

    expect(markdown).toContain("Unique combined words: `665`");
    expect(markdown).toContain("Gap to target: `35`");
    expect(markdown).toContain("- `framework`");
    expect(markdown).toContain("- `robust`");
  });
});
