# Bug Fixing Guide

## Self-Improvement Checklist

Before fixing bugs in this codebase, review these lessons learned:

---

## Pre-Fix Verification

- [ ] Run `npm run build` to verify current state compiles
- [ ] Run the narrowest owned verification command first before broader reruns
- [ ] Check if the bug is reproducible in dev (`npm run dev`)
- [ ] Review related lint/TypeScript errors in IDE

---

## Common Pitfalls Encountered

### 1. TypeScript Type Imports

**Problem:** `'StateStorage' is not exported`
**Solution:** Use type-only import:

```typescript
import type { StateStorage } from 'zustand/middleware'
```

### 2. Unused Variables

**Problem:** `'index' is declared but its value is never read`
**Solution:** Remove from destructuring or use it:

```typescript
// Bad
items.map((item, index) => ...)
// Good (if index not needed)
items.map((item) => ...)
```

### 3. abcjs Callback Types

**Problem:** `Type '(ev: NoteTimingEvent | null) => void' is not assignable to type 'EventCallback'`
**Solution:** Return proper type from callback:

```typescript
eventCallback: (ev) => {
  if (!ev) {
    return 'continue' as const // Required return
  }
  // ...
  return undefined
}
```

### 4. Missing Props

**Problem:** `Property 'overrideAbc' does not exist on type 'AbcGrandStaffProps'`
**Solution:** Check interface definition matches usage:

```typescript
interface AbcGrandStaffProps {
  overrideAbc?: string // Add missing prop
}
```

### 5. useCallback Dependencies

**Problem:** `React Hook useCallback has a missing dependency`
**Solution:** Add missing deps to array:

```typescript
const fn = useCallback(() => {
  // uses newProp
}, [existingDeps, newProp]) // Add newProp
```

---

## Debug Workflow

1. **Read the error carefully** - TypeScript errors often suggest the fix
2. **Check the line number** - Go directly to the source
3. **View the interface/type** - Understand expected vs actual
4. **Make minimal changes** - Fix one thing at a time
5. **Verify with the narrowest owned command first** - use the smallest build/test command that proves the fix before broader reruns
6. **Record the latest verification accurately** - keep docs and handoff notes aligned to the most recent owned commands and their outcomes, whether they pass or fail

---

## Formatting vs Critical Errors

**Formatting (eslint/prettier):**

- Look like: `Insert '⏎', Delete '··'`
- Can be ignored if build passes
- Fix with: `npm run lint:fix` or format on save

**Critical (TypeScript):**

- Look like: `Property does not exist`, `Type is not assignable`
- **Must fix** - blocks compilation
- Usually require code changes

---

## Quick Commands

```bash
# Build check
npm run build

# Dev server
npm run dev

# Fix auto-fixable lint issues
npm run lint:fix

# Type check only
npx tsc --noEmit
```

---

## Files Most Likely to Have Issues

| File                  | Common Issues                       |
| --------------------- | ----------------------------------- |
| `AbcGrandStaff.tsx`   | abcjs types, callback signatures    |
| `useProgressStore.ts` | IndexedDB types, Zustand middleware |
| `SubmodulePage.tsx`   | Missing imports, prop mismatches    |
| `course-data.ts`      | Template literal formatting         |
