import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HomePage } from './HomePage'
import { useAudioStore } from '../stores/useAudioStore'
import { useGameStore } from '../stores/useGameStore'

vi.mock('../components/MusicStaff/AbcGrandStaff', () => ({
  default: ({ showNoteNames }: { showNoteNames: boolean }) => (
    <div data-testid="grand-staff-mock">show-note-names:{String(showNoteNames)}</div>
  ),
}))

vi.mock('../features/sao-truc/components/HorizontalSaoTrucVisualizer', () => ({
  default: () => <div data-testid="flute-visualizer-mock">flute visualizer</div>,
}))

vi.mock('../components/LazyWrappers', () => ({
  LazyModuleContent: () => <div data-testid="module-content-mock">module content</div>,
}))

vi.mock('../components/MusicStaff/StaffRangeVisualTest', () => ({
  default: () => <div data-testid="staff-range-test-mock">staff range test</div>,
}))

// Mock Storage Manager
vi.mock('../services/storage-manager', () => ({
  requestPersistentStorage: vi.fn().mockResolvedValue(true),
  getStorageEstimate: vi.fn().mockResolvedValue({ usage: 0, quota: 0 }),
}))

describe('HomePage Integration', () => {
  beforeEach(() => {
    useAudioStore.setState({
      activeNotes: [],
      recordedNotes: [],
      isPlaying: false,
    })

    useGameStore.setState({
      isPlaying: false,
      score: 0,
      streak: 0,
      currentQuestion: null,
      gameMode: 'normal',
      difficulty: 'easy',
      showFeedback: false,
      feedbackType: null,
      showCelebration: false,
      celebrationType: null,
      totalQuestions: 0,
      correctAnswers: 0,
      timeRemaining: null,
      selectedAnswer: null,
    })

    cleanup()
  })

  it('renders the current home page learning panels', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(screen.getByText('Grand Staff View')).toBeInTheDocument()
    expect(screen.getByText('Flute')).toBeInTheDocument()
    expect(screen.getByText('Staff Range Test (ABC)')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByTestId('grand-staff-mock')).toBeInTheDocument()
      expect(screen.getByTestId('flute-visualizer-mock')).toBeInTheDocument()
      expect(screen.getByTestId('module-content-mock')).toBeInTheDocument()
    })
  })
})
