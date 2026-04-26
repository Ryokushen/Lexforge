# Paper-Cutout Battle Rig Design

Date: 2026-04-26
Status: approved for implementation planning

## Goal

Upgrade the existing session `BattleScene` from a mostly static monster card into a clean illustrated combat vignette. The first implementation should make correct answers feel like a quick sword strike against a monster without slowing the training loop or turning the session into a separate game.

This is a first art-and-motion pass, not a full combat system.

## Chosen Direction

Use a paper-cutout layered SVG rig.

- The player and monster are built from simple SVG parts rather than raster sprites, canvas, or 3D.
- Framer Motion animates individual parts such as sword arm, body, monster recoil, damage flash, and shadows.
- The look should be clean illustrated fantasy: readable silhouettes, parchment-compatible colors, sharp mobile rendering, and restrained ornament.
- The prompt remains the primary task. Combat feedback is a fast consequence of the answer.

## Why This Approach

Layered SVG assets fit the current app best because `BattleScene` is already a React component, `framer-motion` is already installed, and the app already uses SVG sigils and illustrated RPG UI. SVGs are small, responsive, themeable, and easy to animate in React without introducing a new runtime.

Alternatives rejected for the first pass:

- 3D models: too heavy for the current UI and higher risk on phones.
- Lottie/Rive/Spine: useful later, but adds authoring/tooling overhead before the motion contract is proven.
- Flat single SVGs: simple, but only support whole-object shakes and fades.
- Sprite sheets: viable, but less flexible for recoloring enemy families and prompt-specific attack variants.

## User Experience

During a training session, the battle area remains above the prompt, as it does now. The player character stands on the left and the monster stands on the right.

Answer feedback:

- Correct answer: player lunges forward, sword arm slashes, slash flash appears, monster recoils, monster HP drops by one visible unit.
- Incorrect answer: monster jolts forward, player shakes or guard flashes, no monster HP is removed.
- Session complete: monster enters a defeat pose or fades under a "Fallen" overlay.
- Idle state: both rigs have subtle breathing or stance motion, but no looping animation should distract from reading the prompt.

Timing:

- Main hit response should resolve in about 500-800ms.
- The user should never be forced to wait for a long animation before advancing.
- Motion must be quick enough for repeated 10-15 card sessions.

## Asset Structure

Create rig components that render SVG part groups. They should not depend on session business logic.

Player rig parts:

- shadow
- legs or stance base
- torso/cloak
- head
- off-hand or shield arm
- sword arm
- sword

Monster rig parts:

- shadow
- body silhouette
- head or face
- arms/claws
- eyes or weak-point accent
- damage flash overlay

The first pass can use inline SVG component art. If the art grows large, move path data into local helper components or asset modules. Do not introduce external image downloads for this slice.

## Component Design

Keep `BattleScene` as the integration point and split visual rigs into smaller components.

Proposed files:

- `src/components/session/battle-scene.tsx`: owns session-derived battle state, HP, selected monster, and event selection.
- `src/components/session/battle-rigs.tsx`: exports `PlayerRig` and `MonsterRig` SVG components.
- `src/components/session/battle-scene.test.tsx`: validates HP, hit/miss labels, and defeat state.

The split is intended to keep session state separate from SVG part implementation. The rig components should accept a small state prop and render motion variants.

## Animation Contract

Use a small event contract:

```ts
type BattleEvent =
  | "idle"
  | "player-hit"
  | "monster-attack"
  | "monster-defeated";
```

`BattleScene` derives the event from `lastResult`:

- no `lastResult`: `idle`
- correct result and remaining HP > 0: `player-hit`
- correct result and remaining HP === 0: `monster-defeated`
- incorrect result: `monster-attack`

The actual HP count remains based on `results.filter((r) => r.correct).length`, matching current behavior.

## Prompt-Type Styling

The first pass implements one default Blade Strike style for every correct answer. It should keep the data shape open for future prompt-specific accents, but the visual mapping below is follow-up guidance rather than required first-pass scope.

Future mapping:

- Recall: gold blade strike
- Rapid Retrieval: green quick thrust
- Context: blue rune-edged slash
- Association: sage guard or banner flare
- Scenario/Transfer: heavier gold finisher

## Accessibility And Preferences

- Respect reduced motion by minimizing movement and using opacity/color feedback instead.
- The battle scene should be decorative feedback, not required to understand correctness.
- Text feedback in `ReviewResult` remains the authoritative explanation.
- SVGs should use `aria-hidden` unless a concise accessible label is needed for the full scene.

## Mobile Constraints

- The battle area must stay compact above the prompt.
- No text may overlap the prompt, answer input, or leave-session controls.
- HP bars and labels should remain readable on narrow screens.
- Use responsive SVG view boxes and stable dimensions to avoid layout shift during hit animations.

## Testing

Add focused tests for behavior that can regress:

- correct results reduce monster HP display
- incorrect results do not reduce monster HP display
- final correct answer shows defeat state
- incorrect results derive the `monster-attack` event
- reduced-motion rendering avoids movement when the component exposes a deterministic branch; otherwise verify reduced-motion behavior manually during browser review

Do not write tests that assert exact SVG path data or frame-by-frame animation internals.

## Out Of Scope

- Inventory, equipment, damage numbers beyond one HP per correct answer
- Monster AI or turn order
- Collectible monsters
- Generated art pipeline
- 3D rendering
- Audio
- Long cutscenes or blocking combat transitions

## Success Criteria

- Training still feels fast.
- Correct answers have a clear sword-strike payoff.
- Incorrect answers have clear but non-punitive feedback.
- The art style reads as clean illustrated fantasy on desktop and phone.
- The implementation stays inside the existing session UI architecture.
