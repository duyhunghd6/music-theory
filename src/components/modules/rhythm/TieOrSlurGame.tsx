import React, { useState, useCallback, useMemo, Suspense, lazy } from 'react'

// Lazy load ABC renderer
const InlineAbcNotation = lazy(() => import('../InlineAbcNotation'))

interface TieOrSlurGameProps {
  submoduleId: string
  onComplete?: (score: number, total: number) => void
}

/**
 * Tie/Slur examples
 */
interface Example {
  id: string
  abc: string
  answer: 'tie' | 'slur'
  explanation: string
  explanationVi: string
}

const EXAMPLES: Example[] = [
  // Ties - same pitch
  {
    id: 'tie-1',
    abc: 'L:1/4\nC2-C2|',
    answer: 'tie',
    explanation: 'Same pitch (C to C) = TIE. One continuous sound.',
    explanationVi: 'Cùng cao độ (C đến C) = DÂY LIÊN. Một âm dài liên tục.',
  },
  {
    id: 'tie-2',
    abc: 'L:1/4\nG2-G2|',
    answer: 'tie',
    explanation: 'Same pitch (G to G) = TIE. Hold the note longer.',
    explanationVi: 'Cùng cao độ (G đến G) = DÂY LIÊN. Giữ nốt lâu hơn.',
  },
  {
    id: 'tie-3',
    abc: 'L:1/4\nE-E E2|',
    answer: 'tie',
    explanation: 'Same pitch connected = TIE.',
    explanationVi: 'Cùng cao độ nối nhau = DÂY LIÊN.',
  },
  {
    id: 'tie-4',
    abc: 'L:1/4\nc2-|c2|',
    answer: 'tie',
    explanation: 'Tie across barline - still same pitch!',
    explanationVi: 'Dây liên qua vạch nhịp - vẫn cùng cao độ!',
  },
  // Slurs - different pitches
  {
    id: 'slur-1',
    abc: 'L:1/4\n(CD) (EF)|',
    answer: 'slur',
    explanation: 'Different pitches = SLUR. Play smoothly (legato).',
    explanationVi: 'Khác cao độ = LUYẾN. Chơi mượt mà (legato).',
  },
  {
    id: 'slur-2',
    abc: 'L:1/4\n(CDEF)|',
    answer: 'slur',
    explanation: 'Multiple different notes = SLUR. All connected smoothly.',
    explanationVi: 'Nhiều nốt khác nhau = LUYẾN. Tất cả nối mượt mà.',
  },
  {
    id: 'slur-3',
    abc: 'L:1/4\n(GAB)c|',
    answer: 'slur',
    explanation: 'Ascending melody with slur = legato phrasing.',
    explanationVi: 'Giai điệu đi lên với luyến = nhấn legato.',
  },
  {
    id: 'slur-4',
    abc: 'L:1/4\n(cBA)G|',
    answer: 'slur',
    explanation: 'Descending melody with slur = smooth connection.',
    explanationVi: 'Giai điệu đi xuống với luyến = kết nối mượt mà.',
  },
]

/**
 * Difficulty levels
 */
const LEVELS = [
  { id: 1, name: 'Level 1', description: 'Clear examples' },
  { id: 2, name: 'Level 2', description: 'Mixed difficulty' },
  { id: 3, name: 'Level 3', description: 'All examples' },
]

/**
 * TieOrSlurGame - Distinguish ties from slurs
 *
 * Proof-of-concept for Module 2.3
 * Mechanic: Visual discrimination - same pitch = tie, different = slur
 */
const TieOrSlurGame: React.FC<TieOrSlurGameProps> = ({ submoduleId: _submoduleId, onComplete }) => {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<'tie' | 'slur' | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const totalQuestions = 5

  // Generate questions
  const questions = useMemo(() => {
    const shuffled = [...EXAMPLES].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, totalQuestions)
  }, [currentLevel])

  const currentQuestion = questions[questionIndex]

  // Handle answer
  const handleAnswer = useCallback(
    (answer: 'tie' | 'slur') => {
      if (showFeedback) return

      setSelectedAnswer(answer)
      setShowFeedback(true)

      const isCorrect = answer === currentQuestion.answer
      if (isCorrect) {
        setScore((prev) => prev + 1)
      }

      // Move to next after delay
      setTimeout(() => {
        if (questionIndex < totalQuestions - 1) {
          setQuestionIndex((prev) => prev + 1)
          setSelectedAnswer(null)
          setShowFeedback(false)
        } else {
          const finalScore = isCorrect ? score + 1 : score
          if (onComplete) {
            onComplete(finalScore, totalQuestions)
          }
        }
      }, 2500)
    },
    [showFeedback, currentQuestion.answer, questionIndex, score, onComplete]
  )

  // Handle level change
  const handleLevelChange = useCallback((levelIndex: number) => {
    setCurrentLevel(levelIndex)
    setQuestionIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
  }, [])

  return (
    <div className="space-y-6">
      {/* Level Selector */}
      <div className="flex gap-2 justify-center">
        {LEVELS.map((level, index) => (
          <button
            key={level.id}
            onClick={() => handleLevelChange(index)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentLevel === index
                ? 'bg-primary text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {level.name}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(questionIndex / totalQuestions) * 100}%` }}
        />
      </div>

      <div className="text-center text-sm text-slate-500 dark:text-slate-400">
        Question {questionIndex + 1} of {totalQuestions} • Score: {score}/
        {questionIndex + (showFeedback ? 1 : 0)}
      </div>

      {/* Question */}
      <div className="text-center">
        <p className="text-lg font-medium text-slate-800 dark:text-white mb-2">
          Is this a Tie or a Slur?
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Look at the curved line connecting the notes
        </p>
      </div>

      {/* ABC Notation Display */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <Suspense
          fallback={
            <div className="h-20 flex items-center justify-center text-slate-400">
              Loading notation...
            </div>
          }
        >
          <InlineAbcNotation abc={currentQuestion.abc} />
        </Suspense>
      </div>

      {/* Answer Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleAnswer('tie')}
          disabled={showFeedback}
          className={`p-6 rounded-xl border-2 text-center transition-all ${
            showFeedback && currentQuestion.answer === 'tie'
              ? 'bg-emerald-100 dark:bg-emerald-900 border-emerald-500'
              : showFeedback && selectedAnswer === 'tie'
                ? 'bg-red-100 dark:bg-red-900 border-red-500'
                : selectedAnswer === 'tie'
                  ? 'border-primary bg-primary/10'
                  : 'border-slate-200 dark:border-slate-600 hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <div className="text-4xl mb-2">🔗</div>
          <div className="font-bold text-lg text-slate-800 dark:text-white">TIE</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Dây liên</div>
          <div className="text-xs text-slate-400 mt-2">Same pitch</div>
        </button>

        <button
          onClick={() => handleAnswer('slur')}
          disabled={showFeedback}
          className={`p-6 rounded-xl border-2 text-center transition-all ${
            showFeedback && currentQuestion.answer === 'slur'
              ? 'bg-emerald-100 dark:bg-emerald-900 border-emerald-500'
              : showFeedback && selectedAnswer === 'slur'
                ? 'bg-red-100 dark:bg-red-900 border-red-500'
                : selectedAnswer === 'slur'
                  ? 'border-primary bg-primary/10'
                  : 'border-slate-200 dark:border-slate-600 hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <div className="text-4xl mb-2">🎵</div>
          <div className="font-bold text-lg text-slate-800 dark:text-white">SLUR</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Luyến</div>
          <div className="text-xs text-slate-400 mt-2">Different pitches</div>
        </button>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div
          className={`p-4 rounded-lg ${
            selectedAnswer === currentQuestion.answer
              ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}
        >
          {selectedAnswer === currentQuestion.answer ? (
            <div className="text-center">
              <p className="font-bold text-lg">✅ Correct!</p>
              <p className="text-sm mt-1">{currentQuestion.explanation}</p>
              <p className="text-xs mt-1 opacity-80">{currentQuestion.explanationVi}</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="font-bold text-lg">❌ It's a {currentQuestion.answer.toUpperCase()}</p>
              <p className="text-sm mt-1">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Key Insight */}
      <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-4 text-center">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          💡 <strong>Key:</strong> Same pitch = TIE (hold note longer), Different pitches = SLUR
          (play smoothly)
        </p>
      </div>
    </div>
  )
}

export default TieOrSlurGame
