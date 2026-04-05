import { useRef, useEffect, type RefObject } from 'react'
import { Application } from 'pixi.js'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants'

export function usePixiApp(containerRef: RefObject<HTMLDivElement | null>) {
  const appRef = useRef<Application | null>(null)

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      const app = new Application()
      await app.init({
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        backgroundAlpha: 0,
        antialias: true,
        resolution: 2,
        autoDensity: true,
      })

      if (cancelled) {
        app.destroy(true, { children: true })
        return
      }

      // Style the canvas for responsive CSS scaling
      app.canvas.style.width = '100%'
      app.canvas.style.height = '100%'
      app.canvas.style.display = 'block'

      containerRef.current?.appendChild(app.canvas)
      appRef.current = app
    }

    init()

    return () => {
      cancelled = true
      if (appRef.current) {
        appRef.current.destroy(true, { children: true })
        appRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return appRef
}
