# Important Instruction Reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the user.
Never save working files, text/mds, or tests to the root folder.

## CLAUDE.md is the only agent instruction file

- Do not rely on `AGENTS.md`.
- Treat this `CLAUDE.md` as the only in-repo instruction file for agent behavior.
- If instructions previously lived in `AGENTS.md`, keep the authoritative version here instead of splitting rules across both files.

## Runtime port policy

- Default dev port is `5504`.
- If port `5504` is already in use, do not switch to another port automatically.
- Free port `5504`, then restart the dev server on `5504`.

## Docs are the project source of truth

Treat `./docs/` as the primary source of truth for product scope, architecture, implementation context, and delivery state before proposing changes, plans, or implementation work.

### Read docs in this order when project context is needed

1. `docs/context/architecture.md` — current runtime architecture, source-tree map, integration points, and drift notes.
2. `docs/context/tech-stack.md` — verified dependencies, scripts, tooling, and test stack.
3. `docs/specs/module-overview.md` — verified module/submodule coverage and interactivity status.
4. `docs/context/domain-terms.md` — canonical domain vocabulary and feature terminology.
5. `docs/context/initial-requirements.md` — product framing, original goals, and requirement baseline.
6. `docs/records/dev-guide.md` — implementation guidance and repo-specific development workflow, including testing workflow/location guidance.
7. `docs/records/decisions.md` — important project decisions and working conventions.
8. `docs/records/adrs.md` — architectural decision records and rationale for major choices.
9. `docs/records/bug-fixing-guide.md` — debugging and bug-fix workflow guidance.
10. `docs/specs/test-plan.md` — current testing expectations, execution order, and verification targets.
11. `docs/reviews/qa-report.md` — latest executed QA evidence and unresolved testing gaps.
12. `docs/active/roadmap.md` — current work-in-progress, priorities, and next-step planning.
13. `docs/reviews/` — review artifacts, QA notes, and audit/history relevant to current work.

If docs in `./docs/` conflict, prefer the file explicitly marked synced/verified, then the more recently updated source.

## Meaning of each docs area

- `docs/active/` — current work-in-progress, active roadmaps, and immediate tasks.
- `docs/context/` — architecture, system context, terminology, requirements, and design-level framing.
- `docs/specs/` — feature specs, scope details, and expected behavior.
- `docs/records/` — dev guidance, decisions, ADRs, bug-fix guides, and historical implementation records.
- `docs/reviews/` — code review notes, QA reports, audits, and review artifacts.
- `docs/archive/` — obsolete, superseded, or completed documentation kept only for reference.

## How to use docs during work

- Before implementation, read the relevant files above to understand current architecture, scope, task status, and current testing expectations.
- Treat testing guidance as living in `docs/`, not in root-level docs files. Use `docs/context/tech-stack.md` for test tooling/scripts, `docs/records/dev-guide.md` for testing workflow and local guidance, `docs/specs/test-plan.md` for execution order and required checks, and `docs/reviews/qa-report.md` for the latest verified QA evidence.
- During implementation, keep any user-requested documentation updates aligned with the actual code state.
- After implementation, when documentation changes are part of the task, update the relevant docs so the next session sees the new current state.
- Move outdated material to `docs/archive/` only when the task explicitly requires documentation reorganization.

## Post-implementation verification

After completing code changes inside `./src/`, run these checks in order before commit/push unless the changes were only in `./docs/` or other non-runtime files:

1. `npm run build` — must pass with zero errors.
2. `npm run test:e2e` — all end-to-end tests must pass.

Playwright must run headless, and agents must not spawn multiple browsers.

## Current project architecture snapshot

- App stack: React 19 + TypeScript + Vite, React Router 7, Zustand, Tailwind CSS 4.
- Entry flow: `src/main.tsx` mounts `src/App.tsx`; routing uses `BrowserRouter` with lazy-loaded pages.
- Curriculum source: `src/data/course-data/` contains 5 modules and 30 submodules.
- Lesson runtime: `src/pages/SubmodulePage.tsx` and `src/components/modules/ProgressiveTheoryContent.tsx` drive lesson reveal and progression.
- Games are registry-driven through `src/data/game-registry.ts` and `src/components/game-shell/UniversalGameRouter.tsx`.
- Both `abcjs` and `vexflow` are active notation/rendering paths; audio uses Tone.js plus supporting services in `src/services/` and `src/features/audio/`.
- Progress is local-first in `src/stores/useProgressStore.ts`, with optional Supabase sync when environment variables are configured.
- Module 1 has the deepest lesson-game wiring; Modules 2-5 are currently more theory/notation-heavy with less lesson-level game wiring.
- Test stack: Vitest + Testing Library for unit/component tests, Playwright for E2E.

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
