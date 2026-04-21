@AGENTS.md

# Lexforge

Local-first RPG vocabulary trainer. Next.js 16 App Router, Dexie/IndexedDB, ts-fsrs spaced repetition, optional Supabase sync.

## Quick Reference

```bash
npm run dev      # local dev server
npm run lint     # ESLint
npm run build    # production build (--webpack)
npm run test     # Vitest (87 tests)
```

## Architecture

- `src/app/` — Next.js App Router pages (dashboard, session, words library, stats)
- `src/components/` — UI components split by domain (dashboard/, session/, ui/)
- `src/hooks/` — React hooks (use-session, use-stats, use-retrieval-health)
- `src/lib/` — Core logic (session-engine, scheduler, gamification, sync, db, types)

## Key Design Decisions

- **Local-first**: Dexie/IndexedDB is the source of truth. Supabase sync is optional and additive.
- **Build must pass without Supabase env vars**: cloud sync is gated at runtime, not build time.
- **Adaptive drilling**: words move through rescue → stabilize → fluent stages based on recent review performance. The `buildRetrievalDrillProfile` function in session-engine.ts is the source of truth for stage classification.
- **Rapid Retrieval has two phases**: a read phase (untimed, definition displayed) and a retrieval phase (timed countdown). The timer measures recall speed, not reading speed. Grading uses proportional thresholds relative to the timeout.
- **Context mode now has three prompt variants**: rescue words use replacement-style prompts, stabilize words use typed target-word sentence production, and fluent words can get rewrite-transfer prompts that preserve scenario anchors with deterministic grading and cue fallback.
- **Review logs carry retrieval metadata**: `cueLevel`, `retrievalKind`, and `responseTimeMs` on every log entry. These feed back into drill profiles and stats.
- **Sync hardening is already shipped**: normalized word keys, additive TOT merge behavior, explicit `session_id` handling, review-card reconciliation, and retryable background sync are in `master`. Treat these as existing behavior — avoid re-implementing them.
- **RPG stats now influence session generation**: Recall / Perception / Creativity bias Recall / Rapid Retrieval / Association mode weighting in `pickMode`, and live profile stats also personalize Rapid Retrieval timeout pressure plus rescue-cue timing inside `buildRetrievalDrillProfile` while still respecting rescue/stabilize/fluent drill stages.
- **Next RPG tuning step**: deepen context production beyond the current target-word sentence variant and broaden stat-aware personalization into other training surfaces.

## Testing

Tests live next to source files (`*.test.ts`, `*.test.tsx`). Vitest with jsdom environment. Mocks for Dexie db and scheduler. Run `npm run test` before committing.

## Conventions

- TypeScript strict mode
- ESLint with the project config (check `eslint.config.mjs`)
- Framer Motion for animations
- shadcn/ui primitives in `src/components/ui/`
- No external audio assets — all sounds synthesized via Web Audio API
- PWA via Serwist — generated service worker artifacts in `public/` are gitignored from lint
