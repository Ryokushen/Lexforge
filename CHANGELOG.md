# Changelog

All notable changes to this project should be documented in this file.

## [Unreleased] - 2026-04-13

### Added

- Word corpus expanded from 321 to 531 words across all tiers with matching context sentences
  - 429 to 492: diplomatic, processes/systems, financial, risk/probability, sophisticated adverbs
  - 492 to 531: 39 manufacturing/trades words (equipment failures, process/quality, supervision, continuous improvement)
- Stats page redesign: tighter density, color-coded accuracy, RPG stat tiles with watermark icons, new Training History section showing difficulty/tier progress
- Battle scene polish: floating damage numbers, HP-scaled monster shake, VICTORY death celebration, player idle float, improved attack/miss animations
- Keyboard shortcuts: 1-4 for MCQ choices, Enter/Space for next
- Supabase sync: GitHub OAuth login, cross-device progress sync (local-first with cloud backup)
- Auth button in nav bar with user menu and sync status
- Rapid Retrieval mode now uses a typed definition-to-word prompt with a rescue cue and stricter grading for assisted and near-miss answers
- Context mode now starts with typed replacement before offering assisted multiple-choice fallback
- TOT capture flow in the word library now records real-world blanking moments with source, weak substitute, and context, and can create a new custom word if needed
- Adaptive retrieval drilling now keeps recent TOT words in rescue/stabilize phases until they regain repeated clean exact recalls, with hint access and rapid timers changing by recent performance
- Automated coverage now spans 50 tests across scheduler, session, sync, and hook logic

### Changed

- Renamed app from "Memory & Vocabulary" to **Lexforge**
- Nav bar logo: Uncial Antiqua font wordmark replacing PNG logo
- PWA icons updated with Lexforge branding
- Quest card now shows "to review" and "new" separately instead of one overwhelming total
- Dashboard work counts now respect the selected difficulty and current tier unlocks instead of showing all unseen words as available new work
- Fixed dashboard stats initialization so changing difficulty no longer leaves the new-word count stale on first load
- App startup now renders the nav and auth controls immediately while first-run seeding continues in the background
- Auth menu now exposes real cloud-sync status, last successful sync time, and retry controls
- Added a manual "Sync now" action plus attempt/success/error timestamps in the auth menu
- Added global startup/offline banners plus retryable bootstrap failure states for the dashboard, session, and library screens
- Review logs now sync to Supabase so daily new-word limits stay consistent across browsers and login pulls no longer duplicate existing local logs
- Cloud sync now reconciles profile progress, review-card state, and word associations before pushing so newer cross-device changes win instead of being overwritten
- Cloud sync now retries transient failures in the background, resyncs periodically during long signed-in sessions, and preserves same-day work from multiple devices when merged review logs exceed a single profile snapshot
- Review logs now carry explicit `session_id` values, and sync uses them to preserve distinct same-day sessions across devices instead of inferring everything from time gaps
- Added a Supabase migration for the `review_logs` table, indexes, and RLS policies required by review-log sync, including compatibility upgrades for older table shapes
- Daily new-word limits and streak/day tracking now use the player's local calendar day instead of UTC rollover
- Stats page "Words Due" to "To Review" (only counts previously-seen cards past due date)
- Updated public and project documentation to describe Rapid Retrieval as verbal fluency training and to narrow scientific claims around vocabulary retrieval rather than broad brain-training promises
- Session assembly now prioritizes TOT-captured words within due/new buckets and biases them toward Recall and Rapid Retrieval
- Build no longer fails when Supabase env vars are absent; cloud sync now remains optional at build time
- Adjusted ESLint ignores so generated Serwist service worker artifacts in `public/` no longer pollute lint results
- Refactored session and stats hooks for current React Compiler rules
- Made session UI behavior deterministic by replacing render-time randomness with stable session-derived selection
- Simplified prompt reset behavior by relying on keyed remounts for session prompts
- Cleaned minor lint issues across the app

### Verified

- `npm run lint`
- `npm run build`
- `npm run test`
