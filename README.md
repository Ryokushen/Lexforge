# Lexforge

Forge your vocabulary. Lexforge is a local-first RPG vocabulary trainer built around spaced repetition, free recall, cue-based recovery, and mnemonic association. It is designed to help with vocabulary retention, faster word retrieval, and fewer tip-of-the-tongue stalls for trained words.

## Product Positioning

Lexforge is best understood as an evidence-informed vocabulary retrieval trainer, not a generic brain-training app.

What it aims to improve:
- retention of practiced vocabulary
- speed and reliability of retrieving trained words
- recovery of words that are known semantically but hard to access quickly
- replacement of vague default wording with more precise vocabulary

What it does not currently claim:
- visual speed-of-processing training
- broad cognitive-transfer effects
- dementia-risk reduction

## Current Status

- 700 seeded words across four phases, plus custom words
- Four live training modes: Recall, Context, Rapid Retrieval, and Association
- TOT capture flow for real-world blanking moments, including source, weak substitute, and context
- Word Library Inbox and Archive triage for captured words, with Keep, Archive, and Restore decisions before captures enter normal queued training
- Word Library Duplicates workflow for exact normalized duplicate entries, with merge preview, review-history preservation, and conservative metadata cleanup
- Vocabulary pipeline stage tracking across seeded, custom, and TOT-captured words
- `VocabularyItem` coverage routing for retrieval, context, association, collocation, and transfer practice lanes
- Difficulty settings that control daily new-word intake
- Phase gating that unlocks harder vocabulary as the player levels up
- Local-first storage with Dexie/IndexedDB
- Optional Supabase sync with GitHub OAuth for cross-device backup of profile state, review data, custom words, associations, and TOT capture summaries
- Review-log sync that keeps daily limits consistent across browsers
- Review-card reconciliation that preserves progressed due cards when a freshly seeded device syncs against an already-trained device
- Sync hardening for normalized word keys, additive TOT capture merges, explicit session IDs in review logs, and background sync recovery
- Partial session progress now saves when you leave training early
- Dashboard quest card now separates due reviews, eligible new words, and pending capture Inbox items
- Session generation is now stat-aware across mode selection, retrieval drill timing, and prompt support: Recall / Perception / Creativity bias Recall / Rapid Retrieval / Association, live profile stats tune rapid-retrieval timeout pressure and rescue-cue timing, low Recall keeps Context work more scaffolded, and low Creativity keeps flexible-use practice at rewrite or mnemonic-strengthening before harder recall/scene variation
- Context mode now has five typed-first variants: replacement prompts for rescue words, target-word sentence production for stabilize words, fluent rewrite prompts, scenario variation prompts for deeply fluent words, and collocation rewrite prompts with deterministic grading and cue-aware fallback
- Automated test coverage across scheduler, session, sync, stats helpers, and hooks
- PWA support with offline fallback via Serwist

## Game Modes

| Mode | Trains | Shipped behavior |
|------|--------|------------------|
| **Recall** | Clean definition-to-word retrieval | See a definition and type the word, with hints available only while the word is still in a support phase. |
| **Context** | Word choice, transfer, and collocation in context | Rescue words still use typed replacement with assisted fallback; more stable words can ask for target-word production, fluent rewrites, constrained scenario variation, or collocation rewrites; weak Recall keeps support in place longer, and weak Creativity holds deeply fluent words at rewrite before scenario variation. |
| **Rapid Retrieval** | Fast verbal access | Read a definition at your own pace, then start a timed retrieval phase where you type the word under an adaptive timer. A rescue cue appears only when the drill profile still calls for it. |
| **Association** | Elaborative encoding | Create or strengthen a vivid text association for a word, then later recall from that association. |

## Practice Lane Coverage

Lexforge now projects existing `Word` rows into transitional `VocabularyItem` concepts, then tracks whether each concept has been practiced through retrieval, context, association, collocation, and transfer lanes. Session assembly uses those coverage routes to steer missing lanes into compatible prompts without adding a new Dexie table or changing review-card identity.

- Missing retrieval coverage routes to Recall.
- Missing context coverage routes to Context.
- Missing association coverage routes to Association.
- Missing collocation coverage routes to a context-style rewrite prompt that keeps the same scene while replacing the weaker phrase.
- Missing transfer coverage routes to Context so deeply fluent words can earn scenario-variation coverage automatically when their drill profile and stats are ready.
- Expanded Word Library rows show which lanes are practiced or still needed, plus the automatic coverage signal Lexforge can use when session mix allows.
- Stats shows aggregate lane coverage and automatic fill inputs so the training engine is transparent without asking the player to choose drills manually.
- Dashboard quest cards show the same automatic order in plain language: FSRS reviews fill sessions first, eligible new words backfill open slots, and coverage signals shape prompt type inside selected words.

## Real-World Capture Loop

Lexforge now supports a dedicated TOT capture flow in the word library.

- Log the exact word that stalled in real life.
- Record what you said instead, the surrounding context, and where it happened.
- Save it onto an existing library word or create a new custom word on the spot.
- Review pending captures in the Word Library Inbox before they enter normal queued training.
- Keep accepted captures in a higher-support drill state until they earn repeated clean exact recalls.
- Archive captures without deleting the underlying word or losing the recoverable capture record.
- Browse archived captures in the Word Library Archive and restore them back to pending triage when needed.
- Sync capture summaries across devices once the Supabase migrations are applied; triage decisions stay local in this slice and are preserved during remote capture merges.

## Adaptive Drilling

Recent retrieval quality now changes how a word is trained.

- `Rescue`: recent TOTs, misses, or cue-heavy recalls keep hints available and use a more generous Rapid Retrieval timer.
- `Stabilize`: once a word starts landing cleanly, the app still favors Recall and Rapid Retrieval but begins tightening time pressure.
- `Fluent`: after repeated clean exact recalls, hint access drops away and Rapid Retrieval can run without a rescue cue.

## RPG Layer

| Stat | Represents | Current use |
|------|------------|-------------|
| **Recall** | Clean word retrieval | Grows from definition-to-word success, increases the chance of Recall prompts, delays Rapid Retrieval rescue cues when strong, and keeps Context support in place when weak. |
| **Retention** | Long-term review stability | Grows from spaced-review performance over time; still mostly progression-facing for now. |
| **Perception** | Rapid verbal retrieval under time pressure | Grows from Rapid Retrieval results and now increases the chance of Rapid Retrieval prompts. |
| **Creativity** | Association building and contextual flexibility | Grows from association and contextual work, increases the chance of Association prompts when strong, favors mnemonic strengthening when weak, and gates whether deeply fluent Context work advances from rewrite into constrained scenario variation. |

Mode selection is now stat-aware: Recall / Perception / Creativity shape the Recall / Rapid Retrieval / Association mix while still honoring rescue/stabilize/fluent drill-stage guardrails. Retrieval drills are stat-aware too: Perception tightens Rapid Retrieval timeout pressure, Recall delays rescue cue reveal when a word is stabilizing, and fluent words keep their no-cue safeguards. Prompt support also adapts inside selected modes without changing FSRS word scheduling: weak Recall keeps Context scaffolded, while weak Creativity holds flexible-use work at rewrite or mnemonic strengthening before harder transfer.

Other progression systems:
- XP comes from session performance, streak bonuses, and fast clean retrieval.
- HP decays on missed days and restores on level-up.
- Difficulty changes session size and new-word intake.
- Phase gating unlocks Phase II at level 5, Phase III at level 10, and Phase IV at level 15.

## Technical Backbone

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 16 (App Router) | Static-first app shell with modern React patterns |
| Local storage | Dexie.js (IndexedDB) | Typed queries, offline-ready, no mandatory backend |
| Spaced repetition | ts-fsrs | FSRS scheduler for due reviews and long-term retention |
| Animations | Framer Motion | Session transitions, stat growth, battle feedback |
| Sound | Web Audio API | Synthesized feedback tones with no audio assets |
| UI | shadcn/ui + Tailwind | Accessible primitives; game feel comes from motion and styling |
| PWA | Serwist | Service worker generation and offline fallback |
| Sync | Supabase | Optional GitHub-authenticated cloud backup and merge for progress, custom words, associations, and TOT captures |
| Tooling | ESLint + TypeScript + Vitest | Linting, builds, and automated test coverage |

## Architecture

```text
src/
|-- app/                    Next.js App Router pages
|   |-- page.tsx            Dashboard
|   |-- session/page.tsx    Active training session
|   |-- words/page.tsx      Word library, custom word creation, and TOT capture
|   `-- stats/page.tsx      Progress and performance views
|-- components/
|   |-- dashboard/          Character, quest, difficulty, and stat UI
|   `-- session/            Recall, context, rapid retrieval, association, battle, and results
|-- hooks/
|   |-- use-session.ts      Session state machine
|   `-- use-stats.ts        Live profile and derived stats
`-- lib/
    |-- db.ts               Dexie schema (words, reviewCards, reviewLogs, userProfile)
    |-- scheduler.ts        ts-fsrs wrapper
    |-- session-engine.ts   Word selection, grading, and mode picking
    |-- vocabulary-item.ts  Transitional concept bridge and lane coverage projection
    |-- practice-lanes.ts   Coverage-driven practice-lane routing
    |-- pipeline-stage.ts   Vocabulary acquisition lifecycle inference
    |-- gamification.ts     XP, leveling, HP decay, and stat growth
    |-- sync.ts             Supabase merge and reconciliation logic
    |-- seed-words.ts       700 seeded vocabulary words across four phases
    |-- sounds.ts           Web Audio API synthesized sound effects
    `-- types.ts            Shared TypeScript types
```

## Getting Started

```bash
npm install
npm run dev -- --webpack
npm run lint
npm run build
```

Next.js 16 enables Turbopack by default, but Lexforge currently uses Serwist through webpack config. Use `--webpack` for local dev until the service-worker setup is migrated or disabled for Turbopack.

If you are running inside the Codex desktop app and the bundled app `node` fails to load native modules, use the repo-local verification helper instead of `npm`:

```bash
./scripts/verify.sh
./scripts/verify.sh test
./scripts/verify.sh build
```

The helper prefers the Codex workspace runtime Node at `~/.cache/codex-runtimes/...` and falls back to a non-Codex `node` on your `PATH`. You can override it explicitly with `LEXFORGE_NODE_BIN=/path/to/node`.

If you want GitHub auth and cloud sync, create `.env.local` with your Supabase project URL and anon key:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Open [http://localhost:3000](http://localhost:3000). The database auto-seeds on first launch and upgrades the local Dexie profile schema as new fields are added. Without Supabase env vars, Lexforge stays fully local. If you sign in with GitHub, it also syncs profile state, review cards, review logs, word associations, custom words, and TOT capture summaries to Supabase.

If you apply the latest Supabase migrations, cloud sync also carries custom words and TOT capture summaries across devices and uses normalized word keys for safer cross-device merges. Current compatibility migrations:

- [20260413222000_add_custom_words_and_tot_capture_sync.sql](supabase/migrations/20260413222000_add_custom_words_and_tot_capture_sync.sql)
- [20260419000000_add_normalized_word_keys.sql](supabase/migrations/20260419000000_add_normalized_word_keys.sql)

If two devices ever disagree about due-review counts after one of them starts from a fresh seed, update to the latest build and sync from the device with the more progressed review state first. Review-card reconciliation now prefers real scheduler progress over a newer seed timestamp.

## Research Notes

Research documentation lives in the companion Obsidian vault. The current app is aligned with:

- spaced repetition for long-term review timing
- retrieval practice through definition-to-word production
- cue-based recovery for partial retrieval failures
- mnemonic association as elaborative encoding

The app intentionally avoids stronger claims until the mechanics and data support them.

- **Memory Recall and Brain Training** - vocabulary retrieval, tip-of-the-tongue states, and transfer limits
- **Spaced Repetition Algorithms** - FSRS vs. HLR comparison and scheduler selection
- **Gamification Psychology** - reinforcement design, motivation, and overjustification risks
- **Gamification Psychology (Web)** - novelty effects and practical product patterns

## Retrieval Health Stats

The stats page includes a Retrieval Health section that tracks whether training is actually improving retrieval over time:

- **Unassisted Recall** -- percentage of reviews that were clean exact recalls without cues, with a week-over-week trend arrow
- **Retrieval Speed** -- median latency for correct unassisted recalls, with a week-over-week trend arrow
- **Cue-Dependent Words** -- words where at least 2 of the last 3 reviews required a cue
- **TOT This Week** -- words with a real-world tip-of-the-tongue capture this calendar week
- **In Rescue Stage** -- words currently classified as struggling by the adaptive drill system

## Vocabulary Pipeline Stats

The stats page also tracks acquisition lifecycle distribution:

- **Captured** -- words saved from real-world blanking moments
- **Learning** -- words with training started but no stable clean recall
- **Reviewing** -- words with clean recall under FSRS review
- **Productive** -- words successfully used in production or rewrite prompts
- **Coverage lanes** -- `VocabularyItem` projections track retrieval, context, association, collocation, and transfer coverage so sessions can steer missing lanes into the next compatible prompt
- **Mature** -- words with stable recall plus successful production history
- **Recognition to production** -- productive or mature words divided by reviewing-or-later words

## Already Shipped (Do Not Re-Implement)

These foundations are already in `master` and should be treated as existing behavior, not backlog:

- Cross-device sync with GitHub OAuth, review-log sync, and review-card reconciliation
- Sync hardening for normalized word keys, additive TOT capture merge behavior, and local-only auth fallback behavior
- Explicit `session_id` handling in review logs to preserve same-day multi-device sessions
- Background sync recovery + retry behavior
- Partial session save-on-exit flow and dashboard resume message
- Canonical 700-word, four-phase seeded curriculum with unlock gating
- Vocabulary pipeline stage tracking for seeded, custom, and TOT-captured words
- Word Library Inbox and Archive triage for captured words before they enter normal queued training
- Dashboard distinction between eligible new training words, pending capture Inbox items, and automatic session-plan order
- `VocabularyItem` bridge, practice-lane routing, collocation and transfer coverage signals, and aggregate coverage transparency

## Near-Term Roadmap

For the up-to-date "already shipped vs next" checklist, see [PROJECT_STATUS.md](PROJECT_STATUS.md).

- watch whether the five-lane coverage transparency needs a compact dashboard trend after real usage
- broaden stat-aware support only where it can be tied to existing prompt quality signals
- targeted regression tests around newly introduced sync changes (without reworking shipped sync hardening)
- evolve the vocabulary pipeline beyond the transitional `VocabularyItem` bridge only after a concrete persistence design exists
