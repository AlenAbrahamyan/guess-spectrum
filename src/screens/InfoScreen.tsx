import { useRef } from 'react'
import { useGame } from '../state/GameContext'
import { useScreenTransition } from '../hooks/useScreenTransition'
import { useT } from '../hooks/useT'
import { Button } from '../components/Button'

export function InfoScreen() {
  const { dispatch } = useGame()
  const ref = useRef<HTMLDivElement>(null)
  useScreenTransition(ref)
  const t = useT()

  return (
    <div ref={ref} style={screen}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <button onClick={() => dispatch({ type: 'GO_MAIN_MENU' })} style={backBtn}>←</button>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#e0e0ff', margin: 0 }}>{t.howToPlayTitle}</h2>
      </div>

      {/* Steps */}
      <div style={card}>
        {t.steps.map((step, i) => (
          <div key={i} style={stepRow}>
            <div style={iconBox}>{step.icon}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#e0e0ff', marginBottom: 3 }}>{step.title}</div>
              <div style={{ fontSize: 13, color: '#8080aa', lineHeight: 1.5 }}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Scoring */}
      <div style={card}>
        <div style={sectionLabel}>{t.scoringTitle}</div>
        <div style={{ fontSize: 13, color: '#7070aa', marginBottom: 14 }}>{t.scoringSubtitle}</div>
        {t.scoreRows.map(row => (
          <div key={row.range} style={scoreRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ ...dot, background: row.color }} />
              <span style={{ color: '#c0c0e8', fontSize: 14 }}>{row.range}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: row.color, fontSize: 14, fontWeight: 700 }}>
                {row.pts > 0 ? `+${row.pts} pts` : '0 pts'}
              </span>
              <span style={{ color: '#555577', fontSize: 12 }}>{row.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div style={card}>
        <div style={sectionLabel}>{t.tipsTitle}</div>
        <ul style={{ paddingLeft: 18, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {t.tips.map((tip, i) => (
            <li key={i} style={{ fontSize: 13, color: '#8080aa', lineHeight: 1.5 }}>{tip}</li>
          ))}
        </ul>
      </div>

      <Button fullWidth onClick={() => dispatch({ type: 'GO_MAIN_MENU' })}>
        {t.gotItBack}
      </Button>
    </div>
  )
}

const screen: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 14,
  padding: '24px 20px 32px', height: '100%', overflowY: 'auto',
}
const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 18, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14,
}
const sectionLabel: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#555577', textTransform: 'uppercase',
}
const stepRow: React.CSSProperties = { display: 'flex', gap: 14, alignItems: 'flex-start' }
const iconBox: React.CSSProperties = { fontSize: 26, lineHeight: 1, flexShrink: 0, width: 40, textAlign: 'center' }
const scoreRow: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
}
const dot: React.CSSProperties = { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 }
const backBtn: React.CSSProperties = {
  width: 38, height: 38, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)', color: '#c0c0e8', fontSize: 18, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
}
