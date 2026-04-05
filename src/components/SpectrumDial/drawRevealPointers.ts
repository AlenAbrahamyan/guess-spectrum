import { Graphics, Text, Container } from 'pixi.js'
import {
  PIVOT_X, PIVOT_Y,
  NEEDLE_LENGTH,
  PLAYER_COLORS,
  valueToAngle,
} from '../../constants'
import type { RevealGuess } from '../../types'

const HANDLE_R = 14   // smaller handle than main pointer so multiple fit

export function drawRevealPointers(guesses: RevealGuess[]): Container {
  const container = new Container()
  container.x = PIVOT_X
  container.y = PIVOT_Y
  container.alpha = 0   // animated in on reveal

  for (const g of guesses) {
    const color = PLAYER_COLORS[g.colorIndex % PLAYER_COLORS.length]
    const angle = valueToAngle(g.value)

    // Rotating needle sub-container
    const needleContainer = new Container()
    needleContainer.rotation = angle

    const gfx = new Graphics()
    // needle line
    gfx.moveTo(0, 0)
    gfx.lineTo(0, -NEEDLE_LENGTH)
    gfx.stroke({ color, width: 4, cap: 'round' })
    // handle circle
    gfx.circle(0, 0, HANDLE_R)
    gfx.fill({ color })
    // inner dot
    gfx.circle(0, 0, HANDLE_R * 0.4)
    gfx.fill({ color: 0x000000, alpha: 0.25 })

    needleContainer.addChild(gfx)
    container.addChild(needleContainer)

    // Label positioned at needle tip in local space (computed via trig so it doesn't rotate)
    const tipX = Math.sin(angle) * (NEEDLE_LENGTH + 16)
    const tipY = -Math.cos(angle) * (NEEDLE_LENGTH + 16)

    const label = new Text({
      text: g.name,
      style: {
        fontFamily: 'system-ui, sans-serif',
        fontSize: 12,
        fontWeight: '800',
        fill: color,
        stroke: { color: 0x000000, width: 4 },
      },
    })
    label.anchor.set(0.5, 0.5)
    label.x = tipX
    label.y = tipY
    container.addChild(label)
  }

  return container
}
