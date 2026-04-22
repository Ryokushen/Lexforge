# Lexforge 700-Word Retiering and 4-Phase Curriculum Plan

_Last updated: 2026-04-22_

## Decision Snapshot

This is the current development direction for Lexforge's seed curriculum:

- The seeded vocabulary should be treated as a single **700-word curriculum**, not a 531-word base plus a separate add-on list.
- All 700 seeded words should be **re-tiered from easiest / most commonly used to hardest / least commonly used**.
- Lexforge should move from **3 seeded tiers/phases to 4**.
- Lower-level players should **not be shown unseen words from locked higher phases**.
- The existing audit and candidate docs remain useful source material, but this file is the working implementation brief for the curriculum refactor.

Supporting source docs:

- [docs/word-frequency-audit.md](word-frequency-audit.md)
- [docs/word-addition-candidates.md](word-addition-candidates.md)

---

## Goal

Ship a frequency-grounded four-phase seeded curriculum for all 700 words, while preserving the current local-first scheduling model, custom-word support, and already-introduced review cards.

## Scope

This effort has three linked parts:

1. **Retier the full 700-word seed corpus** into a single canonical easiest-to-hardest ordering.
2. **Refactor product logic from 3 phases to 4** anywhere the app currently assumes exactly three seeded tiers.
3. **Add stronger phase gating** so lower-level players do not see locked higher-phase words before they are meant to.

## Non-Goals

- Reworking FSRS, review-log sync, or retrieval grading beyond what is necessary for the phase refactor.
- Renaming every internal `tier` reference to `phase` in the same slice unless the rename clearly reduces confusion and risk. The cardinality change matters more than the terminology pass.
- Broad product redesign unrelated to curriculum ordering.

---

## Workstream 1: Canonical 700-Word Ranking

### Requirement

The full seeded corpus should be re-ranked together, not by preserving the current 531-word ordering and appending the 169 candidate words afterward.

### Rules

- Start from the combined `531 + 169 = 700` seeded words.
- Rank words from **easiest / most common / most broadly useful** to **hardest / least common / most specialized**.
- Use the frequency audit as the baseline, but allow a small number of manual overrides when learner usefulness clearly beats raw corpus frequency.
- Every override should be documented, because undocumented taste-based reshuffling turns the curriculum into mush.

### Deliverables

- A canonical ranking export covering the full seeded curriculum.
- A four-phase assignment for every seeded word.
- A machine-generated summary that reports corpus size, overlap status, and phase counts.
- Updated seed-candidate data that eliminates accidental overlap between the existing seed list and the candidate-addition set.

### Likely files

- `docs/word-frequency-ranking.csv`
- `docs/word-addition-candidates.csv`
- `docs/seed-curriculum-ranking.csv`
- `docs/seed-curriculum-summary.md`
- `scripts/curriculum-ranking.mjs`
- `scripts/curriculum-ranking.test.mjs`
- `scripts/generate-curriculum-ranking.mjs`
- `src/lib/seed-words.ts`
- any helper/scripts introduced to regenerate ranking artifacts

### Acceptance criteria

- Every seeded word has a canonical position in the 700-word ordering.
- Every seeded word has a final phase in `1..4`.
- The four phases are derived from the full 700-word ranking, not from legacy three-tier compatibility buckets.

---

## Workstream 2: Refactor the App from 3 Seeded Phases to 4

### Requirement

Any codepath that currently assumes exactly three seeded tiers must be updated to support four seeded phases.

### Known three-phase assumptions already in the repo

- `src/lib/types.ts`
  - `Word.tier`
  - `SeedWord.tier`
  - `TIER_UNLOCK_LEVELS`
- `src/lib/session-engine.ts`
  - `getUnlockedTiers(level)`
  - session assembly via `loadSessionWords(...)`
- `src/lib/scheduler.ts`
  - `getNewCards(..., unlockedTiers)`
- `src/lib/word-library.ts`
  - `isTierLocked(...)`
- `src/app/words/page.tsx`
  - tier labels, grouped library display, lock messaging
- `src/app/stats/page.tsx`
  - hard-coded tier list and unlock display
- `src/components/session/recall-prompt.tsx`
  - tier badge text
- `src/lib/session-engine.test.ts`
  - unlock-threshold expectations and above-tier review behavior

### Refactor notes

- Replace hard-coded three-tier arrays and unions with four-phase equivalents.
- Update display metadata (`TIER_INFO`, labels, numerals, colors, unlock copy) anywhere the UI currently assumes only I / II / III.
- Keep custom words as their own special bucket; they should not be blocked by seeded-phase unlock rules.
- Preserve the current behavior where **already-introduced due reviews can still appear** even if a rebalance later places that word above the player's current unlock level.

### Acceptance criteria

- No seeded-word type, config, or UI view assumes only phases 1-3.
- Session generation, dashboard counts, stats, and library views all work with four seeded phases.
- Existing users do not lose access to already-introduced review cards after the rebalance.

---

## Workstream 3: Gating Method So Lower Levels Do Not See Higher-Phase Words

This is the design problem that needs to be solved cleanly.

### Brainstormed options

| Option | Behavior | Pros | Cons |
| --- | --- | --- | --- |
| **A. Hard phase cap by player level** | New/unseen seeded words are eligible only when `word.phase <= maxUnlockedPhase(level)` | Simple, deterministic, easy to test | Coarse pacing; level can outrun actual mastery |
| **B. Mastery-based unlocks** | Next phase unlocks only after enough of the current phase is introduced or mastered | Better pacing by actual learning progress | More state, more edge cases, harder UX |
| **C. Hybrid level + mastery gate** | A level threshold and a mastery floor both have to pass | Strongest long-term control | Highest implementation complexity |

### Recommended first shipping method

**Start with Option A: a hard phase cap for unseen seeded words, while grandfathering already-introduced reviews.**

Why this is the best first pass:

- It directly solves the leakage problem the simplest way.
- It matches the current architecture, which already has level-based tier unlocks.
- It is easy to verify in tests and in the dashboard/session flows.
- It keeps the refactor focused on curriculum integrity instead of bundling in a second progression system.

### Recommended behavior for v1 of the refactor

- Compute a `maxUnlockedPhase` from player level.
- Only allow **new/unseen seeded words** from phases `<= maxUnlockedPhase`.
- Continue allowing **due reviews** for words the player has already seen, even if those words now sit in a higher phase after the rebalance.
- Continue allowing **custom words** regardless of seeded phase gating.
- Apply the same gate consistently in:
  - session new-card selection
  - dashboard "new words available" counts
  - word-library browsing/filter defaults
  - any future auto-surfacing of recommended words

### Candidate unlock thresholds

To extend the current cadence cleanly, the default proposal is:

- Phase 1 -> level 1
- Phase 2 -> level 5
- Phase 3 -> level 10
- Phase 4 -> level 15

This keeps the existing `1 / 5 / 10` unlock rhythm and adds a final gate instead of reinventing progression rules at the same time.

### Edge cases that need an explicit rule

#### 1. Already-introduced words after re-tiering

If a player already has review history on a word that gets moved upward into a later phase, that word should remain reviewable. Do **not** strand cards behind a new lock after the player has already been exposed to them.

#### 2. Word library visibility

If the goal is truly "lower levels should not be seeing higher-tier words," decide whether the library should:

- fully hide locked seeded phases by default,
- show locked phases as blurred/locked summaries, or
- allow manual browsing but never session exposure.

**Recommended first pass:** keep locked phases visible as locked sections in the library, but do not surface their words into session generation or "available new" counts.

#### 3. TOT captures on locked higher-phase words

If a low-level player manually records a TOT for a higher-phase seeded word, the system needs a rule.

Recommended first pass:

- store the capture,
- show that the word is tracked,
- but do **not** auto-inject it into normal new-word rotation until the phase unlocks,
- unless there is an explicit manual override path later.

#### 4. Difficulty settings

Difficulty should keep controlling **how many** new words are introduced per day, not **which locked phases** are allowed to leak in.

---

## Recommended Delivery Order

1. Finalize the canonical 700-word ranking and four-phase assignment.
2. Update seed data and any ranking artifacts.
3. Refactor types/config/constants from 3 seeded phases to 4.
4. Update session generation, scheduler filters, stats, and library UI.
5. Add/refresh tests for unlock thresholds, session gating, and grandfathered review behavior.
6. Refresh public and contributor-facing docs once the implementation lands.

---

## Minimum Acceptance Checklist

- [ ] The full 700-word seeded corpus is ranked and assigned to 4 phases.
- [ ] No seeded-word codepath is hard-coded to phases 1-3 only.
- [ ] Level 1 players only get Phase 1 seeded words as new introductions.
- [ ] Higher phases do not leak into lower-level session generation.
- [ ] Already-introduced higher-phase words remain reviewable after the rebalance.
- [ ] Custom words remain accessible.
- [ ] Docs and UI copy stop implying that the seeded curriculum is permanently three-tier.

## Summary

The decision is no longer "should Lexforge maybe keep three tiers or maybe move to four." The development direction is:

- **retier all 700 seeded words**,
- **move to four seeded phases**,
- and **gate unseen higher-phase words out of lower-level play**.

That is the curriculum refactor to execute.