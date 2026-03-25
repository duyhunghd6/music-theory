# Implementation Notes

## Architecture Decisions

### State Management

- **Zustand** for global state (simpler than Redux, TypeScript-friendly)
- **IndexedDB** via custom adapter for progress persistence (more robust than localStorage)
- Separate stores: `useModuleStore`, `useProgressStore`, `useAudioStore`, `useSettingsStore`

### Routing

- **React Router 7** with lazy loading for performance
- Shipped routes: `/`, `/compose`, `/module/:moduleId/:submoduleId`, `/practice`, `/demo`, `/abc-editor`
- Debug/test routes such as `/test-ui` and `/test-games-m2` are mounted only when `import.meta.env.DEV` is true

### Audio

- **Tone.js** drives the shipped instrument/note playback path through `useAudioStore` and `src/services/audio-engine.ts`
- **abcjs** drives notation rendering and playback through `src/components/abc/AbcRenderer.tsx`
- The current shipped audio behavior depends on a user gesture unlocking playback entry: Tone-based playback calls `Tone.start()`, while abcjs playback creates and resumes an `AudioContext`/`webkitAudioContext` before synth playback
- `src/pages/IPhonePlayerTestPage.tsx` is DEV-only diagnostic tooling for iOS Safari constraints and should not be documented as the production fix surface

---

## Key Data Structures

### Submodule Configuration

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

### Lazy Loading

All heavy components use `React.lazy()`:

```tsx
const AbcGrandStaff = React.lazy(() => import('../components/MusicStaff/AbcGrandStaff'))
```

### Conditional Sections

SubmodulePage checks `submodule.sections` to show/hide UI:

```tsx
const hasSection = (section: SectionType) => submodule?.sections.includes(section) ?? false
{hasSection('piano') && <VirtualPiano ... />}
```

The current canonical section key for the Vietnamese bamboo flute visualizer is `flute`.

### ABC Override Pattern

For lesson-specific notation:

```tsx
<AbcGrandStaff
  showNoteNames={showNoteNames}
  overrideAbc={submodule.staffAbc} // Bypasses recorded notes
/>
```

---

## Known Technical Debt

1. **Formatting/Prettier Issues** - Many files have eslint formatting warnings (not blocking builds)
2. **abcjs Types** - Some TypeScript workarounds for abcjs callback types
3. **Verification Discipline** - Handover work should stay narrow-first and record the exact owned commands that passed, including `npm run test -- src/App.test.tsx`, `npm run build`, `npm run test:e2e -- e2e/practice-mode.spec.ts --project=chromium`, `npm run test:e2e -- e2e/mobile-floating-instruments.spec.ts --project=chromium`, `npm run test:e2e -- e2e/mobile-responsive.spec.ts --project=chromium`, `npm run test:e2e -- --project="Mobile Chrome - iPhone SE" e2e/lesson-completion.spec.ts e2e/practice-mode.spec.ts e2e/mobile-responsive.spec.ts e2e/mobile-floating-instruments.spec.ts`, and the final all-project rerun `npm run test:e2e -- e2e/practice-mode.spec.ts` when QA needs cross-browser confirmation for the shipped practice flow.
4. **Real-device exit criteria** - For iOS audio issues on shipped `/practice`, simulator/desktop automation is not enough by itself; keep the real iOS Safari check on `http://localhost:5504/practice?sheet=raga-bupali` as required sprint-exit evidence.
5. **Bundle Size** - Main chunks exceed 500KB (could benefit from more code splitting)

---

## File Organization

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
