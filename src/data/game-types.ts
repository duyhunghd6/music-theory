/**
 * Game Types - Shared type definitions for the game system
 *
 * This module defines the core interfaces used across the game registry,
 * game components, and submodule configurations.
 */

/**
 * Configuration options for individual games.
 * These can be set as defaults in the registry or overridden per-submodule.
 */
export interface GameConfig {
  /** Number of questions in the game session */
  questionCount: number
  /** Time limit in seconds, null for untimed games */
  timerSeconds: number | null
  /** Difficulty level affecting game parameters */
  difficulty?: 'easy' | 'medium' | 'hard'
  /** Specific notes to use (for note-based games) */
  notes: string[]
  /** Required score percentage to pass (default 60) */
  requiredScore?: number
  /** XP reward for completing the game */
  xpReward?: number
  /** Number of stars available (1-3) */
  maxStars?: number
  /** Initial game type for multi-mode components */
  initialGameType?: 'note-id' | 'instrument-match' | 'staff-placement'
}

/**
 * Props passed to all game components.
 * Each game component must accept these standard props.
 */
export interface GameComponentProps extends GameConfig {
  /** ID of the submodule containing this game */
  submoduleId: string
  /** Callback when game is completed */
  onComplete?: (score: number, total: number) => void
}

/**
 * Game configuration as defined in submodule data files.
 * References a game by its registry ID and allows config overrides.
 */
export interface SubmoduleGameConfig {
  /** Game type ID - must match a key in GAME_REGISTRY */
  type: string
  /** Optional display name override */
  label?: string
  /** Optional Vietnamese display name override */
  labelVi?: string
  /** Optional description override */
  description?: string
  /** Optional Vietnamese description override */
  descriptionVi?: string
  /** Configuration overrides for this specific submodule */
  config?: Partial<GameConfig>
}

/**
 * Default game configuration values.
 * Used when no specific config is provided.
 */
export const DEFAULT_GAME_CONFIG: GameConfig = {
  questionCount: 5,
  timerSeconds: null,
  difficulty: 'medium',
  notes: [],
  requiredScore: 60,
  xpReward: 30,
  maxStars: 3,
}

/**
 * Merge default config with game defaults and submodule overrides.
 */
export function mergeGameConfig(
  gameDefaults: Partial<GameConfig>,
  submoduleOverrides?: Partial<GameConfig>
): GameConfig {
  return {
    ...DEFAULT_GAME_CONFIG,
    ...gameDefaults,
    ...submoduleOverrides,
  }
}
