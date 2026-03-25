import React from 'react'
import type { PracticeSheet } from '../../data/practiceLibrary'

interface NowPlayingBannerProps {
  sheet: PracticeSheet | null
  onClear: () => void
  categoryColor?: string
}

/**
 * NowPlayingBanner - Shows the currently loaded music sheet
 */
export const NowPlayingBanner: React.FC<NowPlayingBannerProps> = ({
  sheet,
  onClear,
  categoryColor = 'from-cyan-500 to-teal-600',
}) => {
  if (!sheet) return null

  const sourceLabel = sheet.source === 'butterworth' ? 'Dân ca' : 'Bài học'

  return (
    <div
      data-testid="practice-now-playing-banner"
      className={`
      relative overflow-hidden rounded-xl p-3 
      bg-gradient-to-r ${categoryColor}
      shadow-lg
    `}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative flex items-center gap-3">
        {/* Now Playing indicator */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <span className="material-symbols-outlined text-white animate-pulse">play_circle</span>
        </div>

        {/* Song info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white/70 text-xs uppercase tracking-wider">Đang phát</span>
            <span className="px-1.5 py-0.5 rounded bg-white/20 text-white text-xs">
              {sourceLabel}
            </span>
          </div>
          <h3 className="text-white font-bold text-sm truncate">{sheet.title}</h3>
        </div>

        {/* Clear button */}
        <button
          onClick={onClear}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          title="Đóng bài hát"
        >
          <span className="material-symbols-outlined text-white text-lg">close</span>
        </button>
      </div>
    </div>
  )
}

export default NowPlayingBanner
