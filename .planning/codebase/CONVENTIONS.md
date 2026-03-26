# CONVENTIONS.md — Code Conventions

## Component Patterns

### Structure of every component file
1. Imports at top (React, hooks, data, sibling components)
2. Local sub-components defined above the default export (e.g., `Water`, `Sand`, `PalmTree` in BeachScene)
3. Default export as named function
4. `const styles = { ... }` object at the bottom of the file

### Example pattern
```jsx
import React from 'react';
import { useTheme } from '@hooks/useTheme';

// Local sub-components (if any)
function SubThing() { ... }

export default function MyComponent({ prop }) {
  const { isDark } = useTheme();
  return <div style={styles.container}>...</div>;
}

const styles = {
  container: { ... },
};
```

## Styling Approach

- **Inline JS style objects** — all component styles defined as `const styles = {}` at the bottom of each file
- **CSS custom properties** — theme-dependent values use `var(--token-name)` in inline styles
- **No class names** — zero use of `className`; no Tailwind, no CSS Modules
- **Global CSS** (`global.css`) — only used for: CSS variable declarations, reset (`* { margin:0; padding:0; box-sizing:border-box }`), and base `html/body` styles
- Theme switching: `document.documentElement.setAttribute('data-theme', 'dark'|'light')`

## State Management Conventions

- **React hooks** for UI state (useState, useCallback, useMemo, useRef, useEffect)
- **React context** for cross-tree state (ThemeContext)
- **Plain JS pub/sub** for cross-boundary state (cameraStore — bridges Canvas and HTML)
- No third-party state manager (no Zustand, Redux, Jotai, etc.)

## Hook Conventions

- `useTheme.jsx` — standard React context hook, exported as named export
- `useTerminal.js` — factory function (not a hook), named `createTerminal()`, returns object with methods
- Hooks use `useCallback` for event handlers and `useMemo` for expensive computations

## 3D / Three.js Conventions

- All 3D scene elements are **procedural geometry** (no external model files)
- Local 3D sub-components defined within `BeachScene.jsx` (Water, Sand, PalmTree, Rock, Seagull, Cloud, Stars, CampfireGlow)
- Animation via `useFrame` hook (per-frame updates)
- Theme-reactive colors: `isDark ? '#darkColor' : '#lightColor'` inline ternary
- `flatShading: true` on all materials — consistent low-poly aesthetic

## Import Style

- Path aliases used consistently: `@components/`, `@hooks/`, `@data/`, `@styles/`
- React imported as `import React from 'react'` (not `import * as React`)
- Named imports for hooks: `import { useState, useCallback } from 'react'`

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `BeachScene`, `LaptopModel` |
| Hooks | camelCase + `use` prefix | `useTheme`, `useTerminal` |
| Event handlers | `handle` prefix | `handleNavigate`, `handleSubmit` |
| Store instances | camelCase | `cameraStore` |
| CSS var tokens | kebab-case with prefix | `--nav-bg`, `--term-fg` |
| JSON data keys | camelCase | `personalDetails`, `funFacts` |
| Constants | SCREAMING_SNAKE_CASE | `SEATED_POS`, `DRAG_SENSITIVITY` |

## Data Layer Convention

- Portfolio content is **data-driven via JSON** — no content hardcoded in components
- Terminal content rendered by `useTerminal.js` which formats JSON into ANSI-escaped strings
- Content updates require only editing JSON files in `src/data/`
