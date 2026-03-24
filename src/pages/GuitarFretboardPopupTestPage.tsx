/**
 * GuitarFretboardPopupTestPage - Debug page for popup guitar click detection
 *
 * Shows detailed logging of:
 * - Which fret and string was clicked
 * - What sounding note is at that position
 * - What written note it translates to
 * - What notes are currently highlighted on the fretboard
 */

import React, { useState, useCallback, useRef, Suspense } from 'react'
import { useSettingsStore } from '../stores/useSettingsStore'
import {
  getNoteAtPosition,
  transposeGuitarToWritten,
  transposeWrittenToGuitar,
  getPositionsForNote,
  GUITAR_TUNING,
} from '../utils/guitar-logic'

import { LazyFretboardWrapper } from '../components/LazyWrappers'

interface ClickLog {
  id: number
  time: string
  rawString: number // fretboard.js 1-indexed
  rawFret: number
  stringIndex: number // 0-indexed for guitar-logic
  soundingNote: string
  writtenNote: string
  action: 'click' | 'highlight'
}

interface HighlightedNote {
  note: string
  positions: Array<{ stringIndex: number; fret: number }>
}

const LoadingFallback = () => (
  <div className="w-full h-32 flex items-center justify-center text-slate-400 text-sm">
    Loading fretboard...
  </div>
)

export const GuitarFretboardPopupTestPage: React.FC = () => {
  const isDark = useSettingsStore((s) => s.theme === 'dark')
  const [clickLog, setClickLog] = useState<ClickLog[]>([])
  const [activeNotes, setActiveNotes] = useState<string[]>([])
  const [highlightedInfo, setHighlightedInfo] = useState<HighlightedNote[]>([])
  const logIdRef = useRef(0)

  // Update highlighted info when active notes change
  const updateHighlightedInfo = useCallback((notes: string[]) => {
    const info: HighlightedNote[] = notes.map((writtenNote) => {
      const soundingNote = transposeWrittenToGuitar(writtenNote)
      const positions = soundingNote ? getPositionsForNote(soundingNote) : []
      return {
        note: writtenNote,
        positions,
      }
    })
    setHighlightedInfo(info)
  }, [])

  // Handle click from FretboardWrapper
  const handleNoteClick = useCallback(
    (writtenNote: string) => {
      logIdRef.current += 1
      const now = new Date()
      const timeStr = `${now.toLocaleTimeString()}.${now.getMilliseconds().toString().padStart(3, '0')}`

      // Convert written note back to sounding to understand the position
      const soundingNote = transposeWrittenToGuitar(writtenNote) || 'Unknown'

      // Find positions for this note
      const positions = getPositionsForNote(soundingNote)
      const firstPos = positions[0]

      const logEntry: ClickLog = {
        id: logIdRef.current,
        time: timeStr,
        rawString: firstPos ? firstPos.stringIndex + 1 : 0, // Convert to 1-indexed
        rawFret: firstPos?.fret || 0,
        stringIndex: firstPos?.stringIndex || 0,
        soundingNote,
        writtenNote,
        action: 'click',
      }

      console.log('🎸 POPUP GUITAR CLICK:', logEntry)
      setClickLog((prev) => [logEntry, ...prev.slice(0, 49)])

      // Add to active notes and update highlighted info
      setActiveNotes((prev) => {
        const newNotes = prev.includes(writtenNote) ? prev : [...prev, writtenNote]
        // Update highlighted info
        updateHighlightedInfo(newNotes)
        return newNotes
      })
    },
    [updateHighlightedInfo]
  )

  // Clear all
  const handleClear = useCallback(() => {
    setClickLog([])
    setActiveNotes([])
    setHighlightedInfo([])
  }, [])

  // Remove specific note
  const handleRemoveNote = useCallback((noteToRemove: string) => {
    setActiveNotes((prev) => {
      const newNotes = prev.filter((n) => n !== noteToRemove)
      updateHighlightedInfo(newNotes)
      return newNotes
    })
  }, [updateHighlightedInfo])

  // Manual test click positions
  const testPositions = [
    { string: 1, fret: 0, expected: 'E4 → E5' },
    { string: 1, fret: 4, expected: 'G#4 → G#5' },
    { string: 3, fret: 0, expected: 'G3 → G4' },
    { string: 3, fret: 4, expected: 'B3 → B4' },
    { string: 6, fret: 0, expected: 'E2 → E3' },
  ]

  // Manually trigger a position to verify mapping
  const handleTestPosition = useCallback((stringIndex: number, fret: number) => {
    const soundingNote = getNoteAtPosition(stringIndex, fret)
    const writtenNote = transposeGuitarToWritten(soundingNote) || 'Unknown'

    console.log(`🧪 TEST: String ${stringIndex + 1}, Fret ${fret}`)
    console.log(`   Sounding: ${soundingNote}, Written: ${writtenNote}`)

    if (writtenNote !== 'Unknown') {
      handleNoteClick(writtenNote)
    }
  }, [handleNoteClick])

  return (
    <div className={`min-h-screen p-4 ${isDark ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🎸 Popup Guitar Debug Test</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              Click on fretboard → See position & note logging
            </p>
          </div>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Guitar Tuning Reference */}
        <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <h2 className="text-lg font-semibold mb-2">String Reference (fretboard.js 1-indexed)</h2>
          <div className="flex gap-4 text-sm">
            {GUITAR_TUNING.map((note, idx) => (
              <div key={idx} className="text-center">
                <div className="font-bold">String {idx + 1}</div>
                <div className={isDark ? 'text-cyan-400' : 'text-cyan-600'}>{note}</div>
                <div className={isDark ? 'text-slate-400' : 'text-gray-500'}>
                  {idx === 0 ? '(High E)' : idx === 5 ? '(Low E)' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fretboard with Popup-like styling */}
        <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <h2 className="text-lg font-semibold mb-2">FretboardWrapper (same as popup)</h2>
          <div className="border-2 border-teal-500 rounded-lg p-3">
            <Suspense fallback={<LoadingFallback />}>
              <LazyFretboardWrapper
                activeNotes={activeNotes}
                onNoteClick={handleNoteClick}
                compact={true}
                showLabels={true}
              />
            </Suspense>
          </div>
          <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            ^ Exact same component used in floating guitar panel
          </p>
        </div>

        {/* Test Buttons */}
        <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <h2 className="text-lg font-semibold mb-3">📍 Quick Test Positions</h2>
          <div className="flex flex-wrap gap-2">
            {testPositions.map(({ string, fret, expected }) => (
              <button
                key={`${string}-${fret}`}
                onClick={() => handleTestPosition(string - 1, fret)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDark
                    ? 'bg-slate-700 hover:bg-slate-600'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                S{string} F{fret} → {expected}
              </button>
            ))}
          </div>
        </div>

        {/* Active Notes */}
        <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <h2 className="text-lg font-semibold mb-3">🎯 Active Notes (Highlighted)</h2>
          {activeNotes.length === 0 ? (
            <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>No notes active. Click the fretboard!</p>
          ) : (
            <div className="space-y-2">
              {highlightedInfo.map(({ note, positions }) => (
                <div
                  key={note}
                  className={`p-3 rounded-lg flex items-start justify-between ${
                    isDark ? 'bg-slate-700' : 'bg-gray-100'
                  }`}
                >
                  <div>
                    <span className="font-bold text-cyan-500">{note}</span>
                    <span className="ml-2 text-sm">
                      (Sounding: {transposeWrittenToGuitar(note) || 'N/A'})
                    </span>
                    <div className="text-sm mt-1">
                      Positions:{' '}
                      {positions.map((p, i) => (
                        <span key={i} className={isDark ? 'text-slate-300' : 'text-gray-700'}>
                          S{p.stringIndex + 1}F{p.fret}
                          {i < positions.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveNote(note)}
                    className="text-red-400 hover:text-red-300 text-xl"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Click Log */}
        <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <h2 className="text-lg font-semibold mb-3">📋 Click Log (newest first)</h2>
          {clickLog.length === 0 ? (
            <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>No clicks yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={isDark ? 'text-slate-400 border-b border-slate-600' : 'text-gray-500 border-b border-gray-300'}>
                    <th className="text-left p-2">#</th>
                    <th className="text-left p-2">Time</th>
                    <th className="text-left p-2">String (1-idx)</th>
                    <th className="text-left p-2">Fret</th>
                    <th className="text-left p-2">Sounding Note</th>
                    <th className="text-left p-2">Written Note</th>
                  </tr>
                </thead>
                <tbody>
                  {clickLog.map((log) => (
                    <tr
                      key={log.id}
                      className={isDark ? 'border-b border-slate-700' : 'border-b border-gray-200'}
                    >
                      <td className="p-2">{log.id}</td>
                      <td className="p-2 font-mono text-xs">{log.time}</td>
                      <td className="p-2 font-bold">{log.rawString}</td>
                      <td className="p-2 font-bold">{log.rawFret}</td>
                      <td className="p-2 text-orange-400">{log.soundingNote}</td>
                      <td className="p-2 text-cyan-400 font-bold">{log.writtenNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Position Map Grid */}
        <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <h2 className="text-lg font-semibold mb-3">🗺️ Click Map (Expected Notes)</h2>
          <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            Click a cell to test that position. Shows Sounding → Written notes.
          </p>
          <div className="overflow-x-auto">
            <table className="text-xs">
              <thead>
                <tr>
                  <th className="p-1 text-center">String</th>
                  {Array.from({ length: 8 }, (_, i) => (
                    <th key={i} className={`p-1 text-center ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                      F{i}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GUITAR_TUNING.map((_, stringIdx) => (
                  <tr key={stringIdx}>
                    <td className="p-1 font-bold text-center">S{stringIdx + 1}</td>
                    {Array.from({ length: 8 }, (_, fret) => {
                      const soundingNote = getNoteAtPosition(stringIdx, fret)
                      const writtenNote = transposeGuitarToWritten(soundingNote)
                      const isActive = activeNotes.includes(writtenNote || '')
                      return (
                        <td
                          key={fret}
                          onClick={() => handleTestPosition(stringIdx, fret)}
                          className={`p-1 text-center cursor-pointer rounded transition-colors ${
                            isActive
                              ? 'bg-cyan-500 text-white font-bold'
                              : isDark
                                ? 'bg-slate-700 hover:bg-slate-600'
                                : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <div className="text-[10px]">{soundingNote}</div>
                          <div className="text-[8px] opacity-70">→{writtenNote}</div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuitarFretboardPopupTestPage
