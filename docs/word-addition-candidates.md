# Lexforge Word Addition Candidates

_Generated: 2026-04-22_

## Goal

Find additional seed words that would broaden a learner's vocabulary without drifting into words that are extremely rare, obsolete, or effectively never used.

Development follow-up:

- This candidate set should now be treated as input to the full 700-word curriculum recut, not as a standalone add-on to the old three-tier ordering. See [docs/700-word-retiering-plan.md](700-word-retiering-plan.md).

## Method

- Started from a manually curated pool of useful abstract, academic, professional, and descriptive headwords.
- Removed anything already present in [src/lib/seed-words.ts](../src/lib/seed-words.ts).
- Scored candidates with `wordfreq` Zipf frequency for English.
- Kept words above a practical floor of roughly `Zipf 3.1+`, which is still uncommon enough to feel vocabulary-building but not so rare that the words are fringe.
- Assigned a `suggested_current_tier` for compatibility with the app's current 3-tier system:
  - Tier 1: `Zipf >= 4.0`
  - Tier 2: `3.6 <= Zipf < 4.0`
  - Tier 3: `3.1 <= Zipf < 3.6`

Reference points for the method:

- Oxford says the Oxford 3000/5000 lists are chosen using both corpus frequency and learner relevance: [Oxford 3000 and 5000 overview](https://www.oxfordlearnersdictionaries.com/us/about/wordlists/oxford3000-5000).
- Oxford also publishes an Academic Word List for advanced learners: [Oxford Academic Word List](https://www.oxfordlearnersdictionaries.com/us/wordlist/american_english/academic/).
- `wordfreq` defines Zipf values as log-scaled frequency, where `6` is about once per thousand words and `3` is about once per million: [wordfreq README](https://github.com/rspeer/wordfreq).

## Result

- Current seeded total: `531`
- Proposed additions: `169`
- New total if accepted: `700`

Suggested tier split for the current 3-tier app:

- Tier 1 additions: `74`
- Tier 2 additions: `62`
- Tier 3 additions: `33`

## Files

Exact list with frequency scores:

- [docs/word-addition-candidates.csv](word-addition-candidates.csv)

CSV columns:

- `word`
- `zipf_frequency`
- `suggested_current_tier`
- `selection_bucket`

## Candidate Words

Tier 1 additions:

`impact`, `structure`, `strategy`, `capacity`, `maintain`, `conflict`, `debate`, `secure`, `accurate`, `external`, `principal`, `trend`, `equivalent`, `contrast`, `reveal`, `capture`, `confirm`, `obtain`, `narrative`, `valid`, `vital`, `genuine`, `monitor`, `comprehensive`, `engage`, `initiative`, `objective`, `expand`, `indicate`, `outcome`, `sequence`, `contribute`, `progressive`, `foster`, `prominent`, `radical`, `sufficient`, `dynamic`, `distinct`, `eligible`, `framework`, `mutual`, `pursue`, `neutral`, `controversial`, `legitimate`, `advocate`, `implement`, `insight`, `preserve`, `scenario`, `resolve`, `exhibit`, `retain`, `protocol`, `tackle`, `precise`, `variable`, `convert`, `consensus`, `innovative`, `inevitable`, `predict`, `assess`, `ethical`, `notable`, `rational`, `interact`, `authentic`, `transform`, `gauge`, `evaluate`, `theoretical`, `transparent`

Tier 2 additions:

`evident`, `facilitate`, `adapt`, `construct`, `dense`, `doctrine`, `expose`, `grasp`, `incentive`, `mandate`, `enforce`, `integral`, `viable`, `aggregate`, `robust`, `mentor`, `sustain`, `accountable`, `landmark`, `leverage`, `selective`, `verify`, `consult`, `informal`, `logistics`, `symbolic`, `autonomous`, `clarify`, `desirable`, `incorporate`, `obscure`, `disclose`, `convey`, `imply`, `persuade`, `interpret`, `confront`, `hierarchy`, `precedent`, `specify`, `credible`, `initiate`, `anticipate`, `eventual`, `quantitative`, `feasible`, `integrate`, `friction`, `illustrate`, `durable`, `reinforce`, `govern`, `stimulate`, `earnest`, `plausible`, `coherent`, `endorse`, `inspect`, `maximize`, `empirical`, `attain`, `isolate`

Tier 3 additions:

`disrupt`, `parameter`, `discrete`, `amend`, `prevail`, `persist`, `collaborate`, `dedicate`, `derive`, `correspond`, `provoke`, `concede`, `intrinsic`, `stabilize`, `qualitative`, `tentative`, `orient`, `simulate`, `conserve`, `escalate`, `holistic`, `invoke`, `bolster`, `prioritize`, `enrich`, `reassure`, `refine`, `converge`, `formulate`, `defer`, `devise`, `infer`, `mediate`

## Notes

- This is a compatibility-minded addition set, not a full replacement ranking of the entire corpus.
- Some of these words would likely move phases if the app adopts the 4-phase frequency audit from [docs/word-frequency-audit.md](word-frequency-audit.md).
- The next practical step would be to turn the accepted candidates into full seed entries with definitions, examples, and synonyms.
- The current development plan is to merge these candidates into the canonical 700-word recut and then assign final four-phase placement there, rather than preserving the legacy `suggested_current_tier` buckets as the long-term structure.
