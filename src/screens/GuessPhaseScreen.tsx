import { useRef } from 'react'
import { useGame } from '../state/GameContext'
import { useScreenTransition } from '../hooks/useScreenTransition'
import { useT } from '../hooks/useT'
import { Button } from '../components/Button'
import { PLAYER_CSS_COLORS } from '../constants'

export function GuessPhaseScreen() {
  const { state, dispatch } = useGame()
  const ref = useRef<HTMLDivElement>(null)
  useScreenTransition(ref)
  const t = useT()

  const round    = state.rounds[state.currentRound]
  const guesserId = state.guesserQueue[state.currentGuesserTurn]
  const guesser  = state.players.find(p => p.id === guesserId)!
  const color    = PLAYER_CSS_COLORS[state.currentGuesserTurn % PLAYER_CSS_COLORS.length]

  return (
    <div ref={ref} style={screen}>
      <div style={playerRow}>
        <div style={{ ...playerDot, background: color, boxShadow: `0 0 16px ${color}88` }}>
          {guesser.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={turnLabel}>{t.guessingNow}</div>
          <div style={playerName}>{guesser.name}</div>
        </div>
      </div>

      <div style={specRow}>
        <span style={leftLabel}>← {round.category.left}</span>
        <span style={rightLabel}>{round.category.right} →</span>
      </div>

      <div style={hint}>{t.dragNeedle}</div>

      <div style={{ flex: 1 }} />

      <Button fullWidth onClick={() => dispatch({ type: 'CONFIRM_GUESS' })}>
        {t.lockInGuess}
      </Button>
    </div>
  )
}

const screen: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 10,
  padding: '16px 20px 24px', height: '100%',
}
const playerRow: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 14 }
const playerDot: React.CSSProperties = {
  width: 44, height: 44, borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 18, fontWeight: 900, color: '#fff', flexShrink: 0,
}
const turnLabel: React.CSSProperties = {
  fontSize: 10, fontWeight: 800, letterSpacing: '0.15em', color: '#6666aa', textTransform: 'uppercase',
}
const playerName: React.CSSProperties = { fontSize: 20, fontWeight: 900, color: '#f0f0ff' }
const specRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '0 2px' }
const leftLabel: React.CSSProperties = { fontSize: 17, fontWeight: 800, color: '#44aaff' }
const rightLabel: React.CSSProperties = { fontSize: 17, fontWeight: 800, color: '#ff7733' }
const hint: React.CSSProperties = { fontSize: 12, color: '#555577', textAlign: 'center', letterSpacing: '0.04em' }
