import React, { useState, useCallback, useMemo, Suspense, lazy } from 'react'

// Lazy load ABC renderer
const InlineAbcNotation = lazy(() => import('../InlineAbcNotation'))

interface BeatCounterGameProps {
  submoduleId: string
  onComplete?: (score: number, total: number) => void
}

/**
 * Measure examples for counting
 */
interface MeasureExample {
  id: string
  abc: string
  totalBeats: number
  breakdown: string
  description: string
}

const MEASURES: MeasureExample[] = [
  // Level 1: Simple single note types
  {
    id: 'simple-1',
    abc: 'L:1/4\nM:4/4\nC D E F|',
    totalBeats: 4,
    breakdown: '1 + 1 + 1 + 1 = 4',
    description: '4 quarter notes',
  },
  {
    id: 'simple-2',
    abc: 'L:1/4\nM:4/4\nC2 D2|',
    totalBeats: 4,
    breakdown: '2 + 2 = 4',
    description: '2 half notes',
  },
  {
    id: 'simple-3',
    abc: 'L:1/4\nM:4/4\nC4|',
    totalBeats: 4,
    breakdown: '4 = 4',
    description: '1 whole note',
  },
  {
    id: 'simple-4',
    abc: 'L:1/4\nM:3/4\nC D E|',
    totalBeats: 3,
    breakdown: '1 + 1 + 1 = 3',
    description: '3 quarter notes in 3/4',
  },

  // Level 2: Mixed note values
  {
    id: 'mixed-1',
    abc: 'L:1/4\nM:4/4\nC2 D E|',
    totalBeats: 4,
    breakdown: '2 + 1 + 1 = 4',
    description: 'Half + 2 quarters',
  },
  {
    id: 'mixed-2',
    abc: 'L:1/4\nM:4/4\nC D2 E|',
    totalBeats: 4,
    breakdown: '1 + 2 + 1 = 4',
    description: 'Quarter + half + quarter',
  },
  {
    id: 'mixed-3',
    abc: 'L:1/4\nM:4/4\nC/D/E/F/ G2|',
    totalBeats: 4,
    breakdown: '0.5×4 + 2 = 4',
    description: '4 eighths + half',
  },
  {
    id: 'mixed-4',
    abc: 'L:1/4\nM:4/4\nC2 D/E/F/G/|',
    totalBeats: 4,
    breakdown: '2 + 0.5×4 = 4',
    description: 'Half + 4 eighths',
  },

  // Level 3: Complex with rests
  {
    id: 'complex-1',
    abc: 'L:1/4\nM:4/4\nC z D E|',
    totalBeats: 4,
    breakdown: '1 + 1 + 1 + 1 = 4',
    description: 'With quarter rest',
  },
  {
    id: 'complex-2',
    abc: 'L:1/4\nM:4/4\nC2 z2|',
    totalBeats: 4,
    breakdown: '2 + 2 = 4',
    description: 'Half note + half rest',
  },
  {
    id: 'complex-3',
    abc: 'L:1/4\nM:4/4\nC/D/ E z F|',
    totalBeats: 4,
    breakdown: '0.5+0.5 + 1 + 1 + 1 = 4',
    description: 'Eighths + quarter rest',
  },
  {
    id: 'complex-4',
    abc: 'L:1/4\nM:4/4\nC3/2 D/ E z|',
    totalBeats: 4,
    breakdown: '1.5 + 0.5 + 1 + 1 = 4',
    description: 'Dotted quarter pattern',
  },
]

/**
 * Difficulty levels
 */
const LEVELS = [
  {
    id: 1,
    name: 'Level 1',
    description: 'Simple single note types',
    measures: ['simple-1', 'simple-2', 'simple-3', 'simple-4'],
  },
  {
    id: 2,
    name: 'Level 2',
    description: 'Mixed note values',
    measures: ['mixed-1', 'mixed-2', 'mixed-3', 'mixed-4'],
  },
  {
    id: 3,
    name: 'Level 3',
    description: 'Notes and rests',
    measures: ['complex-1', 'complex-2', 'complex-3', 'complex-4'],
  },
]

/**
 * BeatCounterGame - Count total beats in a measure
 *
 * Proof-of-concept for Module 2.1
 * Mechanic: Show measure → Count and enter total beats
 */
const BeatCounterGame: React.FC<BeatCounterGameProps> = ({
  submoduleId: _submoduleId,
  onComplete,
}) => {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const totalQuestions = 4
  const currentLevelConfig = LEVELS[currentLevel]

  // Generate questions
  const questions = useMemo(() => {
    const availableMeasures = MEASURES.filter((m) => currentLevelConfig.measures.includes(m.id))
    return [...availableMeasures].sort(() => Math.random() - 0.5)
  }, [currentLevel, currentLevelConfig.measures])

  const currentQuestion = questions[questionIndex]

  // Answer options (common beat counts)
  const options = [2, 3, 4, 5, 6]

  // Handle answer
  const handleAnswer = useCallback(
    (value: number) => {
      if (showFeedback) return

      setSelectedAnswer(value)
      setShowFeedback(true)

      const isCorrect = value === currentQuestion.totalBeats
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
      }, 2000)
    },
    [showFeedback, currentQuestion.totalBeats, questionIndex, score, onComplete]
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
      <div className="flex gap-2 justify-center flex-wrap">
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
          How many beats are in this measure?
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Count all notes and rests</p>
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
        <p className="text-xs text-center text-slate-400 mt-2">{currentQuestion.description}</p>
      </div>

      {/* Answer Options */}
      <div className="flex justify-center gap-3">
        {options.map((value) => {
          const isSelected = selectedAnswer === value
          const isCorrect = value === currentQuestion.totalBeats
          const showCorrect = showFeedback && isCorrect
          const showWrong = showFeedback && isSelected && !isCorrect

          return (
            <button
              key={value}
              onClick={() => handleAnswer(value)}
              disabled={showFeedback}
              className={`w-16 h-16 rounded-xl text-2xl font-bold transition-all ${
                showCorrect
                  ? 'bg-emerald-500 text-white scale-110'
                  : showWrong
                    ? 'bg-red-500 text-white'
                    : isSelected
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-primary/20'
              }`}
            >
              {value}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div
          className={`p-4 rounded-lg text-center ${
            selectedAnswer === currentQuestion.totalBeats
              ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}
        >
          {selectedAnswer === currentQuestion.totalBeats ? (
            <div>
              <p className="font-bold text-lg">✅ Correct!</p>
              <p className="font-mono text-sm mt-1">{currentQuestion.breakdown}</p>
            </div>
          ) : (
            <div>
              <p className="font-bold text-lg">❌ Answer: {currentQuestion.totalBeats} beats</p>
              <p className="font-mono text-sm mt-1">{currentQuestion.breakdown}</p>
            </div>
          )}
        </div>
      )}

      {/* Level Info */}
      <div className="text-center text-xs text-slate-400 dark:text-slate-500">
        {currentLevelConfig.description}
      </div>
    </div>
  )
}

export default BeatCounterGame
