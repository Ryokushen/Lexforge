# Lexforge

Forge your vocabulary. A gamified RPG vocabulary trainer that maps every game mechanic to clinically-evidenced cognitive training techniques. Built to fight vocabulary regression and lethologica (tip-of-the-tongue states).

## The Idea

Existing brain games are either fun but unscientific (Wordle, random trivia), or scientific but miserable to use (Anki). This app maps every game mechanic directly to the technique with the strongest clinical evidence, then wraps it in RPG progression so you actually open it every day.

Your character's stats reflect your real cognitive training, not arbitrary points.

## Current Status

- 321 seeded words plus custom-word support
- Four live training modes: Recall, Context, Speed, and Association
- Difficulty settings that control daily new-word intake
- Tier gating that unlocks harder vocabulary as the player levels up
- Supabase sync with GitHub OAuth for cross-device progress backup
- Review-log sync that keeps daily limits consistent across browsers
- PWA support with offline fallback via Serwist

## Game Modes

| Mode | Trains | How It Works |
|------|--------|-------------|
| **Recall** | Phonological retrieval | See a definition, type the word. No multiple choice — pure production. |
| **Context** | Real-life word selection | See a sentence with a weak word highlighted, pick a more precise replacement from 4 choices. |
| **Speed** | Speed-of-processing | Match a word to the correct definition before the countdown expires. |
| **Association** | Dual coding | Create a vivid mental image for a word, then later recall the word from that image. |

## RPG System

| Stat | Cognitive Skill | Evidence |
|------|----------------|----------|
| Recall | Phonological retrieval | Directly exercises the pathway that fails during tip-of-tongue states |
| Retention | Spaced repetition | 45% better recall vs. traditional schedules (Duolingo HLR study, 220M reviews) |
| Perception | Speed-of-processing | 20-year longitudinal data; 25% dementia risk reduction |
| Creativity | Visual association | 76% recall improvement via dual coding |

- **XP** from correct answers, streak bonuses, speed bonuses
- **HP** decays on missed days (mirrors real memory decay, floor at 20 — never zero)
- **Leveling** scales at 1.5x per level, restores HP on level-up
- **Difficulty** adjusts session size and daily introduction rate
- **Tier gating** unlocks Tier 2 at level 5 and Tier 3 at level 10

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 16 (App Router) | Static-first app shell with modern React compiler rules |
| Local storage | Dexie.js (IndexedDB) | Typed queries, offline-ready, no backend needed |
| Spaced repetition | ts-fsrs | State-of-the-art scheduler, what Anki switched to |
| Animations | Framer Motion | Card transitions, XP counters, level-up effects |
| Sound | Web Audio API | Synthesized feedback tones, zero audio files |
| UI | shadcn/ui + Tailwind | Accessible primitives, game feel comes from Framer Motion |
| PWA | Serwist | Service worker generation and offline fallback |
| Tooling | ESLint + TypeScript + Vitest | Lint, build, and unit tests are active |

## Architecture

```
src/
├── app/                    Next.js App Router pages
│   ├── page.tsx            Dashboard (character banner, quest card, difficulty)
│   ├── session/page.tsx    Active training session
│   ├── words/page.tsx      Word library with search + add custom words
│   └── stats/page.tsx      Detailed progress and performance
├── components/
│   ├── dashboard/          Character, quest, difficulty, and stat UI
│   └── session/            Recall, context, speed, association, combat, results
├── hooks/
│   ├── use-session.ts      Session state machine (idle → active → reviewing → complete)
│   └── use-stats.ts        Live profile + due count from IndexedDB
└── lib/
    ├── db.ts               Dexie schema (words, reviewCards, reviewLogs, userProfile)
    ├── scheduler.ts        ts-fsrs wrapper (create, grade, query due cards)
    ├── session-engine.ts   Word selection, grading (edit distance + exact match), mode picking
    ├── gamification.ts     XP formula, leveling, HP decay, stat growth
    ├── context-sentences.ts Shared sentence bank for Context Mode
    ├── seed-words.ts       321 seeded vocabulary words across three tiers
    ├── sounds.ts           Web Audio API synthesized sound effects
    └── types.ts            All TypeScript interfaces
```

## Getting Started

```bash
npm install
npm run dev
npm run lint
npm run build
```

Create `.env.local` with your Supabase project URL and anon key:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Open [http://localhost:3000](http://localhost:3000). The database auto-seeds on first launch and upgrades the local Dexie profile schema as new fields are added. If you sign in with GitHub, Lexforge also syncs profile state, review cards, review logs, and word associations to Supabase.

## Research Foundation

Built on research documented in the companion Obsidian vault:

- **Memory Recall and Brain Training** — spaced repetition, dual coding, speed-of-processing evidence
- **Spaced Repetition Algorithms** — FSRS vs. HLR vs. MEMORIZE comparison, ts-fsrs validation
- **Gamification Psychology** — SDT framework, overjustification effect, deep vs. shallow mechanics
- **Gamification Psychology (Web)** — Octalysis Framework, novelty effect data

## Roadmap

- [ ] Web Push notifications ("Your words are decaying")
- [ ] Broaden automated coverage beyond the current core sync/gameplay tests
- [ ] More curated context sentences and association content
