# Vocabulary Pipeline Layer Design

Date: 2026-04-23
Status: Approved design direction, pending implementation plan

## Summary

Lexforge already has the core training loop: seeded/custom words, TOT capture, FSRS review cards, review logs, rescue/stabilize/fluent drill profiles, context prompts, production/rewrite prompts, and retrieval-health metrics.

The vocabulary acquisition research says the app should model vocabulary as a pipeline, not only as scheduled flashcards. V1 should add a thin universal pipeline layer around the existing model. Long term, this can evolve toward a first-class `VocabularyItem` architecture, but the first implementation should preserve the current local-first storage, FSRS scheduling, sync, and session-generation behavior.

## Goals

- Add a universal vocabulary lifecycle for seeded, custom, and TOT-captured words.
- Make the lifecycle visible in the product without redesigning the training engine.
- Infer and update stages from existing word, review-card, and review-log data.
- Add metrics that show whether words are moving from recognition toward usable production.
- Keep the implementation small enough to ship safely.

## Non-Goals

- Do not replace FSRS or change due-card scheduling.
- Do not introduce a separate `VocabularyItem` table in v1.
- Do not split one word into multiple generated card lanes yet.
- Do not add a full triage inbox UI yet.
- Do not add LLM grading.
- Do not add a coverage meter in v1.
- Do not introduce a collocation/chunk object model in v1.
- Do not redesign session generation beyond stage updates and metrics.

## Architecture Direction

V1 adds pipeline metadata to the existing `Word` model:

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
  pipelineStage?: PipelineStage;
  pipelineUpdatedAt?: string;
}
```

This is intentionally additive.

- FSRS answers: "When is this due?"
- Retrieval drill profile answers: "How much support does this word need now?"
- Pipeline stage answers: "Where is this word in the journey from capture to usable vocabulary?"

The lifecycle applies to all words:

- Seeded words enter as `queued` if unseen, or infer a later stage if they already have review history.
- Custom words enter as `queued` when manually added without a real-world capture.
- TOT-captured words enter as `captured`, even when the target word is already seeded.
- Existing reviewed words are backfilled from review logs.

## Lifecycle

```text
captured -> queued -> learning -> reviewing -> contextualizing -> productive -> mature
```

### Stage Meanings

| Stage | Meaning |
|---|---|
| `captured` | Word came from a real-world miss or source context and has not yet entered normal training. |
| `queued` | Word is accepted into the lexicon but has no meaningful review history yet. |
| `learning` | Training has started, but the word does not yet have clean exact recall. |
| `reviewing` | The word has at least one clean exact recall and is under normal FSRS review. |
| `contextualizing` | The word is stable enough to appear in context, produce, or rewrite prompts. |
| `productive` | The learner has successfully used the word in a production or rewrite prompt. |
| `mature` | The word has both stable clean recall and successful production/context history. |

## Stage Inference Rules

Stage inference should live in a focused pure helper:

```text
src/lib/pipeline-stage.ts
```

The helper owns:

- `PipelineStage` type if not kept in `types.ts`
- stage labels and descriptions
- inference from `Word`, `ReviewCard`, and `ReviewLog[]`
- promotion logic after reviews
- summary aggregation for stats/dashboard UI

Initial inference rules:

1. If a word has `totCapture` and no reviews, infer `captured`.
2. If a word has no reviews and no `totCapture`, infer `queued`.
3. If reviews exist but no clean exact recall exists, infer `learning`.
4. If at least one clean exact recall exists, infer `reviewing`.
5. If the word has context-mode exposure through a `contextPromptKind`, infer at least `contextualizing`.
6. If the word has a successful `produce` or `rewrite` context prompt, infer at least `productive`.
7. If the word has repeated clean exact recall plus successful production/context history, infer `mature`.

The exact mature threshold for v1 should be deterministic and conservative:

- at least 3 clean exact recall logs, and
- at least 1 successful `produce` or `rewrite` log.

The stage should not demote automatically in v1. Rescue/stabilize/fluent already handles short-term difficulty. Pipeline stage is a long-term acquisition milestone.

## Data Flow

### Seeding and Backfill

On bootstrap or a dedicated migration path, existing words should receive `pipelineStage` if missing:

- seeded unseen words: `queued`
- custom unseen words: `queued`
- TOT unseen words: `captured`
- reviewed words: inferred from logs

This can be done lazily in app code rather than through a Dexie version bump if the implementation remains deterministic and idempotent. A Dexie version bump is acceptable if tests show it is simpler and safer.

### Word Creation

Manual "Forge a Word":

- create as `queued`

TOT capture:

- existing word: set or preserve `pipelineStage` at least `captured`
- new custom word: create as `captured`

If a word is already further than `captured`, do not demote it because of a new TOT capture. The capture should influence drill support through existing TOT logic, not erase acquisition progress.

### Review Completion

After `processAnswer` writes a review log, the app should infer the next pipeline stage for that word and persist it if it advances.

Rules:

- only advance stages
- never demote stages in v1
- keep FSRS grade behavior unchanged
- use existing `contextPromptKind`, `retrievalKind`, `cueLevel`, and `correct` metadata

## UI Design

### Word Library

Add a pipeline badge to each word row, near the current phase/custom/TOT badges.

Badge examples:

- Captured
- Queued
- Learning
- Reviewing
- Context
- Productive
- Mature

Expanded word detail should include one short explanation sentence:

- `Captured`: "Saved from a real-world blanking moment; not yet stabilized."
- `Queued`: "Accepted into the lexicon but not reviewed yet."
- `Learning`: "Training has started; clean recall is not stable yet."
- `Reviewing`: "Clean recall exists and FSRS review is active."
- `Context`: "Ready for context and transfer practice."
- `Productive`: "Successfully used in a production-style prompt."
- `Mature`: "Stable recall plus successful production history."

### Stats Page

Add a small pipeline summary card:

- Captured
- Learning
- Reviewing
- Productive
- Mature

Add recognition-to-production conversion:

```text
productive_or_mature_words / reviewing_or_later_words
```

This should exclude `captured`, `queued`, and `learning` from the denominator.

### Dashboard

V1 may include a compact dashboard line if it is low risk:

```text
Pipeline: 12 productive, 38 mature, 4 captured
```

If dashboard space is tight, defer this and ship the stats page summary first.

## Testing Strategy

### Pure Unit Tests

Create `src/lib/pipeline-stage.test.ts`.

Test cases:

- TOT word with no logs -> `captured`
- normal unseen seeded word -> `queued`
- first failed review -> `learning`
- clean exact recall -> `reviewing`
- context exposure -> `contextualizing`
- successful produce prompt -> `productive`
- 3 clean exact recalls plus successful produce/rewrite -> `mature`
- new TOT on an already productive word does not demote it

### Session Tests

Update `src/lib/session-engine.test.ts` or add focused tests around `processAnswer`:

- a successful clean recall advances a word from `learning` to `reviewing`
- a successful production context answer advances to `productive`
- stage update does not change FSRS grade semantics

### Word Library Tests

Use existing words-page helper tests where possible. If row rendering is hard to test directly, add pure helper tests for stage labels and descriptions.

### Stats Tests

Add pure helper tests if stats aggregation is extracted. Avoid testing complex React page rendering unless the existing stats test pattern makes it straightforward.

## Risks and Constraints

- Sync behavior is already hardened and should not be rebuilt in this slice.
- Dexie schema changes need care because the app is local-first and already deployed.
- Stage inference should be idempotent because existing users may already have review history.
- Stage should not compete with rescue/stabilize/fluent. Those are short-term support states; pipeline stage is long-term acquisition progress.
- Stage thresholds should be conservative to avoid making "mature" meaningless.

## Acceptance Criteria

- Every word can display a pipeline stage.
- Seeded, custom, and TOT-captured words all participate in the same lifecycle.
- Existing words get sensible stages from current review history.
- Review completion can advance stage without changing FSRS behavior.
- Word library shows stage badges.
- Stats page shows pipeline distribution and recognition-to-production conversion.
- Tests cover inference, promotion, no-demotion, and summary aggregation.
- Existing test, lint, and build commands pass.

## Future Architecture Path

If v1 proves useful, the deeper refactor can introduce first-class `VocabularyItem` entities later:

- one item can generate multiple practice lanes
- lanes can track recognition, recall, context, collocation, and production independently
- source/capture metadata can become richer
- coverage metrics can compare known vocabulary against selected texts
- collocations/chunks can become first-class practice objects

V1 should avoid blocking that future, but it should not build the full architecture prematurely.
