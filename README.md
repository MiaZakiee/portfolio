# 🏖️ Beach Terminal Portfolio

A 3D interactive portfolio website featuring a low-poly beach scene with a working terminal interface. Built with React, Three.js, and React Three Fiber.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
portfolio/
├── public/
├── src/
│   ├── components/
│   │   ├── BeachScene.jsx    # Three.js 3D beach environment
│   │   ├── Terminal.jsx      # Interactive terminal with ANSI support
│   │   ├── Navbar.jsx        # Navigation bar (triggers terminal commands)
│   │   └── PostIt.jsx        # Sticky note with command reference
│   ├── data/                 # ✏️ EDIT THESE TO CUSTOMIZE
│   │   ├── personalDetails.json
│   │   ├── projects.json
│   │   ├── skills.json
│   │   ├── experience.json
│   │   ├── aboutme.json
│   │   └── contacts.json
│   ├── hooks/
│   │   ├── useTerminal.js    # Terminal engine & virtual filesystem
│   │   └── useTheme.jsx      # Day/night theme context
│   ├── styles/
│   │   └── global.css        # CSS variables, terminal colors, theme
│   ├── App.jsx               # Main layout (laptop frame + scene)
│   └── main.jsx              # Entry point
├── index.html
├── vite.config.js
└── package.json
```

## ✏️ How to Customize

**You only need to edit files in `src/data/`.** Everything else auto-updates.

### personalDetails.json
Your name, handle, role, and the ASCII art shown in the neofetch display.
- Replace the `ascii` array with your own ASCII art (each line is an array element)
- Update `name`, `handle`, `role`, `location`, etc.

### projects.json
Array of projects. Each entry needs:
```json
{
  "slug": "url-friendly-name",    // used as filename in terminal
  "name": "Display Name",
  "description": "What it does",
  "tech": ["React", "Node.js"],
  "link": "https://github.com/...",
  "date": "2025"
}
```

### skills.json
Organized by category:
```json
{
  "languages": ["JavaScript", "Python"],
  "frameworks": ["React", "Express"],
  "tools": ["Docker", "Git"],
  "soft": ["Leadership", "Communication"]
}
```
You can add/remove categories — they auto-generate as files in `/skills/`.

### experience.json
Array of jobs:
```json
{
  "slug": "company-name",
  "company": "Company",
  "role": "Your Role",
  "dates": "2023 — Present",
  "description": "What you did there."
}
```

### aboutme.json
Your bio, interests, fun facts, and what you're currently up to.

### contacts.json
Key-value pairs of your links. Recognized keys get emoji icons:
`github`, `linkedin`, `email`, `twitter`, `resume`.

## 🎨 Theming

### Terminal Colors
Edit the CSS variables in `src/styles/global.css` under the `:root` selector.
The default is a Catppuccin Mocha-inspired dark theme.

### Day/Night Toggle
- Light mode = daytime beach with sun, clouds, blue sky
- Dark mode = night beach with stars, moonlight, campfire glow
- Toggle via the 🌙/☀️ button in the navbar

### Beach Scene
Edit `src/components/BeachScene.jsx` to:
- Add/remove palm trees, rocks, seagulls, clouds
- Change positions and scales
- Adjust water animation speed
- Modify orbit speed (`autoRotateSpeed`)

## ⌨️ Terminal Commands

| Command | Description |
|---------|-------------|
| `ls [path]` | List directory contents |
| `cd <path>` | Change directory |
| `cat <file>` | Display file contents |
| `pwd` | Print working directory |
| `tree` | Show full directory tree |
| `whoami` | Display name & role |
| `neofetch` | ASCII art + system info |
| `clear` | Clear terminal screen |
| `help` | Show all commands |
| `echo <text>` | Print text |

### Keyboard Shortcuts
- **Tab** — Autocomplete commands and paths
- **↑ / ↓** — Navigate command history
- **Ctrl + L** — Clear terminal
- **Navbar buttons** — Auto-run `cd` + `ls`/`cat` in terminal

## 🚢 Deployment

### Vercel
```bash
npm run build
# Deploy the `dist/` folder
```

### Netlify
```bash
npm run build
# Drag `dist/` to Netlify, or connect your repo
```

### GitHub Pages
```bash
# Add to vite.config.js: base: '/your-repo-name/'
npm run build
# Push dist/ to gh-pages branch
```

## 📄 License
MIT — do whatever you want with it.
