import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { GameState, Action } from '../types'
import { gameReducer } from './gameReducer'
import { createInitialState } from './initialState'

type GameContextType = {
  state: GameState
  dispatch: React.Dispatch<Action>
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState)
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
