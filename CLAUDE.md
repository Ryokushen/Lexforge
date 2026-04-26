@AGENTS.md

# Lexforge

Local-first RPG vocabulary trainer. Next.js 16 App Router, Dexie/IndexedDB, ts-fsrs spaced repetition, optional Supabase sync.

## Quick Reference

```bash
npm run dev      # local dev server
npm run lint     # ESLint
npm run build    # production build (--webpack)
npm run test     # Vitest suite
./scripts/verify.sh   # repo-local lint + test + build helper for Codex desktop
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
- **Context mode now has five prompt variants**: rescue words use replacement-style prompts, stabilize words use typed target-word sentence production, fluent words can get rewrite-transfer prompts, deeply fluent words can get constrained scenario-variation prompts, and collocation routes preserve scene anchors with deterministic grading and cue fallback.
- **Vocabulary coverage has five automatic lanes**: retrieval, context, association, collocation, and transfer. Transfer is earned from scenario-variation logs and routes back through Context; it is included in dashboard coverage signal counts and is not a manual drill picker.
- **Review logs carry retrieval metadata**: `cueLevel`, `retrievalKind`, and `responseTimeMs` on every log entry. These feed back into drill profiles and stats.
- **Sync hardening is already shipped**: normalized word keys, additive TOT merge behavior, explicit `session_id` handling, review-card reconciliation, and retryable background sync are in `master`. Treat these as existing behavior — avoid re-implementing them.
- **RPG stats now influence session generation**: Recall / Perception / Creativity bias Recall / Rapid Retrieval / Association mode weighting in `pickMode`, and live profile stats also personalize Rapid Retrieval timeout pressure, rescue-cue timing, Context scaffolding, association strengthening, and whether deeply fluent Context work advances from rewrite into scenario variation.
- **Next RPG tuning steps**: broaden stat-aware personalization only where tied to prompt quality signals, watch whether coverage transparency needs a compact trend after real usage, and keep the canonical 700-word ranking authoritative for future seed updates.

## Testing

Tests live next to source files (`*.test.ts`, `*.test.tsx`). Vitest with jsdom environment. Mocks for Dexie db and scheduler. Run `npm run test` before committing, or `./scripts/verify.sh` in the Codex desktop environment if the bundled app `node` cannot load native modules.

## Conventions

- TypeScript strict mode
- ESLint with the project config (check `eslint.config.mjs`)
- Framer Motion for animations
- shadcn/ui primitives in `src/components/ui/`
- No external audio assets — all sounds synthesized via Web Audio API
- PWA via Serwist — generated service worker artifacts in `public/` are gitignored from lint
