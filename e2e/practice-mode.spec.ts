import { test, expect } from '@playwright/test'
import { PracticePage } from './pages/PracticePage'

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
})
