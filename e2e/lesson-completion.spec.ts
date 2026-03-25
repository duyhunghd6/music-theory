import { test, expect } from '@playwright/test'
import { LessonPage } from './pages/LessonPage'

test.describe('Lesson Completion Flow', () => {
  test.beforeEach(async ({ page }) => {
    const lesson = new LessonPage(page)
    await lesson.resetProgress()
  })

  test('user can reveal gated lesson content by answering quizzes', async ({ page }) => {
    const lesson = new LessonPage(page)

    await lesson.navigateToLesson(1, '1.1')

    const title = await lesson.getLessonTitle()
    expect(title).toBeTruthy()
    expect(await lesson.isSectionVisible(0)).toBe(true)
    expect(await lesson.isSectionVisible(1)).toBe(false)

    await lesson.answerFirstQuizOption()
    await expect(page.locator('[data-testid="theory-section-1"]')).toBeVisible()
  })

  test('completed lesson progress persists after page reload', async ({ page }) => {
    const lesson = new LessonPage(page)

    await lesson.navigateToLesson(1, '1.1')
    await lesson.clickBypassButton()
    await lesson.waitForTheoryCompletion()
    await lesson.completeLesson()

    await expect(page).toHaveURL(/\/module\/1\/1\.2$/)
    expect(await lesson.isCompleted('1.1')).toBe(true)
    expect(await lesson.getLessonTitle()).toBeTruthy()

    await page.reload()
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveURL(/\/module\/1\/1\.2$/)
    expect(await lesson.isCompleted('1.1')).toBe(true)
    expect(await lesson.getLessonTitle()).toBeTruthy()
    await expect(page.locator('[data-testid="theory-section-0"]')).toBeVisible()
  })

  test('progress dots navigation works', async ({ page }) => {
    const lesson = new LessonPage(page)

    await lesson.navigateToLesson(1, '1.1')

    const dotCount = await lesson.getProgressDotCount()

    if (dotCount > 1) {
      await lesson.clickBypassButton()
      await lesson.waitForTheoryCompletion()
      await lesson.clickProgressDot(1)
      await expect(page.locator('[data-testid="theory-section-1"]')).toBeVisible()
    }
  })
})
