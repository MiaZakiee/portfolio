# CONCERNS.md — Technical Concerns & Risks

## HIGH Severity

### No tests whatsoever
- **File:** entire codebase
- **Issue:** Zero automated tests. Any refactor or feature addition is done blind.
- **Risk:** Regressions in terminal command logic, camera state, or theme switching won't be caught automatically.
- **Suggestion:** Start with unit tests for `createTerminal()` — it's pure JS and has no external dependencies.

### Theme not persisted across sessions
- **File:** `src/hooks/useTheme.jsx`
- **Issue:** `isDark` state is in-memory only. Refreshing the page resets to light mode regardless of user preference.
- **Risk:** Poor UX for users who prefer dark mode.
- **Suggestion:** Persist to `localStorage` and/or respect `prefers-color-scheme` on mount.

---

## MEDIUM Severity

### `useTerminal.js` misnamed — it's a factory, not a hook
- **File:** `src/hooks/useTerminal.js`
- **Issue:** The file is named like a hook and lives in `/hooks`, but exports `createTerminal()` — a factory function. Calling it inside a `useMemo` is fine, but it breaks the mental model and makes the hooks directory misleading.
- **Risk:** Confusion for future contributors.

### Inline `onMouseEnter`/`onMouseLeave` style mutations in Navbar
- **File:** `src/components/Navbar.jsx:29-35`
- **Issue:** Hover styles are applied by directly mutating `e.target.style.*` rather than using CSS classes or React state. This is fragile and bypasses React's rendering model.
- **Risk:** Inconsistent hover states if component re-renders mid-hover.

### No `key` prop stability in Terminal history
- **File:** `src/components/Terminal.jsx:219`
- **Issue:** `history.map((entry, i) => <div key={i}>` uses array index as key. When items are prepended or cleared and re-added, React may misidentify DOM nodes.
- **Risk:** Potential rendering glitches when `clear` is used followed by new output.

### Water geometry mutated every frame (per-vertex animation)
- **File:** `src/components/BeachScene.jsx:22-29`
- **Issue:** The `Water` component iterates all vertices of a 80×80 plane (40×40 segments = ~3,321 vertices) every frame in `useFrame`, setting Y for each. `pos.needsUpdate = true` triggers a full geometry upload to GPU.
- **Risk:** Performance bottleneck on lower-end devices or mobile. Not a concern on modern desktop.

### `Sand` geometry uses `Math.random()` inside `useMemo` with no seed
- **File:** `src/components/BeachScene.jsx:46-55`
- **Issue:** Sand vertex jitter is randomized once on mount. This is fine, but the randomness is not reproducible — shape changes on every fresh mount (e.g., HMR, remount).
- **Risk:** Minor visual inconsistency during development; not a production issue.

### No `eslint` or linting config
- **File:** root
- **Issue:** No `.eslintrc`, no `eslint.config.js`, no linting scripts. Code quality is not enforced automatically.
- **Risk:** Style drift and potential bugs (unused vars, missing deps in useEffect) go undetected.

---

## LOW Severity

### No CI/CD pipeline
- **File:** root
- **Issue:** No `.github/workflows/`, no Netlify/Vercel config. Deployment is manual.
- **Risk:** No automated build validation on push; easy to push broken builds.

### `index.html` not reviewed
- **File:** `index.html`
- **Issue:** Not read during this analysis. Meta tags (OG, Twitter Card, description) and font loading strategy are unknown.
- **Risk:** SEO and social sharing may be suboptimal for a portfolio site.

### No error boundaries
- **File:** `src/App.jsx`
- **Issue:** No React error boundary wrapping the 3D scene or terminal. A runtime error in WebGL setup or terminal command processing will crash the entire page with a blank white screen.
- **Suggestion:** Wrap `BeachScene` in an error boundary.

### Hardcoded magic numbers in CameraController
- **File:** `src/components/CameraController.jsx:7-29`
- **Issue:** Camera constants (angles, speeds, delays) are well-named but spread across module-level consts. Fine for now but would benefit from a config object if tuning is needed.

### `dist/` present in repo
- **File:** `dist/`
- **Issue:** The build output directory appears to be present. Typically this should be gitignored.
- **Risk:** Stale build artifacts committed to git; repo size bloat.
