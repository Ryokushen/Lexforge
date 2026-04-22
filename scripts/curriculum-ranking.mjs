import { readFile } from "node:fs/promises";

export const DEFAULT_PHASE_THRESHOLDS = Object.freeze({
  phase1MinExclusive: 3.85,
  phase2MinExclusive: 3.19,
  phase3MinExclusive: 2.45,
});

const DEFAULT_CURRENT_RANKING_CSV_PATH = new URL("../docs/word-frequency-ranking.csv", import.meta.url);
const DEFAULT_ADDITION_CANDIDATES_CSV_PATH = new URL("../docs/word-addition-candidates.csv", import.meta.url);

function parsePlainCsv(text) {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const [headerLine, ...dataLines] = lines;
  const headers = headerLine.split(",");

  return dataLines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function parseInteger(value) {
  if (!value) return undefined;
  return Number.parseInt(value, 10);
}

function parseCurrentRankingRows(text) {
  return parsePlainCsv(text).map((row) => ({
    word: row.word,
    zipfFrequency: Number.parseFloat(row.zipf_frequency),
    source: "current",
    currentTier: parseInteger(row.current_tier),
    currentRecommendedPhase3: parseInteger(row.recommended_phase_3),
    currentRecommendedPhase4: parseInteger(row.recommended_phase_4),
  }));
}

function parseAdditionCandidateRows(text) {
  return parsePlainCsv(text).map((row) => ({
    word: row.word,
    zipfFrequency: Number.parseFloat(row.zipf_frequency),
    source: "addition",
    suggestedCurrentTier: parseInteger(row.suggested_current_tier),
    selectionBucket: row.selection_bucket,
  }));
}

export function assignCanonicalPhase(zipfFrequency, thresholds = DEFAULT_PHASE_THRESHOLDS) {
  if (zipfFrequency > thresholds.phase1MinExclusive) return 1;
  if (zipfFrequency > thresholds.phase2MinExclusive) return 2;
  if (zipfFrequency > thresholds.phase3MinExclusive) return 3;
  return 4;
}

function sortCanonicalRows(rows) {
  return [...rows].sort((left, right) => {
    if (right.zipfFrequency !== left.zipfFrequency) {
      return right.zipfFrequency - left.zipfFrequency;
    }

    return left.word.localeCompare(right.word);
  });
}

export function mergeCurriculumInputs({
  currentRows,
  additionRows,
  targetWordCount = 700,
  thresholds = DEFAULT_PHASE_THRESHOLDS,
}) {
  const rowsByWord = new Map();
  const overlaps = [];

  for (const row of currentRows) {
    rowsByWord.set(row.word, row);
  }

  for (const row of additionRows) {
    if (rowsByWord.has(row.word)) {
      overlaps.push(row.word);
      continue;
    }

    rowsByWord.set(row.word, row);
  }

  const rankedRows = sortCanonicalRows([...rowsByWord.values()]).map((row, index) => ({
    ...row,
    rank: index + 1,
    canonicalPhase: assignCanonicalPhase(row.zipfFrequency, thresholds),
  }));

  const phaseCounts = rankedRows.reduce(
    (counts, row) => ({
      ...counts,
      [row.canonicalPhase]: counts[row.canonicalPhase] + 1,
    }),
    { 1: 0, 2: 0, 3: 0, 4: 0 },
  );

  return {
    rows: rankedRows,
    overlaps: overlaps.sort((left, right) => left.localeCompare(right)),
    summary: {
      currentCount: currentRows.length,
      additionCount: additionRows.length,
      uniqueCount: rankedRows.length,
      targetWordCount,
      gapToTarget: Math.max(0, targetWordCount - rankedRows.length),
      overlapCount: overlaps.length,
      phaseCounts,
    },
  };
}

export function serializeCanonicalCurriculumCsv(rows) {
  const header = [
    "rank",
    "word",
    "zipf_frequency",
    "source",
    "current_tier",
    "current_recommended_phase_3",
    "current_recommended_phase_4",
    "suggested_current_tier",
    "selection_bucket",
    "canonical_phase",
  ];

  const lines = rows.map((row) => [
    row.rank,
    row.word,
    row.zipfFrequency,
    row.source,
    row.currentTier ?? "",
    row.currentRecommendedPhase3 ?? "",
    row.currentRecommendedPhase4 ?? "",
    row.suggestedCurrentTier ?? "",
    row.selectionBucket ?? "",
    row.canonicalPhase,
  ].join(","));

  return [header.join(","), ...lines].join("\n");
}

export function renderCanonicalCurriculumSummaryMarkdown({ summary, overlaps }) {
  const overlapLines = overlaps.length > 0
    ? overlaps.map((word) => `- \`${word}\``).join("\n")
    : "- None";

  return [
    "# Canonical Seed Curriculum Summary",
    "",
    `- Current ranking rows: \`${summary.currentCount}\``,
    `- Candidate addition rows: \`${summary.additionCount}\``,
    `- Unique combined words: \`${summary.uniqueCount}\``,
    `- Target word count: \`${summary.targetWordCount}\``,
    `- Gap to target: \`${summary.gapToTarget}\``,
    `- Overlap count: \`${summary.overlapCount}\``,
    `- Phase 1 count: \`${summary.phaseCounts[1]}\``,
    `- Phase 2 count: \`${summary.phaseCounts[2]}\``,
    `- Phase 3 count: \`${summary.phaseCounts[3]}\``,
    `- Phase 4 count: \`${summary.phaseCounts[4]}\``,
    "",
    "## Overlapping words",
    "",
    overlapLines,
  ].join("\n");
}

export async function buildCanonicalCurriculum({
  currentCsvPath = DEFAULT_CURRENT_RANKING_CSV_PATH,
  additionCsvPath = DEFAULT_ADDITION_CANDIDATES_CSV_PATH,
  targetWordCount = 700,
  thresholds = DEFAULT_PHASE_THRESHOLDS,
} = {}) {
  const [currentText, additionText] = await Promise.all([
    readFile(currentCsvPath, "utf8"),
    readFile(additionCsvPath, "utf8"),
  ]);

  return mergeCurriculumInputs({
    currentRows: parseCurrentRankingRows(currentText),
    additionRows: parseAdditionCandidateRows(additionText),
    targetWordCount,
    thresholds,
  });
}
