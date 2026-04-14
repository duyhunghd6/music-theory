import React, { useState, useCallback, useMemo } from 'react'

interface DottedValueCalcGameProps {
  submoduleId: string
  onComplete?: (score: number, total: number) => void
}

/**
 * Dotted note scenarios
 */
interface DottedNote {
  id: string
  baseName: string
  baseNameVi: string
  baseBeats: number
  dotType: 'single' | 'double'
  totalBeats: number
  formula: string
  symbol: string
}

const DOTTED_NOTES: DottedNote[] = [
  {
    id: 'dotted-half',
    baseName: 'Dotted Half Note',
    baseNameVi: 'Nốt Trắng Chấm',
    baseBeats: 2,
    dotType: 'single',
    totalBeats: 3,
    formula: '2 + 1 = 3',
    symbol: '𝅗𝅥.',
  },
  {
    id: 'dotted-quarter',
    baseName: 'Dotted Quarter Note',
    baseNameVi: 'Nốt Đen Chấm',
    baseBeats: 1,
    dotType: 'single',
    totalBeats: 1.5,
    formula: '1 + 0.5 = 1.5',
    symbol: '♩.',
  },
  {
    id: 'dotted-eighth',
    baseName: 'Dotted Eighth Note',
    baseNameVi: 'Móc Đơn Chấm',
    baseBeats: 0.5,
    dotType: 'single',
    totalBeats: 0.75,
    formula: '0.5 + 0.25 = 0.75',
    symbol: '♪.',
  },
  {
    id: 'dotted-whole',
    baseName: 'Dotted Whole Note',
    baseNameVi: 'Nốt Tròn Chấm',
    baseBeats: 4,
    dotType: 'single',
    totalBeats: 6,
    formula: '4 + 2 = 6',
    symbol: '𝅝.',
  },
  {
    id: 'double-dotted-half',
    baseName: 'Double-Dotted Half',
    baseNameVi: 'Nốt Trắng Chấm Đôi',
    baseBeats: 2,
    dotType: 'double',
    totalBeats: 3.5,
    formula: '2 + 1 + 0.5 = 3.5',
    symbol: '𝅗𝅥..',
  },
  {
    id: 'double-dotted-quarter',
    baseName: 'Double-Dotted Quarter',
    baseNameVi: 'Nốt Đen Chấm Đôi',
    baseBeats: 1,
    dotType: 'double',
    totalBeats: 1.75,
    formula: '1 + 0.5 + 0.25 = 1.75',
    symbol: '♩..',
  },
]

/**
 * Difficulty levels
 */
const LEVELS = [
  {
    id: 1,
    name: 'Level 1',
    description: 'Single dots only',
    notes: ['dotted-quarter', 'dotted-half'],
  },
  {
    id: 2,
    name: 'Level 2',
    description: 'All single dots',
    notes: ['dotted-quarter', 'dotted-half', 'dotted-eighth', 'dotted-whole'],
  },
  {
    id: 3,
    name: 'Level 3',
    description: 'Including double dots',
    notes: [
      'dotted-quarter',
      'dotted-half',
      'dotted-eighth',
      'double-dotted-half',
      'double-dotted-quarter',
    ],
  },
]

/**
 * DottedValueCalcGame - Calculate dotted note values
 *
 * Proof-of-concept for Module 2.3
 * Mechanic: Show dotted note → Calculate total beats
 */
const DottedValueCalcGame: React.FC<DottedValueCalcGameProps> = ({
  submoduleId: _submoduleId,
  onComplete,
}) => {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const totalQuestions = 5
  const currentLevelConfig = LEVELS[currentLevel]

  // Generate questions for current level
  const questions = useMemo(() => {
    const availableNotes = DOTTED_NOTES.filter((n) => currentLevelConfig.notes.includes(n.id))
    const result: DottedNote[] = []
    for (let i = 0; i < totalQuestions; i++) {
      const randomNote = availableNotes[Math.floor(Math.random() * availableNotes.length)]
      result.push(randomNote)
    }
    return result
  }, [currentLevel, currentLevelConfig.notes])

  const currentQuestion = questions[questionIndex]

  // Generate answer options
  const options = useMemo(() => {
    const correct = currentQuestion.totalBeats
    // Generate some wrong answers
    const wrongAnswers = [
      currentQuestion.baseBeats, // Base value without dot
      currentQuestion.baseBeats * 2, // Double the base
      correct + 0.5, // Close but wrong
      correct - 0.5, // Close but wrong
    ].filter((v) => v !== correct && v > 0)

    // Take 3 wrong answers and add correct
    const selected = wrongAnswers.slice(0, 3)
    selected.push(correct)

    // Shuffle
    return selected.sort(() => Math.random() - 0.5)
  }, [currentQuestion])

  // Handle answer selection
  const handleAnswer = useCallback(
    (value: number) => {
      if (showFeedback) return

      setSelectedAnswer(value)
      setShowFeedback(true)

      const isCorrect = value === currentQuestion.totalBeats
      if (isCorrect) {
        setScore((prev) => prev + 1)
      }

      // Move to next question after delay
      setTimeout(() => {
        if (questionIndex < totalQuestions - 1) {
          setQuestionIndex((prev) => prev + 1)
          setSelectedAnswer(null)
          setShowFeedback(false)
        } else {
          // Game complete
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

      {/* Progress Bar */}
      <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(questionIndex / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Counter */}
      <div className="text-center text-sm text-slate-500 dark:text-slate-400">
        Question {questionIndex + 1} of {totalQuestions} • Score: {score}/
        {questionIndex + (showFeedback ? 1 : 0)}
      </div>

      {/* Main Question Area */}
      <div className="text-center py-6">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          How many beats is this dotted note worth?
        </p>

        {/* Note Display */}
        <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-6 inline-block mb-4">
          <div className="text-7xl mb-2">{currentQuestion.symbol}</div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {currentQuestion.baseName}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{currentQuestion.baseNameVi}</p>
        </div>

        {/* Formula Hint */}
        <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-3 max-w-xs mx-auto">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            💡 {currentQuestion.dotType === 'single' ? 'Single' : 'Double'} dot ={' '}
            {currentQuestion.dotType === 'single' ? '+50%' : '+50% +25%'}
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Base value: {currentQuestion.baseBeats} beats
          </p>
        </div>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        {options.map((value, index) => {
          const isSelected = selectedAnswer === value
          const isCorrect = value === currentQuestion.totalBeats
          const showCorrect = showFeedback && isCorrect
          const showWrong = showFeedback && isSelected && !isCorrect

          return (
            <button
              key={index}
              onClick={() => handleAnswer(value)}
              disabled={showFeedback}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                showCorrect
                  ? 'bg-emerald-100 dark:bg-emerald-900 border-emerald-500'
                  : showWrong
                    ? 'bg-red-100 dark:bg-red-900 border-red-500'
                    : isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-slate-200 dark:border-slate-600 hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <span className="text-2xl font-bold text-slate-800 dark:text-white">{value}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">beats</span>
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
              <p className="font-bold">✅ Correct!</p>
              <p className="text-sm mt-1 font-mono">{currentQuestion.formula}</p>
            </div>
          ) : (
            <div>
              <p className="font-bold">❌ The answer was: {currentQuestion.totalBeats} beats</p>
              <p className="text-sm mt-1 font-mono">{currentQuestion.formula}</p>
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

export default DottedValueCalcGame
