import React, { useState, useCallback, useMemo, lazy, Suspense } from 'react'

const AbcNoteSymbol = lazy(() => import('./AbcNoteSymbol'))

interface RestIdGameProps {
  submoduleId: string
  onComplete?: (score: number, total: number) => void
}

/**
 * Rest value types with their properties
 */
interface RestValue {
  id: string
  name: string
  nameVi: string
  symbol: string
  beats: number
  mnemonic: string
  description: string
  abcNotation: string
}

const REST_VALUES: RestValue[] = [
  {
    id: 'whole',
    name: 'Whole Rest',
    nameVi: 'Lặng Tròn',
    symbol: '𝄻',
    beats: 4,
    mnemonic: 'Hangs under line 4 like a heavy box',
    description: 'Rest for a whole measure (4 beats in 4/4)',
    abcNotation: 'L:1/4\nM:4/4\nK:C\nz4|]',
  },
  {
    id: 'half',
    name: 'Half Rest',
    nameVi: 'Lặng Trắng',
    symbol: '𝄼',
    beats: 2,
    mnemonic: 'Sits on top of line 3 like a hat',
    description: 'Rest for 2 beats',
    abcNotation: 'L:1/4\nM:4/4\nK:C\nz2z2|]',
  },
  {
    id: 'quarter',
    name: 'Quarter Rest',
    nameVi: 'Lặng Đen',
    symbol: '𝄽',
    beats: 1,
    mnemonic: 'Zigzag like a lightning bolt',
    description: 'Rest for 1 beat',
    abcNotation: 'L:1/4\nM:4/4\nK:C\nzz3|]',
  },
  {
    id: 'eighth',
    name: 'Eighth Rest',
    nameVi: 'Lặng Móc Đơn',
    symbol: '𝄾',
    beats: 0.5,
    mnemonic: 'Number 7 with one flag',
    description: 'Rest for half a beat',
    abcNotation: 'L:1/8\nM:4/4\nK:C\nzz7|]',
  },
  {
    id: 'sixteenth',
    name: 'Sixteenth Rest',
    nameVi: 'Lặng Móc Kép',
    symbol: '𝄿',
    beats: 0.25,
    mnemonic: 'Number 7 with two flags',
    description: 'Rest for quarter of a beat',
    abcNotation: 'L:1/16\nM:4/4\nK:C\nzz15|]',
  },
]

/**
 * Difficulty levels
 */
const LEVELS = [
  { id: 1, name: 'Level 1', rests: ['whole', 'half'] },
  { id: 2, name: 'Level 2', rests: ['whole', 'half', 'quarter'] },
  { id: 3, name: 'Level 3', rests: ['whole', 'half', 'quarter', 'eighth', 'sixteenth'] },
]

/**
 * RestIdGame - Identify rest values from symbols
 *
 * Proof-of-concept for Module 2.2
 * Mechanic: Show rest symbol → Select correct name/value
 */
const RestIdGame: React.FC<RestIdGameProps> = ({ submoduleId: _submoduleId, onComplete }) => {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const totalQuestions = 5
  const currentLevelConfig = LEVELS[currentLevel]

  // Generate questions for current level
  const questions = useMemo(() => {
    const availableRests = REST_VALUES.filter((r) => currentLevelConfig.rests.includes(r.id))
    const result: RestValue[] = []
    for (let i = 0; i < totalQuestions; i++) {
      const randomRest = availableRests[Math.floor(Math.random() * availableRests.length)]
      result.push(randomRest)
    }
    return result
  }, [currentLevel, currentLevelConfig.rests])

  const currentQuestion = questions[questionIndex]

  // Get shuffled options
  const options = useMemo(() => {
    const availableRests = REST_VALUES.filter((r) => currentLevelConfig.rests.includes(r.id))
    return [...availableRests].sort(() => Math.random() - 0.5)
  }, [currentLevelConfig.rests, questionIndex])

  // Handle answer selection
  const handleAnswer = useCallback(
    (restId: string) => {
      if (showFeedback) return

      setSelectedAnswer(restId)
      setShowFeedback(true)

      const isCorrect = restId === currentQuestion.id
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
      }, 1500)
    },
    [showFeedback, currentQuestion.id, questionIndex, score, onComplete]
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
      <div className="text-center py-8">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          What is the value of this rest?
        </p>

        {/* Large Rest Symbol - Using ABC rendering */}
        <div className="flex justify-center mb-4">
          <Suspense fallback={<div className="text-4xl">Loading...</div>}>
            <AbcNoteSymbol noteAbc={currentQuestion.abcNotation} width={200} height={100} />
          </Suspense>
        </div>

        {/* Hint: Beats */}
        <p className="text-sm text-slate-400 dark:text-slate-500">
          ({currentQuestion.beats} {currentQuestion.beats === 1 ? 'beat' : 'beats'} of silence)
        </p>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((rest) => {
          const isSelected = selectedAnswer === rest.id
          const isCorrect = rest.id === currentQuestion.id
          const showCorrect = showFeedback && isCorrect
          const showWrong = showFeedback && isSelected && !isCorrect

          return (
            <button
              key={rest.id}
              onClick={() => handleAnswer(rest.id)}
              disabled={showFeedback}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                showCorrect
                  ? 'bg-emerald-100 dark:bg-emerald-900 border-emerald-500'
                  : showWrong
                    ? 'bg-red-100 dark:bg-red-900 border-red-500'
                    : isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-slate-200 dark:border-slate-600 hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-20 h-14 flex-shrink-0">
                  <Suspense fallback={<span className="text-xl">♪</span>}>
                    <AbcNoteSymbol noteAbc={rest.abcNotation} width={80} height={56} />
                  </Suspense>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">{rest.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {rest.nameVi} • {rest.beats} beats
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div
          className={`p-4 rounded-lg text-center ${
            selectedAnswer === currentQuestion.id
              ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}
        >
          {selectedAnswer === currentQuestion.id ? (
            <div>
              <p className="font-bold">✅ Correct!</p>
              <p className="text-sm mt-1">💡 {currentQuestion.mnemonic}</p>
            </div>
          ) : (
            <p className="font-bold">
              ❌ The answer was: {currentQuestion.name} ({currentQuestion.nameVi})
            </p>
          )}
        </div>
      )}

      {/* Level Info */}
      <div className="text-center text-xs text-slate-400 dark:text-slate-500">
        Level {currentLevel + 1}: {currentLevelConfig.rests.length} rest types
      </div>
    </div>
  )
}

export default RestIdGame
