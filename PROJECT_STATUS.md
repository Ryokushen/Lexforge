# Lexforge Project Status

_Last updated: 2026-04-21_

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

- RPG stats now drive both session mode weighting and retrieval-drill timing, and Context mode now spans replacement, target-word production, and a first fluent rewrite-transfer prompt. The remaining gaps are broader stat-aware personalization in other training surfaces, a frequency-grounded pass on seed-word phase ordering, an expansion pass to grow the seed corpus from 531 to roughly 700 words, plus any future Context transfer depth beyond this deterministic rewrite slice.

## Active Next Priorities

1. Broaden stat-aware personalization beyond current retrieval-drill timing into other training surfaces.
2. Add targeted regression tests around newly introduced sync changes (without reworking shipped sync architecture).
3. Re-rank the seeded word list against English usage frequency and decide whether the curriculum should stay at 3 phases or expand to 4. See [docs/word-frequency-audit.md](docs/word-frequency-audit.md).
4. Expand the seed list from 531 to about 700 words using the curated addition set in [docs/word-addition-candidates.md](docs/word-addition-candidates.md).
5. If Context mode needs another step, deepen transfer beyond the current rewrite slice without introducing LLM grading or bloated UX.

## Verification Baseline

- `npm run lint`
- `npm run test` (132 passing tests)
- `npm run build` (Next.js production build + TypeScript checks)

## Scope Guardrail

Before opening a "sync hardening" task, verify a concrete failing case first (test or reproducible bug). Default assumption is that sync hardening is already complete and should not be re-built from scratch.
