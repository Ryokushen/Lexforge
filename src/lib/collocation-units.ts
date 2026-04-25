import type { VocabularyItem } from "./vocabulary-item";

export type CollocationPracticeUnitSource = "context-sentence";

export type CollocationPracticeUnit = {
  id: string;
  itemId: VocabularyItem["id"];
  answer: string;
  weakWord: string;
  source: CollocationPracticeUnitSource;
  promptSentence: string;
  targetSentence: string;
};

export type CollocationPracticeUnitSummary = {
  total: number;
  itemCount: number;
};

function replaceFirstCaseInsensitive(
  sentence: string,
  weakWord: string,
  answer: string,
): string {
  const index = sentence.toLowerCase().indexOf(weakWord.toLowerCase());
  if (index < 0) return sentence;

  return `${sentence.slice(0, index)}${answer}${sentence.slice(index + weakWord.length)}`;
}

export function buildCollocationPracticeUnits(
  items: VocabularyItem[],
): CollocationPracticeUnit[] {
  return items.flatMap((item) =>
    item.contextSentences.map((contextSentence, index) => ({
      id: `${item.id}:collocation:${index}`,
      itemId: item.id,
      answer: contextSentence.answer,
      weakWord: contextSentence.weakWord,
      source: "context-sentence" as const,
      promptSentence: contextSentence.sentence,
      targetSentence: replaceFirstCaseInsensitive(
        contextSentence.sentence,
        contextSentence.weakWord,
        contextSentence.answer,
      ),
    })),
  );
}

export function summarizeCollocationPracticeUnits(
  units: CollocationPracticeUnit[],
): CollocationPracticeUnitSummary {
  return {
    total: units.length,
    itemCount: new Set(units.map((unit) => unit.itemId)).size,
  };
}
