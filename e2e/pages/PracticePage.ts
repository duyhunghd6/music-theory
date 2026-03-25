import { expect, Page } from '@playwright/test'

/**
 * Page Object Model for Practice page
 * Encapsulates interactions with the shipped practice library flow.
 */
export class PracticePage {
  constructor(private page: Page) {}

  async navigate(sheetId?: string) {
    const url = sheetId ? `/practice?sheet=${sheetId}` : '/practice'
    await this.page.goto(url)
    await this.page.waitForLoadState('networkidle')
    await this.dismissAudioUnlockerIfVisible()
  }

  async dismissAudioUnlockerIfVisible() {
    const unlockButton = this.page.getByRole('button', { name: /Start Music Theory|Tap to Start Music Theory/i })
    if (await unlockButton.isVisible()) {
      await unlockButton.click()
      await this.page.waitForLoadState('networkidle')
    }
  }

  async expectLibraryVisible() {
    await expect(this.page.getByTestId('practice-library')).toBeVisible()
    await expect(this.page.getByRole('heading', { name: 'Thư Viện Bản Nhạc' })).toBeVisible()
    await expect(this.page.getByText('Chọn bài để luyện tập đọc nhạc trên khuông nhạc')).toBeVisible()
  }

  async getCategoryCount() {
    return this.page.locator('button').filter({ hasText: /bài$/ }).count()
  }

  async openFirstCurriculumCategory() {
    await this.page.locator('button').filter({ hasText: 'Khuông Nhạc & Nốt' }).click()
  }

  async expectSheetSelectorVisible(categoryName = 'Khuông Nhạc & Nốt') {
    const modal = this.page.getByTestId('practice-sheet-selector-modal')
    await expect(modal).toBeVisible()
    await expect(modal.locator('h2', { hasText: categoryName })).toBeVisible()
  }

  async selectFirstCurriculumSheet() {
    const modal = this.page.getByTestId('practice-sheet-selector-modal')
    const sheetButtons = modal.locator('[data-testid^="practice-sheet-option-"]')
    await expect(sheetButtons.first()).toBeVisible()
    await sheetButtons.first().click()
    await this.expectNowPlayingVisible()
  }

  async expectNowPlayingVisible() {
    await expect(this.page.getByTestId('practice-now-playing-banner')).toBeVisible()
    await expect(this.page.getByText('Đang phát')).toBeVisible()
  }

  async expectSelectedSheetTitle(title: string) {
    await expect(this.page.getByTestId('practice-now-playing-banner')).toContainText(title)
  }

  async clearSelectedSheet() {
    await this.page.getByTitle('Đóng bài hát').click()
  }

  async expectGrandStaffVisible() {
    await expect(this.page.getByTestId('practice-grand-staff-panel')).toBeVisible()
    await expect(this.page.getByText('Grand Staff View')).toBeVisible()
    await expect(this.page.getByRole('img', { name: /Sheet Music for/i })).toBeVisible()
  }

  async expectPlaybackControlsVisible() {
    const controls = this.page.locator('.abcjs-inline-audio')
    await expect(controls).toBeVisible()
    await expect(controls.locator('.abcjs-midi-start')).toBeVisible()
  }

  async tapPlaybackStart() {
    await this.page.locator('.abcjs-inline-audio .abcjs-midi-start').click()
  }

  async expectPlaybackAttemptStarted() {
    await expect(this.page.locator('.abcjs-inline-audio .abcjs-midi-start')).toHaveClass(/abcjs-pushed/)
  }

  async expectPlaybackClockVisible() {
    await expect(this.page.locator('.abcjs-inline-audio .abcjs-midi-clock')).toBeVisible()
  }

  async toggleNoteNames() {
    await this.page.getByRole('checkbox').click()
  }

  async expectFluteVisible() {
    await expect(this.page.getByTestId('practice-flute-panel')).toBeVisible()
    await expect(this.page.getByText('Flute')).toBeVisible()
    await expect(this.page.getByText(/Ready|Do|Re|Mi|Fa|Sol|La|Si|C|D|E|F|G/).first()).toBeVisible()
  }

  async switchToTenHoleFlute() {
    await this.page.getByRole('button', { name: '10h' }).click()
  }
}
