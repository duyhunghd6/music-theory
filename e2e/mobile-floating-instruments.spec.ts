import { test, expect, type Locator, type Page } from '@playwright/test'

const MOBILE_VIEWPORT = { width: 375, height: 667 }
const DESKTOP_VIEWPORT = { width: 1280, height: 720 }
const MOBILE_TOOLBAR_BOTTOMS = {
  collapsed: 80,
  piano: 205,
  guitar: 221,
  flute: 181,
} as const

const INSTRUMENT_LABELS = {
  piano: 'Piano',
  guitar: 'Guitar',
  flute: 'Sáo Trúc',
} as const

const toolbarToggle = (page: Page): Locator =>
  page
    .locator(
      '[data-testid="floating-toolbar-toggle"], button[title="Mở menu công cụ"], button[title="Đóng menu"]'
    )
    .first()

const instrumentButton = (page: Page, instrument: 'piano' | 'guitar' | 'flute'): Locator =>
  page
    .locator(
      `[data-testid="floating-toolbar-${instrument}-button"], button[title*="${INSTRUMENT_LABELS[instrument]}"]`
    )
    .first()

const toolbarContainer = (page: Page): Locator => page.getByTestId('floating-instruments-toolbar')

const instrumentPanel = (page: Page, instrument: 'piano' | 'guitar' | 'flute'): Locator =>
  page.getByTestId(`floating-instrument-${instrument}`)

const getToolbarBottom = async (page: Page): Promise<number> =>
  toolbarContainer(page).evaluate((element) =>
    Number.parseFloat(window.getComputedStyle(element).bottom)
  )

const openToolbar = async (page: Page) => {
  await toolbarToggle(page).click()
}

const selectInstrument = async (page: Page, instrument: 'piano' | 'guitar' | 'flute') => {
  await openToolbar(page)
  await instrumentButton(page, instrument).click()
}

const showInstrument = async (page: Page, instrument: 'piano' | 'guitar' | 'flute') => {
  await selectInstrument(page, instrument)
  await expect(instrumentPanel(page, instrument)).toBeVisible()
}

test.describe('Mobile Floating Instruments', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto('/module/1/1.1')
    await page.waitForLoadState('networkidle')
  })

  test('toggles piano on and off', async ({ page }) => {
    await showInstrument(page, 'piano')
    await expect(page.getByTestId('floating-instrument-piano')).toBeVisible()
    await expect(page.getByTestId('virtual-piano')).toBeVisible()

    await selectInstrument(page, 'piano')
    await expect(page.getByTestId('floating-instrument-piano')).toHaveCount(0)
  })

  test('shows only one instrument at a time', async ({ page }) => {
    await showInstrument(page, 'piano')
    await expect(page.getByTestId('floating-instrument-piano')).toBeVisible()

    await showInstrument(page, 'guitar')
    await expect(page.getByTestId('floating-instrument-piano')).toHaveCount(0)
    await expect(page.getByTestId('floating-instrument-guitar')).toBeVisible()
  })

  test('menu auto-closes after selecting an instrument', async ({ page }) => {
    await openToolbar(page)
    await page.getByTestId('floating-toolbar-piano-button').click()

    await expect(page.getByTestId('floating-toolbar-guitar-button')).toHaveCount(0)
    await expect(page.getByTestId('floating-instrument-piano')).toBeVisible()
  })

  test('piano panel is bottom-fixed and headerless on mobile', async ({ page }) => {
    await showInstrument(page, 'piano')

    const pianoPanel = page.getByTestId('floating-instrument-piano')
    await expect(pianoPanel).toBeVisible()

    const boundingBox = await pianoPanel.boundingBox()
    expect(boundingBox).not.toBeNull()
    if (boundingBox) {
      expect(boundingBox.y + boundingBox.height).toBeGreaterThan(MOBILE_VIEWPORT.height - 10)
      expect(boundingBox.width).toBeGreaterThanOrEqual(MOBILE_VIEWPORT.width - 20)
      expect(boundingBox.height).toBeGreaterThanOrEqual(130)
      expect(boundingBox.height).toBeLessThanOrEqual(170)
    }

    await expect(pianoPanel.getByTitle('Close')).toHaveCount(0)
  })

  test('toolbar uses the raised mobile offset when an instrument opens', async ({ page }) => {
    expect(await getToolbarBottom(page)).toBe(MOBILE_TOOLBAR_BOTTOMS.collapsed)

    await showInstrument(page, 'piano')
    await expect(toolbarContainer(page)).toHaveCSS('bottom', `${MOBILE_TOOLBAR_BOTTOMS.piano}px`)
  })

  test('toolbar matches configured mobile offsets for each instrument', async ({ page }) => {
    await showInstrument(page, 'piano')
    await expect(toolbarContainer(page)).toHaveCSS('bottom', `${MOBILE_TOOLBAR_BOTTOMS.piano}px`)

    await showInstrument(page, 'guitar')
    await expect(toolbarContainer(page)).toHaveCSS('bottom', `${MOBILE_TOOLBAR_BOTTOMS.guitar}px`)

    await showInstrument(page, 'flute')
    await expect(toolbarContainer(page)).toHaveCSS('bottom', `${MOBILE_TOOLBAR_BOTTOMS.flute}px`)
  })

  test('content remains accessible with a floating instrument open', async ({ page }) => {
    await showInstrument(page, 'piano')

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(page.getByTestId('bottom-navigation')).toBeVisible()
    await expect(page.getByTestId('bottom-nav-theory')).toBeVisible()
  })

  test('mobile piano still renders three octaves', async ({ page }) => {
    await showInstrument(page, 'piano')
    await expect(page.getByTestId('virtual-piano')).toBeVisible()
    const keyCount = await page.locator('[data-testid^="piano-key-"]').count()
    expect(keyCount).toBe(36)
  })
})

test.describe('Desktop Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT)
    await page.goto('/module/1/1.1')
    await page.waitForLoadState('networkidle')
  })

  test('desktop piano still renders three octaves', async ({ page }) => {
    await showInstrument(page, 'piano')
    const pianoPanel = page.getByTestId('floating-instrument-piano')
    await expect(pianoPanel).toBeVisible()
    await expect(page.getByTestId('virtual-piano')).toBeVisible()
    const keyCount = await page.locator('[data-testid^="piano-key-"]').count()
    expect(keyCount).toBe(36)
  })

  test('desktop panels still show close controls', async ({ page }) => {
    await showInstrument(page, 'piano')
    const pianoPanel = page.getByTestId('floating-instrument-piano')
    await expect(pianoPanel).toBeVisible()
    await expect(pianoPanel.getByTitle('Close')).toBeVisible()
  })
})
