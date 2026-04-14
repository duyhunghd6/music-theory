import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { COURSE_MODULES } from '../../data/course-data'
import { useProgressStore } from '../../stores/useProgressStore'
import { ProgressRing } from '../ui/ProgressRing'
import { useGameStore } from '../../stores/useGameStore'
import { APP_STRINGS } from '../../constants/app-strings'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { MobileDrawer } from '../ui/MobileDrawer'

interface SidebarProps {
  className?: string
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

/**
 * Navigation items for the sidebar
 * Order: Nhạc lý (with modules) / Luyện tập / Soạn nhạc
 */
const NAV_ITEMS = [
  { icon: 'school', label: 'Nhạc lý', path: '/nhacly', hasModules: true },
  { icon: 'piano', label: 'Luyện tập', path: '/practice' },
  { icon: 'edit_note', label: 'Soạn nhạc', path: '/compose' },
]

/**
 * Tooltip component for collapsed sidebar items
 */
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <div className="relative group">
    {children}
    <div className="absolute left-full ml-2 px-3 py-1.5 bg-slate-800 dark:bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
      {text}
      <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45" />
    </div>
  </div>
)

/**
 * SidebarContent - Reusable component for both desktop and mobile
 */
const SidebarContent: React.FC<{
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  navigate: ReturnType<typeof useNavigate>
  location: ReturnType<typeof useLocation>
  currentModuleId: number
  currentSubmoduleId: string
  setCurrentPosition: (moduleId: number, submoduleId: string) => void
  completedSubmodules: string[]
  getModuleProgress: (moduleId: number) => number
  getSectionProgress: (
    submoduleId: string
  ) => { visibleCount: number; totalSections: number } | undefined
  startGame: () => void
  stopGame: () => void
  isPlaying: boolean
  onMobileClose?: () => void
  isMobile: boolean
  showCollapseButton?: boolean
}> = ({
  sidebarCollapsed,
  toggleSidebar,
  navigate,
  location,
  currentModuleId,
  setCurrentPosition,
  completedSubmodules,
  getModuleProgress,
  getSectionProgress,
  startGame,
  stopGame,
  isPlaying,
  onMobileClose,
  isMobile,
  showCollapseButton = true,
}) => {
  // Track which modules are expanded
  const [expandedModules, setExpandedModules] = React.useState<number[]>([currentModuleId])

  const toggleModuleExpansion = (moduleId: number) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    )
  }

  const handleSubmoduleClick = (moduleId: number, submoduleId: string) => {
    setCurrentPosition(moduleId, submoduleId)
    navigate(`/module/${moduleId}/${submoduleId}`)
    // Auto-close mobile drawer after navigation
    if (isMobile && onMobileClose) {
      onMobileClose()
    }
  }

  const isSubmoduleActive = (submoduleId: string) => {
    return location.pathname.includes(`/module/`) && location.pathname.includes(submoduleId)
  }

  const isSubmoduleCompleted = (submoduleId: string) => {
    return completedSubmodules.includes(submoduleId)
  }

  const isNavItemActive = (path: string) => {
    if (path === '/nhacly') {
      return location.pathname === '/nhacly' || location.pathname.startsWith('/module/')
    }
    return location.pathname === path
  }

  // Check if Nhạc lý section should show modules
  const isNhaclyActive = location.pathname === '/nhacly' || location.pathname.startsWith('/module/')

  return (
    <>
      {/* Header */}
      <div className={`${sidebarCollapsed ? 'p-4' : 'p-6'} pb-2 transition-all duration-300`}>
        <div className="flex items-center gap-2 mb-6 relative">
          {/* Logo/Icon */}
          <div
            className={`${sidebarCollapsed ? 'w-8 h-8' : 'w-8 h-8'} bg-[#30e8e8] rounded-lg flex items-center justify-center text-[#111818] cursor-pointer group hover:scale-105 transition-transform flex-shrink-0`}
            onClick={() => {
              navigate('/')
              if (isMobile && onMobileClose) {
                onMobileClose()
              }
            }}
          >
            <span className="material-symbols-outlined text-[20px]">music_note</span>
          </div>

          {/* Title - hidden when collapsed */}
          <h1
            className={`text-lg font-bold tracking-tight text-slate-900 dark:text-white cursor-pointer hover:text-[#30e8e8] transition-all duration-300 ${
              sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}
            onClick={() => {
              navigate('/')
              if (isMobile && onMobileClose) {
                onMobileClose()
              }
            }}
          >
            Music Theory Course
          </h1>

          {/* Toggle Button - Desktop only - Modern hamburger/chevron design */}
          {!sidebarCollapsed && showCollapseButton && !isMobile && (
            <button
              onClick={toggleSidebar}
              className="ml-auto w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#30e8e8]/20 dark:hover:bg-[#30e8e8]/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-[20px]">
                chevron_left
              </span>
            </button>
          )}

          {/* Close Button - Mobile only */}
          {isMobile && onMobileClose && (
            <button
              onClick={onMobileClose}
              className="ml-auto w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#30e8e8]/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-[20px]">
                close
              </span>
            </button>
          )}
        </div>

        {/* Floating Expand Button - Only shown when collapsed on desktop */}
        {sidebarCollapsed && showCollapseButton && !isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute top-4 -right-3 w-6 h-6 rounded-full bg-[#30e8e8] hover:bg-[#26d4d4] shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40"
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <span className="material-symbols-outlined text-[#111818] text-[16px]">
              chevron_right
            </span>
          </button>
        )}

        {/* Navigation */}
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const navItemContent = (
              <div key={item.label}>
                <div
                  onClick={() => {
                    if (item.hasModules) {
                      // For Nhạc lý, navigate to first module submodule
                      const firstModule = COURSE_MODULES[0]
                      if (firstModule?.submodules?.length > 0) {
                        navigate(`/module/${firstModule.id}/${firstModule.submodules[0].id}`)
                        if (isMobile && onMobileClose) {
                          onMobileClose()
                        }
                      }
                    } else {
                      navigate(item.path)
                      if (isMobile && onMobileClose) {
                        onMobileClose()
                      }
                    }
                  }}
                  className={`
                    flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-300
                    ${
                      isNavItemActive(item.path)
                        ? 'bg-[#30e8e8]/10 text-[#111818] dark:text-white'
                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400'
                    }
                  `}
                >
                  <span
                    className="material-symbols-outlined flex-shrink-0"
                    style={isNavItemActive(item.path) ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.icon}
                  </span>
                  <p
                    className={`text-sm transition-all duration-300 ${
                      isNavItemActive(item.path) ? 'font-semibold' : 'font-medium'
                    } ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}
                  >
                    {item.label}
                  </p>
                  {item.hasModules && !sidebarCollapsed && (
                    <span
                      className={`material-symbols-outlined text-lg transition-transform ${isNhaclyActive ? 'rotate-180' : ''}`}
                    >
                      expand_more
                    </span>
                  )}
                </div>

                {/* Nhạc lý - Inline Module List (only when expanded) */}
                {item.hasModules && isNhaclyActive && !sidebarCollapsed && (
                  <div className="mt-2 ml-2 space-y-2">
                    {COURSE_MODULES.map((module) => {
                      const isExpanded = expandedModules.includes(module.id)
                      const moduleProgress = getModuleProgress(module.id)
                      const isCurrentModule = module.id === currentModuleId

                      return (
                        <div
                          key={module.id}
                          className={`
                            rounded-xl border transition-all duration-200
                            ${
                              isCurrentModule
                                ? 'border-[#30e8e8]/30 bg-[#30e8e8]/5 dark:bg-[#30e8e8]/10'
                                : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800'
                            }
                          `}
                        >
                          {/* Module Header */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleModuleExpansion(module.id)
                            }}
                            className="w-full flex items-center justify-between gap-3 p-3"
                          >
                            <div className="flex items-center gap-3">
                              <ProgressRing progress={moduleProgress} size={28}>
                                <span
                                  className={`text-[9px] font-bold ${
                                    isCurrentModule
                                      ? 'text-[#136363] dark:text-[#30e8e8]'
                                      : 'text-slate-500 dark:text-slate-400'
                                  }`}
                                >
                                  {module.id}
                                </span>
                              </ProgressRing>
                              <div className="text-left">
                                <span
                                  className={`text-sm block ${
                                    isCurrentModule
                                      ? 'font-bold text-[#136363] dark:text-[#30e8e8]'
                                      : 'font-medium text-slate-700 dark:text-slate-200'
                                  }`}
                                >
                                  {module.name}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                  {module.subtitle}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`
                                material-symbols-outlined text-lg transition-transform
                                ${isExpanded ? 'rotate-180' : ''}
                                ${isCurrentModule ? 'text-[#136363] dark:text-[#30e8e8]' : 'text-slate-400'}
                              `}
                            >
                              expand_more
                            </span>
                          </button>

                          {/* Submodule List (Expandable) */}
                          {isExpanded && (
                            <div className="px-3 pb-3 space-y-1">
                              {module.submodules.map((submodule) => {
                                const isActive = isSubmoduleActive(submodule.id)
                                const isCompleted = isSubmoduleCompleted(submodule.id)

                                return (
                                  <button
                                    key={submodule.id}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleSubmoduleClick(module.id, submodule.id)
                                    }}
                                    className={`
                                      w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors touch-target-sm
                                      ${
                                        isActive
                                          ? 'bg-[#30e8e8]/20 text-[#136363] dark:text-[#30e8e8]'
                                          : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300'
                                      }
                                    `}
                                  >
                                    {/* Status Icon with Progress Ring */}
                                    {(() => {
                                      const sectionProg = getSectionProgress(submodule.id)
                                      const progressPercent = sectionProg
                                        ? Math.round(
                                            (sectionProg.visibleCount / sectionProg.totalSections) *
                                              100
                                          )
                                        : 0

                                      return (
                                        <div className="relative flex-shrink-0">
                                          <ProgressRing
                                            progress={isCompleted ? 100 : progressPercent}
                                            size={24}
                                            strokeWidth={2.5}
                                            className={
                                              isCompleted
                                                ? 'text-emerald-500'
                                                : progressPercent > 0
                                                  ? 'text-[#30e8e8]'
                                                  : 'text-slate-400 dark:text-slate-500'
                                            }
                                          >
                                            {isCompleted ? (
                                              <span
                                                className="material-symbols-outlined text-[12px] text-emerald-500"
                                                style={{ fontVariationSettings: "'FILL' 1" }}
                                              >
                                                check
                                              </span>
                                            ) : (
                                              <span className="text-[8px] font-bold text-slate-600 dark:text-slate-300">
                                                {progressPercent}%
                                              </span>
                                            )}
                                          </ProgressRing>
                                        </div>
                                      )
                                    })()}

                                    {/* Submodule Title */}
                                    <div className="flex-1 min-w-0">
                                      <span
                                        className={`
                                          text-xs block truncate
                                          ${isActive ? 'font-semibold' : 'font-medium'}
                                        `}
                                      >
                                        {submodule.id} {submodule.title}
                                      </span>
                                    </div>
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )

            // Wrap with tooltip if collapsed
            return sidebarCollapsed && !isMobile ? (
              <Tooltip key={item.label} text={item.label}>
                {navItemContent}
              </Tooltip>
            ) : (
              navItemContent
            )
          })}
        </div>

        {/* Game Control Button */}
        <div className="mt-4">
          {sidebarCollapsed && !isMobile ? (
            <Tooltip text={isPlaying ? APP_STRINGS.GAME.STOP : APP_STRINGS.GAME.START}>
              <button
                onClick={isPlaying ? stopGame : startGame}
                className={`
                  w-full py-3 px-3 rounded-xl flex items-center justify-center font-bold transition-all shadow-sm touch-target
                  ${
                    isPlaying
                      ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/50 dark:border-rose-800'
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50 dark:border-emerald-800'
                  }
                `}
              >
                <span className="material-symbols-outlined">
                  {isPlaying ? 'stop_circle' : 'play_circle'}
                </span>
              </button>
            </Tooltip>
          ) : (
            <button
              onClick={isPlaying ? stopGame : startGame}
              className={`
                w-full py-3 px-4 rounded-xl flex items-center justify-start gap-2 font-bold transition-all shadow-sm touch-target
                ${
                  isPlaying
                    ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/50 dark:border-rose-800'
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50 dark:border-emerald-800'
                }
              `}
            >
              <span className="material-symbols-outlined">
                {isPlaying ? 'stop_circle' : 'play_circle'}
              </span>
              {isPlaying ? APP_STRINGS.GAME.STOP : APP_STRINGS.GAME.START}
            </button>
          )}
        </div>
      </div>

      {/* Spacer to push footer down */}
      <div className="flex-1" />

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 mt-auto">
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-end'}`}>
          {sidebarCollapsed && !isMobile ? (
            <Tooltip text="Help">
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-target-sm">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">help</span>
              </button>
            </Tooltip>
          ) : (
            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-target-sm">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">help</span>
            </button>
          )}
        </div>
      </div>
    </>
  )
}

/**
 * Sidebar - Desktop and Mobile Responsive Navigation
 * Desktop: Collapsible sidebar (280px → 72px)
 * Mobile: Slide-out drawer from left
 */
export const Sidebar: React.FC<SidebarProps> = ({
  className,
  isMobileOpen = false,
  onMobileClose,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useIsMobile()

  const {
    currentModuleId,
    currentSubmoduleId,
    setCurrentPosition,
    completedSubmodules,
    getModuleProgress,
    getSectionProgress,
  } = useProgressStore()

  const startGame = useGameStore((state) => state.startGame)
  const stopGame = useGameStore((state) => state.stopGame)
  const isPlaying = useGameStore((state) => state.isPlaying)

  const sidebarCollapsed = useSettingsStore((state) => state.sidebarCollapsed)
  const toggleSidebar = useSettingsStore((state) => state.toggleSidebar)

  // Mobile: Render as drawer
  if (isMobile) {
    return (
      <MobileDrawer isOpen={isMobileOpen} onClose={onMobileClose || (() => {})}>
        <div className="h-full flex flex-col">
          <SidebarContent
            sidebarCollapsed={false} // Always expanded in mobile drawer
            toggleSidebar={toggleSidebar}
            navigate={navigate}
            location={location}
            currentModuleId={currentModuleId}
            currentSubmoduleId={currentSubmoduleId}
            setCurrentPosition={setCurrentPosition}
            completedSubmodules={completedSubmodules}
            getModuleProgress={getModuleProgress}
            getSectionProgress={getSectionProgress}
            startGame={startGame}
            stopGame={stopGame}
            isPlaying={isPlaying}
            onMobileClose={onMobileClose}
            isMobile={true}
            showCollapseButton={false}
          />
        </div>
      </MobileDrawer>
    )
  }

  // Desktop: Render as sidebar
  return (
    <aside
      data-testid="sidebar"
      className={`
        ${sidebarCollapsed ? 'w-[72px]' : 'w-[280px]'} 
        flex-shrink-0 bg-white dark:bg-[#1a1d21]
        border-r border-slate-200 dark:border-slate-700
        hidden md:flex flex-col sticky top-0 h-screen overflow-y-auto no-scrollbar shadow-[2px_0_20px_rgba(0,0,0,0.02)] z-30
        transition-all duration-300 ease-in-out
        ${className}
      `}
    >
      <SidebarContent
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        navigate={navigate}
        location={location}
        currentModuleId={currentModuleId}
        currentSubmoduleId={currentSubmoduleId}
        setCurrentPosition={setCurrentPosition}
        completedSubmodules={completedSubmodules}
        getModuleProgress={getModuleProgress}
        getSectionProgress={getSectionProgress}
        startGame={startGame}
        stopGame={stopGame}
        isPlaying={isPlaying}
        onMobileClose={undefined}
        isMobile={false}
        showCollapseButton={true}
      />
    </aside>
  )
}

export default Sidebar
