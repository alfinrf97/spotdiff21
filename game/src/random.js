// Twin Worlds — a tiny seeded random generator.
// Scenery decoration (stars, grass tufts, pebbles) must look identical in
// both pictures, so every decorative scatter is drawn from a seed that only
// depends on the world, never on the panel side or on Math.random.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A float in [min, max) from a seeded generator.
export function range(rng, min, max) {
  return min + rng() * (max - min);
}

// An integer in [min, max] from a seeded generator.
export function intBetween(rng, min, max) {
  return Math.floor(range(rng, min, max + 1));
}
