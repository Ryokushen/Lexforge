# Lexforge Project Status

_Last updated: 2026-04-24_

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
- Canonical 700-word curriculum across four seeded phases
- Unlock gating for unseen higher-phase words, while preserving already-introduced reviews and custom words
- Vocabulary pipeline stage tracking across seeded, custom, and TOT-captured words
- Word library pipeline badges and stats-page acquisition flow summary
- Word Library Inbox triage for pending captured words, including archive-without-delete behavior

## Current Product Gap

- RPG stats now drive both session mode weighting and retrieval-drill timing, Context mode spans replacement, target-word production, and a first fluent rewrite-transfer prompt, and the vocabulary pipeline now tracks acquisition stage from capture through mature production with Inbox triage for captured words. The remaining gaps are broader stat-aware personalization in other training surfaces, targeted regression coverage around newer sync changes, deeper Context transfer if deterministic grading can stay sane, and post-v2 pipeline depth: archive browsing/restore, duplicate merge workflows, first-class vocabulary item entities, generated practice lanes, coverage metrics, and collocation/chunk modeling.

## Active Next Priorities

1. Broaden stat-aware personalization beyond current retrieval-drill timing into other training surfaces.
2. Add targeted regression tests around newly introduced sync changes (without reworking shipped sync architecture).
3. Deepen Context transfer beyond the current rewrite slice without introducing LLM grading or bloated UX.
4. Evolve the vocabulary pipeline beyond v2 with archive browsing/restore, duplicate merge workflows, first-class vocabulary item entities, generated practice lanes, coverage metrics, and collocation/chunk modeling.
5. Keep the canonical 700-word ranking authoritative for future seed updates. Reference material: [docs/700-word-retiering-plan.md](docs/700-word-retiering-plan.md), [docs/word-frequency-audit.md](docs/word-frequency-audit.md), [docs/word-addition-candidates.md](docs/word-addition-candidates.md).

## Active Work In Progress

- Pipeline v2 triage inbox implementation is complete in worktree `.worktrees/pipeline-v2-triage-inbox` on branch `feature/pipeline-v2-triage-inbox`, pending merge.
- Design doc: [docs/superpowers/specs/2026-04-24-pipeline-v2-triage-inbox-design.md](docs/superpowers/specs/2026-04-24-pipeline-v2-triage-inbox-design.md).
- Implementation plan: [docs/superpowers/plans/2026-04-24-pipeline-v2-triage-inbox.md](docs/superpowers/plans/2026-04-24-pipeline-v2-triage-inbox.md).
- Completed: Tasks 1-6 covering capture triage helpers, seed backfill, training/session gating, Word Library Inbox UI, sync merge preservation, documentation, and full verification.

## Verification Baseline

- `npm run lint`
- `npm run test` (full Vitest suite)
- `npm run build` (Next.js production build + TypeScript checks)

## Scope Guardrail

Before opening a "sync hardening" task, verify a concrete failing case first (test or reproducible bug). Default assumption is that sync hardening is already complete and should not be re-built from scratch.
