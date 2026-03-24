# Decisions

Last updated: 2026-03-24
Status: inferred from current implementation

## 2026-03-24 — Use a data-driven curriculum under `src/data/course-data/`
The course is defined as TypeScript module/submodule data rather than a CMS or remote API.

**Why:** `COURSE_MODULES` in `/Users/steve/duyhunghd6/music-theory/src/data/course-data/index.ts` is the canonical lesson source and is consumed directly by lesson pages.

**How to apply:** Treat course-data files as the source of truth for module scope, submodule counts, lesson ordering, and lesson feature availability.

---

## 2026-03-24 — Reveal lesson theory progressively before opening demos/games
Lesson content is intentionally gated section by section and only exposes interactive content after completion or explicit bypass.

**Why:** `/Users/steve/duyhunghd6/music-theory/src/components/modules/ProgressiveTheoryContent.tsx` persists section progress and `/Users/steve/duyhunghd6/music-theory/src/pages/SubmodulePage.tsx` uses that state to unlock demos and games.

**How to apply:** Documentation and future implementation work should describe the lesson flow as progressive reveal first, interactivity second.

---

## 2026-03-24 — Standardize games through a registry and universal router
The app centralizes reusable game definitions in a game registry and dispatches them through one router instead of bespoke per-module wrappers.

**Why:** `/Users/steve/duyhunghd6/music-theory/src/data/game-registry.ts` and `/Users/steve/duyhunghd6/music-theory/src/components/game-shell/UniversalGameRouter.tsx` encode this pattern directly.

**How to apply:** New lesson games should be registered centrally and referenced from submodule data; older docs that imply many separate game routers are stale.

---

## 2026-03-24 — Keep progress local-first with optional Supabase sync
Progress is persisted locally and only syncs to Supabase when the environment is configured.

**Why:** `/Users/steve/duyhunghd6/music-theory/src/stores/useProgressStore.ts` uses an IndexedDB-backed storage adapter, while `/Users/steve/duyhunghd6/music-theory/src/services/supabase-client.ts` disables cloud sync when env vars are missing.

**How to apply:** Do not document cloud sync as mandatory infrastructure; it is an optional enhancement on top of local persistence.

---

## 2026-03-24 — Maintain both abcjs and VexFlow in the notation stack
The current app uses two notation paths rather than a single rendering library.

**Why:** abcjs powers reusable renderers and lesson/game playback flows, while VexFlow remains in the music staff components.

**How to apply:** Architecture docs, specs, and refactor plans must account for both libraries and should not describe VexFlow as the sole notation engine.
