# Test Plan — iOS Practice Audio Investigation Sprint

<!-- beads-id: prd-tplan -->

Status: derived from `docs/report/architecture-decisions.md` on 2026-03-25
Owner: QA1
Target URL: `http://localhost:5504/practice?sheet=raga-bupali`

## Execution order

<!-- beads-id: prd-tplan-s1 -->

This file is the current test execution source of truth for this workstream. Pair it with `docs/context/tech-stack.md` for available scripts, `docs/records/dev-guide.md` for workflow guidance, and `docs/reviews/qa-report.md` for the latest executed evidence.

Run cases in this narrow-first order:

1. T2 targeted unit/component coverage
2. T1 targeted Playwright coverage for the shipped practice path
3. T1 targeted mobile regression only if the touched fix area overlaps shared instrument/audio surfaces
4. T2 real-device iOS repro and fix confirmation on the exact shipped URL
5. T3 docs sync verification after code and QA results are final

## Binary result rule

<!-- beads-id: prd-tplan-s2 -->

- **PASS**: every command in the case exits 0, and every required UI/manual observation in the case matches the pass criteria.
- **FAIL**: any command exits non-zero, any required assertion fails, or any required UI/manual observation does not match the pass criteria.

## T1 — Targeted E2E coverage for iOS practice audio

<!-- beads-id: prd-tplan-s3 -->

### TC-T1-001: `/practice?sheet=raga-bupali` loads through the shipped URL-driven flow

<!-- beads-id: prd-tplan-s4 -->
- **Type**: integration
- **Command**: `npm run test:e2e -- e2e/practice-mode.spec.ts`
- **Pass criteria**:
  - command exits 0
  - the spec includes passing assertions for loading the shipped `/practice` route with a selected sheet
  - the selected sheet resolves without fallback/error UI
- **Fail criteria**:
  - command exits non-zero
  - any assertion for shipped practice-route loading fails
  - the run does not cover a selected-sheet practice flow

### TC-T1-002: Selected-sheet state is visible in shipped UI on the practice page

<!-- beads-id: prd-tplan-s5 -->
- **Type**: integration
- **Command**: `npm run test:e2e -- e2e/practice-mode.spec.ts --project=chromium`
- **Pass criteria**:
  - command exits 0
  - the spec contains passing assertions for visible selected-sheet UI on the practice page, covering the Now Playing / score / practice panel state for the chosen sheet
- **Fail criteria**:
  - command exits non-zero
  - any selected-sheet visibility assertion fails
  - the covered flow does not prove the chosen sheet is visible in shipped UI

### TC-T1-003: Mobile practice flow is reachable with stable selectors/page objects

<!-- beads-id: prd-tplan-s6 -->
- **Type**: integration
- **Command**: `npm run test:e2e -- --project="Mobile Chrome - iPhone SE" e2e/practice-mode.spec.ts`
- **Pass criteria**:
  - command exits 0
  - mobile-targeted practice flow assertions pass
  - the spec reaches the practice interaction path through stable selectors/page objects rather than brittle decorative-only targeting
- **Fail criteria**:
  - command exits non-zero
  - any mobile practice assertion fails
  - the spec cannot reach the intended flow on the mobile project

### TC-T1-004: Playwright covers the user actions and visible state immediately before audio playback

<!-- beads-id: prd-tplan-s7 -->
- **Type**: integration
- **Command**: `npm run test:e2e -- --project="Mobile Chrome - iPhone SE" e2e/practice-mode.spec.ts`
- **Pass criteria**:
  - command exits 0
  - the spec reaches the shipped practice page for `raga-bupali`
  - the spec performs the playback-entry user action and verifies the visible state that precedes the real-device audio symptom
- **Fail criteria**:
  - command exits non-zero
  - the pre-playback user action is not covered
  - visible pre-playback state is missing or failing

### TC-T1-005: Shared mobile instrument surface does not regress when the fix touches shared audio/instrument UI

<!-- beads-id: prd-tplan-s8 -->
- **Type**: smoke
- **Command**: `npm run test:e2e -- e2e/mobile-floating-instruments.spec.ts`
- **Pass criteria**:
  - command exits 0
  - all assertions pass
  - run is executed when the fix touches `src/components/ui/FloatingInstrumentsContainer.tsx`, `src/pages/PracticePage.tsx`, or another shared instrument/audio surface
- **Fail criteria**:
  - command exits non-zero when this rerun is required
  - any assertion fails
  - required shared-surface regression coverage is skipped

## T2 — iOS audio runtime investigation and fix

<!-- beads-id: prd-tplan-s9 -->

### TC-T2-001: Changed `useAudioStore` / audio-engine path passes targeted Vitest coverage

<!-- beads-id: prd-tplan-s10 -->
- **Type**: unit
- **Command**: `npm run test -- --run src/stores/useAudioStore.test.ts src/services/audio-engine.test.ts`
- **Pass criteria**:
  - command exits 0
  - all assertions pass
  - the run covers the shipped store/engine path when either file is changed
- **Fail criteria**:
  - command exits non-zero
  - any assertion fails
  - either changed shipped store/engine file lacks targeted executed coverage

### TC-T2-002: Changed unlock UI/hook path passes targeted Vitest coverage when used by the fix

<!-- beads-id: prd-tplan-s11 -->
- **Type**: component
- **Command**: `npm run test -- --run src/features/audio/components/AudioUnlocker.test.tsx`
- **Pass criteria**:
  - command exits 0
  - all assertions pass
  - the run is executed if the final fix touches `src/features/audio/components/AudioUnlocker.tsx` or routes users through that shipped unlock surface
- **Fail criteria**:
  - command exits non-zero when this coverage is required
  - any assertion fails
  - required shipped unlock-surface coverage is skipped

### TC-T2-003: The shipped practice route satisfies the final audio initialization path, not only a debug page

<!-- beads-id: prd-tplan-s12 -->
- **Type**: smoke
- **Command**: `npm run test:e2e -- --project="Mobile Chrome - iPhone SE" e2e/practice-mode.spec.ts`
- **Pass criteria**:
  - command exits 0
  - the practice-page playback-entry flow passes on the shipped route
  - no QA evidence relies only on `/test-iphone-player` or another debug-only surface
- **Fail criteria**:
  - command exits non-zero
  - the practice-page playback-entry flow fails
  - the validation evidence depends only on a debug/test route

### TC-T2-004: `raga-bupali` loads through the real shipped lazy-sheet path before playback is attempted

<!-- beads-id: prd-tplan-s13 -->
- **Type**: smoke
- **Command**: `npm run test:e2e -- e2e/practice-mode.spec.ts --project=chromium`
- **Pass criteria**:
  - command exits 0
  - the run proves the selected `raga-bupali` sheet is loaded from the shipped `/practice?sheet=` path before playback-entry interaction
- **Fail criteria**:
  - command exits non-zero
  - `raga-bupali`-targeted practice loading is not covered or fails

### TC-T2-005: Real iOS device can reproduce and then confirm the fix on the exact shipped URL

<!-- beads-id: prd-tplan-s14 -->
- **Type**: smoke
- **Command**: manual on real iOS Safari: open `http://localhost:5504/practice?sheet=raga-bupali`
- **Pass criteria**:
  - before the fix, QA can reproduce the reported user-level symptom on the shipped URL, or records that reproduction is no longer possible with exact observed behavior
  - after the fix, the same real iOS device can load the page, perform the playback-entry user gesture, and confirm audio works on the shipped URL
  - QA records exact device/browser details and user-visible outcome
- **Fail criteria**:
  - QA cannot verify the shipped URL on a real iOS device
  - the post-fix real-device run still fails to produce working audio after the required user gesture
  - the report lacks device/browser details or exact user-visible outcome

## T3 — Docs sync after verified fix

<!-- beads-id: prd-tplan-s15 -->

### TC-T3-001: Docs describe current shipped `/practice` behavior, not an outdated or debug-only flow

<!-- beads-id: prd-tplan-s16 -->
- **Type**: smoke
- **Command**: `grep -RIn "/practice\|IPhonePlayerTestPage\|test-iphone-player\|raga-bupali" docs/context docs/records`
- **Pass criteria**:
  - command exits 0
  - updated docs clearly distinguish shipped `/practice` behavior from DEV-only iPhone test tooling
  - no doc presents the debug page as the production fix surface
- **Fail criteria**:
  - command exits non-zero
  - docs omit the shipped practice route where required
  - any doc treats the debug page as the shipped solution

### TC-T3-002: Docs record the final audio unlock/playback policy that matches the shipped fix

<!-- beads-id: prd-tplan-s17 -->
- **Type**: smoke
- **Command**: `grep -RIn "audio unlock\|Tone.start\|AudioContext\|abcjs\|useAudioStore\|audio-engine" docs/context docs/records`
- **Pass criteria**:
  - command exits 0
  - updated docs describe the final verified shipped audio path used by the fix
  - docs do not describe a contradictory unlock/playback policy
- **Fail criteria**:
  - command exits non-zero
  - the described audio policy conflicts with final code or QA evidence
  - docs describe only debug learnings without tying them back to the shipped fix

### TC-T3-003: Docs include the exact narrow-first verification commands and real-device expectation

<!-- beads-id: prd-tplan-s18 -->
- **Type**: smoke
- **Command**: `grep -RIn "npm run test -- --run src/stores/useAudioStore.test.ts src/services/audio-engine.test.ts\|npm run test:e2e -- e2e/practice-mode.spec.ts\|Mobile Chrome - iPhone SE\|real iOS device\|raga-bupali" docs/records docs/report docs/tests`
- **Pass criteria**:
  - command exits 0
  - docs include the exact targeted command set or a stricter equivalent actually used by QA
  - docs state that real-device iOS confirmation is required for sprint exit
- **Fail criteria**:
  - command exits non-zero
  - docs omit the exact narrow-first verification path
  - docs imply simulator/desktop-only evidence is sufficient

### TC-T3-004: Final docs reflect only verified QA evidence and final behavior

<!-- beads-id: prd-tplan-s19 -->
- **Type**: smoke
- **Command**: `grep -RIn "PASS\|FAIL\|real-device\|practice-mode.spec.ts\|qa-report" docs/report docs/records docs/context`
- **Pass criteria**:
  - command exits 0
  - doc claims align with final QA evidence
  - no updated doc states behavior that QA or final code disproves
- **Fail criteria**:
  - command exits non-zero
  - any updated doc contradicts final code or QA results
  - docs claim verification that the QA report does not support

## Failure recording requirement for QA2

<!-- beads-id: prd-tplan-s20 -->

For every failing case, record all of the following in `docs/report/qa-report.md`:

- test case ID
- exact command or exact manual device step
- owner bucket: T1, T2, or QA environment/setup
- observed user-level symptom
- minimal repro path
- whether the issue occurs on shipped `/practice` or only on a debug/test surface
- whether the issue blocks sprint exit

## Re-run rule

<!-- beads-id: prd-tplan-s21 -->

If QA2 finds a failure, re-run only the failed case after the responsible owner updates it, plus `TC-T1-005` only when the fix touches a shared instrument/audio surface that could regress mobile behavior.
