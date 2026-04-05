import type { GameState, Action, Round, Player } from '../types'
import { CATEGORIES, shuffleCategories } from '../data/categories'
import { CATEGORIES_BY_LANG } from '../data/categoriesByLang'
import { scoreDistance } from '../constants'
import { createInitialState, saveCustomCategories, saveLanguage } from './initialState'
import { CONFIG } from '../config'

function makePlayer(index: number): Player {
  return { id: `p${index}`, name: `Player ${index + 1}`, score: 0 }
}

function generateRounds(_playerCount: number, maxRounds: number, selectedIndices: number[], customCategories: { left: string; right: string }[], langCategories: { left: string; right: string }[]): Round[] {
  const allCats = [...langCategories, ...customCategories]
  const pool = selectedIndices.length > 0
    ? selectedIndices.map(i => allCats[i]).filter(Boolean)
    : allCats
  const cats = shuffleCategories(pool.length > 0 ? pool : allCats)
  return Array.from({ length: maxRounds }, (_, i) => ({
    target: Math.round(CONFIG.game.minTarget + Math.random() * (CONFIG.game.maxTarget - CONFIG.game.minTarget)),
    clue: '',
    category: cats[i % cats.length],
    guesses: {},
    scores: {},
  }))
}

/** All players except the clue giver, in original order */
function buildGuesserQueue(players: Player[], clueGiverIndex: number): string[] {
  return players
    .filter((_, i) => i !== clueGiverIndex)
    .map(p => p.id)
}

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {

    case 'GO_LOBBY':     return { ...state, phase: 'Lobby' }
    case 'GO_INFO':      return { ...state, phase: 'Info' }
    case 'GO_MAIN_MENU': return { ...state, phase: 'MainMenu' }

    case 'TOGGLE_CATEGORY': {
      const { index } = action
      const has = state.selectedCategories.includes(index)
      if (has && state.selectedCategories.length === 1) return state
      const selectedCategories = has
        ? state.selectedCategories.filter(i => i !== index)
        : [...state.selectedCategories, index]
      return { ...state, selectedCategories }
    }

    case 'SELECT_ALL_CATEGORIES': {
      const total = CATEGORIES.length + state.customCategories.length
      return { ...state, selectedCategories: Array.from({ length: total }, (_, i) => i) }
    }

    case 'ADD_CUSTOM_CATEGORY': {
      const customCategories = [...state.customCategories, action.category]
      saveCustomCategories(customCategories)
      const newIndex = CATEGORIES.length + customCategories.length - 1
      return {
        ...state,
        customCategories,
        selectedCategories: [...state.selectedCategories, newIndex],
      }
    }

    case 'DELETE_CUSTOM_CATEGORY': {
      const { localIndex } = action
      const globalIndex = CATEGORIES.length + localIndex
      const customCategories = state.customCategories.filter((_, i) => i !== localIndex)
      saveCustomCategories(customCategories)
      // Remove the deleted index and shift down all indices above it
      const selectedCategories = state.selectedCategories
        .filter(i => i !== globalIndex)
        .map(i => (i > globalIndex ? i - 1 : i))
      return { ...state, customCategories, selectedCategories }
    }

    case 'SET_PLAYER_COUNT': {
      const count = Math.max(2, Math.min(8, action.count))
      const current = state.players.length
      let players = [...state.players]
      if (count > current) {
        for (let i = current; i < count; i++) players.push(makePlayer(i))
      } else {
        players = players.slice(0, count)
      }
      return { ...state, players }
    }

    case 'SET_PLAYER_NAME':
      return {
        ...state,
        players: state.players.map(p =>
          p.id === action.id ? { ...p, name: action.name || p.name } : p
        ),
      }

    case 'START_GAME': {
      if (state.players.length < 2) return state
      const clueGiverIndex = 0
      const rounds = generateRounds(state.players.length, state.maxRounds, state.selectedCategories, state.customCategories, CATEGORIES_BY_LANG[state.language])
      return {
        ...state,
        phase: 'RoleSelection',
        rounds,
        currentRound: 0,
        clueGiverIndex,
        currentGuess: 50,
        guesserQueue: buildGuesserQueue(state.players, clueGiverIndex),
        currentGuesserTurn: 0,
        players: state.players.map(p => ({ ...p, score: 0 })),
      }
    }

    case 'CONFIRM_ROLE':
      return { ...state, phase: 'CluePhase' }

    case 'SET_CLUE': {
      const rounds = [...state.rounds]
      rounds[state.currentRound] = { ...rounds[state.currentRound], clue: action.clue }
      // Go to GuessPassing so first guesser can receive the phone privately
      return {
        ...state,
        rounds,
        phase: 'GuessPassing',
        currentGuess: 50,
        currentGuesserTurn: 0,
      }
    }

    case 'READY_TO_GUESS':
      return { ...state, phase: 'GuessPhase', currentGuess: 50 }

    case 'SET_CURRENT_GUESS':
      return { ...state, currentGuess: action.value }

    case 'CONFIRM_GUESS': {
      const round = state.rounds[state.currentRound]
      const guesserId = state.guesserQueue[state.currentGuesserTurn]
      const pts = scoreDistance(state.currentGuess, round.target)

      const updatedRound: Round = {
        ...round,
        guesses: { ...round.guesses, [guesserId]: state.currentGuess },
        scores:  { ...round.scores,  [guesserId]: pts },
      }

      const players = state.players.map(p =>
        p.id === guesserId ? { ...p, score: p.score + pts } : p
      )

      const nextTurn = state.currentGuesserTurn + 1
      const allDone  = nextTurn >= state.guesserQueue.length

      return {
        ...state,
        rounds:  state.rounds.map((r, i) => i === state.currentRound ? updatedRound : r),
        players,
        phase:               allDone ? 'RevealPhase' : 'GuessPassing',
        currentGuesserTurn:  allDone ? state.currentGuesserTurn : nextTurn,
        currentGuess:        50,
      }
    }

    case 'NEXT_ROUND': {
      const nextRound      = state.currentRound + 1
      const nextClueGiver  = (state.clueGiverIndex + 1) % state.players.length
      if (nextRound >= state.maxRounds) {
        return { ...state, phase: 'Scoreboard' }
      }
      return {
        ...state,
        phase:              'RoleSelection',
        currentRound:       nextRound,
        clueGiverIndex:     nextClueGiver,
        currentGuess:       50,
        guesserQueue:       buildGuesserQueue(state.players, nextClueGiver),
        currentGuesserTurn: 0,
      }
    }

    case 'SET_LANGUAGE': {
      saveLanguage(action.language)
      return { ...state, language: action.language }
    }

    case 'PLAY_AGAIN':
      return { ...createInitialState(), phase: 'MainMenu', language: state.language }

    default:
      return state
  }
}
