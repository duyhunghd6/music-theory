import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import type { ReactNode } from 'react'

const mockedRoutes = vi.hoisted(() => ({
  routes: [] as string[],
}))

vi.mock('./pages/HomePage', () => ({
  HomePage: () => <div>home page</div>,
}))

vi.mock('./pages/ProfilePage', () => ({
  ProfilePage: () => <div>profile page</div>,
}))

vi.mock('./pages/SubmodulePage', () => ({
  default: () => <div>submodule page</div>,
}))

vi.mock('./pages/PracticePage', () => ({
  default: () => <div>practice page</div>,
}))

vi.mock('./pages/ComposePage', () => ({
  default: () => <div>compose page</div>,
}))

vi.mock('./pages/AbcEditorPage', () => ({
  default: () => <div>abc editor page</div>,
}))

vi.mock('./pages/TestUIPage', () => ({
  default: () => <div>test ui page</div>,
}))

vi.mock('./pages/FretboardTestPage', () => ({
  default: () => <div>fretboard test page</div>,
}))

vi.mock('./pages/GuitarFretboardPopupTestPage', () => ({
  default: () => <div>guitar popup test page</div>,
}))

vi.mock('./pages/TestAbcNotationPage', () => ({
  default: () => <div>test abc notation page</div>,
}))

vi.mock('./pages/IPhonePlayerTestPage', () => ({
  default: () => <div>iphone player test page</div>,
}))

vi.mock('./pages/Module2GameTestPage', () => ({
  default: () => <div>module2 game test page</div>,
}))

vi.mock('./components/layout/MainLayout', () => ({
  MainLayout: ({ children }: { children: ReactNode }) => <div data-testid="main-layout">{children}</div>,
}))

vi.mock('./components/ui/FloatingInstrumentsContainer', () => ({
  default: () => <div data-testid="floating-instruments" />,
}))

vi.mock('./components/ui/BugReportModal', () => ({
  default: () => <div data-testid="bug-report-modal" />,
}))

vi.mock('./stores/useSettingsStore', () => ({
  useSettingsStore: (selector: (state: { theme: string }) => string) => selector({ theme: 'light' }),
}))

vi.mock('./stores/useProgressStore', () => ({
  useProgressStore: (selector: (state: { updateStreak: () => void; initFromCloud: () => Promise<void> }) => unknown) =>
    selector({
      updateStreak: vi.fn(),
      initFromCloud: vi.fn().mockResolvedValue(undefined),
    }),
}))

vi.mock('./stores/useBugReportStore', () => ({
  useBugReportStore: (selector: (state: { initializeInterceptors: () => void }) => unknown) =>
    selector({ initializeInterceptors: vi.fn() }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')

  return {
    ...actual,
    BrowserRouter: ({ children }: { children: ReactNode }) => <div data-testid="browser-router">{children}</div>,
    Routes: ({ children }: { children: ReactNode }) => <>{children}</>,
    Route: ({ path, element }: { path: string; element: ReactNode }) => {
      mockedRoutes.routes.push(path)
      return <>{element}</>
    },
  }
})

describe('App route policy', () => {
  beforeEach(() => {
    mockedRoutes.routes = []
    vi.resetModules()
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllEnvs()
  })

  it('keeps shipped routes and hides debug routes outside dev', async () => {
    vi.stubEnv('DEV', false)

    const { default: App } = await import('./App')
    render(<App />)

    expect(screen.getByTestId('browser-router')).toBeInTheDocument()
    expect(mockedRoutes.routes).toContain('/')
    expect(mockedRoutes.routes).toContain('/practice')
    expect(mockedRoutes.routes).toContain('/abc-editor')
    expect(mockedRoutes.routes).not.toContain('/test-ui')
    expect(mockedRoutes.routes).not.toContain('/test-fretboard')
    expect(mockedRoutes.routes).not.toContain('/test-guitar-popup')
    expect(mockedRoutes.routes).not.toContain('/test-abc-notation')
    expect(mockedRoutes.routes).not.toContain('/test-iphone-player')
    expect(mockedRoutes.routes).not.toContain('/test-games-m2')
  })

  it('exposes debug routes in dev', async () => {
    vi.stubEnv('DEV', true)

    const { default: App } = await import('./App')
    render(<App />)

    expect(mockedRoutes.routes).toContain('/test-ui')
    expect(mockedRoutes.routes).toContain('/test-fretboard')
    expect(mockedRoutes.routes).toContain('/test-guitar-popup')
    expect(mockedRoutes.routes).toContain('/test-abc-notation')
    expect(mockedRoutes.routes).toContain('/test-iphone-player')
    expect(mockedRoutes.routes).toContain('/test-games-m2')
  })
})
