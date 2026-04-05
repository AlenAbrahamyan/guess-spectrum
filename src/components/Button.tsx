import type { CSSProperties, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'

type Props = {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: Variant
  fullWidth?: boolean
  style?: CSSProperties
}

const variantStyles: Record<Variant, CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #5050ff 0%, #9944ff 100%)',
    color: '#fff',
    boxShadow: '0 6px 28px rgba(80,80,255,0.55)',
  },
  secondary: {
    background: 'rgba(255,255,255,0.08)',
    color: '#d0d0f0',
    border: '1px solid rgba(255,255,255,0.14)',
  },
  danger: {
    background: 'linear-gradient(135deg, #ff4422 0%, #ff2266 100%)',
    color: '#fff',
    boxShadow: '0 6px 28px rgba(255,68,34,0.45)',
  },
}

export function Button({ children, onClick, disabled, variant = 'primary', fullWidth, style }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
        padding: '0 32px',
        borderRadius: 18,
        border: 'none',
        fontSize: 17,
        fontWeight: 800,
        fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'transform 0.1s, opacity 0.15s',
        width: fullWidth ? '100%' : undefined,
        letterSpacing: '0.03em',
        ...variantStyles[variant],
        ...style,
      }}
      onPointerDown={e => { if (!disabled) (e.currentTarget as HTMLElement).style.transform = 'scale(0.96)' }}
      onPointerUp={e => { (e.currentTarget as HTMLElement).style.transform = '' }}
      onPointerLeave={e => { (e.currentTarget as HTMLElement).style.transform = '' }}
    >
      {children}
    </button>
  )
}
