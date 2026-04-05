import { useRef } from 'react'
import { useGame } from '../state/GameContext'
import { useScreenTransition } from '../hooks/useScreenTransition'
import { useT } from '../hooks/useT'
import { Button } from '../components/Button'

export function RoleSelectionScreen() {
  const { state, dispatch } = useGame()
  const ref = useRef<HTMLDivElement>(null)
  useScreenTransition(ref)
  const t = useT()

  const clueGiver = state.players[state.clueGiverIndex]
  const initial   = clueGiver.name.charAt(0).toUpperCase()

  return (
    <div ref={ref} style={screen}>
      <div style={topGlow} />

      <div style={content}>
        <div style={badge}>{t.psychicBadge}</div>

        <div style={avatarRing}>
          <div style={avatar}>{initial}</div>
        </div>

        <div style={nameBlock}>
          <div style={passLabel}>{t.passPhoneTo}</div>
          <div style={playerName}>{clueGiver.name}</div>
        </div>

        <div style={infoCard}>
          <div style={infoIcon}>🔒</div>
          <div style={infoText}>{t.onlyLooks(clueGiver.name)}</div>
        </div>
      </div>

      <Button fullWidth onClick={() => dispatch({ type: 'CONFIRM_ROLE' })}>
        {t.imReadyShowTarget}
      </Button>
    </div>
  )
}

const screen: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 20,
  padding: '32px 24px 28px', height: '100%', overflowY: 'auto', position: 'relative',
}
const topGlow: React.CSSProperties = {
  position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
  width: 300, height: 200, borderRadius: '50%',
  background: 'radial-gradient(ellipse, rgba(80,80,255,0.25) 0%, transparent 70%)',
  pointerEvents: 'none',
}
const content: React.CSSProperties = {
  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
  justifyContent: 'center', gap: 22,
}
const badge: React.CSSProperties = {
  fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', color: '#6666ff',
  textTransform: 'uppercase', border: '1px solid rgba(100,100,255,0.35)',
  borderRadius: 20, padding: '5px 14px', background: 'rgba(80,80,255,0.1)',
}
const avatarRing: React.CSSProperties = {
  padding: 4, borderRadius: '50%',
  background: 'linear-gradient(135deg, #5050ff, #9944ff)',
  boxShadow: '0 0 48px rgba(80,80,255,0.55)',
}
const avatar: React.CSSProperties = {
  width: 100, height: 100, borderRadius: '50%',
  background: 'linear-gradient(135deg, #5050ff 0%, #9944ff 100%)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 42, fontWeight: 900, color: '#fff', border: '3px solid #0d0d1a',
}
const nameBlock: React.CSSProperties = { textAlign: 'center' }
const passLabel: React.CSSProperties = { fontSize: 14, color: '#7070aa', marginBottom: 4 }
const playerName: React.CSSProperties = { fontSize: 38, fontWeight: 900, color: '#f0f0ff', letterSpacing: '-0.02em' }
const infoCard: React.CSSProperties = {
  display: 'flex', alignItems: 'flex-start', gap: 12,
  background: 'rgba(80,80,255,0.1)', border: '1px solid rgba(100,100,255,0.25)',
  borderRadius: 16, padding: '14px 18px', maxWidth: 320,
}
const infoIcon: React.CSSProperties = { fontSize: 20, flexShrink: 0 }
const infoText: React.CSSProperties = { fontSize: 14, color: '#9090cc', lineHeight: 1.55 }
