# Changelog

All notable changes to this project should be documented in this file.

## [Unreleased] - 2026-04-11

### Added

- Word corpus expanded from 321 → 531 words across all tiers with matching context sentences
  - 429 → 492: diplomatic, processes/systems, financial, risk/probability, sophisticated adverbs
  - 492 → 531: 39 manufacturing/trades words (equipment failures, process/quality, supervision, continuous improvement)
- Stats page redesign: tighter density, color-coded accuracy, RPG stat tiles with watermark icons, new Training History section showing difficulty/tier progress
- Battle scene polish: floating damage numbers, HP-scaled monster shake, VICTORY death celebration, player idle float, improved attack/miss animations
- Keyboard shortcuts: 1-4 for MCQ choices, Enter/Space for next
- Supabase sync: GitHub OAuth login, cross-device progress sync (local-first with cloud backup)
- Auth button in nav bar with user menu and sync status

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
- Added a Supabase migration for the `review_logs` table, indexes, and RLS policies required by review-log sync, including compatibility upgrades for older table shapes
- Daily new-word limits and streak/day tracking now use the player’s local calendar day instead of UTC rollover
- Stats page "Words Due" → "To Review" (only counts previously-seen cards past due date)
- Updated `README.md` to reflect the shipped feature set
- Adjusted ESLint ignores so generated Serwist service worker artifacts in `public/` no longer pollute lint results
- Refactored session and stats hooks for current React Compiler rules
- Made session UI behavior deterministic by replacing render-time randomness with stable session-derived selection
- Simplified prompt reset behavior by relying on keyed remounts for session prompts
- Cleaned minor lint issues across the app
- Added a minimal Vitest harness plus 22 unit tests

### Verified

- `npm run lint`
- `npm run build`
- `npm run test`
