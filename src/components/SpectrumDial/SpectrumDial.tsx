import { useRef, useEffect, useCallback } from 'react'
import { Application, Container } from 'pixi.js'
import type { Category, RevealGuess } from '../../types'
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS, valueToAngle } from '../../constants'
import { usePixiApp } from '../../hooks/usePixiApp'
import { useDialDrag } from '../../hooks/useDialDrag'
import { drawArc } from './drawArc'
import { drawPointer } from './drawPointer'
import { drawZones } from './drawZones'
import { drawRevealPointers } from './drawRevealPointers'
import {
  animatePointerTo,
  animatePointerReveal,
  animateZonesIn,
  resetZones,
} from './dialAnimations'
import gsap from 'gsap'

export type DialMode = 'clue' | 'guess' | 'reveal'

type Props = {
  mode: DialMode
  category: Category
  target: number
  guess: number
  revealGuesses?: RevealGuess[]   // all guesses — only used in reveal mode
  onGuessChange: (value: number) => void
  onGuessConfirm: (value: number) => void
}

export function SpectrumDial({
  mode, category, target, guess,
  revealGuesses = [],
  onGuessChange, onGuessConfirm,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = usePixiApp(containerRef)

  const arcRef         = useRef<ReturnType<typeof drawArc> | null>(null)
  const guessPointerRef  = useRef<ReturnType<typeof drawPointer> | null>(null)
  const targetPointerRef = useRef<ReturnType<typeof drawPointer> | null>(null)
  const zonesRef         = useRef<ReturnType<typeof drawZones> | null>(null)
  const revealPtrsRef    = useRef<Container | null>(null)

  const canvasRef    = useRef<HTMLCanvasElement | null>(null)
  const modeRef      = useRef<DialMode>(mode)
  const guessRef     = useRef(guess)
  // keep revealGuesses accessible inside effects without adding to dep arrays
  const revealGuessesRef = useRef<RevealGuess[]>(revealGuesses)
  revealGuessesRef.current = revealGuesses

  const categoryKey = `${category.left}|${category.right}`

  // ── Build scene ─────────────────────────────────────────────────────────
  useEffect(() => {
    let rafId = 0

    function tryBuild() {
      const app: Application | null = appRef.current
      if (!app || !app.stage) { rafId = requestAnimationFrame(tryBuild); return }

      canvasRef.current = app.canvas as HTMLCanvasElement
      app.stage.removeChildren()
      arcRef.current = null
      guessPointerRef.current = null
      targetPointerRef.current = null
      zonesRef.current = null
      revealPtrsRef.current = null

      const arc          = drawArc()
      const zones        = drawZones(target)
      const guessPointer = drawPointer(COLORS.pointer)
      const targetPointer = drawPointer(COLORS.targetHandle)

      app.stage.addChild(arc)
      app.stage.addChild(zones)
      app.stage.addChild(guessPointer)
      app.stage.addChild(targetPointer)

      arcRef.current          = arc
      zonesRef.current        = zones
      guessPointerRef.current = guessPointer
      targetPointerRef.current = targetPointer

      applyMode(modeRef.current, guessRef.current)
    }

    rafId = requestAnimationFrame(tryBuild)
    return () => cancelAnimationFrame(rafId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryKey, target])

  // ── Apply mode state to Pixi objects ────────────────────────────────────
  function applyMode(m: DialMode, currentGuess: number) {
    const gp  = guessPointerRef.current
    const tp  = targetPointerRef.current
    const z   = zonesRef.current
    const app = appRef.current
    if (!gp || !tp || !z || !app) return

    const targetAngle = valueToAngle(target)
    const guessAngle  = valueToAngle(currentGuess)

    // Remove old reveal pointers
    if (revealPtrsRef.current) {
      app.stage.removeChild(revealPtrsRef.current)
      revealPtrsRef.current = null
    }

    if (m === 'clue') {
      tp.alpha    = 0
      gp.alpha    = 0
      animateZonesIn(z)

    } else if (m === 'guess') {
      gp.rotation = guessAngle
      gp.alpha    = 1
      tp.alpha    = 0
      resetZones(z)

    } else {
      // reveal — hide single pointers, show all guessers + target
      gp.alpha = 0
      tp.alpha = 0
      resetZones(z)

      const rp = drawRevealPointers(revealGuessesRef.current)
      app.stage.addChild(rp)
      revealPtrsRef.current = rp

      setTimeout(() => {
        if (!zonesRef.current || !targetPointerRef.current || !revealPtrsRef.current) return
        // 1. zones fan in
        animateZonesIn(zonesRef.current)
        // 2. all guesser pointers stagger in
        gsap.to(revealPtrsRef.current, { alpha: 1, duration: 0.5, ease: 'power3.out', delay: 0.4 })
      }, 250)
    }
  }

  // Sync on mode change
  useEffect(() => {
    modeRef.current = mode
    guessRef.current = guess
    applyMode(mode, guess)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  // Live drag sync
  useEffect(() => {
    guessRef.current = guess
    if (mode === 'guess' && guessPointerRef.current) {
      guessPointerRef.current.rotation = valueToAngle(guess)
    }
  }, [guess, mode])

  const handleDrag = useCallback((value: number) => {
    onGuessChange(value)
    if (guessPointerRef.current && modeRef.current === 'guess') {
      guessPointerRef.current.rotation = valueToAngle(value)
    }
  }, [onGuessChange])

  const handleRelease = useCallback((value: number) => {
    if (guessPointerRef.current) {
      animatePointerTo(guessPointerRef.current, valueToAngle(value), 0.25)
    }
    onGuessChange(value)
    onGuessConfirm(value)
  }, [onGuessChange, onGuessConfirm])

  useDialDrag(canvasRef, {
    enabled: mode === 'guess',
    onDrag: handleDrag,
    onRelease: handleRelease,
  })

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
        touchAction: 'none',
        userSelect: 'none',
      }}
    />
  )
}
