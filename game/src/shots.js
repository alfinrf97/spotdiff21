// Twin Worlds — staged states for screenshots.
// `?shot=play` (and friends) put the game into a fixed, readable moment so
// the screenshots show the game itself: the cover is a mid-hunt play shot
// with four differences found, a hint ringing the fifth, and four still
// hiding. Nothing here changes how the game plays.
import { WORLDS } from './differences.js';
import { startGame, startLevel } from './world.js';

export function applyShot(state, query) {
  const shot = new URLSearchParams(query).get('shot');
  if (!shot) return false;
  if (shot === 'start') {
    state.screen = 'title';
    return true;
  }
  if (shot === 'play') {
    startGame(state);
    // Mid-hunt in Harbour Dawn: four found, the hint ringing the fifth.
    for (let i = 0; i < 4; i += 1) state.found.add(i);
    state.streak = 4;
    state.bestStreak = 4;
    state.score = 550;
    state.levelScore = 550;
    state.hintsLeft = 2;
    state.hint = 4;
    state.hintUntil = state.now + 3600000;
    state.timeLeft = 82;
    state.clicks = 4;
    state.correctClicks = 4;
    return true;
  }
  if (shot === 'play2') {
    startGame(state);
    state.level = 1;
    startLevel(state);
    // Late hunt in Garden Party: six found, the clock in the red.
    for (let i = 0; i < 6; i += 1) state.found.add(i);
    state.streak = 6;
    state.bestStreak = 6;
    state.score = 1425;
    state.levelScore = 1425;
    state.hearts = 2;
    state.hintsLeft = 1;
    state.timeLeft = 21;
    state.clicks = 8;
    state.correctClicks = 6;
    return true;
  }
  if (shot === 'end') {
    startGame(state);
    state.level = 2;
    startLevel(state);
    for (let i = 0; i < 8; i += 1) state.found.add(i);
    state.streak = 9;
    state.bestStreak = 12;
    state.score = 8240;
    state.best = 8240;
    state.clicks = 26;
    state.correctClicks = 24;
    state.screen = 'win';
    state.timeLeft = 47;
    return true;
  }
  return false;
}

export { WORLDS };
