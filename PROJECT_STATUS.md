# Lexforge Project Status

_Last updated: 2026-04-25_

This file is the quick "do not redo work" reference for contributors.

## Shipped Foundations (Do Not Re-Implement)

These capabilities are already in `master` and should be treated as baseline behavior:

- Cross-device sync via Supabase + GitHub OAuth
- Review-log sync with explicit `session_id` handling
- Review-card reconciliation that preserves progressed scheduler state
- Sync key hardening with normalized word keys
- Additive TOT capture merge behavior (count/event preservation)
- Local-only Supabase auth fallback so session completion does not crash without cloud env vars
- Background sync retry and recovery behavior
- Partial session save-on-exit flow with dashboard resume messaging
- Quest-card separation of due reviews, eligible new words, pending capture Inbox items, and next-session mix
- Canonical 700-word curriculum across four seeded phases
- Unlock gating for unseen higher-phase words, while preserving already-introduced reviews and custom words
- Vocabulary pipeline stage tracking across seeded, custom, and TOT-captured words
- Word library pipeline badges and stats-page acquisition flow summary
- Word Library Inbox and Archive triage for pending or archived captured words, including restore-without-training behavior
- Word Library Duplicates workflow for exact normalized duplicate entries, with local merge preview, review-log reassignment, strongest-card preservation, conservative metadata merge, and absorbed local-row cleanup
- First-class `VocabularyItem` bridge over `Word`, generated practice-lane routing, vocabulary coverage summaries, and collocation practice-unit scaffolding
- Practice-lane session integration: session words carry coverage routes, missing lanes can force the relevant mode, and collocation routes now produce deterministic context-style rewrite prompts

## Current Product Gap

- RPG stats now drive both session mode weighting and retrieval-drill timing, Context mode spans replacement, target-word production, fluent rewrite-transfer, and collocation rewrite prompts, and the vocabulary pipeline now tracks acquisition stage from capture through mature production with Inbox, Archive, Duplicates, `VocabularyItem`, coverage, and generated practice-lane foundations. The dashboard distinguishes eligible new training words from pending capture Inbox items. The remaining gaps are making coverage and lane recommendations more visible to users, broadening stat-aware personalization in other training surfaces, and deeper Context transfer if deterministic grading can stay sane.

## Active Next Priorities

1. Surface vocabulary coverage and practice-lane recommendations in user-facing progress views without adding busywork UI.
2. Broaden stat-aware personalization beyond current retrieval-drill timing into other training surfaces.
3. Deepen Context transfer beyond the current rewrite/collocation slices without introducing LLM grading or bloated UX.
4. Evolve the vocabulary pipeline beyond the transitional `VocabularyItem` bridge only after a persistence design is concrete.
5. Keep the canonical 700-word ranking authoritative for future seed updates. Reference material: [docs/700-word-retiering-plan.md](docs/700-word-retiering-plan.md), [docs/word-frequency-audit.md](docs/word-frequency-audit.md), [docs/word-addition-candidates.md](docs/word-addition-candidates.md).

## Active Work In Progress

- No active feature worktree is open.
- Design doc: [docs/superpowers/specs/2026-04-24-pipeline-v2-triage-inbox-design.md](docs/superpowers/specs/2026-04-24-pipeline-v2-triage-inbox-design.md).
- Implementation plan: [docs/superpowers/plans/2026-04-24-pipeline-v2-triage-inbox.md](docs/superpowers/plans/2026-04-24-pipeline-v2-triage-inbox.md).
- Completed Pipeline v2 Tasks 1-6 covering capture triage helpers, seed backfill, training/session gating, Word Library Inbox UI, sync merge preservation, documentation, and full verification.
- Completed follow-up: dashboard now shows pending capture Inbox count separately from eligible new training words.
- Completed follow-up: local-only Supabase auth fallback prevents post-session crashes when cloud env vars are absent.
- Completed follow-up: Word Library Archive browsing and Restore for archived captures, plus AppStatusBanner hydration stabilization.
- Completed follow-up: Word Library Duplicates browsing and local merge workflow for exact normalized duplicates, preserving review continuity while removing absorbed duplicate rows.
- Completed follow-up: `VocabularyItem` bridge, generated practice-lane routing, coverage summaries, collocation practice scaffolding, and session integration for missing lane practice.

## Verification Baseline

- `npm run lint`
- `npm run test` (full Vitest suite)
- `npm run build` (Next.js production build + TypeScript checks)

## Scope Guardrail

Before opening a "sync hardening" task, verify a concrete failing case first (test or reproducible bug). Default assumption is that sync hardening is already complete and should not be re-built from scratch.
