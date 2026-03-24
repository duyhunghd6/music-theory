/**
 * Browser ID Management
 * Generates and persists a unique identifier for the browser.
 * This ID is used to associate progress data with a specific browser/device.
 */

const BROWSER_ID_KEY = 'music-theory-browser-id'

/**
 * Generate a UUID v4
 */
function generateUUID(): string {
  // Use crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Get the browser ID from localStorage, or generate a new one if not present.
 * The ID persists across sessions for the same browser.
 */
export function getBrowserId(): string {
  try {
    let browserId = localStorage.getItem(BROWSER_ID_KEY)

    if (!browserId) {
      browserId = generateUUID()
      localStorage.setItem(BROWSER_ID_KEY, browserId)

      if (import.meta.env.DEV) {
        console.log('[BrowserID] Generated new browser ID:', browserId)
      }
    }

    return browserId
  } catch {
    // localStorage may be unavailable in some contexts (e.g., private browsing)
    console.warn('[BrowserID] localStorage unavailable, using session-only ID')
    return generateUUID()
  }
}

export default getBrowserId
