import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AudioUnlocker from './AudioUnlocker'
import { useAudioStore } from '../../../stores/useAudioStore'
import { AUDIO_STRINGS } from '../constants'

vi.mock('../../../stores/useAudioStore', () => ({
  useAudioStore: vi.fn(),
}))

describe('AudioUnlocker', () => {
  const initializeAudio = vi.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const setupMockStore = (state: { isReady: boolean; initializeAudio: typeof initializeAudio }) => {
    ;(useAudioStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      return selector(state)
    })
  }

  it('should not render when audio is ready', () => {
    setupMockStore({
      isReady: true,
      initializeAudio,
    })

    render(<AudioUnlocker />)
    expect(screen.queryByText(AUDIO_STRINGS.UNLOCK.BUTTON)).not.toBeInTheDocument()
  })

  it('should render overlay when audio is not ready', () => {
    setupMockStore({
      isReady: false,
      initializeAudio,
    })

    render(<AudioUnlocker />)
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
  })

  it('should call initializeAudio on click', async () => {
    setupMockStore({
      isReady: false,
      initializeAudio,
    })

    render(<AudioUnlocker />)

    const button = screen.getByRole('button', { name: /start/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(initializeAudio).toHaveBeenCalled()
    })
  })

  it('should run onUnlock before initializeAudio', async () => {
    const events: string[] = []
    const onUnlock = vi.fn().mockImplementation(async () => {
      events.push('unlock')
    })

    initializeAudio.mockImplementationOnce(async () => {
      events.push('initialize')
    })

    setupMockStore({
      isReady: false,
      initializeAudio,
    })

    render(<AudioUnlocker onUnlock={onUnlock} />)

    const button = screen.getByRole('button', { name: /start/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(onUnlock).toHaveBeenCalled()
      expect(initializeAudio).toHaveBeenCalled()
      expect(events).toEqual(['unlock', 'initialize'])
    })
  })
})
