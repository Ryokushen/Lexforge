import {
  getPipelineStageLabel,
  getPipelineSummary,
} from "@/lib/pipeline-stage";
import {
  getPracticeLaneRoute,
  type PracticeLane,
} from "@/lib/practice-lanes";
import type { PipelineStage, ReviewLog, Word } from "@/lib/types";
import type {
  VocabularyItem,
  VocabularyItemCoverage,
} from "@/lib/vocabulary-item";

export type RecentRetrievalMetrics = {
  cleanRate: number | null;
  cueUseRate: number | null;
  retrievalLogCount: number;
};

const STATS_TILE_STAGES: PipelineStage[] = [
  "captured",
  "learning",
  "reviewing",
  "productive",
  "mature",
];

const COVERAGE_LANE_ORDER: PracticeLane[] = [
  "retrieval",
  "context",
  "association",
  "collocation",
];

const COVERAGE_LANE_LABELS: Record<PracticeLane, string> = {
  retrieval: "Recall",
  context: "Context",
  association: "Association",
  collocation: "Collocation",
};

export type TrainingCoverageLaneTransparency = {
  lane: PracticeLane;
  label: string;
  practicedCount: number;
  missingCount: number;
  eligibleCount: number;
  coveragePercent: number | null;
  automaticFillCount: number;
};

export type TrainingCoverageTransparency = {
  summary: {
    eligibleCount: number;
    blockedCount: number;
    fullyCoveredCount: number;
    automaticFillCount: number;
  };
  engineCopy: string;
  lanes: TrainingCoverageLaneTransparency[];
};

export function getRecentRetrievalMetrics(logs: ReviewLog[]): RecentRetrievalMetrics {
  const retrievalLogs = logs.filter(
    (log) =>
      log.contextPromptKind !== "produce" &&
      log.contextPromptKind !== "rewrite" &&
      log.contextPromptKind !== "collocation",
  );

  if (retrievalLogs.length === 0) {
    return {
      cleanRate: null,
      cueUseRate: null,
      retrievalLogCount: 0,
    };
  }

  const cueUses = retrievalLogs.filter((log) => (log.cueLevel ?? 0) > 0).length;
  const cleanRetrievals = retrievalLogs.filter((log) => {
    const retrievalKind = log.retrievalKind ?? (log.correct ? "exact" : "failed");
    return retrievalKind === "exact" && (log.cueLevel ?? 0) === 0;
  }).length;

  return {
    cleanRate: Math.round((cleanRetrievals / retrievalLogs.length) * 100),
    cueUseRate: Math.round((cueUses / retrievalLogs.length) * 100),
    retrievalLogCount: retrievalLogs.length,
  };
}

export function getPipelineStats(words: Word[]) {
  const summary = getPipelineSummary(words);

  return {
    summary,
    tiles: STATS_TILE_STAGES.map((stage) => ({
      stage,
      label: getPipelineStageLabel(stage),
      value: summary.counts[stage],
    })),
  };
}

function isLanePracticed(
  coverage: VocabularyItemCoverage,
  lane: PracticeLane,
): boolean {
  return coverage[lane] === "practiced";
}

function isFullyCovered(item: VocabularyItem): boolean {
  return COVERAGE_LANE_ORDER.every((lane) => isLanePracticed(item.coverage, lane));
}

export function getTrainingCoverageTransparency(
  items: VocabularyItem[],
): TrainingCoverageTransparency {
  const eligibleItems = items.filter((item) => item.trainingEligible);
  const automaticFillCounts: Record<PracticeLane, number> = {
    retrieval: 0,
    context: 0,
    association: 0,
    collocation: 0,
  };

  for (const item of eligibleItems) {
    const route = getPracticeLaneRoute(item);
    if (route.lane && route.reason.startsWith("missing-")) {
      automaticFillCounts[route.lane] += 1;
    }
  }

  const lanes = COVERAGE_LANE_ORDER.map((lane) => {
    const practicedCount = eligibleItems.filter((item) =>
      isLanePracticed(item.coverage, lane),
    ).length;
    const missingCount = eligibleItems.length - practicedCount;

    return {
      lane,
      label: COVERAGE_LANE_LABELS[lane],
      practicedCount,
      missingCount,
      eligibleCount: eligibleItems.length,
      coveragePercent:
        eligibleItems.length > 0
          ? Math.round((practicedCount / eligibleItems.length) * 100)
          : null,
      automaticFillCount: automaticFillCounts[lane],
    };
  });

  const automaticFillCount = lanes.reduce(
    (total, lane) => total + lane.automaticFillCount,
    0,
  );

  return {
    summary: {
      eligibleCount: eligibleItems.length,
      blockedCount: items.length - eligibleItems.length,
      fullyCoveredCount: eligibleItems.filter(isFullyCovered).length,
      automaticFillCount,
    },
    engineCopy:
      "FSRS due reviews stay first; when a session has room for new or support work, Lexforge uses these coverage gaps to pick compatible prompts automatically.",
    lanes,
  };
}
