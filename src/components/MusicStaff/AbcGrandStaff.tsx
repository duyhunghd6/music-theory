import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react'
import abcjs from 'abcjs'
import type { CursorControl as AbcCursorControl, NoteTimingEvent } from 'abcjs'
import 'abcjs/abcjs-audio.css'
import { useAudioStore } from '../../stores/useAudioStore'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { getNoteLabel } from '../../utils/note-labels'

/**
 * Convert MIDI pitch number to standard note name (e.g., "C4")
 * MIDI: 60 = C4 (middle C)
 * Valid range: 21 (A0) to 108 (C8) for standard piano
 * Returns empty string for invalid pitches to prevent ghost notes
 */
const midiPitchToNoteName = (midiPitch: number): string => {
  // Filter out invalid pitches (must be positive and within reasonable range)
  // MIDI 12 = C0, MIDI 24 = C1, ... MIDI 60 = C4, MIDI 108 = C8
  if (midiPitch < 12 || midiPitch > 127) {
    console.warn('Invalid MIDI pitch:', midiPitch)
    return ''
  }

  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  // MIDI 0 = C-1, MIDI 12 = C0, MIDI 60 = C4
  const octave = Math.floor(midiPitch / 12) - 1
  const noteIndex = midiPitch % 12
  return `${noteNames[noteIndex]}${octave}`
}

/**
 * Cursor control for abcjs playback animation with instrument highlighting
 */
class CursorControl implements AbcCursorControl {
  private cursor: SVGLineElement | null = null
  private rootSelector: string
  private onNotePlay?: (notes: string[]) => void
  private onNoteStop?: (notes: string[]) => void
  private currentNotes: string[] = []
  private isPlaybackActive: boolean = false // Only highlight when playback is running

  constructor(
    rootSelector: string,
    onNotePlay?: (notes: string[]) => void,
    onNoteStop?: (notes: string[]) => void
  ) {
    this.rootSelector = rootSelector
    this.onNotePlay = onNotePlay
    this.onNoteStop = onNoteStop
  }

  onStart() {
    this.isPlaybackActive = true // Playback started
    const svg = document.querySelector(this.rootSelector + ' svg')
    if (!svg) return

    this.cursor = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    this.cursor.setAttribute('class', 'abcjs-cursor')
    this.cursor.setAttributeNS(null, 'x1', '0')
    this.cursor.setAttributeNS(null, 'y1', '0')
    this.cursor.setAttributeNS(null, 'x2', '0')
    this.cursor.setAttributeNS(null, 'y2', '0')
    svg.appendChild(this.cursor)
  }

  onEvent(ev: NoteTimingEvent) {
    // Skip if this is a measure start event without position
    if (ev.measureStart === true && ev.left === null) return

    // Stop previous notes
    if (this.currentNotes.length > 0 && this.onNoteStop) {
      this.onNoteStop(this.currentNotes)
      this.currentNotes = []
    }

    // Remove previous highlights
    const lastSelection = document.querySelectorAll(this.rootSelector + ' .abcjs-highlight')
    lastSelection.forEach((el) => el.classList.remove('abcjs-highlight'))

    // Highlight current notes on staff
    ev.elements?.forEach((noteGroup) => {
      noteGroup.forEach((note) => {
        note.classList.add('abcjs-highlight')
      })
    })

    // Only highlight instruments if playback is actually running
    // This prevents ghost notes during synth initialization
    if (this.isPlaybackActive && ev.midiPitches && ev.midiPitches.length > 0 && this.onNotePlay) {
      const notes = ev.midiPitches
        .map((p) => midiPitchToNoteName(p.pitch))
        .filter((note) => note !== '') // Filter out invalid pitches
      if (notes.length > 0) {
        this.currentNotes = notes
        this.onNotePlay(notes)
      }
    }

    // Move cursor
    if (this.cursor && ev.left != null && ev.top != null && ev.height != null) {
      this.cursor.setAttribute('x1', String(ev.left - 2))
      this.cursor.setAttribute('x2', String(ev.left - 2))
      this.cursor.setAttribute('y1', String(ev.top))
      this.cursor.setAttribute('y2', String(ev.top + ev.height))
    }
  }

  onFinished() {
    this.isPlaybackActive = false // Playback stopped

    // Stop any remaining notes
    if (this.currentNotes.length > 0 && this.onNoteStop) {
      this.onNoteStop(this.currentNotes)
      this.currentNotes = []
    }

    const lastSelection = document.querySelectorAll(this.rootSelector + ' .abcjs-highlight')
    lastSelection.forEach((el) => el.classList.remove('abcjs-highlight'))

    if (this.cursor) {
      this.cursor.setAttribute('x1', '0')
      this.cursor.setAttribute('x2', '0')
      this.cursor.setAttribute('y1', '0')
      this.cursor.setAttribute('y2', '0')
    }
  }
}

/**
 * Convert ABC note name to standard note format (e.g., "C4", "E5")
 * ABC notation:
 * - Uppercase C-B = octave 4 (middle C octave)
 * - C, D, E, etc. with commas = lower octaves (C, = C3, C,, = C2)
 * - Lowercase c-b = octave 5
 * - c' d' = octave 6, c'' = octave 7, etc.
 * - ^ = sharp, _ = flat
 */
const abcNoteToStandardNote = (abcName: string): string => {
  if (!abcName) return ''

  // Parse the ABC note name
  let letter = ''
  let accidental = ''
  let octave = 4 // default for uppercase

  let i = 0

  // Check for accidentals at start
  if (abcName[i] === '^') {
    accidental = '#'
    i++
    if (abcName[i] === '^') i++ // double sharp
  } else if (abcName[i] === '_') {
    accidental = 'b'
    i++
    if (abcName[i] === '_') i++ // double flat
  } else if (abcName[i] === '=') {
    i++ // natural, no accidental
  }

  // Get the note letter
  if (i < abcName.length) {
    letter = abcName[i].toUpperCase()
    // If lowercase, it's octave 5
    if (abcName[i] === abcName[i].toLowerCase() && abcName[i] !== abcName[i].toUpperCase()) {
      octave = 5
    }
    i++
  }

  // Count commas (lower octave) or apostrophes (higher octave)
  while (i < abcName.length) {
    if (abcName[i] === ',') {
      octave--
      i++
    } else if (abcName[i] === "'") {
      octave++
      i++
    } else {
      break
    }
  }

  if (!letter || !/[A-G]/.test(letter)) return ''

  return `${letter}${accidental}${octave}`
}

/**
 * Convert note format (e.g., "C4", "F#5") to ABC notation
 */
const noteToAbc = (
  note: string,
  showNoteNames: boolean = false,
  notationSystem: 'latin' | 'solfege' = 'latin'
): string => {
  const match = note.match(/^([A-G])([#b]?)(\d)$/)
  if (!match) return ''

  const [, letter, accidental, octaveStr] = match
  const octave = parseInt(octaveStr, 10)

  let abcAccidental = ''
  if (accidental === '#') abcAccidental = '^'
  else if (accidental === 'b') abcAccidental = '_'

  let abcNote = ''
  if (octave <= 3) {
    abcNote = letter
    const commas = 4 - octave
    abcNote += ','.repeat(commas)
  } else if (octave === 4) {
    abcNote = letter
  } else if (octave === 5) {
    abcNote = letter.toLowerCase()
  } else {
    abcNote = letter.toLowerCase()
    const apostrophes = octave - 5
    abcNote += "'".repeat(apostrophes)
  }

  // Add annotation for note name if enabled
  if (showNoteNames) {
    const latinName = letter + (accidental || '')
    const displayName = getNoteLabel(latinName, notationSystem)
    return `"^${displayName}"${abcAccidental}${abcNote}`
  }

  return abcAccidental + abcNote
}

interface AbcGrandStaffProps {
  showTwoStaves?: boolean
  showNoteNames?: boolean
  className?: string
  /** Override ABC notation for lesson-specific content */
  overrideAbc?: string
}

/**
 * AbcGrandStaff - Renders a Grand Staff using abcjs with audio playback and click interactivity
 * Displays 2 rows of grand staff, each row with 4 measures x 4 beats
 */
export const AbcGrandStaff: React.FC<AbcGrandStaffProps> = ({
  showTwoStaves = true,
  showNoteNames = false,
  className = '',
  overrideAbc,
}) => {
  // Generate stable ID for this instance
  const [instanceId] = useState(() => `abc-staff-${Math.random().toString(36).slice(2, 9)}`)

  const containerRef = useRef<HTMLDivElement>(null)
  const audioContainerRef = useRef<HTMLDivElement>(null)

  // Refs for abcjs synth objects
  const synthRef = useRef<InstanceType<typeof abcjs.synth.CreateSynth> | null>(null)
  const synthControlRef = useRef<InstanceType<typeof abcjs.synth.SynthController> | null>(null)
  const cursorControlRef = useRef<CursorControl | null>(null)

  // Use playNote/releaseNote for click preview (plays audio)
  const playNote = useAudioStore((state) => state.playNote)
  const releaseNote = useAudioStore((state) => state.releaseNote)
  // Use highlightNote/unhighlightNote for playback sync (no audio, just visual)
  const highlightNote = useAudioStore((state) => state.highlightNote)
  const unhighlightNote = useAudioStore((state) => state.unhighlightNote)
  const clearHighlights = useAudioStore((state) => state.clearHighlights)
  const recordedNotes = useAudioStore((state) => state.recordedNotes)
  const notationSystem = useSettingsStore((state) => state.notationSystem)
  const bpm = useSettingsStore((state) => state.bpm)

  const paperId = useMemo(() => `paper-${instanceId}`, [instanceId])
  const audioId = useMemo(() => `audio-${instanceId}`, [instanceId])

  // Only use recordedNotes for display - activeNotes is for highlighting instruments only
  // This prevents the staff from re-rendering when notes are played for preview
  const displayNotes = useMemo(() => {
    // Get last 32 recorded notes for 2 rows x 4 measures x 4 notes = 32 notes max
    return recordedNotes.slice(-32)
  }, [recordedNotes])

  /**
   * Inject note name annotations into ABC notation
   * Parses ABC and adds "^NoteName" annotations above each note when showNoteNames is true
   */
  const injectNoteAnnotations = useCallback(
    (abc: string): string => {
      if (!showNoteNames) return abc

      // Split into header and body (lines starting with letters vs music content)
      const lines = abc.split('\n')
      const processedLines = lines.map((line) => {
        // Skip header lines (X:, T:, M:, L:, Q:, K:, %%, V:, [V:]) AND lyrics lines (w:)
        if (/^[A-Z]:/.test(line) || /^%%/.test(line) || /^\[V:/.test(line) || /^w:/.test(line)) {
          return line
        }

        // Process music content - match ABC notes
        // ABC note pattern: optional accidental (^ _ =), note letter (A-Ga-g), optional octave modifiers (, ')
        return line.replace(
          /(\^{1,2}|_{1,2}|=)?([A-Ga-g])([,']*)/g,
          (match, accidental = '', letter) => {
            // Skip if it's a rest
            if (letter.toLowerCase() === 'z' || letter.toLowerCase() === 'x') {
              return match
            }

            // Convert ABC note to standard format for label lookup
            const upperLetter = letter.toUpperCase()
            let accidentalDisplay = ''
            if (accidental === '^') accidentalDisplay = '#'
            else if (accidental === '^^') accidentalDisplay = '##'
            else if (accidental === '_') accidentalDisplay = 'b'
            else if (accidental === '__') accidentalDisplay = 'bb'

            const latinName = upperLetter + accidentalDisplay
            const displayName = getNoteLabel(latinName, notationSystem)

            // Return with annotation prefix
            return `"^${displayName}"${match}`
          }
        )
      })

      return processedLines.join('\n')
    },
    [showNoteNames, notationSystem]
  )

  const generateAbc = useCallback(() => {
    // If overrideAbc is provided, process it for note annotations if needed
    if (overrideAbc) {
      return injectNoteAnnotations(overrideAbc)
    }

    // Helper to create synchronized grand staff measures
    // Each note position has treble and bass staves aligned
    const createSyncedMeasures = (notes: string[], count: number) => {
      const trebleParts: string[] = []
      const bassParts: string[] = []

      for (let i = 0; i < count; i++) {
        const note = notes[i]
        if (note) {
          const match = note.match(/^([A-G])([#b]?)(\d)$/)
          if (match) {
            const octave = parseInt(match[3], 10)
            const abc = noteToAbc(note, showNoteNames, notationSystem)
            if (octave >= 4) {
              trebleParts.push(abc)
              bassParts.push('z') // Rest in bass when treble has note
            } else {
              trebleParts.push('z') // Rest in treble when bass has note
              bassParts.push(abc)
            }
          } else {
            trebleParts.push('z')
            bassParts.push('z')
          }
        } else {
          trebleParts.push('z')
          bassParts.push('z')
        }

        // Add bar line after every 4 notes
        if ((i + 1) % 4 === 0 && i < count - 1) {
          trebleParts.push('|')
          bassParts.push('|')
        }
      }

      return {
        treble: trebleParts.join(' ') + ' |',
        bass: bassParts.join(' ') + ' |',
      }
    }

    // Generate sample notes for default display
    const generateSampleNotes = () => {
      // Sample notes to show when no notes have been recorded
      const sampleTreble = ['C4', 'E4', 'G4', 'B4', 'C5', 'E5', 'G5', 'B5']
      const sampleBass = ['D3', 'F3', 'A3', 'C4', 'D4', 'F4', 'A4', 'C5']

      // For two-stave display, alternate treble and bass
      if (showTwoStaves) {
        const trebleRow: string[] = []
        const bassRow: string[] = []

        for (let i = 0; i < 16; i++) {
          const noteIdx = i % 8
          if (i % 2 === 0) {
            // Treble note
            trebleRow.push(noteToAbc(sampleTreble[noteIdx], showNoteNames, notationSystem))
            bassRow.push('z')
          } else {
            // Bass note
            trebleRow.push('z')
            bassRow.push(noteToAbc(sampleBass[noteIdx], showNoteNames, notationSystem))
          }
          // Add bar line after every 4 notes
          if ((i + 1) % 4 === 0 && i < 15) {
            trebleRow.push('|')
            bassRow.push('|')
          }
        }

        return {
          treble: trebleRow.join(' ') + ' |',
          bass: bassRow.join(' ') + ' |',
        }
      }

      // Single staff - just show ascending notes
      const singleRow = [...sampleTreble, ...sampleBass.slice(0, 8)]
        .map((n) => noteToAbc(n, showNoteNames, notationSystem))
        .join(' ')
      return { single: singleRow }
    }

    if (displayNotes.length === 0) {
      const sample = generateSampleNotes()

      if (showTwoStaves) {
        // Default display: 2 rows with sample notes
        return `X:1
T:Grand Staff
M:4/4
L:1/4
Q:${bpm}
K:C clef=treble
%%staves {1 2}
V:1 clef=treble
V:2 clef=bass
[V:1] ${sample.treble}
[V:2] ${sample.bass}
[V:1] ${sample.treble}
[V:2] ${sample.bass}`
      }
      return `X:1
T:Grand Staff
M:4/4
L:1/4
Q:${bpm}
K:C
${'single' in sample ? sample.single : ''} |
${'single' in sample ? sample.single : ''} |`
    }

    if (showTwoStaves) {
      // Row 1: first 16 notes (4 measures x 4 notes)
      const row1Notes = displayNotes.slice(0, 16)
      const row1 = createSyncedMeasures(row1Notes, 16)

      // Row 2: next 16 notes
      const row2Notes = displayNotes.slice(16, 32)
      const row2 =
        row2Notes.length > 0
          ? createSyncedMeasures(row2Notes, 16)
          : {
              treble: 'z z z z | z z z z | z z z z | z z z z |',
              bass: 'z z z z | z z z z | z z z z | z z z z |',
            }

      return `X:1
T:Grand Staff
M:4/4
L:1/4
Q:${bpm}
K:C clef=treble
%%staves {1 2}
V:1 clef=treble
V:2 clef=bass
[V:1] ${row1.treble}
[V:2] ${row1.bass}
[V:1] ${row2.treble}
[V:2] ${row2.bass}`
    }

    const abcNotes = displayNotes
      .map((n: string) => noteToAbc(n, showNoteNames, notationSystem))
      .filter((n: string) => n.length > 0)
      .join(' ')

    return `X:1
T:Grand Staff
M:4/4
L:1/4
Q:120
K:C
${abcNotes} |`
  }, [
    displayNotes,
    showTwoStaves,
    showNoteNames,
    notationSystem,
    bpm,
    overrideAbc,
    injectNoteAnnotations,
  ])

  // Track controller loaded state
  const [isControllerReady, setControllerReady] = useState(false)

  // Callbacks for instrument highlighting during playback (no audio - abcjs plays audio)
  const handlePlaybackNotePlay = useCallback(
    (notes: string[]) => {
      notes.forEach((note) => highlightNote(note))
    },
    [highlightNote]
  )

  const handlePlaybackNoteStop = useCallback(
    (notes: string[]) => {
      notes.forEach((note) => unhighlightNote(note))
    },
    [unhighlightNote]
  )

  // Clear any stale highlights when component mounts
  // This prevents ghost notes from appearing on instruments
  useEffect(() => {
    clearHighlights()
  }, [clearHighlights])

  // Initialize synth objects and load controller UI
  useEffect(() => {
    // Create synth objects
    synthRef.current = new abcjs.synth.CreateSynth()
    synthControlRef.current = new abcjs.synth.SynthController()

    // Create cursor control with callbacks for instrument highlighting
    cursorControlRef.current = new CursorControl(
      `#${paperId}`,
      handlePlaybackNotePlay,
      handlePlaybackNoteStop
    )

    // Need a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (!synthControlRef.current || !cursorControlRef.current) return

      synthControlRef.current.load(`#${audioId}`, cursorControlRef.current, {
        displayLoop: true,
        displayRestart: true,
        displayPlay: true,
        displayProgress: true,
        displayWarp: true,
      })
      setControllerReady(true)
    }, 100)

    return () => {
      clearTimeout(timer)
      synthRef.current = null
      synthControlRef.current = null
      cursorControlRef.current = null
      setControllerReady(false)
    }
    // Note: handlePlaybackNotePlay/Stop are stable callbacks, so we don't need them as dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paperId, audioId])

  // Click listener for individual notes - uses playNote instead of startNote
  // This plays the note and highlights instruments but doesn't add to recordedNotes
  const handleNoteClick = useCallback(
    (abcelem: abcjs.AbcElem) => {
      if (abcelem.el_type === 'note' && abcelem.pitches && abcelem.pitches.length > 0) {
        // Play clicked note(s) without recording
        abcelem.pitches.forEach((pitch) => {
          // Use the ABC note name (e.g., "C", "c", "c'") and convert to standard format
          const noteName = abcNoteToStandardNote(pitch.name)
          console.log('Note clicked:', pitch.name, '->', noteName)
          if (noteName) {
            playNote(noteName)
            // Release note after 500ms
            setTimeout(() => releaseNote(noteName), 500)
          }
        })
      }
    },
    [playNote, releaseNote]
  )

  // Store the current visualObj for audio setup
  const visualObjRef = useRef<abcjs.TuneObject | null>(null)

  // Render notation
  useEffect(() => {
    if (!containerRef.current) return

    const abc = generateAbc()

    try {
      const rendered = abcjs.renderAbc(paperId, abc, {
        responsive: 'resize',
        add_classes: true,
        staffwidth: 1000,
        paddingtop: 5,
        paddingbottom: 5,
        paddingleft: 10,
        paddingright: 10,
        clickListener: handleNoteClick,
        // Note: Do NOT use wrap option - it overrides the ABC source line breaks
        // The ABC file already has proper line breaks (4 measures per line)
      })

      if (rendered[0]) {
        visualObjRef.current = rendered[0]
      }
    } catch (error) {
      console.warn('AbcGrandStaff: Render error:', error)
    }
  }, [generateAbc, paperId, handleNoteClick])

  // Setup audio after controller is loaded and notation is rendered
  useEffect(() => {
    if (!isControllerReady) return
    if (!visualObjRef.current) return
    if (!synthRef.current || !synthControlRef.current) return

    const setupAudio = async () => {
      try {
        await synthRef.current!.init({ visualObj: visualObjRef.current! })
        await synthControlRef.current!.setTune(visualObjRef.current!, false, {
          chordsOff: false,
        })
      } catch (err) {
        console.warn('AbcGrandStaff: Audio setup error:', err)
      }
    }

    setupAudio()
  }, [isControllerReady, generateAbc]) // Re-run when controller is ready or notation changes

  return (
    <div className={`abc-grand-staff ${className}`}>
      <div
        id={paperId}
        ref={containerRef}
        className="abc-paper bg-white dark:bg-slate-800/50 rounded-lg min-h-[280px] overflow-hidden cursor-pointer border border-slate-200 dark:border-transparent"
      />
      {/* Audio controls */}
      <div id={audioId} ref={audioContainerRef} className="abc-audio mt-2" />
      <style>{`
        .abc-grand-staff .abcjs-container svg {
          width: 100%;
          max-width: 100%;
        }
        /* Dark mode: set color on SVG so currentColor resolves to white */
        .dark .abc-grand-staff .abcjs-container svg {
          color: #ffffff;
        }
        /* Override all SVG paths in dark mode */
        .dark .abc-grand-staff svg path {
          fill: #ffffff !important;
          stroke: #ffffff !important;
        }
        /* Light mode note colors */
        .abc-grand-staff path.abcjs-notehead,
        .abc-grand-staff path.abcjs-stem,
        .abc-grand-staff path.abcjs-beam {
          fill: #334155;
          stroke: #334155;
        }
        .abc-grand-staff path.abcjs-staff,
        .abc-grand-staff path.abcjs-bar {
          stroke: #94a3b8;
        }
        .abc-grand-staff text {
          fill: #64748b;
        }
        .abc-grand-staff text.abcjs-annotation {
          fill: #0891b2;
          font-size: 10px;
          font-weight: normal !important;
        }
        /* Lyrics text styling - override abcjs default bold */
        .abc-grand-staff .abcjs-lyric text,
        .abc-grand-staff text.abcjs-lyric {
          font-weight: normal !important;
          font-size: 12px !important;
          fill: #334155 !important;
        }
        .abc-grand-staff .abcjs-note.abcjs-highlight path {
          fill: #0891b2 !important;
          stroke: #0891b2 !important;
        }
        .abc-grand-staff .abcjs-note:hover path {
          fill: #0891b2 !important;
          stroke: #0891b2 !important;
        }
        .abc-grand-staff text.abcjs-voice-name {
          display: none;
        }
        .abc-grand-staff .abcjs-cursor {
          stroke: #0891b2;
          stroke-width: 2;
          opacity: 0.8;
        }
        /* Light mode audio controls */
        .abc-grand-staff .abc-audio {
          background: transparent;
        }
        .abc-grand-staff .abcjs-inline-audio {
          background-color: #f1f5f9;
          border-radius: 12px;
          padding: 10px 16px;
          border: 1px solid #cbd5e1;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .abc-grand-staff .abcjs-inline-audio .abcjs-btn {
          background-color: #0891b2 !important;
          border: none !important;
          color: white !important;
          border-radius: 4px;
          width: 22px !important;
          height: 22px !important;
          min-width: 22px !important;
          min-height: 22px !important;
          max-width: 22px !important;
          max-height: 22px !important;
          padding: 2px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-sizing: border-box !important;
        }
        .abc-grand-staff .abcjs-inline-audio .abcjs-btn svg,
        .abc-grand-staff .abcjs-inline-audio .abcjs-btn path {
          fill: white !important;
          stroke: white !important;
        }
        .abc-grand-staff .abcjs-inline-audio .abcjs-btn svg {
          width: 10px !important;
          height: 10px !important;
        }
        .abc-grand-staff .abcjs-inline-audio .abcjs-btn:hover {
          background-color: #0e7490 !important;
        }
        .abc-grand-staff .abcjs-inline-audio .abcjs-midi-progress-background {
          background-color: #cbd5e1;
          border-radius: 4px;
          height: 8px !important;
          max-height: 8px !important;
          top: 0 !important;
          position: relative !important;
          border: none !important;
        }
        .abc-grand-staff .abcjs-inline-audio .abcjs-midi-progress-indicator {
          background-color: #0891b2;
          border-radius: 4px;
          height: 8px !important;
          max-height: 8px !important;
          top: 0 !important;
          position: absolute !important;
        }
        /* Progress bar container */
        .abc-grand-staff .abcjs-inline-audio .abcjs-midi-progress {
          height: 8px !important;
          max-height: 8px !important;
          min-height: 8px !important;
          position: relative !important;
          display: flex !important;
          align-items: center !important;
        }
        /* Ensure tempo/warp controls are visible */
        .abc-grand-staff .abcjs-inline-audio .abcjs-tempo-wrapper,
        .abc-grand-staff .abcjs-inline-audio .abcjs-css-warning {
          color: #334155 !important;
        }
        .abc-grand-staff .abcjs-inline-audio input[type="range"] {
          accent-color: #0891b2;
        }
        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .abc-grand-staff .abcjs-inline-audio {
            padding: 6px 10px;
            gap: 6px;
          }
          .abc-grand-staff .abcjs-inline-audio .abcjs-midi-progress-background,
          .abc-grand-staff .abcjs-inline-audio .abcjs-midi-progress-indicator,
          .abc-grand-staff .abcjs-inline-audio .abcjs-midi-progress {
            height: 6px !important;
            max-height: 6px !important;
            min-height: 6px !important;
          }
        }

        /* Dark mode overrides */
        .dark .abc-grand-staff path.abcjs-notehead,
        .dark .abc-grand-staff path.abcjs-stem,
        .dark .abc-grand-staff path.abcjs-beam {
          fill: #cbd5e1;
          stroke: #cbd5e1;
        }
        /* Staff lines - paths inside .abcjs-staff group */
        .dark .abc-grand-staff .abcjs-staff path {
          fill: #ffffff !important;
          stroke: #ffffff !important;
        }
        .dark .abc-grand-staff .abcjs-top-line {
          fill: #ffffff !important;
          stroke: #ffffff !important;
        }
        /* Bar lines */
        .dark .abc-grand-staff path.abcjs-bar {
          fill: #ffffff !important;
          stroke: #ffffff !important;
        }
        /* Clefs, braces, and other staff extras */
        .dark .abc-grand-staff .abcjs-staff-extra path,
        .dark .abc-grand-staff .abcjs-clef path,
        .dark .abc-grand-staff .abcjs-brace path {
          fill: #ffffff !important;
        }
        .dark .abc-grand-staff .abcjs-ledger {
          fill: #ffffff !important;
          stroke: #ffffff !important;
        }
        .dark .abc-grand-staff text {
          fill: #ffffff;
        }
        .dark .abc-grand-staff text.abcjs-annotation {
          fill: #30e8e8;
        }
        /* Dark mode lyrics styling */
        .dark .abc-grand-staff .abcjs-lyric text,
        .dark .abc-grand-staff text.abcjs-lyric {
          font-weight: normal !important;
          font-size: 12px !important;
          fill: #cbd5e1 !important;
        }
        .dark .abc-grand-staff .abcjs-note.abcjs-highlight path {
          fill: #30e8e8 !important;
          stroke: #30e8e8 !important;
        }
        .dark .abc-grand-staff .abcjs-note:hover path {
          fill: #30e8e8 !important;
          stroke: #30e8e8 !important;
        }
        .dark .abc-grand-staff .abcjs-cursor {
          stroke: #30e8e8;
        }
        .dark .abc-grand-staff .abcjs-inline-audio {
          background-color: rgba(30, 41, 59, 0.8);
          border: none;
        }
        .dark .abc-grand-staff .abcjs-inline-audio .abcjs-btn {
          background-color: #30e8e8;
          color: #0f172a;
        }
        .dark .abc-grand-staff .abcjs-inline-audio .abcjs-btn:hover {
          background-color: #22d3ee;
        }
        .dark .abc-grand-staff .abcjs-inline-audio .abcjs-midi-progress-background {
          background-color: #334155;
        }
        .dark .abc-grand-staff .abcjs-inline-audio .abcjs-midi-progress-indicator {
          background-color: #30e8e8;
        }
      `}</style>
    </div>
  )
}

export default AbcGrandStaff
