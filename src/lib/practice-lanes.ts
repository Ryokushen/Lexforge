import type { VocabularyItem } from "./vocabulary-item";

export type PracticeLane = "retrieval" | "context" | "association" | "collocation";
export type PracticeLaneRouteReason =
  | "missing-retrieval"
  | "missing-context"
  | "missing-association"
  | "missing-collocation"
  | "maintenance"
  | "not-training-eligible";

export type PracticeLaneRoute = {
  itemId: VocabularyItem["id"];
  lane: PracticeLane | null;
  reason: PracticeLaneRouteReason;
};

export type PracticeLaneRouteSummary = Record<PracticeLane, number> & {
  blocked: number;
};

export function getRecommendedPracticeLane(item: VocabularyItem): PracticeLane | null {
  return getPracticeLaneRoute(item).lane;
}

export function getPracticeLaneRoute(item: VocabularyItem): PracticeLaneRoute {
  if (!item.trainingEligible) {
    return {
      itemId: item.id,
      lane: null,
      reason: "not-training-eligible",
    };
  }

  if (item.coverage.retrieval === "unknown") {
    return { itemId: item.id, lane: "retrieval", reason: "missing-retrieval" };
  }
  if (item.coverage.context === "unknown") {
    return { itemId: item.id, lane: "context", reason: "missing-context" };
  }
  if (item.coverage.association === "unknown") {
    return { itemId: item.id, lane: "association", reason: "missing-association" };
  }
  if (item.coverage.collocation === "unknown") {
    return { itemId: item.id, lane: "collocation", reason: "missing-collocation" };
  }

  return { itemId: item.id, lane: "retrieval", reason: "maintenance" };
}

export function routeVocabularyPracticeLanes(
  items: VocabularyItem[],
): PracticeLaneRoute[] {
  return items.map(getPracticeLaneRoute);
}

export function summarizePracticeLaneRoutes(
  routes: PracticeLaneRoute[],
): PracticeLaneRouteSummary {
  const summary: PracticeLaneRouteSummary = {
    retrieval: 0,
    context: 0,
    association: 0,
    collocation: 0,
    blocked: 0,
  };

  for (const route of routes) {
    if (route.lane) {
      summary[route.lane] += 1;
    } else {
      summary.blocked += 1;
    }
  }

  return summary;
}
