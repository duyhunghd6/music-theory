import React, { useEffect, useRef, useCallback, useMemo } from 'react'
import { Fretboard } from '@moonwave99/fretboard.js'
import { useSettingsStore } from '../../../../stores/useSettingsStore'
import { getChordVoicing, type ChordVoicing } from '../../../../data/chord-voicings'
import {
  transposeWrittenToGuitar,
  transposeGuitarToWritten,
  getPositionsForNote,
} from '../../../../utils/guitar-logic'

interface FretboardWrapperProps {
  activeNotes?: string[]
  chord?: string
  chordName?: string
  onNoteClick?: (note: string) => void
  compact?: boolean
  showLabels?: boolean
  showFingers?: boolean
  fretCount?: number
}

const getConfig = (compact: boolean, isDark: boolean) => ({
  width: 600,
  height: compact ? 127 : 173,
  fretCount: 7,
  showFretNumbers: true,
  fretNumbersMargin: 15,
  fretNumbersHeight: 20,
  scaleFrets: false,
  dotSize: compact ? 20 : 26,
  dotStrokeWidth: 2,
  dotTextSize: compact ? 11 : 13,
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
  rootFill: isDark ? '#ec4899' : '#db2777',
  font: 'Inter, system-ui, sans-serif',
  crop: false,
})

export const FretboardWrapper: React.FC<FretboardWrapperProps> = ({
  activeNotes = [],
  chord,
  chordName,
  onNoteClick,
  compact = false,
  showLabels = true,
  showFingers = true,
  fretCount,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const fretboardRef = useRef<Fretboard | null>(null)
  const theme = useSettingsStore((state) => state.theme)
  const isDark = theme === 'dark'

  const config = useMemo(() => {
    const baseConfig = getConfig(compact, isDark)
    if (fretCount) {
      baseConfig.fretCount = fretCount
    }
    return baseConfig
  }, [compact, isDark, fretCount])

  const positions = useMemo(() => {
    const positionList: Array<{ string: number; fret: number; note?: string }> = []

    activeNotes.forEach((writtenNote) => {
      const soundingNote = transposeWrittenToGuitar(writtenNote)
      if (soundingNote) {
        const notePositions = getPositionsForNote(soundingNote)
        notePositions.forEach((p) => {
          if (p.fret <= config.fretCount) {
            positionList.push({
              string: p.stringIndex + 1,
              fret: p.fret,
              note: soundingNote.replace(/[0-9]/g, ''),
            })
          }
        })
      }
    })

    return positionList
  }, [activeNotes, config.fretCount])

  const onNoteClickRef = useRef(onNoteClick)
  useEffect(() => {
    onNoteClickRef.current = onNoteClick
  }, [onNoteClick])

  const handleClick = useCallback((position: { string: number; fret: number }) => {
    const callback = onNoteClickRef.current
    if (!callback) return

    const stringIndex = position.string - 1
    const fret = position.fret

    import('../../../../utils/guitar-logic').then(({ getNoteAtPosition }) => {
      const soundingNote = getNoteAtPosition(stringIndex, fret)
      if (soundingNote) {
        const writtenNote = transposeGuitarToWritten(soundingNote)
        if (writtenNote) {
          callback(writtenNote)
        }
      }
    })
  }, [])

  const chordVoicing: ChordVoicing | undefined = useMemo(() => {
    if (chordName) {
      return getChordVoicing(chordName)
    }
    return undefined
  }, [chordName])

  useEffect(() => {
    if (!containerRef.current) return

    containerRef.current.innerHTML = ''

    const fretboard = new Fretboard({
      el: containerRef.current,
      ...config,
    })

    fretboardRef.current = fretboard

    if (chord || chordVoicing) {
      const voicingString = chord || chordVoicing?.voicing
      if (voicingString) {
        const barres = chordVoicing?.barres?.map((b) => ({
          fret: b.fret,
          stringFrom: b.stringFrom,
          stringTo: b.stringTo,
        }))

        fretboard.renderChord(voicingString, barres)

        if (showFingers && chordVoicing?.fingers) {
          fretboard.style({
            text: (position: { string: number; fret: number }) => {
              const fingerData = chordVoicing.fingers.find(
                (f) => f.string === position.string && f.fret === position.fret
              )
              return fingerData?.finger?.toString() || ''
            },
            fontSize: compact ? 10 : 14,
            fontFill: isDark ? '#0f172a' : '#ffffff',
          })
        }

        const mutedStrings: number[] = []
        voicingString.split('').forEach((char, index) => {
          if (char === 'x') {
            mutedStrings.push(6 - index)
          }
        })
        if (mutedStrings.length > 0) {
          fretboard.muteStrings({
            strings: mutedStrings,
            stroke: isDark ? '#f87171' : '#ef4444',
          })
        }
      }
    } else if (positions.length > 0) {
      fretboard.setDots(positions).render()

      if (showLabels) {
        fretboard.style({
          text: (position: { string: number; fret: number; note?: string }) => {
            const pos = positions.find(
              (p) => p.string === position.string && p.fret === position.fret
            )
            return pos?.note || ''
          },
          fontSize: compact ? 10 : 12,
          fontFill: isDark ? '#0f172a' : '#ffffff',
        })
      }
    } else {
      fretboard.render()
    }

    fretboard.on('click', (position: { string: number; fret: number; note?: string }) => {
      handleClick({ string: position.string, fret: position.fret })
    })

    const container = containerRef.current
    if (container) {
      const hoverDiv = container.querySelector('.hoverDiv') as HTMLDivElement | null
      if (hoverDiv) {
        hoverDiv.style.bottom = '0'
      }
    }

    return () => {
      if (fretboardRef.current) {
        fretboardRef.current.removeEventListeners()
      }
    }
  }, [
    config,
    chord,
    chordVoicing,
    positions,
    showLabels,
    showFingers,
    isDark,
    compact,
    handleClick,
  ])

  return (
    <div
      className="fretboard-wrapper relative"
      style={{
        width: '100%',
        touchAction: 'manipulation',
      }}
    >
      <div
        ref={containerRef}
        className={`
          fretboard-container
          rounded-lg
          ${isDark ? 'bg-slate-900' : 'bg-slate-50'}
          border ${isDark ? 'border-slate-700' : 'border-slate-200'}
        `}
        style={{
          minHeight: config.height,
          width: '100%',
        }}
      />

      {chordName && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: 0.4 }}
        >
          <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {chordName}
          </span>
        </div>
      )}
    </div>
  )
}

export default FretboardWrapper
