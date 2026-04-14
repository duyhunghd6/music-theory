import React, { useState, useMemo, lazy, Suspense } from 'react'

const AbcNoteSymbol = lazy(() => import('./AbcNoteSymbol'))

interface NoteValueIdGameProps {
  submoduleId: string
  onComplete?: (score: number, total: number) => void
}

/**
 * Note value types with their properties
 */
interface NoteValue {
  id: string
  name: string
  nameVi: string
  symbol: string
  beats: number
  abcNotation: string
  description: string
}

const NOTE_VALUES: NoteValue[] = [
  {
    id: 'whole',
    name: 'Whole Note',
    nameVi: 'Nốt Tròn',
    symbol: '𝅝',
    beats: 4,
    abcNotation: 'L:1/4\nM:4/4\nK:C\nC4|]',
    description: '4 beats - longest common note',
  },
  {
    id: 'half',
    name: 'Half Note',
    nameVi: 'Nốt Trắng',
    symbol: '𝅗𝅥',
    beats: 2,
    abcNotation: 'L:1/4\nM:4/4\nK:C\nC2z2|]',
    description: '2 beats - half of a whole note',
  },
  {
    id: 'quarter',
    name: 'Quarter Note',
    nameVi: 'Nốt Đen',
    symbol: '♩',
    beats: 1,
    abcNotation: 'L:1/4\nM:4/4\nK:C\nCz3|]',
    description: '1 beat - the heartbeat of music',
  },
  {
    id: 'eighth',
    name: 'Eighth Note',
    nameVi: 'Móc Đơn',
    symbol: '♪',
    beats: 0.5,
    abcNotation: 'L:1/8\nM:4/4\nK:C\nCz7|]',
    description: '1/2 beat - twice as fast',
  },
  {
    id: 'sixteenth',
    name: 'Sixteenth Note',
    nameVi: 'Móc Kép',
    symbol: '𝅘𝅥𝅯',
    beats: 0.25,
    abcNotation: 'L:1/16\nM:4/4\nK:C\nCz15|]',
    description: '1/4 beat - very fast!',
  },
]

/**
 * Difficulty levels
 */
const LEVELS = [
  { id: 1, name: 'Level 1', noteCount: 2, notes: ['whole', 'half'] },
  { id: 2, name: 'Level 2', noteCount: 4, notes: ['whole', 'half', 'quarter', 'eighth'] },
  {
    id: 3,
    name: 'Level 3',
    noteCount: 5,
    notes: ['whole', 'half', 'quarter', 'eighth', 'sixteenth'],
  },
]

/**
 * NoteValueIdGame - Identify note values from symbols
 *
 * Proof-of-concept for Module 2.1
 * Mechanic: Show note symbol → Select correct name/value
 */
const NoteValueIdGame: React.FC<NoteValueIdGameProps> = ({
  submoduleId: _submoduleId,
  onComplete,
}) => {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const totalQuestions = 5
  const currentLevelConfig = LEVELS[currentLevel]

  // Generate questions for current level using useMemo
  const questions = useMemo(() => {
    const availableNotes = NOTE_VALUES.filter((n) => currentLevelConfig.notes.includes(n.id))
    const result: NoteValue[] = []
    for (let i = 0; i < totalQuestions; i++) {
      const randomNote = availableNotes[Math.floor(Math.random() * availableNotes.length)]
      result.push(randomNote)
    }
    return result
  }, [currentLevel, currentLevelConfig.notes])

  const currentQuestion = questions[questionIndex]

  // Get shuffled options using useMemo
  const options = useMemo(() => {
    const availableNotes = NOTE_VALUES.filter((n) => currentLevelConfig.notes.includes(n.id))
    return [...availableNotes].sort(() => Math.random() - 0.5)
  }, [currentLevelConfig.notes, questionIndex])

  // Handle answer selection
  const handleAnswer = (noteId: string) => {
    if (showFeedback) return

    setSelectedAnswer(noteId)
    setShowFeedback(true)

    const isCorrect = noteId === currentQuestion.id
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
  }

  // Handle level change (questions regenerate via useMemo when currentLevel changes)
  const handleLevelChange = (levelIndex: number) => {
    setCurrentLevel(levelIndex)
    setQuestionIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
  }

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
          What is the value of this note?
        </p>

        {/* Large Note Symbol - Using ABC rendering */}
        <div className="flex justify-center mb-4">
          <Suspense fallback={<div className="text-4xl">Loading...</div>}>
            <AbcNoteSymbol noteAbc={currentQuestion.abcNotation} width={200} height={100} />
          </Suspense>
        </div>

        {/* Hint: Beats */}
        <p className="text-sm text-slate-400 dark:text-slate-500">
          ({currentQuestion.beats} {currentQuestion.beats === 1 ? 'beat' : 'beats'} in 4/4 time)
        </p>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((note) => {
          const isSelected = selectedAnswer === note.id
          const isCorrect = note.id === currentQuestion.id
          const showCorrect = showFeedback && isCorrect
          const showWrong = showFeedback && isSelected && !isCorrect

          return (
            <button
              key={note.id}
              onClick={() => handleAnswer(note.id)}
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
                    <AbcNoteSymbol noteAbc={note.abcNotation} width={80} height={56} />
                  </Suspense>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">{note.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{note.nameVi}</p>
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
            <p className="font-bold">✅ Correct! {currentQuestion.description}</p>
          ) : (
            <p className="font-bold">
              ❌ The answer was: {currentQuestion.name} ({currentQuestion.nameVi})
            </p>
          )}
        </div>
      )}

      {/* Level Info */}
      <div className="text-center text-xs text-slate-400 dark:text-slate-500">
        Level {currentLevel + 1}: {currentLevelConfig.notes.length} note types
      </div>
    </div>
  )
}

export default NoteValueIdGame
