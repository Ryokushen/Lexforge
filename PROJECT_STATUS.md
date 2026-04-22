# Lexforge Project Status

_Last updated: 2026-04-22_

This file is the quick "do not redo work" reference for contributors.

## Shipped Foundations (Do Not Re-Implement)

These capabilities are already in `master` and should be treated as baseline behavior:

- Cross-device sync via Supabase + GitHub OAuth
- Review-log sync with explicit `session_id` handling
- Review-card reconciliation that preserves progressed scheduler state
- Sync key hardening with normalized word keys
- Additive TOT capture merge behavior (count/event preservation)
- Background sync retry and recovery behavior
- Partial session save-on-exit flow with dashboard resume messaging
- Quest-card separation of total backlog vs next-session mix

## Current Product Gap

- RPG stats now drive both session mode weighting and retrieval-drill timing, and Context mode now spans replacement, target-word production, and a first fluent rewrite-transfer prompt. The remaining gaps are broader stat-aware personalization in other training surfaces, targeted regression coverage around newer sync changes, and the curriculum refactor to retier the full 700-word seed corpus from easiest/most common to hardest/least common, expand the seeded progression from 3 phases to 4, and harden unlock gating so lower levels do not see unseen higher-phase words too early.

## Active Next Priorities

1. Broaden stat-aware personalization beyond current retrieval-drill timing into other training surfaces.
2. Add targeted regression tests around newly introduced sync changes (without reworking shipped sync architecture).
3. Finalize the canonical 700-word ranking by merging the current 531 seeded words with the curated 169-word addition set, then retier the entire corpus from easiest/most common to hardest/least common. Working brief: [docs/700-word-retiering-plan.md](docs/700-word-retiering-plan.md). Source material: [docs/word-frequency-audit.md](docs/word-frequency-audit.md), [docs/word-addition-candidates.md](docs/word-addition-candidates.md).
4. Refactor the app from 3 seeded phases to 4, including unlock thresholds, tier/phase metadata, session generation, stats views, and word-library displays.
5. Implement and verify a gating method that keeps unseen higher-phase words out of lower-level play while still allowing already-introduced reviews and custom words.
6. If Context mode needs another step after the curriculum work, deepen transfer beyond the current rewrite slice without introducing LLM grading or bloated UX.

## Verification Baseline

- `npm run lint`
- `npm run test` (132 passing tests)
- `npm run build` (Next.js production build + TypeScript checks)

## Scope Guardrail

Before opening a "sync hardening" task, verify a concrete failing case first (test or reproducible bug). Default assumption is that sync hardening is already complete and should not be re-built from scratch.
