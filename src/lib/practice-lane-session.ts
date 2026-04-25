import { CONTEXT_SENTENCES } from "./context-sentences";
import type { GameMode, SessionWord } from "./types";

function hasContextPromptSource(sessionWord: SessionWord): boolean {
  const word = sessionWord.word;
  return Boolean(
    (word.contextSentences && word.contextSentences.length > 0)
      || CONTEXT_SENTENCES[word.word]?.length,
  );
}

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
    return hasContextPromptSource(sessionWord) ? "context" : null;
  }

  return null;
}
