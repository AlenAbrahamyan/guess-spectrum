import { useRef } from 'react'
import { useGame } from '../state/GameContext'
import { useScreenTransition } from '../hooks/useScreenTransition'
import { Button } from '../components/Button'

export function ScoreboardScreen() {
  const { state, dispatch } = useGame()
  const ref = useRef<HTMLDivElement>(null)
  useScreenTransition(ref)

  const sorted = [...state.players].sort((a, b) => b.score - a.score)
  const winner = sorted[0]

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div ref={ref} style={screen}>
      {/* Winner */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 48 }}>🏆</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: '#ffdd00', marginTop: 8 }}>
          {winner.name} Wins!
        </div>
        <div style={{ fontSize: 14, color: '#7070aa', marginTop: 4 }}>
          with {winner.score} points
        </div>
      </div>

      {/* Leaderboard */}
      <div style={card}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#7070aa', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
          Final Standings
        </div>
        {sorted.map((p, i) => (
          <div key={p.id} style={row(i === 0)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 22 }}>{medals[i] ?? `${i + 1}.`}</span>
              <span style={{ fontSize: 16, fontWeight: i === 0 ? 800 : 600, color: i === 0 ? '#ffdd00' : '#c0c0e8' }}>
                {p.name}
              </span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: i === 0 ? '#ffdd00' : '#e0e0ff' }}>
              {p.score}
            </div>
          </div>
        ))}
      </div>

      <Button fullWidth onClick={() => dispatch({ type: 'PLAY_AGAIN' })}>
        Play Again
      </Button>
    </div>
  )
}

const screen: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: '28px 20px',
  maxWidth: 480,
  margin: '0 auto',
  height: '100%', overflowY: 'auto',
}
const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 18,
  padding: '18px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
}
function row(highlight: boolean): React.CSSProperties {
  return {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    borderRadius: 12,
    background: highlight ? 'rgba(255,221,0,0.08)' : 'transparent',
    border: highlight ? '1px solid rgba(255,221,0,0.2)' : '1px solid transparent',
  }
}
