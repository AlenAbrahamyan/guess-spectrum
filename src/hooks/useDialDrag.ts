import { useRef, useEffect, type RefObject } from 'react'
import { PIVOT_X, PIVOT_Y, CANVAS_WIDTH, CANVAS_HEIGHT, angleToValue } from '../constants'

type UseDragOptions = {
  enabled: boolean
  onDrag: (value: number) => void
  onRelease: (value: number) => void
}

export function useDialDrag(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  { enabled, onDrag, onRelease }: UseDragOptions,
) {
  const isDragging = useRef(false)
  const lastValue = useRef(50)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function getAngle(clientX: number, clientY: number): number {
      const rect = canvas!.getBoundingClientRect()
      // CSS scale factor: canvas may be CSS-scaled to fit container
      const scaleX = CANVAS_WIDTH  / rect.width
      const scaleY = CANVAS_HEIGHT / rect.height
      const x = (clientX - rect.left) * scaleX - PIVOT_X
      const y = (clientY - rect.top)  * scaleY - PIVOT_Y
      // atan2(x, -y): pointer graphic points UP (negative Y), so we invert y
      return Math.atan2(x, -y)
    }

    function handleDown(e: PointerEvent) {
      if (!enabled) return
      isDragging.current = true
      canvas!.setPointerCapture(e.pointerId)
      const angle = getAngle(e.clientX, e.clientY)
      // Only start drag if within valid semicircle region (angle ∈ [-π/2, π/2])
      if (angle >= -Math.PI / 2 && angle <= Math.PI / 2) {
        const val = angleToValue(angle)
        lastValue.current = val
        onDrag(val)
      }
    }

    function handleMove(e: PointerEvent) {
      if (!isDragging.current || !enabled) return
      const angle = getAngle(e.clientX, e.clientY)
      // Clamp to semicircle range
      const clamped = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, angle))
      const val = angleToValue(clamped)
      lastValue.current = val
      onDrag(val)
    }

    function handleUp() {
      if (!isDragging.current) return
      isDragging.current = false
      onRelease(lastValue.current)
    }

    canvas.addEventListener('pointerdown', handleDown)
    canvas.addEventListener('pointermove', handleMove)
    canvas.addEventListener('pointerup', handleUp)
    canvas.addEventListener('pointercancel', handleUp)

    return () => {
      canvas.removeEventListener('pointerdown', handleDown)
      canvas.removeEventListener('pointermove', handleMove)
      canvas.removeEventListener('pointerup', handleUp)
      canvas.removeEventListener('pointercancel', handleUp)
    }
  }, [canvasRef, enabled, onDrag, onRelease])
}
