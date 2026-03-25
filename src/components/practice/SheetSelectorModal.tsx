import React, { useState, useCallback, useEffect } from 'react'
import type {
  PracticeSheet,
  PracticeCategory,
  ButterworthEntry,
  SahajaYogaEntry,
} from '../../data/practiceLibrary'

// Union type for lazy-loaded entries
type LazyEntry = ButterworthEntry | SahajaYogaEntry

interface SheetSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  category: PracticeCategory | null
  onSelectSheet: (sheet: PracticeSheet) => void
  // For lazy-loaded collections (Butterworth, Sahaja Yoga, etc.)
  butterworthEntries?: LazyEntry[]
  onLoadButterworth?: (filename: string) => Promise<string>
}

/**
 * SheetSelectorModal - Modal for selecting songs within a category
 */
export const SheetSelectorModal: React.FC<SheetSelectorModalProps> = ({
  isOpen,
  onClose,
  category,
  onSelectSheet,
  butterworthEntries,
  onLoadButterworth,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingSheet, setLoadingSheet] = useState<string | null>(null)

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
      return () => window.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose])

  // Reset search when category changes
  useEffect(() => {
    setSearchQuery('')
  }, [category?.id])

  const handleSheetClick = useCallback(
    async (sheet: PracticeSheet) => {
      onSelectSheet(sheet)
      onClose()
    },
    [onSelectSheet, onClose]
  )

  const handleButterworthClick = useCallback(
    async (entry: LazyEntry) => {
      if (!onLoadButterworth) return

      setLoadingSheet(entry.filename)
      try {
        const abc = await onLoadButterworth(entry.filename)
        // Check if entry has 'key' property (Butterworth) or not (Sahaja Yoga)
        const hasKey = 'key' in entry && entry.key
        // Extract clean ID from filename (e.g., "./music-sheets/.../raga-bupali.abc" -> "raga-bupali")
        const cleanId = entry.filename.split('/').pop()?.replace('.abc', '') || entry.filename
        const sheet: PracticeSheet = {
          id: cleanId,
          title: entry.title,
          description: hasKey ? `Key: ${entry.key} - Traditional folk song` : 'Traditional Indian raga',
          abc,
          difficulty: 'intermediate',
          source: hasKey ? 'butterworth' : 'curriculum',
        }
        onSelectSheet(sheet)
        onClose()
      } catch (error) {
        console.error('Failed to load song:', error)
      } finally {
        setLoadingSheet(null)
      }
    },
    [onLoadButterworth, onSelectSheet, onClose]
  )

  if (!isOpen || !category) return null

  // Filter sheets based on search
  const isButterworth = !!butterworthEntries
  const filteredSheets = category.sheets.filter(
    (sheet) =>
      sheet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sheet.description.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredButterworth = butterworthEntries?.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ('key' in entry && entry.key?.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div data-testid="practice-sheet-selector-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[80vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`p-4 bg-gradient-to-r ${category.color}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white">{category.icon}</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">{category.nameVi}</h2>
                <p className="text-white/70 text-sm">
                  {isButterworth
                    ? `${filteredButterworth?.length || 0} bài`
                    : `${filteredSheets.length} bài`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-white text-xl">close</span>
            </button>
          </div>

          {/* Search (for Butterworth or large collections) */}
          {(isButterworth || category.sheets.length > 10) && (
            <div className="mt-3 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm bài hát..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          )}
        </div>

        {/* Sheet list */}
        <div className="flex-1 overflow-y-auto p-2">
          {isButterworth ? (
            // Butterworth entries
            <div className="space-y-1">
              {filteredButterworth?.map((entry) => (
                <button
                  key={entry.filename}
                  data-testid={`practice-sheet-option-${entry.filename.split('/').pop()?.replace('.abc', '') || entry.filename}`}
                  onClick={() => handleButterworthClick(entry)}
                  disabled={loadingSheet === entry.filename}
                  className="w-full p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-sm">
                      {loadingSheet === entry.filename ? 'hourglass_empty' : 'music_note'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-slate-900 dark:text-white font-medium text-sm truncate">
                      {entry.title}
                    </h4>
                    {'key' in entry && entry.key && (
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Key: {entry.key}</p>
                    )}
                  </div>
                </button>
              ))}
              {filteredButterworth?.length === 0 && (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                  Không tìm thấy bài hát
                </p>
              )}
            </div>
          ) : (
            // Curriculum sheets
            <div className="space-y-1">
              {filteredSheets.map((sheet) => (
                <button
                  key={sheet.id}
                  data-testid={`practice-sheet-option-${sheet.id}`}
                  onClick={() => handleSheetClick(sheet)}
                  className="w-full p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left flex items-center gap-3"
                >
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="material-symbols-outlined text-white text-sm">music_note</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-slate-900 dark:text-white font-medium text-sm truncate">
                      {sheet.title}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs truncate">
                      {sheet.description}
                    </p>
                  </div>
                  {sheet.submodule && (
                    <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
                      {sheet.submodule}
                    </span>
                  )}
                </button>
              ))}
              {filteredSheets.length === 0 && (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                  Không tìm thấy bài hát
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SheetSelectorModal
