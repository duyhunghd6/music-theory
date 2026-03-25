import { expect, Page } from '@playwright/test'

/**
 * Page Object Model for Lesson/Submodule pages
 * Encapsulates all interactions with lesson pages
 */
export class LessonPage {
  constructor(private page: Page) {}

  async navigateToLesson(moduleId: number, lessonId: string) {
    await this.page.goto(`/module/${moduleId}/${lessonId}`)
    await this.page.waitForLoadState('networkidle')
  }

  async resetProgress() {
    await this.page.goto('/')
    await this.page.evaluate(async () => {
      localStorage.clear()
      sessionStorage.clear()

      await new Promise<void>((resolve) => {
        const deleteRequest = indexedDB.deleteDatabase('music-theory-db')
        deleteRequest.onsuccess = () => resolve()
        deleteRequest.onerror = () => resolve()
        deleteRequest.onblocked = () => resolve()
      })
    })
  }

  async getLessonTitle() {
    return this.page.locator('[data-testid="submodule-title"]').textContent()
  }

  async isSectionVisible(sectionIndex: number) {
    return this.page.locator(`[data-testid="theory-section-${sectionIndex}"]`).isVisible()
  }

  async waitForQuiz() {
    await expect(this.page.locator('[data-testid="inline-quiz"]')).toBeVisible()
  }

  async answerFirstQuizOption() {
    await this.waitForQuiz()
    await this.page.locator('[data-testid="quiz-option-0"]').click()
  }

  async clickBypassButton() {
    await this.page.locator('[data-testid="bypass-button"]').click()
  }

  async waitForTheoryCompletion() {
    await expect(this.page.locator('[data-testid="bypass-button"]')).toHaveCount(0)
  }

  async completeLesson() {
    await this.page.getByRole('button', { name: /Complete & Continue|Next Lesson/i }).click()
  }

  async getCompletedSubmodules() {
    return this.page.evaluate(async () => {
      const readFromIndexedDb = () =>
        new Promise<string[] | null>((resolve) => {
          const request = indexedDB.open('music-theory-db', 1)

          request.onerror = () => resolve(null)
          request.onupgradeneeded = () => resolve(null)
          request.onsuccess = () => {
            const db = request.result

            if (!db.objectStoreNames.contains('progress')) {
              resolve(null)
              return
            }

            const transaction = db.transaction('progress', 'readonly')
            const store = transaction.objectStore('progress')
            const getRequest = store.get('music-theory-progress')

            getRequest.onerror = () => resolve(null)
            getRequest.onsuccess = () => {
              const raw = getRequest.result
              if (typeof raw !== 'string') {
                resolve([])
                return
              }

              try {
                const parsed = JSON.parse(raw) as { state?: { completedSubmodules?: string[] } }
                resolve(parsed.state?.completedSubmodules ?? [])
              } catch {
                resolve([])
              }
            }
          }
        })

      const indexedDbCompleted = await readFromIndexedDb()
      if (indexedDbCompleted) {
        return indexedDbCompleted
      }

      const raw = localStorage.getItem('music-theory-progress')
      if (!raw) return [] as string[]

      try {
        const parsed = JSON.parse(raw) as { state?: { completedSubmodules?: string[] } }
        return parsed.state?.completedSubmodules ?? []
      } catch {
        return [] as string[]
      }
    })
  }

  async isCompleted(submoduleId: string) {
    const completed = await this.getCompletedSubmodules()
    return completed.includes(submoduleId)
  }

  async clickProgressDot(index: number) {
    await this.page.locator(`[data-testid="progress-dot-${index}"]`).click()
  }

  async getProgressDotCount() {
    return this.page.locator('[data-testid^="progress-dot-"]').count()
  }

  async playAbcDemo(demoId: string) {
    await this.page.locator(`[data-testid="abc-play-${demoId}"]`).click()
  }

  async isAudioPlaying() {
    return this.page.locator('[data-testid="audio-playing-indicator"]').isVisible()
  }
}
