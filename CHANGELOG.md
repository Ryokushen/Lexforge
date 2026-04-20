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
- Cross-device sync now carries custom words and TOT capture summaries, with merge logic that restores custom entries locally before replaying cards, logs, associations, and TOT state
- Automated coverage now spans 53 tests across scheduler, session, sync, and hook logic

### Changed

- Renamed app from "Memory & Vocabulary" to **Lexforge**
- Nav bar logo: Uncial Antiqua font wordmark replacing PNG logo
- PWA icons updated with Lexforge branding
- Quest card now shows "to review" and "new" separately instead of one overwhelming total
- Quest card now also separates total backlog from the exact next-quest mix, so players can see when review overflow is blocking new words
- Dashboard work counts now respect the selected difficulty and current tier unlocks instead of showing all unseen words as available new work
- Fixed dashboard stats initialization so changing difficulty no longer leaves the new-word count stale on first load
- Dashboard stats now refresh automatically after cloud sync completes and when the tab regains focus, so cross-device progress appears without a manual reload
- App startup now renders the nav and auth controls immediately while first-run seeding continues in the background
- Auth menu now exposes real cloud-sync status, last successful sync time, and retry controls
- Added a manual "Sync now" action plus attempt/success/error timestamps in the auth menu
- Added global startup/offline banners plus retryable bootstrap failure states for the dashboard, session, and library screens
- Review logs now sync to Supabase so daily new-word limits stay consistent across browsers and login pulls no longer duplicate existing local logs
- Cloud sync now reconciles profile progress, review-card state, and word associations before pushing so newer cross-device changes win instead of being overwritten
- Cloud sync now retries transient failures in the background, resyncs periodically during long signed-in sessions, and preserves same-day work from multiple devices when merged review logs exceed a single profile snapshot
- Review logs now carry explicit `session_id` values, and sync uses them to preserve distinct same-day sessions across devices instead of inferring everything from time gaps
- Auth restore now relies on Supabase auth events instead of awaiting sync work inside `onAuthStateChange`, fixing the refresh/logout regression seen after OAuth sign-in
- Leaving training early now commits partial session progress, and the session screen exposes an explicit "Leave Session" flow that tells the player how many answered words will be saved
- Added a Supabase migration for the `review_logs` table, indexes, and RLS policies required by review-log sync, including compatibility upgrades for older table shapes
- Daily new-word limits and streak/day tracking now use the player's local calendar day instead of UTC rollover
- Review-card reconciliation now prefers actual scheduler progress over raw `updated_at`, preventing a freshly seeded device from overwriting more advanced due-card state from another device
- Rapid Retrieval now separates a read phase from a timed retrieval phase so the timer measures recall speed, not reading speed
- Rapid Retrieval grading uses a proportional fast threshold (60% of timeout) instead of a static 3s cutoff, and the warning bar scales to 30% of timeout
- Retrieval-only timer ranges tightened for all drill stages now that reading time is excluded
- New Retrieval Health section on the stats page surfaces unassisted recall rate with week-over-week trend, median retrieval speed with trend, cue-dependent word count, weekly TOT incidents, and rescue-stage word count
- Stats page "Words Due" to "To Review" (only counts previously-seen cards past due date)
- Updated public and project documentation to describe Rapid Retrieval as verbal fluency training and to narrow scientific claims around vocabulary retrieval rather than broad brain-training promises
- Session assembly now prioritizes TOT-captured words within due/new buckets and biases them toward Recall and Rapid Retrieval
- Build no longer fails when Supabase env vars are absent; cloud sync now remains optional at build time
- Added a compatibility-safe Supabase migration for per-user `custom_words` and `word_tot_captures` sync, including support for older `custom_words` schemas that already use `word` plus an `id` primary key
- Adjusted ESLint ignores so generated Serwist service worker artifacts in `public/` no longer pollute lint results
- Refactored session and stats hooks for current React Compiler rules
- Made session UI behavior deterministic by replacing render-time randomness with stable session-derived selection
- Simplified prompt reset behavior by relying on keyed remounts for session prompts
- Cleaned minor lint issues across the app

### Verified

- `npm run lint`
- `npm run build`
- `npm run test`
