# Sprint Backlog — Handover Hardening Sprint 1

Status: synthesized from verified docs and current repository state on 2026-03-25
Sprint goal: ensure handover-ready E2E coverage, fix blocking user-facing bugs, and sync docs to the shipped application state.

## Scope summary

This sprint focuses on three outcomes required before handover:

1. Harden and verify E2E coverage for the critical user flows already present in the app.
2. Fix known implementation bugs and any additional blocking defects surfaced by automated verification.
3. Bring docs into sync with the final code and test state so handover material matches reality.

## Verified repository context

- Playwright is configured in `playwright.config.ts` with desktop and mobile projects.
- Existing E2E specs already cover lesson completion, practice mode, mobile responsiveness, and floating instruments under `e2e/`.
- Verified current implementation and handover evidence:
  - `src/App.tsx` gates test/debug routes behind a development-only flag, so docs must not describe them as production-visible.
  - `src/App.tsx` now renders debug/test surfaces as direct `<Route>` children inside `<Routes>`, matching React Router 7 requirements.
  - `src/pages/SubmodulePage.tsx` and `src/data/course-data/types.ts` currently agree on `flute` as the section key for the Vietnamese bamboo flute visualizer.
  - T2 router verification passed with `npm run test -- src/App.test.tsx` and `npm run build`.
  - Fresh targeted Playwright validation passed for Chromium and Mobile Chrome handover flows.

## Dependency order

- T1 and T2 may start in parallel.
- T3 starts after T1 and T2 are complete so docs reflect the final shipped state.
- QA2 validates the combined result after implementation and re-runs only failing cases during bug-fix loops.

## Task list

### T1 — Harden handover-critical E2E coverage
- Owner: Dev1
- Goal: make the existing Playwright suite reliable and handover-focused for the most important flows.
- Story points: 5
- Likely files:
  - `playwright.config.ts`
  - `e2e/**/*.spec.ts`
  - `e2e/pages/**/*.ts`
  - If required for stable selectors only:
    - `src/components/layout/MainHeader.tsx`
    - `src/components/layout/Sidebar.tsx`
    - `src/components/layout/AppLayout.tsx`
    - `src/components/ui/MobileDrawer.tsx`
    - `src/components/ui/FloatingInstrumentPanel.tsx`
    - `src/components/ui/FloatingInstrumentsContainer.tsx`
    - `src/components/ui/FloatingInstrumentsToolbar.tsx`
- Required coverage:
  - Lesson completion and persistence
  - Practice page instrument interaction
  - Mobile navigation/responsive behavior
  - Floating instrument behavior on mobile
- Notes:
  - Prefer targeted Playwright runs first, then expand once the owned specs are stable.
  - Favor stable `data-testid` hooks and page-object usage over brittle icon/text-only selectors where possible.

### T2 — Fix blocking app bugs for handover
- Owner: Dev2
- Goal: remove verified implementation bugs and fix additional blocking failures found by build/tests/QA within owned files.
- Story points: 8
- Likely files:
  - `src/App.tsx`
  - `src/pages/SubmodulePage.tsx`
  - `src/data/course-data/types.ts`
  - `src/data/course-data/**/*.ts`
  - `src/components/modules/**/*.tsx`
  - `src/stores/**/*.ts`
  - `src/services/**/*.ts`
  - Unit/component tests adjacent to touched code
- Starting bug list:
  - Align the lesson runtime section contract to the canonical `flute` section key used by the Vietnamese bamboo flute visualizer.
  - Review and harden test/debug route exposure in the app router for handover readiness.
  - Fix any owned-code failures surfaced by `npm run build`, unit tests, or the targeted E2E suite.
- Notes:
  - Keep changes minimal and product-focused.
  - Do not edit Dev1-owned E2E files or Dev3-owned docs files.

### T3 — Sync handover documentation to the final codebase state
- Owner: Dev3
- Goal: update project docs so they describe the final post-fix application and verification workflow accurately.
- Story points: 5
- Likely files:
  - `docs/context/architecture.md`
  - `docs/context/tech-stack.md`
  - `docs/specs/module-overview.md`
  - `docs/records/dev-guide.md`
  - `docs/records/decisions.md`
  - `docs/records/bug-fixing-guide.md`
  - `docs/active/roadmap.md`
  - `docs/active/handover-hardening-sprint-1/*.md`
- Documentation targets:
  - Final routing and any debug/test route policy changes
  - Final lesson/runtime bug fixes that affect documented behavior
  - Current automated verification coverage and recommended handover commands
  - Any resolved doc drift discovered during T1/T2
- Notes:
  - Wait until T1 and T2 are complete before applying final doc sync.
  - Do not edit `docs/report/architecture-decisions.md` or `docs/tests/test-plan.md`; those belong to ARCH and QA1.

## File ownership map for implementation

- Dev1 owns: Playwright config, E2E specs, E2E page objects, and selector-only changes in the listed layout/floating-instrument files.
- Dev2 owns: application code, route/page logic, lesson/runtime logic, stores/services, and unit/component tests for touched app code.
- Dev3 owns: docs under `docs/context/`, `docs/specs/`, `docs/records/`, and `docs/active/`, excluding QA/ARCH generated outputs.

## Expected sprint result

At sprint completion, the repository should have:

- reliable targeted E2E coverage for handover-critical flows,
- no known blocking bugs remaining within sprint scope,
- passing build and relevant automated tests,
- synced architecture/testing/handover docs reflecting the final code.

Latest verified handover commands/results:
- `npm run test -- src/App.test.tsx` -> PASS
- `npm run build` -> PASS
- `npm run test:e2e -- e2e/practice-mode.spec.ts --project=chromium` -> PASS (5 passed)
- `npm run test:e2e -- e2e/mobile-floating-instruments.spec.ts --project=chromium` -> PASS (10 passed)
- `npm run test:e2e -- e2e/mobile-responsive.spec.ts --project=chromium` -> PASS (13 passed)
- `npm run test:e2e -- --project="Mobile Chrome - iPhone SE" e2e/lesson-completion.spec.ts e2e/practice-mode.spec.ts e2e/mobile-responsive.spec.ts e2e/mobile-floating-instruments.spec.ts` -> PASS (31 passed)
