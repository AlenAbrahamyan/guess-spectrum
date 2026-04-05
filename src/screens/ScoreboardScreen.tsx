import { useRef } from 'react'
import { useGame } from '../state/GameContext'
import { useScreenTransition } from '../hooks/useScreenTransition'
import { useT } from '../hooks/useT'
import { Button } from '../components/Button'

export function ScoreboardScreen() {
  const { state, dispatch } = useGame()
  const ref = useRef<HTMLDivElement>(null)
  useScreenTransition(ref)
  const t = useT()

  const sorted = [...state.players].sort((a, b) => b.score - a.score)
  const winner = sorted[0]

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div ref={ref} style={screen}>
      <div style={winnerBlock}>
        <div style={trophyIcon}>🏆</div>
        <div style={winnerName}>{winner.name}</div>
        <div style={winnerPts}>{t.winsWith(winner.score)}</div>
      </div>

      <div style={card}>
        <div style={sectionLabel}>{t.finalStandings}</div>
        {sorted.map((p, i) => (
          <div key={p.id} style={row(i === 0)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: i < 3 ? 22 : 14, minWidth: 28, textAlign: 'center', color: '#444466' }}>
                {medals[i] ?? `${i + 1}.`}
              </span>
              <span style={{ fontSize: 16, fontWeight: i === 0 ? 800 : 600, color: i === 0 ? '#ffdd00' : '#c0c0e8' }}>
                {p.name}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: i === 0 ? '#ffdd00' : '#e0e0ff' }}>
                {p.score}
              </span>
              <span style={{ fontSize: 11, color: '#555577', fontWeight: 700 }}>{t.pointsShort}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <Button fullWidth onClick={() => dispatch({ type: 'PLAY_AGAIN' })}>
        {t.playAgain}
      </Button>
    </div>
  )
}

const screen: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 16,
  padding: '32px 20px 28px', maxWidth: 480, margin: '0 auto',
  height: '100%', overflowY: 'auto',
}
const winnerBlock: React.CSSProperties = {
  textAlign: 'center', paddingBottom: 4,
}
const trophyIcon: React.CSSProperties = { fontSize: 52, lineHeight: 1, marginBottom: 8 }
const winnerName: React.CSSProperties = {
  fontSize: 30, fontWeight: 900, color: '#ffdd00', letterSpacing: '-0.02em',
}
const winnerPts: React.CSSProperties = { fontSize: 14, color: '#7070aa', marginTop: 4 }
const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 18, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 4,
}
const sectionLabel: React.CSSProperties = {
  fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: '#555577',
  textTransform: 'uppercase', marginBottom: 10,
}
function row(highlight: boolean): React.CSSProperties {
  return {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 12px', borderRadius: 12,
    background: highlight ? 'rgba(255,221,0,0.08)' : 'transparent',
    border: highlight ? '1px solid rgba(255,221,0,0.2)' : '1px solid transparent',
  }
}
