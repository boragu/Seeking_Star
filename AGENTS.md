# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Durable product decisions

- This is a responsive web-based app for the 2026 Tourism Data Utilization Contest web/app implementation track, not a static landing page.
- The first screen is an immersive night-sky landing experience; entering the app switches to a moon-paper planning interface. Both share the same ink-navy, warm ochre, muted teal, and Korean editorial typography system.
- The core judged flow is: enter trip conditions → compare low-congestion destinations → compare safe routes → confirm/save a journey → configure astronomy alerts.
- The service targets the designated overtourism task and must clearly expose why a quieter alternative was recommended.
- Official Korea Tourism Organization/public-data integrations must never fabricate tourism, congestion, route, or astronomy values when a key or upstream response is unavailable; show a graceful unavailable state instead.
- Mobile is a first-class app experience with persistent bottom navigation and an active-route view, not a shrunk desktop layout.
- Page files should orchestrate feature components only. Keep layout, shared UI, location, recommendation, map, journey, and alert concerns in separate folders; do not rebuild a monolithic `Shell.tsx` or page-sized component.
- Keep user-facing type comfortably readable on mobile (generally 10px or larger for supporting copy) and prefer editorial hierarchy and whitespace over dense tables or repeated generic cards.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
