import { Graphics, Container } from 'pixi.js'
import {
  PIVOT_X, PIVOT_Y,
  OUTER_RADIUS,
  COLORS,
} from '../../constants'

export function drawArc(): Container {
  const container = new Container()
  container.x = PIVOT_X
  container.y = PIVOT_Y

  const g = new Graphics()

  // Filled fan — full semicircle from center to outer edge (teal base)
  g.moveTo(0, 0)
  g.arc(0, 0, OUTER_RADIUS, Math.PI, 0)   // clockwise: left → top → right
  g.closePath()
  g.fill({ color: COLORS.dialBase })

  // Subtle outer edge stroke
  g.arc(0, 0, OUTER_RADIUS, Math.PI, 0)
  g.stroke({ color: COLORS.dialStroke, width: 2, alpha: 0.4 })

  container.addChild(g)
  return container
}
