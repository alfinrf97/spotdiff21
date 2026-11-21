// Twin Worlds — the three hand-drawn worlds.
// Every picture is drawn procedurally on canvas: no images, no assets, no
// network. Each world paints its base scene identically for both panels
// (same seeded decoration), then paints its 8 differences only on the left
// picture — or, for two of them, in a different colour on the right — so
// the two pictures are near-identical and every difference is fair.
import { mulberry32, range, intBetween } from './random.js';

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function poly(ctx, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

// ---------------------------------------------------------------- harbour
function drawHarbour(ctx, side) {
  const rng = mulberry32(1000);
  // Dawn sky, sea and sand.
  const sky = ctx.createLinearGradient(0, 0, 0, 190);
  sky.addColorStop(0, '#ffe3b3');
  sky.addColorStop(1, '#ffd1a1');
  rect(ctx, 0, 0, 560, 190, sky);
  const sea = ctx.createLinearGradient(0, 190, 0, 430);
  sea.addColorStop(0, '#7fc4d8');
  sea.addColorStop(1, '#3f8fb5');
  rect(ctx, 0, 190, 560, 240, sea);
  const sand = ctx.createLinearGradient(0, 430, 0, 520);
  sand.addColorStop(0, '#f2d8a0');
  sand.addColorStop(1, '#e3c07e');
  rect(ctx, 0, 430, 560, 90, sand);

  // Seeded clouds, waves and pebbles — identical in both pictures.
  for (let i = 0; i < 4; i += 1) {
    const cx = range(rng, 40, 500);
    const cy = range(rng, 25, 120);
    ellipse(ctx, cx, cy, 34, 13, 'rgba(255,255,255,0.85)');
    ellipse(ctx, cx + 22, cy + 5, 24, 10, 'rgba(255,255,255,0.8)');
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 9; i += 1) {
    const wy = range(rng, 210, 410);
    const wx = range(rng, 20, 420);
    ctx.beginPath();
    ctx.arc(wx, wy, range(rng, 12, 26), Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  }
  for (let i = 0; i < 14; i += 1) {
    circle(ctx, range(rng, 20, 540), range(rng, 445, 505), range(rng, 2, 5), '#c9a86a');
  }

  // Rocky island and lighthouse, centre-right.
  poly(ctx, [[285, 265], [375, 265], [360, 185], [300, 185]], '#8d8578');
  poly(ctx, [[300, 185], [360, 185], [350, 150], [310, 150]], '#7a7266');
  rect(ctx, 318, 78, 26, 108, '#f4ede0');
  rect(ctx, 314, 70, 34, 10, '#c0392b');
  rect(ctx, 318, 150, 26, 6, '#c0392b');
  // Difference 5: the lighthouse lamp glows on the left, dark on the right.
  circle(ctx, 331, 172, 9, side === 'left' ? '#ffe066' : '#5a5348');
  if (side === 'left') {
    ctx.strokeStyle = 'rgba(255,224,102,0.7)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(331, 172, 16, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Difference 1: the gull flies on the left only.
  if (side === 'left') {
    ctx.strokeStyle = '#3d3d3d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(86, 72, 9, Math.PI * 1.15, Math.PI * 1.85);
    ctx.arc(104, 72, 9, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  // Difference 2: the morning sun shines on the left; a small cloud on the right.
  if (side === 'left') {
    circle(ctx, 470, 82, 26, '#ffcf3f');
    ctx.strokeStyle = '#ffcf3f';
    ctx.lineWidth = 4;
    for (let a = 0; a < 8; a += 1) {
      const ang = (a * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(470 + Math.cos(ang) * 33, 82 + Math.sin(ang) * 33);
      ctx.lineTo(470 + Math.cos(ang) * 42, 82 + Math.sin(ang) * 42);
      ctx.stroke();
    }
  } else {
    ellipse(ctx, 470, 82, 30, 12, 'rgba(255,255,255,0.9)');
  }

  // Sailboat, mid-sea. Difference 3: red sail on the left, white on the right.
  rect(ctx, 176, 198, 4, 62, '#6b4a2f');
  poly(ctx, [[180, 202], [180, 252], [214, 252]], side === 'left' ? '#d64545' : '#f7f3ea');
  poly(ctx, [[176, 208], [176, 252], [148, 252]], '#f7f3ea');
  poly(ctx, [[146, 256], [222, 256], [210, 272], [158, 272]], '#8a5a33');

  // A distant boat on the horizon, in both pictures.
  poly(ctx, [[428, 232], [462, 232], [454, 242], [436, 242]], '#5d4030');
  poly(ctx, [[444, 208], [444, 232], [460, 232]], '#fff8e7');
  // A second, smaller boat far away, and a few birds — same in both pictures.
  poly(ctx, [[60, 300], [84, 300], [78, 308], [66, 308]], '#6b4a2f');
  poly(ctx, [[70, 282], [70, 300], [82, 300]], '#fff8e7');
  ctx.strokeStyle = 'rgba(61,61,61,0.8)';
  ctx.lineWidth = 2;
  for (const [bx, by] of [[210, 60], [250, 48], [400, 130]]) {
    ctx.beginPath();
    ctx.arc(bx - 7, by, 7, Math.PI * 1.15, Math.PI * 1.85);
    ctx.arc(bx + 7, by, 7, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  // The lighthouse lamp shimmers on the water below the island.
  ctx.fillStyle = 'rgba(255,224,102,0.18)';
  ctx.fillRect(326, 268, 10, 46);

  // Difference 4: the orange buoy bobs on the left only.
  if (side === 'left') {
    circle(ctx, 300, 402, 13, '#ff7f2a');
    rect(ctx, 288, 396, 24, 6, '#fff');
    rect(ctx, 297, 384, 6, 12, '#c0392b');
  }

  // Wooden dock from the right edge.
  for (let x = 372; x < 560; x += 34) rect(ctx, x, 352, 30, 44, '#9a6b3f');
  rect(ctx, 372, 352, 188, 8, '#7d5530');
  rect(ctx, 372, 388, 188, 8, '#7d5530');
  // Difference 6: a crate sits on the dock on the left only.
  if (side === 'left') {
    rect(ctx, 366, 356, 32, 30, '#b07a3e');
    ctx.strokeStyle = '#7d5530';
    ctx.lineWidth = 3;
    ctx.strokeRect(366, 356, 32, 30);
    ctx.beginPath();
    ctx.moveTo(366, 356);
    ctx.lineTo(398, 386);
    ctx.moveTo(398, 356);
    ctx.lineTo(366, 386);
    ctx.stroke();
  }
  // Difference 7: a coiled rope rests on the sand on the left only.
  if (side === 'left') {
    ctx.strokeStyle = '#a9803e';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(432, 448, 14, 0, Math.PI * 2);
    ctx.arc(432, 448, 7, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Difference 8: a starfish on the sand on the left only.
  if (side === 'left') {
    ctx.fillStyle = '#ff8c69';
    ctx.beginPath();
    for (let a = 0; a < 5; a += 1) {
      const ang = -Math.PI / 2 + (a * 2 * Math.PI) / 5;
      const ox = 118 + Math.cos(ang) * 14;
      const oy = 452 + Math.sin(ang) * 14;
      const ix = 118 + Math.cos(ang + Math.PI / 5) * 6;
      const iy = 452 + Math.sin(ang + Math.PI / 5) * 6;
      if (a === 0) ctx.moveTo(ox, oy);
      else ctx.lineTo(ox, oy);
      ctx.lineTo(ix, iy);
    }
    ctx.closePath();
    ctx.fill();
  }
}

// ----------------------------------------------------------------- garden
function drawGarden(ctx, side) {
  const rng = mulberry32(2000);
  const sky = ctx.createLinearGradient(0, 0, 0, 170);
  sky.addColorStop(0, '#bfe8ff');
  sky.addColorStop(1, '#e8f7d8');
  rect(ctx, 0, 0, 560, 170, sky);
  const lawn = ctx.createLinearGradient(0, 150, 0, 520);
  lawn.addColorStop(0, '#8fce6a');
  lawn.addColorStop(1, '#5da244');
  rect(ctx, 0, 150, 560, 370, lawn);
  for (let i = 0; i < 5; i += 1) {
    const cx = range(rng, 40, 520);
    const cy = range(rng, 20, 90);
    ellipse(ctx, cx, cy, 30, 11, 'rgba(255,255,255,0.9)');
  }
  // Seeded grass tufts and wildflowers — identical in both pictures.
  ctx.strokeStyle = '#4a8a35';
  ctx.lineWidth = 2;
  for (let i = 0; i < 26; i += 1) {
    const gx = range(rng, 15, 545);
    const gy = range(rng, 360, 510);
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx - 4, gy - 12);
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx + 4, gy - 12);
    ctx.stroke();
  }
  const petal = ['#ff8fb3', '#ffd23f', '#c39bff'];
  for (let i = 0; i < 10; i += 1) {
    circle(ctx, range(rng, 30, 530), range(rng, 380, 500), 5, petal[intBetween(rng, 0, 2)]);
  }

  // Big tree, left of centre.
  rect(ctx, 256, 190, 30, 160, '#7a5230');
  circle(ctx, 272, 128, 92, '#4f9e3e');
  circle(ctx, 205, 165, 55, '#5fb04a');
  circle(ctx, 340, 165, 55, '#5fb04a');
  // Difference 2: a red apple hangs in the canopy on the left only.
  if (side === 'left') {
    circle(ctx, 272, 128, 11, '#e23b3b');
    ctx.strokeStyle = '#7a5230';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(272, 118);
    ctx.lineTo(276, 108);
    ctx.stroke();
  }
  // Difference 1: a butterfly flutters top-left on the left only.
  if (side === 'left') {
    ellipse(ctx, 110, 58, 10, 7, '#ff9ff3');
    ellipse(ctx, 126, 58, 10, 7, '#f368e0');
    ctx.strokeStyle = '#3d3d3d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(118, 52);
    ctx.lineTo(118, 72);
    ctx.stroke();
  }

  // Pond, right of the tree.
  ellipse(ctx, 332, 232, 112, 52, '#5db8d6');
  ellipse(ctx, 332, 232, 96, 42, '#79cbe4');
  ellipse(ctx, 300, 222, 26, 9, '#3f9db5');
  ellipse(ctx, 360, 244, 26, 9, '#3f9db5');
  // Difference 3: a pink lily flower blooms on the pond on the left only.
  if (side === 'left') {
    for (let a = 0; a < 5; a += 1) {
      const ang = (a * 2 * Math.PI) / 5;
      ellipse(ctx, 332 + Math.cos(ang) * 9, 198 + Math.sin(ang) * 9, 8, 5, '#ff9ff3');
    }
    circle(ctx, 332, 198, 6, '#ffd23f');
  }

  // Fence across the back of the lawn.
  rect(ctx, 0, 306, 560, 8, '#a9803e');
  rect(ctx, 0, 336, 560, 8, '#a9803e');
  for (let x = 30; x <= 530; x += 100) rect(ctx, x, 292, 14, 66, '#c49a5b');

  // Difference 4: a birdhouse on its pole, right side, on the left only.
  rect(ctx, 426, 118, 10, 180, '#8a6b45');
  if (side === 'left') {
    poly(ctx, [[410, 118], [454, 118], [432, 96]], '#c0392b');
    rect(ctx, 414, 118, 36, 30, '#e8a94e');
    circle(ctx, 432, 132, 7, '#3d2b1f');
  }
  // Difference 5: the garden gnome stands by the fence on the left only.
  if (side === 'left') {
    poly(ctx, [[484, 302], [512, 302], [498, 272]], '#e23b3b');
    rect(ctx, 486, 300, 24, 26, '#3f6fd6');
    circle(ctx, 498, 296, 7, '#f2c9a0');
    ellipse(ctx, 498, 330, 14, 6, '#f2f2f2');
  }
  // Difference 6: a mushroom grows by the tree on the left only.
  if (side === 'left') {
    rect(ctx, 144, 382, 8, 14, '#f7f3ea');
    poly(ctx, [[132, 384], [164, 384], [148, 364]], '#e23b3b');
    circle(ctx, 142, 374, 2, '#fff');
    circle(ctx, 154, 370, 2, '#fff');
  }
  // Bushes in the bottom corners and a stone path — same in both pictures.
  circle(ctx, 40, 500, 34, '#3f8a2f');
  circle(ctx, 66, 508, 26, '#4f9e3e');
  circle(ctx, 520, 498, 32, '#3f8a2f');
  circle(ctx, 496, 508, 24, '#4f9e3e');
  // Stepping-stone path. Difference 7: the middle stone is there on the left only.
  ellipse(ctx, 190, 462, 30, 12, '#d8d2c4');
  ellipse(ctx, 286, 442, 30, 12, '#d8d2c4');
  if (side === 'left') ellipse(ctx, 382, 422, 30, 12, '#cfc8b8');
  ellipse(ctx, 470, 402, 30, 12, '#d8d2c4');
  // Difference 8: a red tulip blooms bottom-left on the left only.
  if (side === 'left') {
    ctx.strokeStyle = '#2f7a2f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(92, 432);
    ctx.lineTo(92, 456);
    ctx.stroke();
    poly(ctx, [[84, 432], [100, 432], [92, 412]], '#e23b3b');
    circle(ctx, 92, 414, 6, '#e23b3b');
  }
}

// -------------------------------------------------------------- moon camp
function drawMoonCamp(ctx, side) {
  const rng = mulberry32(3000);
  const night = ctx.createLinearGradient(0, 0, 0, 520);
  night.addColorStop(0, '#101a3d');
  night.addColorStop(1, '#274472');
  rect(ctx, 0, 0, 560, 520, night);
  // Seeded stars — identical in both pictures.
  for (let i = 0; i < 46; i += 1) {
    const sx = range(rng, 10, 550);
    const sy = range(rng, 10, 300);
    circle(ctx, sx, sy, range(rng, 1, 2.4), 'rgba(255,255,255,0.9)');
  }
  // Pine silhouettes at both edges.
  for (const px of [28, 528]) {
    poly(ctx, [[px - 26, 520], [px + 26, 520], [px, 400]], '#0d2b1a');
    poly(ctx, [[px - 20, 450], [px + 20, 450], [px, 360]], '#123a24');
  }
  // Ground.
  const ground = ctx.createLinearGradient(0, 380, 0, 520);
  ground.addColorStop(0, '#1e4a2e');
  ground.addColorStop(1, '#143522');
  rect(ctx, 0, 380, 560, 140, ground);
  for (let i = 0; i < 18; i += 1) {
    const gx = range(rng, 15, 545);
    const gy = range(rng, 400, 510);
    ctx.strokeStyle = '#2f6b40';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx - 4, gy - 11);
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx + 4, gy - 11);
    ctx.stroke();
  }

  // Big moon, top-left.
  circle(ctx, 105, 115, 45, '#fdf6d8');
  circle(ctx, 90, 100, 8, '#e8dcb0');
  circle(ctx, 122, 130, 6, '#e8dcb0');
  // Difference 1: a shooting star streaks past the moon on the left only.
  if (side === 'left') {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(66, 44);
    ctx.lineTo(150, 94);
    ctx.stroke();
    circle(ctx, 150, 94, 4, '#fff');
  }

  // Branch from the right edge with the owl. Difference 2: the owl is
  // perched on the left only; the branch is bare on the right.
  ctx.strokeStyle = '#4a3220';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(560, 74);
  ctx.lineTo(420, 96);
  ctx.stroke();
  if (side === 'left') {
    ellipse(ctx, 452, 88, 20, 26, '#8a6b4d');
    circle(ctx, 444, 74, 7, '#fff');
    circle(ctx, 460, 74, 7, '#fff');
    circle(ctx, 444, 74, 3, '#1a1a1a');
    circle(ctx, 460, 74, 3, '#1a1a1a');
    poly(ctx, [[446, 84], [458, 84], [452, 92]], '#ffb347');
  }
  // Difference 3: a lantern hangs from a lower twig on the left only.
  ctx.strokeStyle = '#4a3220';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(472, 150);
  ctx.lineTo(472, 184);
  ctx.stroke();
  if (side === 'left') {
    rect(ctx, 460, 184, 24, 28, '#ffb347');
    rect(ctx, 464, 178, 16, 6, '#8a6b4d');
    ctx.strokeStyle = 'rgba(255,179,71,0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(472, 198, 22, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Fireflies drifting over the grass — same in both pictures.
  for (let i = 0; i < 10; i += 1) {
    circle(ctx, range(rng, 30, 530), range(rng, 390, 500), 2.5, 'rgba(255,240,150,0.9)');
  }
  // Guy ropes hold the tent down.
  ctx.strokeStyle = '#d8cbb8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(230, 330);
  ctx.lineTo(200, 380);
  ctx.moveTo(334, 330);
  ctx.lineTo(364, 380);
  ctx.stroke();

  // Tent, centre. Difference 4: a gold star on the tent on the left only.
  poly(ctx, [[200, 360], [364, 360], [282, 208]], '#e07840');
  poly(ctx, [[282, 208], [364, 360], [322, 360]], '#c85f30');
  poly(ctx, [[258, 360], [306, 360], [282, 300]], '#5a3a28');
  if (side === 'left') {
    ctx.fillStyle = '#ffd23f';
    ctx.beginPath();
    for (let a = 0; a < 5; a += 1) {
      const ang = -Math.PI / 2 + (a * 2 * Math.PI) / 5;
      const ox = 282 + Math.cos(ang) * 13;
      const oy = 302 + Math.sin(ang) * 13;
      const ix = 282 + Math.cos(ang + Math.PI / 5) * 5;
      const iy = 302 + Math.sin(ang + Math.PI / 5) * 5;
      if (a === 0) ctx.moveTo(ox, oy);
      else ctx.lineTo(ox, oy);
      ctx.lineTo(ix, iy);
    }
    ctx.closePath();
    ctx.fill();
  }

  // Campfire in front of the tent, ringed with stones.
  // Difference 6: the north ring stone is there on the left only.
  if (side === 'left') circle(ctx, 282, 382, 9, '#9a9a9a');
  circle(ctx, 246, 404, 9, '#9a9a9a');
  circle(ctx, 318, 404, 9, '#9a9a9a');
  circle(ctx, 258, 428, 9, '#8a8a8a');
  circle(ctx, 306, 428, 9, '#8a8a8a');
  ctx.strokeStyle = '#6b4a2f';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(258, 412);
  ctx.lineTo(306, 412);
  ctx.moveTo(262, 420);
  ctx.lineTo(302, 404);
  ctx.stroke();
  poly(ctx, [[282, 398], [270, 418], [294, 418]], '#ff9f1c');
  poly(ctx, [[282, 406], [276, 418], [288, 418]], '#ffe066');

  // Difference 5: a firewood log lies left of the tent on the left only.
  if (side === 'left') {
    rect(ctx, 178, 352, 42, 14, '#8a5a33');
    circle(ctx, 220, 359, 7, '#d8b58a');
    circle(ctx, 220, 359, 3, '#8a5a33');
  }
  // Difference 7: a blue backpack rests on the grass on the left only.
  if (side === 'left') {
    rect(ctx, 162, 418, 32, 28, '#3f6fd6');
    rect(ctx, 170, 410, 16, 10, '#355cb0');
    ctx.strokeStyle = '#2c4a8a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(178, 418);
    ctx.lineTo(178, 446);
    ctx.stroke();
  }
  // Difference 8: a pine cone sits bottom-right on the left only.
  if (side === 'left') {
    ellipse(ctx, 432, 432, 12, 16, '#8a5a33');
    ctx.strokeStyle = '#6b4a2f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(424, 424);
    ctx.lineTo(440, 424);
    ctx.moveTo(422, 434);
    ctx.lineTo(442, 434);
    ctx.stroke();
  }
}

const PAINTERS = [drawHarbour, drawGarden, drawMoonCamp];

// Paint one world into the current (already translated) context.
// side is 'left' or 'right'.
export function drawWorld(ctx, level, side) {
  PAINTERS[level](ctx, side);
}
