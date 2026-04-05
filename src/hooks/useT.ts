import { useGame } from '../state/GameContext'
import { TRANSLATIONS } from '../i18n/translations'
import type { T } from '../i18n/translations'

export function useT(): T {
  const { state } = useGame()
  return TRANSLATIONS[state.language]
}
