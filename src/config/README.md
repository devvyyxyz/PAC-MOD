Config files and usage

- `.env.example` — example env file with `VITE_DISCORD_WEBHOOK_URL` placeholder. Rename to `.env` in project root and restart the dev server to use.
- `src/config/defaults.ts` — default in-app configuration (assets, settings, gameDataPath).
- `src/config/index.ts` — load/save helpers and `getDiscordWebhook()` which prefers `import.meta.env.VITE_DISCORD_WEBHOOK_URL`.
- `src/config/assets.ts` — canonical asset paths used across the app.
- `public/game-data.json` — example game data (levels); fetch from `/game-data.json` in the running app.

Notes:
- For secure crash reporting, prefer a server-side proxy to avoid exposing webhooks in client code.
- Use `saveConfig()` to persist user-adjustable settings and `loadConfig()` to retrieve them on startup.
