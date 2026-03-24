---
description: Comprehensive mobile UX testing workflow
---

# Mobile Testing Workflow

This workflow guides you through testing the mobile-friendliness of the music theory application.

## Prerequisites

- Dev server running: `npm run dev`
- Playwright installed and configured
- Browser with DevTools (Chrome/Edge recommended)

---

## Step 1: Manual Device Testing (Browser DevTools)

### A. Open Mobile Device Emulation

```bash
# Ensure dev server is running
npm run dev
```

1. Open `http://localhost:5173` in Chrome/Edge
2. Press `Cmd+Opt+I` (Mac) or `F12` (Windows/Linux) to open DevTools
3. Press `Cmd+Shift+M` (Mac) or `Ctrl+Shift+M` (Windows/Linux) to toggle device toolbar

### B. Test Key Viewports

Test on these viewports in order:

**iPhone SE (375x667)** - Smallest modern phone

- [ ] Hamburger menu button is visible
- [ ] Desktop sidebar is hidden
- [ ] Header height is 56px (condensed from 72px)
- [ ] No horizontal scrollbars
- [ ] All buttons/links are tappable (≥44px)

**iPhone 12 (390x844)** - Standard phone

- [ ] Same checks as iPhone SE
- [ ] Virtual instruments fit well
- [ ] Drawer animation is smooth

**iPad (768x1024)** - Tablet breakpoint

- [ ] Check if sidebar transitions at 768px
- [ ] Layout is optimized for tablet use

**Desktop (1024x768+)** - Full layout

- [ ] Persistent sidebar is visible
- [ ] No hamburger menu
- [ ] Full UI controls visible

### C. Test Interactive Elements

1. **Drawer Navigation**
   - [ ] Click hamburger → drawer opens with slide animation
   - [ ] Click backdrop → drawer closes
   - [ ] Navigate to module → drawer auto-closes
   - [ ] ESC key closes drawer

2. **Virtual Instruments**
   - [ ] Piano keys are tappable (not too small)
   - [ ] Guitar frets/strings have adequate touch zones
   - [ ] Floating panels become bottom sheets

3. **ABC Notation**
   - [ ] Musical notation is readable
   - [ ] No layout breaking on long phrases
   - [ ] Horizontal scroll works if needed

4. **Touch Targets**
   - [ ] All buttons ≥ 44x44px
   - [ ] No accidental double-tap zoom
   - [ ] Spacing between tappable elements

---

## Step 2: Automated Playwright Tests

// turbo

### Run Mobile Test Suite

```bash
# Run all mobile tests
npm run test:e2e -- mobile-responsive.spec.ts
```

// turbo

### Run on Specific Mobile Device

```bash
# iPhone SE only
npm run test:e2e -- mobile-responsive.spec.ts --project="Mobile Chrome - iPhone SE"

# iPhone 12 only
npm run test:e2e -- mobile-responsive.spec.ts --project="Mobile Safari - iPhone 12"

# iPad only
npm run test:e2e -- mobile-responsive.spec.ts --project="Mobile Safari - iPad"
```

// turbo

### Run with UI Mode (Interactive)

```bash
npm run test:e2e:ui -- mobile-responsive.spec.ts
```

### Expected Test Results

- ✅ Hamburger menu visible on mobile
- ✅ Drawer opens/closes correctly
- ✅ Auto-close on navigation
- ✅ No horizontal overflow
- ✅ Header height condensed
- ✅ Touch targets adequate
- ✅ Responsive breakpoints work

---

## Step 3: Lighthouse Audit

### Option A: Chrome DevTools (Recommended)

1. Open DevTools (`F12` or `Cmd+Opt+I`)
2. Click "Lighthouse" tab
3. Select:
   - Device: **Mobile**
   - Categories: All
4. Click "Analyze page load"
5. Wait 30-60 seconds
6. Review scores:
   - **Performance**: ≥ 90
   - **Accessibility**: ≥ 90
   - **Best Practices**: ≥ 90
   - **SEO**: ≥ 90

### Option B: CLI (If Available)

```bash
# Mobile audit
lighthouse http://localhost:5173 \
  --screenEmulation.mobile=true \
  --screenEmulation.width=375 \
  --screenEmulation.height=667 \
  --output=html \
  --view

# Desktop audit
lighthouse http://localhost:5173 \
  --preset=desktop \
  --output=html \
  --view
```

### Review Audit Results

**Performance Metrics:**

- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Total Blocking Time (TBT): < 200ms
- Cumulative Layout Shift (CLS): < 0.1

**Common Issues:**

- Touch targets too small
- Color contrast insufficient
- Missing alt text
- Render-blocking resources

See `lighthouse-audit-guide.md` for detailed troubleshooting.

---

## Step 4: Real Device Testing (Optional)

### A. Test on Physical Devices

1. Get your local IP address:

   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. On your mobile device (connected to same WiFi):
   - Open browser
   - Navigate to `http://<your-ip>:5173`
   - Example: `http://192.168.1.100:5173`

3. Test touch interactions:
   - [ ] Drawer swipe gestures
   - [ ] Piano/guitar tapping
   - [ ] Quiz interactions
   - [ ] Scroll behavior

### B. BrowserStack/LambdaTest (For Extensive Coverage)

- Sign up for free tier
- Test on real iOS/Android devices
- Multiple browsers (Safari, Chrome Mobile, Samsung Internet)

---

## Step 5: UI Compliance Review

### Mobile-Friendly Checklist

Based on `/knowledge/music_theory_app_architecture/ui_ux/mobile_adaptation_plan.md`:

**Layout & Navigation:**

- [ ] Drawer pattern implemented (< 768px)
- [ ] Header condensed to 56px on mobile
- [ ] Responsive breakpoints: < 640px, 768px, 1024px
- [ ] No horizontal scrollbars on content

**Touch Targets:**

- [ ] All interactive elements ≥ 44px
- [ ] `.touch-target` class applied where needed
- [ ] Adequate spacing between tappable elements

**Typography & Spacing:**

- [ ] Base font scaled to 0.875rem on mobile
- [ ] Root padding reduced to 1rem
- [ ] Readable text without zoom

**Virtual Instruments:**

- [ ] Piano: Reduced range (1-2 octaves) on mobile
- [ ] Guitar: Enlarged touch zones
- [ ] Floating controls → bottom sheets

**Content:**

- [ ] ABC notation responsive rendering
- [ ] Tables have horizontal scroll with indicators
- [ ] Quiz options are full-width and tappable

---

## Step 6: Performance Testing

### A. Check Bundle Size

```bash
npm run build
```

Review output for bundle sizes. Look for:

- Main bundle: < 300KB (gzipped)
- Vendor chunks: Properly split
- Dynamic imports for routes

### B. Monitor Runtime Performance

1. Open DevTools Performance tab
2. Start recording
3. Navigate through app
4. Stop recording
5. Check:
   - Frame rate: 60fps
   - Long tasks: < 50ms
   - Memory usage: Stable (no leaks)

---

## Common Issues & Fixes

### Issue: Drawer doesn't open

**Debug:**

- Check `data-testid="mobile-menu-button"` exists
- Verify `useIsMobile()` hook returns true
- Check z-index on drawer overlay

### Issue: Touch targets too small

**Fix:**

```css
/* Apply touch-target class */
.my-button {
  min-width: var(--touch-target-min);
  min-height: var(--touch-target-min);
}
```

### Issue: Horizontal overflow

**Debug:**

```javascript
// Run in console to find culprit
document.querySelectorAll('*').forEach((el) => {
  if (el.scrollWidth > el.clientWidth) {
    console.log(el, el.scrollWidth, el.clientWidth)
  }
})
```

### Issue: Piano keys not tappable

**Fix:**

- Increase key width on mobile
- Add horizontal scroll container
- Reduce visible octave range

---

## Documentation

- **Lighthouse Guide**: See `lighthouse-audit-guide.md` in artifacts
- **Mobile Adaptation Plan**: `/knowledge/music_theory_app_architecture/ui_ux/mobile_adaptation_plan.md`
- **Mobile UI Foundation**: `/knowledge/music_theory_app_architecture/implementation/mobile_ui_foundation.md`

---

## Quick Commands Reference

```bash
# Run dev server
npm run dev

# Run all E2E tests
npm run test:e2e

# Run mobile tests only
npm run test:e2e -- mobile-responsive.spec.ts

# Run with UI (interactive)
npm run test:e2e:ui

# Run specific device
npm run test:e2e -- --project="Mobile Chrome - iPhone SE"

# Build for production
npm run build
```

---

## Success Criteria

✅ All mobile viewport tests pass  
✅ Lighthouse mobile score ≥ 90  
✅ No horizontal scrollbars  
✅ Touch targets ≥ 44px  
✅ Drawer navigation smooth  
✅ Virtual instruments usable on mobile  
✅ Performance: 60fps, no janks

🎉 **Mobile UX testing complete!**
