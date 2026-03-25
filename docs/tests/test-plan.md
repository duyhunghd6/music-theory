# Sprint Test Plan — Handover Hardening Sprint 1

Status: derived from `docs/active/handover-hardening-sprint-1/dod.md` and `docs/report/architecture-decisions.md` on 2026-03-25
Owner: QA1

## Test strategy

This sprint uses a narrow-first verification strategy focused on handover-critical behavior:

1. build health,
2. relevant unit/component coverage for T2-owned production fixes,
3. targeted Playwright coverage for the critical flows defined in the backlog/DoD,
4. broader reruns only if a failing area needs confirmation after a fix.

## Pass/fail rule

Each case is binary:
- **PASS**: the command completes successfully and the observed behavior matches the acceptance target.
- **FAIL**: the command exits non-zero, a required assertion fails, or observed behavior contradicts the acceptance target.

## Test cases

### TC-001 — Final application build succeeds
- Scope: global DoD, T2
- Command: `npm run build`
- Pass criteria:
  - command exits with status 0
  - TypeScript build succeeds
  - Vite production build succeeds
- Fail criteria:
  - any compile, type, or bundle error occurs

### TC-002 — T2-owned unit/component coverage passes for touched production files
- Scope: T2
- Command: run only the relevant Vitest files adjacent to changed Dev2-owned production code
- Suggested command shape:
  - `npm run test -- <relevant test file globs>`
- Minimum required checks:
  - any updated tests covering router policy changes in `src/App.tsx`
  - any updated tests covering the lesson/runtime contract fix around `src/pages/SubmodulePage.tsx` and related types/data
- Pass criteria:
  - all relevant targeted Vitest tests pass
  - no failing assertion remains in touched T2-owned areas
- Fail criteria:
  - any targeted unit/component test fails
  - no relevant test exists for a changed T2-owned production behavior that required new coverage

### TC-003 — Lesson completion flow passes
- Scope: T1 handover-critical E2E
- Command: `npm run test:e2e -- e2e/lesson-completion.spec.ts`
- Pass criteria:
  - targeted Playwright run exits with status 0
  - lesson completion/persistence assertions pass
- Fail criteria:
  - command exits non-zero
  - any assertion in the targeted spec fails

### TC-004 — Practice mode flow passes
- Scope: T1 handover-critical E2E
- Command: `npm run test:e2e -- e2e/practice-mode.spec.ts`
- Pass criteria:
  - targeted Playwright run exits with status 0
  - practice-page instrument interaction assertions pass
- Fail criteria:
  - command exits non-zero
  - any assertion in the targeted spec fails

### TC-005 — Mobile responsive/navigation flow passes
- Scope: T1 handover-critical E2E
- Command: `npm run test:e2e -- e2e/mobile-responsive.spec.ts`
- Pass criteria:
  - targeted Playwright run exits with status 0
  - mobile navigation/responsive assertions pass for the intended covered flows
- Fail criteria:
  - command exits non-zero
  - any assertion in the targeted spec fails

### TC-006 — Mobile floating instruments flow passes
- Scope: T1 handover-critical E2E
- Command: `npm run test:e2e -- e2e/mobile-floating-instruments.spec.ts`
- Pass criteria:
  - targeted Playwright run exits with status 0
  - floating-instrument interaction/layout assertions pass for the intended covered flows
- Fail criteria:
  - command exits non-zero
  - any assertion in the targeted spec fails

### TC-007 — Final router policy matches final shipped code and docs
- Scope: T2, T3
- Verification method:
  - inspect final `src/App.tsx`
  - inspect final updated docs that describe routing/handover behavior
- Pass criteria:
  - the final route policy in code is intentional and documented consistently
  - docs do not contradict the shipped router state
- Fail criteria:
  - docs claim a route policy that the code does not implement
  - shipped debug/test route behavior is ambiguous or undocumented after T2/T3

### TC-008 — Final section naming contract is consistent
- Scope: T2, T3
- Verification method:
  - inspect final `src/pages/SubmodulePage.tsx`
  - inspect final `src/data/course-data/types.ts`
  - inspect any touched course-data files and final synced docs
- Pass criteria:
  - the canonical flute section name is consistent across runtime checks, type definitions, relevant data, and docs
- Fail criteria:
  - runtime/type/data/docs still disagree on the canonical section name

### TC-009 — Final docs match final code/test truth
- Scope: T3, global DoD
- Verification method:
  - inspect final updated docs in `docs/context/`, `docs/specs/`, `docs/records/`, and `docs/active/`
  - compare against final code changes and QA outcomes
- Pass criteria:
  - updated docs accurately reflect final router behavior, final bug-fix outcomes, and final verification workflow
  - no updated doc makes a contradicted claim about current shipped behavior
- Fail criteria:
  - any updated doc contradicts final code or QA evidence

## Execution order for QA2

Run the cases in this order:

1. TC-001
2. TC-002
3. TC-003
4. TC-004
5. TC-005
6. TC-006
7. TC-007
8. TC-008
9. TC-009

## Failure reporting format for QA2

For every failing case, record all of the following in `docs/report/qa-report.md`:
- test case ID
- owner bucket: T1, T2, or T3
- exact command run, if applicable
- observed error
- minimal repro steps
- whether the failure blocks handover

## Re-run policy

If QA2 finds failures:
- re-run only the listed failing cases after the responsible dev fixes them
- do not rerun unrelated cases unless a fix could reasonably affect the same surface
