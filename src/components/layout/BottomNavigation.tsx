import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export type BottomNavTab = 'theory' | 'practice' | 'compose' | 'profile'

interface BottomNavigationProps {
  activeTab?: BottomNavTab
  className?: string
}

interface NavItem {
  id: BottomNavTab
  label: string
  icon: string
  path: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'theory', label: 'Lý thuyết', icon: 'school', path: '/' },
  { id: 'practice', label: 'Luyện tập', icon: 'piano', path: '/practice' },
  { id: 'compose', label: 'Soạn nhạc', icon: 'edit_note', path: '/demo' },
  { id: 'profile', label: 'Cá nhân', icon: 'person', path: '/' },
]

/**
 * BottomNavigation - Mobile bottom tab navigation
 * 4-tab layout matching the design mockup
 */
export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  className = '',
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Determine active tab from location if not provided
  const getActiveTab = (): BottomNavTab => {
    if (activeTab) return activeTab

    const path = location.pathname
    if (path === '/' || path.startsWith('/module')) return 'theory'
    if (path.startsWith('/practice')) return 'practice'
    if (path.startsWith('/demo') || path.startsWith('/compose')) return 'compose'
    if (path.startsWith('/profile')) return 'profile'
    return 'theory'
  }

  const currentTab = getActiveTab()

  const handleTabClick = (tab: NavItem) => {
    navigate(tab.path)
  }

  return (
    <nav
      data-testid="bottom-navigation"
      className={`
        fixed bottom-0 left-0 right-0 z-20
        bg-white dark:bg-slate-900
        border-t border-slate-200 dark:border-slate-700
        ${className}
      `}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-stretch h-11">
        {NAV_ITEMS.map((item) => {
          const isActive = currentTab === item.id

          return (
            <button
              key={item.id}
              data-testid={`bottom-nav-${item.id}`}
              onClick={() => handleTabClick(item)}
              className={`
                flex-1 flex flex-col items-center justify-center gap-0.5
                transition-all duration-200 touch-target-sm
                ${
                  isActive
                    ? 'bg-[#1e40af] text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }
              `}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Icon */}
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>

              {/* Label */}
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNavigation
