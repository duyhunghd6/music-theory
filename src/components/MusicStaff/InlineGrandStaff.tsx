import React, { Suspense, useState } from 'react'
import { CollapsiblePanel } from '../ui/CollapsiblePanel'

const AbcGrandStaff = React.lazy(() => import('./AbcGrandStaff'))

interface InlineGrandStaffProps {
  /** Title displayed in header */
  title?: string
  /** ABC notation to render */
  abc: string
  /** Optional CSS class */
  className?: string
}

/**
 * InlineGrandStaff - Thin wrapper that reuses AbcGrandStaff with CollapsiblePanel
 * Used within theoryContent via {{grandStaff:Title|ABC_NOTATION}} syntax
 */
export const InlineGrandStaff: React.FC<InlineGrandStaffProps> = ({
  title,
  abc,
  className = '',
}) => {
  const [showNoteNames, setShowNoteNames] = useState(false)
  const [transposeSemitones, setTransposeSemitones] = useState(0)

  // Process ABC - convert escaped newlines to actual newlines
  const processedAbc = abc.replace(/\\n/g, '\n')

  return (
    <div className={`my-6 ${className}`}>
      <CollapsiblePanel
        title={title || 'Grand Staff View'}
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
        <Suspense
          fallback={
            <div className="w-full h-[150px] flex items-center justify-center text-slate-400">
              Loading staff...
            </div>
          }
        >
          <AbcGrandStaff
            showNoteNames={showNoteNames}
            overrideAbc={processedAbc}
            transposeSemitones={transposeSemitones}
          />
        </Suspense>
      </CollapsiblePanel>
    </div>
  )
}

export default InlineGrandStaff
