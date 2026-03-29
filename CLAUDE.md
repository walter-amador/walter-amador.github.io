# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start local development server
npm run build    # Build static export to ./out
npm run start    # Serve pre-built production output
```

No lint or test scripts are configured. Deployment is handled by GitHub Actions (`.github/workflows/walteramador.yml`): push to `main` triggers `npm ci && npm run build`, then deploys `./out` to the `gh-pages` branch.

## Architecture

Personal portfolio site — fully static Next.js app (no server, no API routes) targeting GitHub Pages.

### Key files

- [pages/index.js](pages/index.js) — Single page with all sections: Hero, About, Skills, Experience, Education, Projects, Certificates, Contact
- [pages/_app.js](pages/_app.js) — App wrapper (global styles)
- [pages/_document.js](pages/_document.js) — HTML shell (`lang="en"`)
- [data/content.js](data/content.js) — All user-facing text in EN/ES/FR; all sections source copy from here
- [data/certificates.js](data/certificates.js) — Static array of 100+ certificates (AWS, Udemy, Platzi, etc.) with title, issuer, issuedOn, credentialId, skills
- [lib/certificates-ui.js](lib/certificates-ui.js) — Helpers: `formatMonthYear()` (i18n dates), `deriveTopics()` (regex topic inference from title/skills), `issuerMeta()` (issuer branding/icons/colors)

### Component highlights

**CertificatesSection** — The most complex component, lives inline in `pages/index.js`. It has full-text search, multi-select issuer/topic filters, newest/oldest sort, and pagination (PAGE_SIZE=6). All derived state (filtered list, all issuers, all topics) is computed with `useMemo` from the certificates array.

**TechConstellation** — 3D parallax hero element with mouse-tracking; uses `useRef`/`useEffect` for animation.

**AnimatedBackground** — Blurred blob animations; dark/light blend modes controlled via `darkMode` class.

### Styling

- Tailwind CSS v4 via PostCSS (`@import "tailwindcss"` in [styles/global.css](styles/global.css))
- Dark mode is **class-based** (`darkMode: 'class'` in [tailwind.config.js](tailwind.config.js)) — a `darkMode` boolean in React state toggles a `dark` class on the root element
- No component library; all UI is custom Tailwind

### i18n

Language is a React state value (`lang`) initialized from `localStorage` with `'en'` fallback. All copy is keyed by lang from `data/content.js`. Date formatting in `lib/certificates-ui.js` also accepts the lang value.

### Static export config

[next.config.js](next.config.js) sets `output: 'export'` and dynamically sets `basePath`/`assetPrefix` — empty for user/org pages (`*.github.io`), `/{repoName}` for project pages — based on the `GITHUB_ACTIONS` env var.
