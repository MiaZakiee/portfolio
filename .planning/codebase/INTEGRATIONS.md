# External Integrations

**Analysis Date:** 2026-03-26

## APIs & External Services

**Google Fonts (CDN):**
- Service: Google Fonts — loads JetBrains Mono and Space Grotesk typefaces
- Integration point: `index.html` lines 7–9 via `<link>` tags
- No API key required; public CDN
- Fonts used:
  - `JetBrains Mono` (400, 500, 700) — terminal UI in `src/components/Terminal.jsx`
  - `Space Grotesk` (400, 500, 600, 700) — navbar and general UI in `src/App.jsx`, `src/styles/global.css`

## Data Storage

**Databases:**
- None — no external database

**Local JSON Data Files (static content):**
All portfolio content is stored as static JSON under `src/data/` and imported directly into components:

- `src/data/personalDetails.json` — Name, handle, role, location, contact, ASCII art for neofetch
- `src/data/projects.json` — Project entries (slug, name, description, tech, date, link)
- `src/data/skills.json` — Skills by category (languages, frameworks, tools, soft)
- `src/data/experience.json` — Work experience entries (slug, company, role, dates, description)
- `src/data/aboutme.json` — Bio, interests, fun facts, currently section
- `src/data/contacts.json` — Contact links (github, linkedin, email, twitter, resume)

**File Storage:**
- Local filesystem only (static assets in `dist/` after build)

**Caching:**
- None (browser cache only via standard HTTP headers from hosting provider)

## Authentication & Identity

**Auth Provider:**
- None — fully public portfolio site; no login or authenticated routes

## Monitoring & Observability

**Error Tracking:**
- None detected

**Analytics:**
- None detected

**Logs:**
- Browser console only (`console` not used in source; no logging library)

## CI/CD & Deployment

**Hosting:**
- Not configured in-repo; project produces a static `dist/` bundle compatible with any static host (Vercel, Netlify, GitHub Pages, etc.)

**CI Pipeline:**
- None detected (no `.github/workflows/`, no `netlify.toml`, no `vercel.json`)

## Environment Configuration

**Required env vars:**
- None — the application has zero runtime environment variables

**Secrets location:**
- No secrets exist; no `.env` files present

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None — the site is fully client-side with no server requests at runtime

## Third-Party Libraries Summary

| Package | Version | Role | Where Used |
|---|---|---|---|
| `three` | 0.164.0 | 3D engine | `src/components/BeachScene.jsx`, `src/components/CameraController.jsx` |
| `@react-three/fiber` | 8.16.0 | React/Three.js bridge | `src/components/BeachScene.jsx`, `src/components/CameraController.jsx` |
| `@react-three/drei` | 9.105.0 | Three.js helpers | `src/components/BeachScene.jsx` (`Sky`), `src/components/LaptopModel.jsx` (`Html`) |
| Google Fonts CDN | n/a | Web fonts | `index.html` |

---

*Integration audit: 2026-03-26*
