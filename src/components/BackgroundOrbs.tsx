import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function BackgroundOrbs() {
  const orb1 = useRef<HTMLDivElement>(null)
  const orb2 = useRef<HTMLDivElement>(null)
  const orb3 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (orb1.current) {
      gsap.to(orb1.current, { x: 40, y: 30, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    }
    if (orb2.current) {
      gsap.to(orb2.current, { x: -30, y: 45, duration: 11, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    }
    if (orb3.current) {
      gsap.to(orb3.current, { x: 25, y: -40, duration: 13, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    }
    return () => {
      gsap.killTweensOf([orb1.current, orb2.current, orb3.current])
    }
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div ref={orb1} style={{
        position: 'absolute', top: '-20%', left: '-15%',
        width: 380, height: 380, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(60,60,255,0.38) 0%, transparent 70%)',
        filter: 'blur(48px)',
      }} />
      <div ref={orb2} style={{
        position: 'absolute', bottom: '5%', right: '-20%',
        width: 320, height: 320, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(180,60,255,0.32) 0%, transparent 70%)',
        filter: 'blur(44px)',
      }} />
      <div ref={orb3} style={{
        position: 'absolute', top: '35%', left: '25%',
        width: 240, height: 240, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,180,255,0.2) 0%, transparent 70%)',
        filter: 'blur(52px)',
      }} />
    </div>
  )
}
