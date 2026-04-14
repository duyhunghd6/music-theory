import React, { useState, useRef, useEffect, useMemo } from 'react'
import { AbcRenderer } from '../abc/AbcRenderer'
import { InlineGuitar } from '../VirtualGuitar/InlineGuitar'
import { InlinePiano } from '../VirtualPiano/InlinePiano'
import { InlineFlute } from '../../features/sao-truc/components/InlineFlute'
import { InlineGrandStaff } from '../MusicStaff/InlineGrandStaff'
import { InlineQuiz } from './InlineQuiz'
import { useProgressStore } from '../../stores/useProgressStore'

interface ProgressiveTheoryContentProps {
  content: string
  submoduleId?: string // Used to scope bypass state per submodule
  onAllSectionsComplete?: () => void // Called when all sections are revealed (permanent completion)
  onBypassActivated?: () => void // Called when user clicks bypass (session-only reveal)
  onVisibleCountChange?: (count: number, total: number) => void // Called when visible sections change
  onCurrentSectionChange?: (index: number) => void // Called when current visible section changes
  externalScrollToSection?: number // External trigger to scroll to a specific section
  externalRevealUpToSection?: number // External trigger to reveal sections up to this index (for completed submodules)
}

interface ContentBlock {
  type: 'html' | 'abc' | 'grandStaff' | 'guitar' | 'piano' | 'flute' | 'quiz'
  content: string
  title?: string
  notes?: string[]
  question?: string
  options?: string[]
  correctIndex?: number
  explanation?: string
}

/**
 * Split content into sections by "---" separator
 * Each section contains content blocks (html, abc, piano, guitar, flute, quiz)
 */
function splitIntoSections(content: string): string[] {
  return content
    .split(/\n---\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

/**
 * Parse a section's content into blocks
 */
function parseSectionContent(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = []

  // Combined pattern for abc, grandStaff, guitar, piano, flute
  // Use [\s\S]+? to match multi-line content (for grandStaff with ABC notation)
  const combinedPattern = /\{\{(abc|grandStaff|guitar|piano|flute):([^|]+)\|([\s\S]+?)\}\}/g
  // Quiz pattern
  const quizPattern = /\{\{quiz:([^|]+)\|([^|]+)(?:\|([^}]+))?\}\}/g

  interface MatchInfo {
    index: number
    length: number
    block: ContentBlock
  }
  const allMatches: MatchInfo[] = []

  let match
  while ((match = combinedPattern.exec(content)) !== null) {
    const blockType = match[1] as 'abc' | 'grandStaff' | 'guitar' | 'piano' | 'flute'
    const title = match[2].trim()
    const blockContent = match[3].trim()

    let block: ContentBlock
    if (blockType === 'guitar' || blockType === 'piano' || blockType === 'flute') {
      const notes = blockContent.split(',').map((n) => n.trim())
      block = { type: blockType, title, content: blockContent, notes }
    } else if (blockType === 'grandStaff') {
      block = { type: 'grandStaff', title, content: blockContent }
    } else {
      block = { type: 'abc', title, content: blockContent }
    }
    allMatches.push({ index: match.index, length: match[0].length, block })
  }

  while ((match = quizPattern.exec(content)) !== null) {
    const question = match[1].trim()
    const optionsStr = match[2].trim()
    const explanation = match[3]?.trim()

    const rawOptions = optionsStr.split(';').map((o) => o.trim())
    let correctIndex = 0
    const options = rawOptions.map((opt, idx) => {
      if (opt.startsWith('*')) {
        correctIndex = idx
        return opt.slice(1)
      }
      return opt
    })

    allMatches.push({
      index: match.index,
      length: match[0].length,
      block: {
        type: 'quiz',
        content: '',
        question,
        options,
        correctIndex,
        explanation,
      },
    })
  }

  allMatches.sort((a, b) => a.index - b.index)

  let lastIndex = 0
  for (const matchInfo of allMatches) {
    if (matchInfo.index > lastIndex) {
      const htmlContent = content.slice(lastIndex, matchInfo.index)
      if (htmlContent.trim()) {
        blocks.push({
          type: 'html',
          content: formatHtmlContent(htmlContent),
        })
      }
    }
    blocks.push(matchInfo.block)
    lastIndex = matchInfo.index + matchInfo.length
  }

  if (lastIndex < content.length) {
    const htmlContent = content.slice(lastIndex)
    if (htmlContent.trim()) {
      blocks.push({
        type: 'html',
        content: formatHtmlContent(htmlContent),
      })
    }
  }

  return blocks
}

/**
 * Parse markdown table to HTML
 */
function parseMarkdownTable(tableText: string): string {
  const lines = tableText.trim().split('\n')
  if (lines.length < 2) return tableText

  const headerLine = lines[0]
  const separatorLine = lines[1]
  const dataLines = lines.slice(2)

  if (!separatorLine.includes('---')) return tableText

  const headerCells = headerLine
    .split('|')
    .filter((c) => c.trim())
    .map((c) => c.trim())

  const separatorCells = separatorLine
    .split('|')
    .filter((c) => c.trim())
    .map((c) => {
      const cell = c.trim()
      if (cell.startsWith(':') && cell.endsWith(':')) return 'center'
      if (cell.endsWith(':')) return 'right'
      return 'left'
    })

  const theadHtml = `<thead><tr>${headerCells
    .map((c, i) => {
      const align = separatorCells[i] || 'left'
      return `<th style="text-align: ${align}">${c}</th>`
    })
    .join('')}</tr></thead>`

  const tbodyRows = dataLines
    .map((line) => {
      const cells = line
        .split('|')
        .filter((c) => c.trim())
        .map((c, i) => {
          const align = separatorCells[i] || 'left'
          return `<td style="text-align: ${align}">${c.trim()}</td>`
        })
      return `<tr>${cells.join('')}</tr>`
    })
    .join('')

  return `<table><thead>${theadHtml}</thead><tbody>${tbodyRows}</tbody></table>`
}

/**
 * Format markdown to HTML
 */
function formatHtmlContent(content: string): string {
  const tablePattern = /((?:^\|.+\|\s*$\n?)+)/gm
  let result = content.replace(tablePattern, (match) => {
    if (match.includes('---')) {
      return parseMarkdownTable(match)
    }
    return match
  })

  result = result
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)+/g, '<ul>$&</ul>')

  const blocks = result.split(/\n\n+/)
  result = blocks
    .map((block) => {
      block = block.trim()
      if (
        block.startsWith('<h2>') ||
        block.startsWith('<h3>') ||
        block.startsWith('<table>') ||
        block.startsWith('<ul>') ||
        block.startsWith('<ol>')
      ) {
        return block
      }
      block = block.replace(/\n/g, '<br>')
      return block ? `<p>${block}</p>` : ''
    })
    .filter(Boolean)
    .join('\n')

  return result
}

/**
 * Check if a section contains a quiz block
 */
function sectionHasQuiz(blocks: ContentBlock[]): boolean {
  return blocks.some((b) => b.type === 'quiz')
}

/**
 * ProgressiveTheoryContent - Reveals content sections one-by-one
 * Next section unlocks after answering the current section's quiz
 */
export const ProgressiveTheoryContent: React.FC<ProgressiveTheoryContentProps> = ({
  content,
  submoduleId,
  onAllSectionsComplete,
  onBypassActivated,
  onVisibleCountChange,
  onCurrentSectionChange,
  externalScrollToSection,
  externalRevealUpToSection,
}) => {
  const sections = useMemo(() => splitIntoSections(content), [content])
  const parsedSections = useMemo(() => sections.map(parseSectionContent), [sections])

  // Calculate initial visible count: show all consecutive sections without quiz, plus the first section with quiz
  const initialVisibleCount = useMemo(() => {
    let count = 1
    for (let i = 0; i < parsedSections.length; i++) {
      if (!sectionHasQuiz(parsedSections[i])) {
        // This section has no quiz, so we need to show the next one too
        if (i + 1 < parsedSections.length) {
          count = i + 2 // +2 because we're 0-indexed and need to include the next section
        }
      } else {
        // Found a section with quiz, stop here
        break
      }
    }
    return Math.min(count, parsedSections.length)
  }, [parsedSections])

  // Get progress store actions
  const addXP = useProgressStore((state) => state.addXP)
  const setSectionProgress = useProgressStore((state) => state.setSectionProgress)
  const getSectionProgress = useProgressStore((state) => state.getSectionProgress)

  // Initialize visible count from saved progress
  const savedProgress = submoduleId ? getSectionProgress(submoduleId) : undefined
  const initialFromSaved = savedProgress?.visibleCount ?? initialVisibleCount

  // Track which sections are visible - start with saved or calculated initial count
  const [visibleCount, setVisibleCount] = useState(Math.max(initialFromSaved, initialVisibleCount))
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  // Track which quizzes have been completed (by section index)
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<number>>(new Set())

  // Track if completion callback has been called
  const completionCalledRef = useRef(false)

  // Track if user wants to bypass all quizzes and see all content (SESSION ONLY)
  // This is NOT persisted - refreshing the page will reset to normal progress
  const [bypassQuiz, setBypassQuiz] = useState(false)

  // Save section progress to store whenever visibleCount or totalSections changes
  useEffect(() => {
    if (submoduleId && sections.length > 0) {
      setSectionProgress(submoduleId, visibleCount, sections.length)
    }
  }, [submoduleId, visibleCount, sections.length, setSectionProgress])

  // Check if last section has a quiz
  const lastSectionHasQuiz = useMemo(() => {
    if (parsedSections.length === 0) return false
    return sectionHasQuiz(parsedSections[parsedSections.length - 1])
  }, [parsedSections])

  const handleQuizComplete = (sectionIndex: number) => {
    // Mark this quiz as completed
    setCompletedQuizzes((prev) => new Set([...prev, sectionIndex]))

    // Award XP for quiz completion (triggers Supabase sync via store subscription)
    const xpReward = 5
    addXP(xpReward)
    console.log(
      `[InlineQuiz] ✅ Quiz ${sectionIndex + 1} completed in ${submoduleId || 'unknown'} - +${xpReward} XP`
    )

    // Reveal next section(s) - skip over sections without quiz
    let nextVisibleCount = visibleCount
    if (sectionIndex === visibleCount - 1 && visibleCount < sections.length) {
      // Find how many consecutive sections without quiz follow
      nextVisibleCount = visibleCount + 1
      while (
        nextVisibleCount < sections.length &&
        !sectionHasQuiz(parsedSections[nextVisibleCount - 1])
      ) {
        nextVisibleCount++
      }
      setVisibleCount(nextVisibleCount)
    }

    if (nextVisibleCount > visibleCount) {
      // Content was revealed - scroll to the newly revealed section (next section after current quiz)
      const nextSectionIndex = sectionIndex + 1
      setTimeout(() => {
        const nextSectionRef = sectionRefs.current[nextSectionIndex]
        if (nextSectionRef) {
          const headerOffset = 80
          const elementPosition = nextSectionRef.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.scrollY - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })
          console.log(`[InlineQuiz] 📍 Scrolling to next content section ${nextSectionIndex + 1}`)
        }
      }, 400)
    }

    // Check if all quizzes completed (all sections revealed)
    if (nextVisibleCount >= sections.length) {
      // All sections revealed - trigger completion to open games
      if (onAllSectionsComplete && !completionCalledRef.current) {
        completionCalledRef.current = true
        console.log(`[InlineQuiz] 🎉 All quizzes completed - opening next content`)
        setTimeout(onAllSectionsComplete, 500)
      }
    }
    // Note: If there are more sections to reveal with quizzes, the auto-scroll effect will handle it
  }

  // Check for completion when all sections are visible AND last section has no quiz
  useEffect(() => {
    if (
      visibleCount === sections.length &&
      !lastSectionHasQuiz &&
      onAllSectionsComplete &&
      !completionCalledRef.current
    ) {
      completionCalledRef.current = true
      setTimeout(onAllSectionsComplete, 500)
    }
  }, [visibleCount, sections.length, lastSectionHasQuiz, onAllSectionsComplete])

  // Auto-scroll to newly revealed section after quiz completion
  const prevVisibleCountRef = useRef(visibleCount)
  useEffect(() => {
    // Only scroll if visibleCount increased (not on initial load)
    if (visibleCount > prevVisibleCountRef.current && visibleCount > 1) {
      const newSectionRef = sectionRefs.current[visibleCount - 1]
      if (newSectionRef) {
        // Delay to let the new section render and animate in
        setTimeout(() => {
          // Get the element's position and scroll with offset for sticky header
          const headerOffset = 80 // Account for sticky header height
          const elementPosition = newSectionRef.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.scrollY - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })
        }, 300) // Slightly longer delay for smoother experience
      }
    }
    prevVisibleCountRef.current = visibleCount
  }, [visibleCount])

  // Notify parent when visible count changes
  useEffect(() => {
    onVisibleCountChange?.(visibleCount, sections.length)
  }, [visibleCount, sections.length, onVisibleCountChange])

  // Track current section with intersection observer
  useEffect(() => {
    if (!onCurrentSectionChange) return

    // Track visibility ratios for all sections
    const visibilityRatios = new Map<Element, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        // Update visibility ratios
        for (const entry of entries) {
          visibilityRatios.set(entry.target, entry.intersectionRatio)
        }

        // Find the section with highest visibility
        let maxRatio = 0
        let mostVisibleIndex = 0

        sectionRefs.current.forEach((ref, index) => {
          if (ref) {
            const ratio = visibilityRatios.get(ref) || 0
            if (ratio > maxRatio) {
              maxRatio = ratio
              mostVisibleIndex = index
            }
          }
        })

        if (maxRatio > 0) {
          onCurrentSectionChange(mostVisibleIndex)
        }
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1], rootMargin: '-50px 0px -30% 0px' }
    )

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [onCurrentSectionChange, visibleCount])

  // Handle external scroll to section
  useEffect(() => {
    if (externalScrollToSection !== undefined && externalScrollToSection >= 0) {
      const targetRef = sectionRefs.current[externalScrollToSection]
      if (targetRef) {
        targetRef.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [externalScrollToSection])

  // Handle external reveal up to section (for completed submodules)
  // This reveals all sections up to and including the specified index
  useEffect(() => {
    if (externalRevealUpToSection !== undefined && externalRevealUpToSection >= 0) {
      const targetCount = externalRevealUpToSection + 1 // +1 because index is 0-based
      if (targetCount > visibleCount) {
        // Use setTimeout to avoid synchronous setState in effect
        setTimeout(() => {
          setVisibleCount(targetCount)
          // Scroll to the target section after sections are revealed
          setTimeout(() => {
            const targetRef = sectionRefs.current[externalRevealUpToSection]
            if (targetRef) {
              const headerOffset = 80
              const elementPosition = targetRef.getBoundingClientRect().top
              const offsetPosition = elementPosition + window.scrollY - headerOffset
              window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
            }
          }, 100)
        }, 0)
      }
    }
  }, [externalRevealUpToSection, visibleCount])

  const renderBlock = (block: ContentBlock, blockIndex: number, sectionIndex: number) => {
    if (block.type === 'abc') {
      return (
        <div key={`abc-${blockIndex}`} className="abc-renderer-wrapper">
          <AbcRenderer abc={block.content} title={block.title} />
        </div>
      )
    }

    if (block.type === 'guitar') {
      return (
        <div key={`guitar-${blockIndex}`} className="guitar-renderer-wrapper">
          <InlineGuitar title={block.title} highlightNotes={block.notes} />
        </div>
      )
    }

    if (block.type === 'piano') {
      return (
        <div key={`piano-${blockIndex}`} className="piano-renderer-wrapper">
          <InlinePiano title={block.title} highlightNotes={block.notes} />
        </div>
      )
    }

    if (block.type === 'flute') {
      return (
        <div key={`flute-${blockIndex}`} className="flute-renderer-wrapper">
          <InlineFlute title={block.title} highlightNotes={block.notes} />
        </div>
      )
    }

    if (block.type === 'grandStaff') {
      return (
        <div key={`grandstaff-${blockIndex}`} className="grandstaff-renderer-wrapper">
          <InlineGrandStaff title={block.title} abc={block.content} />
        </div>
      )
    }

    if (block.type === 'quiz' && block.question && block.options) {
      return (
        <div key={`quiz-${blockIndex}`} className="quiz-renderer-wrapper">
          <InlineQuiz
            question={block.question}
            options={block.options}
            correctIndex={block.correctIndex ?? 0}
            explanation={block.explanation}
            onComplete={() => handleQuizComplete(sectionIndex)}
          />
        </div>
      )
    }

    return (
      <div
        key={`html-${blockIndex}`}
        className="theory-formatted"
        dangerouslySetInnerHTML={{ __html: block.content }}
      />
    )
  }

  // Handle bypass - show all content at once (SESSION ONLY)
  // Does NOT mark as complete or persist - just reveals content for current session
  const handleBypassQuiz = () => {
    setBypassQuiz(true)
    // Show all sections visually (but don't persist this change)
    // Mark all quizzes as "answered" for UI purposes only
    const allIndices = new Set(parsedSections.map((_, i) => i))
    setCompletedQuizzes(allIndices)
    // Notify parent to show games (session-only)
    onBypassActivated?.()
    // NOTE: We intentionally do NOT:
    // - Persist to localStorage (session-only)
    // - Call onAllSectionsComplete (don't mark submodule as complete)
    // - Update visibleCount in store (use effectiveVisibleCount for display only)
  }

  // Determine how many sections to show
  const effectiveVisibleCount = bypassQuiz ? sections.length : visibleCount

  return (
    <div className="progressive-theory-content">
      {parsedSections.slice(0, effectiveVisibleCount).map((blocks, sectionIndex) => {
        const isLast = sectionIndex === effectiveVisibleCount - 1
        const hasQuiz = sectionHasQuiz(blocks)
        const isQuizCompleted = completedQuizzes.has(sectionIndex) || bypassQuiz
        const showLockedIndicator =
          isLast && hasQuiz && !isQuizCompleted && effectiveVisibleCount < sections.length

        return (
          <div
            key={`section-${sectionIndex}`}
            data-testid={`theory-section-${sectionIndex}`}
            ref={(el) => {
              sectionRefs.current[sectionIndex] = el
            }}
            className="theory-section"
            style={{
              animation: sectionIndex > 0 ? 'fadeIn 0.5s ease-out' : undefined,
            }}
          >
            {blocks.map((block, blockIndex) => renderBlock(block, blockIndex, sectionIndex))}

            {/* Show "more content locked" hint with bypass option */}
            {showLockedIndicator && (
              <div className="locked-hint-container">
                <div className="locked-hint">
                  <span className="locked-icon">🔒</span>
                  <span>Trả lời câu hỏi để tiếp tục...</span>
                </div>
                <button
                  data-testid="bypass-button"
                  className="bypass-quiz-btn"
                  onClick={handleBypassQuiz}
                  title="Bỏ qua tất cả câu hỏi và xem toàn bộ nội dung"
                >
                  👁️ XEM TẤT CẢ NỘI DUNG
                </button>
              </div>
            )}

            {/* Section separator - visual gap between sections */}
            {!isLast && isQuizCompleted && (
              <div className="section-separator">
                <span className="section-separator-icon">✦</span>
              </div>
            )}
          </div>
        )
      })}

      <style>{`
        .progressive-theory-content .theory-section {
          margin-bottom: 1.5rem;
        }
        
        /* Section separator - visual gap between content sections */
        .section-separator {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 0;
          margin: 2rem 0;
          position: relative;
        }
        
        .section-separator::before {
          content: '';
          width: 2px;
          height: 40px;
          background: linear-gradient(to bottom, transparent, rgba(48, 232, 232, 0.3), transparent);
          margin-bottom: 0.75rem;
        }
        
        .section-separator::after {
          content: '';
          width: 2px;
          height: 40px;
          background: linear-gradient(to bottom, transparent, rgba(48, 232, 232, 0.3), transparent);
          margin-top: 0.75rem;
        }
        
        .section-separator-icon {
          padding: 0.5rem;
          color: #30e8e8;
          font-size: 1.25rem;
          opacity: 0.7;
          background: rgba(48, 232, 232, 0.1);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .locked-hint-container {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 1rem;
        }
        
        .locked-hint {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(100, 116, 139, 0.1);
          border: 1px dashed rgba(100, 116, 139, 0.3);
          border-radius: 8px;
          color: #94a3b8;
          font-size: 0.9rem;
        }
        
        .locked-hint .locked-icon {
          font-size: 1.1rem;
        }
        
        .bypass-quiz-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }
        
        .bypass-quiz-btn:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        
        .bypass-quiz-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  )
}

export default ProgressiveTheoryContent
