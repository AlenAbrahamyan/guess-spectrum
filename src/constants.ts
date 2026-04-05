import { CONFIG } from './config'

// ── Derived canvas/geometry values ─────────────────────────────────────────
export const CANVAS_WIDTH  = CONFIG.canvas.width
export const CANVAS_HEIGHT = CONFIG.canvas.height

export const PIVOT_X = CANVAS_WIDTH / 2
export const PIVOT_Y = Math.round(CANVAS_HEIGHT * CONFIG.dial.pivotYRatio)

export const OUTER_RADIUS  = Math.round(CANVAS_WIDTH * CONFIG.dial.outerRadiusRatio)
export const INNER_RADIUS  = Math.round(OUTER_RADIUS * CONFIG.dial.innerRadiusRatio)
export const NEEDLE_LENGTH = Math.round(OUTER_RADIUS * CONFIG.dial.needleLengthRatio)

// ── Pixi hex colors (derived from CONFIG.colors hex strings) ────────────────
function hex(s: string): number { return parseInt(s.replace('#', ''), 16) }

export const COLORS = {
  background:   hex(CONFIG.colors.background),
  dialBase:     hex(CONFIG.colors.dialFill),
  dialStroke:   hex(CONFIG.colors.dialStroke),
  pointer:      hex(CONFIG.colors.handle),
  needleLine:   hex(CONFIG.colors.handle),
  targetHandle: hex(CONFIG.colors.targetHandle),
  bullseye:     hex(CONFIG.colors.bullseye),
  close:        hex(CONFIG.colors.close),
  far:          hex(CONFIG.colors.far),
  outer:        hex(CONFIG.colors.outer),
  tickMark:     0xffffff,
  labelText:    0xffffff,
}

// ── CSS colors (pass-through from config) ──────────────────────────────────
export const CSS_COLORS = {
  bg:        CONFIG.colors.background,
  panel:     CONFIG.colors.panel,
  accent:    CONFIG.colors.accent,
  text:      CONFIG.colors.text,
  textDim:   CONFIG.colors.textDim,
  bullseye:  CONFIG.colors.bullseye,
  close:     CONFIG.colors.close,
  far:       CONFIG.colors.far,
  outer:     CONFIG.colors.outer,
}

// ── Scoring bands ──────────────────────────────────────────────────────────
const BAND_COLORS = [COLORS.bullseye, COLORS.close, COLORS.far, COLORS.outer]

export const SCORE_BANDS = CONFIG.scoring.bands.map((b, i) => ({
  maxDist: b.maxDist,
  pts:     b.pts,
  color:   BAND_COLORS[i] ?? 0x444444,
}))

export function scoreDistance(guess: number, target: number): number {
  const d = Math.abs(guess - target)
  for (const band of SCORE_BANDS) {
    if (d <= band.maxDist) return band.pts
  }
  return 0
}

// ── Angle helpers ──────────────────────────────────────────────────────────

/**
 * Value → pointer ROTATION angle (for rotating the needle Container).
 *   0   → -π/2  needle points left
 *   50  →  0    needle points up
 *   100 → +π/2  needle points right
 */
export function valueToAngle(value: number): number {
  return (value / 100) * Math.PI - Math.PI / 2
}

/**
 * Value → ARC angle (for Graphics.arc() calls on the fan).
 * Arc is drawn clockwise from π (left) through 3π/2 (top) to 2π/0 (right).
 *   0   → π
 *   50  → 3π/2
 *   100 → 2π (= 0)
 */
export function valueToArcAngle(value: number): number {
  return Math.PI + (value / 100) * Math.PI
}

// Per-player colour palette (up to 8 players)
export const PLAYER_COLORS = [
  0xe82040, 0x4488ff, 0xffdd33, 0x44ee88,
  0xff8822, 0xcc44ff, 0xff66aa, 0x44ffee,
]
export const PLAYER_CSS_COLORS = [
  '#e82040', '#4488ff', '#ffdd33', '#44ee88',
  '#ff8822', '#cc44ff', '#ff66aa', '#44ffee',
]

export function angleToValue(angle: number): number {
  return Math.max(0, Math.min(100, ((angle + Math.PI / 2) / Math.PI) * 100))
}
