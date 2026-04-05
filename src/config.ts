// ─────────────────────────────────────────────
//  WAVELENGTH — Central Config
//  Edit this file to tweak colours, sizes,
//  gameplay values and animation timings.
// ─────────────────────────────────────────────

export const CONFIG = {

  // ── Canvas ───────────────────────────────────
  canvas: {
    width:  390,
    height: 380,
  },

  // ── Dial geometry ────────────────────────────
  dial: {
    /** Outer radius as a fraction of canvas width */
    outerRadiusRatio:  0.46,
    /** Inner radius as a fraction of outer radius (unused in fan mode) */
    innerRadiusRatio:  0.58,
    /** Pivot Y position as a fraction of canvas height */
    pivotYRatio:       0.88,
    /** Needle length as a fraction of outer radius */
    needleLengthRatio: 0.92,
    /** Radius of the large handle circle in px */
    handleRadius:      26,
    /** Width of the needle line in px */
    needleWidth:       5,
  },

  // ── Scoring zones ────────────────────────────
  scoring: {
    /** Score bands from tightest to widest */
    bands: [
      { maxDist: 5/3,        pts: 4 },
      { maxDist: 15/3,       pts: 3 },
      { maxDist: 25/3,       pts: 2 },
      { maxDist: 35/3,       pts: 1 },
    ] as { maxDist: number; pts: number }[],
  },

  // ── Colors ───────────────────────────────────
  colors: {
    // Dial canvas
    dialFill:       '#3abccc',   // teal fan background
    dialStroke:     '#2a9aaa',   // outer edge stroke
    handle:         '#e82040',   // guess pointer handle + needle
    targetHandle:   '#22dd66',   // target pointer handle (shown on reveal)

    // Scoring zone fills
    bullseye:  '#f5e8c0',   // 4 pts — cream
    close:     '#ffdd33',   // 3 pts — yellow
    far:       '#ff8822',   // 2 pts — orange
    outer:     '#ff4422',   // 1 pt  — red-orange

    // App UI (React)
    background: '#0d0d1a',
    panel:      '#12122a',
    accent:     '#4a4aff',
    text:       '#e0e0ff',
    textDim:    '#7070aa',
  },

  // ── Game rules ───────────────────────────────
  game: {
    defaultMaxRounds:    3,
    defaultPlayerCount:  2,
    minPlayers:          2,
    maxPlayers:          8,
    /** How many topics 🎲 Random picks */
    randomTopicCount:    2,
    /** Target is generated in [minTarget, maxTarget] to avoid extreme edges */
    minTarget: 10,
    maxTarget: 90,
  },

  // ── Animations ───────────────────────────────
  animation: {
    screenEnterDuration:   0.22,   // seconds
    pointerSnapDuration:   0.35,
    pointerRevealDuration: 0.9,
    zonesRevealDuration:   0.5,
    scorePopupDelay:       0.8,
    scorePopupDuration:    0.5,
    orbDurations:          [7, 11, 13],  // prime numbers avoid syncing
  },
}
