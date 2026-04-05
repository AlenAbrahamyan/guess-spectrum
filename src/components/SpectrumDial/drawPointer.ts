import { Graphics, Container } from 'pixi.js'
import { PIVOT_X, PIVOT_Y, NEEDLE_LENGTH, COLORS } from '../../constants'
import { CONFIG } from '../../config'

export function drawPointer(color = COLORS.pointer): Container {
  const container = new Container()
  container.x = PIVOT_X
  container.y = PIVOT_Y

  const g = new Graphics()
  const r = CONFIG.dial.handleRadius
  const w = CONFIG.dial.needleWidth

  // Thin needle line pointing UP (negative Y in Pixi)
  g.moveTo(0, 0)
  g.lineTo(0, -NEEDLE_LENGTH)
  g.stroke({ color, width: w, cap: 'round' })

  // Large handle circle at pivot
  g.circle(0, 0, r)
  g.fill({ color })

  // Small inner ring for depth
  g.circle(0, 0, r * 0.45)
  g.fill({ color: 0x000000, alpha: 0.18 })

  container.addChild(g)
  return container
}
