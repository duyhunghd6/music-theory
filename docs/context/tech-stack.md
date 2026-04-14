# Tech Stack

Last updated: 2026-03-24
Status: synced to `package.json`

## Core runtime

| Package | Version | Why it is here |
| --- | --- | --- |
| react | ^19.2.0 | Core UI runtime for the SPA |
| react-dom | ^19.2.0 | Browser renderer for React |
| react-router-dom | ^7.12.0 | Client-side routing across course, practice, and test pages |
| typescript | ~5.9.3 | Static typing across app, data, and services |
| vite | ^7.2.4 | Dev server and production bundler |

## State and app structure

| Package | Version | Why it is here |
| --- | --- | --- |
| zustand | ^5.0.9 | Lightweight stores for progress, audio, settings, and UI state |
| clsx | ^2.1.1 | Conditional class name composition |
| tailwind-merge | ^3.4.0 | Safe Tailwind class merging |
| use-debounce | ^10.1.0 | Debounced interactions and sync behavior |
| react-use | ^17.6.0 | Utility hooks |

## Music notation, audio, and instrument tooling

| Package | Version | Why it is here |
| --- | --- | --- |
| abcjs | ^6.6.0 | Interactive ABC notation rendering and playback |
| vexflow | ^5.0.0 | Staff/music engraving components outside ABC workflows |
| tone | ^15.1.22 | Audio synthesis, timing, and transport-related functionality |
| pitchfinder | ^2.3.4 | Pitch detection support in the audio services layer |
| @moonwave99/fretboard.js | ^0.2.13 | Guitar fretboard test/demo rendering |
| @monaco-editor/react | ^4.7.0 | Embedded editor for the ABC editor page |

## UI and animation

| Package | Version | Why it is here |
| --- | --- | --- |
| framer-motion | ^12.25.0 | Motion and animated transitions |
| lucide-react | ^0.562.0 | Icon library |
| react-confetti | ^6.4.0 | Celebration effects |
| react-split | ^2.0.14 | Split-pane editor layout |
| @base-ui/react | ^1.0.0 | Headless UI primitives |

## Styling and PWA/build extras

| Package | Version | Why it is here |
| --- | --- | --- |
| tailwindcss | ^4.1.18 | Utility-first styling |
| @tailwindcss/vite | ^4.1.18 | Tailwind Vite integration |
| postcss | ^8.5.6 | CSS transform pipeline |
| autoprefixer | ^10.4.23 | Vendor prefixing |
| vite-plugin-pwa | ^1.2.0 | Progressive web app support in the build toolchain |
| rollup-plugin-visualizer | ^6.0.5 | Bundle inspection |

## Backend / persistence integration

| Package | Version | Why it is here |
| --- | --- | --- |
| @supabase/supabase-js | ^2.93.3 | Optional cloud sync for learner progress |

## Testing and quality

| Package | Version | Why it is here |
| --- | --- | --- |
| vitest | ^4.0.16 | Unit and component testing |
| @vitest/coverage-v8 | ^4.0.18 | Coverage reporting |
| @testing-library/react | ^16.3.1 | React component testing |
| @testing-library/dom | ^10.4.1 | DOM test helpers |
| @testing-library/jest-dom | ^6.9.1 | Rich DOM assertions |
| jsdom | ^27.4.0 | Browser-like environment for tests |
| playwright | ^1.58.0 | End-to-end browser automation |
| @playwright/test | ^1.58.0 | Playwright test runner |
| eslint | ^9.39.1 | Linting |
| @eslint/js | ^9.39.1 | Base ESLint config pieces |
| typescript-eslint | ^8.46.4 | ESLint support for TypeScript |
| eslint-config-prettier | ^10.1.8 | Disables formatting-conflicting ESLint rules |
| eslint-plugin-prettier | ^5.5.5 | Runs Prettier through ESLint |
| eslint-plugin-react-hooks | ^7.0.1 | React hooks lint rules |
| eslint-plugin-react-refresh | ^0.4.24 | React Refresh-related lint support |
| prettier | ^3.8.0 | Code formatting |

## Project scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `dev` | `vite` | Local development server |
| `build` | `tsc -b && vite build` | Type-check and production build |
| `lint` | `eslint .` | Linting |
| `test` | `vitest` | Unit/component tests |
| `test:ui` | `vitest --ui` | Vitest UI mode |
| `test:coverage` | `vitest --coverage` | Coverage run |
| `test:e2e` | `playwright test` | E2E suite |
| `test:e2e:ui` | `playwright test --ui` | Playwright UI mode |
| `test:e2e:headed` | `playwright test --headed` | Headed E2E run |
| `preview` | `vite preview` | Preview built bundle |

## Notes

- The current code uses React 19 and React Router 7, so older docs referencing React 18 or Router v6 are stale.
- Both `abcjs` and `vexflow` are active dependencies and should be documented together.
- `claude-flow` remains in `package.json` but is not part of the required docs workflow and should not be treated as the primary architecture driver without code verification.
- Testing guidance is split by purpose across `docs/`: use this file for the authoritative toolchain and script list, `docs/records/dev-guide.md` for local workflow guidance, `docs/specs/test-plan.md` for required execution order and commands, and `docs/reviews/qa-report.md` for the latest recorded QA outcomes.
