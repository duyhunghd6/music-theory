# Architecture

<!-- beads-id: doc-arch -->

Last updated: 2026-03-24
Status: synced to current code

## Overview

<!-- beads-id: doc-arch-s1 -->

This app is a client-side React + TypeScript + Vite music theory course. It ships five curriculum modules from pitch fundamentals through harmony/composition, renders notation with both abcjs and VexFlow, uses Zustand for app state, persists learner progress locally with IndexedDB-backed storage, and optionally syncs progress to Supabase when environment variables are configured.

The runtime entry point is `/Users/steve/duyhunghd6/music-theory/src/main.tsx`, which mounts `/Users/steve/duyhunghd6/music-theory/src/App.tsx`. Routing uses `BrowserRouter` and lazy-loaded pages for the heavier lesson and test surfaces.

## Runtime flow

<!-- beads-id: doc-arch-s2 -->

1. `src/main.tsx` mounts `App`.
2. `src/App.tsx` initializes theme handling, bug-report interceptors, streak updates, and cloud progress bootstrap.
3. Routes render profile/home, lesson pages, practice, and editor/demo pages in shipped builds; test/debug pages are mounted only when `import.meta.env.DEV` is true.
4. `src/pages/SubmodulePage.tsx` loads lesson data from `src/data/course-data/`, reveals theory progressively, unlocks ABC demos and game content, and writes progress back through Zustand stores.
5. Floating instrument UI and bug-report UI stay mounted globally.

## Current src tree

<!-- beads-id: doc-arch-s3 -->

```text
src/
├── App.tsx                     # Root router, app bootstrap, lazy route registration
├── App.css                     # App-level styles
├── index.css                   # Global styles
├── main.tsx                    # React entry point
├── assets/                     # Static assets used by the client bundle
├── components/                 # UI building blocks, notation, layout, games, and navigation
│   ├── GameLoop/               # Playback controls and loop feedback UI
│   ├── MusicStaff/             # VexFlow/ABC staff rendering helpers and tests
│   ├── VirtualGuitar/          # Guitar visualizers and inline fretboard widgets
│   ├── VirtualPiano/           # Piano visualizers and inline keyboard widgets
│   ├── abc/                    # abcjs-based reusable renderer components
│   ├── game-shell/             # Journey map, celebration flow, and universal game router
│   ├── harmony/                # Harmony-specific visual components
│   ├── instruments/            # Unified instrument panel wiring
│   ├── layout/                 # App chrome, headers, sidebar, bottom nav, layouts
│   ├── modules/                # Lesson widgets, inline theory renderer, and game components
│   ├── navigation/             # Module/course navigation UI
│   ├── profile/                # Profile and journey-map specific UI
│   ├── theory/                 # Theory panels and concept cards
│   └── ui/                     # Shared UI utilities, floating controls, effects, bug report modal
├── constants/                  # Small app-wide constant definitions
├── data/                       # Curriculum data, game registry/types, practice data, music sheets
│   ├── course-data/            # Typed module/submodule lesson source for modules 1-5
│   └── music-sheets/           # ABC notation source files and sheet library index
├── features/                   # Feature-grouped implementations outside generic components
│   ├── audio/                  # Audio unlock support and related tests/constants
│   ├── game/                   # Shared game overlay and core scoring/note logic
│   └── sao-truc/               # Vietnamese bamboo flute UI and fingering logic
├── hooks/                      # Reusable React hooks such as audio context helpers
├── pages/                      # Top-level route pages and dedicated test/debug pages
├── services/                   # Audio engine, scheduler, pitch detection, storage, Supabase sync
├── stores/                     # Zustand stores for progress, audio, settings, games, and UI state
├── types/                      # Project-local type declarations for third-party libs
└── utils/                      # Small domain and UI helpers
```

## Key architectural patterns

<!-- beads-id: doc-arch-s4 -->

### 1. Data-driven curriculum

<!-- beads-id: doc-arch-s5 -->

The course is defined in `src/data/course-data/`. Each module exports typed submodules, and `src/data/course-data/index.ts` composes them into `COURSE_MODULES`. The current course has 5 modules and 30 submodules.

### 2. Progressive lesson reveal

<!-- beads-id: doc-arch-s6 -->

`/Users/steve/duyhunghd6/music-theory/src/components/modules/ProgressiveTheoryContent.tsx` parses lesson markdown-like content into sections and shortcode blocks (`abc`, `grandStaff`, `piano`, `guitar`, `flute`, `quiz`). Theory sections unlock progressively, section progress is persisted, and games/demos are revealed only after completion or temporary bypass.

### 3. Registry-driven games

<!-- beads-id: doc-arch-s7 -->

`/Users/steve/duyhunghd6/music-theory/src/data/game-registry.ts` defines reusable game types. `UniversalGameRouter` loads games lazily and writes results to progress storage. This registry is currently used by Module 1 lesson data; Modules 2-5 currently ship theory/ABC content but no registered `games` arrays.

### 4. Mixed notation stack

<!-- beads-id: doc-arch-s8 -->

The codebase uses both notation libraries:
- `abcjs` for interactive ABC rendering and playback-oriented lesson widgets.
- `vexflow` for staff rendering components such as `MusicStaff.tsx`.

This is important because older docs describe VexFlow as the sole notation layer, which is no longer true.

### 5. Local-first progress with optional cloud sync

<!-- beads-id: doc-arch-s9 -->

`/Users/steve/duyhunghd6/music-theory/src/stores/useProgressStore.ts` persists progress through a custom IndexedDB storage adapter with localStorage fallback. The store subscribes to changes and schedules Supabase sync via `src/services/progress-sync.ts` only when `VITE_SUPABASE_URL` and `VITE_SUPABASE_TOKEN` are present.

## Module status snapshot

<!-- beads-id: doc-arch-s10 -->

| Module | Name | Submodules | Current status |
| --- | --- | ---: | --- |
| 1 | Cơ bản | 5 | Most complete interactive module; theory, ABC demos, and registry-driven games are present |
| 2 | Nhịp điệu | 6 | Theory content exists; a dedicated rhythm test surface exists in development-only routing; no module lesson `games` arrays found |
| 3 | Thang âm & Giai điệu | 6 | Theory + ABC-heavy content implemented; no lesson `games` arrays found |
| 4 | Hòa âm | 7 | Theory + ABC-heavy content implemented; no lesson `games` arrays found |
| 5 | Sáng tác | 6 | Theory + ABC-heavy content implemented; no lesson `games` arrays found |

## Verified implementation notes

<!-- beads-id: doc-arch-s11 -->

- Router is `react-router-dom` with `BrowserRouter`, not a separate route manifest.
- The home route currently renders `ProfilePage`, while `/compose` renders `HomePage`.
- The app gates test/debug routes behind `import.meta.env.DEV`; `/test-ui`, `/test-fretboard`, `/test-guitar-popup`, `/test-abc-notation`, `/test-iphone-player`, and `/test-games-m2` are development-only and are not mounted in shipped production builds.
- `src/App.tsx` now registers those debug/test surfaces as direct `<Route>` children inside `<Routes>`, matching React Router 7 requirements.
- `SubmodulePage.tsx` and `src/data/course-data/types.ts` both use `flute` as the canonical section name for the Vietnamese bamboo flute visualizer; older docs describing a `saoTruc`/`flute` mismatch are stale.
- The shipped `/practice` page supports direct URL-driven sheet loading via `?sheet=...`; `raga-bupali` resolves through the Sahaja Yoga lazy-sheet path before the page renders the selected sheet state and playback surface.
- Audio is currently split across two active shipped playback paths: `src/services/audio-engine.ts` uses Tone.js and calls `Tone.start()` through `useAudioStore` for instrument/note playback, while `src/components/abc/AbcRenderer.tsx` creates an `AudioContext`/`webkitAudioContext`, resumes it when suspended, and initializes abcjs synth playback for notation playback.
- `src/pages/IPhonePlayerTestPage.tsx` remains a DEV-only diagnostics surface; current docs should treat it as reference material for iOS constraints, not as the shipped fix surface.

## Main drift from older docs

<!-- beads-id: doc-arch-s12 -->

1. The codebase is no longer organized around the old “5+1 tower” described in `docs/context/system-overview.md`.
2. abcjs is a first-class notation/rendering path, not just VexFlow.
3. Course scope is 30 submodules, not 26.
4. Modules 2-5 are not wired with lesson-level `games` configs yet, despite older docs implying broader interactive completion.
5. Earlier docs and QA snapshots became stale after later fixes; handover notes should follow the most recent passing verification evidence.
6. Current handover verification is backed by passing `src/App.test.tsx`, `npm run build`, and targeted Playwright runs for Chromium and Mobile Chrome critical flows.
7. The current source tree contains more route pages, stores, services, and feature directories than the old docs list.
