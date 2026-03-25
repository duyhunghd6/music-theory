import React, { useRef, useState, useCallback, useEffect } from 'react'
import type { InstrumentType } from '../../stores/useFloatingInstrumentsStore'
import { useFloatingInstrumentsStore } from '../../stores/useFloatingInstrumentsStore'
import { useIsMobile } from '../../hooks/useMediaQuery'

// Mobile-specific instrument heights
const INSTRUMENT_HEIGHTS: Record<InstrumentType, number> = {
  piano: 144, // Reduced by 20% from 180px for better mobile UX
  guitar: 150, // Increased by 15% to show all fret dots properly
  flute: 120,
}

interface FloatingInstrumentPanelProps {
  type: InstrumentType
  title: string
  icon: string
  children: React.ReactNode
}

export const FloatingInstrumentPanel: React.FC<FloatingInstrumentPanelProps> = ({
  type,
  title,
  icon,
  children,
}) => {
  const {
    instruments,
    activeInstrument,
    hideInstrument,
    minimizeInstrument,
    restoreInstrument,
    setPosition,
    setSize,
    bringToFront,
  } = useFloatingInstrumentsStore()

  const state = instruments[type]
  const isMobile = useIsMobile()
  const panelRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })

  // Handle drag start (desktop only)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile) return // Disable dragging on mobile
      if ((e.target as HTMLElement).closest('.panel-controls')) return
      if ((e.target as HTMLElement).closest('.resize-handle')) return
      bringToFront(type)
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - state.position.x,
        y: e.clientY - state.position.y,
      })
    },
    [state.position, type, bringToFront, isMobile]
  )

  // Handle resize start (desktop only)
  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile) return // Disable resizing on mobile
      e.preventDefault()
      e.stopPropagation()
      bringToFront(type)
      setIsResizing(true)
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: state.size.width,
        height: state.size.height,
      })
    },
    [state.size, type, bringToFront, isMobile]
  )

  // Handle drag
  useEffect(() => {
    if (!isDragging || isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      const newX = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffset.x))
      const newY = Math.max(0, Math.min(window.innerHeight - 50, e.clientY - dragOffset.y))
      setPosition(type, { x: newX, y: newY })
    }

    const handleMouseUp = () => setIsDragging(false)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset, type, setPosition, isMobile])

  // Handle resize
  useEffect(() => {
    if (!isResizing || isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y
      const newWidth = Math.max(300, Math.min(800, resizeStart.width + deltaX))
      const newHeight = Math.max(100, Math.min(400, resizeStart.height + deltaY))
      setSize(type, { width: newWidth, height: newHeight })
    }

    const handleMouseUp = () => setIsResizing(false)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, resizeStart, type, setSize, isMobile])

  if (!state.isVisible) return null

  const isActive = activeInstrument === type
  const zIndex = isActive ? 1000 : 900

  // Mobile: Bottom-fixed, no header, no drag/resize
  if (isMobile) {
    const mobileHeight = INSTRUMENT_HEIGHTS[type]

    return (
      <div
        ref={panelRef}
        data-testid={`floating-instrument-${type}`}
        className="fixed bottom-0 left-0 right-0 z-[1050]
                   bg-white/98 dark:bg-slate-900/98
                   backdrop-blur-md border-t-2 border-[#30e8e8]
                   shadow-top-xl transition-transform duration-300"
        style={{
          height: `${mobileHeight}px`,
          paddingBottom: 'env(safe-area-inset-bottom)',
          transform: state.isVisible ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        {/* Content only - no header on mobile */}
        <div className="h-full overflow-hidden px-1 py-1">{children}</div>
      </div>
    )
  }

  // Desktop: Keep existing draggable/resizable behavior

  // Minimized state (desktop only)
  if (state.isMinimized) {
    return (
      <div
        style={{ position: 'fixed', left: state.position.x, top: state.position.y, zIndex }}
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-[#30e8e8]/50 cursor-pointer"
        onClick={() => restoreInstrument(type)}
      >
        <div className="flex items-center gap-2 px-3 py-2">
          <span className="material-symbols-outlined text-[#30e8e8] text-sm">{icon}</span>
          <span className="text-xs font-medium text-slate-900 dark:text-white">{title}</span>
          <span className="material-symbols-outlined text-slate-400 text-sm ml-2">
            open_in_full
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={panelRef}
      data-testid={`floating-instrument-${type}`}
      style={{
        position: 'fixed',
        left: state.position.x,
        top: state.position.y,
        width: state.size.width,
        zIndex,
      }}
      className={`
        bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-2xl 
        border-2 transition-colors duration-200
        ${isActive ? 'border-[#30e8e8]' : 'border-slate-300 dark:border-slate-600/50'}
      `}
      onMouseDown={() => bringToFront(type)}
    >
      {/* Header - desktop only */}
      <div
        className="relative flex items-center justify-between px-2 py-1.5 bg-gradient-to-r from-[#30e8e8]/10 to-transparent rounded-t-xl cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        {/* Close button */}
        <button
          onClick={() => hideInstrument(type)}
          className="panel-controls w-7 h-7 flex items-center justify-center rounded-full bg-white dark:bg-slate-700 shadow-md hover:bg-red-50 dark:hover:bg-red-900/40 text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-all z-10 flex-shrink-0"
          title="Close"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>

        {/* Title */}
        <div className="flex items-center gap-1.5 flex-1 justify-center">
          <span className="material-symbols-outlined text-[#30e8e8] text-base">{icon}</span>
          <span className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            {title}
          </span>
        </div>

        {/* Minimize button */}
        <button
          onClick={() => minimizeInstrument(type)}
          className="panel-controls w-7 h-7 flex items-center justify-center rounded-full bg-white dark:bg-slate-700 shadow-md hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all z-10 flex-shrink-0"
          title="Minimize"
        >
          <span className="material-symbols-outlined text-base">remove</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-2 overflow-auto" style={{ maxHeight: state.size.height }}>
        {children}
      </div>

      {/* Resize handle - desktop only */}
      <div
        className="resize-handle absolute -bottom-1 -right-1 w-8 h-8 cursor-se-resize group flex items-end justify-end p-1"
        onMouseDown={handleResizeStart}
        title="Drag to resize"
      >
        <div className="w-4 h-4 border-r-2 border-b-2 border-[#30e8e8]/40 group-hover:border-[#30e8e8] rounded-br transition-colors" />
      </div>
    </div>
  )
}

export default FloatingInstrumentPanel
