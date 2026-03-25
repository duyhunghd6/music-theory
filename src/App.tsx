import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ProfilePage } from './pages/ProfilePage'
import { MainLayout } from './components/layout/MainLayout'
import { useSettingsStore } from './stores/useSettingsStore'
import { useProgressStore } from './stores/useProgressStore'
import { useBugReportStore } from './stores/useBugReportStore'
import { useEffect, lazy, Suspense } from 'react'

// Lazy load pages for better performance
const SubmodulePage = lazy(() => import('./pages/SubmodulePage'))
const PracticePage = lazy(() => import('./pages/PracticePage'))
const ComposePage = lazy(() => import('./pages/ComposePage'))
const AbcEditorPage = lazy(() => import('./pages/AbcEditorPage'))
const TestUIPage = lazy(() => import('./pages/TestUIPage'))
const FretboardTestPage = lazy(() => import('./pages/FretboardTestPage'))
const GuitarFretboardPopupTestPage = lazy(() => import('./pages/GuitarFretboardPopupTestPage'))
const TestAbcNotationPage = lazy(() => import('./pages/TestAbcNotationPage'))

const IPhonePlayerTestPage = lazy(() => import('./pages/IPhonePlayerTestPage'))
const Module2GameTestPage = lazy(() => import('./pages/Module2GameTestPage'))

const isDebugRouteEnabled = import.meta.env.DEV

// Profile page is now eagerly loaded as home page

// Lazy load floating instruments container
const FloatingInstrumentsContainer = lazy(
  () => import('./components/ui/FloatingInstrumentsContainer')
)

// Bug report modal (button is in FloatingInstrumentsToolbar)
const BugReportModal = lazy(() => import('./components/ui/BugReportModal'))

function App() {
  const theme = useSettingsStore((state) => state.theme)
  const updateStreak = useProgressStore((state) => state.updateStreak)
  const initFromCloud = useProgressStore((state) => state.initFromCloud)
  const initializeBugReporter = useBugReportStore((state) => state.initializeInterceptors)

  // Initialize bug reporter on app load
  useEffect(() => {
    initializeBugReporter()
  }, [initializeBugReporter])

  // Update streak on app load
  useEffect(() => {
    updateStreak()
  }, [updateStreak])

  // Initialize cloud sync on app load
  useEffect(() => {
    initFromCloud().catch((error) => {
      console.warn('[App] Failed to sync from cloud:', error)
    })
  }, [initFromCloud])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  // Listen for system theme changes if we are in 'system' mode
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(mediaQuery.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  return (
    <BrowserRouter>
      <MainLayout>
        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-pulse text-slate-400">Loading...</div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<ProfilePage />} />
            <Route path="/compose" element={<HomePage />} />
            <Route path="/module/:moduleId/:submoduleId" element={<SubmodulePage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/demo" element={<ComposePage />} />
            <Route path="/abc-editor" element={<AbcEditorPage />} />
            {isDebugRouteEnabled && <Route path="/test-ui" element={<TestUIPage />} />}
            {isDebugRouteEnabled && <Route path="/test-fretboard" element={<FretboardTestPage />} />}
            {isDebugRouteEnabled && (
              <Route path="/test-guitar-popup" element={<GuitarFretboardPopupTestPage />} />
            )}
            {isDebugRouteEnabled && <Route path="/test-abc-notation" element={<TestAbcNotationPage />} />}
            {isDebugRouteEnabled && <Route path="/test-iphone-player" element={<IPhonePlayerTestPage />} />}
            {isDebugRouteEnabled && <Route path="/test-games-m2" element={<Module2GameTestPage />} />}
          </Routes>
        </Suspense>
      </MainLayout>

      {/* Floating instruments, XP & Bug Report - always available on all pages */}
      <Suspense fallback={null}>
        <FloatingInstrumentsContainer />
      </Suspense>

      {/* Bug Report Modal */}
      <Suspense fallback={null}>
        <BugReportModal />
      </Suspense>
    </BrowserRouter>
  )
}

export default App
