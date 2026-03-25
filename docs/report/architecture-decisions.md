# Architecture Decisions — iOS Practice Audio Investigation Sprint

## 1. Sprint goal and scope summary

Sprint goal: identify and resolve the iOS real-device audio failure on `http://localhost:5504/practice?sheet=raga-bupali` without broad refactors, while keeping validation tightly focused on the shipped practice runtime and its audio entry points.

Scope is limited to three workstreams:

- T1: add and harden targeted Playwright coverage for the iOS practice audio flow, especially the shipped `/practice` route, `sheet=` URL loading, and mobile-visible audio entry behavior around the selected sheet and instrument surfaces.
- T2: investigate and fix the production/runtime cause of iOS audio failure in the practice/audio stack, covering the actual unlock path, ABC playback path, and any browser-policy-sensitive audio initialization logic required for real-device playback.
- T3: sync docs only after T1/T2 and QA complete, so final docs describe the verified iOS audio behavior and exact validation path.

Out of scope:

- new product features
- converting the app to a different audio architecture
- broad notation/player rewrites outside the failing iOS path
- expanding E2E beyond the narrow practice/mobile/audio flow unless QA evidence requires it
- using debug-only routes as the primary fix surface for the shipped `/practice` issue

## 2. Task split and dependency order

### T1 — Targeted E2E coverage for iOS practice audio

Purpose: prove the shipped practice route remains stable and give T2 a reproducible guardrail around sheet loading and user-visible audio-entry behavior.

Primary concerns:

- `/practice?sheet=raga-bupali` loads the intended sheet through the existing URL-driven selection flow
- the selected-sheet state is visible through shipped UI (`NowPlayingBanner`, grand staff, practice panels)
- mobile practice flow remains reachable with stable selectors/page objects
- if browser/device audio behavior cannot be asserted directly in Playwright, the spec should still verify the user actions and DOM state that precede the real-device audio failure

### T2 — iOS audio runtime investigation and fix

Purpose: fix the real production issue on the shipped practice/audio path.

Primary concerns:

- audio initialization in `src/stores/useAudioStore.ts`
- Tone-based unlock and resume behavior in `src/services/audio-engine.ts` and `src/services/AudioContextManager.ts`
- abcjs playback/audio-context handling in `src/components/abc/AbcRenderer.tsx`
- any practice-route-specific trigger point that fails to satisfy iOS Safari gesture/autoplay requirements
- consistency between the shipped route and any iOS-specific debug learnings from `src/pages/IPhonePlayerTestPage.tsx`

### T3 — Docs sync after verified fix

Purpose: update docs to match the final fix, final ownership boundaries, and final QA evidence.

Primary concerns:

- current shipped behavior of `/practice`
- final audio unlock/playback policy
- exact narrow-first verification commands and real-device expectations
- avoid promoting debug/test pages as the production solution

### Dependency order

1. ARCH defines ownership and integration points first.
2. T1 and T2 may run in parallel once ownership is explicit.
3. T1 owns tests/page objects only; if T1 exposes a product bug, that fix moves to T2.
4. T2 owns all shipped runtime fixes.
5. T3 starts only after T1/T2 outcomes and QA evidence are final.
6. QA runs narrow-first: targeted unit/component checks for T2 changes, then targeted Playwright coverage, then any explicitly necessary reruns.

## 3. File ownership map

### Authoritative boundaries

| Task | File/Module | Owner | Read-only access / notes |
|:---|:---|:---|:---|
| T1 | `/Users/steve/duyhunghd6/music-theory/e2e/practice-mode.spec.ts` | Dev1 | Primary shipped practice coverage |
| T1 | `/Users/steve/duyhunghd6/music-theory/e2e/pages/PracticePage.ts` | Dev1 | Page-object ownership stays with Dev1 |
| T1 | `/Users/steve/duyhunghd6/music-theory/e2e/mobile-floating-instruments.spec.ts` | Dev1 | Read-only regression reference unless T1 must narrow/add iOS-related mobile assertions |
| T1 | `/Users/steve/duyhunghd6/music-theory/e2e/mobile-responsive.spec.ts` | Dev1 | Read-only regression reference unless a targeted mobile selector update is required |
| T1 | `/Users/steve/duyhunghd6/music-theory/playwright.config.ts` | Dev1 | Only if project/device config must change for targeted iOS validation |
| T1 | `/Users/steve/duyhunghd6/music-theory/src/components/practice/NowPlayingBanner.tsx` | Dev1 only for testability hooks | No behavior changes |
| T1 | `/Users/steve/duyhunghd6/music-theory/src/components/practice/SheetSelectorModal.tsx` | Dev1 only for stable selectors/testability hooks | Do not alter loading logic |
| T1 | `/Users/steve/duyhunghd6/music-theory/src/pages/PracticePage.tsx` | Dev1 only for stable selectors/testability hooks | Runtime/audio fixes remain T2-owned |
| T2 | `/Users/steve/duyhunghd6/music-theory/src/stores/useAudioStore.ts` | Dev2 | Canonical shipped audio entry point |
| T2 | `/Users/steve/duyhunghd6/music-theory/src/services/audio-engine.ts` | Dev2 | Tone initialization and synth playback ownership |
| T2 | `/Users/steve/duyhunghd6/music-theory/src/services/AudioContextManager.ts` | Dev2 | AudioContext lifecycle ownership |
| T2 | `/Users/steve/duyhunghd6/music-theory/src/components/abc/AbcRenderer.tsx` | Dev2 | abcjs playback and audio-context handling |
| T2 | `/Users/steve/duyhunghd6/music-theory/src/pages/PracticePage.tsx` | Dev2 for shipped runtime/audio behavior | Shared with T1 only for selector/testability hooks |
| T2 | `/Users/steve/duyhunghd6/music-theory/src/components/ui/FloatingInstrumentsContainer.tsx` | Dev2 | Shipped instrument/audio interaction surface |
| T2 | `/Users/steve/duyhunghd6/music-theory/src/features/audio/components/AudioUnlocker.tsx` | Dev2 | If reintroduced/wired as part of actual shipped fix |
| T2 | `/Users/steve/duyhunghd6/music-theory/src/hooks/useAudioContext.ts` | Dev2 | Shared hook for unlock state if fix requires it |
| T2 | `/Users/steve/duyhunghd6/music-theory/src/features/audio/constants.ts` | Dev2 | Only if shipped unlock copy changes with implementation |
| T2 | `/Users/steve/duyhunghd6/music-theory/src/pages/IPhonePlayerTestPage.tsx` | Dev2 | Debug-only reference surface; not the primary production fix target |
| T2 | Adjacent tests for touched runtime/audio files | Dev2 | Includes unit/component tests needed to lock the fix |
| T3 | `/Users/steve/duyhunghd6/music-theory/docs/context/ARCHITECTURE.md` | Dev3 | Update only after final code truth is known |
| T3 | `/Users/steve/duyhunghd6/music-theory/docs/context/TECH_STACK.md` | Dev3 | Read-only for Dev1/Dev2 |
| T3 | `/Users/steve/duyhunghd6/music-theory/docs/records/dev-guide.md` | Dev3 | Update workflow only from verified evidence |
| T3 | `/Users/steve/duyhunghd6/music-theory/docs/records/decisions.md` | Dev3 | Record final iOS audio decision only if verified |
| T3 | `/Users/steve/duyhunghd6/music-theory/docs/records/bug-fixing-guide.md` | Dev3 | Keep narrow-first guidance aligned with actual fix flow |
| T3 | `/Users/steve/duyhunghd6/music-theory/docs/report/qa-report.md` | QA | Dev3 may read only |
| T3 | `/Users/steve/duyhunghd6/music-theory/docs/tests/test-plan.md` | QA | Dev3 may read only |
| ARCH | `/Users/steve/duyhunghd6/music-theory/docs/report/architecture-decisions.md` | ARCH | Read-only for all devs and QA |

### Collision-prevention rules

- Dev1 does not edit shipped audio services, stores, or abcjs/Tone runtime code.
- Dev2 does not edit Playwright specs, Playwright page objects, or Playwright config.
- Shared file exception: `src/pages/PracticePage.tsx` may receive Dev1 testability hooks or Dev2 runtime fixes, but not both at once. Dev1 must limit changes to selectors/hooks only; Dev2 owns all behavior logic.
- `src/components/practice/SheetSelectorModal.tsx` follows the same split: Dev1 selector hooks only, Dev2 logic only if the runtime bug requires it.
- Dev3 edits docs only after QA evidence exists.
- No one treats `src/pages/IPhonePlayerTestPage.tsx` as the shipped fix unless ARCH explicitly reassigns scope.

## 4. Integration points

### Shipped route and URL-driven practice runtime

- `src/App.tsx` mounts the shipped `/practice` route.
- `src/pages/PracticePage.tsx` reads `sheet` from `useSearchParams`, loads curriculum or lazy ABC assets, and renders the selected sheet into the grand staff plus the flute/practice UI.
- `src/components/practice/SheetSelectorModal.tsx` derives a clean sheet id from lazy-loaded filenames, including `raga-bupali`, and passes the selected sheet back into the practice page.
- `src/data/practiceLibrary.ts` is the source of the lazy collection loaders for Butterworth and Sahaja Yoga songs. `raga-bupali` belongs to the Sahaja Yoga lazy-load path.

Implication: the investigation target is not only “audio failed,” but the full chain from `/practice?sheet=raga-bupali` URL parsing -> sheet resolution -> rendered player surface -> user gesture -> audio playback.

### Audio entry points

There are multiple active audio paths in the repo; the sprint must keep them distinct:

1. `src/stores/useAudioStore.ts`
   - user-facing store entry for initialize/start/play/release/highlight behavior
   - auto-initializes audio on first interaction via `audioEngine.initialize()`

2. `src/services/audio-engine.ts`
   - current Tone-based poly synth path used by the shared store
   - dynamically imports Tone and calls `Tone.start()` during initialization
   - likely relevant to iOS user-gesture and resume behavior

3. `src/services/AudioContextManager.ts` and `src/hooks/useAudioContext.ts`
   - separate unlock/resume abstraction around Tone context
   - important because the codebase currently has more than one audio-init pattern

4. `src/components/abc/AbcRenderer.tsx`
   - creates its own `AudioContext`, initializes abcjs synth playback, resumes suspended context, and drives note highlighting during playback
   - this is an independent browser-policy-sensitive path from `useAudioStore`

Implication: the likely architectural risk is split ownership of audio unlock behavior across more than one runtime path. T2 must fix the production issue without increasing that divergence.

### Mobile and floating-instrument surfaces

- `src/components/ui/FloatingInstrumentsContainer.tsx` binds instrument interaction to `useAudioStore` and is always mounted globally from `src/App.tsx`.
- Existing mobile E2E coverage exercises floating instrument visibility and layout from lesson pages, not the exact shipped practice audio failure.
- Practice mode also renders a flute panel directly inside `src/pages/PracticePage.tsx`.

Implication: T1 can reuse mobile coverage patterns, but the sprint-critical path is the practice page with selected sheet, not generic mobile layout alone.

### Debug/test surface versus shipped fix surface

- `src/pages/IPhonePlayerTestPage.tsx` documents iOS Safari constraints well: user gesture, `navigator.audioSession`, fallback `webkitAudioContext`, and abcjs synth setup.
- This page is debug-only through the DEV-gated route in `src/App.tsx`.

Implication: Dev2 may borrow technical learnings from this page, but production behavior must be corrected in shipped runtime files, not solved only inside the debug page.

## 5. QA expectations and targeted validation guidance

### Required validation sequence

QA should run narrow-first:

1. targeted unit/component tests for the T2-owned runtime files changed
2. targeted Playwright run for the shipped practice path
3. targeted mobile/floating-instrument regression only if the touched fix area could affect that surface
4. real-device iOS repro/confirmation against `http://localhost:5504/practice?sheet=raga-bupali`
5. broader reruns only if a verified regression risk justifies them

### Minimum targeted validation set

- relevant Vitest coverage for any changed T2-owned audio/runtime files
- `npm run test:e2e -- e2e/practice-mode.spec.ts`
- any new or narrowed Playwright command that specifically covers `/practice?sheet=raga-bupali` or equivalent shipped URL-loading/audio-entry behavior
- targeted re-run of `e2e/mobile-floating-instruments.spec.ts` only if the fix touches shared instrument/audio surfaces in a way that could regress mobile behavior

### Real-device expectation

Because the reported bug is iOS real-device audio failure, sprint exit is not complete on simulator/desktop evidence alone. QA must record whether a real iOS device can reproduce and then confirm the final fix on the exact shipped URL.

### Failure reporting standard

Every failure record must include:

- exact command or manual device step
- whether the failure is in T1 test coverage, T2 production runtime, or QA environment/setup
- observed symptom at the user level
- minimal repro path
- whether the issue occurs on shipped `/practice` or only on debug/test surfaces

## 6. Design constraints

### Shared constraints

- Keep changes minimal and scoped to the iOS practice audio failure.
- Do not turn this sprint into a broad audio refactor.
- Prefer one canonical shipped fix path over duplicating more unlock logic.
- Do not rely on debug-only routes as proof that shipped behavior works.
- Prefer stable selectors and page objects over brittle text-only targeting in E2E.
- Keep verification narrow first; avoid the full Playwright matrix unless the user explicitly asks or QA finds regression risk.

### Dev1 constraints

- Stay in Playwright specs, page objects, config, and testability hooks only.
- Prioritize a deterministic practice-page path that can load a known sheet directly from the URL.
- If direct audio assertion is not technically reliable in Playwright, assert the user actions and visible state leading into playback and hand off the runtime symptom to Dev2.
- Do not fix Tone/abcjs/runtime logic.

### Dev2 constraints

- Own the shipped runtime fix.
- Treat `src/pages/IPhonePlayerTestPage.tsx` as reference, not destination.
- Avoid introducing a third audio unlock pattern.
- Prefer consolidating or correctly sequencing existing Tone/AudioContext/abcjs behavior rather than layering more ad hoc fallback code.
- If copy or unlock UI changes are required, only change the shipped surface actually used by the fix.

### Dev3 constraints

- Document only final verified reality.
- Be explicit about the difference between shipped `/practice` behavior and DEV-only iPhone test tooling.
- Record exact commands and device-validation evidence, not assumptions.

## 7. Risks

1. **Split audio initialization paths**
   - `useAudioStore`/`audio-engine`, `AudioContextManager`, and `AbcRenderer` do not share one obvious canonical unlock path.
   - Risk: a local fix in one path leaves the shipped practice path broken or inconsistent on iOS.

2. **Playwright cannot fully prove real-device audio success**
   - E2E can validate flow and DOM state but may not directly prove audible output on iOS hardware.
   - Risk: false confidence unless real-device validation remains part of exit criteria.

3. **Debug-page drift**
   - `IPhonePlayerTestPage.tsx` may behave differently from the shipped practice route.
   - Risk: fixing the debug page instead of the product surface.

4. **Shared practice-page ownership risk**
   - `src/pages/PracticePage.tsx` sits at the seam between E2E selectors and runtime logic.
   - Risk: Dev1/Dev2 collisions if boundaries are not respected.

5. **Lazy-loaded sheet path assumptions**
   - `raga-bupali` is resolved through lazy import filename handling, not a hardcoded page constant.
   - Risk: tests or fixes that assume a different loader path will miss the real issue.

## 8. Expected sprint exit state

The sprint is architecture-complete when:

- ownership boundaries remain conflict-free,
- targeted coverage exists for the shipped practice path,
- the iOS audio failure is fixed in shipped runtime code,
- QA records both automation evidence and real-device confirmation on `/practice?sheet=raga-bupali`,
- docs describe only the final verified behavior.
