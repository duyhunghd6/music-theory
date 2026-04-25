# Implementation Notes

<!-- beads-id: doc-dvg -->

## Architecture Decisions

<!-- beads-id: doc-dvg-s1 -->

### State Management

<!-- beads-id: doc-dvg-s2 -->

- **Zustand** for global state (simpler than Redux, TypeScript-friendly)
- **IndexedDB** via custom adapter for progress persistence (more robust than localStorage)
- Separate stores: `useModuleStore`, `useProgressStore`, `useAudioStore`, `useSettingsStore`

### Routing

<!-- beads-id: doc-dvg-s3 -->

- **React Router 7** with lazy loading for performance
- Shipped routes: `/`, `/compose`, `/module/:moduleId/:submoduleId`, `/practice`, `/demo`, `/abc-editor`
- Debug/test routes such as `/test-ui` and `/test-games-m2` are mounted only when `import.meta.env.DEV` is true

### Audio

<!-- beads-id: doc-dvg-s4 -->

- **Tone.js** drives the shipped instrument/note playback path through `useAudioStore` and `src/services/audio-engine.ts`
- **abcjs** drives notation rendering and playback through `src/components/abc/AbcRenderer.tsx`
- The current shipped audio behavior depends on a user gesture unlocking playback entry: Tone-based playback calls `Tone.start()`, while abcjs playback creates and resumes an `AudioContext`/`webkitAudioContext` before synth playback
- `src/pages/IPhonePlayerTestPage.tsx` is DEV-only diagnostic tooling for iOS Safari constraints and should not be documented as the production fix surface

---

## Key Data Structures

<!-- beads-id: doc-dvg-s5 -->

### Submodule Configuration

<!-- beads-id: doc-dvg-s6 -->

```typescript
interface Submodule {
  id: string // "1.1", "1.2", etc.
  title: string
  description: string
  sections: SectionType[] // Controls what UI sections appear
  theoryContent?: string // Markdown for theory panel
  staffAbc?: string // ABC notation for Grand Staff
  abcDemos?: AbcDemo[] // Interactive notation examples
  exercises?: Exercise[] // Quizzes/exercises
}
```

### Progress Tracking

<!-- beads-id: doc-dvg-s7 -->

```typescript
interface UserProgress {
  completedSubmodules: string[]
  currentModuleId: number
  currentSubmoduleId: string
  totalXP: number
  streakDays: number
  lastActiveDate: string
  submoduleScores: Record<string, number>
}
```

---

## Component Patterns

<!-- beads-id: doc-dvg-s8 -->

### Lazy Loading

<!-- beads-id: doc-dvg-s9 -->

All heavy components use `React.lazy()`:

```tsx
const AbcGrandStaff = React.lazy(() => import('../components/MusicStaff/AbcGrandStaff'))
```

### Conditional Sections

<!-- beads-id: doc-dvg-s10 -->

SubmodulePage checks `submodule.sections` to show/hide UI:

```tsx
const hasSection = (section: SectionType) => submodule?.sections.includes(section) ?? false
{hasSection('piano') && <VirtualPiano ... />}
```

The current canonical section key for the Vietnamese bamboo flute visualizer is `flute`.

### ABC Override Pattern

<!-- beads-id: doc-dvg-s11 -->

For lesson-specific notation:

```tsx
<AbcGrandStaff
  showNoteNames={showNoteNames}
  overrideAbc={submodule.staffAbc} // Bypasses recorded notes
/>
```

---

## Testing workflow

<!-- beads-id: doc-dvg-s12 -->

- Treat `docs/` as the source of truth for project testing guidance; do not rely on root-level `TESTING.md`.
- Use `docs/context/tech-stack.md` for the verified test toolchain and available scripts.
- Use `docs/specs/test-plan.md` for required execution order, narrow-first verification scope, and exact command expectations for current work.
- Use `docs/reviews/qa-report.md` for the latest executed QA evidence, pass/fail status, and unresolved environment gaps.
- Keep Playwright headless for agent-driven verification, and avoid spawning multiple browsers.
- Prefer narrow-first verification: start with the smallest relevant Vitest or Playwright command, then expand only when the task or QA evidence requires it.

## Known Technical Debt

<!-- beads-id: doc-dvg-s13 -->

1. **Formatting/Prettier Issues** - Many files have eslint formatting warnings (not blocking builds)
2. **abcjs Types** - Some TypeScript workarounds for abcjs callback types
3. **Verification Discipline** - Handover work should stay narrow-first and record the exact owned commands that passed, including `npm run test -- src/App.test.tsx`, `npm run build`, `npm run test:e2e -- e2e/practice-mode.spec.ts --project=chromium`, `npm run test:e2e -- e2e/mobile-floating-instruments.spec.ts --project=chromium`, `npm run test:e2e -- e2e/mobile-responsive.spec.ts --project=chromium`, `npm run test:e2e -- --project="Mobile Chrome - iPhone SE" e2e/lesson-completion.spec.ts e2e/practice-mode.spec.ts e2e/mobile-responsive.spec.ts e2e/mobile-floating-instruments.spec.ts`, and the final all-project rerun `npm run test:e2e -- e2e/practice-mode.spec.ts` when QA needs cross-browser confirmation for the shipped practice flow.
4. **Real-device exit criteria** - For iOS audio issues on shipped `/practice`, simulator/desktop automation is not enough by itself; keep the real iOS Safari check on `http://localhost:5504/practice?sheet=raga-bupali` as required sprint-exit evidence.
5. **Bundle Size** - Main chunks exceed 500KB (could benefit from more code splitting)

---

## File Organization

<!-- beads-id: doc-dvg-s14 -->

```
src/
├── data/
│   └── course-data.ts      # Curriculum definition
├── stores/
│   ├── useProgressStore.ts # User progress (IndexedDB)
│   └── useAudioStore.ts    # Audio engine state
├── components/
│   └── modules/
│       ├── AbcDemoSection.tsx
│       └── NoteIdentificationQuiz.tsx
├── pages/
│   ├── SubmodulePage.tsx   # Dynamic lesson page
│   ├── PracticePage.tsx
│   └── ProfilePage.tsx
```
