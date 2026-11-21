// Twin Worlds — the differences themselves.
// Every world hides exactly 8 differences. Coordinates are panel-local
// (0..560 across, 0..520 down) and identical for both pictures, so a click
// on either picture can be tested against the same list. Each entry names
// what the player is looking for, which the win screen can show back.
export const WORLDS = [
  {
    name: 'Harbour Dawn',
    tagline: 'A lighthouse, a sailboat and a sleepy dock at sunrise.',
    diffs: [
      { x: 95, y: 72, label: 'the gull in the sky' },
      { x: 470, y: 82, label: 'the morning sun' },
      { x: 178, y: 246, label: 'the red sail' },
      { x: 300, y: 402, label: 'the orange buoy' },
      { x: 330, y: 172, label: 'the lighthouse lamp' },
      { x: 382, y: 378, label: 'the crate on the dock' },
      { x: 432, y: 448, label: 'the coiled rope' },
      { x: 118, y: 452, label: 'the starfish on the sand' },
    ],
  },
  {
    name: 'Garden Party',
    tagline: 'A tree, a pond and a fence full of small surprises.',
    diffs: [
      { x: 118, y: 62, label: 'the butterfly' },
      { x: 272, y: 128, label: 'the red apple' },
      { x: 332, y: 198, label: 'the lily flower' },
      { x: 432, y: 118, label: 'the birdhouse' },
      { x: 498, y: 302, label: 'the garden gnome' },
      { x: 148, y: 382, label: 'the mushroom' },
      { x: 382, y: 422, label: 'the stepping stone' },
      { x: 92, y: 432, label: 'the red tulip' },
    ],
  },
  {
    name: 'Moon Camp',
    tagline: 'A tent, a campfire and an owl under a big moon.',
    diffs: [
      { x: 108, y: 68, label: 'the shooting star' },
      { x: 452, y: 88, label: 'the owl on the branch' },
      { x: 472, y: 198, label: 'the hanging lantern' },
      { x: 282, y: 302, label: 'the star on the tent' },
      { x: 198, y: 358, label: 'the firewood log' },
      { x: 282, y: 382, label: 'the ring stone' },
      { x: 178, y: 432, label: 'the blue backpack' },
      { x: 432, y: 432, label: 'the pine cone' },
    ],
  },
];

export const DIFF_COUNT = 8;
