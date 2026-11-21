// Twin Worlds — the game state and its rules.
// One plain object holds everything the renderer and the playtest read:
// the current screen, the world, the score, hearts, hints, the timer and
// which differences have been found. Nothing here touches the canvas.
import {
  BEST_KEY,
  HINT_COST,
  LEVEL_TIME,
  MAX_HEARTS,
  MAX_HINTS,
  pointsForStreak,
} from './config.js';
import { WORLDS, DIFF_COUNT } from './differences.js';

export function loadBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function saveBest(score) {
  try {
    localStorage.setItem(BEST_KEY, String(score));
  } catch {
    // Private mode or no storage: the game still plays.
  }
}

export function createState() {
  return {
    screen: 'title', // title | play | paused | level | win | over
    level: 0,
    score: 0,
    best: loadBest(),
    streak: 0,
    bestStreak: 0,
    hearts: MAX_HEARTS,
    hintsLeft: MAX_HINTS,
    timeLeft: LEVEL_TIME,
    found: new Set(),
    hint: null, // index of the hinted difference, or null
    hintUntil: 0,
    clicks: 0,
    correctClicks: 0,
    overReason: '',
    levelScore: 0,
    // Transient marks, drawn briefly: {x, y, panel, kind, until}
    marks: [],
    // Keyboard crosshair, in canvas coordinates.
    crosshair: { x: 316, y: 356, visible: false, fast: false },
    muted: false,
    now: 0, // milliseconds, advanced by the game loop
    message: '',
  };
}

export function startGame(state) {
  state.screen = 'play';
  state.level = 0;
  state.score = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.clicks = 0;
  state.correctClicks = 0;
  state.levelScore = 0;
  state.overReason = '';
  state.message = '';
  startLevel(state);
}

export function startLevel(state) {
  state.screen = 'play';
  state.hearts = MAX_HEARTS;
  state.hintsLeft = MAX_HINTS;
  state.timeLeft = LEVEL_TIME;
  state.found = new Set();
  state.hint = null;
  state.marks = [];
  state.crosshair = { x: 316, y: 356, visible: false, fast: false };
}

export function worldName(state) {
  return WORLDS[state.level].name;
}

export function foundCount(state) {
  return state.found.size;
}

export function accuracy(state) {
  if (state.clicks === 0) return 100;
  return Math.round((100 * state.correctClicks) / state.clicks);
}

// A click inside a picture, in panel-local coordinates. Returns true when
// it found a difference.
export function clickAt(state, localX, localY) {
  if (state.screen !== 'play') return false;
  state.clicks += 1;
  const diffs = WORLDS[state.level].diffs;
  for (let i = 0; i < diffs.length; i += 1) {
    if (state.found.has(i)) continue;
    const dx = localX - diffs[i].x;
    const dy = localY - diffs[i].y;
    if (dx * dx + dy * dy <= 30 * 30) {
      state.found.add(i);
      state.correctClicks += 1;
      state.streak += 1;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      const gained = pointsForStreak(state.streak);
      state.score += gained;
      state.levelScore += gained;
      state.hint = null;
      state.marks.push({ x: diffs[i].x, y: diffs[i].y, kind: 'found', until: state.now + 900 });
      if (state.found.size === DIFF_COUNT) completeLevel(state);
      return true;
    }
  }
  // A miss: lose a heart and the streak, and leave a red X behind.
  state.streak = 0;
  state.hearts -= 1;
  state.marks.push({ x: localX, y: localY, kind: 'wrong', until: state.now + 900 });
  if (state.hearts <= 0) {
    state.screen = 'over';
    state.overReason = 'out of hearts';
    if (state.score > state.best) {
      state.best = state.score;
      saveBest(state.score);
    }
  }
  return false;
}

export function useHint(state) {
  if (state.screen !== 'play' || state.hintsLeft <= 0) return false;
  const diffs = WORLDS[state.level].diffs;
  for (let i = 0; i < diffs.length; i += 1) {
    if (!state.found.has(i)) {
      state.hintsLeft -= 1;
      state.score = Math.max(0, state.score - HINT_COST);
      state.hint = i;
      state.hintUntil = state.now + 4000;
      return true;
    }
  }
  return false;
}

export function completeLevel(state) {
  const timeBonus = Math.round(state.timeLeft) * 5;
  const heartBonus = state.hearts * 50;
  state.score += timeBonus + heartBonus;
  state.levelScore += timeBonus + heartBonus;
  if (state.level >= WORLDS.length - 1) {
    state.screen = 'win';
    if (state.score > state.best) {
      state.best = state.score;
      saveBest(state.score);
    }
  } else {
    state.screen = 'level';
  }
}

export function nextLevel(state) {
  if (state.screen !== 'level') return;
  state.level += 1;
  state.levelScore = 0;
  startLevel(state);
}

export function pauseGame(state) {
  if (state.screen === 'play') state.screen = 'paused';
}

export function resumeGame(state) {
  if (state.screen === 'paused') state.screen = 'play';
}

export function togglePause(state) {
  if (state.screen === 'play') state.screen = 'paused';
  else if (state.screen === 'paused') state.screen = 'play';
}

// Advance the clock. Only the play screen drains the timer.
export function tick(state, dtMs) {
  state.now += dtMs;
  if (state.screen !== 'play') return;
  if (state.hint !== null && state.now > state.hintUntil) state.hint = null;
  state.timeLeft -= dtMs / 1000;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    state.screen = 'over';
    state.overReason = 'time up';
    if (state.score > state.best) {
      state.best = state.score;
      saveBest(state.score);
    }
  }
  state.marks = state.marks.filter((m) => m.until > state.now);
}
