import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { InstrumentType } from '../../stores/useFloatingInstrumentsStore'
import { useFloatingInstrumentsStore } from '../../stores/useFloatingInstrumentsStore'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { useProgressStore } from '../../stores/useProgressStore'
import { useBugReportStore } from '../../stores/useBugReportStore'
import { COURSE_MODULES } from '../../data/course-data'
import { useIsMobile } from '../../hooks/useMediaQuery'

// Mobile instrument heights (matching FloatingInstrumentPanel)
const INSTRUMENT_HEIGHTS: Record<InstrumentType, number> = {
  piano: 144, // Reduced by 20% from 180px
  guitar: 160,
  flute: 120,
}

const BOTTOM_NAV_HEIGHT = 45
const TOOLBAR_OFFSET = 16 // Spacing between toolbar and instrument

const instrumentConfig: Array<{ type: InstrumentType; icon: string; label: string }> = [
  { type: 'piano', icon: 'piano', label: 'Piano' },
  { type: 'guitar', icon: 'music_note', label: 'Guitar' },
  { type: 'flute', icon: 'air', label: 'Sáo Trúc' },
]

export const FloatingInstrumentsToolbar: React.FC = () => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [isExpanded, setIsExpanded] = useState(false)

  const { instruments, toggleInstrument } = useFloatingInstrumentsStore()
  const notationSystem = useSettingsStore((state) => state.notationSystem)
  const toggleNotationSystem = useSettingsStore((state) => state.toggleNotationSystem)
  const theme = useSettingsStore((state) => state.theme)
  const toggleTheme = useSettingsStore((state) => state.toggleTheme)
  const totalXP = useProgressStore((state) => state.totalXP)
  const completedSubmodules = useProgressStore((state) => state.completedSubmodules)
  const xpToNextLevel = 1000 - (totalXP % 1000)

  // Bug report state
  const setModalOpen = useBugReportStore((state) => state.setModalOpen)
  const errorCount = useBugReportStore((state) => state.errors.length)

  // Find next lesson to learn
  const allSubmodules = COURSE_MODULES.flatMap((m) =>
    m.submodules.map((s) => ({ ...s, moduleId: m.id }))
  )
  const nextLesson = allSubmodules.find((s, idx) => {
    if (completedSubmodules.includes(s.id)) return false
    if (idx === 0) return true
    return completedSubmodules.includes(allSubmodules[idx - 1].id)
  })

  const handleXPClick = () => {
    if (nextLesson) {
      navigate(`/module/${nextLesson.moduleId}/${nextLesson.id}`)
    } else {
      navigate('/compose')
    }
  }

  // Calculate dynamic toolbar position on mobile
  const visibleInstrument = Object.entries(instruments).find(
    ([_, state]) => state.isVisible
  )?.[0] as InstrumentType | undefined

  const getToolbarBottom = () => {
    if (!isMobile || !visibleInstrument) {
      return 80 // Default: 80px (bottom-20)
    }

    // Position above instrument: bottom nav + instrument height + offset
    const instrumentHeight = INSTRUMENT_HEIGHTS[visibleInstrument]
    return BOTTOM_NAV_HEIGHT + instrumentHeight + TOOLBAR_OFFSET
    // Piano: 45 + 180 + 16 = 241px
    // Guitar: 45 + 160 + 16 = 221px
    // Flute: 45 + 120 + 16 = 181px
  }

  const toolbarBottom = getToolbarBottom()

  // Mobile: collapsed menu
  if (isMobile) {
    return (
      <div
        data-testid="floating-instruments-toolbar"
        className="fixed right-4 z-[1100] flex flex-col-reverse gap-2 transition-all duration-300"
        style={{ bottom: `${toolbarBottom}px` }}
      >
        {/* Expanded Menu Items - show when expanded */}
        {isExpanded && (
          <>
            {/* XP Display */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleXPClick()
                setIsExpanded(false)
              }}
              className="flex items-center justify-center w-8 h-8 rounded-full shadow-lg bg-slate-800 border border-slate-600 active:scale-95 transition-transform animate-slideInUp"
              title={nextLesson ? `Tiếp tục học: ${nextLesson.id}` : 'Xem bài học'}
              style={{ animationDelay: '0ms' }}
            >
              <span
                className="material-symbols-outlined text-amber-500 text-base"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-amber-500 text-slate-900 text-[10px] font-bold rounded-full min-w-[24px] text-center">
                {totalXP}
              </span>
            </button>

            {/* Instrument Buttons */}
            {instrumentConfig.map(({ type, icon, label }, index) => {
              const isVisible = instruments[type].isVisible
              return (
                <button
                  key={type}
                  data-testid={`floating-toolbar-${type}-button`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleInstrument(type)
                    setIsExpanded(false) // Auto-hide menu after selection
                  }}
                  className={`
                    flex items-center justify-center
                    w-8 h-8 rounded-full shadow-lg
                    transition-transform active:scale-95
                    animate-slideInUp
                    ${
                      isVisible
                        ? 'bg-[#30e8e8] text-slate-900'
                        : 'bg-slate-800 text-slate-300 border border-slate-600'
                    }
                  `}
                  title={label}
                  style={{ animationDelay: `${(index + 1) * 50}ms` }}
                >
                  <span className="material-symbols-outlined text-base">{icon}</span>
                  {isVisible && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                </button>
              )
            })}

            {/* Bug Report Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setModalOpen(true)
                setIsExpanded(false)
              }}
              className="flex items-center justify-center w-8 h-8 rounded-full shadow-lg bg-rose-600 text-white active:scale-95 transition-transform border border-rose-500 animate-slideInUp"
              title="Bug Report"
              style={{ animationDelay: `${(instrumentConfig.length + 1) * 50}ms` }}
            >
              <span className="material-symbols-outlined text-base">bug_report</span>
              {errorCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-amber-400 text-slate-900 text-[10px] font-bold rounded-full min-w-[20px] text-center">
                  {errorCount > 9 ? '9+' : errorCount}
                </span>
              )}
            </button>

            {/* Divider */}
            <div
              className="h-px bg-slate-600 my-1 w-8 self-center animate-slideInUp"
              style={{ animationDelay: `${(instrumentConfig.length + 2) * 50}ms` }}
            />

            {/* VN Mode Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleNotationSystem()
              }}
              className={`
                flex items-center justify-center
                w-8 h-8 rounded-full shadow-lg
                transition-transform active:scale-95
                animate-slideInUp
                ${
                  notationSystem === 'solfege'
                    ? 'bg-[#30e8e8] text-slate-900'
                    : 'bg-slate-800 text-slate-300 border border-slate-600'
                }
              `}
              title={notationSystem === 'solfege' ? 'Vietnamese Notation' : 'Switch to VN'}
              style={{ animationDelay: `${(instrumentConfig.length + 3) * 50}ms` }}
            >
              <span className="text-xs font-bold">VN</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleTheme()
              }}
              className="flex items-center justify-center w-8 h-8 rounded-full shadow-lg bg-slate-800 text-slate-300 border border-slate-600 active:scale-95 transition-transform animate-slideInUp"
              title={`Theme: ${theme}`}
              style={{ animationDelay: `${(instrumentConfig.length + 4) * 50}ms` }}
            >
              <span className="material-symbols-outlined text-base">
                {theme === 'system'
                  ? 'brightness_auto'
                  : theme === 'dark'
                    ? 'dark_mode'
                    : 'light_mode'}
              </span>
            </button>
          </>
        )}

        {/* Main Toggle Button */}
        <button
          data-testid="floating-toolbar-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            flex items-center justify-center
            w-10 h-10 rounded-full shadow-xl
            transition-all duration-300
            ${isExpanded ? 'bg-slate-700 text-white rotate-45' : 'bg-[#30e8e8] text-slate-900'}
          `}
          title={isExpanded ? 'Đóng menu' : 'Mở menu công cụ'}
        >
          <span className="material-symbols-outlined text-lg">{isExpanded ? 'close' : 'apps'}</span>
        </button>
      </div>
    )
  }

  // Desktop: collapsible menu (same pattern as mobile)
  return (
    <div className="fixed bottom-4 right-4 z-[1100] flex flex-col-reverse gap-2">
      {/* Main Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          flex items-center justify-center
          w-14 h-14 rounded-full shadow-xl
          transition-all duration-300
          ${isExpanded ? 'bg-slate-700 text-white rotate-45' : 'bg-[#30e8e8] text-slate-900 hover:scale-110'}
        `}
        title={isExpanded ? 'Đóng menu' : 'Mở menu công cụ'}
      >
        <span className="material-symbols-outlined text-2xl">{isExpanded ? 'close' : 'apps'}</span>
      </button>

      {/* Expanded Menu Items - show when expanded */}
      {isExpanded && (
        <>
          {/* XP Display - clickable to go to next lesson */}
          <button
            onClick={handleXPClick}
            className="group relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-slate-800 border border-slate-600 hover:bg-slate-700 hover:scale-110 transition-all cursor-pointer animate-slideInUp"
            title={nextLesson ? `Tiếp tục học: ${nextLesson.id}` : 'Xem bài học'}
            style={{ animationDelay: '0ms' }}
          >
            <span
              className="material-symbols-outlined text-amber-500 text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>

            {/* XP Value Badge */}
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-amber-500 text-slate-900 text-[10px] font-bold rounded-full min-w-[24px] text-center">
              {totalXP}
            </span>

            {/* Tooltip */}
            <span className="absolute right-14 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {xpToNextLevel} XP để lên level tiếp theo
            </span>
          </button>

          {/* Instrument Buttons */}
          {instrumentConfig.map(({ type, icon, label }, index) => {
            const isVisible = instruments[type].isVisible

            return (
              <button
                key={type}
                onClick={() => toggleInstrument(type)}
                className={`
                  group relative flex items-center justify-center
                  w-12 h-12 rounded-full shadow-lg
                  transition-all duration-200 hover:scale-110
                  animate-slideInUp
                  ${
                    isVisible
                      ? 'bg-[#30e8e8] text-slate-900'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
                  }
                `}
                title={`${isVisible ? 'Hide' : 'Show'} ${label}`}
                style={{ animationDelay: `${(index + 1) * 50}ms` }}
              >
                <span className="material-symbols-outlined text-xl">{icon}</span>

                {/* Tooltip */}
                <span className="absolute right-14 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {label}
                </span>

                {/* Active indicator */}
                {isVisible && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                )}
              </button>
            )
          })}

          {/* Bug Report Button */}
          <button
            onClick={() => setModalOpen(true)}
            className="group relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-rose-600 text-white hover:bg-rose-500 hover:scale-110 transition-all cursor-pointer border border-rose-500 animate-slideInUp"
            title="Bug Report - Xem logs và copy để báo lỗi"
            style={{ animationDelay: `${(instrumentConfig.length + 1) * 50}ms` }}
          >
            <span className="material-symbols-outlined text-xl">bug_report</span>

            {/* Error count badge */}
            {errorCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-amber-400 text-slate-900 text-[10px] font-bold rounded-full min-w-[20px] text-center">
                {errorCount > 9 ? '9+' : errorCount}
              </span>
            )}

            {/* Tooltip */}
            <span className="absolute right-14 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Bug Report
            </span>
          </button>

          {/* Divider */}
          <div
            className="h-px bg-slate-600 my-1 w-12 self-center animate-slideInUp"
            style={{ animationDelay: `${(instrumentConfig.length + 2) * 50}ms` }}
          />

          {/* VN Mode Toggle */}
          <button
            onClick={toggleNotationSystem}
            className={`
              group relative flex items-center justify-center
              w-12 h-12 rounded-full shadow-lg
              transition-all duration-200 hover:scale-110
              animate-slideInUp
              ${
                notationSystem === 'solfege'
                  ? 'bg-[#30e8e8] text-slate-900'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
              }
            `}
            title={notationSystem === 'solfege' ? 'Vietnamese Notation (Active)' : 'Switch to VN Mode'}
            style={{ animationDelay: `${(instrumentConfig.length + 3) * 50}ms` }}
          >
            <span className="text-xs font-bold">VN</span>

            {/* Tooltip */}
            <span className="absolute right-14 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {notationSystem === 'solfege' ? 'Vietnamese Notation' : 'VN Mode'}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="group relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:scale-110 transition-all cursor-pointer border border-slate-600 animate-slideInUp"
            title={`Theme: ${theme}`}
            style={{ animationDelay: `${(instrumentConfig.length + 4) * 50}ms` }}
          >
            <span className="material-symbols-outlined text-xl">
              {theme === 'system' ? 'brightness_auto' : theme === 'dark' ? 'dark_mode' : 'light_mode'}
            </span>

            {/* Tooltip */}
            <span className="absolute right-14 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {theme === 'system' ? 'Auto' : theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>
        </>
      )}
    </div>
  )
}

export default FloatingInstrumentsToolbar
