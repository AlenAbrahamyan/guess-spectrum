export type { Lang } from './i18n/translations'

export type Player = {
  id: string
  name: string
  score: number
}

export type Category = {
  left: string
  right: string
}

export type Round = {
  target: number       // 0–100, pre-generated
  clue: string
  category: Category
  guesses: Record<string, number>   // playerId → guessValue
  scores: Record<string, number>    // playerId → pointsAwarded
}

export type GamePhase =
  | 'MainMenu'
  | 'Info'
  | 'Lobby'
  | 'RoleSelection'
  | 'CluePhase'
  | 'GuessPassing'   // full-screen "pass phone to [guesser]" between guesses
  | 'GuessPhase'
  | 'RevealPhase'
  | 'Scoreboard'

export type GameState = {
  phase: GamePhase
  players: Player[]
  rounds: Round[]
  currentRound: number
  clueGiverIndex: number
  currentGuess: number          // live dial value, reset to 50 for each guesser
  maxRounds: number
  selectedCategories: number[]
  customCategories: Category[]
  language: import('./i18n/translations').Lang
  guesserQueue: string[]        // ordered player IDs who guess this round
  currentGuesserTurn: number    // index into guesserQueue
}

/** One guesser's result for the reveal screen */
export type RevealGuess = {
  id: string
  name: string
  value: number
  colorIndex: number
}

export type Action =
  | { type: 'GO_LOBBY' }
  | { type: 'GO_INFO' }
  | { type: 'GO_MAIN_MENU' }
  | { type: 'TOGGLE_CATEGORY'; index: number }
  | { type: 'SELECT_ALL_CATEGORIES' }
  | { type: 'ADD_CUSTOM_CATEGORY'; category: Category }
  | { type: 'DELETE_CUSTOM_CATEGORY'; localIndex: number }
  | { type: 'SET_LANGUAGE'; language: import('./i18n/translations').Lang }
  | { type: 'SET_PLAYER_COUNT'; count: number }
  | { type: 'SET_MAX_ROUNDS'; count: number }
  | { type: 'SET_PLAYER_NAME'; id: string; name: string }
  | { type: 'START_GAME' }
  | { type: 'CONFIRM_ROLE' }
  | { type: 'SET_CLUE'; clue: string }
  | { type: 'READY_TO_GUESS' }         // GuessPassing → GuessPhase
  | { type: 'SET_CURRENT_GUESS'; value: number }
  | { type: 'CONFIRM_GUESS' }          // scores current guesser, advances or reveals
  | { type: 'NEXT_ROUND' }
  | { type: 'PLAY_AGAIN' }
