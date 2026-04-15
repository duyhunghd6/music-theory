import React from 'react'
import { useGameStore } from '../stores/useGameStore'
import { FeedbackOverlay, GameOverlay } from '../features/game'
import { ConfettiExplosion } from '../components/ui/ConfettiExplosion'
import { AppLayout } from '../components/layout/AppLayout'
import { MainHeader } from '../components/layout/MainHeader'
import { CollapsiblePanel } from '../components/ui/CollapsiblePanel'
import { requestPersistentStorage, getStorageEstimate } from '../services/storage-manager'
import { LazyModuleContent } from '../components/LazyWrappers'

const AbcGrandStaff = React.lazy(() => import('../components/MusicStaff/AbcGrandStaff'))
const HorizontalSaoTrucVisualizer = React.lazy(
  () => import('../features/sao-truc/components/HorizontalSaoTrucVisualizer')
)
const StaffRangeVisualTest = React.lazy(
  () => import('../components/MusicStaff/StaffRangeVisualTest')
)

export const HomePage: React.FC = () => {
  const isPlaying = useGameStore((state) => state.isPlaying)
  const streak = useGameStore((state) => state.streak)

  const [showConfetti, setShowConfetti] = React.useState(false)
  const [showNoteNames, setShowNoteNames] = React.useState(false)
  const [transposeSemitones, setTransposeSemitones] = React.useState(0)

  React.useEffect(() => {
    const initStorage = async () => {
      await requestPersistentStorage()
      if (import.meta.env.DEV) {
        const stats = await getStorageEstimate()
        if (stats) {
          console.log(
            `Storage: ${(stats.usage / 1024 / 1024).toFixed(2)} / ${(stats.quota / 1024 / 1024).toFixed(2)} MB`
          )
        }
      }
    }
    initStorage()
  }, [])

  React.useEffect(() => {
    if (isPlaying && streak > 0 && streak % 10 === 0) {
      setShowConfetti(true)
    }
  }, [streak, isPlaying])

  return (
    <AppLayout>
      <MainHeader />

      <GameOverlay />
      <FeedbackOverlay />
      <ConfettiExplosion run={showConfetti} onComplete={() => setShowConfetti(false)} />

      <div className="flex-1 py-4 md:p-4 space-y-3">
        {/* Music Staff */}
        <CollapsiblePanel
          title="Grand Staff View"
          icon="music_note"
          defaultOpen
          headerExtra={
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <label className="flex items-center gap-1 cursor-pointer hover:text-slate-200">
                <input
                  type="checkbox"
                  checked={showNoteNames}
                  onChange={(e) => setShowNoteNames(e.target.checked)}
                  className="w-3 h-3 accent-[#30e8e8]"
                />
                <span>Notes</span>
              </label>
              <label className="flex items-center gap-1 hover:text-slate-200">
                <span>Transpose</span>
                <input
                  type="number"
                  min={-12}
                  max={12}
                  step={1}
                  value={transposeSemitones}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value, 10)
                    setTransposeSemitones(Number.isNaN(value) ? 0 : Math.max(-12, Math.min(12, value)))
                  }}
                  className="w-14 rounded border border-slate-300 bg-white px-1 py-0.5 text-right text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </label>
            </div>
          }
        >
          <React.Suspense
            fallback={
              <div className="w-full h-[150px] flex items-center justify-center text-slate-400">
                Loading staff...
              </div>
            }
          >
            <AbcGrandStaff
              showNoteNames={showNoteNames}
              transposeSemitones={transposeSemitones}
            />
          </React.Suspense>
        </CollapsiblePanel>

        {/* Flute */}
        <CollapsiblePanel title="Flute" icon="graphic_eq" defaultOpen>
          <React.Suspense
            fallback={
              <div className="w-full h-16 flex items-center justify-center text-slate-400">
                Loading...
              </div>
            }
          >
            <HorizontalSaoTrucVisualizer />
          </React.Suspense>
        </CollapsiblePanel>

        {/* Module-specific content (Topics, Theory Panel) */}
        <React.Suspense
          fallback={
            <div className="w-full h-32 flex items-center justify-center text-slate-400">
              Loading module content...
            </div>
          }
        >
          <LazyModuleContent />
        </React.Suspense>

        {/* Staff Range Test - Piano & Guitar */}
        <CollapsiblePanel title="Staff Range Test (ABC)" icon="music_note" defaultOpen={false}>
          <React.Suspense
            fallback={
              <div className="w-full h-32 flex items-center justify-center text-slate-400">
                Loading staff range test...
              </div>
            }
          >
            <StaffRangeVisualTest />
          </React.Suspense>
        </CollapsiblePanel>
      </div>
    </AppLayout>
  )
}

export default HomePage
