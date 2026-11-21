// Twin Worlds — shared constants for the whole game.
// One place for every number the other modules agree on: the canvas size,
// the two picture panels, the timer, hearts, hints and scoring.
export const CANVAS_W = 1280;
export const CANVAS_H = 720;

// The two pictures sit side by side. Both panels are the same size and the
// differences live in panel-local coordinates, so a difference at (x, y)
// appears at the same spot in both pictures.
export const PANEL = { x: 36, y: 96, w: 560, h: 520 };
export const PANEL_GAP = 88;
export const RIGHT_PANEL_X = PANEL.x + PANEL.w + PANEL_GAP; // 684

export const HIT_RADIUS = 30;
export const LEVEL_TIME = 120; // seconds per world
export const MAX_HEARTS = 3;
export const MAX_HINTS = 3;
export const HINT_COST = 50;
export const HURRY_SECONDS = 20;

export const BEST_KEY = 'twinWorldsBestScore';

// Points for a find: 100 for the first of a streak, then +25 per combo step.
export function pointsForStreak(streak) {
  return 100 + 25 * (streak - 1);
}
