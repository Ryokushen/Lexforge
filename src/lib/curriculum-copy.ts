import type { SeedTier, WordTier } from "./types";

type CurriculumTierKey = WordTier | `${SeedTier}`;

export const SEEDED_PHASE_INFO: Record<SeedTier, { label: string; numeral: string; color: string }> = {
  1: { label: "Core Articulation", numeral: "I", color: "var(--sage)" },
  2: { label: "Precision Vocabulary", numeral: "II", color: "var(--lapis)" },
  3: { label: "Power Words", numeral: "III", color: "var(--crimson)" },
  4: { label: "Rarefied Lexicon", numeral: "IV", color: "var(--ember)" },
};

export const CUSTOM_CURRICULUM_INFO = {
  label: "Custom",
  numeral: "★",
  color: "var(--ember)",
} as const;

export function getCurriculumBadgeLabel(tier: CurriculumTierKey): string {
  if (tier === "custom") {
    return CUSTOM_CURRICULUM_INFO.label;
  }

  const normalizedTier = typeof tier === "string" ? (Number(tier) as SeedTier) : tier;
  return `Phase ${SEEDED_PHASE_INFO[normalizedTier].numeral}`;
}

export function getLexiconSummary(totalWords: number, customWordCount: number): string {
  const totalLabel = `${totalWords} word${totalWords === 1 ? "" : "s"} gathered`;

  if (customWordCount <= 0) {
    return `${totalLabel} across four seeded phases.`;
  }

  return `${totalLabel} across four seeded phases and ${customWordCount} custom addition${customWordCount === 1 ? "" : "s"}.`;
}
