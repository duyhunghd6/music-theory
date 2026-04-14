# 🏗️ System Overview & Architecture

> **Status**: Verified & Synced (Jan 2026)
> **Version**: 2.2 (Data-Complete)

This document describes the _verified_ architecture of the Music Theory Platform as implemented in the codebase.

---

## 1. Context & Scope

The platform is a "Mobile-First" progressive web app (PWA) designed to teach music theory through **interactive visualization** and **gamified discovery**.

### Core Pillars ("The 3 Uniques")

1.  **Unified Visualizers**: Every concept is instantly visible on Staff, Piano, Guitar, and Flute.
2.  **Sound-First**: Theory is taught through _hearing_ first, then analyzing.
3.  **Interleaved Mastery**: The "Journey Map" pattern mixes passive learning with active quizzes.

---

## 2. The "5+1 Tower" Architecture

The system follows a strict 5-layer vertical architecture with a sidecar data tower.

### Layer 1: Foundation (React + Vite)

- **Framework**: React 18 (TypeScript)
- **Router**: React Router v6 (Lazy loaded routes)
- **Styling**: TailwindCSS + HeadlessUI

### Layer 2: Audio/Visual Engine

- **Audio**: `Tone.js` (Scheduler, Sampler) + `AudioEngine.ts` singleton.
- **Notation**: `ABCJS` (Rendering, Synth) wrapped in `AbcGrandStaff`.
- **Sync**: `useAudioStore` uses `requestAnimationFrame` to sync Tone.js time with visual cursors.

### Layer 3: Visualizers (The "Popup" System)

- **State**: `activeNotes` (Zustand) drives all visualizers.
- **Components**:
  - `VirtualPiano`: 3 Octaves, touch-responsive.
  - `VirtualGuitar`: Transposing logic (+1 octave), fretboard mapping.
  - `HorizontalSaoTrucVisualizer`: Custom SVG engine for 6/10-hole flute fingerings.
- **Integration**: `InstrumentPanel` combines these into a responsive, collapsible dashboard.

### Layer 4: Game Orchestration

- **Journey**: `JourneyMap.tsx` renders the "Candy Crush" style progress map.
- **Router**: `UniversalGameRouter` handles the logic: `Menu -> Game -> Feedback -> Result -> Next`.
- **Registry**: `game-registry.ts` maps IDs (`note-id`, `rhythm-tap`) to lazy-loaded components.

### Layer 5: Data Persistence

- **Local**: IndexedDB (via `idb-keyval`) stores progress, XP, and settings.
- **Cloud**: Supabase (in progress) for user sync.

### "+1" Sidecar: Content Tower

- **Structure**: `src/data/course-data/module-X/`
- **Format**: Typed TypeScript files (`x.y-topic.ts`) exporting `Submodule` interfaces.
- **Shortcodes**: Content text supports `{{piano:C E G}}` shortcodes for inline interactive widgets.

---

## 3. Key Workflows

### 3.1 The "Hear-See-Play" Loop

1.  User opens a **Submodule** (e.g., 5.6 Modulation).
2.  `ProgressiveTheoryContent` parses the text.
3.  User clicks an **ABC Demo**.
4.  `AbcGrandStaff` plays audio via `AudioEngine`.
5.  `useAudioStore` updates `activeNotes` every frame.
6.  `InstrumentPanel` lights up the corresponding keys/frets/holes in real-time.

### 3.2 The Game Journey

1.  User enters `SubmodulePage`.
2.  `JourneyMap` checks `completedGames` Set.
3.  User clicks an unlocked node.
4.  `UniversalGameRouter` loads the specific game component (e.g. `NoteIdentificationQuiz`).
5.  On win: confetti explodes, XP is awarded, next node unlocks.

---

## 4. Directory Structure (Verified)

```
.
├── AGENTS.md             # Instructions for AI Agents
├── CLAUDE.md             # Claude Code Configuration
├── docs/                 # Documentation Tower
│   ├── active/           # Current tasks & roadmap
│   ├── context/          # Architecture & domain knowledge
│   ├── specs/            # Feature specifications
│   ├── records/          # Meeting notes & logs
│   ├── reviews/          # QA & Code reviews
│   └── archive/          # Deprecated docs
├── src/
│   ├── assets/           # Static assets (images, logos)
│   ├── components/
│   │   ├── game-shell/   # JourneyMap, Header, FeedbackOverlay
│   │   ├── instruments/  # InstrumentPanel & Floating Controls
│   │   ├── modules/      # Quiz components (NoteHunt, etc.)
│   │   ├── MusicStaff/   # AbcGrandStaff & Rendering Logic
│   │   ├── VirtualGuitar/
│   │   └── VirtualPiano/
│   ├── constants/        # App-wide constants
│   ├── data/
│   │   ├── course-data/  # The Curriculum (Modules 1-5)
│   │   └── game-registry.ts # The Game Catalog
│   ├── features/
│   │   ├── game/         # Core game logic engines
│   │   └── sao-truc/     # Flute specific logic
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Route Views (Practice, Submodule, etc.)
│   ├── services/         # External services (Supabase, etc.)
│   ├── stores/           # Zustand stores (Audio, Game, Settings)
│   ├── types/            # TypeScript terminology definitions
│   └── utils/            # Helper functions
└── tests/                # Unit & Integration tests
```
