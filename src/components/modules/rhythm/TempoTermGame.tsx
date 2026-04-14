import React, { useState, useCallback, useMemo } from 'react'

interface TempoTermGameProps {
  submoduleId: string
  onComplete?: (score: number, total: number) => void
}

/**
 * Italian tempo terms
 */
interface TempoTerm {
  id: string
  name: string
  nameVi: string
  bpmMin: number
  bpmMax: number
  character: string
  emoji: string
}

const TEMPO_TERMS: TempoTerm[] = [
  {
    id: 'largo',
    name: 'Largo',
    nameVi: 'Rộng, trang nghiêm',
    bpmMin: 40,
    bpmMax: 60,
    character: 'Broad, stately',
    emoji: '🐢',
  },
  {
    id: 'adagio',
    name: 'Adagio',
    nameVi: 'Thư thả',
    bpmMin: 60,
    bpmMax: 76,
    character: 'Slow, expressive',
    emoji: '🚶',
  },
  {
    id: 'andante',
    name: 'Andante',
    nameVi: 'Đi bộ',
    bpmMin: 76,
    bpmMax: 108,
    character: 'Walking pace',
    emoji: '🚶‍♂️',
  },
  {
    id: 'moderato',
    name: 'Moderato',
    nameVi: 'Vừa phải',
    bpmMin: 108,
    bpmMax: 120,
    character: 'Moderate speed',
    emoji: '🏃‍♀️',
  },
  {
    id: 'allegro',
    name: 'Allegro',
    nameVi: 'Nhanh, vui vẻ',
    bpmMin: 120,
    bpmMax: 168,
    character: 'Fast, bright',
    emoji: '🏃',
  },
  {
    id: 'vivace',
    name: 'Vivace',
    nameVi: 'Sống động',
    bpmMin: 168,
    bpmMax: 176,
    character: 'Lively, fast',
    emoji: '⚡',
  },
  {
    id: 'presto',
    name: 'Presto',
    nameVi: 'Rất nhanh',
    bpmMin: 176,
    bpmMax: 200,
    character: 'Very fast',
    emoji: '🚀',
  },
]

/**
 * Difficulty levels
 */
const LEVELS = [
  {
    id: 1,
    name: 'Level 1',
    description: 'Slow tempos',
    terms: ['largo', 'adagio', 'andante'],
  },
  {
    id: 2,
    name: 'Level 2',
    description: '+ Medium tempos',
    terms: ['largo', 'adagio', 'andante', 'moderato', 'allegro'],
  },
  {
    id: 3,
    name: 'Level 3',
    description: 'All 7 terms',
    terms: ['largo', 'adagio', 'andante', 'moderato', 'allegro', 'vivace', 'presto'],
  },
]

/**
 * TempoTermGame - Match BPM to Italian tempo terms
 *
 * Proof-of-concept for Module 2.6
 * Mechanic: Given BPM → Choose Italian term
 */
const TempoTermGame: React.FC<TempoTermGameProps> = ({ submoduleId: _submoduleId, onComplete }) => {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const totalQuestions = 5
  const currentLevelConfig = LEVELS[currentLevel]

  // Generate questions with random BPM values
  const questions = useMemo(() => {
    const availableTerms = TEMPO_TERMS.filter((t) => currentLevelConfig.terms.includes(t.id))
    const result: { term: TempoTerm; bpm: number }[] = []

    for (let i = 0; i < totalQuestions; i++) {
      const randomTerm = availableTerms[Math.floor(Math.random() * availableTerms.length)]
      // Random BPM within the term's range
      const bpm =
        Math.floor(Math.random() * (randomTerm.bpmMax - randomTerm.bpmMin)) + randomTerm.bpmMin
      result.push({ term: randomTerm, bpm })
    }

    return result
  }, [currentLevel, currentLevelConfig.terms])

  const currentQuestion = questions[questionIndex]

  // Get shuffled options
  const options = useMemo(() => {
    const availableTerms = TEMPO_TERMS.filter((t) => currentLevelConfig.terms.includes(t.id))
    return [...availableTerms].sort(() => Math.random() - 0.5)
  }, [currentLevelConfig.terms, questionIndex])

  // Handle answer selection
  const handleAnswer = useCallback(
    (termId: string) => {
      if (showFeedback) return

      setSelectedAnswer(termId)
      setShowFeedback(true)

      const isCorrect = termId === currentQuestion.term.id
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
    [showFeedback, currentQuestion.term.id, questionIndex, score, onComplete]
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
          What tempo term matches this BPM?
        </p>

        {/* BPM Display */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/10 rounded-2xl p-8 inline-block">
          <div className="text-6xl font-bold text-primary mb-2">{currentQuestion.bpm}</div>
          <div className="text-lg text-slate-600 dark:text-slate-400">BPM</div>
          <div className="text-sm text-slate-500 dark:text-slate-500 mt-2">(Beats Per Minute)</div>
        </div>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((term) => {
          const isSelected = selectedAnswer === term.id
          const isCorrect = term.id === currentQuestion.term.id
          const showCorrect = showFeedback && isCorrect
          const showWrong = showFeedback && isSelected && !isCorrect

          return (
            <button
              key={term.id}
              onClick={() => handleAnswer(term.id)}
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
                <span className="text-2xl">{term.emoji}</span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 dark:text-white">{term.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{term.nameVi}</p>
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
            selectedAnswer === currentQuestion.term.id
              ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}
        >
          {selectedAnswer === currentQuestion.term.id ? (
            <div>
              <p className="font-bold">✅ Correct! {currentQuestion.term.emoji}</p>
              <p className="text-sm mt-1">
                {currentQuestion.bpm} BPM is {currentQuestion.term.character}
              </p>
            </div>
          ) : (
            <p className="font-bold">
              ❌ The answer was: {currentQuestion.term.name} ({currentQuestion.term.bpmMin}-
              {currentQuestion.term.bpmMax} BPM)
            </p>
          )}
        </div>
      )}

      {/* Mnemonic Card */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
          💡 Mnemonic: "Large Ant, And Mice, All Very Powerful"
        </p>
        <div className="flex justify-center gap-1 text-xs">
          {TEMPO_TERMS.slice(0, 7).map((t) => (
            <span key={t.id} className="text-slate-400">
              {t.name.charAt(0)}
            </span>
          ))}
        </div>
      </div>

      {/* Level Info */}
      <div className="text-center text-xs text-slate-400 dark:text-slate-500">
        {currentLevelConfig.description}
      </div>
    </div>
  )
}

export default TempoTermGame
