# Product Roadmap

<!-- beads-id: pln-rdmap -->

Last updated: 2026-03-24
Status: synced to current implementation

## Current focus

<!-- beads-id: pln-rdmap-s1 -->

The curriculum data for Modules 1-5 is implemented in `src/data/course-data/`, but lesson-level interactivity is not evenly wired across the course. The immediate focus is closing the gap between the strongest interactive path in Module 1 and the more theory/demo-heavy implementation in Modules 2-5.

## Current implementation snapshot

<!-- beads-id: pln-rdmap-s2 -->

### Completed foundation

<!-- beads-id: pln-rdmap-s3 -->

- [x] Data-driven curriculum for 5 modules and 30 submodules
- [x] Shared lesson model via `src/data/course-data/types.ts`
- [x] Progressive theory reveal with persisted section progress
- [x] Local-first learner progress with optional Supabase sync
- [x] Mixed notation stack using both `abcjs` and `vexflow`
- [x] Shared game router and central game registry

### Verified current product state

<!-- beads-id: pln-rdmap-s4 -->

- [x] Module 1 has the strongest lesson-game integration through `games` arrays in course data.
- [x] Modules 2-5 have implemented lesson data and theory content.
- [x] Modules 2-5 include ABC demo and notation-oriented content.
- [x] A dedicated rhythm test surface exists at `/test-games-m2`, but it is mounted only in development builds.
- [x] Test/debug routes remain available for development, but shipped production builds gate them behind `import.meta.env.DEV`.

### Incomplete or uneven areas

<!-- beads-id: pln-rdmap-s5 -->

- [ ] Module 2 lesson data is not yet wired with lesson-level `games` arrays.
- [ ] Modules 3-5 are not yet wired with lesson-level `games` arrays.
- [ ] Interactive completion is not yet at parity across all modules.
- [ ] Older roadmap and architecture docs still overstate how complete non-Module-1 gameplay is.

## Active workstreams

<!-- beads-id: pln-rdmap-s6 -->

### 1. Lesson-game parity

<!-- beads-id: pln-rdmap-s7 -->

Goal: move more lessons onto the same registry-driven path already used by Module 1.

- [ ] Decide which Module 2 rhythm mechanics should become canonical lesson `games` configs.
- [ ] Convert verified rhythm mechanics from test-only surfaces into lesson data where appropriate.
- [ ] Define the minimum interactive target for Modules 3-5 so docs and implementation describe the same scope.

### 2. Documentation accuracy

<!-- beads-id: pln-rdmap-s8 -->

Goal: keep `docs/` aligned with current code and current QA evidence rather than historical plans.

- [x] Sync architecture, tech stack, module overview, and decisions docs to the current app.
- [ ] Continue pruning or updating older docs that still describe outdated architecture, counts, routing assumptions, or stale readiness claims.
- [ ] Treat `src/data/course-data/` as the source of truth for module counts, ordering, and lesson capabilities.

### 3. Product hardening

<!-- beads-id: pln-rdmap-s9 -->

Goal: reduce ambiguity in currently shipped behavior.

- [x] Review production exposure of debug/test routes; shipped builds now gate them behind `import.meta.env.DEV`.
- [x] Verify docs against the final canonical section naming used in code; `flute` is the current section key for the Vietnamese bamboo flute visualizer.
- [ ] Expand automated coverage around active lesson and game-routing flows.

## Near-term priorities

<!-- beads-id: pln-rdmap-s10 -->

1. Document Module 1 as the current reference implementation for lesson interactivity.
2. Decide whether Module 2 rhythm work remains test-page-only or becomes course-data-driven lesson gameplay.
3. Avoid claiming full interactive parity across Modules 1-5 until lesson data actually reflects it.
4. Keep handover docs pinned to the latest passing verification commands rather than older failing QA snapshots.
5. Preserve the exact handover validation commands/results that currently pass for Chromium and Mobile Chrome critical flows.

## Notes

<!-- beads-id: pln-rdmap-s11 -->

- Current docs should describe the app as React 19 + React Router 7 + Vite 7.
- Current docs should describe both `abcjs` and `vexflow` as active notation dependencies.
- Current docs should describe Supabase sync as optional, not required infrastructure.
