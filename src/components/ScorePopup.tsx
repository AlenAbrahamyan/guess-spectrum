import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const PTS_LABELS: Record<number, string> = {
  4: 'Bullseye!',
  3: 'Close!',
  2: 'Near',
  1: 'Far',
  0: 'Miss',
}

const PTS_CSS_COLORS: Record<number, string> = {
  4: '#00e676',
  3: '#ffdd00',
  2: '#ff9000',
  1: '#ff4422',
  0: '#555577',
}

type Props = {
  pts: number
  visible: boolean
}

export function ScorePopup({ pts, visible }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    if (visible) {
      gsap.fromTo(ref.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)', delay: 0.8 },
      )
    } else {
      gsap.set(ref.current, { scale: 0, opacity: 0 })
    }
  }, [visible])

  const color = PTS_CSS_COLORS[pts] ?? '#555577'
  const label = PTS_LABELS[pts] ?? ''

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        opacity: 0,
        transform: 'scale(0)',
      }}
    >
      <div style={{
        fontSize: 56,
        fontWeight: 900,
        color,
        lineHeight: 1,
        textShadow: `0 0 30px ${color}88`,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {pts > 0 ? `+${pts}` : '0'}
      </div>
      <div style={{
        fontSize: 18,
        fontWeight: 700,
        color,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
    </div>
  )
}
