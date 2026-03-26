# Technology Stack

**Analysis Date:** 2026-03-26

## Languages

**Primary:**
- JavaScript (JSX/ES Modules) — All source files in `src/`
- CSS — `src/styles/global.css`
- JSON — Data layer in `src/data/`

**Secondary:**
- None detected (no TypeScript, no Python, no server-side language)

## Runtime

**Environment:**
- Node.js (version not pinned; no `.nvmrc` or `.node-version` present)

**Package Manager:**
- pnpm
- Lockfile: `pnpm-lock.yaml` (present and committed)

## Frameworks

**Core:**
- React 18.3.1 — UI rendering (`src/main.jsx`, all components under `src/components/`)
- React DOM 18.3.1 — DOM mounting in `src/main.jsx`

**3D Rendering:**
- Three.js 0.164.0 — Low-level 3D geometry and materials (used directly in `src/components/BeachScene.jsx`)
- @react-three/fiber 8.16.0 — React renderer for Three.js (`Canvas`, `useFrame`, `useThree` in `src/components/BeachScene.jsx`, `src/components/CameraController.jsx`)
- @react-three/drei 9.105.0 — Three.js helpers (`Sky`, `Html` in `src/components/BeachScene.jsx`, `src/components/LaptopModel.jsx`)

**Build/Dev:**
- Vite 5.4.0 — Dev server and production bundler (`vite.config.js`)
- @vitejs/plugin-react 4.3.0 — Vite React/JSX transform (`vite.config.js`)

**Testing:**
- None — No test framework detected

## Key Dependencies

**Critical:**
- `react` 18.3.1 — Root rendering framework; all components depend on it
- `@react-three/fiber` 8.16.0 — Bridges React and Three.js; `Canvas`, `useFrame`, `useThree` used extensively
- `@react-three/drei` 9.105.0 — Provides `Html` (mounts Terminal DOM inside 3D scene) and `Sky` (skybox component)
- `three` 0.164.0 — Direct geometry construction in `BeachScene.jsx` (`THREE.PlaneGeometry`, `THREE.DodecahedronGeometry`, `THREE.Vector3`, etc.)

**Dev/Build:**
- `vite` 5.4.0 — Hot module replacement in dev; bundles to `dist/`
- `@types/react` 18.3.0, `@types/react-dom` 18.3.0 — Type hints (dev only; project uses JSX not TSX)

## Configuration

**Build Config:**
- `vite.config.js` — Registers `@vitejs/plugin-react`; defines path aliases (`@`, `@data`, `@components`, `@hooks`, `@styles` all pointing into `src/`)
- `index.html` — Entry HTML; loads Google Fonts (JetBrains Mono, Space Grotesk); mounts `<div id="root">` for React

**Environment:**
- No `.env` files detected; no runtime environment variables used
- No `tsconfig.json` (project is plain JS/JSX)

**Output:**
- `dist/` — Vite build output (present, not tracked in git by default)

## Platform Requirements

**Development:**
- Node.js + pnpm
- `pnpm dev` → Vite dev server
- `pnpm build` → Production bundle to `dist/`
- `pnpm preview` → Serve the production build locally

**Production:**
- Static hosting (no server required); `dist/` is a fully static SPA
- Target deployment: static CDN or any static file host (e.g., Vercel, Netlify, GitHub Pages)

---

*Stack analysis: 2026-03-26*
