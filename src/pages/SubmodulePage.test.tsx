import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import type { Submodule } from '../data/course-data'

const mockedNavigate = vi.fn()
const mockedSubmodule = vi.hoisted(() => ({
  value: undefined as Submodule | undefined,
}))

vi.mock('react-router-dom', () => ({
  useParams: () => ({ moduleId: '1', submoduleId: '1.1' }),
  useNavigate: () => mockedNavigate,
}))

vi.mock('../data/course-data', () => ({
  findSubmodule: () => mockedSubmodule.value,
  findModule: () => ({ id: 1, name: 'Module 1', subtitle: 'Intro', icon: 'music_note', submodules: [] }),
  getNextSubmodule: () => undefined,
  getPreviousSubmodule: () => undefined,
}))

vi.mock('../stores/useProgressStore', () => ({
  useProgressStore: (selector?: (state: unknown) => unknown) => {
    const state = {
      setCurrentPosition: vi.fn(),
      completeSubmodule: vi.fn(),
      completedSubmodules: [],
      getSectionProgress: vi.fn(() => undefined),
    }

    return selector ? selector(state) : state
  },
}))

vi.mock('../components/ui/CollapsiblePanel', () => ({
  CollapsiblePanel: ({ children, title }: { children: ReactNode; title: string }) => (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}))

vi.mock('../components/layout/MainHeader', () => ({
  MainHeader: () => <div>main header</div>,
}))

vi.mock('../components/layout/SubmoduleHeader', () => ({
  SubmoduleHeader: () => <div>submodule header</div>,
}))

vi.mock('../components/layout/AppLayout', () => ({
  AppLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

vi.mock('../utils/lessonUtils', () => ({
  getShortLessonName: (title: string) => title,
}))

vi.mock('../features/sao-truc/components/HorizontalSaoTrucVisualizer', () => ({
  default: () => <div data-testid="flute-visualizer">flute visualizer</div>,
}))

vi.mock('../components/modules/ProgressiveTheoryContent', () => ({
  default: () => <div>progressive theory content</div>,
}))

vi.mock('../components/MusicStaff/AbcGrandStaff', () => ({
  default: () => <div>grand staff</div>,
}))

vi.mock('../components/modules/AbcDemoSection', () => ({
  default: () => <div>abc demo section</div>,
}))

vi.mock('../components/modules/NoteIdentificationQuiz', () => ({
  default: () => <div>note identification quiz</div>,
}))

vi.mock('../components/game-shell/UniversalGameRouter', () => ({
  default: () => <div>game router</div>,
}))

describe('SubmodulePage flute section contract', () => {
  beforeEach(() => {
    mockedNavigate.mockReset()
    cleanup()
  })

  it('renders the flute visualizer when the submodule declares the flute section', async () => {
    mockedSubmodule.value = {
      id: '1.1',
      title: 'Lesson',
      description: 'Description',
      sections: ['flute'],
    }

    const { default: SubmodulePage } = await import('./SubmodulePage')
    render(<SubmodulePage />)

    expect(screen.getByText('Sáo Trúc (Vietnamese Bamboo Flute)')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByTestId('flute-visualizer')).toBeInTheDocument()
    })
  })

  it('does not render the flute visualizer without the flute section', async () => {
    mockedSubmodule.value = {
      id: '1.1',
      title: 'Lesson',
      description: 'Description',
      sections: ['theory'],
      theoryContent: 'Theory content',
    }

    const { default: SubmodulePage } = await import('./SubmodulePage')
    render(<SubmodulePage />)

    expect(screen.queryByText('Sáo Trúc (Vietnamese Bamboo Flute)')).not.toBeInTheDocument()
    expect(screen.queryByTestId('flute-visualizer')).not.toBeInTheDocument()
  })
})
