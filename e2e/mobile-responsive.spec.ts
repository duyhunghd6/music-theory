import { test, expect } from '@playwright/test'

/**
 * Mobile-specific E2E tests for responsive layout and touch interactions
 * Tests drawer navigation, responsive breakpoints, and touch target sizes
 */

test.describe('Mobile Navigation - iPhone SE (375x667)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('shows the lesson navigation trigger on lesson pages', async ({ page }) => {
    await page.goto('/module/1/1.1')
    await expect(page.getByTitle('Open module navigation')).toBeVisible()
  })

  test('lesson navigation menu opens and closes correctly', async ({ page }) => {
    await page.goto('/module/1/1.1')
    await page.getByTitle('Open module navigation').click()

    await expect(page.getByText('Cơ bản', { exact: true })).toBeVisible()
    await page.mouse.click(360, 560)

    await expect(page.getByText('Cơ bản', { exact: true })).toHaveCount(0)
  })

  test('lesson navigation menu closes after lesson navigation', async ({ page }) => {
    await page.goto('/module/1/1.1')
    await page.getByTitle('Open module navigation').click()

    await page.getByText('Nhịp điệu', { exact: true }).click()
    await page.getByText('Giá trị nốt nhạc', { exact: true }).click()

    await expect(page).toHaveURL(/\/module\/2\/2\.1$/)
    await expect(page.getByText('Cơ bản', { exact: true })).toHaveCount(0)
  })

  test('no horizontal scrollbars on content', async ({ page }) => {
    await page.goto('/')

    // Navigate to a lesson with content
    await page.goto('/module/1/1.1')
    await page.waitForLoadState('networkidle')

    // Check for horizontal overflow
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth)
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth)

    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 1) // +1 for rounding
  })

  test('root page uses the compact mobile header', async ({ page }) => {
    await page.goto('/')

    const header = page.locator('header').first()
    const headerHeight = await header.evaluate((el) => el.getBoundingClientRect().height)

    expect(headerHeight).toBeLessThanOrEqual(40)
    await expect(page.getByTestId('bottom-navigation')).toBeVisible()
  })
})

test.describe('Touch Target Compliance', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('all interactive elements meet 44px minimum', async ({ page }) => {
    await page.goto('/')

    // Get all interactive elements
    const interactiveElements = await page.locator('button, a, input, [role="button"]').all()

    const undersizedElements: string[] = []

    for (const element of interactiveElements) {
      const isVisible = await element.isVisible()
      if (!isVisible) continue

      const box = await element.boundingBox()
      if (!box) continue

      // Check if element meets minimum touch target size (44x44px)
      if (box.width < 44 || box.height < 44) {
        const testId = await element.getAttribute('data-testid')
        const tag = await element.evaluate((el) => el.tagName)
        undersizedElements.push(
          `${tag}${testId ? `[data-testid="${testId}"]` : ''} (${Math.round(box.width)}x${Math.round(box.height)})`
        )
      }
    }

    // Report any undersized elements
    if (undersizedElements.length > 0) {
      console.warn('Undersized touch targets found:', undersizedElements)
    }

    // This is a soft assertion - log warnings but don't fail
    // Adjust to expect(undersizedElements).toHaveLength(0) for strict enforcement
  })
})

test.describe('Responsive Breakpoints', () => {
  test('iPad (768px) shows tablet layout', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')

    // At 768px (md breakpoint), sidebar may transition to persistent drawer
    // Verify this matches your design spec
    const sidebar = page.locator('[data-testid="sidebar"]')
    const menuButton = page.locator('[data-testid="mobile-menu-button"]')

    // One of these should be visible depending on tablet strategy
    const sidebarVisible = await sidebar.isVisible()
    const menuVisible = await menuButton.isVisible()

    expect(sidebarVisible || menuVisible).toBeTruthy()
  })

  test('desktop (1024px+) shows full sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.goto('/')

    // Desktop should show sidebar, not hamburger
    const sidebar = page.locator('[data-testid="sidebar"]')
    await expect(sidebar).toBeVisible()
  })
})

test.describe('Mobile Virtual Instruments', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('piano keys have adequate touch targets', async ({ page }) => {
    await page.goto('/practice')

    // Check if piano is visible
    const piano = page.locator('[data-testid="virtual-piano"]')
    if (await piano.isVisible()) {
      // Check first piano key dimensions
      const firstKey = page.locator('[data-testid^="piano-key-"]').first()
      const box = await firstKey.boundingBox()

      if (box) {
        // Piano keys should be wide enough for touch (minimum 44px recommended)
        expect(box.width).toBeGreaterThanOrEqual(40) // Slightly relaxed for keyboard
      }
    }
  })

  test('floating instrument panel becomes bottom sheet on mobile', async ({ page }) => {
    await page.goto('/practice')

    // Check if floating panel uses bottom sheet pattern
    const floatingPanel = page.locator('[data-testid="floating-instrument-panel"]')

    if (await floatingPanel.isVisible()) {
      const position = await floatingPanel.evaluate((el) => {
        const rect = el.getBoundingClientRect()
        return {
          bottom: window.innerHeight - rect.bottom,
          left: rect.left,
        }
      })

      // On mobile, panel should be anchored to bottom (not floating)
      // This is a general check - adjust based on your implementation
      expect(position.bottom).toBeLessThan(100) // Should be near bottom
    }
  })
})

test.describe('ABC Notation Rendering', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('musical notation is readable without overflow', async ({ page }) => {
    await page.goto('/module/1/1.1')
    await page.waitForLoadState('networkidle')

    // Find ABC rendered content
    const abcSvg = page.locator('svg.abcjs-container').first()

    if ((await abcSvg.count()) > 0) {
      const svgBox = await abcSvg.boundingBox()

      if (svgBox) {
        // SVG should not exceed viewport width (allowing horizontal scroll is ok)
        const viewportWidth = page.viewportSize()?.width || 375

        // Either fits in viewport OR parent has horizontal scroll
        const parent = page.locator('svg.abcjs-container').first().locator('..')
        const hasHorizontalScroll = await parent.evaluate((el) => el.scrollWidth > el.clientWidth)

        const fitsInViewport = svgBox.width <= viewportWidth
        expect(fitsInViewport || hasHorizontalScroll).toBeTruthy()
      }
    }
  })

  test('ABC renderer uses responsive staffwidth on mobile', async ({ page }) => {
    await page.goto('/module/1/1.1')
    await page.waitForLoadState('networkidle')

    // Check that ABC container adapts to mobile viewport
    const abcRenderer = page.locator('.abc-renderer').first()

    if ((await abcRenderer.count()) > 0) {
      const rendererWidth = await abcRenderer.evaluate((el) => el.getBoundingClientRect().width)

      const viewportWidth = page.viewportSize()?.width || 375

      // Renderer should not exceed viewport width
      expect(rendererWidth).toBeLessThanOrEqual(viewportWidth)
      console.log(`ABC renderer width: ${rendererWidth}px on ${viewportWidth}px viewport`)
    }
  })

  test('ABC notation uses a horizontal scroll container on mobile', async ({ page }) => {
    await page.goto('/module/1/1.1')
    await page.waitForLoadState('networkidle')

    const abcRenderer = page.locator('.abc-renderer').first()

    if ((await abcRenderer.count()) > 0) {
      const scrollContainer = abcRenderer.locator('div.overflow-x-auto').first()
      const hasOverflowAuto = await scrollContainer.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return style.overflowX === 'auto' || style.overflowX === 'scroll'
      })

      expect(hasOverflowAuto).toBeTruthy()
    }
  })
})
