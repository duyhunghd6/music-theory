---
description: Mobile floating instrument testing workflow for bottom-fixed UX
---

# Mobile Floating Instrument Testing Workflow

This workflow provides step-by-step testing procedures for the mobile-first bottom-fixed floating instrument feature.

## Prerequisites

1. Dev server running: `npm run dev`
2. Browser open at `http://localhost:5504` (configured in vite.config.ts)
3. Chrome DevTools or physical device ready

---

## Phase 1: Automated E2E Testing

### Step 1: Run Full Test Suite

```bash
npm run test:e2e -- e2e/mobile-floating-instruments.spec.ts --project="Mobile Chrome - iPhone SE"
```

**Expected**: All tests pass ✅

### Step 2: Run on Multiple Viewports

```bash
# iPhone 12 Pro
npm run test:e2e -- e2e/mobile-floating-instruments.spec.ts --project="Mobile Chrome - iPhone 12"

# Large mobile
npm run test:e2e -- e2e/mobile-floating-instruments.spec.ts --headed --project="Mobile Chrome"
```

**Expected**: Consistent behavior across all mobile sizes ✅

### Step 3: Verify Desktop Regression

```bash
npm run test:e2e -- e2e/floating-instruments-desktop.spec.ts --project="Desktop Chrome"
```

**Expected**: Desktop drag/resize behavior unchanged ✅

---

## Phase 2: Manual Mobile Testing

### 🔧 Setup Chrome DevTools

1. Open Chrome DevTools (F12)
2. Click "Toggle Device Toolbar" (Cmd+Shift+M on Mac)
3. Select "iPhone SE" (375x667)
4. Navigate to `/module/1/1.1`

---

### Test Case 1: Basic Toggle (Piano)

**Steps:**

1. Scroll to middle of lesson content
2. Click floating menu icon (bottom-right, cyan circle with "apps" icon)
3. Menu expands showing all icons ✅
4. Click Piano icon (keyboard icon)
5. **Verify:**
   - Piano slides up from bottom (smooth animation) ✅
   - Piano positioned at very bottom of screen ✅
   - Piano full width (edge-to-edge) ✅
   - NO header visible (no close/minimize buttons) ✅
   - Piano height approx 180px ✅
   - Piano icon in menu shows emerald dot indicator ✅
6. Click Piano icon again
7. **Verify:**
   - Piano slides down and disappears ✅
   - Emerald indicator removed ✅

---

### Test Case 2: Multi-Instrument Switching

**Steps:**

1. Open Piano (as above)
2. Click Guitar icon in menu
3. **Verify:**
   - Piano disappears instantly ✅
   - Guitar slides up from bottom ✅
   - Guitar height approx 160px ✅
   - Only Guitar visible (no multiple instruments) ✅
4. Click Flute icon
5. **Verify:**
   - Guitar disappears ✅
   - Flute appears, height approx 120px ✅

---

### Test Case 3: Toolbar Position Adjustment

**Steps:**

1. Note initial toolbar position (should be ~80px from bottom)
2. Open Piano
3. **Verify:**
   - Toolbar smoothly moves UP ✅
   - New position = 241px from bottom (45 + 180 + 16) ✅
   - Toolbar sits ABOVE Piano, không che nhạc cụ ✅
   - Transition smooth (no jump) ✅
4. Switch to Guitar
5. **Verify:**
   - Toolbar adjusts to 221px from bottom (45 + 160 + 16) ✅
   - Sits above Guitar properly ✅
6. Switch to Flute
7. **Verify:**
   - Toolbar adjusts to 181px from bottom (45 + 120 + 16) ✅
8. Close instrument
9. **Verify:**
   - Toolbar smoothly returns to 80px (original position) ✅

---

### Test Case 4: Content Accessibility

**Steps:**

1. Scroll to bottom of lesson
2. Read last paragraph (should be fully visible)
3. Open Piano
4. **Verify:**
   - Bottom padding increases automatically ✅
   - Last paragraph still fully scrollable above Piano ✅
   - No content permanently hidden ✅
5. Scroll to very bottom
6. **Verify:**
   - Can see last word of lesson content ✅
   - Content not clipped by instrument ✅

---

### Test Case 5: Piano Touch Interaction

**Setup:** Enable touch simulation in DevTools

**Steps:**

1. Open Piano
2. Tap each white key from C to C (one octave)
3. **Verify:**
   - Each key plays correct note ✅
   - Key width ≥ 32px (measure in DevTools) ✅
   - No accidental adjacent key presses ✅
   - Visual feedback (key press animation) ✅
4. Tap black keys (C#, D#, F#, G#, A#)
5. **Verify:**
   - Black keys responsive ✅
   - Touch target adequate ✅

---

### Test Case 6: Guitar Touch Interaction

**Steps:**

1. Open Guitar
2. Tap various fret positions
3. **Verify:**
   - Each fret position responsive ✅
   - Touch zone ≥ 44x44px ✅
   - Correct note plays ✅
4. Verify only 4 strings visible (compact view) ✅

---

### Test Case 7: Flute Touch Interaction

**Steps:**

1. Open Flute
2. Tap fingering holes
3. **Verify:**
   - Each hole responsive ✅
   - Touch target ≥ 44px ✅
   - Visual feedback clear ✅

---

### Test Case 8: Menu Behavior After Toggle

**Steps:**

1. Open menu
2. Click Piano icon (Piano appears)
3. **Verify:**
   - Menu stays OPEN ✅
   - Can immediately click Piano again to close ✅
4. Click Piano icon second time
5. **Verify:**
   - Piano closes ✅
   - Menu still open ✅
6. Click menu main button (apps icon)
7. **Verify:**
   - Menu closes ✅

---

### Test Case 9: Z-Index Layering

**Steps:**

1. Open Piano
2. Use DevTools Inspector to check z-index values
3. **Verify:**
   - Piano: z-index = 1050 ✅
   - Bottom Navigation: z-index = 1200 ✅
   - Floating Toolbar: z-index = 1100 ✅
   - Piano does NOT overlap bottom navigation ✅

---

## Phase 3: Device-Specific Testing

### 📱 iPhone SE (375x667) - Smallest Size

**Focus:** Cramped space, minimum width

- Piano keys not too narrow
- Guitar frets still tappable
- Text in instruments readable

### 📱 iPhone 12 Pro (390x844) - Standard Size

**Focus:** Notch handling

- Piano not clipped by notch
- Safe area padding applied
- Content readable in landscape

### 📱 iPhone 14 Pro Max (430x932) - Large Size

**Focus:** Dynamic Island

- Instrument not affected by dynamic island
- Large screen provides ample space

### 📱 Android Pixel 5 (393x851)

**Focus:** Android-specific behavior

- Safe area insets work on Android
- Touch targets accurate

### 📱 iPad Mini (768x1024) - Tablet

**Expected:** Should use DESKTOP behavior

- Instruments draggable ✅
- Instruments resizable ✅
- Header with close/minimize buttons ✅

---

## Phase 4: Visual Regression

### Screenshot Comparison

**Generate baseline screenshots:**

```bash
npm run test:e2e -- e2e/mobile-floating-instruments.spec.ts --update-snapshots
```

**Compare against baseline:**

```bash
npm run test:e2e -- e2e/mobile-floating-instruments.spec.ts
```

**Expected:** Zero pixel differences ✅

---

## Phase 5: Performance Testing

### Animation Performance

**Steps:**

1. Open DevTools Performance tab
2. Start recording
3. Toggle Piano on/off 5 times rapidly
4. Stop recording
5. **Verify:**
   - Maintain 60fps during animation ✅
   - No layout thrashing ✅
   - No forced reflows ✅

### Memory Leaks

**Steps:**

1. Open DevTools Memory tab
2. Take heap snapshot
3. Toggle all instruments 20 times
4. Take another heap snapshot
5. **Verify:**
   - Heap size does not grow indefinitely ✅
   - Event listeners cleaned up ✅

---

## Phase 6: Accessibility Audit

### Touch Target Audit

**Tools:** Chrome DevTools Accessibility tab

**Steps:**

1. Open Piano
2. Run accessibility audit
3. **Verify:**
   - All keys meet 44x44px minimum (or 32px for piano keys with justification) ✅
   - Sufficient spacing between targets ✅

### Screen Reader Testing (iOS)

**Steps (on physical iPhone):**

1. Enable VoiceOver
2. Open menu
3. Navigate to Piano icon
4. **Verify:**
   - Icon has descriptive label ✅
   - Active state announced ✅
5. Open Piano
6. Navigate through keys
7. **Verify:**
   - Each key has label (e.g., "C4", "D4") ✅

---

## Success Checklist

- ✅ All automated E2E tests pass
- ✅ Manual tests pass on 5+ devices/viewports
- ✅ No regression on desktop
- ✅ 60fps animations
- ✅ Zero layout shift
- ✅ Touch targets meet WCAG AA
- ✅ Safe area handled on notch devices
- ✅ Content always accessible
- ✅ Visual regression tests pass
- ✅ No memory leaks

---

## Troubleshooting

### Issue: Piano keys too narrow on iPhone SE

**Solution:** Reduce octave range from 1.5 to 1.0 octave on very small screens (<380px)

### Issue: Instrument overlaps bottom navigation

**Solution:** Verify z-index values. Instrument should be z-1050, bottom-nav z-1200

### Issue: Content hidden behind instrument

**Solution:** Check AppLayout bottom padding logic. Should increase to ~240px when instrument visible

### Issue: Laggy animation

**Solution:** Ensure using `transform: translateY()` not `bottom` property. Enable GPU acceleration with `will-change: transform`

### Issue: Safe area not applied

**Solution:** Check for `env(safe-area-inset-bottom)` in instrument panel styles. Add ViewportMeta tag with viewport-fit=cover

---

## Reporting Issues

If tests fail, capture:

1. Screenshot of issue
2. Console errors
3. Device/viewport size
4. Steps to reproduce
5. Expected vs actual behavior

Report using Bug Report button (floating toolbar) or create GitHub issue.
