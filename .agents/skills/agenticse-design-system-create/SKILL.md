---
name: agenticse-design-system
description: Design System engineering utilizing HTML-as-Design-Tool workflow. Handles components, composite layouts, robust state matrix planning (Default/Empty/Error), and storyboard interactive demos across Web and 2D Mobile App platforms. Triggers on requests to build 2D UIs, Mobile Apps, fix A11y, resolve style drifts, or maintain the Design System Hub showcasing tokens and layouts.
license: Proprietary
metadata:
  author: agent
  version: "2.1.0"
---

# AgenticSE Design System Skill (V2.1 - Web & Mobile)
> **Architecture Layer:** LAYER 3 (The Details / Execution Rules)
> **Role:** The Implementor Agent
> **Reference:** `spike-design-system-ralph-loop-agent.md`

## Ecosystem Position (3-Layer Agent Comprehension Pyramid)

```text
┌───────────────────────────────────────────────────────────────────────┐
│        /\       LAYER 1: ROOT METHODOLOGY                       │
│       /  \      spike-design-system-ralph-loop-agent.md          │
│      /    \     "WHY & WHAT" — Theory, DoD, RFT, 3-Tier Eval    │
│     /──────\                                                     │
│    /        \   LAYER 2: ORCHESTRATION                           │
│   /Workflows \  Main: gsafe-uiux-ralph-loop-antigravity.md       │
│  /────────────\  Stage 2: gsafe-uiux-ralph-loop-stage2.md         │
│ / SKILLS      \  LAYER 3: EXECUTOR   ◄── YOU ARE HERE            │
│/ THIS FILE     \ agenticse-design-system/ (Implementor)          │
│────────────────\ design-system-gatecheck/ (Peer: Evaluator)     │
│                                                                   │
│  >> AGENT DIRECTIVE:                                              │
│  >> You are at LAYER 3. This skill tells you HOW to build UI.     │
│  >> Stage 2 workflow tells you WHEN this skill is triggered.       │
│  >> Do NOT read the spike unless modifying this skill's rules.    │
└───────────────────────────────────────────────────────────────────────┘
```

## Skill-Internal Comprehension Pyramid

To execute this skill efficiently and without hallucinating, read it top-down:

```text
====================================================================================================
                        SKILL 3-LAYER COMPREHENSION PYRAMID
====================================================================================================

               /\               [ LAYER 1: THE SKELETON (Identity & Purpose) ]
              /  \              Identity: Design System Implementor Agent.
             /    \             Purpose: Build Web/Mobile UIs explicitly matching 
            /      \                     Gatecheck ASCII contracts.
           /────────\           
          /          \          [ LAYER 2: THE BRANCHES (ASCII Map of Workflows) ]
         /            \         Function: Look at the map below to understand which rule/workflow
        /              \                  file applies to your current objective.
       /                \       
      /                  \      [ LAYER 3: THE DETAILS (Markdown Sub-Rules) ]
     /────────────────────\     Function: The actual `rules/*.md` files. ONLY read the specific
    /                      \              files listed in your selected Branch from Layer 2.
====================================================================================================

[ LAYER 2 ASCII MAP: SKILL PROTOCOLS & WORKFLOWS ]

IF TASK IS: Plan / Setup → [ Branch: W1 Discover & Plan ]
                           Reads: rules/w1-discover-plan.md, rules/enterprise-state-matrix.md
                           
IF TASK IS: Write HTML   → [ Branch: W2 Create & Build ]
                           Reads: rules/w2-create-build.md, rules/enterprise-components.md
                           
IF TASK IS: Fix QA Bug   → [ Branch: W3 Refine & Align ]
                           Reads: rules/w3-refine-align.md, rules/element-diff-protocol.md
                           
IF TASK IS: Ready Merge  → [ Branch: W4 Handoff ]
                           Reads: rules/w4-handoff-release.md
====================================================================================================
```

This skill enables you to architect, build, and maintain enterprise-grade Design Systems using the **HTML-as-Design-Tool** workflow for both **Web / Desktop** and **2D Mobile Applications** (iOS/Android paradigms). It guarantees coherence via rigorous Component tracking, Composite Layout standards, and exhaustive State Matrix coverage, governed by an Element-Level Versioning protocol.

**Agent Comprehension Directive:** You are operating at Layer 3 (The Details). You must navigate the Skill-Internal Pyramid's ASCII Map above to determine *which exact* `.md` rule file to read. Do not read all rules at once. You are strictly bound by the constraints established by the Evaluator Agent via Stage 2 workflow (Layer 2) and the contract artifacts from Stage 1 (e.g., ASCII wireframes, layout-rules.json, storyboards.json).

## When to Apply

Trigger this skill when the user asks to:

- Plan, structure, or implement new 2D Screens for Web or Mobile Apps.
- Define UI Components, Design Tokens, or Composite Layouts bridging Desktop and Mobile constraints.
- Address Accessibility (A11y) issues, Contrast ratios, Safe-Area violations, or 3D↔2D drift.
- Audit State Coverage (e.g., "Add loading schemas to dashboards").
- Display interactive user journeys (Storyboards).
- Provide visual "Before/After" review packages (Element Diffs) for human approval.
- Maintain the enterprise Design System Showcase Hub (`packages/design-system/showcase/index.html`).

## Rule Categories by Priority

| Priority | Category             | Impact   | Description                                                       |
| -------- | -------------------- | -------- | ----------------------------------------------------------------- |
| 1        | Protocols            | CRITICAL | Element Diffing, Design System Hub operations                     |
| 2        | Workflows            | HIGH     | Task pipelining (W1 to W4) across Web AND Mobile targets          |
| 3        | Enterprise Standards | MODERATE | Layouts, Mobile Patterns, Tokens, Components, States, Storyboards |

## Quick Reference

### 1. Protocols & Hub (CRITICAL)

- `element-diff-protocol` - The 7-step mandatory process to generate `before.html`, `after.html`, `diff.html` for **every single visual change**.
- `design-system-hub` - Guidelines for updating the 9 sections of `packages/design-system/showcase/index.html`.

### 2. Workflows (HIGH)

- `w1-discover-plan` - Requirements gathering, RFCs, and exhaustive Edge Case State Matrix planning outlining Web vs Mobile platform targets.
- `w2-create-build` - Hand-coding HTML/CSS prototypes using design-tokens. Baseline extraction (v000).
- `w3-refine-align` - Applying fixes (HTML, Token, A11y, Drift) using Element Diffs. Includes Auto-Polish Pipeline and Terminology Sync. Updating Hub.
- `w4-handoff-release` - Creating handoff packages, SemVer, and Dev Agent notification.

### 3. Enterprise Standards (MODERATE)

- `enterprise-mobile-patterns` - Mobile-specific guidelines (44px tap targets, Safe Areas, Swift/Kotlin mimicry in HTML).
- `enterprise-tokens` - Rules for spacing rhythm (base 4px), hierarchical shadows, colors, typography.
- `enterprise-components` - Requirements for 4-state components (Default/Hover/Active/Disabled), Drag Primitives, and Headless UI layer separation.
- `enterprise-layouts` - Constraints forcing UI designs to utilize one of 29 standardized layouts (21 Web, 5 Mobile, 3 iPad).
- `enterprise-state-matrix` - Requirement mapping Default, Loading, Empty, Error, Offline states before coding.
- `enterprise-storyboards` - Interaction demos (Talent Onboarding, Kanban Drag) within UI testing.

## How to Use

For deep implementation requirements, read the individual rule files:

```
rules/w1-discover-plan.md
rules/w2-create-build.md
rules/w3-refine-align.md
rules/w4-handoff-release.md
rules/element-diff-protocol.md
rules/design-system-hub.md
rules/enterprise-mobile-patterns.md
rules/enterprise-tokens.md
rules/enterprise-components.md
rules/enterprise-layouts.md
rules/enterprise-state-matrix.md
rules/enterprise-storyboards.md
```

## DS ID Convention

Every Design System element has a **unique, visible ID** displayed in the UI for quick debugging and cross-referencing by agents and humans.

### Format

```
ds:<type>:<name-NNN>
```

| Type     | Example                  | Applies to            |
| -------- | ------------------------ | --------------------- |
| `hub`    | `ds:hub:overview-001`    | Hub pages             |
| `screen` | `ds:screen:terminal-001` | Full-page screens     |
| `comp`   | `ds:comp:button-001`     | Reusable components   |
| `token`  | `ds:token:colors-001`    | Design tokens         |
| `layout` | `ds:layout:grid-001`     | Layout patterns       |
| `state`  | `ds:state:matrix-001`    | State matrix entries  |
| `flow`   | `ds:flow:explore-001`    | User flow definitions |

### Key Files

- **Registry:** `<frontend-src-dir>/data/ds-registry.ts` — Single source of truth
- **Badge:** `<frontend-src-dir>/components/DsIdBadge.tsx` — Click-to-copy UI badge
- **CSS:** `packages/design-system/components/ds-id-badge.css`

### Rules When Adding New Elements

1. Add entry to `DS_REGISTRY` array in `ds-registry.ts`
2. If screen, also add to `SCREEN_ID_MAP`
3. Use `<DsIdBadge id="ds:..." />` in component JSX next to headings
4. Increment NNN suffix for same type+name variants (e.g., `002`, `003`)

## Full Compiled Document

For the complete, holistic explanation across all Web and Mobile workflows, read: `AGENTS.md`
