# React Game Template

This repository is a minimal, opinionated starter template for building browser games with React + TypeScript and Vite.

Quick start
- Install dependencies: `npm install`
- Run dev server: `npm run dev`

What this template includes
- Simple page structure: Menu, Settings, Game Setup, Gameplay placeholder, Credits, Error handler.
- Reusable UI components: `Layout`, `Card`, `Controls` (Toggle/Select/Range/Number), `Toast` provider, and `Icon` helpers.
- Basic i18n scaffold with English/Spanish/Polish translations.
- LocalStorage-backed config hooks and a small audio hook.

How to use
- Replace the placeholder game mount in `src/pages/GamePlay` with your game renderer (Canvas, WebGL, or DOM).
- Edit `src/i18n/index.ts` to add or change copy. Use the `useI18n()` hook in components.
- Add assets under `public/assets` and update `public/` or `src` imports accordingly.

Customize
- Change the app title in `index.html` and `package.json` metadata.
- Update routes or page flow in `src/main.tsx` and the `pages` directory.

License
- This template is provided as-is. Add a license file if you intend to redistribute.

Enjoy building! If you'd like, I can help strip more pacman-specific assets or rename files to fit your preferred structure.
