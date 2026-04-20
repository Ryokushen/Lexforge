# Lexforge Project Status

_Last updated: 2026-04-20_

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

- RPG stats now drive both session mode weighting and retrieval-drill timing. The remaining gap is broadening that personalization into deeper context-production / transfer work and other training surfaces.

## Active Next Priorities

1. Expand context mode into deeper production/transfer drills beyond single-word replacement.
2. Broaden stat-aware personalization beyond current retrieval-drill timing into other training surfaces.
3. Add targeted regression tests around newly introduced sync changes (without reworking shipped sync architecture).

## Verification Baseline

- `npm run test` (65 passing tests)
- `npm run build` (Next.js production build + TypeScript checks)

## Scope Guardrail

Before opening a "sync hardening" task, verify a concrete failing case first (test or reproducible bug). Default assumption is that sync hardening is already complete and should not be re-built from scratch.
