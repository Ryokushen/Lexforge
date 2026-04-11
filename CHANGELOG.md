# Changelog

All notable changes to this project should be documented in this file.

## [Unreleased] - 2026-04-10

### Added

- Word corpus expanded from 321 → 429 words across all tiers with matching context sentences (leadership, critical thinking, character, academic, change, medical, legal, relationships, time, scale categories)
- Stats page redesign: tighter density, color-coded accuracy, RPG stat tiles with watermark icons, new Training History section showing difficulty/tier progress
- Battle scene polish: floating damage numbers, HP-scaled monster shake, VICTORY death celebration, player idle float, improved attack/miss animations

### Changed

- Updated `README.md` to reflect the shipped feature set: 321 seeded words, live Recall/Context/Speed/Association modes, difficulty settings, tier gating, PWA support, and the current roadmap.
- Adjusted ESLint ignores so generated Serwist service worker artifacts in `public/` no longer pollute lint results.
- Refactored session and stats hooks for current React Compiler rules, removing effect-driven state initialization patterns that were failing lint.
- Made session UI behavior deterministic by replacing render-time randomness with stable session-derived selection in context choice ordering and battle-scene visuals.
- Simplified prompt reset behavior by relying on keyed remounts for session prompts instead of synchronous `setState` calls inside effects.
- Cleaned minor lint issues across the app, including unused imports/types and unescaped apostrophes in the offline page.
- Added a minimal Vitest harness plus 22 unit tests covering scheduler wrappers, session grading/loading logic, gamification formulas, streak and HP handling, and seed idempotency.

### Verified

- `npm run lint`
- `npm run build`
- `npm run test`
