# TESTING.md — Testing Status

## Test Framework

**None** — No test framework is installed or configured.

- No Vitest, Jest, Playwright, Cypress, or any other test runner
- No test files (`*.test.*`, `*.spec.*`) detected anywhere in the codebase
- No test scripts in `package.json` (only `dev`, `build`, `preview`)

## Coverage

**0%** — The project has zero automated test coverage.

## What Should Be Tested (gaps)

### High value targets if tests are added

| Area | What to test | Suggested approach |
|------|-------------|-------------------|
| `useTerminal.js` / `createTerminal()` | Command execution: `ls`, `cd`, `cat`, `tree`, `neofetch`, `echo`, `clear` | Unit tests (Vitest) |
| `createTerminal()` | Path resolution: absolute, relative, `..`, `.`, `~` | Unit tests |
| `createTerminal()` | Tab completion: command completion, path completion | Unit tests |
| `cameraStore.js` | subscribe/unsubscribe, state transitions, notify | Unit tests |
| `Terminal.jsx` | Keyboard handling (Enter, Tab, ArrowUp/Down, Ctrl+L) | Component tests |
| `Terminal.jsx` | ANSI → styled span parsing (`parseAnsi`) | Unit tests |
| Theme toggle | `isDark` flips, CSS variable applied to `document.documentElement` | DOM tests |

### Integration gaps
- Navigation flow: Navbar click → camera focus → terminal command execution
- `navigateTo` prop changes driving Terminal command sequences

## Recommended Setup (if adding tests)

```bash
pnpm add -D vitest @testing-library/react @testing-library/user-event jsdom
```

Add to `vite.config.js`:
```js
test: { environment: 'jsdom', globals: true }
```

Add to `package.json` scripts:
```json
"test": "vitest"
```

## Notes

- `createTerminal()` (the virtual FS + command processor) is the most testable unit in the codebase — pure JS with no DOM or React dependencies
- The 3D scene (`BeachScene.jsx`, `CameraController.jsx`) is difficult to test due to WebGL dependency; visual regression or E2E tools would be needed
