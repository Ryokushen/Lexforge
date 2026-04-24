# Vocabulary Pipeline Layer Implementation Plan

Status: implemented through the v1 app slice in `master`. This plan is retained as the execution record and implementation reference; do not treat the unchecked task boxes below as current backlog without first checking `PROJECT_STATUS.md`.

> **For implementation workers:** Execute this plan task-by-task. Use the checkbox (`- [ ]`) syntax for tracking, run the focused verification commands after each task, and commit each completed task separately.

**Goal:** Add a thin universal vocabulary lifecycle layer for all Lexforge words while preserving current FSRS scheduling, local-first storage, sync behavior, and session generation.

**Architecture:** Add optional pipeline metadata to `Word`, implement pure stage inference in `src/lib/pipeline-stage.ts`, persist stage advances from seeding/word creation/review completion, and surface stage distribution in the word library and stats page. Treat pipeline stage as a long-term acquisition milestone; do not use it to replace rescue/stabilize/fluent or FSRS due scheduling.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Dexie/IndexedDB, ts-fsrs, Vitest, existing shadcn/ui and RPG card components.

---

## File Structure

- Modify: `src/lib/types.ts`
  - Add `PipelineStage`.
  - Add optional `pipelineStage` and `pipelineUpdatedAt` fields to `Word`.
- Create: `src/lib/pipeline-stage.ts`
  - Pure stage inference, labels, descriptions, no-demotion helpers, and summary aggregation.
- Create: `src/lib/pipeline-stage.test.ts`
  - Unit tests for inference, no-demotion, labels, and summary aggregation.
- Modify: `src/lib/scheduler.ts`
  - Default manually added words to `queued` unless caller supplies a stage.
- Modify: `src/lib/seed.ts`
  - Backfill missing pipeline stages for existing words during bootstrap.
  - Seed new words as `queued`.
- Modify: `src/lib/seed.test.ts`
  - Test backfill and new seed pipeline fields.
- Modify: `src/lib/session-engine.ts`
  - After `processAnswer` logs a review, recompute stage for that word and persist only forward progress.
- Modify: `src/lib/session-engine.test.ts`
  - Add tests for review-driven pipeline advancement and FSRS behavior preservation.
- Modify: `src/app/words/page.tsx`
  - Show stage badge and explanation in word rows/details.
  - Create manual custom words as `queued`.
  - Create new TOT words as `captured`.
  - Do not demote existing productive/mature words when a new TOT is captured.
- Modify: `src/app/stats/page.helpers.ts`
  - Add pipeline summary aggregation if not fully handled in `src/lib/pipeline-stage.ts`.
- Modify: `src/app/stats/page.helpers.test.ts`
  - Test recognition-to-production conversion.
- Modify: `src/app/stats/page.tsx`
  - Load words and render pipeline summary.
- Modify: `README.md` and `PROJECT_STATUS.md`
  - Document the shipped pipeline layer after implementation.

## Local-Only Persistence Decision

Do not add Supabase columns or migrations in v1. `pipelineStage` can be recomputed from synced review logs, synced TOT capture summaries, and local word state. Adding cloud schema now would expand the blast radius into already-hardened sync behavior, which the project docs explicitly warn not to rebuild without a concrete failure.

---

### Task 1: Add Pipeline Types and Pure Inference Helper

**Files:**
- Modify: `src/lib/types.ts`
- Create: `src/lib/pipeline-stage.ts`
- Create: `src/lib/pipeline-stage.test.ts`

- [ ] **Step 1: Add failing tests for stage inference**

Create `src/lib/pipeline-stage.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { ReviewLog, Word } from "./types";
import {
  getPipelineStage,
  getPipelineStageDescription,
  getPipelineStageLabel,
  getPipelineSummary,
  shouldAdvancePipelineStage,
} from "./pipeline-stage";

function makeWord(overrides: Partial<Word> = {}): Word {
  return {
    id: 1,
    word: "lucid",
    definition: "clear and easy to understand",
    examples: ["A lucid explanation."],
    synonyms: [],
    tier: 1,
    createdAt: new Date("2026-04-01T00:00:00.000Z"),
    ...overrides,
  };
}

function makeLog(overrides: Partial<ReviewLog> = {}): ReviewLog {
  return {
    id: 1,
    wordId: 1,
    rating: 3,
    responseTimeMs: 1500,
    correct: true,
    cueLevel: 0,
    retrievalKind: "exact",
    reviewedAt: new Date("2026-04-10T12:00:00.000Z"),
    ...overrides,
  };
}

describe("pipeline stage inference", () => {
  it("classifies captured and queued words without reviews", () => {
    expect(
      getPipelineStage(
        makeWord({
          totCapture: {
            source: "speech",
            capturedAt: "2026-04-10T12:00:00.000Z",
            count: 1,
          },
        }),
        [],
      ),
    ).toBe("captured");

    expect(getPipelineStage(makeWord(), [])).toBe("queued");
  });

  it("classifies learning and reviewing from retrieval logs", () => {
    expect(
      getPipelineStage(makeWord(), [
        makeLog({
          rating: 1,
          correct: false,
          retrievalKind: "failed",
        }),
      ]),
    ).toBe("learning");

    expect(getPipelineStage(makeWord(), [makeLog()])).toBe("reviewing");
  });

  it("classifies contextualizing and productive context stages", () => {
    expect(
      getPipelineStage(makeWord(), [
        makeLog(),
        makeLog({
          id: 2,
          contextPromptKind: "replace",
          retrievalKind: "exact",
        }),
      ]),
    ).toBe("contextualizing");

    expect(
      getPipelineStage(makeWord(), [
        makeLog(),
        makeLog({
          id: 2,
          rating: 2,
          correct: true,
          retrievalKind: "assisted",
          contextPromptKind: "produce",
        }),
      ]),
    ).toBe("productive");
  });

  it("classifies mature only after repeated clean recall and successful production", () => {
    expect(
      getPipelineStage(makeWord(), [
        makeLog({ id: 1, reviewedAt: new Date("2026-04-10T12:00:00.000Z") }),
        makeLog({ id: 2, reviewedAt: new Date("2026-04-09T12:00:00.000Z") }),
        makeLog({ id: 3, reviewedAt: new Date("2026-04-08T12:00:00.000Z") }),
        makeLog({
          id: 4,
          rating: 2,
          correct: true,
          retrievalKind: "assisted",
          contextPromptKind: "rewrite",
          reviewedAt: new Date("2026-04-07T12:00:00.000Z"),
        }),
      ]),
    ).toBe("mature");
  });

  it("does not demote an already advanced stage", () => {
    expect(shouldAdvancePipelineStage("productive", "captured")).toBe(false);
    expect(shouldAdvancePipelineStage("reviewing", "productive")).toBe(true);
  });

  it("exposes stable labels and descriptions", () => {
    expect(getPipelineStageLabel("contextualizing")).toBe("Context");
    expect(getPipelineStageDescription("mature")).toBe(
      "Stable recall plus successful production history.",
    );
  });
});

describe("pipeline summary", () => {
  it("counts stages and computes recognition-to-production conversion", () => {
    const summary = getPipelineSummary([
      makeWord({ id: 1, pipelineStage: "captured" }),
      makeWord({ id: 2, pipelineStage: "reviewing" }),
      makeWord({ id: 3, pipelineStage: "productive" }),
      makeWord({ id: 4, pipelineStage: "mature" }),
    ]);

    expect(summary.counts).toMatchObject({
      captured: 1,
      reviewing: 1,
      productive: 1,
      mature: 1,
    });
    expect(summary.recognitionToProductionRate).toBe(67);
  });
});
```

- [ ] **Step 2: Run the new test to verify it fails**

Run:

```bash
npm run test -- src/lib/pipeline-stage.test.ts
```

Expected: FAIL because `src/lib/pipeline-stage.ts`, `PipelineStage`, and the exported helpers do not exist.

- [ ] **Step 3: Add pipeline type fields**

Modify `src/lib/types.ts` near the word types:

```ts
export type PipelineStage =
  | "captured"
  | "queued"
  | "learning"
  | "reviewing"
  | "contextualizing"
  | "productive"
  | "mature";

export interface Word {
  id?: number;
  word: string;
  definition: string;
  examples: string[];
  pronunciation?: string;
  tier: WordTier;
  synonyms: string[];
  association?: string;
  associationUpdatedAt?: string;
  contextSentences?: ContextSentence[];
  totCapture?: TOTCapture;
  pipelineStage?: PipelineStage;
  pipelineUpdatedAt?: string;
  createdAt: Date;
}
```

- [ ] **Step 4: Implement the pure helper**

Create `src/lib/pipeline-stage.ts`:

```ts
import type { PipelineStage, ReviewLog, Word } from "./types";

export const PIPELINE_STAGE_ORDER: PipelineStage[] = [
  "captured",
  "queued",
  "learning",
  "reviewing",
  "contextualizing",
  "productive",
  "mature",
];

export type PipelineSummary = {
  counts: Record<PipelineStage, number>;
  recognitionToProductionRate: number | null;
  reviewingOrLaterCount: number;
  productiveOrMatureCount: number;
};

const LABELS: Record<PipelineStage, string> = {
  captured: "Captured",
  queued: "Queued",
  learning: "Learning",
  reviewing: "Reviewing",
  contextualizing: "Context",
  productive: "Productive",
  mature: "Mature",
};

const DESCRIPTIONS: Record<PipelineStage, string> = {
  captured: "Saved from a real-world blanking moment; not yet stabilized.",
  queued: "Accepted into the lexicon but not reviewed yet.",
  learning: "Training has started; clean recall is not stable yet.",
  reviewing: "Clean recall exists and FSRS review is active.",
  contextualizing: "Ready for context and transfer practice.",
  productive: "Successfully used in a production-style prompt.",
  mature: "Stable recall plus successful production history.",
};

function stageRank(stage: PipelineStage): number {
  return PIPELINE_STAGE_ORDER.indexOf(stage);
}

function isCleanExactRecall(log: ReviewLog): boolean {
  return (
    log.correct
    && log.retrievalKind === "exact"
    && (log.cueLevel ?? 0) === 0
    && log.contextPromptKind !== "produce"
    && log.contextPromptKind !== "rewrite"
  );
}

function isSuccessfulProduction(log: ReviewLog): boolean {
  return (
    log.correct
    && (log.contextPromptKind === "produce" || log.contextPromptKind === "rewrite")
  );
}

function hasContextExposure(log: ReviewLog): boolean {
  return Boolean(log.contextPromptKind);
}

export function getPipelineStageLabel(stage: PipelineStage): string {
  return LABELS[stage];
}

export function getPipelineStageDescription(stage: PipelineStage): string {
  return DESCRIPTIONS[stage];
}

export function shouldAdvancePipelineStage(
  current: PipelineStage | undefined,
  next: PipelineStage,
): boolean {
  if (!current) return true;
  return stageRank(next) > stageRank(current);
}

export function maxPipelineStage(
  current: PipelineStage | undefined,
  next: PipelineStage,
): PipelineStage {
  if (!current) return next;
  return shouldAdvancePipelineStage(current, next) ? next : current;
}

export function getPipelineStage(word: Word, logs: ReviewLog[]): PipelineStage {
  const sortedLogs = [...logs].sort(
    (left, right) => left.reviewedAt.getTime() - right.reviewedAt.getTime(),
  );

  if (sortedLogs.length === 0) {
    return word.totCapture ? "captured" : "queued";
  }

  const cleanExactCount = sortedLogs.filter(isCleanExactRecall).length;
  const hasAnyCleanExact = cleanExactCount > 0;
  const hasAnyContext = sortedLogs.some(hasContextExposure);
  const hasProduction = sortedLogs.some(isSuccessfulProduction);

  let inferred: PipelineStage = hasAnyCleanExact ? "reviewing" : "learning";

  if (hasAnyContext) {
    inferred = maxPipelineStage(inferred, "contextualizing");
  }

  if (hasProduction) {
    inferred = maxPipelineStage(inferred, "productive");
  }

  if (cleanExactCount >= 3 && hasProduction) {
    inferred = "mature";
  }

  return maxPipelineStage(word.pipelineStage, inferred);
}

export function getPipelineSummary(words: Word[]): PipelineSummary {
  const counts: Record<PipelineStage, number> = {
    captured: 0,
    queued: 0,
    learning: 0,
    reviewing: 0,
    contextualizing: 0,
    productive: 0,
    mature: 0,
  };

  for (const word of words) {
    counts[word.pipelineStage ?? "queued"] += 1;
  }

  const reviewingOrLaterCount =
    counts.reviewing + counts.contextualizing + counts.productive + counts.mature;
  const productiveOrMatureCount = counts.productive + counts.mature;

  return {
    counts,
    reviewingOrLaterCount,
    productiveOrMatureCount,
    recognitionToProductionRate:
      reviewingOrLaterCount > 0
        ? Math.round((productiveOrMatureCount / reviewingOrLaterCount) * 100)
        : null,
  };
}
```

- [ ] **Step 5: Run the helper tests**

Run:

```bash
npm run test -- src/lib/pipeline-stage.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/types.ts src/lib/pipeline-stage.ts src/lib/pipeline-stage.test.ts
git commit -m "feat: add vocabulary pipeline stage helper"
```

---

### Task 2: Persist Pipeline Stage on Seeding and Word Creation

**Files:**
- Modify: `src/lib/scheduler.ts`
- Modify: `src/lib/seed.ts`
- Modify: `src/lib/seed.test.ts`

- [ ] **Step 1: Add failing seed tests**

Modify `src/lib/seed.test.ts` mock and add tests.

Change the mock at the top:

```ts
const dbMock = vi.hoisted(() => ({
  words: {
    toArray: vi.fn(),
    update: vi.fn(),
  },
  reviewLogs: {
    toArray: vi.fn(),
  },
}));
```

In `beforeEach`, add:

```ts
dbMock.reviewLogs.toArray.mockResolvedValue([]);
```

Update existing `seedDatabase` tests that are not specifically testing backfill so their `makeExistingWord(...)` fixtures include `pipelineStage: "queued"`. This preserves the existing `dbMock.words.update` expectations while keeping the new backfill tests focused on missing pipeline metadata.

Add this test:

```ts
it("adds queued pipeline metadata to new seed words", async () => {
  dbMock.words.toArray.mockResolvedValue([
    makeExistingWord("lucid"),
    makeExistingWord("recondite", { id: 13, tier: 4 }),
  ]);

  await seedDatabase();

  expect(addWordWithCardMock).toHaveBeenCalledWith(
    expect.objectContaining({
      word: "tenuous",
      tier: 2,
      pipelineStage: "queued",
      pipelineUpdatedAt: expect.any(String),
    }),
  );
});
```

Add this test:

```ts
it("backfills missing pipeline stage for existing words without changing existing stages", async () => {
  dbMock.words.toArray.mockResolvedValue([
    makeExistingWord("lucid", { id: 11, pipelineStage: undefined }),
    makeExistingWord("tenuous", { id: 12, tier: 2, pipelineStage: "productive" }),
    makeExistingWord("recondite", {
      id: 13,
      tier: 4,
      totCapture: {
        source: "speech",
        capturedAt: "2026-04-10T12:00:00.000Z",
        count: 1,
      },
    }),
  ]);

  await seedDatabase();

  expect(dbMock.words.update).toHaveBeenCalledWith(11, {
    pipelineStage: "queued",
    pipelineUpdatedAt: expect.any(String),
  });
  expect(dbMock.words.update).toHaveBeenCalledWith(13, {
    pipelineStage: "captured",
    pipelineUpdatedAt: expect.any(String),
  });
  expect(dbMock.words.update).not.toHaveBeenCalledWith(
    12,
    expect.objectContaining({ pipelineStage: expect.any(String) }),
  );
});
```

- [ ] **Step 2: Run seed tests to verify failure**

Run:

```bash
npm run test -- src/lib/seed.test.ts
```

Expected: FAIL because `seedDatabase` does not read review logs or write pipeline metadata.

- [ ] **Step 3: Default new words to queued in scheduler**

Modify `src/lib/scheduler.ts` in `addWordWithCard` transaction:

```ts
const wordToSave: Word = {
  ...word,
  pipelineStage: word.pipelineStage ?? "queued",
  pipelineUpdatedAt: word.pipelineUpdatedAt ?? new Date().toISOString(),
} as Word;
const wordId = (await db.words.add(wordToSave)) as number;
savedWord = { ...wordToSave, id: wordId } as Word;
```

Keep the review card creation unchanged.

- [ ] **Step 4: Backfill existing words in seedDatabase**

Modify `src/lib/seed.ts` imports:

```ts
import { getPipelineStage } from "./pipeline-stage";
```

Load logs after existing words:

```ts
const reviewLogs = await db.reviewLogs.toArray();
const logsByWord = new Map<number, typeof reviewLogs>();
for (const log of reviewLogs) {
  const current = logsByWord.get(log.wordId) ?? [];
  current.push(log);
  logsByWord.set(log.wordId, current);
}
```

Inside the existing-word loop, after tier reconciliation logic, add:

```ts
if (!local.pipelineStage) {
  const inferred = getPipelineStage(local, logsByWord.get(local.id) ?? []);
  await db.words.update(local.id, {
    pipelineStage: inferred,
    pipelineUpdatedAt: new Date().toISOString(),
  });
}
```

When adding a missing seed, include:

```ts
pipelineStage: "queued",
pipelineUpdatedAt: new Date().toISOString(),
```

- [ ] **Step 5: Run seed tests**

Run:

```bash
npm run test -- src/lib/seed.test.ts
```

Expected: PASS.

- [ ] **Step 6: Run scheduler-related tests**

Run:

```bash
npm run test -- src/lib/seed.test.ts src/lib/scheduler.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/scheduler.ts src/lib/seed.ts src/lib/seed.test.ts
git commit -m "feat: backfill vocabulary pipeline stages"
```

---

### Task 3: Advance Pipeline Stage After Reviews

**Files:**
- Modify: `src/lib/session-engine.ts`
- Modify: `src/lib/session-engine.test.ts`

- [ ] **Step 1: Add failing processAnswer tests**

Modify the `dbMock` in `src/lib/session-engine.test.ts`:

```ts
const dbMock = vi.hoisted(() => ({
  reviewLogs: {
    add: vi.fn(),
    toArray: vi.fn(),
    where: vi.fn(),
  },
  words: {
    get: vi.fn(),
    update: vi.fn(),
  },
}));
```

Add this helper near other helpers:

```ts
function mockWordLogs(logs: ReviewLog[]) {
  dbMock.reviewLogs.where.mockReturnValue({
    equals: vi.fn().mockReturnValue({
      toArray: vi.fn().mockResolvedValue(logs),
    }),
  });
}
```

In `beforeEach`, add:

```ts
dbMock.words.update.mockResolvedValue(1);
mockWordLogs([]);
```

Add this test near existing `processAnswer` tests:

```ts
it("advances pipeline stage after a clean recall without changing FSRS grading", async () => {
  const sessionWord: SessionWord = {
    ...makeSessionWord(1),
    word: {
      ...makeWord(1),
      pipelineStage: "learning",
    },
  };
  const updatedCard = makeReviewCard(1);
  schedulerMock.gradeCard.mockResolvedValue(updatedCard);
  mockWordLogs([makeReviewLog(1, "2026-04-10T11:45:00.000Z")]);

  await processAnswer(
    sessionWord,
    "word-1",
    1600,
    "session-1",
    "recall",
  );

  expect(schedulerMock.gradeCard).toHaveBeenCalledWith(sessionWord.reviewCard, 3);
  expect(dbMock.words.update).toHaveBeenCalledWith(1, {
    pipelineStage: "reviewing",
    pipelineUpdatedAt: expect.any(String),
  });
});
```

Add this test:

```ts
it("advances pipeline stage after successful production context without demoting mature words", async () => {
  const sessionWord: SessionWord = {
    ...makeSessionWord(1),
    word: {
      ...makeWord(1),
      word: "meticulous",
      pipelineStage: "mature",
    },
  };
  schedulerMock.gradeCard.mockResolvedValue(sessionWord.reviewCard);
  mockWordLogs([
    makeReviewLog(1, "2026-04-10T11:45:00.000Z", {
      contextPromptKind: "produce",
      retrievalKind: "assisted",
      rating: 2,
      correct: true,
    }),
  ]);

  await processAnswer(
    sessionWord,
    "The inspector was meticulous during the final review.",
    2200,
    "session-1",
    "context",
    "meticulous",
    { contextPromptKind: "produce" },
  );

  expect(dbMock.words.update).not.toHaveBeenCalledWith(
    1,
    expect.objectContaining({ pipelineStage: "productive" }),
  );
});
```

- [ ] **Step 2: Run session-engine tests to verify failure**

Run:

```bash
npm run test -- src/lib/session-engine.test.ts
```

Expected: FAIL because `processAnswer` does not update word pipeline stage.

- [ ] **Step 3: Implement stage advance in processAnswer**

Modify imports in `src/lib/session-engine.ts`:

```ts
import {
  getPipelineStage,
  shouldAdvancePipelineStage,
} from "./pipeline-stage";
```

After `await db.reviewLogs.add(log);`, add:

```ts
const wordLogs = await db.reviewLogs
  .where("wordId")
  .equals(sessionWord.word.id!)
  .toArray();
const nextPipelineStage = getPipelineStage(sessionWord.word, wordLogs);
if (shouldAdvancePipelineStage(sessionWord.word.pipelineStage, nextPipelineStage)) {
  await db.words.update(sessionWord.word.id!, {
    pipelineStage: nextPipelineStage,
    pipelineUpdatedAt: new Date().toISOString(),
  });
}
```

Do not change the `gradeCard` call, `ReviewLog` shape, or `SessionResult` shape.

- [ ] **Step 4: Run focused tests**

Run:

```bash
npm run test -- src/lib/pipeline-stage.test.ts src/lib/session-engine.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/session-engine.ts src/lib/session-engine.test.ts
git commit -m "feat: advance pipeline stage after reviews"
```

---

### Task 4: Show Pipeline Stage in Word Library

**Files:**
- Modify: `src/app/words/page.tsx`
- Modify: `src/app/words/page.helpers.test.ts`
- Optionally modify: `src/app/words/page.helpers.ts`

- [ ] **Step 1: Add helper tests for stage display copy if needed**

If the implementation needs a page-specific helper, add to `src/app/words/page.helpers.test.ts`:

```ts
import {
  getPipelineStageDescription,
  getPipelineStageLabel,
} from "@/lib/pipeline-stage";

it("uses concise pipeline labels for word-library badges", () => {
  expect(getPipelineStageLabel("captured")).toBe("Captured");
  expect(getPipelineStageLabel("contextualizing")).toBe("Context");
  expect(getPipelineStageDescription("productive")).toBe(
    "Successfully used in a production-style prompt.",
  );
});
```

Run:

```bash
npm run test -- src/app/words/page.helpers.test.ts
```

Expected: PASS if Task 1 is complete.

- [ ] **Step 2: Import stage helpers in words page**

Modify `src/app/words/page.tsx` imports:

```ts
import {
  getPipelineStageDescription,
  getPipelineStageLabel,
} from "@/lib/pipeline-stage";
```

- [ ] **Step 3: Add stage badge to `WordRow`**

Inside `WordRow`, add:

```ts
const pipelineStage = word.pipelineStage ?? (word.totCapture ? "captured" : "queued");
```

Add this badge next to the existing phase/TOT badges:

```tsx
<span className="lex-badge shrink-0" style={tierBadgeStyle("var(--lapis)")}>
  {getPipelineStageLabel(pipelineStage)}
</span>
```

In expanded details, add this block after synonyms and before the TOT capture block:

```tsx
<div
  className="space-y-1 rounded-[var(--radius)] p-3"
  style={{
    background: "color-mix(in oklab, var(--lapis), transparent 94%)",
    border: "1px solid color-mix(in oklab, var(--lapis), transparent 72%)",
  }}
>
  <p
    className="uppercase-tracked text-[10px]"
    style={{ color: "var(--lapis)" }}
  >
    Pipeline Stage
  </p>
  <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
    <span style={{ color: "var(--ink)" }}>
      {getPipelineStageLabel(pipelineStage)}:
    </span>{" "}
    {getPipelineStageDescription(pipelineStage)}
  </p>
</div>
```

- [ ] **Step 4: Set pipeline stage on word creation**

In `handleAdd`, add fields to `addWordWithCard`:

```ts
pipelineStage: "queued",
pipelineUpdatedAt: new Date().toISOString(),
```

In existing-word TOT update, compute next stage without demotion:

```ts
const existingStage = existingTOTWord.pipelineStage;
const nextStage = existingStage && existingStage !== "queued"
  ? existingStage
  : "captured";
```

Add to `db.words.update(existingTOTWord.id, { ... })`:

```ts
pipelineStage: nextStage,
pipelineUpdatedAt: capturedAt,
```

In new TOT custom word creation, add:

```ts
pipelineStage: "captured",
pipelineUpdatedAt: capturedAt,
```

- [ ] **Step 5: Run focused tests**

Run:

```bash
npm run test -- src/app/words/page.helpers.test.ts
```

Expected: PASS.

- [ ] **Step 6: Run lint for page changes**

Run:

```bash
npm run lint
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/app/words/page.tsx src/app/words/page.helpers.test.ts
git commit -m "feat: show vocabulary pipeline stage in library"
```

---

### Task 5: Add Pipeline Summary to Stats Page

**Files:**
- Modify: `src/app/stats/page.helpers.ts`
- Modify: `src/app/stats/page.helpers.test.ts`
- Modify: `src/app/stats/page.tsx`

- [ ] **Step 1: Add failing stats helper tests**

Modify `src/app/stats/page.helpers.test.ts` imports:

```ts
import type { ReviewLog, Word } from "@/lib/types";
import { getPipelineStats } from "./page.helpers";
```

Add helper:

```ts
function makeWord(id: number, stage: Word["pipelineStage"]): Word {
  return {
    id,
    word: `word-${stage}`,
    definition: "definition",
    examples: [],
    synonyms: [],
    tier: 1,
    pipelineStage: stage,
    createdAt: new Date("2026-04-01T00:00:00.000Z"),
  };
}
```

Add test:

```ts
describe("getPipelineStats", () => {
  it("summarizes lifecycle distribution and production conversion", () => {
    const stats = getPipelineStats([
      makeWord(1, "captured"),
      makeWord(2, "queued"),
      makeWord(3, "learning"),
      makeWord(4, "reviewing"),
      makeWord(5, "contextualizing"),
      makeWord(6, "productive"),
      makeWord(7, "mature"),
    ]);

    expect(stats.summary.counts).toMatchObject({
      captured: 1,
      queued: 1,
      learning: 1,
      reviewing: 1,
      contextualizing: 1,
      productive: 1,
      mature: 1,
    });
    expect(stats.summary.recognitionToProductionRate).toBe(50);
    expect(stats.tiles).toEqual([
      { label: "Captured", value: 1, stage: "captured" },
      { label: "Learning", value: 1, stage: "learning" },
      { label: "Reviewing", value: 1, stage: "reviewing" },
      { label: "Productive", value: 1, stage: "productive" },
      { label: "Mature", value: 1, stage: "mature" },
    ]);
  });
});
```

- [ ] **Step 2: Run helper tests to verify failure**

Run:

```bash
npm run test -- src/app/stats/page.helpers.test.ts
```

Expected: FAIL because `getPipelineStats` does not exist.

- [ ] **Step 3: Implement stats helper**

Modify `src/app/stats/page.helpers.ts`:

```ts
import type { PipelineStage, ReviewLog, Word } from "@/lib/types";
import {
  getPipelineStageLabel,
  getPipelineSummary,
} from "@/lib/pipeline-stage";
```

Add:

```ts
const STATS_TILE_STAGES: PipelineStage[] = [
  "captured",
  "learning",
  "reviewing",
  "productive",
  "mature",
];

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
```

Keep `getRecentRetrievalMetrics` unchanged.

- [ ] **Step 4: Load words and render summary in stats page**

Modify import in `src/app/stats/page.tsx`:

```ts
import type { ReviewLog, Word } from "@/lib/types";
import { getPipelineStats, getRecentRetrievalMetrics } from "./page.helpers";
```

Add state:

```ts
const [words, setWords] = useState<Word[]>([]);
```

In the existing `useEffect` that loads recent logs, load words too:

```ts
useEffect(() => {
  db.reviewLogs
    .orderBy("reviewedAt")
    .reverse()
    .limit(50)
    .toArray()
    .then(setRecentLogs);
  db.words.toArray().then(setWords);
}, [seedStatus]);
```

After `recentRetrievalMetrics`, add:

```ts
const pipelineStats = getPipelineStats(words);
```

Add this section after the Retrieval Health card or before Training History:

```tsx
<HeronDivider label="Vocabulary Pipeline" />

<motion.div {...fadeUp(0.41)}>
  <IllumCard>
    <div
      className="uppercase-tracked text-[11px] mb-3"
      style={{ color: "var(--gold-deep)" }}
    >
      Acquisition Flow
    </div>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {pipelineStats.tiles.map((tile) => (
        <div
          key={tile.stage}
          className="rounded-[2px] py-3 px-2 text-center"
          style={{
            background: "color-mix(in oklab, var(--paper), var(--gold) 2%)",
            border: "1px solid var(--line-soft)",
          }}
        >
          <div
            className="font-display text-2xl font-bold tabular-nums"
            style={{ color: "var(--lapis)" }}
          >
            {tile.value}
          </div>
          <div
            className="uppercase-tracked text-[9px] mt-0.5"
            style={{ color: "var(--muted-foreground)" }}
          >
            {tile.label}
          </div>
        </div>
      ))}
    </div>
    <div
      className="mt-4 rounded-[2px] px-3 py-2"
      style={{
        background: "color-mix(in oklab, var(--lapis), transparent 94%)",
        border: "1px solid color-mix(in oklab, var(--lapis), transparent 72%)",
      }}
    >
      <span className="uppercase-tracked text-[10px]" style={{ color: "var(--lapis)" }}>
        Recognition to production
      </span>
      <span className="ml-2 font-display font-bold tabular-nums" style={{ color: "var(--ink)" }}>
        {pipelineStats.summary.recognitionToProductionRate !== null
          ? `${pipelineStats.summary.recognitionToProductionRate}%`
          : "--"}
      </span>
    </div>
  </IllumCard>
</motion.div>
```

- [ ] **Step 5: Run stats tests**

Run:

```bash
npm run test -- src/app/stats/page.helpers.test.ts
```

Expected: PASS.

- [ ] **Step 6: Run lint**

Run:

```bash
npm run lint
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/app/stats/page.tsx src/app/stats/page.helpers.ts src/app/stats/page.helpers.test.ts
git commit -m "feat: add vocabulary pipeline stats"
```

---

### Task 6: Documentation and Verification

**Files:**
- Modify: `README.md`
- Modify: `PROJECT_STATUS.md`

- [ ] **Step 1: Update README current status**

In `README.md`, add this bullet under **Current Status**:

```md
- Vocabulary pipeline stage tracking across seeded, custom, and TOT-captured words, with library badges and stats-page lifecycle distribution.
```

Under **Retrieval Health Stats**, add:

```md
## Vocabulary Pipeline Stats

The stats page also tracks the acquisition lifecycle:

- **Captured** -- words saved from real-world blanking moments
- **Learning** -- words with training started but no stable clean recall
- **Reviewing** -- words with clean recall under FSRS review
- **Productive** -- words successfully used in production or rewrite prompts
- **Mature** -- words with stable recall plus successful production history
- **Recognition to production** -- productive or mature words divided by reviewing-or-later words
```

- [ ] **Step 2: Update project status**

In `PROJECT_STATUS.md`, add under **Shipped Foundations**:

```md
- Vocabulary pipeline stage tracking across seeded, custom, and TOT-captured words
```

Update **Current Product Gap** by appending:

```md
The remaining vocabulary-pipeline gaps after v1 are a true triage inbox, first-class `VocabularyItem` entities, generated practice lanes, coverage metrics, and collocation/chunk modeling.
```

- [ ] **Step 3: Run full verification**

Run:

```bash
npm run lint
npm run test
npm run build
```

Expected:

- `npm run lint`: PASS
- `npm run test`: PASS, including existing 132+ tests plus new pipeline tests
- `npm run build`: PASS without Supabase env vars

- [ ] **Step 4: Commit documentation**

```bash
git add README.md PROJECT_STATUS.md
git commit -m "docs: document vocabulary pipeline layer"
```

---

## Final Verification Checklist

- [ ] `npm run lint` passes.
- [ ] `npm run test` passes.
- [ ] `npm run build` passes.
- [ ] Word library shows stage badges for seeded, custom, and TOT words.
- [ ] Stats page shows pipeline distribution and recognition-to-production conversion.
- [ ] Review completion advances stage without changing FSRS grades.
- [ ] Existing sync tests still pass without Supabase schema changes.
- [ ] No Supabase migration was added for this v1 slice.
- [ ] Git history has one commit per task.

## Self-Review Notes

- Spec coverage: all accepted spec requirements are covered by Tasks 1-6.
- Scope: this plan intentionally excludes triage inbox, `VocabularyItem`, generated card lanes, coverage meter, collocation object model, LLM grading, and session redesign.
- Type consistency: `PipelineStage`, `pipelineStage`, and `pipelineUpdatedAt` are consistently named across helper, persistence, UI, stats, and docs.
- Risk control: sync is not modified beyond natural persistence of optional local word fields; no Supabase migrations are introduced.

