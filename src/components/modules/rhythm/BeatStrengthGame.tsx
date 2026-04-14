import React, { useState, useCallback, useMemo, useEffect, useRef, lazy, Suspense } from 'react'
import { useAudioStore } from '../../../stores/useAudioStore'

const AbcNoteSymbol = lazy(() => import('./AbcNoteSymbol'))

interface BeatStrengthGameProps {
  submoduleId: string
  onComplete?: (score: number, total: number) => void
}

/**
 * Time signatures with beat patterns
 */
interface TimeSignature {
  id: string
  top: number
  bottom: number
  name: string
  nameVi: string
  beatPattern: ('strong' | 'medium' | 'weak')[]
  description: string
  abcNotation: string
}

const TIME_SIGNATURES: TimeSignature[] = [
  {
    id: '4-4',
    top: 4,
    bottom: 4,
    name: 'Common Time',
    nameVi: 'Nhịp 4/4',
    beatPattern: ['strong', 'weak', 'medium', 'weak'],
    description: 'Strong-Weak-Medium-Weak',
    abcNotation: 'L:1/4\nM:4/4\nK:C\nCDEF|]',
  },
  {
    id: '3-4',
    top: 3,
    bottom: 4,
    name: 'Waltz',
    nameVi: 'Nhịp 3/4',
    beatPattern: ['strong', 'weak', 'weak'],
    description: 'Strong-Weak-Weak (Waltz)',
    abcNotation: 'L:1/4\nM:3/4\nK:C\nCDE|]',
  },
  {
    id: '2-4',
    top: 2,
    bottom: 4,
    name: 'March',
    nameVi: 'Nhịp 2/4',
    beatPattern: ['strong', 'weak'],
    description: 'Strong-Weak (March)',
    abcNotation: 'L:1/4\nM:2/4\nK:C\nCD|]',
  },
]

/**
 * Difficulty levels
 */
const LEVELS = [
  { id: 1, name: 'Level 1', sigs: ['4-4'] },
  { id: 2, name: 'Level 2', sigs: ['4-4', '3-4'] },
  { id: 3, name: 'Level 3', sigs: ['4-4', '3-4', '2-4'] },
]

/**
 * BeatStrengthGame - Identify strong and weak beats
 *
 * Proof-of-concept for Module 2.4
 * Mechanic: Given time signature → Tap the strong beats with metronome
 */
const BeatStrengthGame: React.FC<BeatStrengthGameProps> = ({
  submoduleId: _submoduleId,
  onComplete,
}) => {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [currentBeat, setCurrentBeat] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [userTaps, setUserTaps] = useState<boolean[]>([])
  const [showResult, setShowResult] = useState(false)

  const intervalRef = useRef<number | null>(null)
  const { playNote } = useAudioStore()

  const totalQuestions = 5
  const BPM = 80 // Slow tempo for learning
  const beatDuration = 60000 / BPM

  const currentLevelConfig = LEVELS[currentLevel]

  // Generate questions
  const questions = useMemo(() => {
    const availableSigs = TIME_SIGNATURES.filter((s) => currentLevelConfig.sigs.includes(s.id))
    const result: TimeSignature[] = []
    for (let i = 0; i < totalQuestions; i++) {
      const randomSig = availableSigs[Math.floor(Math.random() * availableSigs.length)]
      result.push(randomSig)
    }
    return result
  }, [currentLevel, currentLevelConfig.sigs])

  const currentQuestion = questions[questionIndex]

  // Initialize taps array
  useEffect(() => {
    setUserTaps(new Array(currentQuestion.beatPattern.length).fill(false))
  }, [currentQuestion])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Start metronome
  const startMetronome = useCallback(() => {
    if (isPlaying) return

    setIsPlaying(true)
    setCurrentBeat(-1)
    setUserTaps(new Array(currentQuestion.beatPattern.length).fill(false))
    setShowResult(false)

    let beatCount = -1
    const totalBeats = currentQuestion.beatPattern.length * 2 // Play 2 measures

    intervalRef.current = window.setInterval(() => {
      beatCount++

      if (beatCount >= totalBeats) {
        // Stop after 2 measures
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        setIsPlaying(false)
        setShowResult(true)

        // Calculate score - how many strong beats were tapped
        setUserTaps((prev) => {
          const strongBeatsCorrect = prev.filter(
            (tapped, i) => currentQuestion.beatPattern[i] === 'strong' && tapped
          ).length
          const wrongTaps = prev.filter(
            (tapped, i) => currentQuestion.beatPattern[i] !== 'strong' && tapped
          ).length
          const strongBeatCount = currentQuestion.beatPattern.filter((b) => b === 'strong').length
          const questScore = Math.max(0, strongBeatsCorrect - wrongTaps * 0.5) / strongBeatCount

          if (questScore >= 0.5) {
            setScore((s) => s + 1)
          }

          return prev
        })

        return
      }

      const currentBeatIndex = beatCount % currentQuestion.beatPattern.length
      setCurrentBeat(currentBeatIndex)

      // Play metronome sound
      const beatType = currentQuestion.beatPattern[currentBeatIndex]
      if (beatType === 'strong') {
        playNote('C5')
      } else if (beatType === 'medium') {
        playNote('G4')
      } else {
        playNote('E4')
      }
    }, beatDuration)
  }, [isPlaying, currentQuestion, beatDuration, playNote])

  // Handle beat tap
  const handleTap = useCallback(
    (beatIndex: number) => {
      if (!isPlaying || beatIndex !== currentBeat) return

      setUserTaps((prev) => {
        const newTaps = [...prev]
        newTaps[beatIndex] = true
        return newTaps
      })
    },
    [isPlaying, currentBeat]
  )

  // Move to next question
  const handleNext = useCallback(() => {
    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex((prev) => prev + 1)
      setShowResult(false)
      setCurrentBeat(-1)
      setUserTaps([])
    } else {
      if (onComplete) {
        onComplete(score, totalQuestions)
      }
    }
  }, [questionIndex, score, onComplete])

  // Handle level change
  const handleLevelChange = useCallback((levelIndex: number) => {
    setCurrentLevel(levelIndex)
    setQuestionIndex(0)
    setScore(0)
    setShowResult(false)
    setCurrentBeat(-1)
    setUserTaps([])
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsPlaying(false)
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
      <div className="text-center text-sm text-slate-500 dark:text-slate-400">
        Question {questionIndex + 1} of {totalQuestions} • Score: {score}
      </div>

      {/* Time Signature Display - Using ABC rendering */}
      <div className="text-center py-4">
        <Suspense fallback={<div className="text-4xl">Loading...</div>}>
          <AbcNoteSymbol noteAbc={currentQuestion.abcNotation} width={300} height={120} />
        </Suspense>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          {currentQuestion.name} • {currentQuestion.nameVi}
        </p>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-slate-600 dark:text-slate-400">
        <p>
          🎯 Tap only on the <strong>STRONG</strong> beats!
        </p>
        <p className="text-xs mt-1">{currentQuestion.description}</p>
      </div>

      {/* Beat Pads */}
      <div className="flex justify-center gap-3">
        {currentQuestion.beatPattern.map((beatType, index) => {
          const isActive = currentBeat === index
          const wasTapped = userTaps[index]
          const isStrong = beatType === 'strong'

          return (
            <button
              key={index}
              onClick={() => handleTap(index)}
              disabled={!isPlaying}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${
                isActive ? 'scale-110 ring-4 ring-primary ring-opacity-50' : ''
              } ${
                wasTapped && isStrong
                  ? 'bg-emerald-500 text-white'
                  : wasTapped && !isStrong
                    ? 'bg-red-500 text-white'
                    : isStrong
                      ? 'bg-primary/20 border-2 border-primary text-primary'
                      : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400'
              }`}
            >
              {index + 1}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-primary/20 border-2 border-primary" />
          <span className="text-slate-500">Strong</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-600" />
          <span className="text-slate-500">Weak</span>
        </div>
      </div>

      {/* Controls */}
      <div className="text-center">
        {!isPlaying && !showResult && (
          <button
            onClick={startMetronome}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            ▶️ Start Metronome
          </button>
        )}

        {isPlaying && (
          <div className="text-lg font-medium text-primary animate-pulse">
            🎵 Tap the strong beats!
          </div>
        )}

        {showResult && (
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            {questionIndex < totalQuestions - 1 ? 'Next Question →' : 'Finish 🎉'}
          </button>
        )}
      </div>

      {/* Result Feedback */}
      {showResult && (
        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 text-center">
          <p className="font-medium">
            Pattern:{' '}
            {currentQuestion.beatPattern.map((b, i) => (
              <span
                key={i}
                className={`mx-1 ${b === 'strong' ? 'text-primary font-bold' : 'text-slate-400'}`}
              >
                {b === 'strong' ? '●' : '○'}
              </span>
            ))}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {currentQuestion.description}
          </p>
        </div>
      )}
    </div>
  )
}

export default BeatStrengthGame
