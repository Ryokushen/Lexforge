import { writeFile } from "node:fs/promises";
import {
  buildCanonicalCurriculum,
  renderCanonicalCurriculumSummaryMarkdown,
  serializeCanonicalCurriculumCsv,
} from "./curriculum-ranking.mjs";

const CSV_OUTPUT_PATH = new URL("../docs/seed-curriculum-ranking.csv", import.meta.url);
const SUMMARY_OUTPUT_PATH = new URL("../docs/seed-curriculum-summary.md", import.meta.url);

const result = await buildCanonicalCurriculum();

await Promise.all([
  writeFile(CSV_OUTPUT_PATH, `${serializeCanonicalCurriculumCsv(result.rows)}\n`, "utf8"),
  writeFile(
    SUMMARY_OUTPUT_PATH,
    `${renderCanonicalCurriculumSummaryMarkdown(result)}\n`,
    "utf8",
  ),
]);

console.log(`Wrote ${CSV_OUTPUT_PATH.pathname}`);
console.log(`Wrote ${SUMMARY_OUTPUT_PATH.pathname}`);
console.log(
  `unique=${result.summary.uniqueCount} target=${result.summary.targetWordCount} gap=${result.summary.gapToTarget} overlaps=${result.summary.overlapCount}`,
);
if (result.summary.gapToTarget > 0) {
  console.warn("Warning: source inputs do not yet provide a full 700 unique words.");
}
