# Module Overview

<!-- beads-id: prd-mover -->

Last updated: 2026-03-24
Status: verified against `src/data/course-data/`

## Summary

<!-- beads-id: prd-mover-s1 -->

The curriculum currently contains 5 modules and 30 submodules. All modules have typed lesson data and theory content. Interactivity is uneven: Module 1 has the most complete lesson-game wiring, while Modules 2-5 are implemented primarily as theory plus notation/demo content.

## Status table

<!-- beads-id: prd-mover-s2 -->

| Module | Name | Submodules | Implementation status | Interactive status |
| --- | --- | ---: | --- | --- |
| 1 | Cơ bản | 5 | Implemented in `src/data/course-data/module-1/` | Strongest lesson interactivity: ABC demos and registry-driven games are present |
| 2 | Nhịp điệu | 6 | Implemented in `src/data/course-data/module-2/` | Theory content exists; a development-only Module 2 test page exists; no lesson-level `games` arrays found |
| 3 | Thang âm & Giai điệu | 6 | Implemented in `src/data/course-data/module-3/` | Theory and ABC demos present; no lesson-level `games` arrays found |
| 4 | Hòa âm | 7 | Implemented in `src/data/course-data/module-4/` | Theory and ABC demos present; no lesson-level `games` arrays found |
| 5 | Sáng tác | 6 | Implemented in `src/data/course-data/module-5/` | Theory and ABC demos present; no lesson-level `games` arrays found |

## Module details

<!-- beads-id: prd-mover-s3 -->

### Module 1 — Cơ bản

<!-- beads-id: prd-mover-s4 -->
- Path: `/Users/steve/duyhunghd6/music-theory/src/data/course-data/module-1/`
- Submodules: `1.1` through `1.5`
- Focus: staff/clefs, note names, accidentals, tones/semitones, enharmonic notes
- Current state:
  - Uses progressive theory sections.
  - Includes ABC demos.
  - Includes multiple registry-driven games such as `note-id`, `instrument-match`, `staff-placement`, `note-hunt`, `listen-match`, `same-different`, `accidental-spotter`, `black-key-ninja`, `high-low-battle`, `octave-challenge`, and `find-frequency`.
- Status: implemented and actively interactive.

### Module 2 — Nhịp điệu

<!-- beads-id: prd-mover-s5 -->
- Path: `/Users/steve/duyhunghd6/music-theory/src/data/course-data/module-2/`
- Submodules: `2.1` through `2.6`
- Focus: note values, rests, dotted notes, time signatures, compound meter, tempo/BPM
- Current state:
  - Lesson data exists for all 6 submodules.
  - A dedicated `/test-games-m2` page exists for development builds, indicating rhythm-specific implementation/testing work.
  - No `games` arrays were found in the lesson data files, so lesson-page game unlocking is not yet wired the same way as Module 1.
- Status: content-complete, interactive lesson wiring incomplete.

### Module 3 — Thang âm & Giai điệu

<!-- beads-id: prd-mover-s6 -->
- Path: `/Users/steve/duyhunghd6/music-theory/src/data/course-data/module-3/`
- Submodules: `3.1` through `3.6`
- Focus: major scale, key signatures, interval quantity, interval quality, minor scales, pentatonic
- Current state:
  - Theory and ABC demo content are implemented.
  - No lesson-level `games` arrays found.
- Status: content implemented, game layer not yet wired per lesson.

### Module 4 — Hòa âm

<!-- beads-id: prd-mover-s7 -->
- Path: `/Users/steve/duyhunghd6/music-theory/src/data/course-data/module-4/`
- Submodules: `4.1` through `4.7`
- Focus: triads, chord qualities, diatonic chords, Roman numerals, circle of fifths, inversions, seventh chords
- Current state:
  - Theory and ABC demo content are implemented.
  - No lesson-level `games` arrays found.
- Status: content implemented, game layer not yet wired per lesson.

### Module 5 — Sáng tác

<!-- beads-id: prd-mover-s8 -->
- Path: `/Users/steve/duyhunghd6/music-theory/src/data/course-data/module-5/`
- Submodules: `5.1` through `5.6`
- Focus: chord progressions, cadences, melodic contour, song structure, dynamics, modulation
- Current state:
  - Theory and ABC demo content are implemented.
  - No lesson-level `games` arrays found.
- Status: content implemented, game layer not yet wired per lesson.

## Cross-module behavior

<!-- beads-id: prd-mover-s9 -->

- All lesson pages are driven by the shared `Submodule` type in `/Users/steve/duyhunghd6/music-theory/src/data/course-data/types.ts`.
- Lesson theory is revealed progressively via `/Users/steve/duyhunghd6/music-theory/src/components/modules/ProgressiveTheoryContent.tsx`.
- When a submodule has a `games` array, `/Users/steve/duyhunghd6/music-theory/src/pages/SubmodulePage.tsx` routes those games through `/Users/steve/duyhunghd6/music-theory/src/components/game-shell/UniversalGameRouter.tsx`.
- Progress is tracked in `/Users/steve/duyhunghd6/music-theory/src/stores/useProgressStore.ts`.

## Gaps to keep visible

<!-- beads-id: prd-mover-s10 -->

1. Module 1 is ahead of the rest in lesson-game integration.
2. Module 2 has rhythm-specific implementation and testing artifacts, but that work is not represented as lesson-level game configs in course data.
3. Existing documentation that claims all modules are equally complete on interactive mechanics is inaccurate.
