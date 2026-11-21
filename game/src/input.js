// Twin Worlds — mouse and keyboard input.
// The canvas is a fixed 1280x720 logical surface scaled by CSS, so every
// pointer position is converted back into canvas coordinates first. Clicks
// confirm on menus and hunt inside the pictures; arrow keys drive a
// crosshair for players who prefer the keyboard.
import { CANVAS_W, CANVAS_H, PANEL, RIGHT_PANEL_X } from './config.js';
import { clickAt, pauseGame, resumeGame, togglePause, useHint } from './world.js';

function toCanvas(canvas, clientX, clientY) {
  const r = canvas.getBoundingClientRect();
  return {
    x: ((clientX - r.left) / r.width) * CANVAS_W,
    y: ((clientY - r.top) / r.height) * CANVAS_H,
  };
}

// Which panel, if any, holds a canvas point? Returns 'left', 'right' or null,
// plus the point in panel-local coordinates.
export function panelAt(x, y) {
  if (y < PANEL.y || y > PANEL.y + PANEL.h) return null;
  if (x >= PANEL.x && x <= PANEL.x + PANEL.w) {
    return { side: 'left', lx: x - PANEL.x, ly: y - PANEL.y };
  }
  if (x >= RIGHT_PANEL_X && x <= RIGHT_PANEL_X + PANEL.w) {
    return { side: 'right', lx: x - RIGHT_PANEL_X, ly: y - PANEL.y };
  }
  return null;
}

export function attachInput(canvas, state, hooks) {
  canvas.addEventListener('pointermove', (event) => {
    const p = toCanvas(canvas, event.clientX, event.clientY);
    state.crosshair.x = p.x;
    state.crosshair.y = p.y;
  });

  canvas.addEventListener('pointerdown', (event) => {
    const p = toCanvas(canvas, event.clientX, event.clientY);
    state.crosshair.x = p.x;
    state.crosshair.y = p.y;
    if (state.screen === 'title') {
      hooks.onStart();
      return;
    }
    if (state.screen === 'level') {
      hooks.onNextLevel();
      return;
    }
    if (state.screen === 'win' || state.screen === 'over') {
      hooks.onRestart();
      return;
    }
    if (state.screen === 'paused') {
      resumeGame(state);
      hooks.onResume();
      return;
    }
    if (state.screen !== 'play') return;
    const hit = panelAt(p.x, p.y);
    if (!hit) return;
    const found = clickAt(state, hit.lx, hit.ly);
    if (found) hooks.onFound();
    else hooks.onWrong();
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === 'm' || key === 'M') {
      state.muted = !state.muted;
      hooks.onMute(state.muted);
      return;
    }
    if (state.screen === 'title' && (key === ' ' || key === 'Enter')) {
      event.preventDefault();
      hooks.onStart();
      return;
    }
    if (state.screen === 'level' && (key === ' ' || key === 'Enter')) {
      event.preventDefault();
      hooks.onNextLevel();
      return;
    }
    if ((state.screen === 'win' || state.screen === 'over') && (key === ' ' || key === 'Enter')) {
      event.preventDefault();
      hooks.onRestart();
      return;
    }
    if (key === 'p' || key === 'P') {
      togglePause(state);
      return;
    }
    if (state.screen === 'paused' && (key === ' ' || key === 'Enter')) {
      event.preventDefault();
      resumeGame(state);
      hooks.onResume();
      return;
    }
    if (state.screen !== 'play') return;
    if (key === 'h' || key === 'H') {
      if (useHint(state)) hooks.onHint();
      return;
    }
    if (key === 'r' || key === 'R') {
      hooks.onRestartLevel();
      return;
    }
    if (key.startsWith('Arrow')) {
      event.preventDefault();
      const step = event.shiftKey ? 26 : 9;
      state.crosshair.visible = true;
      if (key === 'ArrowLeft') state.crosshair.x -= step;
      if (key === 'ArrowRight') state.crosshair.x += step;
      if (key === 'ArrowUp') state.crosshair.y -= step;
      if (key === 'ArrowDown') state.crosshair.y += step;
      state.crosshair.x = Math.max(0, Math.min(CANVAS_W, state.crosshair.x));
      state.crosshair.y = Math.max(0, Math.min(CANVAS_H, state.crosshair.y));
      return;
    }
    if (key === ' ' || key === 'Enter') {
      event.preventDefault();
      const hit = panelAt(state.crosshair.x, state.crosshair.y);
      if (!hit) return;
      const found = clickAt(state, hit.lx, hit.ly);
      if (found) hooks.onFound();
      else hooks.onWrong();
    }
    if (key === 'Escape') pauseGame(state);
  });
}
