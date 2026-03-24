import React, { useState } from 'react'
import { useDebounce } from 'use-debounce'
import Split from 'react-split'
import { LazyAbcEditor } from '../components/LazyWrappers'
import { AbcScore } from '../components/MusicStaff/AbcScore'
import { useNotationStore } from '../stores/useNotationStore'
import './AbcEditorPage.css'

// Sample ABC files
const SAMPLES = {
  twinkle: `X:1
T:Twinkle, Twinkle Little Star
M:4/4
L:1/4
Q:96
K:C
C C G G | A A G2 | F F E E | D D C2 |
G G F F | E E D2 | G G F F | E E D2 |
C C G G | A A G2 | F F E E | D D C2 |]`,

  cMajorScale: `X:1
T:C Major Scale
M:4/4
L:1/4
Q:100
K:C
C D E F | G A B c | c B A G | F E D C |]`,

  simpleChords: `X:1
T:Simple Chord Progression
M:4/4
L:1/4
Q:80
K:C
[CEG]4 | [FAC]4 | [GBD]4 | [CEG]4 |]`,

  pianoRange: `X:1
T:Piano Staff Range (C3-B5) - Chromatic
M:4/4
L:1/4
Q:120
K:C
C ^C D ^D | E F ^F G | ^G A ^A B | c ^c d ^d | e f ^f g | ^g a ^a b | c' ^c' d' ^d' | e' f' ^f' g' | ^g' a' ^a' b' |]`,

  guitarRange: `X:1
T:Guitar Staff Range (E2-E5) - Chromatic
M:4/4
L:1/4
Q:120
K:C
E, F, ^F, G, | ^G, A, ^A, B, | C ^C D ^D | E F ^F G | ^G A ^A B | c ^c d ^d | e f ^f g | ^g a ^a b | c' ^c' d' ^d' | e' |]`,
}

/**
 * AbcEditorPage - Split-pane ABC notation editor with live preview
 *
 * Features:
 * - Monaco editor on left for ABC input
 * - Live abcjs rendering on right
 * - Debounced preview updates
 * - Sample file loading
 * - Dark mode support
 */
export const AbcEditorPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false)
  const notation = useNotationStore((state) => state.getFullNotation())
  const setNotation = useNotationStore((state) => state.setNotation)
  const header = useNotationStore((state) => state.header)

  // Local text state for editor (includes full ABC with headers)
  const [text, setText] = useState(notation)
  const [debouncedText] = useDebounce(text, 100, { maxWait: 1000 })

  // Load a sample
  const handleLoadSample = (sampleName: keyof typeof SAMPLES) => {
    setText(SAMPLES[sampleName])
  }

  // Handle editor changes
  const handleEditorChange = (value: string) => {
    setText(value)
    // Parse and update store (simplified - just update notes portion)
    const lines = value.split('\n')
    const notesStart = lines.findIndex((line) => line.startsWith('K:'))
    if (notesStart >= 0) {
      const notes = lines.slice(notesStart + 1).join('\n')
      setNotation(notes)
    }
  }

  return (
    <div
      className={`abc-editor-page h-screen flex flex-col ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-gray-800 dark:text-white">ABC Notation Editor</h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">{header.title}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sample Buttons */}
          <button
            onClick={() => handleLoadSample('twinkle')}
            className="px-3 py-1.5 text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
          >
            Twinkle
          </button>
          <button
            onClick={() => handleLoadSample('cMajorScale')}
            className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
          >
            C Major Scale
          </button>
          <button
            onClick={() => handleLoadSample('simpleChords')}
            className="px-3 py-1.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
          >
            Chords
          </button>
          <button
            onClick={() => handleLoadSample('pianoRange')}
            className="px-3 py-1.5 text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
          >
            Piano C3-B5
          </button>
          <button
            onClick={() => handleLoadSample('guitarRange')}
            className="px-3 py-1.5 text-xs font-medium bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-200 rounded-lg hover:bg-cyan-200 dark:hover:bg-cyan-800 transition-colors"
          >
            Guitar E2-E5
          </button>

          {/* Dark Mode Toggle */}
          <label className="flex items-center gap-2 ml-4 cursor-pointer">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Dark</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </div>
          </label>
        </div>
      </header>

      {/* Split Pane */}
      <Split
        className="split flex-1"
        sizes={[50, 50]}
        minSize={200}
        gutterSize={8}
        direction="horizontal"
      >
        {/* Editor Pane */}
        <div className="h-full overflow-hidden">
          <React.Suspense fallback={<div className="h-full flex items-center justify-center text-slate-400">Loading editor...</div>}>
            <LazyAbcEditor value={text} onChange={handleEditorChange} darkMode={darkMode} height="100%" />
          </React.Suspense>
        </div>

        {/* Preview Pane */}
        <div className={`h-full overflow-auto p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <AbcScore notation={debouncedText} darkMode={darkMode} showControls={true} />
        </div>
      </Split>
    </div>
  )
}

export default AbcEditorPage
