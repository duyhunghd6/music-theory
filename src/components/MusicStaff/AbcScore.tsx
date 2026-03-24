import React, { useEffect, useRef, useState, useMemo } from 'react'
import abcjs from 'abcjs'
import type { NoteTimingEvent } from 'abcjs'
import 'abcjs/abcjs-audio.css'

/**
 * Cursor control for abcjs playback
 */
class CursorControl {
  private cursor: SVGLineElement | null = null
  private rootSelector: string

  constructor(rootSelector: string) {
    this.rootSelector = rootSelector
  }

  onStart() {
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
    if (ev.measureStart && ev.left === null) return

    // Remove previous highlights
    const lastSelection = document.querySelectorAll(this.rootSelector + ' .abcjs-highlight')
    lastSelection.forEach((el) => el.classList.remove('abcjs-highlight'))

    // Highlight current notes
    ev.elements?.forEach((noteGroup: HTMLElement[]) => {
      noteGroup.forEach((note: HTMLElement) => {
        note.classList.add('abcjs-highlight')
      })
    })

    // Move cursor
    if (this.cursor && ev.left != null && ev.top != null && ev.height != null) {
      this.cursor.setAttribute('x1', String(ev.left - 2))
      this.cursor.setAttribute('x2', String(ev.left - 2))
      this.cursor.setAttribute('y1', String(ev.top))
      this.cursor.setAttribute('y2', String(ev.top + ev.height))
    }
  }

  onFinished() {
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

interface AbcScoreProps {
  notation: string
  darkMode?: boolean
  className?: string
  showControls?: boolean
}

/**
 * AbcScore - Renders ABC notation using abcjs with optional audio playback
 */
export const AbcScore: React.FC<AbcScoreProps> = ({
  notation,
  darkMode = false,
  className = '',
  showControls = true,
}) => {
  // Generate stable ID for this instance
  const [instanceId] = useState(() => `abc-${Math.random().toString(36).slice(2, 9)}`)

  // Refs for abcjs objects (only accessed in effects)
  const synthRef = useRef<InstanceType<typeof abcjs.synth.CreateSynth> | null>(null)
  const synthControlRef = useRef<InstanceType<typeof abcjs.synth.SynthController> | null>(null)
  const cursorControlRef = useRef<CursorControl | null>(null)
  const controllerLoaded = useRef(false)

  // Computed IDs
  const paperId = useMemo(() => `paper-${instanceId}`, [instanceId])
  const audioId = useMemo(() => `audio-${instanceId}`, [instanceId])

  // Initialize synth objects
  useEffect(() => {
    synthRef.current = new abcjs.synth.CreateSynth()
    synthControlRef.current = new abcjs.synth.SynthController()
    cursorControlRef.current = new CursorControl(`#${paperId}`)

    return () => {
      synthRef.current = null
      synthControlRef.current = null
      cursorControlRef.current = null
    }
  }, [paperId])

  // Load synth controller UI
  useEffect(() => {
    if (!showControls || !synthControlRef.current || controllerLoaded.current) return

    synthControlRef.current.load(
      `#${audioId}`,
      // TODO: Implement cursor control after fixing abcjs type definitions
      null,
      {
        displayLoop: true,
        displayRestart: true,
        displayPlay: true,
        displayProgress: true,
        displayWarp: true,
      }
    )
    controllerLoaded.current = true
  }, [audioId, showControls])

  // Render notation and setup audio
  useEffect(() => {
    if (!notation.trim()) return

    try {
      const visualObj = abcjs.renderAbc(paperId, notation, {
        responsive: 'resize',
        add_classes: true,
      })

      if (showControls && visualObj[0] && synthRef.current && synthControlRef.current) {
        synthRef.current
          .init({ visualObj: visualObj[0] })
          .then(() => {
            synthControlRef.current
              ?.setTune(visualObj[0], false, { chordsOff: false })
              .then(() => console.log('AbcScore: Audio loaded'))
              .catch((err: unknown) => console.warn('AbcScore: setTune error:', err))
          })
          .catch((err: unknown) => console.warn('AbcScore: Synth init error:', err))
      }
    } catch (error) {
      console.warn('AbcScore: Render error:', error)
    }
  }, [notation, showControls, paperId])

  return (
    <div className={`abc-score ${className}`}>
      <div
        id={paperId}
        className={`abc-paper border rounded-lg min-h-[100px] ${
          darkMode ? 'bg-white border-gray-600' : 'bg-white border-gray-300'
        }`}
      />
      {showControls && <div id={audioId} className="abc-audio mt-2" />}
      <style>{`
        .abc-score .abcjs-cursor {
          stroke: #30e8e8;
          stroke-width: 2;
          opacity: 0.8;
        }
        .abc-score .abcjs-highlight {
          fill: #30e8e8 !important;
        }
      `}</style>
    </div>
  )
}

export default AbcScore
