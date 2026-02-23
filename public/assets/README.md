Public assets layout

This folder contains static assets served by the dev server / production build.

Structure:
- `icons/` — small UI icons and SVGs (e.g., favicon, UI glyphs)
- `sprites/` — sprite sheets or texture atlases (PNG, JSON atlases)
- `images/` — larger artwork, backgrounds, logos
- `audio/`
  - `sfx/` — short sound effects (wav, mp3, ogg)
  - `music/` — longer music tracks

Add files to the appropriate subfolder. These paths are reflected by `src/config/assets.ts` and `src/config/defaults.ts`.
