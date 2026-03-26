# ARCHITECTURE.md — System Architecture

## Overview

A single-page portfolio site built as an immersive 3D beach scene. The entire UI is a WebGL canvas with a real terminal emulator embedded inside a 3D laptop model. Navigation triggers terminal commands rather than route changes.

## Component Tree

```
App
└── ThemeProvider (useTheme context)
    └── PortfolioContent
        ├── BeachScene (Three.js Canvas — fills viewport)
        │   ├── CameraController (useFrame — no DOM output)
        │   ├── BeachTable
        │   ├── LaptopModel
        │   │   └── Html (drei) → Terminal (DOM inside 3D)
        │   ├── Water, Sand, PalmTree×4, Rock×4
        │   ├── Seagull×3, Cloud×3 (conditional)
        │   ├── Stars, CampfireGlow (night only)
        │   └── StringLights, POVArms
        ├── Navbar (fixed overlay, z-index 100)
        └── PostIt (fixed overlay)
```

## State Architecture

### Theme State
- **ThemeContext** (`src/hooks/useTheme.jsx`) — React context
- `isDark: boolean` — controls 3D scene colors, CSS variables, and overlay UI
- Toggled via Navbar button; persists only in memory (no localStorage)

### Camera State
- **cameraStore** (`src/stores/cameraStore.js`) — plain JS pub/sub module (NOT React state)
- Bridges the Three.js Canvas world (CameraController) and HTML world (Navbar, App)
- Two modes: `'orbit'` (idle autopan) | `'focused'` (snap to laptop)
- `lastActivityTime` — used by CameraController to auto-unfocus after 6s inactivity

### Terminal State
- Local React state inside `Terminal.jsx`
- `history[]` — rendered output lines
- `commandHistory[]` — up-arrow recall
- `input`, `suggestion` — current input line

### Navigation Flow
```
Navbar click
  → App.handleNavigate(target)
  → cameraStore.focusLaptop()        // camera snaps to screen
  → navTarget state → BeachScene prop → LaptopModel prop → Terminal prop
  → Terminal useEffect runs terminal.execute(cmd)
  → history updated → re-render
```

## The Terminal Engine (`src/hooks/useTerminal.js`)

Not a React hook — exports `createTerminal()` factory function.

- Builds a **virtual filesystem** from JSON data at call time
- Filesystem structure mirrors a Unix directory tree:
  ```
  /
  ├── aboutme.txt
  ├── contacts.txt
  ├── projects/
  │   ├── wave-reader.txt
  │   └── ...
  ├── skills/
  │   ├── languages.txt
  │   └── ...
  └── experience/
      └── ...
  ```
- Supports: `ls`, `cd`, `cat`, `pwd`, `tree`, `whoami`, `neofetch`, `echo`, `clear`, `help`
- Tab completion for commands and paths
- ANSI escape codes in output → parsed to styled `<span>` elements by `parseAnsi()` in Terminal.jsx

## Data Flow

```
src/data/*.json  →  useTerminal.js (buildFileSystem)  →  Terminal state  →  rendered output
                                                                ↑
                                              Navbar nav commands injected via prop
```

## Rendering Layers (z-index)

| Layer | Component | z-index |
|-------|-----------|---------|
| 3D scene | BeachScene Canvas | 0 (absolute) |
| Overlays | Navbar | 100 |
| Overlays | PostIt | (fixed) |
| Hint text | App hint div | 80 |

## Key Design Decisions

1. **Camera never moves in world space** — only rotation changes (seated POV illusion)
2. **cameraStore as plain JS** — avoids React context crossing the Canvas boundary (R3F renders in a separate React tree)
3. **Terminal as virtual FS** — content is browsable like a real terminal; no routing needed
4. **All geometry is procedural** — no `.glb`/`.gltf` model files; everything built from Three.js primitives
5. **`Html` component from drei** — embeds a real DOM terminal inside the 3D laptop screen
