import { Graphics, Container } from 'pixi.js'
import {
  PIVOT_X, PIVOT_Y,
  OUTER_RADIUS,
  SCORE_BANDS,
  valueToArcAngle,
} from '../../constants'

export function drawZones(target: number): Container {
  const container = new Container()
  container.x = PIVOT_X
  container.y = PIVOT_Y
  container.alpha = 0   // hidden until reveal animation

  const centerArc = valueToArcAngle(target)

  const g = new Graphics()

  // Draw from outermost band inward so the bullseye renders on top.
  // Skip the 0-pt band — the base teal arc already covers it.
  const scoringBands = [...SCORE_BANDS].filter(b => b.pts > 0).reverse()

  for (const band of scoringBands) {
    const halfAngle = (band.maxDist / 100) * Math.PI
    const startAngle = centerArc - halfAngle
    const endAngle   = centerArc + halfAngle

    // Fan wedge from center to outer radius
    g.moveTo(0, 0)
    g.arc(0, 0, OUTER_RADIUS, startAngle, endAngle)
    g.closePath()
    g.fill({ color: band.color, alpha: 0.95 })
  }

  container.addChild(g)
  return container
}
