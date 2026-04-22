# Lexforge Word Addition Candidates

_Generated: 2026-04-22_

## Goal

Find additional seed words that would broaden a learner's vocabulary without drifting into words that are extremely rare, obsolete, or effectively never used.

Development follow-up:

- This candidate set should now be treated as input to the full 700-word curriculum recut, not as a standalone add-on to the old three-tier ordering. See [docs/700-word-retiering-plan.md](700-word-retiering-plan.md).

## Method

- Started from a manually curated pool of useful abstract, academic, professional, and descriptive headwords.
- Removed anything already present in [src/lib/seed-words.ts](../src/lib/seed-words.ts).
- Repaired the candidate list where 35 rows still overlapped the existing seed corpus, replacing them with net-new words from the same compatibility bands.
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

`impact`, `structure`, `technical`, `strategy`, `transfer`, `capacity`, `ensure`, `maintain`, `conflict`, `debate`, `secure`, `instance`, `accurate`, `category`, `external`, `principal`, `trend`, `convention`, `equivalent`, `contrast`, `publication`, `reveal`, `capture`, `priority`, `confirm`, `obtain`, `narrative`, `valid`, `vital`, `currency`, `monitor`, `ratio`, `engage`, `initiative`, `expand`, `indicate`, `outcome`, `contribute`, `progressive`, `prominent`, `radical`, `component`, `ongoing`, `sufficient`, `stability`, `distinct`, `eligible`, `parallel`, `mutual`, `pursue`, `neutral`, `controversial`, `advocate`, `insight`, `preserve`, `structural`, `notion`, `resolve`, `exhibit`, `retain`, `tackle`, `precise`, `variable`, `convert`, `predict`, `assess`, `ethical`, `notable`, `rational`, `interact`, `gauge`, `evaluate`, `theoretical`, `transparent`

Tier 2 additions:

`evident`, `offset`, `adapt`, `colleague`, `construct`, `dense`, `doctrine`, `expose`, `compatible`, `grasp`, `inclusive`, `enforce`, `integral`, `prediction`, `tendency`, `aggregate`, `sustain`, `indicator`, `inequality`, `shortage`, `accountable`, `persistent`, `landmark`, `consume`, `selective`, `consult`, `informal`, `cooperative`, `logistics`, `symbolic`, `autonomous`, `clarify`, `desirable`, `incorporate`, `obscure`, `disclose`, `convey`, `statute`, `persuade`, `revision`, `interpret`, `confront`, `decisive`, `minimize`, `specify`, `credible`, `anticipate`, `eventual`, `quantitative`, `perceive`, `friction`, `illustrate`, `durable`, `govern`, `stimulate`, `earnest`, `endorse`, `inspect`, `maximize`, `differentiate`, `attain`, `isolate`

Tier 3 additions:

`disrupt`, `parameter`, `discrete`, `amend`, `prevail`, `persist`, `collaborate`, `dedicate`, `derive`, `correspond`, `provoke`, `concede`, `intrinsic`, `stabilize`, `qualitative`, `tentative`, `orient`, `simulate`, `ambiguity`, `conserve`, `escalate`, `holistic`, `invoke`, `prioritize`, `enrich`, `reassure`, `refine`, `converge`, `formulate`, `defer`, `devise`, `infer`, `mediate`

## Notes

- This is a compatibility-minded addition set, not a full replacement ranking of the entire corpus.
- Some of these words would likely move phases if the app adopts the 4-phase frequency audit from [docs/word-frequency-audit.md](word-frequency-audit.md).
- The next practical step would be to turn the accepted candidates into full seed entries with definitions, examples, and synonyms.
- The current development plan is to merge these candidates into the canonical 700-word recut and then assign final four-phase placement there, rather than preserving the legacy `suggested_current_tier` buckets as the long-term structure.
