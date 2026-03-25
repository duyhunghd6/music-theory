# Architecture Decisions — Handover Hardening Sprint 1

## 1. Sprint goal and scope summary

Sprint goal: make the repository handover-ready by stabilizing the critical E2E path, fixing blocking user-facing implementation issues, and syncing docs to the final shipped behavior.

Scope for this sprint is limited to three workstreams:

- T1: harden the existing Playwright coverage around lesson completion, practice mode, mobile responsiveness, and mobile floating instruments.
- T2: fix blocking app issues in shipped code, with explicit attention on router test/debug exposure in `/Users/steve/duyhunghd6/music-theory/src/App.tsx` and the `saoTruc` vs `flute` section mismatch in `/Users/steve/duyhunghd6/music-theory/src/pages/SubmodulePage.tsx` versus `/Users/steve/duyhunghd6/music-theory/src/data/course-data/types.ts`.
- T3: update handover docs only after T1/T2 land so documentation matches the final code and verification workflow.

Out of scope: new product features, broad refactors, changing curriculum scope, or expanding test coverage outside handover-critical flows.

## 2. Task dependency order

1. ARCH produces this file first so all ownership boundaries are explicit.
2. T1 and T2 may run in parallel because they touch different primary surfaces.
3. T2 must own any production-code changes required by E2E findings; T1 must not drift into app fixes beyond selector/testability hooks already allowed in the backlog.
4. T3 starts only after T1 and T2 are finished and their final commands/results are known.
5. QA validates narrow-first in this order:
   - `npm run build`
   - relevant unit/component tests for T2-owned production changes
   - targeted Playwright specs for T1-owned flows
   - broader reruns only if a failing area needs confirmation after a fix
6. If QA finds failures:
   - T1 fixes E2E-spec stability or selector issues inside T1 ownership.
   - T2 fixes production bugs and route/runtime issues inside T2 ownership.
   - T3 updates docs again only after code/test truth changes.

## 3. File ownership map

### Authoritative boundaries

| Task | File/Module | Owner | Read-only access / notes |
|:---|:---|:---|:---|
| T1 | `/Users/steve/duyhunghd6/music-theory/playwright.config.ts` | Dev1 | QA may reference command matrix; Dev2/Dev3 read-only |
| T1 | `/Users/steve/duyhunghd6/music-theory/e2e/**/*.spec.ts` | Dev1 | QA may execute; Dev2/Dev3 do not edit |
| T1 | `/Users/steve/duyhunghd6/music-theory/e2e/pages/**/*.ts` | Dev1 | Page-object/test helper ownership stays with Dev1 |
| T1 | `/Users/steve/duyhunghd6/music-theory/src/components/layout/MainHeader.tsx` | Dev1 only for selector/testability hooks | Dev2 read-only unless ARCH reassigns due to blocker |
| T1 | `/Users/steve/duyhunghd6/music-theory/src/components/layout/Sidebar.tsx` | Dev1 only for selector/testability hooks | No behavior refactors |
| T1 | `/Users/steve/duyhunghd6/music-theory/src/components/layout/AppLayout.tsx` | Dev1 only for selector/testability hooks | No logic/style churn beyond enabling stable tests |
| T1 | `/Users/steve/duyhunghd6/music-theory/src/components/ui/MobileDrawer.tsx` | Dev1 only for selector/testability hooks | Mobile behavior bugs still belong to Dev2 if product-facing |
| T1 | `/Users/steve/duyhunghd6/music-theory/src/components/ui/FloatingInstrumentPanel.tsx` | Dev1 only for selector/testability hooks | Do not change functional behavior unless reassigned |
| T1 | `/Users/steve/duyhunghd6/music-theory/src/components/ui/FloatingInstrumentsContainer.tsx` | Dev1 only for selector/testability hooks | Shared with app runtime; behavior changes require Dev2 |
| T1 | `/Users/steve/duyhunghd6/music-theory/src/components/ui/FloatingInstrumentsToolbar.tsx` | Dev1 only for selector/testability hooks | No layout logic rewrites without reassignment |
| T2 | `/Users/steve/duyhunghd6/music-theory/src/App.tsx` | Dev2 | Router ownership is exclusive to avoid collisions with T1/T3 |
| T2 | `/Users/steve/duyhunghd6/music-theory/src/pages/SubmodulePage.tsx` | Dev2 | Owns section mismatch resolution and lesson runtime bug fixes |
| T2 | `/Users/steve/duyhunghd6/music-theory/src/data/course-data/types.ts` | Dev2 | Canonical type ownership for section naming consistency |
| T2 | `/Users/steve/duyhunghd6/music-theory/src/data/course-data/**/*.ts` | Dev2 when needed for runtime consistency | T3 may read for doc truth only |
| T2 | `/Users/steve/duyhunghd6/music-theory/src/components/modules/**/*.tsx` | Dev2 | Only if app/runtime bugs require changes |
| T2 | `/Users/steve/duyhunghd6/music-theory/src/stores/**/*.ts` | Dev2 | Owns persistence/runtime fixes |
| T2 | `/Users/steve/duyhunghd6/music-theory/src/services/**/*.ts` | Dev2 | Owns service-layer fixes tied to blocker behavior |
| T2 | Adjacent unit/component tests for touched app code | Dev2 | QA executes; Dev1 does not edit |
| T3 | `/Users/steve/duyhunghd6/music-theory/docs/context/ARCHITECTURE.md` | Dev3 | Update only after final code truth is known |
| T3 | `/Users/steve/duyhunghd6/music-theory/docs/context/TECH_STACK.md` | Dev3 | Read-only for Dev1/Dev2 |
| T3 | `/Users/steve/duyhunghd6/music-theory/docs/specs/module-overview.md` | Dev3 | Sync against final behavior only |
| T3 | `/Users/steve/duyhunghd6/music-theory/docs/records/dev-guide.md` | Dev3 | Update workflow guidance after final verification path is confirmed |
| T3 | `/Users/steve/duyhunghd6/music-theory/docs/records/decisions.md` | Dev3 | Record final architectural decisions only |
| T3 | `/Users/steve/duyhunghd6/music-theory/docs/records/bug-fixing-guide.md` | Dev3 | Sync bug-fix workflow to what actually happened |
| T3 | `/Users/steve/duyhunghd6/music-theory/docs/active/roadmap.md` | Dev3 | Keep roadmap aligned to post-sprint truth |
| T3 | `/Users/steve/duyhunghd6/music-theory/docs/active/handover-hardening-sprint-1/*.md` | Dev3 | Sprint docs may be updated only after T1/T2 outputs are final |
| ARCH | `/Users/steve/duyhunghd6/music-theory/docs/report/architecture-decisions.md` | ARCH | Read-only for all devs and QA |
| QA1 | `/Users/steve/duyhunghd6/music-theory/docs/tests/test-plan.md` | QA1 | Read-only for devs |
| QA2 | `/Users/steve/duyhunghd6/music-theory/docs/report/qa-report.md` | QA2 | Read-only for devs |

### Collision-prevention rules

- Dev1 does not edit `src/App.tsx`, `src/pages/SubmodulePage.tsx`, course-data types, or docs.
- Dev2 does not edit `e2e/**/*.spec.ts`, `e2e/pages/**/*.ts`, or Playwright config.
- Dev3 edits docs only and does not change tests or production code.
- If T1 discovers a genuine product bug while stabilizing E2E, Dev1 records the failing spec and hands the fix to Dev2 instead of patching the runtime.

## 4. Integration points

### Playwright / E2E to app runtime

- `playwright.config.ts` points the suite at `http://localhost:5504` and runs against `./e2e` with desktop + mobile projects.
- Existing verified coverage under `/Users/steve/duyhunghd6/music-theory/e2e/` already includes:
  - `lesson-completion.spec.ts`
  - `practice-mode.spec.ts`
  - `mobile-responsive.spec.ts`
  - `mobile-floating-instruments.spec.ts`
  - `mobile-floating-instruments-simple.spec.ts`
  - `mobile-ui-redesign.spec.ts`
  - `mobile-contrast.spec.ts`
- The sprint-critical subset from DoD/backlog is lesson completion, practice mode, mobile responsiveness, and mobile floating instruments. Other mobile specs are reference coverage, not the minimum handover bar.
- T1 depends on stable hooks already present in the app, such as `data-testid` values used in mobile navigation and lesson content. If new hooks are needed, they must remain minimal and testability-only.

### App router exposure

- `/Users/steve/duyhunghd6/music-theory/src/App.tsx` currently exposes shipped routes for core product surfaces plus debug/test pages, including `/test-ui`, `/test-fretboard`, `/test-guitar-popup`, `/test-abc-notation`, `/test-iphone-player`, and `/test-games-m2`.
- T2 owns the handover-readiness review for those routes. This is a product/runtime decision, not a docs or E2E ownership question.
- T1 may test against shipped routes, but must not decide router policy.
- T3 must document only the final router policy that exists after T2 completes.

### Lesson runtime and course-data contract

- `/Users/steve/duyhunghd6/music-theory/src/pages/SubmodulePage.tsx` currently checks `hasSection('saoTruc')` at the flute visualizer branch.
- `/Users/steve/duyhunghd6/music-theory/src/data/course-data/types.ts` defines `SectionType` with `flute`, not `saoTruc`.
- This mismatch is a contract break between runtime rendering and typed course-data configuration. T2 must resolve it consistently in code and types/data. T1 and T3 treat it as read-only until fixed.
- After T2 lands, T3 must sync docs to the chosen canonical name and avoid documenting both terms as if both are valid runtime sections unless the code truly supports both.

### Docs as downstream truth

- T3 consumes final facts from T1/T2 outputs: changed files, exact commands run, final pass/fail state, and any route/runtime policy changes.
- QA artifacts are the handoff bridge: QA1 maps acceptance criteria to commands; QA2 records exact failures and final PASS/FAIL evidence; T3 uses that evidence to update docs without inventing unverified claims.

## 5. Design constraints and rules per dev agent

### Shared constraints

- Keep changes minimal and handover-focused.
- Prefer narrow verification first; do not expand to the full Playwright matrix unless a failing area requires it.
- No cross-owner edits without ARCH reassignment.
- No speculative cleanup, feature work, or large refactors.
- Final docs must reflect observed code/test truth, not older plans.

### Dev1 rules

- Stay inside Playwright config, E2E specs, E2E page objects, and selector/testability hooks allowed by the backlog.
- Use stable selectors and page objects where possible; reduce brittle icon/text-only targeting when a stable hook can be added within owned boundaries.
- Treat `e2e/lesson-completion.spec.ts`, `e2e/practice-mode.spec.ts`, `e2e/mobile-responsive.spec.ts`, and `e2e/mobile-floating-instruments.spec.ts` as the primary handover suite.
- Do not fix router policy, lesson runtime logic, or section-type mismatches in production code.
- When blocked by product behavior, hand the issue to Dev2 with exact failing test evidence.

### Dev2 rules

- Own all production-code decisions for this sprint.
- Review and resolve the router test/debug exposure in `src/App.tsx` without editing E2E specs.
- Resolve the `saoTruc` vs `flute` mismatch consistently across runtime/type/data boundaries.
- If T1 reveals blocking runtime issues in owned surfaces, fix them in the smallest possible scope and add/update relevant unit/component coverage.
- Do not update docs to describe your changes; that belongs to Dev3 after QA confirms the final state.

### Dev3 rules

- Edit docs only after T1 and T2 are done and QA evidence exists.
- Treat `docs/` as downstream documentation of verified reality, not a place to propose behavior.
- Update routing notes, E2E coverage statements, handover commands, and bug-fix descriptions only if they are backed by final code or QA artifacts.
- Do not change `docs/report/architecture-decisions.md`, `docs/tests/test-plan.md`, or `docs/report/qa-report.md` unless explicitly reassigned.

## 6. QA expectations and handoff artifacts

### Required QA flow

QA should validate the sprint with this narrow-first sequence:

1. `npm run build`
2. Relevant unit/component tests for files changed by Dev2
3. Targeted Playwright commands mapped to the sprint-critical flows
4. Broader reruns only when needed to confirm a fix or detect regression in the same owned area

### Minimum targeted E2E set for handover

- `npm run test:e2e -- e2e/lesson-completion.spec.ts`
- `npm run test:e2e -- e2e/practice-mode.spec.ts`
- `npm run test:e2e -- e2e/mobile-responsive.spec.ts`
- `npm run test:e2e -- e2e/mobile-floating-instruments.spec.ts`

Equivalent narrower commands are acceptable only if QA records that they cover the same acceptance criteria.

### Required handoff artifacts

- ARCH: `/Users/steve/duyhunghd6/music-theory/docs/report/architecture-decisions.md`
- QA1: `/Users/steve/duyhunghd6/music-theory/docs/tests/test-plan.md`
- QA2: `/Users/steve/duyhunghd6/music-theory/docs/report/qa-report.md`
- Dev1 report: owned files changed, tests stabilized, targeted commands run
- Dev2 report: exact bugs fixed, owned files changed, build/tests run
- Dev3 report: docs updated, code/test facts synchronized against

### Failure recording standard

Every QA failure must include:

- failing test case
- exact command
- observed error
- minimal repro steps
- owner bucket: T1, T2, or T3

## 7. Specific notes for this sprint

### Existing Playwright coverage in `e2e/`

The repository already has meaningful Playwright coverage; this sprint is hardening and narrowing, not bootstrapping from zero. Verified current specs include lesson completion, practice mode, mobile responsiveness, mobile floating instruments, simplified mobile floating instruments, mobile UI redesign, and mobile contrast coverage. The architecture decision is to treat the first four as the handover-critical baseline and the rest as optional supporting coverage unless QA identifies a direct dependency.

### App router debug/test route exposure in `src/App.tsx`

`/Users/steve/duyhunghd6/music-theory/src/App.tsx` currently mounts core user routes alongside multiple explicit debug/test surfaces. Because these routes are exposed in the main router, handover readiness requires an intentional decision by Dev2: keep, gate, or remove them. This decision must be made in code first, then reflected in docs by Dev3. QA should verify the final route policy rather than assuming debug routes remain available.

### `saoTruc` vs `flute` mismatch

`/Users/steve/duyhunghd6/music-theory/src/pages/SubmodulePage.tsx` currently renders the Vietnamese bamboo flute visualizer only when `hasSection('saoTruc')` is true, but `/Users/steve/duyhunghd6/music-theory/src/data/course-data/types.ts` declares the typed section as `flute`. That means typed course data and runtime branching are currently out of sync. This is a T2-owned contract fix and should be resolved at the canonical type/data/runtime boundary, not papered over in docs or E2E.

## 8. Expected sprint exit state

The sprint is architecture-complete when:

- ownership boundaries remain collision-free,
- handover-critical targeted E2E flows are stable,
- router and lesson runtime blockers are resolved in shipped code,
- QA artifacts contain exact evidence,
- docs describe only the final verified application state.
