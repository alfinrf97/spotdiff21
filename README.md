# Twin Worlds — Spot the Difference

[![make.fun](https://img.shields.io/badge/make.fun-bounty-blue)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![alfinrf97](https://img.shields.io/badge/entrant-alfinrf97-green)](https://github.com/alfinrf97/spotdiff21)
[![Twin Worlds](https://img.shields.io/badge/game-spot--the--difference-orange)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

A complete spot-the-difference game, built for make.fun's
**"Make the best spot the difference game"** bounty ($50 in USDC).

## How to play

Two near-identical pictures sit side by side. Find all **8 differences**
in each world before the clock runs out — or before you run out of hearts.

- **3 original worlds:** Harbour Dawn, Garden Party, Moon Camp — 24 differences in total.
- **Click** a difference in either picture. Found ones get a green ring and a tick in both pictures.
- **Keyboard:** arrow keys move the crosshair (Shift = fast), Enter/Space clicks, **H** hint (−50 points), **P** pause, **M** mute, **R** restart the world, **Space** starts and continues.
- **Scoring:** 100 points per find, +25 per combo step, plus time and heart bonuses when a world is cleared. Your best score is saved on your device.
- **Pressure:** 120 seconds per world, 3 hearts, 3 hints. The timer bar turns red and says "Hurry!" under 20 seconds.

## The game

All art is drawn procedurally on canvas — no images, no assets, no network.
All sound is synthesised live with Web Audio. The game is plain static files
under `game/` with no build step: serve it with any static server and open
`game/index.html` in desktop Chrome.

```
node serve.ts        # serves game/ at http://localhost:8080
```

## Files

One clear job per file:

| File | Job |
| --- | --- |
| `game/index.html` | Page shell and canvas |
| `game/src/config.js` | Shared constants: panels, timer, scoring |
| `game/src/random.js` | Seeded random for identical decoration |
| `game/src/differences.js` | The 8 differences in each of the 3 worlds |
| `game/src/scenes.js` | The three hand-drawn worlds |
| `game/src/world.js` | Game state and rules |
| `game/src/input.js` | Mouse and keyboard input |
| `game/src/render.js` | Everything the player sees |
| `game/src/audio.js` | Synthesised Web Audio sound |
| `game/src/shots.js` | Staged states for screenshots |
| `game/src/main.js` | Entry point and frame loop |
| `main.ts` | The hand-in program (copies game + screenshots, writes the dossier) |
| `serve.ts` | Tiny static server for local play |

## License

MIT — see `LICENSE`.
