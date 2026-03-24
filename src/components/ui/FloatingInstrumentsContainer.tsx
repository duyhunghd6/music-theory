import React, { Suspense, useCallback, useMemo } from 'react'
import { useFloatingInstrumentsStore } from '../../stores/useFloatingInstrumentsStore'
import { useAudioStore } from '../../stores/useAudioStore'
import { FloatingInstrumentPanel } from './FloatingInstrumentPanel'
import { FloatingInstrumentsToolbar } from './FloatingInstrumentsToolbar'
import { detectChordFromNotes } from '../../utils/chord-detection'
import { LazyFretboardWrapper } from '../LazyWrappers'

// Lazy load instrument components
const VirtualPiano = React.lazy(() => import('../VirtualPiano/VirtualPiano'))
const HorizontalSaoTrucVisualizer = React.lazy(
  () => import('../../features/sao-truc/components/HorizontalSaoTrucVisualizer')
)

const LoadingFallback = () => (
  <div className="w-full h-24 flex items-center justify-center text-slate-400 text-sm">
    Loading...
  </div>
)

/**
 * Guitar component with automatic chord detection
 * Detects if activeNotes form a chord and displays chord diagram
 */
const GuitarWithChordDetection: React.FC<{
  activeNotes: string[]
  onNoteClick: (note: string) => void
}> = ({ activeNotes, onNoteClick }) => {
  // Detect if notes form a chord
  const chordName = useMemo(() => {
    if (activeNotes.length >= 3) {
      return detectChordFromNotes(activeNotes)
    }
    return null
  }, [activeNotes])

  return (
    <LazyFretboardWrapper
      activeNotes={activeNotes}
      chordName={chordName || undefined}
      onNoteClick={onNoteClick}
      compact={true}
      showFingers={!!chordName}
      showLabels={!chordName}
    />
  )
}

/**
 * FloatingInstrumentsContainer - Renders floating instrument panels and toolbar
 * Should be placed at the app root level to be always available
 */
export const FloatingInstrumentsContainer: React.FC = () => {
  const { instruments } = useFloatingInstrumentsStore()
  const { activeNotes, startNote, stopNote, playNoteWithRelease } = useAudioStore()

  // Handler for Piano (uses start/stop)
  const handleStartNote = useCallback(
    (note: string) => {
      startNote(note)
    },
    [startNote]
  )

  const handleStopNote = useCallback(
    (note: string) => {
      stopNote(note)
    },
    [stopNote]
  )

  // Handler for Guitar (uses playNoteWithRelease for auto-stop audio)
  const handlePlayNote = useCallback(
    (note: string) => {
      playNoteWithRelease(note, '8n')
    },
    [playNoteWithRelease]
  )

  return (
    <>
      {/* Piano Panel - 3 octaves on all devices */}
      {instruments.piano.isVisible && (
        <FloatingInstrumentPanel type="piano" title="Piano" icon="piano">
          <Suspense fallback={<LoadingFallback />}>
            <VirtualPiano
              startOctave={3}
              octaves={3}
              activeNotes={activeNotes}
              onStartNote={handleStartNote}
              onStopNote={handleStopNote}
            />
          </Suspense>
        </FloatingInstrumentPanel>
      )}

      {/* Guitar Panel with Chord Detection */}
      {instruments.guitar.isVisible && (
        <FloatingInstrumentPanel type="guitar" title="Guitar" icon="music_note">
          <Suspense fallback={<LoadingFallback />}>
            <GuitarWithChordDetection activeNotes={activeNotes} onNoteClick={handlePlayNote} />
          </Suspense>
        </FloatingInstrumentPanel>
      )}

      {/* Flute Panel - uses internal stores, no props needed */}
      {instruments.flute.isVisible && (
        <FloatingInstrumentPanel type="flute" title="Sáo Trúc" icon="flute">
          <Suspense fallback={<LoadingFallback />}>
            <HorizontalSaoTrucVisualizer />
          </Suspense>
        </FloatingInstrumentPanel>
      )}

      {/* Toolbar */}
      <FloatingInstrumentsToolbar />
    </>
  )
}

export default FloatingInstrumentsContainer
