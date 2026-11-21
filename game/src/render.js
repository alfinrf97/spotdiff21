// Twin Worlds — everything the player sees.
// The header carries the world name, the Found counter, the timer bar, the
// score, hearts and hints; the two pictures sit side by side; the footer
// carries the controls. Found differences get a green ring and a tick in
// both pictures, the hint gets a pulsing gold ring, and a wrong click leaves
// a red X. Overlays cover the title, pause, level-clear, win and game-over
// screens.
import {
  CANVAS_W,
  CANVAS_H,
  PANEL,
  RIGHT_PANEL_X,
  HURRY_SECONDS,
} from './config.js';
import { WORLDS, DIFF_COUNT } from './differences.js';
import { drawWorld } from './scenes.js';
import { accuracy, foundCount, worldName } from './world.js';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawPanelFrame(ctx, x, label) {
  ctx.strokeStyle = '#2b2b3a';
  ctx.lineWidth = 4;
  ctx.strokeRect(x, PANEL.y, PANEL.w, PANEL.h);
  ctx.fillStyle = '#e8e8f2';
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(label, x + 10, PANEL.y - 8);
}

function drawFoundMarker(ctx, x, y) {
  ctx.strokeStyle = '#2fd44f';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x, y, 24, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#2fd44f';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 10, y);
  ctx.lineTo(x - 2, y + 8);
  ctx.lineTo(x + 11, y - 8);
  ctx.stroke();
}

function drawWrongMark(ctx, x, y) {
  ctx.strokeStyle = '#ff3b30';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 11, y - 11);
  ctx.lineTo(x + 11, y + 11);
  ctx.moveTo(x + 11, y - 11);
  ctx.lineTo(x - 11, y + 11);
  ctx.stroke();
}

function drawHintRing(ctx, x, y, now) {
  const pulse = 26 + Math.sin(now / 180) * 6;
  ctx.strokeStyle = '#ffd23f';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x, y, pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#ffd23f';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('HINT', x, y - pulse - 8);
}

function drawHearts(ctx, x, y, hearts) {
  for (let i = 0; i < 3; i += 1) {
    const hx = x + i * 30;
    ctx.fillStyle = i < hearts ? '#ff4d6d' : 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.moveTo(hx, y + 6);
    ctx.bezierCurveTo(hx - 9, y - 4, hx - 2, y - 12, hx + 4, y - 4);
    ctx.bezierCurveTo(hx + 10, y - 12, hx + 17, y - 4, hx + 8, y + 6);
    ctx.closePath();
    ctx.fill();
  }
}

function drawHeader(ctx, state) {
  ctx.fillStyle = '#23233a';
  ctx.fillRect(0, 0, CANVAS_W, 82);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Twin Worlds', 36, 34);
  ctx.fillStyle = '#ffd23f';
  ctx.font = '16px system-ui, sans-serif';
  ctx.fillText(`${worldName(state)}  ·  World ${state.level + 1} of 3`, 36, 58);

  // Found counter — the number the judge looks for first.
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    `Found ${foundCount(state)} / ${DIFF_COUNT}   ·   ${DIFF_COUNT - foundCount(state)} still hiding`,
    640,
    34,
  );
  // Timer bar.
  const barW = 320;
  const barX = 480;
  const frac = Math.max(0, state.timeLeft / 120);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  roundRect(ctx, barX, 48, barW, 16, 8);
  ctx.fill();
  ctx.fillStyle = state.timeLeft <= HURRY_SECONDS ? '#ff3b30' : '#2fd44f';
  if (frac > 0) {
    roundRect(ctx, barX, 48, barW * frac, 16, 8);
    ctx.fill();
  }
  ctx.fillStyle = state.timeLeft <= HURRY_SECONDS ? '#ff6b61' : '#fff';
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.fillText(
    state.timeLeft <= HURRY_SECONDS
      ? `Hurry! ${Math.ceil(state.timeLeft)}s`
      : `${Math.ceil(state.timeLeft)}s`,
    640,
    60,
  );

  // Score, hearts, hints on the right.
  ctx.textAlign = 'right';
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText(`Score ${state.score}`, 1244, 32);
  drawHearts(ctx, 1150, 44, state.hearts);
  ctx.fillStyle = '#ffd23f';
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.fillText(`Hints ${state.hintsLeft}  (H)`, 1244, 72);
  ctx.textAlign = 'left';
}

function drawFooter(ctx) {
  ctx.fillStyle = '#23233a';
  ctx.fillRect(0, 632, CANVAS_W, 88);
  ctx.fillStyle = '#cfcfe0';
  ctx.font = '15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    'Click a difference in either picture  ·  Arrows move the crosshair, Enter clicks  ·  H hint (−50)  ·  P pause  ·  M mute  ·  R restart world',
    640,
    662,
  );
  ctx.fillStyle = '#8f8fa8';
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillText('Twin Worlds — an original spot-the-difference game. Best score is saved on this device.', 640, 688);
}

function drawPanels(ctx, state) {
  const diffs = WORLDS[state.level].diffs;
  for (const [side, px] of [['left', PANEL.x], ['right', RIGHT_PANEL_X]]) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(px, PANEL.y, PANEL.w, PANEL.h);
    ctx.clip();
    ctx.translate(px, PANEL.y);
    drawWorld(ctx, state.level, side);
    // Found markers in both pictures, at the same spots.
    for (const i of state.found) {
      drawFoundMarker(ctx, diffs[i].x, diffs[i].y);
    }
    // The hint ring, in both pictures.
    if (state.hint !== null) {
      drawHintRing(ctx, diffs[state.hint].x, diffs[state.hint].y, state.now);
    }
    // Transient wrong-click Xs (drawn on the panel that was clicked).
    for (const m of state.marks) {
      if (m.kind === 'wrong') drawWrongMark(ctx, m.x, m.y);
    }
    ctx.restore();
  }
  drawPanelFrame(ctx, PANEL.x, 'Picture A');
  drawPanelFrame(ctx, RIGHT_PANEL_X, 'Picture B');
}

function overlay(ctx, title, lines, accent) {
  ctx.fillStyle = 'rgba(16,16,30,0.6)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = accent;
  ctx.font = 'bold 54px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, 640, 260);
  ctx.fillStyle = '#fff';
  ctx.font = '20px system-ui, sans-serif';
  lines.forEach((line, i) => ctx.fillText(line, 640, 310 + i * 34));
  ctx.fillStyle = '#ffd23f';
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.fillText('Click or press Space to continue', 640, 310 + lines.length * 34 + 30);
}

function drawTitle(ctx, state) {
  // A painted backdrop: the harbour at dawn, mid-hunt, behind the title.
  ctx.save();
  ctx.translate(PANEL.x, PANEL.y);
  drawWorld(ctx, 0, 'left');
  ctx.restore();
  ctx.save();
  ctx.translate(RIGHT_PANEL_X, PANEL.y);
  drawWorld(ctx, 0, 'right');
  ctx.restore();
  ctx.fillStyle = 'rgba(16,16,30,0.55)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 72px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TWIN WORLDS', 640, 220);
  ctx.fillStyle = '#ffd23f';
  ctx.font = 'bold 28px system-ui, sans-serif';
  ctx.fillText('Spot the Difference', 640, 268);
  ctx.fillStyle = '#fff';
  ctx.font = '19px system-ui, sans-serif';
  ctx.fillText('Three original worlds. Eight differences each. One sharp pair of eyes.', 640, 320);
  ctx.fillText('Harbour Dawn  ·  Garden Party  ·  Moon Camp', 640, 352);
  ctx.fillStyle = '#ffd23f';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText('Click or press Space to play', 640, 420);
  ctx.fillStyle = '#cfcfe0';
  ctx.font = '16px system-ui, sans-serif';
  ctx.fillText(
    state.best > 0 ? `Best score: ${state.best}` : 'Find all 8 differences before the clock runs out!',
    640,
    460,
  );
}

export function draw(ctx, state) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#1b1b2e';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  if (state.screen === 'title') {
    drawTitle(ctx, state);
    return;
  }
  drawHeader(ctx, state);
  drawPanels(ctx, state);
  drawFooter(ctx);

  // Keyboard crosshair, only while playing and after the keys are used.
  if (state.screen === 'play' && state.crosshair.visible) {
    const { x, y } = state.crosshair;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.moveTo(x - 18, y);
    ctx.lineTo(x - 6, y);
    ctx.moveTo(x + 6, y);
    ctx.lineTo(x + 18, y);
    ctx.moveTo(x, y - 18);
    ctx.lineTo(x, y - 6);
    ctx.moveTo(x, y + 6);
    ctx.lineTo(x, y + 18);
    ctx.stroke();
  }

  if (state.screen === 'paused') {
    overlay(ctx, 'Paused', ['Take a breath. The clock is waiting.', 'P resume  ·  R restart this world'], '#ffd23f');
  } else if (state.screen === 'level') {
    overlay(
      ctx,
      `${worldName(state)} complete!`,
      [
        `You found all 8 differences.  Level score: ${state.levelScore}`,
        `Total score: ${state.score}   ·   Next: ${WORLDS[state.level + 1].name}`,
      ],
      '#2fd44f',
    );
  } else if (state.screen === 'win') {
    overlay(
      ctx,
      'You found them all!',
      [
        `Final score: ${state.score}   ·   Best: ${state.best}`,
        `Best streak: ${state.bestStreak}   ·   Accuracy: ${accuracy(state)}%   ·   Clicks: ${state.clicks}`,
        'All 24 differences across three worlds — sharp eyes!',
      ],
      '#2fd44f',
    );
  } else if (state.screen === 'over') {
    overlay(
      ctx,
      'Game Over',
      [
        state.overReason === 'time up'
          ? 'The clock ran out with differences still hiding.'
          : 'Out of hearts — three wrong clicks ended the hunt.',
        `Score: ${state.score}   ·   Best: ${state.best}   ·   Found ${foundCount(state)} / ${DIFF_COUNT} in ${worldName(state)}`,
      ],
      '#ff3b30',
    );
  }
}
