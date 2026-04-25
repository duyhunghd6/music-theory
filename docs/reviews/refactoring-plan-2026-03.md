# Refactoring plan — 2026-03

<!-- beads-id: rev-rfp26 -->

Phase 1 doc-auditor handoff file was not present at `/private/tmp/refactor-phase1.txt`, so this plan is based on repository inspection only.

## 1. Barrel exports

<!-- beads-id: rev-rfp26-s1 -->

### Missing barrels in `src/components`

<!-- beads-id: rev-rfp26-s2 -->

Add `index.ts` files to these folders and re-export only the public entry points already imported across pages/routes:

- `src/components/ui` — `BugReportModal`, `CollapsiblePanel`, `ConfettiExplosion`, `ControlsBar`, `FeedbackEffects`, `FloatingInstrumentPanel`, `FloatingInstrumentsContainer`, `FloatingInstrumentsToolbar`, `MobileDrawer`, `NotationToggle`, `ProgressRing`, `TimeSignatureSelector`
- `src/components/abc` — `AbcRenderer`
- `src/components/MusicStaff` — `AbcEditor`, `AbcGrandStaff`, `AbcScore`, `GrandStaffView`, `InlineGrandStaff`, `MusicStaff`, `StaffRangeVisualTest`
- `src/components/layout` — `AppLayout`, `BottomNavigation`, `MainHeader`, `MainLayout`, `MobileHeader`, `Sidebar`, `SimpleHeader`, `SubmoduleHeader`
- `src/components/harmony` — `HarmonicTimeline`
- `src/components/theory` — `CircleOfFifths`, `TheoryPanel`, `TopicCard`
- `src/components/navigation` — `ModuleNavigationMenu`
- `src/components/quiz` — `MobileQuiz`
- `src/components/VirtualPiano` — `InlinePiano`, `PianoKey`, `VirtualPiano`
- `src/components/GameLoop` — `FeedbackOverlay`, `PlayButton`
- `src/components/instruments` — `InstrumentPanel`
- `src/components/profile` — `JourneyMap`
- `src/components/VirtualGuitar` — `FretboardWrapper`, `InlineGuitar`, `VirtualGuitar`
- `src/components/lesson` — `LessonCard`, `LessonHeader`
- `src/components/modules` — `AbcDemoSection`, `AccidentalSpotterGame`, `BlackKeyNinjaGame`, `FindTheFrequencyGame`, `GameQuiz`, `HighLowBattleGame`, `InlineAbcNotation`, `InlineQuiz`, `LevelSelector`, `ListenMatchGame`, `Module12GameQuiz`, `Module13GameQuiz`, `ModuleContent`, `NoteHuntGame`, `NoteIdentificationQuiz`, `OctaveChallengeGame`, `ProgressiveTheoryContent`, `SameOrDifferentGame`, `SubmoduleProgressDots`, `TheoryContent`
- `src/components/modules/rhythm` — `AbcNoteSymbol`, `BeatCounterGame`, `BeatStrengthGame`, `DottedValueCalcGame`, `NoteValueIdGame`, `RestIdGame`, `RhythmTapGame`, `TempoTermGame`, `TieOrSlurGame`

### Missing barrels in feature/data/page folders

<!-- beads-id: rev-rfp26-s3 -->

- `src/features/game` and subfolders
- `src/features/audio` and subfolders
- `src/features/sao-truc` and subfolders
- `src/data`
- `src/pages`

### Recommended rollout

<!-- beads-id: rev-rfp26-s4 -->

1. Add barrels at folder boundaries used by routes and pages first.
2. Update imports in `src/App.tsx`, `src/pages/HomePage.tsx`, `src/pages/PracticePage.tsx`, `src/pages/ProfilePage.tsx`, `src/pages/ComposePage.tsx`.
3. Keep deep relative imports inside tightly-coupled internals until move/rename work is done.

## 2. Feature co-location

<!-- beads-id: rev-rfp26-s5 -->

Several feature-specific components still live under generic `components/` even though matching domain logic already exists in `features/`.

### Highest-value moves

<!-- beads-id: rev-rfp26-s6 -->

- Move `src/components/GameLoop/FeedbackOverlay.tsx` into `src/features/game/components/` because it is imported directly by `src/pages/HomePage.tsx:4` and `src/pages/PracticePage.tsx:8` next to `GameOverlay` from the same feature.
- Move `src/components/modules/Module12GameQuiz.tsx` and `src/components/modules/Module13GameQuiz.tsx` into `src/features/game/components/legacy/` or remove them after validating `src/components/game-shell/UniversalGameRouter.tsx:1` has fully replaced them.
- Move `src/components/modules/*Game*.tsx` that represent playable game experiences into `src/features/game/components/` and keep purely educational wrappers in `src/components/modules/`.
- Move `src/components/MusicStaff/AbcEditor.tsx` to an editor/notation feature boundary because it is route-level tooling used by `src/pages/AbcEditorPage.tsx:4` and pulls Monaco directly.
- Move `src/components/VirtualGuitar/FretboardWrapper.tsx` and related fretboard-only rendering into a guitar feature boundary; the heavy third-party rendering and note-mapping logic are closer to a feature than a shared primitive.
- Fold `src/components/modules/ModuleContent.tsx` into theory/course content ownership, since it hardcodes module topic data and theory/harmony panel composition at `src/components/modules/ModuleContent.tsx:8-32`.

### Structural target

<!-- beads-id: rev-rfp26-s7 -->

- `features/game`: orchestration, overlays, journey maps, game components
- `features/notation`: ABC editor, staff rendering entry points, notation helpers
- `features/instruments/guitar|piano|sao-truc`: instrument-specific rendering and interaction
- `components/`: only layout, shared shells, generic UI primitives

## 3. Type safety gaps

<!-- beads-id: rev-rfp26-s8 -->

Top explicit-`any` offenders by count and cleanup priority:

1. `src/pages/IPhonePlayerTestPage.tsx` — lines 98, 186, 207, 214, 221, 240 and nearby; repeated casts against `navigator`, `window`, and `abcjs.synth`
2. `src/components/MusicStaff/AbcGrandStaff.tsx` — lines 109, 517, 542; rendering/control refs rely on `any`
3. `src/types/pitchfinder.d.ts` — lines 12-15; all detector configs typed as `any`
4. `src/components/abc/AbcRenderer.tsx` — lines 373-374; event payload cast as `any`
5. `src/data/game-registry.ts` — lines 26-28; registry stores lazy components as `ComponentType<any>`
6. `src/features/audio/components/AudioUnlocker.test.tsx` — line 19; test store state typed as `any`
7. `src/components/ui/TimeSignatureSelector.test.tsx` — line 17; mocked store selector typed as `any`
8. `src/services/progress-sync.ts` — lines 110, 117; comments/documentation mention `any`, worth checking if helper typings are drifting
9. `src/components/layout/AppLayout.tsx` — line 45 comment indicates permissive shape handling around instrument visibility; check adjacent inferred types
10. `src/components/modules/GameQuiz.tsx` — line 186 comment and surrounding state flow merit typing review because game selection logic is branching by dynamic content

### Priority fixes

<!-- beads-id: rev-rfp26-s9 -->

- Replace platform casts in iPhone/audio test pages with small local interfaces.
- Introduce a common game component prop type for `GAME_REGISTRY` instead of `ComponentType<any>`.
- Tighten abcjs event typing in renderer/staff components.
- Keep test-only `any` removals after production paths are typed.

## 4. Dead code candidates

<!-- beads-id: rev-rfp26-s10 -->

These were checked with repo-wide symbol search before listing.

### Strong candidates

<!-- beads-id: rev-rfp26-s11 -->

- `src/components/modules/Module12GameQuiz.tsx` — exported, but no import sites found; `UniversalGameRouter` explicitly documents replacement.
- `src/components/modules/Module13GameQuiz.tsx` — exported, but no import sites found; appears superseded by game-shell flow.
- `src/services/browser-id.ts` exports `hasBrowserId` and `clearBrowserId` — no references found.
- `src/data/game-registry.ts` exports `getAllGameIds` and `hasGame` — no references found.
- `src/data/practiceLibrary.ts` exports `getAllCategories`, `getCategoryById`, `getTotalCurriculumSongs` — no references found.
- `src/data/chord-voicings.ts` exports `getAllChordNames`, `getFingerLabel` — no references found.
- `src/utils/chord-detection.ts` exports `getVoicingForNotes`, `isKnownChord` — no references found.
- Hooks `src/hooks/useAudioContext.ts`, `src/hooks/useMediaQuery.ts` (`useIsLargeScreen`), `src/hooks/useInstrument.ts`, `src/hooks/useResponsive.ts` (`useBreakpoint`), `src/hooks/usePitchDetect.ts` — exported but no references found.

### Needs validation before removal

<!-- beads-id: rev-rfp26-s12 -->

- `src/components/MusicStaff/StaffRangeVisualTest.tsx` is only lazy-loaded by `src/pages/HomePage.tsx:16-18`; keep if still needed for internal diagnostics, otherwise move behind a test route.
- `src/App.css` is technically referenced by `src/App.tsx:5`, but all selectors appear to be Vite starter leftovers and unreferenced in JSX/CSS usage.

## 5. Bundle splitting

<!-- beads-id: rev-rfp26-s13 -->

Heavy dependencies already identified in source:

- `vexflow` imported eagerly in `src/components/MusicStaff/MusicStaff.tsx:3`
- `@monaco-editor/react` imported eagerly in `src/components/MusicStaff/AbcEditor.tsx:2`
- `@moonwave99/fretboard.js` imported eagerly in `src/components/VirtualGuitar/FretboardWrapper.tsx:13` and `src/pages/FretboardTestPage.tsx:9`

### Recommended lazy boundaries

<!-- beads-id: rev-rfp26-s14 -->

- Wrap the ABC editor route so Monaco loads only on `/abc-editor`.
- Lazy-load VexFlow-backed staff views for routes/panels that are initially collapsed or optional.
- Lazy-load fretboard rendering and the dedicated fretboard test page.
- Keep `src/App.tsx` page-level lazy loading, but add feature-level `React.lazy()` for expensive subpanels still eagerly pulled into `HomePage` and `PracticePage`.

### Best first wins

<!-- beads-id: rev-rfp26-s15 -->

1. Monaco route split
2. Fretboard test route split
3. VexFlow components behind `React.lazy()` or dynamic import wrappers

## 6. CSS consolidation

<!-- beads-id: rev-rfp26-s16 -->

### Immediate issues

<!-- beads-id: rev-rfp26-s17 -->

- `src/App.css` contains only starter-template selectors: `#root`, `.logo`, `logo-spin`, `.card`, `.read-the-docs`. They are imported in `src/App.tsx:5` but not matched elsewhere.
- `src/index.css` duplicates touch target utilities:
  - `--touch-target-min` defined twice at `src/index.css:64` and `src/index.css:84`
  - `.touch-target` defined twice at `src/index.css:151` and `src/index.css:281`
  - `.touch-target-sm` defined twice at `src/index.css:156` and `src/index.css:286`
- `body` is defined twice in `src/index.css:91` and `src/index.css:388` with conflicting font ownership.

### Consolidation plan

<!-- beads-id: rev-rfp26-s18 -->

- Remove unused starter rules from `App.css`, then inline the surviving `#root` layout rule into `index.css` or `App.tsx` layout shell.
- Collapse duplicate touch-target utilities into one source of truth.
- Keep theme tokens near the top of `index.css`, utility classes after them, and feature-specific component CSS moved beside the owning component when not globally reusable.

## 7. Naming conventions

<!-- beads-id: rev-rfp26-s19 -->

Current naming mixes kebab-case directories/files with PascalCase component folders.

### Mixed folder examples

<!-- beads-id: rev-rfp26-s20 -->

- PascalCase folders: `src/components/MusicStaff`, `src/components/VirtualPiano`, `src/components/VirtualGuitar`, `src/components/GameLoop`
- kebab-case folders: `src/components/game-shell`, `src/features/sao-truc`, `src/data/course-data`, `src/data/music-sheets`

### Recommendation

<!-- beads-id: rev-rfp26-s21 -->

- Use kebab-case for directories and non-component modules.
- Use PascalCase only for React component filenames, not folders.
- Normalize feature directories first (`MusicStaff` -> `music-staff`, `VirtualPiano` -> `virtual-piano`, `VirtualGuitar` -> `virtual-guitar`, `GameLoop` -> `game-loop`) and leave component filenames PascalCase.

## Execution order

<!-- beads-id: rev-rfp26-s22 -->

1. Remove confirmed dead exports and obsolete module quiz components.
2. Add barrels for stable public folders.
3. Normalize feature boundaries by moving game/instrument/notation code out of generic `components/`.
4. Tighten `any` hotspots, starting with shared registries and renderers.
5. Apply lazy loading to Monaco, VexFlow, and fretboard paths.
6. Consolidate global CSS and remove `App.css` leftovers.
7. Rename folders to kebab-case after import churn settles.

## Risks

<!-- beads-id: rev-rfp26-s23 -->

- Barrel additions before dead-code cleanup can accidentally preserve obsolete APIs.
- Folder renames will touch many imports; do them after boundaries stabilize.
- VexFlow and fretboard wrappers likely require hydration/loading-state review after lazy loading.
