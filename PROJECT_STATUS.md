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

- RPG stats are still mostly player-facing feedback and do **not yet** strongly drive session generation behavior.

## Active Next Priorities

1. Use RPG stats to influence mode weighting / hint pressure / timer tuning in session generation.
2. Expand context mode into deeper production/transfer drills beyond single-word replacement.
3. Add targeted regression tests around newly introduced sync changes (without reworking shipped sync architecture).

## Verification Baseline

- `npm run test` (59 passing tests)
- `npm run build` (Next.js production build + TypeScript checks)

## Scope Guardrail

Before opening a "sync hardening" task, verify a concrete failing case first (test or reproducible bug). Default assumption is that sync hardening is already complete and should not be re-built from scratch.
