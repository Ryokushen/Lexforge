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

- 531 seeded words across three tiers, plus custom words
- Four live training modes: Recall, Context, Rapid Retrieval, and Association
- TOT capture flow for real-world blanking moments, including source, weak substitute, and context
- Difficulty settings that control daily new-word intake
- Tier gating that unlocks harder vocabulary as the player levels up
- Local-first storage with Dexie/IndexedDB
- Optional Supabase sync with GitHub OAuth for cross-device backup of profile state, review data, custom words, associations, and TOT capture summaries
- Review-log sync that keeps daily limits consistent across browsers
- Review-card reconciliation that preserves progressed due cards when a freshly seeded device syncs against an already-trained device
- Sync hardening for normalized word keys, additive TOT capture merges, explicit session IDs in review logs, and background sync recovery
- Partial session progress now saves when you leave training early
- Dashboard quest card now shows backlog separately from the next quest mix
- Session generation is now stat-aware across both mode selection and retrieval drill timing: Recall / Perception / Creativity bias Recall / Rapid Retrieval / Association, and live profile stats now tune rapid-retrieval timeout pressure and rescue-cue timing while preserving rescue/stabilize/fluent drill-stage constraints
- Context mode now has three typed-first variants: replacement prompts for rescue words, target-word sentence production for stabilize words, and fluent rewrite prompts that preserve the original scenario with deterministic grading and cue-aware fallback
- 87 automated tests across scheduler, session, sync, stats helpers, and hooks
- PWA support with offline fallback via Serwist

## Game Modes

| Mode | Trains | Shipped behavior |
|------|--------|------------------|
| **Recall** | Clean definition-to-word retrieval | See a definition and type the word, with hints available only while the word is still in a support phase. |
| **Context** | Word choice in context | Rescue words still use typed replacement with assisted fallback; more stable words can instead ask you to use the target word in your own sentence before cue help appears. |
| **Rapid Retrieval** | Fast verbal access | Read a definition at your own pace, then start a timed retrieval phase where you type the word under an adaptive timer. A rescue cue appears only when the drill profile still calls for it. |
| **Association** | Elaborative encoding | Create a vivid text association for a word, then later recall from that association. |

## Real-World Capture Loop

Lexforge now supports a dedicated TOT capture flow in the word library.

- Log the exact word that stalled in real life.
- Record what you said instead, the surrounding context, and where it happened.
- Save it onto an existing library word or create a new custom word on the spot.
- Surface those captured words earlier in sessions, with extra bias toward Recall and Rapid Retrieval.
- Keep those words in a higher-support drill state until they earn repeated clean exact recalls.
- Sync those captures across devices once the Supabase migrations are applied.

## Adaptive Drilling

Recent retrieval quality now changes how a word is trained.

- `Rescue`: recent TOTs, misses, or cue-heavy recalls keep hints available and use a more generous Rapid Retrieval timer.
- `Stabilize`: once a word starts landing cleanly, the app still favors Recall and Rapid Retrieval but begins tightening time pressure.
- `Fluent`: after repeated clean exact recalls, hint access drops away and Rapid Retrieval can run without a rescue cue.

## RPG Layer

| Stat | Represents | Current use |
|------|------------|-------------|
| **Recall** | Clean word retrieval | Grows from definition-to-word success and now increases the chance of Recall prompts in session mode selection. |
| **Retention** | Long-term review stability | Grows from spaced-review performance over time; still mostly progression-facing for now. |
| **Perception** | Rapid verbal retrieval under time pressure | Grows from Rapid Retrieval results and now increases the chance of Rapid Retrieval prompts. |
| **Creativity** | Association building and contextual flexibility | Grows from association and contextual work and now increases the chance of Association prompts. |

Mode selection is now stat-aware: Recall / Perception / Creativity shape the Recall / Rapid Retrieval / Association mix while still honoring rescue/stabilize/fluent drill-stage guardrails. Retrieval drills are now stat-aware too: Perception tightens Rapid Retrieval timeout pressure, Recall delays rescue cue reveal when a word is stabilizing, and fluent words keep their no-cue safeguards.

Other progression systems:
- XP comes from session performance, streak bonuses, and fast clean retrieval.
- HP decays on missed days and restores on level-up.
- Difficulty changes session size and new-word intake.
- Tier gating unlocks Tier 2 at level 5 and Tier 3 at level 10.

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
    |-- gamification.ts     XP, leveling, HP decay, and stat growth
    |-- sync.ts             Supabase merge and reconciliation logic
    |-- seed-words.ts       531 seeded vocabulary words across three tiers
    |-- sounds.ts           Web Audio API synthesized sound effects
    `-- types.ts            Shared TypeScript types
```

## Getting Started

```bash
npm install
npm run dev
npm run lint
npm run build
```

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

- **Unassisted Recall** — percentage of reviews that were clean exact recalls without cues, with a week-over-week trend arrow
- **Retrieval Speed** — median latency for correct unassisted recalls, with a week-over-week trend arrow
- **Cue-Dependent Words** — words where at least 2 of the last 3 reviews required a cue
- **TOT This Week** — words with a real-world tip-of-the-tongue capture this calendar week
- **In Rescue Stage** — words currently classified as struggling by the adaptive drill system

## Already Shipped (Do Not Re-Implement)

These foundations are already in `master` and should be treated as existing behavior, not backlog:

- Cross-device sync with GitHub OAuth, review-log sync, and review-card reconciliation
- Sync hardening for normalized word keys and additive TOT capture merge behavior
- Explicit `session_id` handling in review logs to preserve same-day multi-device sessions
- Background sync recovery + retry behavior
- Partial session save-on-exit flow and dashboard resume message

## Near-Term Roadmap

For the up-to-date "already shipped vs next" checklist, see [PROJECT_STATUS.md](PROJECT_STATUS.md).

- deepen Context transfer beyond the new fluent rewrite slice into richer scenario variation only if deterministic grading can stay sane
- broaden stat-aware personalization beyond current retrieval-drill timing into other training surfaces
- targeted regression tests around newly introduced sync changes (without reworking shipped sync hardening)
