// Twin Worlds — entry point.
// Wires the canvas, the state, the input and the sound together, runs the
// frame loop, and exposes the live state for playtesting as
// window.__twinWorlds.
import { CANVAS_W, CANVAS_H, HURRY_SECONDS } from './config.js';
import {
  createState,
  startGame,
  nextLevel,
  startLevel,
  resumeGame,
  tick,
} from './world.js';
import { attachInput } from './input.js';
import { draw } from './render.js';
import { SoundEngine } from './audio.js';
import { applyShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const state = createState();
const sound = new SoundEngine();

// The playtest and the screenshot tool read the live game through this.
window.__twinWorlds = { state, version: 'twin-worlds-1.0' };

let lastTickSecond = -1;
const hooks = {
  onStart() {
    sound.ensure();
    startGame(state);
  },
  onNextLevel() {
    sound.ensure();
    nextLevel(state);
  },
  onRestart() {
    sound.ensure();
    startGame(state);
  },
  onRestartLevel() {
    sound.ensure();
    startLevel(state);
  },
  onResume() {
    sound.ensure();
  },
  onFound() {
    sound.found();
    if (state.screen === 'level') sound.levelClear();
    if (state.screen === 'win') sound.win();
  },
  onWrong() {
    sound.wrong();
    if (state.screen === 'over') sound.gameOver();
  },
  onHint() {
    sound.hint();
  },
  onMute(muted) {
    sound.muted = muted;
  },
};
attachInput(canvas, state, hooks);

// Staged screenshot states (?shot=play etc.) freeze the clock.
const staged = applyShot(state, window.location.search);

let last = performance.now();
function frame(now) {
  const dt = Math.min(100, now - last);
  last = now;
  if (!staged) {
    tick(state, dt);
    const second = Math.ceil(state.timeLeft);
    if (state.screen === 'play' && state.timeLeft <= HURRY_SECONDS && second !== lastTickSecond) {
      lastTickSecond = second;
      sound.hurryTick();
    }
  }
  draw(ctx, state);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
