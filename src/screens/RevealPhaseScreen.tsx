import { useRef } from 'react'
import { useGame } from '../state/GameContext'
import { useScreenTransition } from '../hooks/useScreenTransition'
import { useT } from '../hooks/useT'
import { Button } from '../components/Button'
import { PLAYER_CSS_COLORS } from '../constants'

export function RevealPhaseScreen() {
  const { state, dispatch } = useGame()
  const ref = useRef<HTMLDivElement>(null)
  useScreenTransition(ref)
  const t = useT()

  const round     = state.rounds[state.currentRound]
  const clueGiver = state.players[state.clueGiverIndex]

  const results = state.guesserQueue.map((id, colorIndex) => {
    const player = state.players.find(p => p.id === id)!
    const guess  = round.guesses[id] ?? 50
    const pts    = round.scores[id]  ?? 0
    return { player, guess, pts, colorIndex }
  })

  const topPts = Math.max(...results.map(r => r.pts))

  return (
    <div ref={ref} style={screen}>
      <div style={header}>
        <div style={headerBadge}>{t.revealBadge}</div>
        <div style={spectrumLine}>
          <span style={{ color: '#44aaff', fontWeight: 800 }}>{round.category.left}</span>
          <span style={{ color: '#444466' }}> ↔ </span>
          <span style={{ color: '#ff7733', fontWeight: 800 }}>{round.category.right}</span>
        </div>
        <div style={clueGiverNote}>
          {t.clueBy} <span style={{ color: '#c0c0ff', fontWeight: 700 }}>{clueGiver.name}</span>
        </div>
      </div>

      <div style={card}>
        <div style={sectionLabel}>{t.guessesTitle}</div>
        {results.map(({ player, guess, pts, colorIndex }) => {
          const color    = PLAYER_CSS_COLORS[colorIndex % PLAYER_CSS_COLORS.length]
          const ptsColor = pts === 4 ? '#00e676' : pts === 3 ? '#ffdd33' : pts === 2 ? '#ff8822' : pts === 1 ? '#ff4422' : '#444466'
          const isTop    = pts === topPts && pts > 0
          return (
            <div key={player.id} style={{ ...resultRow, borderLeftColor: color }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ ...dot, background: color }}>{player.name.charAt(0).toUpperCase()}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#f0f0ff', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {player.name}
                    {isTop && <span style={crownBadge}>{t.bestBadge}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: '#666688', marginTop: 2 }}>
                    {t.guessShort} <span style={{ color }}>{Math.round(guess)}</span>
                    {' · '}{t.targetShort} <span style={{ color: '#44ee88' }}>{round.target}</span>
                    {' · '}{t.offByShort} <span style={{ color: '#8888aa' }}>{Math.abs(Math.round(guess) - round.target)}</span>
                  </div>
                </div>
              </div>
              <div style={{ ...ptsBadge, color: ptsColor, borderColor: `${ptsColor}44`, background: `${ptsColor}14` }}>
                {pts > 0 ? `+${pts}` : '0'}
              </div>
            </div>
          )
        })}
      </div>

      <div style={card}>
        <div style={sectionLabel}>{t.scoresTitle}</div>
        {[...state.players].sort((a, b) => b.score - a.score).map((p, rank) => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#444466', minWidth: 16 }}>{rank + 1}.</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: p.id === clueGiver.id ? '#555577' : '#d0d0f0', fontStyle: p.id === clueGiver.id ? 'italic' : 'normal' }}>
                {p.name}{p.id === clueGiver.id ? ` (${t.clueGiverNote})` : ''}
              </span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 900, color: rank === 0 ? '#ffdd33' : '#9090cc' }}>{p.score}</span>
          </div>
        ))}
      </div>

      <Button fullWidth onClick={() => dispatch({ type: 'PLAY_AGAIN' })}>
        {t.playAgain}
      </Button>
    </div>
  )
}

const screen: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 12,
  padding: '16px 20px 24px', height: '100%', overflowY: 'auto',
}
const header: React.CSSProperties = { textAlign: 'center', paddingBottom: 4 }
const headerBadge: React.CSSProperties = {
  display: 'inline-block', fontSize: 10, fontWeight: 800, letterSpacing: '0.2em',
  color: '#9944ff', border: '1px solid rgba(153,68,255,0.4)', background: 'rgba(153,68,255,0.12)',
  borderRadius: 20, padding: '3px 12px', marginBottom: 8,
}
const spectrumLine: React.CSSProperties = { fontSize: 18, marginBottom: 4 }
const clueGiverNote: React.CSSProperties = { fontSize: 12, color: '#555577' }
const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 18, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8,
}
const sectionLabel: React.CSSProperties = {
  fontSize: 10, fontWeight: 800, letterSpacing: '0.15em', color: '#444466',
  textTransform: 'uppercase', marginBottom: 2,
}
const resultRow: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '8px 0 8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)',
  borderLeft: '3px solid', borderRadius: '0 8px 8px 0',
  marginLeft: -16, paddingLeft: 12,
}
const dot: React.CSSProperties = {
  width: 30, height: 30, borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0,
}
const crownBadge: React.CSSProperties = {
  fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', color: '#ffdd33',
  background: 'rgba(255,221,51,0.15)', border: '1px solid rgba(255,221,51,0.3)',
  borderRadius: 4, padding: '1px 5px',
}
const ptsBadge: React.CSSProperties = {
  fontSize: 22, fontWeight: 900, minWidth: 44, textAlign: 'center',
  border: '1px solid', borderRadius: 10, padding: '4px 8px',
}
