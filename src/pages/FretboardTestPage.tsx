/**
 * FretboardTestPage - Test page for verifying guitar fretboard position detection
 * Shows both the raw position (string, fret) and the detected note
 *
 * NEW: Click Map Visualization - color-coded grid showing all fret/string positions
 */

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Fretboard } from '@moonwave99/fretboard.js'
import { useSettingsStore } from '../stores/useSettingsStore'
import { getNoteAtPosition, transposeGuitarToWritten, GUITAR_TUNING } from '../utils/guitar-logic'
import { LazyFretboardWrapper } from '../components/LazyWrappers'

interface ClickInfo {
  time: string
  string: number
  fret: number
  soundingNote: string
  writtenNote: string
}

// Generate color for a cell based on position
const getCellColor = (stringIndex: number, fret: number): string => {
  // 78 total cells = 6 strings × 13 frets (0-12)
  const hue = ((stringIndex * 13 + fret) * (360 / 78)) % 360
  return `hsl(${hue}, 70%, 50%)`
}

// Click Map component - visual grid of all positions
const ClickMapGrid: React.FC<{
  onCellClick: (stringIndex: number, fret: number) => void
  lastClick: ClickInfo | null
}> = ({ onCellClick, lastClick }) => {
  const totalFrets = 13 // 0-12
  const cellWidth = 60
  const cellHeight = 35
  const labelWidth = 50

  return (
    <div className="overflow-x-auto">
      <div className="min-w-fit">
        {/* Fret number header */}
        <div className="flex" style={{ marginLeft: labelWidth }}>
          {Array.from({ length: totalFrets }).map((_, fret) => (
            <div
              key={`header-${fret}`}
              className="text-center text-xs font-bold text-slate-500 dark:text-slate-400"
              style={{ width: cellWidth }}
            >
              {fret === 0 ? 'Open' : `F${fret}`}
            </div>
          ))}
        </div>

        {/* String rows */}
        {GUITAR_TUNING.map((tuning, stringIndex) => (
          <div key={`row-${stringIndex}`} className="flex items-stretch">
            {/* String label */}
            <div
              className="flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700"
              style={{ width: labelWidth, minHeight: cellHeight }}
            >
              S{stringIndex + 1} ({tuning.replace(/[0-9]/g, '')})
            </div>

            {/* Fret cells */}
            {Array.from({ length: totalFrets }).map((_, fret) => {
              const note = getNoteAtPosition(stringIndex, fret) || '?'
              const writtenNote = note ? transposeGuitarToWritten(note) : '?'
              const bgColor = getCellColor(stringIndex, fret)
              const isActive = lastClick?.string === stringIndex + 1 && lastClick?.fret === fret

              return (
                <button
                  key={`cell-${stringIndex}-${fret}`}
                  onClick={() => onCellClick(stringIndex, fret)}
                  className={`
                    flex flex-col items-center justify-center
                    text-[10px] font-mono leading-tight
                    border border-white/20
                    transition-all duration-150
                    ${isActive ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-105 z-10' : ''}
                    hover:brightness-110 hover:scale-105
                  `}
                  style={{
                    width: cellWidth,
                    height: cellHeight,
                    backgroundColor: bgColor,
                    color: 'white',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  }}
                  title={`String ${stringIndex + 1}, Fret ${fret}: ${note} (sounding) / ${writtenNote} (written)`}
                >
                  <span className="font-bold">{note}</span>
                  <span className="opacity-70 text-[8px]">
                    S{stringIndex + 1}:F{fret}
                  </span>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export const FretboardTestPage: React.FC = () => {
  const [clickLog, setClickLog] = useState<ClickInfo[]>([])
  const [lastClick, setLastClick] = useState<ClickInfo | null>(null)
  const [showClickMap, setShowClickMap] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const fretboardRef = useRef<Fretboard | null>(null)

  const theme = useSettingsStore((state) => state.theme)
  const isDark = theme === 'dark'

  // Handle click on click map grid
  const handleClickMapClick = useCallback((stringIndex: number, fret: number) => {
    const soundingNote = getNoteAtPosition(stringIndex, fret) || 'Unknown'
    const writtenNote = soundingNote
      ? transposeGuitarToWritten(soundingNote) || soundingNote
      : 'Unknown'

    const clickInfo: ClickInfo = {
      time: new Date().toLocaleTimeString(),
      string: stringIndex + 1, // Convert to 1-indexed
      fret,
      soundingNote,
      writtenNote,
    }

    console.log('🎸 CLICK MAP:', { string: stringIndex + 1, fret, soundingNote, writtenNote })

    setLastClick(clickInfo)
    setClickLog((prev) => [clickInfo, ...prev.slice(0, 19)])
  }, [])

  const clearLog = useCallback(() => {
    setClickLog([])
    setLastClick(null)
  }, [])

  // Initialize fretboard with raw position logging
  useEffect(() => {
    if (!containerRef.current) return

    containerRef.current.innerHTML = ''

    const fretboard = new Fretboard({
      el: containerRef.current,
      width: 800,
      height: 200,
      fretCount: 12,
      showFretNumbers: true,
      fretNumbersMargin: 15,
      fretNumbersHeight: 20,
      scaleFrets: false,
      dotSize: 28,
      dotStrokeWidth: 2,
      dotTextSize: 14,
      nutWidth: 5,
      topPadding: 15,
      bottomPadding: 0,
      leftPadding: 15,
      rightPadding: 15,
      fretColor: isDark ? '#4b5563' : '#94a3b8',
      stringColor: isDark ? '#6b7280' : '#64748b',
      nutColor: isDark ? '#d1d5db' : '#374151',
      dotFill: isDark ? '#22d3ee' : '#06b6d4',
      dotStrokeColor: isDark ? '#155e75' : '#ffffff',
      font: 'Inter, system-ui, sans-serif',
      crop: false,
    })

    fretboardRef.current = fretboard
    fretboard.render()

    // Set up click handler with raw position logging
    fretboard.on('click', (position: { string: number; fret: number }) => {
      const rawString = position.string
      const rawFret = position.fret

      // fretboard.js uses 1-indexed strings (1 = high E)
      // Our guitar-logic uses 0-indexed (0 = high E)
      const stringIndex = rawString - 1
      const soundingNote = getNoteAtPosition(stringIndex, rawFret) || 'Unknown'
      const writtenNote = soundingNote
        ? transposeGuitarToWritten(soundingNote) || soundingNote
        : 'Unknown'

      const clickInfo: ClickInfo = {
        time: new Date().toLocaleTimeString(),
        string: rawString,
        fret: rawFret,
        soundingNote,
        writtenNote,
      }

      console.log('🎸 RAW POSITION:', { string: rawString, fret: rawFret })
      console.log('🎸 Converted:', { stringIndex, soundingNote, writtenNote })

      setLastClick(clickInfo)
      setClickLog((prev) => [clickInfo, ...prev.slice(0, 19)])
    })

    // Fix hoverDiv to cover all strings
    const hoverDiv = containerRef.current.querySelector('.hoverDiv') as HTMLDivElement | null
    if (hoverDiv) {
      hoverDiv.style.bottom = '0'
    }

    return () => {
      if (fretboardRef.current) {
        fretboardRef.current.removeEventListeners()
      }
    }
  }, [isDark])

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          🎸 Fretboard Position Test
        </h1>

        {/* Last clicked position display */}
        <div className="mb-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">
            Last Click Details
          </h2>
          {lastClick ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded">
                <div className="text-sm text-slate-500 dark:text-slate-400">String #</div>
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                  {lastClick.string}
                </div>
                <div className="text-xs text-slate-400">
                  ({GUITAR_TUNING[lastClick.string - 1]?.replace(/[0-9]/g, '') || '?'} string)
                </div>
              </div>
              <div className="p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded">
                <div className="text-sm text-slate-500 dark:text-slate-400">Fret #</div>
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                  {lastClick.fret}
                </div>
                <div className="text-xs text-slate-400">
                  {lastClick.fret === 0 ? '(open)' : `(fret ${lastClick.fret})`}
                </div>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded">
                <div className="text-sm text-slate-500 dark:text-slate-400">Sounding Note</div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {lastClick.soundingNote}
                </div>
                <div className="text-xs text-slate-400">(actual pitch)</div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded">
                <div className="text-sm text-slate-500 dark:text-slate-400">Written Note</div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {lastClick.writtenNote}
                </div>
                <div className="text-xs text-slate-400">(staff notation)</div>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">Click on the fretboard below to see position details</p>
          )}
        </div>

        {/* String reference */}
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <div className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
            String Reference (fretboard.js numbering):
          </div>
          <div className="flex gap-4 text-sm text-amber-700 dark:text-amber-300 flex-wrap">
            {GUITAR_TUNING.map((note, idx) => (
              <span key={idx}>
                <strong>String {idx + 1}</strong>: {note.replace(/[0-9]/g, '')}
                {idx === 0 && ' (high)'}
                {idx === 5 && ' (low)'}
              </span>
            ))}
          </div>
        </div>

        {/* Click Map Toggle */}
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={() => setShowClickMap(!showClickMap)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showClickMap
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            {showClickMap ? '🗺️ Hide Click Map' : '🗺️ Show Click Map'}
          </button>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Visual grid showing all clickable positions
          </span>
        </div>

        {/* Click Map Grid */}
        {showClickMap && (
          <div className="mb-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">
              🗺️ Click Map (Color-coded Positions)
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Each cell shows the note at that position. Click any cell to test position detection.
            </p>
            <ClickMapGrid onCellClick={handleClickMapClick} lastClick={lastClick} />
          </div>
        )}

        {/* Fretboard */}
        <div className="mb-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
            Guitar Fretboard (12 frets) - fretboard.js
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
            Click the fretboard to test the library's position detection.
          </p>
          <div
            ref={containerRef}
            className={`fretboard-container rounded-lg ${isDark ? 'bg-slate-900' : 'bg-slate-50'} border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
            style={{ minHeight: 200 }}
          />
        </div>

        {/* Popup Guitar Test Section */}
        <div className="mb-4 p-4 bg-gradient-to-r from-cyan-50 to-emerald-50 dark:from-slate-800 dark:to-slate-800 rounded-lg shadow border-2 border-cyan-300 dark:border-cyan-700">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
            <span className="text-cyan-500">📱</span>
            Popup Guitar Test (FretboardWrapper)
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
            This simulates the floating popup guitar. Click anywhere on the fretboard to test
            position detection. The same click map logic applies - positions update in "Last Click
            Details" above.
          </p>

          {/* Popup-style container */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-2 border border-cyan-200 dark:border-slate-600">
            <React.Suspense
              fallback={
                <div className="h-32 flex items-center justify-center text-slate-400">
                  Loading fretboard...
                </div>
              }
            >
              <LazyFretboardWrapper
                onNoteClick={(note: string) => {
                  const clickInfo: ClickInfo = {
                    time: new Date().toLocaleTimeString(),
                    string: 0,
                    fret: 0,
                    soundingNote: note,
                    writtenNote: note,
                  }
                  console.log('🎸 POPUP GUITAR:', { writtenNote: note })
                  setLastClick(clickInfo)
                  setClickLog((prev) => [clickInfo, ...prev.slice(0, 19)])
                }}
                compact={true}
                showLabels={true}
                fretCount={7}
              />
            </React.Suspense>
          </div>

          {/* Mini click map for popup guitar - same fret range */}
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
              🗺️ Popup Guitar Click Map (7 frets, compact view)
            </h3>
            <ClickMapGrid onCellClick={handleClickMapClick} lastClick={lastClick} />
            <p className="text-xs text-slate-400 mt-1">
              Note: Popup guitar uses fretboard.js which has 7 frets by default. Click map shows all
              13 for reference.
            </p>
          </div>
        </div>

        {/* Click log */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              Click Log ({clickLog.length} clicks)
            </h2>
            <button
              onClick={clearLog}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto font-mono text-xs">
            {clickLog.length === 0 ? (
              <p className="text-slate-400">No clicks yet</p>
            ) : (
              <table className="w-full">
                <thead className="text-left text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="p-1">Time</th>
                    <th className="p-1">String</th>
                    <th className="p-1">Fret</th>
                    <th className="p-1">Sounding</th>
                    <th className="p-1">Written</th>
                  </tr>
                </thead>
                <tbody>
                  {clickLog.map((log, i) => (
                    <tr
                      key={i}
                      className="text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700"
                    >
                      <td className="p-1">{log.time}</td>
                      <td className="p-1 font-bold">{log.string}</td>
                      <td className="p-1 font-bold">{log.fret}</td>
                      <td className="p-1">{log.soundingNote}</td>
                      <td className="p-1">{log.writtenNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FretboardTestPage
