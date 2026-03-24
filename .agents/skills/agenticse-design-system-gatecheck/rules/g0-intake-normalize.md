# Step 0 — PRD Intake & Normalization

<!-- beads-id: br-gatecheck-g0 -->

> **Pipeline position:** Step 0 of 12 • No prerequisites • Leads to → Step 1 (Contract Generation)

## Input

- PRD from Product Owner (markdown/doc)
- UX goals, personas, primary flows, acceptance criteria

## Processing

### 0.1 Parse PRD Sections

Extract structured data from the PRD into these categories:

1. **Universal ID** — the explicit `beads-id` from HTML comments (e.g., `<!-- beads-id: br-prd04-s2 -->`)
2. **Screens** — all routes/screens mentioned
3. **User Journeys** — step-by-step flows linked to screens
4. **State Matrix** — loading / empty / error / success / offline states per screen
5. **Breakpoints** — responsive viewport definitions (mobile, tablet, desktop)
6. **Accessibility Requirements** — WCAG level, focus order, contrast targets

### 0.2 Validate Completeness (Schema Check)

Run a checklist validation against the PRD:

| Field               | Required?   | Check                                     |
| ------------------- | ----------- | ----------------------------------------- |
| Routes/screens      | ✅          | At least 1 defined route                  |
| State matrix        | ✅          | All screens have ≥ default + error states |
| Acceptance criteria | ✅          | Measurable (not vague "should look good") |
| Personas            | ⚠️ Optional | Helpful for a11y prioritization           |
| Breakpoints         | ✅          | At least mobile + desktop                 |

### 0.3 Gap Detection & Stage 1: The PRD / Low-Fi Ralph Loop

If any **required** field is missing, generate a `PRD_GAP_LIST`:

```markdown
## PRD Gap List — feature-x

- [ ] Missing state matrix for `/settings` screen
- [ ] No acceptance criteria for error states
- [ ] Breakpoints not defined (defaulting to standard 3-viewport set)
```

**Stage 1: The PRD / Low-Fi Ralph Loop**
If `PRD_GAP_LIST` is generated, before proceeding to Step 1, the agent **MUST** independently resolve the gaps. 
- You act as the **PRD Writer Agent**.
- Draft reasonable, logical defaults for the missing information (e.g., standard state matrices, explicit WCAG AA targets, responsive breakpoints, testable acceptance criteria).
- Synthesize these additions directly into the original PRD markdown file (`docs/PRDs/...`).
- Add the `<!-- beads-id: br-... -->` tags for the new sections if required (see `.agents/workflows/arch-review-docs-add-beads.md`).
- Run this Evaluator → Writer loop until the `PRD_GAP_LIST` is completely empty.

> ⚠️ **AGENT DIRECTIVE:** Do NOT halt and ask the human to manually type out state matrices or standard acceptance criteria. You are an Agentic SE system; you propose the structure, the human approves the contract at Gate A.

## Output

| Artifact          | Path                                  |
| ----------------- | ------------------------------------- |
| Normalized PRD    | `docs/PRDs/feature-x.normalized.json` |
| Gap list (if any) | `docs/PRDs/feature-x.gap-list.md`     |

## Switching Rules

- **If PRD has gaps** → Trigger **Stage 1: The PRD / Low-Fi Ralph Loop** internally. You must auto-amend the PRD with generated content (states, criteria, breakpoints) and re-evaluate Step 0 until the gap list is empty. Do NOT proceed to Step 1.
- **If PRD is irresolute on core business logic** (e.g., missing API endpoints, missing pricing tiers) → Only then halt pipeline at `NEEDS_PRD_CLARIFICATION`. Do not halt for UI/UX structural omissions.
- **If PRD is structurally complete** → Proceed to Step 1: Contract Generation.

## Next Step

→ [g1-contract-generation.md](./g1-contract-generation.md)
