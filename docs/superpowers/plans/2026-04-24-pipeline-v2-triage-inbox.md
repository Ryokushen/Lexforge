# Pipeline V2 Triage Inbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Word Library Inbox filter where captured words can be kept for normal queued training or archived without deleting recoverable capture history.

**Architecture:** Keep the first v2 slice additive by storing triage status on existing `TOTCapture` metadata. Centralize triage decisions in `src/lib/word-library.ts`, then use those helpers in seeding/backfill, session selection, and the Word Library page. Do not introduce a new Dexie table or Supabase migration in this slice.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Dexie/IndexedDB, Vitest, existing shadcn/base UI primitives, existing Lexforge RPG UI components.

---

## Completion Snapshot

Status as of 2026-04-24:

- Pipeline v2 triage inbox has been implemented, merged into `master`, verified, and pushed.
- Completed commits include capture triage helpers, seed backfill, training/session gating, Word Library Inbox UI, sync merge preservation, and docs.
- Follow-up commits added dashboard separation of eligible new training words vs. pending capture Inbox items, plus a local-only Supabase auth fallback for session completion without cloud env vars.
- Follow-up commit added Word Library Archive browsing and Restore for archived captures, plus AppStatusBanner hydration stabilization.
- Verification passed on `master`: `npm.cmd run lint`, `npm.cmd test`, and `npm.cmd run build`.
- Next pipeline slice: duplicate/merge workflows for captured, custom, and seeded vocabulary entries.

---

## File Structure

- Modify: `src/lib/types.ts`
  - Add `CaptureTriageStatus`.
  - Add `triageStatus` and `triagedAt` to `TOTCapture`.
- Modify: `src/lib/word-library.ts`
  - Add triage helpers for status fallback, inbox filtering, keep/archive updates, and active capture training checks.
- Modify: `src/lib/word-library.test.ts`
  - Cover helper behavior and state transitions.
- Modify: `src/lib/seed.ts`
  - Backfill legacy captures without triage status to pending.
- Modify: `src/lib/seed.test.ts`
  - Cover idempotent triage backfill.
- Modify: `src/lib/scheduler.ts`
  - Exclude pending and archived capture words from new-card selection until accepted.
- Modify: `src/lib/scheduler.test.ts`
  - Cover new-card filtering.
- Modify: `src/lib/session-engine.ts`
  - Treat only accepted captures as capture-supported for retrieval profile and prioritization.
- Modify: `src/lib/session-engine.test.ts`
  - Cover archived/pending capture exclusion from rescue/priority behavior.
- Modify: `src/app/words/page.helpers.ts`
  - Extend library filters with `inbox` and add inbox count/filter helpers.
- Modify: `src/app/words/page.helpers.test.ts`
  - Cover Inbox filter and count behavior.
- Modify: `src/app/words/page.tsx`
  - Add Inbox filter tab, pending count, Keep and Archive actions, and pending default on new captures.
- Modify: `src/lib/sync.ts`
  - Preserve local triage metadata when merging remote TOT capture rows that do not carry triage fields.
- Modify: `src/lib/sync.test.ts`
  - Cover local triage preservation during TOT merge.
- Modify: `README.md`, `PROJECT_STATUS.md`
  - Document shipped triage-inbox behavior and local-only triage sync limitation if implementation keeps cloud schema unchanged.

Before editing Next.js page code, read the relevant local Next.js 16 docs in `node_modules/next/dist/docs/` after dependencies are installed, per `AGENTS.md`.

---

### Task 1: Add Capture Triage Types and Pure Helpers

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/word-library.ts`
- Modify: `src/lib/word-library.test.ts`

- [x] **Step 1: Add failing helper tests**

Modify `src/lib/word-library.test.ts` imports:

```ts
import type { TOTCapture, Word } from "./types";
import {
  archiveTOTCapture,
  getCaptureTriageStatus,
  getPendingCaptureWords,
  isCaptureTrainingActive,
  isDuplicateWord,
  isPendingCapture,
  isTierLocked,
  keepTOTCapture,
  normalizeWord,
} from "./word-library";
```

Add these helpers below the imports:

```ts
function makeCapture(overrides: Partial<TOTCapture> = {}): TOTCapture {
  return {
    source: "speech",
    capturedAt: "2026-04-10T09:00:00.000Z",
    count: 1,
    ...overrides,
  };
}

function makeWord(overrides: Partial<Word> = {}): Word {
  return {
    id: 1,
    word: "lucid",
    definition: "clear",
    examples: [],
    synonyms: [],
    tier: 1,
    createdAt: new Date("2026-04-01T00:00:00.000Z"),
    ...overrides,
  };
}
```

Add these tests to the file:

```ts
describe("capture triage helpers", () => {
  it("treats legacy captures without status as pending", () => {
    const legacyCapture = makeCapture();

    expect(getCaptureTriageStatus(legacyCapture)).toBe("pending");
    expect(isPendingCapture(makeWord({ totCapture: legacyCapture }))).toBe(true);
  });

  it("filters pending captures for the inbox", () => {
    const pending = makeWord({
      id: 1,
      word: "pending",
      totCapture: makeCapture({ triageStatus: "pending" }),
    });
    const accepted = makeWord({
      id: 2,
      word: "accepted",
      totCapture: makeCapture({ triageStatus: "accepted" }),
    });
    const archived = makeWord({
      id: 3,
      word: "archived",
      totCapture: makeCapture({ triageStatus: "archived" }),
    });
    const normal = makeWord({ id: 4, word: "normal" });

    expect(getPendingCaptureWords([accepted, pending, archived, normal])).toEqual([
      pending,
    ]);
  });

  it("keeps captures without demoting advanced pipeline stages", () => {
    const kept = keepTOTCapture(
      makeWord({
        pipelineStage: "productive",
        pipelineUpdatedAt: "2026-04-01T00:00:00.000Z",
        totCapture: makeCapture({ triageStatus: "pending" }),
      }),
      "2026-04-24T12:00:00.000Z",
    );

    expect(kept.pipelineStage).toBe("productive");
    expect(kept.pipelineUpdatedAt).toBe("2026-04-24T12:00:00.000Z");
    expect(kept.totCapture).toMatchObject({
      triageStatus: "accepted",
      triagedAt: "2026-04-24T12:00:00.000Z",
      updatedAt: "2026-04-24T12:00:00.000Z",
    });
  });

  it("moves captured pending words to queued when kept", () => {
    const kept = keepTOTCapture(
      makeWord({
        pipelineStage: "captured",
        totCapture: makeCapture({ triageStatus: "pending" }),
      }),
      "2026-04-24T12:00:00.000Z",
    );

    expect(kept.pipelineStage).toBe("queued");
  });

  it("archives only capture metadata and keeps the word recoverable", () => {
    const archived = archiveTOTCapture(
      makeWord({
        pipelineStage: "reviewing",
        totCapture: makeCapture({ triageStatus: "pending" }),
      }),
      "2026-04-24T12:00:00.000Z",
    );

    expect(archived.pipelineStage).toBe("reviewing");
    expect(archived.totCapture).toMatchObject({
      triageStatus: "archived",
      triagedAt: "2026-04-24T12:00:00.000Z",
      updatedAt: "2026-04-24T12:00:00.000Z",
    });
  });

  it("activates capture training support only for accepted captures", () => {
    expect(
      isCaptureTrainingActive(
        makeWord({ totCapture: makeCapture({ triageStatus: "accepted" }) }),
      ),
    ).toBe(true);
    expect(
      isCaptureTrainingActive(
        makeWord({ totCapture: makeCapture({ triageStatus: "pending" }) }),
      ),
    ).toBe(false);
    expect(
      isCaptureTrainingActive(
        makeWord({ totCapture: makeCapture({ triageStatus: "archived" }) }),
      ),
    ).toBe(false);
  });
});
```

- [x] **Step 2: Run helper tests to verify failure**

Run:

```bash
npm run test -- --run src/lib/word-library.test.ts
```

Expected: FAIL because the triage helpers and types do not exist.

- [x] **Step 3: Add capture triage types**

Modify `src/lib/types.ts` near the TOT capture types:

```ts
export type CaptureTriageStatus = "pending" | "accepted" | "archived";

export interface TOTCapture {
  source: TOTCaptureSource;
  weakSubstitute?: string;
  context?: string;
  capturedAt: string;
  updatedAt?: string;
  count: number;
  eventIds?: string[];
  triageStatus?: CaptureTriageStatus;
  triagedAt?: string;
}
```

- [x] **Step 4: Implement triage helpers**

Modify `src/lib/word-library.ts` imports:

```ts
import type { CaptureTriageStatus, SeedTier, TOTCapture, Word } from "./types";
import { maxPipelineStage } from "./pipeline-stage";
import { TIER_UNLOCK_LEVELS } from "./types";
```

Add these helpers after `getTOTEventIds`:

```ts
export function getCaptureTriageStatus(
  capture: Pick<TOTCapture, "triageStatus"> | undefined | null,
): CaptureTriageStatus | null {
  if (!capture) return null;
  return capture.triageStatus ?? "pending";
}

export function isPendingCapture(word: Pick<Word, "totCapture">): boolean {
  return getCaptureTriageStatus(word.totCapture) === "pending";
}

export function getPendingCaptureWords<T extends Pick<Word, "totCapture">>(
  words: T[],
): T[] {
  return words.filter(isPendingCapture);
}

export function isCaptureTrainingActive(word: Pick<Word, "totCapture">): boolean {
  return getCaptureTriageStatus(word.totCapture) === "accepted";
}

export function shouldIncludeNewWordInTraining(
  word: Pick<Word, "totCapture">,
): boolean {
  const status = getCaptureTriageStatus(word.totCapture);
  return status === null || status === "accepted";
}

export function keepTOTCapture(word: Word, triagedAt: string): Partial<Word> {
  if (!word.totCapture) return {};

  return {
    totCapture: {
      ...word.totCapture,
      triageStatus: "accepted",
      triagedAt,
      updatedAt: triagedAt,
    },
    pipelineStage: maxPipelineStage(word.pipelineStage, "queued"),
    pipelineUpdatedAt: triagedAt,
  };
}

export function archiveTOTCapture(word: Word, triagedAt: string): Partial<Word> {
  if (!word.totCapture) return {};

  return {
    totCapture: {
      ...word.totCapture,
      triageStatus: "archived",
      triagedAt,
      updatedAt: triagedAt,
    },
  };
}
```

- [x] **Step 5: Run helper tests**

Run:

```bash
npm run test -- --run src/lib/word-library.test.ts
```

Expected: PASS.

- [x] **Step 6: Commit**

```bash
git add src/lib/types.ts src/lib/word-library.ts src/lib/word-library.test.ts
git commit -m "feat: add capture triage helpers"
```

---

### Task 2: Backfill Triage Status and Default New Captures to Pending

**Files:**
- Modify: `src/lib/seed.ts`
- Modify: `src/lib/seed.test.ts`
- Modify: `src/app/words/page.tsx`

- [x] **Step 1: Add failing seed backfill tests**

Pause note: this step is applied in the working tree but not committed. Continue with Step 2 when resuming.

Add this test to `src/lib/seed.test.ts`:

```ts
it("backfills missing capture triage status to pending without overwriting decisions", async () => {
  dbMock.words.toArray.mockResolvedValue([
    makeExistingWord("lucid", {
      id: 11,
      totCapture: {
        source: "speech",
        capturedAt: "2026-04-10T12:00:00.000Z",
        count: 1,
      },
    }),
    makeExistingWord("tenuous", {
      id: 12,
      tier: 2,
      totCapture: {
        source: "writing",
        capturedAt: "2026-04-11T12:00:00.000Z",
        count: 1,
        triageStatus: "accepted",
        triagedAt: "2026-04-12T12:00:00.000Z",
      },
    }),
    makeExistingWord("recondite", {
      id: 13,
      tier: 4,
      totCapture: {
        source: "reading",
        capturedAt: "2026-04-13T12:00:00.000Z",
        count: 1,
        triageStatus: "archived",
        triagedAt: "2026-04-14T12:00:00.000Z",
      },
    }),
  ]);

  await seedDatabase();

  expect(dbMock.words.update).toHaveBeenCalledWith(11, {
    totCapture: expect.objectContaining({
      triageStatus: "pending",
      updatedAt: "2026-04-10T12:00:00.000Z",
    }),
  });
  expect(dbMock.words.update).not.toHaveBeenCalledWith(
    12,
    expect.objectContaining({
      totCapture: expect.objectContaining({ triageStatus: expect.any(String) }),
    }),
  );
  expect(dbMock.words.update).not.toHaveBeenCalledWith(
    13,
    expect.objectContaining({
      totCapture: expect.objectContaining({ triageStatus: expect.any(String) }),
    }),
  );
});
```

- [ ] **Step 2: Run seed tests to verify failure**

Run:

```bash
npm run test -- --run src/lib/seed.test.ts
```

Expected: FAIL because `seedDatabase` does not backfill capture triage status.

- [ ] **Step 3: Backfill legacy captures in seedDatabase**

Modify `src/lib/seed.ts` inside the existing `for (const local of existing)` loop, before `if (Object.keys(updates).length > 0)`:

```ts
    if (local.totCapture && !local.totCapture.triageStatus) {
      updates.totCapture = {
        ...local.totCapture,
        triageStatus: "pending",
        updatedAt:
          local.totCapture.updatedAt ??
          local.totCapture.capturedAt,
      };
    }
```

This must merge with any tier or pipeline updates already accumulated in `updates`.

- [ ] **Step 4: Default new captures to pending in the Word Library**

In `src/app/words/page.tsx`, update the existing-word capture update inside `handleCaptureTOT`:

```ts
        totCapture: {
          source: totForm.source,
          weakSubstitute,
          context,
          capturedAt,
          updatedAt: capturedAt,
          count: Math.max(existingTOTWord.totCapture?.count ?? 0, eventIds.length),
          eventIds,
          triageStatus: existingTOTWord.totCapture?.triageStatus ?? "pending",
          triagedAt: existingTOTWord.totCapture?.triagedAt,
        },
```

Update the new custom word capture object:

```ts
        totCapture: {
          source: totForm.source,
          weakSubstitute,
          context,
          capturedAt,
          updatedAt: capturedAt,
          count: eventIds.length,
          eventIds,
          triageStatus: "pending",
        },
```

- [ ] **Step 5: Run focused tests**

Run:

```bash
npm run test -- --run src/lib/seed.test.ts src/lib/word-library.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/seed.ts src/lib/seed.test.ts src/app/words/page.tsx
git commit -m "feat: backfill capture triage status"
```

---

### Task 3: Exclude Pending and Archived Captures from New Training and Capture Priority

**Files:**
- Modify: `src/lib/scheduler.ts`
- Modify: `src/lib/scheduler.test.ts`
- Modify: `src/lib/session-engine.ts`
- Modify: `src/lib/session-engine.test.ts`

- [ ] **Step 1: Add failing scheduler test for new-card filtering**

In `src/lib/scheduler.test.ts`, update the local word fixture and add a new-card filtering test.

First change the local helper signature from:

```ts
function makeWord(id: number, tier: Word["tier"]): Word {
```

to:

```ts
function makeWord(
  id: number,
  tier: Word["tier"],
  overrides: Partial<Word> = {},
): Word {
```

and add `...overrides` before the closing object:

```ts
  return {
    id,
    word: `word-${id}`,
    definition: `definition-${id}`,
    examples: [],
    synonyms: [],
    tier,
    createdAt: new Date("2026-04-01T00:00:00.000Z"),
    ...overrides,
  };
```

Add this test:

```ts
it("excludes pending and archived capture words from new-card selection", async () => {
  const pendingCard = makeReviewCard({
    wordId: 1,
    due: "2026-04-10T10:00:00.000Z",
    state: 0,
  });
  const acceptedCard = makeReviewCard({
    wordId: 2,
    due: "2026-04-10T10:00:00.000Z",
    state: 0,
  });
  const archivedCard = makeReviewCard({
    wordId: 3,
    due: "2026-04-10T10:00:00.000Z",
    state: 0,
  });
  const normalCard = makeReviewCard({
    wordId: 4,
    due: "2026-04-10T10:00:00.000Z",
    state: 0,
  });

  dbMock.reviewCards.toArray.mockResolvedValue([
    pendingCard,
    acceptedCard,
    archivedCard,
    normalCard,
  ]);
  dbMock.words.toArray.mockResolvedValue([
    makeWord(1, 1, {
      totCapture: {
        source: "speech",
        capturedAt: "2026-04-10T00:00:00.000Z",
        count: 1,
        triageStatus: "pending",
      },
    }),
    makeWord(2, 1, {
      totCapture: {
        source: "speech",
        capturedAt: "2026-04-11T00:00:00.000Z",
        count: 1,
        triageStatus: "accepted",
      },
    }),
    makeWord(3, 1, {
      totCapture: {
        source: "speech",
        capturedAt: "2026-04-12T00:00:00.000Z",
        count: 1,
        triageStatus: "archived",
      },
    }),
    makeWord(4, 1),
  ]);

  await expect(getNewCards(10, [1])).resolves.toEqual([
    acceptedCard,
    normalCard,
  ]);
});
```

- [ ] **Step 2: Run scheduler test to verify failure**

Run:

```bash
npm run test -- --run src/lib/scheduler.test.ts
```

Expected: FAIL because `getNewCards` includes all new cards in unlocked tiers.

- [ ] **Step 3: Filter new cards by triage status**

Modify `src/lib/scheduler.ts` imports:

```ts
import { shouldIncludeNewWordInTraining } from "./word-library";
```

Modify `getNewCards` so it loads words once and filters by unlocked tiers plus triage state:

```ts
export async function getNewCards(
  limit: number = 10,
  unlockedTiers?: WordTier[],
): Promise<ReviewCard[]> {
  const all = await db.reviewCards.toArray();
  let newCards = all.filter((rc) => rc.card.state === 0);
  const words = await db.words.toArray();
  const wordsById = new Map(words.map((word) => [word.id, word]));

  newCards = newCards.filter((rc) => {
    const word = wordsById.get(rc.wordId);
    if (!word) return false;
    if (unlockedTiers && !unlockedTiers.includes(word.tier as WordTier)) {
      return false;
    }
    return shouldIncludeNewWordInTraining(word);
  });

  return newCards.slice(0, limit);
}
```

- [ ] **Step 4: Add failing session behavior tests**

Add these tests to `src/lib/session-engine.test.ts` near existing retrieval-drill and mode-priority tests:

```ts
it("does not keep pending captures in rescue solely because they were captured", () => {
  const profile = buildRetrievalDrillProfile(
    makeWord(1, 1, {
      source: "speech",
      capturedAt: "2026-04-10T00:00:00.000Z",
      count: 1,
      triageStatus: "pending",
    }),
    [],
  );

  expect(profile.stage).toBe("stabilize");
});

it("keeps accepted captures eligible for capture recovery support", () => {
  const profile = buildRetrievalDrillProfile(
    makeWord(1, 1, {
      source: "speech",
      capturedAt: "2026-04-10T00:00:00.000Z",
      count: 1,
      triageStatus: "accepted",
    }),
    [],
  );

  expect(profile.stage).toBe("rescue");
});

it("does not bias mode selection toward adaptive drills for archived captures", () => {
  const word = makeWord(
    1,
    1,
    {
      source: "speech",
      capturedAt: "2026-04-10T00:00:00.000Z",
      count: 1,
      triageStatus: "archived",
    },
  );

  const ratios = sampleModeRatios(() =>
    pickMode(word, undefined, { ...makeDrillProfile(), stage: "stabilize", recentCueRate: 0 }),
  );

  expect(ratios.recall).toBeGreaterThan(0.55);
  expect(ratios.speed).toBeLessThan(0.3);
});
```

Add this helper near `sampleModeRatios` before the tests:

```ts
function makeDrillProfile(
  overrides: Partial<RetrievalDrillProfile> = {},
): RetrievalDrillProfile {
  return {
    stage: "stabilize",
    exactStreak: 1,
    recentCueRate: 0,
    recentFailureCount: 0,
    recallHintEnabled: true,
    rapidTimeoutMs: 3000,
    rapidCueRevealMs: 1800,
    ...overrides,
  };
}
```

- [ ] **Step 5: Run session-engine tests to verify failure**

Run:

```bash
npm run test -- --run src/lib/session-engine.test.ts
```

Expected: FAIL because `session-engine.ts` treats any `totCapture` as active.

- [ ] **Step 6: Use active capture helper in session engine**

Modify `src/lib/session-engine.ts` imports:

```ts
import { isCaptureTrainingActive } from "./word-library";
```

Replace all local `Boolean(word.totCapture)` checks that drive capture support with `isCaptureTrainingActive(word)`:

```ts
const hasTOTCapture = isCaptureTrainingActive(word);
```

In `prioritizeSessionWords`, replace the TOT comparison:

```ts
    const leftHasTOT = isCaptureTrainingActive(left.word) ? 0 : 1;
    const rightHasTOT = isCaptureTrainingActive(right.word) ? 0 : 1;
```

Leave count and recency tie-breakers as-is because they only matter after both words have equal active-capture rank.

- [ ] **Step 7: Run focused tests**

Run:

```bash
npm run test -- --run src/lib/scheduler.test.ts src/lib/session-engine.test.ts src/lib/word-library.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/lib/scheduler.ts src/lib/scheduler.test.ts src/lib/session-engine.ts src/lib/session-engine.test.ts
git commit -m "feat: gate capture training by triage status"
```

---

### Task 4: Add Inbox Filter and Triage Actions to Word Library

**Files:**
- Modify: `src/app/words/page.helpers.ts`
- Modify: `src/app/words/page.helpers.test.ts`
- Modify: `src/app/words/page.tsx`

- [ ] **Step 1: Add failing page helper tests**

Modify `src/app/words/page.helpers.test.ts` imports:

```ts
import {
  buildTierFilterLayout,
  buildWordGroups,
  filterWordsForLibraryView,
  getInboxCount,
  getWordLibraryPipelineStage,
} from "./page.helpers";
```

Add tests:

```ts
describe("inbox helpers", () => {
  it("counts only pending capture words", () => {
    expect(
      getInboxCount([
        makeWord(1, 1, { totCapture: makeCapture(1) }),
        makeWord(2, 1, {
          totCapture: makeCapture(1, { triageStatus: "accepted" }),
        }),
        makeWord(3, 1, {
          totCapture: makeCapture(1, { triageStatus: "archived" }),
        }),
        makeWord(4, 1),
      ]),
    ).toBe(1);
  });

  it("filters the inbox to pending captures before search", () => {
    const pending = makeWord(1, 1, {
      word: "meticulous",
      definition: "careful",
      totCapture: makeCapture(1, { context: "inspection meeting" }),
    });
    const accepted = makeWord(2, 1, {
      word: "lucid",
      definition: "clear",
      totCapture: makeCapture(1, { triageStatus: "accepted" }),
    });

    expect(filterWordsForLibraryView([pending, accepted], "inbox", "").map((word) => word.word)).toEqual([
      "meticulous",
    ]);
    expect(filterWordsForLibraryView([pending, accepted], "inbox", "inspection")).toEqual([
      pending,
    ]);
    expect(filterWordsForLibraryView([pending, accepted], "inbox", "lucid")).toEqual([]);
  });
});
```

Update `makeCapture` to accept overrides:

```ts
function makeCapture(
  count: number,
  overrides: Partial<TOTCapture> = {},
): TOTCapture {
  return {
    source: "speech",
    capturedAt: "2026-04-10T09:00:00.000Z",
    count,
    ...overrides,
  };
}
```

- [ ] **Step 2: Run page helper tests to verify failure**

Run:

```bash
npm run test -- --run src/app/words/page.helpers.test.ts
```

Expected: FAIL because `filterWordsForLibraryView` and `getInboxCount` do not exist.

- [ ] **Step 3: Implement page helpers**

Modify `src/app/words/page.helpers.ts`:

```ts
import type { PipelineStage, Word } from "@/lib/types";
import { isPendingCapture } from "@/lib/word-library";
import { TIER_UNLOCK_LEVELS } from "@/lib/types";
```

Change the filter type import/definition usage by adding:

```ts
export type WordLibraryViewFilter = "all" | Word["tier"] | "inbox";
```

Add helpers:

```ts
function matchesLibrarySearch(word: Word, normalizedSearch: string): boolean {
  if (!normalizedSearch) return true;
  return [
    word.word,
    word.definition,
    word.totCapture?.weakSubstitute,
    word.totCapture?.context,
  ].some((value) => value?.toLowerCase().includes(normalizedSearch));
}

export function getInboxCount(words: Word[]): number {
  return words.filter(isPendingCapture).length;
}

export function filterWordsForLibraryView(
  words: Word[],
  activeFilter: WordLibraryViewFilter,
  search: string,
): Word[] {
  const normalizedSearch = search.trim().toLowerCase();
  return words
    .filter((word) => {
      if (activeFilter === "inbox") return isPendingCapture(word);
      if (activeFilter === "all") return true;
      return word.tier === activeFilter;
    })
    .filter((word) => matchesLibrarySearch(word, normalizedSearch));
}
```

- [ ] **Step 4: Wire Inbox filter into page state**

In `src/app/words/page.tsx`, update imports:

```ts
import {
  archiveTOTCapture,
  createTOTEventId,
  getTOTEventIds,
  isDuplicateWord,
  isTierLocked,
  keepTOTCapture,
  normalizeWord,
  type LibraryTierFilter,
} from "@/lib/word-library";
import {
  buildTierFilterLayout,
  buildWordGroups,
  filterWordsForLibraryView,
  getInboxCount,
  getWordLibraryPipelineStage,
  type WordLibraryViewFilter,
} from "./page.helpers";
```

Change state:

```ts
const [activeTier, setActiveTier] = useState<WordLibraryViewFilter>("all");
```

Replace the `filtered` memo with:

```ts
const filtered = useMemo(
  () => filterWordsForLibraryView(words, activeTier, search),
  [words, activeTier, search],
);
```

Add:

```ts
const inboxCount = useMemo(() => getInboxCount(words), [words]);
const selectedTierLocked =
  activeTier !== "inbox" && isTierLocked(activeTier as LibraryTierFilter, playerLevel);
```

- [ ] **Step 5: Add Keep and Archive handlers**

In `src/app/words/page.tsx`, add:

```ts
const handleKeepCapture = async (word: Word) => {
  if (!word.id || !word.totCapture) return;
  await db.words.update(word.id, keepTOTCapture(word, new Date().toISOString()));
  setExpandedId(null);
  await loadWords();
};

const handleArchiveCapture = async (word: Word) => {
  if (!word.id || !word.totCapture) return;
  await db.words.update(word.id, archiveTOTCapture(word, new Date().toISOString()));
  setExpandedId(null);
  await loadWords();
};
```

Update `WordRow` props:

```ts
function WordRow({
  word,
  isExpanded,
  onToggle,
  onKeepCapture,
  onArchiveCapture,
  isLast,
}: {
  word: Word;
  isExpanded: boolean;
  onToggle: () => void;
  onKeepCapture: (word: Word) => void;
  onArchiveCapture: (word: Word) => void;
  isLast: boolean;
}) {
```

Pass handlers in `renderWordList`:

```tsx
<WordRow
  key={w.id}
  word={w}
  isExpanded={expandedId === w.id}
  onToggle={() => setExpandedId(expandedId === w.id ? null : (w.id ?? null))}
  onKeepCapture={handleKeepCapture}
  onArchiveCapture={handleArchiveCapture}
  isLast={i === wordList.length - 1}
/>
```

- [ ] **Step 6: Render Inbox filter and row actions**

Update `tierFilters`:

```ts
const tierFilters: { key: WordLibraryViewFilter; label: string; count?: number }[] = [
  { key: "all", label: "All" },
  { key: "inbox", label: "Inbox", count: inboxCount },
  { key: 1, label: "I" },
  { key: 2, label: "II" },
  { key: 3, label: "III" },
  { key: 4, label: "IV" },
  { key: "custom", label: "★" },
];
```

Where filter buttons render their label, render count for Inbox:

```tsx
{filter.label}
{filter.key === "inbox" && filter.count !== undefined && filter.count > 0
  ? ` ${filter.count}`
  : ""}
```

Inside the expanded `word.totCapture` block in `WordRow`, add actions when the capture is pending:

```tsx
{word.totCapture && getCaptureTriageStatus(word.totCapture) === "pending" && (
  <div className="flex flex-wrap gap-2 pt-1">
    <Button
      size="sm"
      onClick={(event) => {
        event.stopPropagation();
        onKeepCapture(word);
      }}
    >
      Keep
    </Button>
    <Button
      size="sm"
      variant="outline"
      onClick={(event) => {
        event.stopPropagation();
        onArchiveCapture(word);
      }}
    >
      Archive
    </Button>
  </div>
)}
```

Import `getCaptureTriageStatus` from `@/lib/word-library` with the other word-library helpers.

- [ ] **Step 7: Add Inbox empty state**

In the empty-state render near the bottom of `src/app/words/page.tsx`, use this message when `activeTier === "inbox"`:

```tsx
{filtered.length === 0 && activeTier === "inbox" && (
  <IllumCard className="text-center py-10">
    <Tome className="size-10 mx-auto mb-3" style={{ color: "var(--gold-deep)" }} />
    <p className="font-display text-xl font-bold" style={{ color: "var(--ink)" }}>
      Inbox Clear
    </p>
    <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
      New blanking captures will appear here for review.
    </p>
  </IllumCard>
)}
```

Ensure the existing generic empty state does not also render for Inbox by changing its condition to:

```tsx
{filtered.length === 0 && !selectedTierLocked && activeTier !== "inbox" && (
```

- [ ] **Step 8: Run focused tests and lint**

Run:

```bash
npm run test -- --run src/app/words/page.helpers.test.ts src/lib/word-library.test.ts
npm run lint
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/app/words/page.tsx src/app/words/page.helpers.ts src/app/words/page.helpers.test.ts
git commit -m "feat: add word library capture inbox"
```

---

### Task 5: Preserve Local Triage During Sync Merge

**Files:**
- Modify: `src/lib/sync.ts`
- Modify: `src/lib/sync.test.ts`

- [ ] **Step 1: Add failing sync test**

In `src/lib/sync.test.ts`, add this test after `"merges richer local TOT details even when the remote row is newer"`:

```ts
it("preserves local capture triage when remote TOT rows lack triage fields", async () => {
  tableState.word_tot_captures.rows = [
    {
      user_id: "user-1",
      word_key: "lucid",
      normalized_word_key: "lucid",
      source: "speech",
      weak_substitute: null,
      context: null,
      captured_at: "2026-04-11T00:00:00.000Z",
      count: 1,
      event_ids: ["remote-event"],
      updated_at: "2026-04-11T00:00:00.000Z",
    },
  ];
  dbMock.words.toArray.mockResolvedValue([
    {
      ...makeWord(1, "lucid"),
      totCapture: {
        source: "speech",
        capturedAt: "2026-04-10T00:00:00.000Z",
        updatedAt: "2026-04-12T00:00:00.000Z",
        count: 1,
        eventIds: ["local-event"],
        triageStatus: "archived",
        triagedAt: "2026-04-13T00:00:00.000Z",
      },
    },
  ]);

  await syncOnLogin(makeUser());

  expect(dbMock.words.update).toHaveBeenCalledWith(
    1,
    expect.objectContaining({
      totCapture: expect.objectContaining({
        triageStatus: "archived",
        triagedAt: "2026-04-13T00:00:00.000Z",
      }),
    }),
  );
});
```

- [ ] **Step 2: Run sync test to verify failure**

Run:

```bash
npm run test -- --run src/lib/sync.test.ts
```

Expected: FAIL because `mergeTOTCapture` drops local triage fields.

- [ ] **Step 3: Preserve local triage fields in mergeTOTCapture**

Modify the `return` object in `mergeTOTCapture` in `src/lib/sync.ts`:

```ts
  return {
    source: remoteIsNewer
      ? remoteRow.source
      : (localCapture?.source ?? remoteRow.source),
    weakSubstitute: pickRicherText(localCapture?.weakSubstitute, remoteRow.weak_substitute),
    context: pickRicherText(localCapture?.context, remoteRow.context),
    capturedAt: maxIso(localCapture?.capturedAt, remoteRow.captured_at),
    count: mergedCount,
    eventIds: mergedEventIds.length > 0 ? mergedEventIds : undefined,
    updatedAt: maxIso(localUpdatedAt, remoteUpdatedAt),
    triageStatus: localCapture?.triageStatus,
    triagedAt: localCapture?.triagedAt,
  };
```

Do not add triage fields to `pushTOTCaptures` in this slice unless the Supabase schema already has compatible columns. Avoid a migration in this plan.

- [ ] **Step 4: Run focused sync tests**

Run:

```bash
npm run test -- --run src/lib/sync.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/sync.ts src/lib/sync.test.ts
git commit -m "fix: preserve local capture triage during sync"
```

---

### Task 6: Documentation and Full Verification

**Files:**
- Modify: `README.md`
- Modify: `PROJECT_STATUS.md`

- [ ] **Step 1: Update README current status**

In `README.md`, under `## Current Status`, add:

```md
- Word Library Inbox and Archive triage for captured words, with Keep, Archive, and Restore decisions before captures enter normal queued training.
```

In the capture-loop section, add:

```md
- Review pending captures in the Word Library Inbox before they enter normal queued training.
- Archive captures without deleting the underlying word or losing the recoverable capture record.
- Browse archived captures in the Word Library Archive and restore them back to pending triage when needed.
```

- [ ] **Step 2: Update project status**

In `PROJECT_STATUS.md`, under `## Shipped Foundations`, add:

```md
- Word Library Inbox and Archive triage for pending or archived captured words, including restore-without-training behavior
```

In `## Current Product Gap`, replace the phrase:

```md
post-v1 pipeline depth: triage inbox, first-class vocabulary item entities, generated practice lanes, coverage metrics, and collocation/chunk modeling.
```

with:

```md
post-v2 pipeline depth: duplicate merge workflows, first-class vocabulary item entities, generated practice lanes, coverage metrics, and collocation/chunk modeling.
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
- `npm run test`: PASS
- `npm run build`: PASS

- [ ] **Step 4: Commit documentation**

```bash
git add README.md PROJECT_STATUS.md
git commit -m "docs: document capture triage inbox"
```

---

## Final Verification Checklist

- [ ] `npm run lint` passes.
- [ ] `npm run test` passes.
- [ ] `npm run build` passes.
- [ ] Word Library shows an Inbox filter with pending count.
- [ ] Existing legacy captures backfill to pending.
- [ ] New captures default to pending.
- [ ] Keep accepts a capture and moves captured/queued words to queued without demoting advanced stages.
- [ ] Archive hides capture from Inbox and preserves the underlying word.
- [ ] Pending and archived capture-created words do not enter new-card sessions.
- [ ] Archived captures do not drive capture rescue/priority behavior.
- [ ] Sync merge does not erase local triage decisions when remote rows lack triage fields.
- [ ] No new Dexie table was added.
- [ ] No Supabase migration was added.

## Self-Review Notes

- Spec coverage: the tasks cover Inbox UI, pending backfill, Keep, Archive, training gating, capture-priority gating, sync preservation, docs, and verification.
- Scope: this plan originally excluded archive browsing/restore UI, which later shipped as a follow-up; duplicate merge workflows, first-class `VocabularyItem`, generated practice lanes, coverage metrics, collocation modeling, and cloud schema migration remain outside this plan.
- Type consistency: `CaptureTriageStatus`, `triageStatus`, `triagedAt`, `isPendingCapture`, `isCaptureTrainingActive`, `keepTOTCapture`, and `archiveTOTCapture` are consistently named across tasks.
