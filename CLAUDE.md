# Important Instruction Reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
Never save working files, text/mds and tests to the root folder.

## Docs are the project source of truth

Treat `./docs/` as the primary source of truth for product scope, architecture, and project context before proposing changes, plans, or agent-team work.

Read in this order when you need project context:
1. `docs/context/ARCHITECTURE.md` — current runtime architecture, source-tree map, and drift notes.
2. `docs/context/TECH_STACK.md` — verified dependencies, scripts, and test stack.
3. `docs/specs/module-overview.md` — verified module/submodule and interactivity status.
4. `docs/context/domain-terms.md` and `docs/context/initial-requirements.md` — domain and product framing.
5. `docs/records/dev-guide.md`, `docs/records/decisions.md`, `docs/records/adrs.md`, and `docs/records/bug-fixing-guide.md` — implementation guidance and historical decisions.
6. `docs/active/roadmap.md` and `docs/reviews/` — active planning and review context.

If docs in `./docs/` conflict, prefer the file explicitly marked synced/verified and the more recently updated file.

## Current project architecture snapshot

- App stack: React 19 + TypeScript + Vite, React Router 7, Zustand, Tailwind CSS 4.
- Entry flow: `src/main.tsx` mounts `src/App.tsx`; routing uses `BrowserRouter` with lazy-loaded pages.
- Curriculum source: `src/data/course-data/` contains 5 modules and 30 submodules.
- Lesson runtime: `src/pages/SubmodulePage.tsx` and `src/components/modules/ProgressiveTheoryContent.tsx` drive lesson reveal and progression.
- Games are registry-driven through `src/data/game-registry.ts` and `src/components/game-shell/UniversalGameRouter.tsx`.
- Both `abcjs` and `vexflow` are active notation/rendering paths; audio uses Tone.js plus supporting services in `src/services/` and `src/features/audio/`.
- Progress is local-first in `src/stores/useProgressStore.ts`, with optional Supabase sync when environment variables are configured.
- Module 1 has the deepest lesson-game wiring; Modules 2-5 are currently more theory/notation-heavy with less lesson-level game wiring.
- Test stack: Vitest + Testing Library for unit/component tests, Playwright for E2E (must run headless, do not spawn multiple browsers).

## Repo structure to expect

- `docs/context/` — architecture, terminology, requirements, and system context.
- `docs/specs/` — module and feature specifications.
- `docs/records/` — dev guide, decisions, bug-fixing notes, and migration artifacts.
- `docs/active/` — active roadmap.
- `docs/reviews/` — refactor and review artifacts.
- `src/components/` — UI, notation, layout, modules, games, and instruments.
- `src/data/` — course data, game registry, and music-sheet content.
- `src/features/` — feature-grouped logic such as audio and sao-truc.
- `src/pages/` — route pages plus test/debug surfaces.
- `src/services/` — audio, scheduling, storage, and Supabase integration.
- `src/stores/` — Zustand stores.
- `src/hooks/`, `src/types/`, and `src/utils/` — reusable hooks, local typings, and helpers.
