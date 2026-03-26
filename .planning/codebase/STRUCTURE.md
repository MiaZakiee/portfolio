# STRUCTURE.md — Directory & File Structure

## Root Layout

```
portfolio/
├── index.html              # Entry HTML; Google Fonts links; mounts #root
├── vite.config.js          # Build config + path aliases
├── package.json            # Dependencies, scripts
├── pnpm-lock.yaml          # Lockfile
├── README.md
├── dist/                   # Build output (not in git)
└── src/
    ├── main.jsx            # React root mount
    ├── App.jsx             # Top-level component + ThemeProvider wrapper
    ├── components/         # React components
    ├── hooks/              # Custom hooks / logic
    ├── stores/             # State stores
    ├── data/               # Static JSON content
    └── styles/             # Global CSS
```

## src/components/

| File | Role |
|------|------|
| `BeachScene.jsx` | Three.js Canvas; contains all 3D primitives as local sub-components |
| `BeachTable.jsx` | 3D beach table model (procedural geometry) |
| `CameraController.jsx` | Camera rotation logic; no DOM output; subscribes to cameraStore |
| `LaptopModel.jsx` | 3D laptop model; embeds Terminal via `<Html>` |
| `Navbar.jsx` | Fixed top navigation overlay; triggers terminal navigation |
| `POVArms.jsx` | First-person arms visible at bottom of viewport |
| `PostIt.jsx` | Sticky note overlay (decorative) |
| `StringLights.jsx` | Animated string lights between palm trees |
| `Terminal.jsx` | Full terminal UI; uses createTerminal() from hooks |

## src/hooks/

| File | Role |
|------|------|
| `useTerminal.js` | `createTerminal()` factory — virtual FS, command processor, tab completion |
| `useTheme.jsx` | `ThemeContext` provider + `useTheme()` consumer hook |

Note: `useTerminal.js` is named as a hook but exports a factory function, not a hook.

## src/stores/

| File | Role |
|------|------|
| `cameraStore.js` | Plain JS pub/sub store for camera mode; bridges Canvas ↔ HTML worlds |

## src/data/

| File | Content |
|------|---------|
| `aboutme.json` | Bio, interests, fun facts, currently.{learning, reading, building} |
| `contacts.json` | Key-value contact links (github, linkedin, email, twitter, resume) |
| `experience.json` | Array of `{slug, company, role, dates, description}` |
| `personalDetails.json` | handle, name, role, location, os, shell, terminal, uptime, packages, ascii[] |
| `projects.json` | Array of `{slug, name, description, tech[], link, date}` |
| `skills.json` | Object of `{languages[], frameworks[], tools[], soft[]}` |

## src/styles/

| File | Content |
|------|---------|
| `global.css` | CSS variables for day/night themes + terminal colors; reset; base html/body styles |

## Naming Conventions

- **Components**: PascalCase `.jsx` files (`BeachScene.jsx`, `LaptopModel.jsx`)
- **Hooks/logic**: camelCase with `use` prefix for hooks (`useTheme.jsx`), camelCase for factories (`useTerminal.js`)
- **Stores**: camelCase (`cameraStore.js`)
- **Data**: camelCase lowercase (`aboutme.json`, `personalDetails.json`)
- **Styles**: lowercase (`global.css`)

## File Count Summary

- Components: 9 files
- Hooks: 2 files
- Stores: 1 file
- Data files: 6 JSON files
- Styles: 1 CSS file
- Config: 2 files (vite.config.js, package.json)
- **Total source files: ~21**
