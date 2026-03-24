# Product Roadmap

Last updated: 2026-03-24
Status: synced to current implementation

## Current focus

The curriculum data for Modules 1-5 is implemented in `src/data/course-data/`, but lesson-level interactivity is not evenly wired across the course. The immediate focus is closing the gap between the strongest interactive path in Module 1 and the more theory/demo-heavy implementation in Modules 2-5.

## Current implementation snapshot

### Completed foundation

- [x] Data-driven curriculum for 5 modules and 30 submodules
- [x] Shared lesson model via `src/data/course-data/types.ts`
- [x] Progressive theory reveal with persisted section progress
- [x] Local-first learner progress with optional Supabase sync
- [x] Mixed notation stack using both `abcjs` and `vexflow`
- [x] Shared game router and central game registry

### Verified current product state

- [x] Module 1 has the strongest lesson-game integration through `games` arrays in course data.
- [x] Modules 2-5 have implemented lesson data and theory content.
- [x] Modules 2-5 include ABC demo and notation-oriented content.
- [x] A dedicated rhythm test surface exists at `/test-games-m2`.
- [x] Multiple test/debug routes are still present in the application router.

### Incomplete or uneven areas

- [ ] Module 2 lesson data is not yet wired with lesson-level `games` arrays.
- [ ] Modules 3-5 are not yet wired with lesson-level `games` arrays.
- [ ] Interactive completion is not yet at parity across all modules.
- [ ] Older roadmap and architecture docs still overstate how complete non-Module-1 gameplay is.

## Active workstreams

### 1. Lesson-game parity

Goal: move more lessons onto the same registry-driven path already used by Module 1.

- [ ] Decide which Module 2 rhythm mechanics should become canonical lesson `games` configs.
- [ ] Convert verified rhythm mechanics from test-only surfaces into lesson data where appropriate.
- [ ] Define the minimum interactive target for Modules 3-5 so docs and implementation describe the same scope.

### 2. Documentation accuracy

Goal: keep `docs/` aligned with current code rather than historical plans.

- [x] Sync architecture, tech stack, module overview, and decisions docs to the current app.
- [ ] Continue pruning or updating older docs that still describe outdated architecture, counts, or routing assumptions.
- [ ] Treat `src/data/course-data/` as the source of truth for module counts, ordering, and lesson capabilities.

### 3. Product hardening

Goal: reduce ambiguity in currently shipped behavior.

- [ ] Review production exposure of debug/test routes.
- [ ] Resolve implementation inconsistencies such as `saoTruc` vs `flute` section naming.
- [ ] Expand automated coverage around active lesson and game-routing flows.

## Near-term priorities

1. Document Module 1 as the current reference implementation for lesson interactivity.
2. Decide whether Module 2 rhythm work remains test-page-only or becomes course-data-driven lesson gameplay.
3. Avoid claiming full interactive parity across Modules 1-5 until lesson data actually reflects it.

## Notes

- Current docs should describe the app as React 19 + React Router 7 + Vite 7.
- Current docs should describe both `abcjs` and `vexflow` as active notation dependencies.
- Current docs should describe Supabase sync as optional, not required infrastructure.
