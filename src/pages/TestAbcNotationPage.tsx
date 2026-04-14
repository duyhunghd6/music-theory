import { useEffect, useRef, useState } from 'react'
import abcjs from 'abcjs'

/**
 * Test page for ABC Notation line breaking
 * URL: /test-abc-notation
 *
 * This page tests different configurations for rendering ABC notation
 * with proper line breaks (4 measures per line)
 */

// Raga Bupali ABC notation - hardcoded for testing
const RAGA_BUPALI_ABC = `%abc-2.1
X:1
T:Raga Bupali
C:Traditional Indian Classical
R:Raga
M:4/4
L:1/4
Q:1/4=150
K:C
%%MIDI program 1
%
%%text Part 1: Asthai
P:A
|: c c A G | E D C D | E z G E | A G E z :|
w: Sa^ Sa^ Dha Pa | Ga Re Sa Re | Ga * Pa Ga | Dha Pa Ga * |
|: E G A c | d c A G | c G A G | E D C z :|
w: Ga Pa Dha Sa^ | Re^ Sa^ Dha Pa | Sa^ Pa Dha Pa | Ga Re Sa * |
|: c c A G | E D C D | E z G E | A G E z :|
w: Sa^ Sa^ Dha Pa | Ga Re Sa Re | Ga * Pa Ga | Dha Pa Ga * |
%
%%text Part 2: Antara
P:B
|: E E G A | G c z c | A A c d | e d c A :|
w: Ga Ga Pa Dha | Pa Sa^ * Sa^ | Dha Dha Sa^ Re^ | Ga^ Re^ Sa^ Dha |
|: E E D C | d d c A | c c A G | E D C z :|
w: Ga Ga Re Sa | Re^ Re^ Sa^ Dha | Sa^ Sa^ Dha Pa | Ga Re Sa * |
%
%%text Part 3: Asthai (Repeat)
P:A
|: c c A G | E D C D | E z G E | A G E z :|
w: Sa^ Sa^ Dha Pa | Ga Re Sa Re | Ga * Pa Ga | Dha Pa Ga * |
|: E G A c | d c A G | c G A G | E D C z :|
w: Ga Pa Dha Sa^ | Re^ Sa^ Dha Pa | Sa^ Pa Dha Pa | Ga Re Sa * |
|: c c A G | E D C D | E z G E | A G E z :|
w: Sa^ Sa^ Dha Pa | Ga Re Sa Re | Ga * Pa Ga | Dha Pa Ga * |
%
%%text Part 4: Tihai
P:C
c c A G | E D C D |
w: Sa^ Sa^ Dha Pa | Ga Re Sa Re |
c c A G | E D C D |
w: Sa^ Sa^ Dha Pa | Ga Re Sa Re |
c c A G | E D C D | E z G z | E z A z | G z E z | D z C |]
w: Sa^ Sa^ Dha Pa | Ga Re Sa Re | Ga * Pa * | Ga * Dha * | Pa * Ga * | Re * Sa |`

export default function TestAbcNotationPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const noWrapContainerRef = useRef<HTMLDivElement>(null)
  const [staffWidth, setStaffWidth] = useState(800)
  const [measuresPerLine, setMeasuresPerLine] = useState(4)

  // Render with wrap option
  useEffect(() => {
    if (containerRef.current) {
      console.log('🎼 Rendering ABC with wrap option:', { staffWidth, measuresPerLine })
      abcjs.renderAbc(containerRef.current, RAGA_BUPALI_ABC, {
        responsive: 'resize',
        staffwidth: staffWidth,
        add_classes: true,
        wrap: {
          minSpacing: 1.5,
          maxSpacing: 2.5,
          preferredMeasuresPerLine: measuresPerLine,
        },
      })
    }
  }, [staffWidth, measuresPerLine])

  // Render without wrap option (for comparison)
  useEffect(() => {
    if (noWrapContainerRef.current) {
      console.log('🎼 Rendering ABC WITHOUT wrap option')
      abcjs.renderAbc(noWrapContainerRef.current, RAGA_BUPALI_ABC, {
        responsive: 'resize',
        staffwidth: staffWidth,
        add_classes: true,
        // No wrap option - should use line breaks from the ABC source
      })
    }
  }, [staffWidth])

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-6">
          ABC Notation Line Break Test
        </h1>

        {/* Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600 dark:text-slate-400">Staff Width:</label>
            <input
              type="range"
              min="400"
              max="1200"
              value={staffWidth}
              onChange={(e) => setStaffWidth(parseInt(e.target.value))}
              className="w-32"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300 w-12">{staffWidth}px</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600 dark:text-slate-400">Measures/Line:</label>
            <select
              value={measuresPerLine}
              onChange={(e) => setMeasuresPerLine(parseInt(e.target.value))}
              className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded px-2 py-1"
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={8}>8</option>
            </select>
          </div>
        </div>

        {/* With Wrap Option */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-3">
            ⚠️ WITH <code className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">wrap</code>{' '}
            option (overrides source line breaks)
          </h2>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 overflow-x-auto">
            <div ref={containerRef} />
          </div>
        </section>

        {/* Without Wrap Option - CORRECT */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-3">
            ✅ WITHOUT{' '}
            <code className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">wrap</code> option
            (respects ABC source line breaks)
          </h2>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 overflow-x-auto">
            <div ref={noWrapContainerRef} />
          </div>
        </section>

        {/* ABC Source */}
        <section>
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-3">
            📝 ABC Source Code
          </h2>
          <pre className="bg-slate-800 text-slate-200 p-4 rounded-lg text-sm overflow-x-auto">
            {RAGA_BUPALI_ABC}
          </pre>
        </section>

        {/* Styling for dark mode SVG */}
        <style>{`
          :root.dark .bg-white svg path,
          :root.dark .bg-white svg line,
          :root.dark .bg-white svg text {
            fill: #cbd5e1 !important;
            stroke: #cbd5e1 !important;
          }
          :root.dark .bg-slate-800 svg path,
          :root.dark .bg-slate-800 svg line,
          :root.dark .bg-slate-800 svg text {
            fill: #cbd5e1 !important;
            stroke: #cbd5e1 !important;
          }
        `}</style>
      </div>
    </div>
  )
}
