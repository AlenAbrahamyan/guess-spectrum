import type { GameState, Player, Category } from '../types'
import type { Lang } from '../i18n/translations'
import { CATEGORIES } from '../data/categories'
import { CONFIG } from '../config'

const LS_LANG_KEY = 'wavelength_language'

export function loadLanguage(): Lang {
  try {
    const raw = localStorage.getItem(LS_LANG_KEY)
    if (raw) return raw as Lang
  } catch { /* ignore */ }
  return 'en'
}

export function saveLanguage(lang: Lang): void {
  try { localStorage.setItem(LS_LANG_KEY, lang) } catch { /* ignore */ }
}

const LS_KEY = 'wavelength_custom_categories'

export function loadCustomCategories(): Category[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw) as Category[]
  } catch { /* ignore */ }
  return []
}

export function saveCustomCategories(cats: Category[]): void {
  try { localStorage.setItem(LS_KEY, JSON.stringify(cats)) } catch { /* ignore */ }
}

function makePlayer(index: number): Player {
  return { id: `p${index}`, name: `Player ${index + 1}`, score: 0 }
}

export function createInitialState(): GameState {
  const customCategories = loadCustomCategories()
  const totalCount = CATEGORIES.length + customCategories.length
  return {
    phase: 'MainMenu',
    players: Array.from({ length: CONFIG.game.defaultPlayerCount }, (_, i) => makePlayer(i)),
    rounds: [],
    currentRound: 0,
    clueGiverIndex: 0,
    currentGuess: 50,
    maxRounds: CONFIG.game.defaultPlayerCount,
    selectedCategories: Array.from({ length: totalCount }, (_, i) => i),
    customCategories,
    language: loadLanguage(),
    guesserQueue: [],
    currentGuesserTurn: 0,
  }
}
