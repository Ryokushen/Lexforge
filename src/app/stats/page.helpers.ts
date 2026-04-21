import type { ReviewLog } from "@/lib/types";

export type RecentRetrievalMetrics = {
  cleanRate: number | null;
  cueUseRate: number | null;
  retrievalLogCount: number;
};

export function getRecentRetrievalMetrics(logs: ReviewLog[]): RecentRetrievalMetrics {
  const retrievalLogs = logs.filter(
    (log) => log.contextPromptKind !== "produce" && log.contextPromptKind !== "rewrite",
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
