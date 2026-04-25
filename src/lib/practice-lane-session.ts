import { getContextSentence } from "./session-engine";
import type { GameMode, SessionWord } from "./types";

export function getSessionPracticeRoute(
  sessionWord: SessionWord,
): NonNullable<SessionWord["practiceLaneRoute"]> | null {
  const route = sessionWord.practiceLaneRoute;
  if (!route || route.itemId !== sessionWord.word.id) {
    return null;
  }

  return route;
}

export function getForcedSessionModeForPracticeLane(
  sessionWord: SessionWord,
): GameMode | null {
  const route = getSessionPracticeRoute(sessionWord);
  if (!route?.lane) {
    return null;
  }

  if (route.lane === "retrieval") {
    return "recall";
  }

  if (route.lane === "association") {
    return "association";
  }

  if (route.lane === "context" || route.lane === "collocation") {
    return getContextSentence(sessionWord.word) ? "context" : null;
  }

  return null;
}
