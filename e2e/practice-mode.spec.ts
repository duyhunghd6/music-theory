import { test, expect } from '@playwright/test'
import { PracticePage } from './pages/PracticePage'

const TARGET_SHEET_ID = 'raga-bupali'
const TARGET_SHEET_TITLE = 'Raga Bupali'

test.describe('Practice Mode', () => {
  test.beforeEach(async ({ page }) => {
    const practice = new PracticePage(page)
    await practice.navigate()
  })

  test('practice page shows the shipped music library', async ({ page }) => {
    const practice = new PracticePage(page)

    await practice.expectLibraryVisible()
    expect(await practice.getCategoryCount()).toBeGreaterThan(0)
  })

  test('user can open a curriculum category and select a sheet', async ({ page }) => {
    const practice = new PracticePage(page)

    await practice.openFirstCurriculumCategory()
    await practice.expectSheetSelectorVisible()
    await practice.selectFirstCurriculumSheet()
    await practice.expectNowPlayingVisible()
  })

  test('selected sheet renders in the grand staff view', async ({ page }) => {
    const practice = new PracticePage(page)

    await practice.openFirstCurriculumCategory()
    await practice.selectFirstCurriculumSheet()
    await practice.expectGrandStaffVisible()
  })

  test('flute panel remains available in practice mode', async ({ page }) => {
    const practice = new PracticePage(page)

    await practice.expectFluteVisible()
    await practice.switchToTenHoleFlute()
    await expect(page.getByRole('button', { name: '10h' })).toBeVisible()
  })

  test('selected sheet can be cleared from now playing banner', async ({ page }) => {
    const practice = new PracticePage(page)

    await practice.openFirstCurriculumCategory()
    await practice.selectFirstCurriculumSheet()
    await practice.expectNowPlayingVisible()
    await practice.clearSelectedSheet()
    await expect(page.getByText('Đang phát')).toHaveCount(0)
  })

  test('practice route loads raga-bupali from the shipped sheet query param', async ({ page }) => {
    const practice = new PracticePage(page)

    await practice.navigate(TARGET_SHEET_ID)
    await practice.expectNowPlayingVisible()
    await practice.expectSelectedSheetTitle(TARGET_SHEET_TITLE)
    await practice.expectGrandStaffVisible()
  })

  test('mobile playback flow reaches the visible pre-audio state for raga-bupali', async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName !== 'chromium',
      'This targeted pre-playback check is covered on the mobile chromium project only.'
    )

    const practice = new PracticePage(page)

    await practice.navigate(TARGET_SHEET_ID)
    await practice.expectSelectedSheetTitle(TARGET_SHEET_TITLE)
    await practice.expectPlaybackControlsVisible()
    await practice.expectPlaybackClockVisible()
    await practice.tapPlaybackStart()
    await practice.expectPlaybackAttemptStarted()
  })
})
