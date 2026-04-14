import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import PracticePage from './PracticePage'

const mockAudioUnlocker = vi.fn()

vi.mock('abcjs', () => ({
  default: {
    synth: {
      activeAudioContext: vi.fn(),
    },
  },
}))

vi.mock('../components/layout/AppLayout', () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('../components/layout/SimpleHeader', () => ({
  SimpleHeader: () => <div>SimpleHeader</div>,
}))

vi.mock('../components/ui/CollapsiblePanel', () => ({
  CollapsiblePanel: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}))

vi.mock('../features/game', () => ({
  FeedbackOverlay: () => <div>FeedbackOverlay</div>,
  GameOverlay: () => <div>GameOverlay</div>,
}))

vi.mock('../components/ui/ConfettiExplosion', () => ({
  ConfettiExplosion: () => null,
}))

vi.mock('../components/practice', () => ({
  MusicCategoryCard: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick}>MusicCategoryCard</button>
  ),
  SheetSelectorModal: () => null,
  NowPlayingBanner: ({ sheet }: { sheet: { title: string } }) => (
    <div>Now Playing: {sheet.title}</div>
  ),
}))

vi.mock('../stores/useGameStore', () => ({
  useGameStore: (selector: (state: { isPlaying: boolean; streak: number }) => unknown) =>
    selector({ isPlaying: false, streak: 0 }),
}))

vi.mock('../features/audio/components/AudioUnlocker', () => ({
  default: (props: { onUnlock?: () => Promise<void> | void }) => {
    mockAudioUnlocker(props)
    return <div data-testid="audio-unlocker" />
  },
}))

vi.mock('../data/practiceLibrary', () => ({
  __esModule: true,
  default: [
    {
      id: 'ragas',
      name: 'Ragas',
      nameVi: 'Ragas',
      description: 'desc',
      descriptionVi: 'desc',
      icon: 'icon',
      color: 'from-cyan-500 to-teal-600',
      difficulty: 'intermediate',
      sheets: [
        {
          id: 'raga-bupali',
          title: 'Raga Bupali',
          description: 'Traditional Indian raga',
          abc: 'X:1\nK:C\nC',
          difficulty: 'intermediate',
          source: 'curriculum',
        },
      ],
    },
  ],
  createButterworthCategory: () => ({
    id: 'butterworth',
    name: 'Butterworth',
    nameVi: 'Butterworth',
    description: 'desc',
    descriptionVi: 'desc',
    icon: 'icon',
    color: 'from-cyan-500 to-teal-600',
    difficulty: 'intermediate',
    getSheets: () => [],
    loadSheet: vi.fn(),
  }),
  loadButterworthSong: vi.fn(),
  parseButterworthFilename: vi.fn(),
  createSahajaYogaCategory: () => ({
    id: 'sahaja-yoga',
    name: 'Sahaja Yoga',
    nameVi: 'Sahaja Yoga',
    description: 'desc',
    descriptionVi: 'desc',
    icon: 'icon',
    color: 'from-cyan-500 to-teal-600',
    difficulty: 'intermediate',
    getSheets: () => [],
    loadSheet: vi.fn(),
  }),
  loadSahajaYogaSong: vi.fn(),
  parseSahajaYogaFilename: vi.fn(),
}))

describe('PracticePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads the selected sheet from the shipped practice route', async () => {
    render(
      <MemoryRouter initialEntries={['/practice?sheet=raga-bupali']}>
        <Routes>
          <Route path="/practice" element={<PracticePage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByText('Now Playing: Raga Bupali')).toBeInTheDocument()
  })

  it('passes an unlock callback to AudioUnlocker', () => {
    render(
      <MemoryRouter initialEntries={['/practice?sheet=raga-bupali']}>
        <Routes>
          <Route path="/practice" element={<PracticePage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(mockAudioUnlocker).toHaveBeenCalled()
    const props = mockAudioUnlocker.mock.calls[0][0]
    expect(props.onUnlock).toEqual(expect.any(Function))
  })
})
