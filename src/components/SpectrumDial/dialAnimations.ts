import gsap from 'gsap'
import type { Container } from 'pixi.js'

export function animatePointerTo(
  pointer: Container,
  targetAngle: number,
  duration = 0.35,
  ease = 'power2.out',
) {
  return gsap.to(pointer, { rotation: targetAngle, duration, ease })
}

export function animatePointerReveal(pointer: Container, targetAngle: number) {
  return gsap.to(pointer, {
    rotation: targetAngle,
    duration: 0.9,
    ease: 'elastic.out(1, 0.55)',
  })
}

export function animateZonesIn(
  zonesContainer: Container,
  onComplete?: () => void,
) {
  gsap.fromTo(
    zonesContainer,
    { alpha: 0 },
    { alpha: 1, duration: 0.5, ease: 'power3.out', onComplete },
  )
  gsap.fromTo(
    zonesContainer.scale,
    { x: 0.85, y: 0.85 },
    { x: 1, y: 1, duration: 0.5, ease: 'back.out(1.5)' },
  )
}

export function resetZones(zonesContainer: Container) {
  gsap.killTweensOf(zonesContainer)
  gsap.killTweensOf(zonesContainer.scale)
  zonesContainer.alpha = 0
  zonesContainer.scale.set(1)
}
