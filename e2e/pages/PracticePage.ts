import { expect, Page } from '@playwright/test'

/**
 * Page Object Model for Practice page
 * Encapsulates interactions with the shipped practice library flow.
 */
export class PracticePage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/practice')
    await this.page.waitForLoadState('networkidle')
  }

  async expectLibraryVisible() {
    await expect(this.page.getByRole('heading', { name: 'Thư Viện Bản Nhạc' })).toBeVisible()
    await expect(this.page.getByText('Chọn bài để luyện tập đọc nhạc trên khuông nhạc')).toBeVisible()
  }

  async getCategoryCount() {
    return this.page.locator('button').filter({ hasText: /bài$/ }).count()
  }

  async openFirstCurriculumCategory() {
    await this.page.locator('button').filter({ hasText: 'Khuông Nhạc & Nốt' }).click()
  }

  async expectSheetSelectorVisible() {
    const modal = this.page.locator('.fixed.inset-0.z-50').last()
    await expect(modal.locator('h2', { hasText: 'Khuông Nhạc & Nốt' })).toBeVisible()
  }

  async selectFirstCurriculumSheet() {
    const modal = this.page.locator('.fixed.inset-0.z-50').last()
    const sheetButtons = modal.locator('.flex-1.overflow-y-auto button')
    await expect(sheetButtons.first()).toBeVisible()
    await sheetButtons.first().click()
    await expect(this.page.getByText('Đang phát')).toBeVisible()
  }

  async expectNowPlayingVisible() {
    await expect(this.page.getByText('Đang phát')).toBeVisible()
  }

  async clearSelectedSheet() {
    await this.page.getByTitle('Đóng bài hát').click()
  }

  async expectGrandStaffVisible() {
    await expect(this.page.getByText('Grand Staff View')).toBeVisible()
    await expect(this.page.getByRole('img', { name: /Sheet Music for/i })).toBeVisible()
  }

  async toggleNoteNames() {
    await this.page.getByRole('checkbox').click()
  }

  async expectFluteVisible() {
    await expect(this.page.getByText('Flute')).toBeVisible()
    await expect(this.page.getByText(/Ready|Do|Re|Mi|Fa|Sol|La|Si|C|D|E|F|G/).first()).toBeVisible()
  }

  async switchToTenHoleFlute() {
    await this.page.getByRole('button', { name: '10h' }).click()
  }
}
