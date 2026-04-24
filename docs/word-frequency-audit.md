# Lexforge Word Frequency Audit

_Generated: 2026-04-22_

## Goal

Check whether the current seeded vocabulary phases are ordered by English usage frequency, and propose a cleaner frequency-based ranking where needed.

Development follow-up:

- Implemented follow-up: the app now ships the full 700-word seeded corpus across four phases, with gating so lower levels do not see unseen higher-phase words too early. See [docs/700-word-retiering-plan.md](700-word-retiering-plan.md).

## Method

- Parsed the legacy 531-word seed list as it existed when this audit was generated.
- Scored each headword with `wordfreq` 3.1.1 using `zipf_frequency(word, "en")`.
- Interpreted higher Zipf values as more common usage.

Zipf scale reminder:

- `6` ~= once per thousand words
- `3` ~= once per million words
- `0` here means "below the package's floor / effectively very rare"

Important limitation:

- This is a headword-only frequency audit. It does not disambiguate by part of speech or sense.
- The app's current tiers may still be defensible on pedagogical grounds even when they are not strict frequency tiers.

## Current Tier Audit

| Current tier | Count | Mean Zipf | Median Zipf | Range |
| --- | ---: | ---: | ---: | --- |
| Tier 1 | 329 | 3.63 | 3.64 | 1.94 to 5.01 |
| Tier 2 | 137 | 2.94 | 2.92 | 1.36 to 4.91 |
| Tier 3 | 65 | 2.48 | 2.55 | 0.00 to 3.61 |

Pairwise ordering checks:

- Tier 1 beats Tier 2 on frequency in `79.4%` of pairings.
- Tier 1 beats Tier 3 in `92.0%` of pairings.
- Tier 2 beats Tier 3 in `67.1%` of pairings.

Conclusion:

- The current tiers are directionally correct by median frequency.
- They are not cleanly frequency-ordered, especially Tier 1 vs Tier 2 and Tier 2 vs Tier 3.
- Tier 1 is too broad if the goal is strict frequency-first progression.

## Recommended Frequency Ladder

I recommend moving from 3 phases to 4 phases for a cleaner progression based on natural breaks in the score distribution.

Recommended 4-phase boundaries:

- Phase 1: `Zipf > 3.85`
- Phase 2: `3.19 < Zipf <= 3.85`
- Phase 3: `2.45 < Zipf <= 3.19`
- Phase 4: `Zipf <= 2.45`

Recommended phase sizes:

| Recommended phase | Count | Interpretation |
| --- | ---: | --- |
| Phase 1 | 131 | Common educated vocabulary / relatively frequent |
| Phase 2 | 178 | Solid mid-frequency vocabulary |
| Phase 3 | 153 | Less common but still broadly useful |
| Phase 4 | 69 | Rare / advanced / specialized |

Why 4 phases instead of 3:

- A 3-phase recut still leaves a very large middle band.
- 4 phases separates "common educated words" from merely "mid-frequency words" much better.
- It also isolates a genuinely rare tail without overloading the final phase.

## Notable Mismatches

Current Tier 1 words that are frequency-phase 4 candidates:

- `ramification` (`1.94`)
- `decommission` (`2.18`)
- `truncate` (`2.24`)
- `repercussion` (`2.25`)
- `exhaustively` (`2.42`)
- `verbose` (`2.44`)

Current Tier 2 words that look frequency-phase 1:

- `commission` (`4.91`)
- `institute` (`4.80`)
- `scheme` (`4.57`)
- `strategic` (`4.43`)
- `enterprise` (`4.38`)
- `discrimination` (`4.31`)
- `biological` (`4.31`)
- `mechanism` (`4.27`)
- `suspension` (`4.24`)
- `canon` (`4.11`)

Current Tier 3 words that are too common for a final rarity phase:

- `exquisite` (`3.61`)
- `sublime` (`3.48`)
- `melancholy` (`3.39`)
- `porous` (`3.37`)
- `benevolent` (`3.34`)
- `solace` (`3.28`)
- `ardent` (`3.28`)
- `luminous` (`3.24`)
- `reverence` (`3.22`)
- `ethereal` (`3.20`)

## Files

The full ranking export is in:

- [docs/word-frequency-ranking.csv](word-frequency-ranking.csv)

CSV columns:

- `word`
- `current_tier`
- `zipf_frequency`
- `recommended_phase_3`
- `recommended_phase_4`

## Practical Recommendation

If you want the smallest product change:

- Keep 3 unlock tiers, but re-rank by frequency using the `recommended_phase_3` column in the CSV.

If you want the cleanest frequency-first curriculum:

- Move to 4 phases and use the `recommended_phase_4` column as the new canonical ranking.

That is now the active development direction; use this audit as source material and the implementation brief in [docs/700-word-retiering-plan.md](700-word-retiering-plan.md) as the current execution note.
