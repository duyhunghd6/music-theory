# Docs SSOT

<!-- beads-id: doc-readme -->

Last updated: 2026-04-14
Status: active

This `docs/` directory is the documentation source of truth for this repository.

Use it to understand current architecture, expected behavior, implementation rules, testing expectations, delivery state, and historical decisions before changing code or proposing plans.

## Read order for agents and contributors

<!-- beads-id: doc-readme-s1 -->

Read these in order when project context is needed:

1. [context/architecture.md](context/architecture.md) — current runtime architecture, source-tree map, integration points, and drift notes.
2. [context/tech-stack.md](context/tech-stack.md) — verified dependencies, scripts, tooling, and test stack.
3. [specs/module-overview.md](specs/module-overview.md) — verified module/submodule coverage and current interactivity status.
4. [context/domain-terms.md](context/domain-terms.md) — canonical domain vocabulary and feature terminology.
5. [context/initial-requirements.md](context/initial-requirements.md) — product framing, original goals, and requirement baseline.
6. [records/dev-guide.md](records/dev-guide.md) — implementation guidance and repo-specific workflow.
7. [records/decisions.md](records/decisions.md) — durable implementation decisions and working conventions.
8. [records/adrs.md](records/adrs.md) — architectural decision records for major choices.
9. [records/bug-fixing-guide.md](records/bug-fixing-guide.md) — debugging and bug-fix workflow guidance.
10. [specs/test-plan.md](specs/test-plan.md) — current testing expectations, execution order, and verification targets.
11. [reviews/qa-report.md](reviews/qa-report.md) — latest executed QA evidence and unresolved testing gaps.
12. [active/roadmap.md](active/roadmap.md) — current work-in-progress, priorities, and next-step planning.
13. [reviews/](reviews/) — review artifacts, QA notes, and audit/history relevant to current work.

If docs conflict, prefer the file explicitly marked synced or verified, then prefer the more recently updated file.

## Authority map

<!-- beads-id: doc-readme-s2 -->

Use each area for exactly one kind of truth.

### [context/](context/)

<!-- beads-id: doc-readme-s3 -->
Current system truth.

Source of truth for:
- runtime architecture
- source-tree map
- integration boundaries
- domain vocabulary
- verified toolchain and scripts

Not source of truth for:
- feature acceptance behavior
- current QA outcomes
- temporary plans

### [specs/](specs/)

<!-- beads-id: doc-readme-s4 -->
Expected product and feature behavior.

Source of truth for:
- module behavior and scope
- feature expectations
- test requirements and execution order
- acceptance-oriented behavior descriptions

Not source of truth for:
- architectural rationale
- temporary planning notes
- executed QA evidence

### [records/](records/)

<!-- beads-id: doc-readme-s5 -->
Durable engineering rationale and working rules.

Source of truth for:
- implementation guidance
- repo workflow conventions
- bug-fixing process
- durable technical decisions
- architectural rationale

Not source of truth for:
- live product status
- current QA pass/fail state
- temporary work tracking

### [active/](active/)

<!-- beads-id: doc-readme-s6 -->
Current planning and in-flight coordination.

Source of truth for:
- active roadmap
- current priorities
- short-lived initiative planning

Not source of truth for:
- final architecture truth
- lasting feature requirements
- final QA evidence

### [reviews/](reviews/)

<!-- beads-id: doc-readme-s7 -->
Validation evidence and review artifacts.

Source of truth for:
- QA results
- review notes
- audits
- sprint review evidence

Not source of truth for:
- expected behavior
- architecture ownership
- implementation conventions

### [archive/](archive/)

<!-- beads-id: doc-readme-s8 -->
Historical reference only.

Source of truth for:
- nothing active

Use only for:
- superseded docs
- obsolete snapshots
- historical reference material

## Folder contract

<!-- beads-id: doc-readme-s9 -->

- Keep one fact in one home.
- Put stable system truth in [context/](context/).
- Put expected behavior in [specs/](specs/).
- Put rationale and workflow rules in [records/](records/).
- Put only active planning in [active/](active/).
- Put only evidence in [reviews/](reviews/).
- Move obsolete material to [archive/](archive/) when it is no longer current.

Do not duplicate the same fact across multiple files unless one file is explicitly a summary that points back to the canonical source.

## How to update docs when code changes

<!-- beads-id: doc-readme-s10 -->

Update the owning doc whenever behavior or structure changes.

- Architecture or runtime flow changed → update [context/architecture.md](context/architecture.md)
- Dependencies, tooling, or scripts changed → update [context/tech-stack.md](context/tech-stack.md)
- Product behavior, lesson behavior, or module scope changed → update the relevant file in [specs/](specs/)
- A durable engineering or architecture decision was made → update [records/decisions.md](records/decisions.md) or [records/adrs.md](records/adrs.md)
- Debugging workflow changed → update [records/bug-fixing-guide.md](records/bug-fixing-guide.md)
- QA was executed and its result matters for current truth → update [reviews/qa-report.md](reviews/qa-report.md)
- Priorities or in-flight execution changed → update [active/roadmap.md](active/roadmap.md)

## Rules for agentic coding

<!-- beads-id: doc-readme-s11 -->

- Read docs before implementation when project context is needed.
- Do not create root-level documentation outside `docs/` unless explicitly requested.
- Do not treat archived files as current truth.
- Do not treat review artifacts as feature specs.
- Do not treat active plans as permanent architecture or accepted behavior.
- When summarizing the repo, distinguish clearly between:
  - what exists now
  - what should happen
  - why it was chosen
  - what has been verified

## Testing documentation contract

<!-- beads-id: doc-readme-s12 -->

Treat testing guidance as split by responsibility:

- [context/tech-stack.md](context/tech-stack.md) — authoritative test tools and scripts
- [records/dev-guide.md](records/dev-guide.md) — local testing workflow guidance
- [specs/test-plan.md](specs/test-plan.md) — required execution order and verification targets
- [reviews/qa-report.md](reviews/qa-report.md) — latest recorded QA outcomes

For agent-driven verification, prefer narrow-first testing before broader reruns unless the task explicitly requires wider coverage.

## Current repo-specific notes

<!-- beads-id: doc-readme-s13 -->

- The app currently uses React 19, React Router 7, TypeScript, Vite, Zustand, Tailwind CSS 4, `abcjs`, and `vexflow`.
- Current curriculum truth lives in `src/data/course-data/` and is summarized in [specs/module-overview.md](specs/module-overview.md).
- Current architecture truth must treat both `abcjs` and `vexflow` as active notation paths.
- Debug and test routes are development-only when gated by `import.meta.env.DEV`; docs must not describe them as shipped production surfaces.
- QA evidence should be kept separate from roadmap intent and separate from product specs.

## Suggested doc hygiene

<!-- beads-id: doc-readme-s14 -->

- Add `Last updated` and `Status` near the top of major docs.
- Prefer stable filenames for major docs so agents and contributors can rely on them.
- Archive stale snapshots rather than leaving conflicting active docs in place.
- If a file is only partially trustworthy, mark that clearly in the file instead of letting readers infer it.
