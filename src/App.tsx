import { useCallback, useEffect, useState } from 'react'
import { GameProvider, useGame } from './state/GameContext'
import { BackgroundOrbs } from './components/BackgroundOrbs'
import { SpectrumDial, type DialMode } from './components/SpectrumDial/SpectrumDial'
import { MainMenuScreen } from './screens/MainMenuScreen'
import { InfoScreen } from './screens/InfoScreen'
import { LobbyScreen } from './screens/LobbyScreen'
import { RoleSelectionScreen } from './screens/RoleSelectionScreen'
import { CluePhaseScreen } from './screens/CluePhaseScreen'
import { GuessPassingScreen } from './screens/GuessPassingScreen'
import { GuessPhaseScreen } from './screens/GuessPhaseScreen'
import { RevealPhaseScreen } from './screens/RevealPhaseScreen'
import { ScoreboardScreen } from './screens/ScoreboardScreen'
import type { Category, RevealGuess } from './types'

// ── Fixed game canvas dimensions (9:16 portrait) ──────────────────────────
const BASE_W = 390
const BASE_H = 844   // ~9:19.5 — fits all modern phones without dead space

function useScale() {
  const calc = () => Math.min(
    window.innerWidth  / BASE_W,
    window.innerHeight / BASE_H,
  )
  const [scale, setScale] = useState(calc)
  useEffect(() => {
    const handler = () => setScale(calc())
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return scale
}

// ──────────────────────────────────────────────────────────────────────────

// GuessPassing is included so the dial stays mounted (never destroyed/remounted)
// between guessers — if it unmounts, Pixi's async init races with useDialDrag
// and canvasRef.current is null when listeners try to attach.
const DIAL_PHASES = new Set(['CluePhase', 'GuessPassing', 'GuessPhase', 'RevealPhase'])
const FALLBACK_CATEGORY: Category = { left: 'Left', right: 'Right' }


function GameShell() {
  const { state, dispatch } = useGame()
  const { phase, rounds, currentRound, currentGuess } = state

  const showDial = DIAL_PHASES.has(phase)
  const round    = rounds[currentRound]
  const category = round?.category ?? FALLBACK_CATEGORY
  const target   = round?.target   ?? 50

  const dialMode: DialMode =
    phase === 'CluePhase'                        ? 'clue'   :
    phase === 'GuessPhase' || phase === 'GuessPassing' ? 'guess' : 'reveal'

  // Build reveal guesses for the multi-pointer display
  const revealGuesses: RevealGuess[] = phase === 'RevealPhase' && round
    ? state.guesserQueue.map((id, colorIndex) => {
        const player = state.players.find(p => p.id === id)!
        return { id, name: player.name, value: round.guesses[id] ?? 50, colorIndex }
      })
    : []

  const handleGuessChange = useCallback((value: number) => {
    dispatch({ type: 'SET_CURRENT_GUESS', value })
  }, [dispatch])

  const handleGuessConfirm = useCallback((_value: number) => {
    // confirm happens via the Confirm button in GuessPhaseScreen
  }, [])

  return (
    <div style={gameRoot}>
      <div style={gameContent}>
        {/* Dial — mounted once, shared across CluePhase/GuessPhase/RevealPhase */}
        {showDial && (
          <div style={dialWrap}>
            <SpectrumDial
              mode={dialMode}
              category={category}
              target={target}
              guess={currentGuess}
              revealGuesses={revealGuesses}
              onGuessChange={handleGuessChange}
              onGuessConfirm={handleGuessConfirm}
            />
          </div>
        )}

        {/* Screen — fills remaining vertical space */}
        <div style={screenWrap(showDial)}>
          {phase === 'MainMenu'      && <MainMenuScreen />}
          {phase === 'Info'          && <InfoScreen />}
          {phase === 'Lobby'         && <LobbyScreen />}
          {phase === 'RoleSelection' && <RoleSelectionScreen />}
          {phase === 'CluePhase'     && <CluePhaseScreen />}
          {phase === 'GuessPassing'  && <GuessPassingScreen />}
          {phase === 'GuessPhase'    && <GuessPhaseScreen />}
          {phase === 'RevealPhase'   && <RevealPhaseScreen />}
          {phase === 'Scoreboard'    && <ScoreboardScreen />}
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────

export default function App() {
  const scale = useScale()

  return (
    <GameProvider>
      {/* Full-screen background layer — always covers entire viewport */}
      <div style={fullBg}>
        <BackgroundOrbs />
      </div>

      {/* Scaled game canvas — centred, no background so full-bg shows through */}
      <div style={viewport}>
        <div style={{
          width:           BASE_W,
          height:          BASE_H,
          transform:       `scale(${scale})`,
          transformOrigin: 'center center',
          overflow:        'hidden',
          position:        'relative',
          flexShrink:      0,
          background:      'transparent',
        }}>
          <GameShell />
        </div>
      </div>
    </GameProvider>
  )
}

// ── Styles ─────────────────────────────────────────────────────────────────

// Full-screen dark background — always fills the viewport
const fullBg: React.CSSProperties = {
  position:   'fixed',
  inset:      0,
  background: '#0d0d1a',
  zIndex:     0,
}

// Scaled game frame — sits above the background
const viewport: React.CSSProperties = {
  position:       'fixed',
  inset:          0,
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  overflow:       'hidden',
  zIndex:         1,
}

const gameRoot: React.CSSProperties = {
  width:    '100%',
  height:   '100%',
  overflow: 'hidden',
  position: 'relative',
  display:  'flex',
  flexDirection: 'column',
}

const gameContent: React.CSSProperties = {
  position:      'relative',
  zIndex:        1,
  display:       'flex',
  flexDirection: 'column',
  height:        '100%',
  overflow:      'hidden',
}

const dialWrap: React.CSSProperties = {
  padding:   '12px 20px 0',
  flexShrink: 0,
}

function screenWrap(hasDial: boolean): React.CSSProperties {
  return {
    flex:      1,
    minHeight: 0,           // allow flex child to shrink below its content
    overflowY: hasDial ? 'hidden' : 'auto',
    overflowX: 'hidden',
    display:   'flex',
    flexDirection: 'column',
  }
}
