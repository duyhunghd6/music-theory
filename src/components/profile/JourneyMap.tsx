import React from 'react'
import { useNavigate } from 'react-router-dom'
import { COURSE_MODULES } from '../../data/course-data'
import { useProgressStore } from '../../stores/useProgressStore'
import { ProgressRing } from '../ui/ProgressRing'

interface JourneyMapProps {
  className?: string
}

// Module themes
const MODULE_THEMES: Record<number, { icon: string; color: string }> = {
  1: { icon: '🏰', color: '#30e8e8' },
  2: { icon: '⛵', color: '#f59e0b' },
  3: { icon: '🏔️', color: '#10b981' },
  4: { icon: '🏯', color: '#8b5cf6' },
  5: { icon: '✨', color: '#ec4899' },
}

/**
 * JourneyMap - Vertical Zig-Zag Quest Path
 * Compact game-like path with larger icons and full module names
 */
export const JourneyMap: React.FC<JourneyMapProps> = ({ className = '' }) => {
  const navigate = useNavigate()
  const { completedSubmodules, currentSubmoduleId, getSectionProgress } = useProgressStore()

  const isCompleted = (submoduleId: string) => completedSubmodules.includes(submoduleId)
  const isCurrent = (submoduleId: string) => currentSubmoduleId === submoduleId

  const isUnlocked = (submoduleId: string, moduleIndex: number, subIndex: number) => {
    if (moduleIndex === 0 && subIndex === 0) return true
    const allSubmodules = COURSE_MODULES.flatMap((m) => m.submodules)
    const currentIdx = allSubmodules.findIndex((s) => s.id === submoduleId)
    if (currentIdx <= 0) return true
    return completedSubmodules.includes(allSubmodules[currentIdx - 1].id)
  }

  const handleClick = (moduleId: number, submoduleId: string, _unlocked: boolean) => {
    // Always allow navigation
    navigate(`/module/${moduleId}/${submoduleId}`)
  }

  return (
    <div
      className={`bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-[#0f1729] dark:to-slate-900 rounded-2xl p-4 shadow-2xl border border-slate-200 dark:border-slate-700/50 ${className}`}
    >
      {/* Zig-Zag Path Container */}
      <div className="space-y-3">
        {COURSE_MODULES.map((module, moduleIndex) => {
          const theme = MODULE_THEMES[module.id] || MODULE_THEMES[1]
          const completedInModule = module.submodules.filter((s) =>
            completedSubmodules.includes(s.id)
          ).length
          const moduleCompleted = completedInModule === module.submodules.length
          const moduleStarted = completedInModule > 0
          const isEven = moduleIndex % 2 === 0
          const isLast = moduleIndex === COURSE_MODULES.length - 1

          return (
            <div key={module.id}>
              {/* Module Row - Alternating left/right */}
              <div className={`flex items-start gap-3 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Module Icon + Name - Larger */}
                <div className="flex flex-col items-center flex-shrink-0 w-28">
                  <div
                    className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center text-3xl
                      ${
                        moduleCompleted
                          ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/40'
                          : moduleStarted
                            ? 'bg-gradient-to-br from-cyan-500 to-teal-600 shadow-lg shadow-cyan-500/40'
                            : 'bg-slate-200 dark:bg-slate-700/60'
                      }
                    `}
                  >
                    {moduleCompleted ? '👑' : theme.icon}
                  </div>
                  {/* Module Number + Name */}
                  <div className="flex items-center gap-1 mt-1.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        moduleCompleted
                          ? 'bg-amber-500 text-white'
                          : moduleStarted
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {module.id}
                    </span>
                    <p
                      className={`text-sm font-bold text-center leading-tight ${
                        moduleCompleted
                          ? 'text-amber-600 dark:text-amber-300'
                          : moduleStarted
                            ? 'text-cyan-600 dark:text-cyan-300'
                            : 'text-slate-600 dark:text-slate-500'
                      }`}
                    >
                      {module.name}
                    </p>
                  </div>
                </div>

                {/* Checkpoint Trail with Submodule Names */}
                <div className={`flex-1 ${isEven ? '' : 'flex flex-col items-end'}`}>
                  <div className={`flex flex-wrap gap-2 ${isEven ? '' : 'justify-end'}`}>
                    {module.submodules.map((sub, subIndex) => {
                      const done = isCompleted(sub.id)
                      const curr = isCurrent(sub.id)
                      const unlocked = isUnlocked(sub.id, moduleIndex, subIndex)

                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleClick(module.id, sub.id, unlocked)}
                          className={`
                            flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-all min-w-[65px]
                            ${
                              done
                                ? 'bg-emerald-500/20 hover:bg-emerald-500/30'
                                : curr
                                  ? 'bg-cyan-500/20 ring-1 ring-cyan-400/50'
                                  : unlocked
                                    ? 'bg-slate-100 dark:bg-slate-700/30 hover:bg-slate-200 dark:hover:bg-slate-600/40'
                                    : 'bg-slate-100 dark:bg-slate-800/30 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700/50'
                            }
                          `}
                          title={`${sub.id}: ${sub.title}`}
                        >
                          {/* Checkpoint Circle with Progress Ring */}
                          {(() => {
                            const sectionProg = getSectionProgress(sub.id)
                            const progressPercent = sectionProg
                              ? Math.round(
                                  (sectionProg.visibleCount / sectionProg.totalSections) * 100
                                )
                              : 0

                            return (
                              <ProgressRing
                                progress={done ? 100 : progressPercent}
                                size={32}
                                strokeWidth={3}
                                className={
                                  done
                                    ? 'text-emerald-500'
                                    : progressPercent > 0
                                      ? 'text-cyan-400'
                                      : 'text-slate-300 dark:text-slate-600'
                                }
                              >
                                <div
                                  className={`
                                    w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold
                                    ${
                                      done
                                        ? 'bg-emerald-500 text-white'
                                        : curr
                                          ? 'bg-cyan-400 text-slate-900 animate-pulse'
                                          : unlocked
                                            ? 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                                    }
                                  `}
                                >
                                  {done ? '✓' : subIndex + 1}
                                </div>
                              </ProgressRing>
                            )
                          })()}
                          {/* Submodule Title */}
                          <span
                            className={`text-[9px] leading-tight text-center w-full ${
                              done
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : curr
                                  ? 'text-cyan-600 dark:text-cyan-300'
                                  : unlocked
                                    ? 'text-slate-600 dark:text-slate-400'
                                    : 'text-slate-400 dark:text-slate-600'
                            }`}
                          >
                            {sub.title}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Vertical Connector - Zig-zag curve */}
              {!isLast && (
                <div className={`flex ${isEven ? 'justify-start ml-8' : 'justify-end mr-8'} my-1`}>
                  <svg width="30" height="16" className="text-slate-300 dark:text-slate-600">
                    <path
                      d={
                        isEven
                          ? 'M 6 0 Q 6 8, 24 8 Q 24 16, 24 16'
                          : 'M 24 0 Q 24 8, 6 8 Q 6 16, 6 16'
                      }
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      fill="none"
                      className={moduleCompleted ? 'text-amber-500/50' : ''}
                    />
                  </svg>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Compact Legend */}
      <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/50">
        <span className="flex items-center gap-1 text-[9px] text-slate-600 dark:text-slate-500">
          <span className="w-2 h-2 bg-emerald-500 rounded-full" /> Xong
        </span>
        <span className="flex items-center gap-1 text-[9px] text-slate-600 dark:text-slate-500">
          <span className="w-2 h-2 bg-cyan-400 rounded-full" /> Đang học
        </span>
        <span className="flex items-center gap-1 text-[9px] text-slate-600 dark:text-slate-500">
          <span className="w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full" /> Mở
        </span>
        <span className="flex items-center gap-1 text-[9px] text-slate-600 dark:text-slate-500">
          <span className="w-2 h-2 bg-slate-300 dark:bg-slate-800 rounded-full" /> Khoá
        </span>
      </div>
    </div>
  )
}

export default JourneyMap
