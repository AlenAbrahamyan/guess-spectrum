import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'

export function useScreenTransition(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
