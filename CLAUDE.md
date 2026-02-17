# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with HMR
npm run build    # Production build to dist/
npm run preview  # Preview production build locally
npm run lint     # ESLint check
```

No test suite is configured.

## Architecture

This is a single-page personal landing site. All UI lives in [src/App.jsx](src/App.jsx) as one self-contained component — no routing, no additional components, no external UI library.

**Styling approach:** Inline styles only, driven by a `theme` object inside `App`. `index.css` just resets margins/padding/box-sizing. `App.css` is unused. Do not introduce CSS files or CSS-in-JS libraries without good reason.

**Dark/light mode:** Toggled via `darkMode` useState, defaulting to dark. The `theme` object maps semantic names (`bg`, `text`, `muted`, `accent`, `cardBg`, `border`) to hex values for each mode — extend this object when adding new styled elements.

**Deployment:** Multi-stage Dockerfile builds the Vite output and serves it via nginx on port 80. Hosted on a Synology NAS.
