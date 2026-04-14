# QA Report — Sprint 1 — Round 1

## Summary
- Total cases run: 9
- PASSED: 1
- FAILED: 8

## Results

### TC-001: Final application build succeeds — PASSED
Command: `npm run build`
Output snippet:
```text
> tsc -b && vite build
vite v7.3.1 building client environment for production...
✓ 2075 modules transformed.
```

### TC-002: T2-owned unit/component coverage passes for touched production files — FAILED
Owner bucket: T2
Command: inspection of relevant Vitest files adjacent to changed T2-owned production surfaces in `src/App.tsx`, `src/pages/SubmodulePage.tsx`, and `src/data/course-data/types.ts`
Observed error:
```text
No qualifying targeted Vitest coverage was found for the router policy changes in src/App.tsx or the lesson/runtime contract surfaces in src/pages/SubmodulePage.tsx and src/data/course-data/types.ts.
```
Repro steps:
1. Inspect `src/App.tsx`, `src/pages/SubmodulePage.tsx`, and `src/data/course-data/types.ts`.
2. Search `src/**/*.{test,spec}.{ts,tsx}` for tests covering router policy or SubmodulePage section-contract behavior.
3. Observe that no relevant targeted tests exist for the changed T2-owned behaviors required by the test plan.
Blocks handover: Yes

### TC-003: Lesson completion flow passes — FAILED
Owner bucket: T1
Command: `npm run test:e2e -- e2e/lesson-completion.spec.ts`
Exit code: 1
Observed error:
```text
[chromium] user can complete a lesson by answering quizzes
Test timeout of 30000ms exceeded.
Error: locator.fill: Test timeout of 30000ms exceeded.
- waiting for locator('[data-testid="quiz-answer-input"]')

[chromium] progress persists after page reload
Expected: true
Received: false
expect(await lesson.isCompleted()).toBe(true)

[Mobile Safari - iPhone 12]
Error: browserType.launch: Executable doesn't exist at /Users/steve/Library/Caches/ms-playwright/webkit-2248/pw_run.sh
Please run: npx playwright install
```
Repro steps:
1. Run `npm run test:e2e -- e2e/lesson-completion.spec.ts`.
2. Observe quiz flow waits indefinitely for `[data-testid="quiz-answer-input"]` in Chromium and Mobile Chrome.
3. Observe completion assertion returns `false` before reload persistence checks.
4. Observe WebKit-based mobile Safari projects fail to launch because the Playwright WebKit executable is missing.
Blocks handover: Yes

### TC-004: Practice mode flow passes — FAILED
Owner bucket: T1
Command: `npm run test:e2e -- e2e/practice-mode.spec.ts`
Exit code: 1
Observed error:
```text
[chromium] virtual piano is visible and can be played
Expected: true
Received: false
expect(await practice.isPianoVisible()).toBe(true)

[chromium] virtual guitar is visible and can be played
Expected: true
Received: false
expect(await practice.isGuitarVisible()).toBe(true)

[chromium] BPM display shows tempo value
Test timeout of 30000ms exceeded.
Error: locator.inputValue: Test timeout of 30000ms exceeded.
- waiting for locator('[data-testid="bpm-input"]')
```
Repro steps:
1. Run `npm run test:e2e -- e2e/practice-mode.spec.ts`.
2. Observe piano and guitar visibility assertions fail immediately in Chromium and mobile projects.
3. Observe BPM check times out waiting for `[data-testid="bpm-input"]`.
4. Observe WebKit mobile projects also fail as part of the run.
Blocks handover: Yes

### TC-005: Mobile responsive/navigation flow passes — FAILED
Owner bucket: T1
Command: `npm run test:e2e -- e2e/mobile-responsive.spec.ts`
Exit code: 1
Observed error:
```text
[chromium] should show hamburger menu button on mobile
Expected: visible locator, but assertion failed

[chromium] drawer opens and closes correctly
Test timeout of 30000ms exceeded.
Error: locator.click: Test timeout of 30000ms exceeded.
- waiting for locator('[data-testid="mobile-menu-button"]')

[chromium] header height is condensed on mobile
Test timeout of 30000ms exceeded.
- waiting for locator('[data-testid="main-header"]')

[Mobile Chrome - iPhone SE] iPad (768px) shows tablet layout
Received: false
expect(sidebarVisible || menuVisible).toBeTruthy()
```
Repro steps:
1. Run `npm run test:e2e -- e2e/mobile-responsive.spec.ts`.
2. Observe mobile menu button and main header selectors are not found in multiple cases.
3. Observe drawer-open and auto-close flows time out waiting for `[data-testid="mobile-menu-button"]`.
4. Observe breakpoint assertions fail because neither sidebar nor menu is visible in the tested layout.
Blocks handover: Yes

### TC-006: Mobile floating instruments flow passes — FAILED
Owner bucket: T1
Command: `npm run test:e2e -- e2e/mobile-floating-instruments.spec.ts`
Exit code: 1
Observed error:
```text
[chromium] should toggle Piano on and off
Test timeout of 30000ms exceeded.
- waiting for locator('button:has(span:text("apps"))')

[chromium] toolbar should adjust for different instruments
Test timeout of 30000ms exceeded.
- waiting for locator('button:has(span:text("apps"))')

[chromium] content should not be hidden behind instrument
Test timeout of 30000ms exceeded.
- waiting for locator('button:has(span:text("apps"))')
```
Repro steps:
1. Run `npm run test:e2e -- e2e/mobile-floating-instruments.spec.ts`.
2. Observe the mobile floating-instrument launcher button `button:has(span:text("apps"))` is not found across many mobile cases.
3. Observe all dependent layout, accessibility, z-index, and visual-regression checks fail after the launcher cannot be opened.
Blocks handover: Yes

### TC-007: Final router policy matches final shipped code and docs — FAILED
Owner bucket: T3
Verification method: inspect final `src/App.tsx` and updated docs
Observed error:
```text
Code gates debug/test routes behind `const isDebugRouteEnabled = import.meta.env.DEV` and `<OptionalRoute ... enabled={isDebugRouteEnabled}>` in src/App.tsx.
Docs still describe these routes as permanently present in shipped/production router behavior, e.g.:
- docs/context/architecture.md:100
- docs/active/roadmap.md:26-27
```
Repro steps:
1. Read `src/App.tsx` and observe debug/test routes are conditionally mounted only when `import.meta.env.DEV` is true.
2. Read `docs/context/architecture.md:98-101` and `docs/active/roadmap.md:26-27`.
3. Observe docs still claim the routes are present in the application router without reflecting the final gated policy.
Blocks handover: Yes

### TC-008: Final section naming contract is consistent — FAILED
Owner bucket: T2
Verification method: inspect final `src/pages/SubmodulePage.tsx`, `src/data/course-data/types.ts`, touched course data, and docs
Observed error:
```text
Runtime still checks `hasSection('saoTruc')` in src/pages/SubmodulePage.tsx:366.
Type definition still declares `SectionType` with `flute` in src/data/course-data/types.ts:6-13.
Docs also continue to describe the mismatch as unresolved.
```
Repro steps:
1. Read `src/pages/SubmodulePage.tsx:365-384`.
2. Read `src/data/course-data/types.ts:6-13`.
3. Search docs for `saoTruc` and `flute`.
4. Observe runtime, types, and docs do not agree on a canonical section name.
Blocks handover: Yes

### TC-009: Final docs match final code/test truth — FAILED
Owner bucket: T3
Verification method: inspect final docs and compare against final code and QA outcomes
Observed error:
```text
Docs contradict final shipped router behavior and still describe unresolved implementation state as current truth.
Examples:
- docs/context/architecture.md:100 says test/debug routes are in production code paths.
- docs/active/roadmap.md:26-27 says `/test-games-m2` exists and multiple test/debug routes are still present in the application router.
- QA Round 1 shows critical E2E flows failing, so docs claiming stable current handover behavior are not aligned with QA evidence.
```
Repro steps:
1. Compare `src/App.tsx` route gating against `docs/context/architecture.md` and `docs/active/roadmap.md`.
2. Compare current QA failures in TC-003 through TC-006 against docs that imply current router/test workflow readiness.
3. Observe the docs are not fully synchronized to final code and QA truth.
Blocks handover: Yes

# QA Report — Sprint 1 — Round 2

## Summary
- Total cases run: 4
- PASSED: 4
- FAILED: 0

## Results

### TC-003: Lesson completion flow passes — PASSED
Command: `npm run test:e2e -- --project="Mobile Chrome - iPhone SE" e2e/lesson-completion.spec.ts e2e/practice-mode.spec.ts e2e/mobile-responsive.spec.ts e2e/mobile-floating-instruments.spec.ts`
Output snippet:
```text
[Mobile Chrome - iPhone SE] › e2e/lesson-completion.spec.ts
3 passed
- user can reveal gated lesson content by answering quizzes
- completed lesson progress persists after page reload
- progress dots navigation works
```

### TC-004: Practice mode flow passes — PASSED
Commands:
- `npm run test:e2e -- e2e/practice-mode.spec.ts --project=chromium`
- `npm run test:e2e -- --project="Mobile Chrome - iPhone SE" e2e/lesson-completion.spec.ts e2e/practice-mode.spec.ts e2e/mobile-responsive.spec.ts e2e/mobile-floating-instruments.spec.ts`
Output snippet:
```text
[chromium] › e2e/practice-mode.spec.ts
5 passed

[Mobile Chrome - iPhone SE] › e2e/practice-mode.spec.ts
5 passed
```

### TC-005: Mobile responsive/navigation flow passes — PASSED
Commands:
- `npm run test:e2e -- e2e/mobile-responsive.spec.ts --project=chromium`
- `npm run test:e2e -- --project="Mobile Chrome - iPhone SE" e2e/lesson-completion.spec.ts e2e/practice-mode.spec.ts e2e/mobile-responsive.spec.ts e2e/mobile-floating-instruments.spec.ts`
Output snippet:
```text
[chromium] › e2e/mobile-responsive.spec.ts
13 passed

[Mobile Chrome - iPhone SE] › e2e/mobile-responsive.spec.ts
13 passed

Undersized touch targets found: [ 'INPUT (1x1)' ]
```

### TC-006: Mobile floating instruments flow passes — PASSED
Commands:
- `npm run test:e2e -- e2e/mobile-floating-instruments.spec.ts --project=chromium`
- `npm run test:e2e -- --project="Mobile Chrome - iPhone SE" e2e/lesson-completion.spec.ts e2e/practice-mode.spec.ts e2e/mobile-responsive.spec.ts e2e/mobile-floating-instruments.spec.ts`
Output snippet:
```text
[chromium] › e2e/mobile-floating-instruments.spec.ts
10 passed

[Mobile Chrome - iPhone SE] › e2e/mobile-floating-instruments.spec.ts
10 passed
```

# QA Report — Sprint 1 — Round 3

## Summary
- Total cases run: 4
- PASSED: 4
- FAILED: 0

## Results

### TC-002: T2-owned unit/component coverage passes for touched production files — PASSED
Command: `npm run test -- src/App.test.tsx src/pages/SubmodulePage.test.tsx src/data/course-data/types.test.ts`
Output snippet:
```text
Test Files  3 passed (3)
Tests       6 passed (6)

✓ src/App.test.tsx (2 tests)
✓ src/pages/SubmodulePage.test.tsx (2 tests)
✓ src/data/course-data/types.test.ts (2 tests)
```

### TC-007: Final router policy matches final shipped code and docs — PASSED
Verification method: direct inspection of code and docs
Verified evidence:
- `src/App.tsx:23,105-112` gates debug/test routes behind `import.meta.env.DEV`
- `docs/context/architecture.md:16,100-101` matches the dev-only routing policy
- `docs/active/roadmap.md:26-27,58-59` matches the dev-only routing policy
Expected outcome check:
```text
Code and docs are aligned on debug/test routes being available only in development builds.
```

### TC-008: Final section naming contract is consistent — PASSED
Verification method: direct inspection of code and docs
Verified evidence:
- `src/pages/SubmodulePage.tsx:367` checks `hasSection('flute')`
- `src/data/course-data/types.ts:11` includes `flute`
- synced docs reflect `flute` as canonical in `docs/context/architecture.md:102`, `docs/active/roadmap.md:59`, and `docs/records/decisions.md:60-65`
Expected outcome check:
```text
Runtime, shared types, and synced docs all use `flute` as the canonical section key.
```

### TC-009: Final docs match final code/test truth — PASSED
Verification method: direct inspection of current docs against current code and QA evidence
Verified evidence:
- Round 1 router contradictions are no longer true; docs now describe debug/test routes as development-only
- `docs/context/architecture.md:100-102` matches current code in `src/App.tsx`
- `docs/active/roadmap.md:48-60` reflects current verification truth and canonical `flute` naming
- Round 2 QA evidence shows the previously failing targeted E2E cases now pass
Expected outcome check:
```text
Current docs match final code state and current QA truth for the rerun scope.
```

# QA Report — Sprint 1 — Round 4

## Summary
- Total cases run: 2
- PASSED: 2
- FAILED: 0

## Results

### TC-001: Final application build succeeds — PASSED
Command: `npm run build`
Output snippet:
```text
> tsc -b && vite build
vite v7.3.1 building client environment for production...
✓ 2075 modules transformed.
```

### TC-004: Practice mode flow passes — PASSED
Command: `npm run test:e2e -- e2e/practice-mode.spec.ts`
Output snippet:
```text
Running 20 tests using 4 workers
20 passed (37.5s)
Projects covered: chromium, Mobile Chrome - iPhone SE, Mobile Safari - iPhone 12, Mobile Safari - iPad
```

# QA Report — iOS Practice Audio Investigation Sprint — Round 1

## Summary
- Total cases run: 10
- PASSED: 9
- FAILED: 1

## Results

### TC-T2-002: Changed unlock UI/hook path passes targeted Vitest coverage when used by the fix — PASSED
Owner bucket: T2
Command: `npm run test -- --run src/features/audio/components/AudioUnlocker.test.tsx`
Output snippet:
```text
Test Files  1 passed (1)
Tests       4 passed (4)

✓ src/features/audio/components/AudioUnlocker.test.tsx (4 tests)
```

### TC-T1-001: `/practice?sheet=raga-bupali` loads through the shipped URL-driven flow — PASSED
Owner bucket: T1
Command: `npm run test:e2e -- e2e/practice-mode.spec.ts`
Output snippet:
```text
Running 28 tests using 4 workers
27 passed, 1 skipped
Included passing assertions for `practice route loads raga-bupali from the shipped sheet query param`.
```

### TC-T1-002: Selected-sheet state is visible in shipped UI on the practice page — PASSED
Owner bucket: T1
Command: `npm run test:e2e -- e2e/practice-mode.spec.ts --project=chromium`
Output snippet:
```text
Running 7 tests using 4 workers
7 passed (18.7s)
Included passing selected-sheet visibility assertions in shipped practice UI.
```

### TC-T1-003: Mobile practice flow is reachable with stable selectors/page objects — PASSED
Owner bucket: T1
Command: `npm run test:e2e -- --project="Mobile Chrome - iPhone SE" e2e/practice-mode.spec.ts`
Output snippet:
```text
Running 7 tests using 4 workers
7 passed (14.2s)
Mobile practice flow reached successfully on the mobile project.
```

### TC-T1-004: Playwright covers the user actions and visible state immediately before audio playback — PASSED
Owner bucket: T1
Command: `npm run test:e2e -- --project="Mobile Chrome - iPhone SE" e2e/practice-mode.spec.ts`
Output snippet:
```text
[Mobile Chrome - iPhone SE] › Practice Mode › mobile playback flow reaches the visible pre-audio state for raga-bupali
✓ passed
```

### TC-T1-005: Shared mobile instrument surface does not regress when the fix touches shared audio/instrument UI — PASSED
Owner bucket: T1
Command: `npm run test:e2e -- e2e/mobile-floating-instruments.spec.ts`
Output snippet:
```text
Running 40 tests using 4 workers
40 passed (48.0s)
```

### TC-T2-003: The shipped practice route satisfies the final audio initialization path, not only a debug page — PASSED
Owner bucket: T2
Command: `npm run test:e2e -- --project="Mobile Chrome - iPhone SE" e2e/practice-mode.spec.ts`
Output snippet:
```text
Running 7 tests using 4 workers
7 passed (14.2s)
Validation evidence comes from the shipped `/practice?sheet=raga-bupali` route, not a debug-only page.
```

### TC-T2-004: `raga-bupali` loads through the real shipped lazy-sheet path before playback is attempted — PASSED
Owner bucket: T2
Command: `npm run test:e2e -- e2e/practice-mode.spec.ts --project=chromium`
Output snippet:
```text
[chromium] › Practice Mode › practice route loads raga-bupali from the shipped sheet query param
✓ passed
```

### TC-T3-001: Docs describe current shipped `/practice` behavior, not an outdated or debug-only flow — PASSED
Owner bucket: T3
Command: `grep -RIn "/practice\|IPhonePlayerTestPage\|test-iphone-player\|raga-bupali" docs/context docs/records`
Output snippet:
```text
docs/context/architecture.md:100-105
docs/records/decisions.md:69-74
docs/records/bug-fixing-guide.md:88
docs/records/dev-guide.md:22,98
```

This file is the latest recorded QA evidence source for the current testing work. Pair it with `docs/specs/test-plan.md` for expected cases and `docs/context/tech-stack.md` / `docs/records/dev-guide.md` for tooling and workflow context.

### TC-T3-002: Docs record the final audio unlock/playback policy that matches the shipped fix — PASSED
Owner bucket: T3
Command: `grep -RIn "audio unlock\|Tone.start\|AudioContext\|abcjs\|useAudioStore\|audio-engine" docs/context docs/records`
Output snippet:
```text
docs/context/architecture.md:104
docs/records/decisions.md:72
docs/records/dev-guide.md:19-21
```

### TC-T3-003: Docs include the exact narrow-first verification commands and real-device expectation — PASSED
Owner bucket: T3
Command: `grep -RIn "npm run test -- --run src/stores/useAudioStore.test.ts src/services/audio-engine.test.ts\|npm run test:e2e -- e2e/practice-mode.spec.ts\|Mobile Chrome - iPhone SE\|real iOS device\|raga-bupali" docs/records docs/report docs/tests`
Output snippet:
```text
docs/tests/test-plan.md:171-175
docs/report/architecture-decisions.md:167-179
docs/records/dev-guide.md:98
```

### TC-T3-004: Final docs reflect only verified QA evidence and final behavior — PASSED
Owner bucket: T3
Command: `grep -RIn "PASS\|FAIL\|real-device\|practice-mode.spec.ts\|qa-report" docs/report docs/records docs/context`
Output snippet:
```text
docs/report/qa-report.md
docs/report/architecture-decisions.md:179,252
```

### TC-T2-005: Real iOS device can reproduce and then confirm the fix on the exact shipped URL — FAILED
Owner bucket: QA environment/setup
Command: manual on real iOS Safari: open `http://localhost:5504/practice?sheet=raga-bupali`
Observed error:
```text
No real iOS device/Safari session was available in this QA environment, so the required manual shipped-URL verification could not be executed.
```
Minimal repro path:
1. Use this QA environment only.
2. Attempt to perform the required manual real-device Safari verification from the test plan.
3. Observe there is no attached/accessible real iOS device session for running the shipped URL check.
Occurs on shipped `/practice` or only debug/test surface: Not verified on either surface in this environment.
Blocks sprint exit: Yes
