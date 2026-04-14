import React, { useState, Suspense, lazy } from 'react'
import { AppLayout } from '../components/layout/AppLayout'

// Lazy load game components for proof-of-concept
const NoteValueIdGame = lazy(() => import('../components/modules/rhythm/NoteValueIdGame'))
const RestIdGame = lazy(() => import('../components/modules/rhythm/RestIdGame'))
const DottedValueCalcGame = lazy(() => import('../components/modules/rhythm/DottedValueCalcGame'))
const TempoTermGame = lazy(() => import('../components/modules/rhythm/TempoTermGame'))
const BeatStrengthGame = lazy(() => import('../components/modules/rhythm/BeatStrengthGame'))
const TieOrSlurGame = lazy(() => import('../components/modules/rhythm/TieOrSlurGame'))
const BeatCounterGame = lazy(() => import('../components/modules/rhythm/BeatCounterGame'))
const RhythmTapGame = lazy(() => import('../components/modules/rhythm/RhythmTapGame'))

/**
 * Game category for navigation
 */
interface GameCategory {
  id: string
  name: string
  emoji: string
  description: string
  games: GameInfo[]
}

interface GameInfo {
  id: string
  name: string
  nameVi: string
  submodule: string
  tier: 'recognition' | 'recall' | 'application'
  status: 'ready' | 'wip' | 'planned'
}

/**
 * All Module 2 games organized by category
 */
const GAME_CATEGORIES: GameCategory[] = [
  {
    id: 'recognition',
    name: 'Tier 1: Recognition',
    emoji: '👁️',
    description: 'Visual identification games (no audio timing)',
    games: [
      {
        id: 'note-value-id',
        name: 'Note Value ID',
        nameVi: 'Nhận Diện Giá Trị Nốt',
        submodule: '2.1',
        tier: 'recognition',
        status: 'ready',
      },
      {
        id: 'rest-id',
        name: 'Rest ID',
        nameVi: 'Nhận Diện Dấu Lặng',
        submodule: '2.2',
        tier: 'recognition',
        status: 'ready',
      },
      {
        id: 'dotted-value-calc',
        name: 'Dotted Value Calculator',
        nameVi: 'Tính Giá Trị Nốt Chấm',
        submodule: '2.3',
        tier: 'recognition',
        status: 'ready',
      },
      {
        id: 'tempo-term',
        name: 'Tempo Terms',
        nameVi: 'Thuật Ngữ Tempo',
        submodule: '2.6',
        tier: 'recognition',
        status: 'ready',
      },
    ],
  },
  {
    id: 'recall',
    name: 'Tier 2: Active Recall',
    emoji: '🎧',
    description: 'Audio identification and interaction games',
    games: [
      {
        id: 'beat-strength',
        name: 'Beat Strength',
        nameVi: 'Độ Mạnh Nhịp',
        submodule: '2.4',
        tier: 'recall',
        status: 'ready',
      },
      {
        id: 'tie-or-slur',
        name: 'Tie or Slur?',
        nameVi: 'Dây Liên hay Luyến?',
        submodule: '2.3',
        tier: 'recall',
        status: 'ready',
      },
    ],
  },
  {
    id: 'application',
    name: 'Tier 3: Application',
    emoji: '🥁',
    description: 'Complex timing and counting games',
    games: [
      {
        id: 'beat-counter',
        name: 'Beat Counter',
        nameVi: 'Đếm Phách',
        submodule: '2.1',
        tier: 'application',
        status: 'ready',
      },
      {
        id: 'rhythm-tap',
        name: 'Rhythm Tap',
        nameVi: 'Gõ Nhịp',
        submodule: '2.1-2.5',
        tier: 'application',
        status: 'ready',
      },
    ],
  },
]

/**
 * Module 2 Game Test Page
 *
 * Proof-of-concept testing environment for all rhythm games.
 * Access: /test-games-m2
 */
const Module2GameTestPage: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [gameResult, setGameResult] = useState<{
    score: number
    total: number
  } | null>(null)

  // Handle game completion
  const handleGameComplete = (score: number, total: number) => {
    setGameResult({ score, total })
    console.log(`[Module2GameTestPage] Game complete: ${score}/${total}`)
  }

  // Reset game
  const handleResetGame = () => {
    setGameResult(null)
  }

  // Render selected game component
  const renderGameComponent = () => {
    if (!selectedGame) return null

    const gameProps = {
      submoduleId: 'test-m2',
      onComplete: handleGameComplete,
    }

    // Game loading fallback
    const LoadingFallback = (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-slate-400">Loading game...</div>
      </div>
    )

    return (
      <Suspense fallback={LoadingFallback}>
        {selectedGame === 'note-value-id' && <NoteValueIdGame {...gameProps} />}
        {selectedGame === 'rest-id' && <RestIdGame {...gameProps} />}
        {selectedGame === 'dotted-value-calc' && <DottedValueCalcGame {...gameProps} />}
        {selectedGame === 'tempo-term' && <TempoTermGame {...gameProps} />}
        {selectedGame === 'beat-strength' && <BeatStrengthGame {...gameProps} />}
        {selectedGame === 'tie-or-slur' && <TieOrSlurGame {...gameProps} />}
        {selectedGame === 'beat-counter' && <BeatCounterGame {...gameProps} />}
        {selectedGame === 'rhythm-tap' && <RhythmTapGame {...gameProps} />}
      </Suspense>
    )
  }

  // Find selected game info
  const selectedGameInfo = GAME_CATEGORIES.flatMap((c) => c.games).find(
    (g) => g.id === selectedGame
  )

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Page Header */}
        <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            🎵 Module 2 Game Test Page
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Proof-of-concept testing for Rhythm & Meter games. Test on mobile before integration.
          </p>
        </div>

        {/* Game Selection */}
        {!selectedGame && (
          <div className="space-y-6">
            {GAME_CATEGORIES.map((category) => (
              <section
                key={category.id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
              >
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                    {category.emoji} {category.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {category.description}
                  </p>
                </div>

                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {category.games.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => {
                        setSelectedGame(game.id)
                        setGameResult(null)
                      }}
                      disabled={game.status === 'planned'}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        game.status === 'planned'
                          ? 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
                          : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-primary hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-800 dark:text-white">
                          {game.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            game.status === 'ready'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                              : game.status === 'wip'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                                : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {game.status === 'ready'
                            ? '✅ Ready'
                            : game.status === 'wip'
                              ? '🔧 WIP'
                              : '📋 Planned'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {game.nameVi} • Submodule {game.submodule}
                      </p>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Game Container */}
        {selectedGame && (
          <div className="space-y-4">
            {/* Game Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  {selectedGameInfo?.name}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {selectedGameInfo?.nameVi} • Submodule {selectedGameInfo?.submodule}
                </p>
              </div>
              <button
                onClick={() => setSelectedGame(null)}
                className="px-4 py-2 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                ← Back to Games
              </button>
            </div>

            {/* Game Result Banner */}
            {gameResult && (
              <div
                className={`p-4 rounded-lg ${
                  gameResult.score / gameResult.total >= 0.6
                    ? 'bg-emerald-100 dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-700'
                    : 'bg-amber-100 dark:bg-amber-900 border border-amber-300 dark:border-amber-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg">
                      {gameResult.score / gameResult.total >= 0.6
                        ? '🎉 Great Job!'
                        : '💪 Keep Practicing!'}
                    </p>
                    <p className="text-sm opacity-80">
                      Score: {gameResult.score}/{gameResult.total} (
                      {Math.round((gameResult.score / gameResult.total) * 100)}%)
                    </p>
                  </div>
                  <button
                    onClick={handleResetGame}
                    className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-all"
                  >
                    🔄 Play Again
                  </button>
                </div>
              </div>
            )}

            {/* Game Content */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
              {!gameResult && renderGameComponent()}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 dark:text-slate-500 py-4">
          💡 Test each game on desktop and mobile (iPhone) before approving for integration.
        </div>
      </div>
    </AppLayout>
  )
}

export default Module2GameTestPage
