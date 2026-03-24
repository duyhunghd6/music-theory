---
description: UI/UX testing workflow using dedicated test page at /test-ui
---

# UI/UX Testing Workflow

Use this workflow to test UI/UX components in isolation before applying changes to production submodules.

## Prerequisites

// turbo

1. Dev server running at http://localhost:5504

## Test Page Access

// turbo

1. Navigate to http://localhost:5504/test-ui

## Test Sections

The test page includes the following sections:

### 1. Grand Staff View

- Test dark mode contrast for clefs (𝄞 𝄢), staff lines, and bar lines
- Verify note rendering and positioning
- Check ledger line visibility

### 2. Inline ABC Notation

- Simple melody (C major scale)
- Chord examples (C, F, G, C)
- Complex jig example with key signature and tempo
- Test playback and dark mode colors

### 3. Virtual Piano

- Verify equal key widths (fixed 14.2857% per white key)
- Check black key height (80px, reduced by 40%)
- Test touch targets on mobile

### 4. Virtual Guitar

- Check fretboard display scale
- Verify reduced padding (15/8px SVG, p-1 wrapper)
- Test touch zones

### 5. Color Contrast Test Grid

- Verify text/background contrast in light/dark modes
- Check primary, success, and slate color variants

## Dark Mode Testing

// turbo

1. Toggle dark mode using the floating menu theme button
2. Verify all elements are visible with sufficient contrast
3. Grand Staff elements should be pure white in dark mode

## Mobile Testing

// turbo

1. Open browser DevTools (F12 or Cmd+Option+I)
2. Toggle device toolbar (Cmd+Shift+M)
3. Select iPhone SE or similar viewport
4. Test all instrument interactions

## Recording Issues

If issues are found:

1. Use the Bug Report button in floating menu
2. Include screenshot with the report
3. Note the specific component and dark/light mode state

## Related Files

- `/src/pages/TestUIPage.tsx` - Test page component
- `/src/components/MusicStaff/GrandStaffView.tsx` - Grand Staff implementation
- `/src/components/modules/InlineAbcNotation.tsx` - ABC notation renderer
- `/src/components/VirtualPiano/VirtualPiano.tsx` - Piano component
- `/src/components/VirtualGuitar/VirtualGuitar.tsx` - Guitar component
