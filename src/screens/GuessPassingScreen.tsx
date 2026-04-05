import { useRef } from 'react'
import { useGame } from '../state/GameContext'
import { useScreenTransition } from '../hooks/useScreenTransition'
import { useT } from '../hooks/useT'
import { Button } from '../components/Button'
import { PLAYER_CSS_COLORS } from '../constants'

export function GuessPassingScreen() {
  const { state, dispatch } = useGame()
  const ref = useRef<HTMLDivElement>(null)
  useScreenTransition(ref)
  const t = useT()

  const round     = state.rounds[state.currentRound]
  const guesserId = state.guesserQueue[state.currentGuesserTurn]
  const guesser   = state.players.find(p => p.id === guesserId)!
  const turn      = state.currentGuesserTurn
  const total     = state.guesserQueue.length
  const color     = PLAYER_CSS_COLORS[turn % PLAYER_CSS_COLORS.length]

  return (
    <div ref={ref} style={screen}>
      <div style={{ ...heroBanner, background: `linear-gradient(160deg, ${color}30 0%, transparent 70%)`, borderColor: `${color}40` }}>
        <div style={counterTag}>{t.guesserOf(turn + 1, total)}</div>

        <div style={{ ...bigAvatar, background: color, boxShadow: `0 0 48px ${color}66` }}>
          {guesser.name.charAt(0).toUpperCase()}
        </div>

        <div style={passLabel}>{t.passTo}</div>
        <div style={bigName}>{guesser.name}</div>
        <div style={privacyNote}>{t.everyoneLookAway}</div>
      </div>

      <div style={specCard}>
        <div style={specCardLabel}>{t.spectrumLabel}</div>
        <div style={specCardRow}>
          <span style={leftWord}>{round.category.left}</span>
          <span style={arrowSep}>↔</span>
          <span style={rightWord}>{round.category.right}</span>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <Button fullWidth onClick={() => dispatch({ type: 'READY_TO_GUESS' })}>
        {t.imReadyShowDial}
      </Button>
    </div>
  )
}

const screen: React.CSSProperties = {
  position: 'absolute', inset: 0, zIndex: 10,
  display: 'flex', flexDirection: 'column', gap: 14,
  padding: '24px 20px 28px', background: '#0d0d1a', overflow: 'hidden',
}
const heroBanner: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
  padding: '24px 20px 20px', borderRadius: 22, border: '1px solid',
}
const counterTag: React.CSSProperties = {
  fontSize: 11, fontWeight: 800, letterSpacing: '0.15em',
  color: '#7070aa', textTransform: 'uppercase', marginBottom: 4,
}
const bigAvatar: React.CSSProperties = {
  width: 88, height: 88, borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 36, fontWeight: 900, color: '#fff', border: '3px solid rgba(255,255,255,0.15)',
}
const passLabel: React.CSSProperties = { fontSize: 14, color: '#8888bb', marginTop: 4 }
const bigName: React.CSSProperties = {
  fontSize: 36, fontWeight: 900, color: '#f0f0ff', letterSpacing: '-0.02em', textAlign: 'center',
}
const privacyNote: React.CSSProperties = { fontSize: 13, color: '#666688', marginTop: 2 }
const specCard: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16, padding: '14px 20px', textAlign: 'center',
}
const specCardLabel: React.CSSProperties = {
  fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', color: '#555577',
  textTransform: 'uppercase', marginBottom: 10,
}
const specCardRow: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
}
const leftWord: React.CSSProperties = { fontSize: 20, fontWeight: 900, color: '#44aaff' }
const rightWord: React.CSSProperties = { fontSize: 20, fontWeight: 900, color: '#ff7733' }
const arrowSep: React.CSSProperties = { fontSize: 16, color: '#444466' }
