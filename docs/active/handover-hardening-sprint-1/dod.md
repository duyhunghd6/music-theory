# Definition of Done — Handover Hardening Sprint 1

<!-- beads-id: pln-spdod -->

Status: synthesized from verified docs and repository state on 2026-03-25

## Global Definition of Done

<!-- beads-id: pln-spdod-s1 -->

The sprint is done only when all of the following are true:

- `docs/report/architecture-decisions.md` exists and defines file ownership, constraints, and integration points.
- `docs/tests/test-plan.md` exists and maps one or more test cases to every task acceptance criterion below.
- `docs/report/qa-report.md` exists and records PASS/FAIL results with exact repro details for failures.
- `npm run build` passes on the final branch state.
- Relevant unit/component tests for changed production code pass.
- Handover-critical Playwright coverage is executed and the final targeted E2E cases pass.
- No open blocker from the verified starting bug list remains unresolved in scope.
- Final docs describe the shipped app behavior and test workflow without contradicting the code.

## Task-specific DoD

<!-- beads-id: pln-spdod-s2 -->

### T1 — Harden handover-critical E2E coverage

<!-- beads-id: pln-spdod-s3 -->
T1 is done when all of the following are true:

1. Playwright coverage exists and runs for these handover-critical flows:
   - lesson completion and persistence,
   - practice page interaction,
   - mobile navigation/responsive behavior,
   - mobile floating instruments behavior.
2. The owned E2E specs use stable selectors/page objects where practical, reducing brittle dependency on decorative text/icons.
3. Any app code touched by Dev1 is limited to selector or testability changes inside Dev1-owned files.
4. The following targeted commands pass, or equivalent narrower commands covering the same files are documented in the QA plan:
   - `npm run test:e2e -- e2e/practice-mode.spec.ts --project=chromium`
   - `npm run test:e2e -- e2e/mobile-floating-instruments.spec.ts --project=chromium`
   - `npm run test:e2e -- e2e/mobile-responsive.spec.ts --project=chromium`
   - `npm run test:e2e -- --project="Mobile Chrome - iPhone SE" e2e/lesson-completion.spec.ts e2e/practice-mode.spec.ts e2e/mobile-responsive.spec.ts e2e/mobile-floating-instruments.spec.ts`
5. Dev1 reports what was covered, what was stabilized, and which owned files changed.

### T2 — Fix blocking app bugs for handover

<!-- beads-id: pln-spdod-s4 -->
T2 is done when all of the following are true:

1. The `saoTruc` vs `flute` runtime mismatch is resolved consistently in shipped code.
2. Test/debug route handling in `src/App.tsx` is reviewed and updated for handover readiness.
3. Any additional blocking bug found by build, unit tests, or QA within Dev2-owned files is fixed.
4. `npm run build` passes after Dev2 changes.
5. Relevant unit/component tests for touched Dev2-owned files are added or updated and pass.
6. Dev2 reports the exact bugs fixed, owned files changed, and tests run.

### T3 — Sync handover documentation to the final codebase state

<!-- beads-id: pln-spdod-s5 -->
T3 is done when all of the following are true:

1. Docs are updated only after final code behavior from T1/T2 is known.
2. Updated docs accurately describe:
   - current router behavior and any debug/test route policy,
   - final lesson/runtime behavior affected by bug fixes,
   - current E2E and validation workflow for handover,
   - remaining known gaps only if they still exist after QA.
3. No updated doc claims conflict with the final code or final QA results.
4. Dev3 reports the docs updated and the code/test facts they were synchronized against.

## QA execution expectations

<!-- beads-id: pln-spdod-s6 -->

QA2 should verify the sprint with a narrow-first strategy before any broader reruns:

1. `npm run build`
2. Relevant unit/component tests for touched code
3. Targeted Playwright specs tied to the changed flows
4. Only if needed after stabilization, broader Playwright coverage from the same owned area

For every failure, QA2 must record:
- failing test case,
- exact command run,
- observed error,
- minimal repro steps,
- whether the failure belongs to T1, T2, or T3 scope.

## Handover bar

<!-- beads-id: pln-spdod-s7 -->

This sprint is not handover-ready if any of the following remain true:

- a targeted E2E case for the critical flows still fails,
- the app does not build,
- a known blocking bug from sprint scope remains open,
- docs still describe behavior that is no longer true,
- QA results are missing or ambiguous.
