# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Required: use Node v24 via nvm
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"

npm run dev          # Dev server on :3000
npm run build        # OG image → Vite build → copy dist/index.html → dist/404.html
npm run lint         # tsc --noEmit (TypeScript is the linter)
npm test             # Vitest run (one-shot)
npm run test:watch   # Vitest watch mode
```

To run a single test file:
```bash
npx vitest run src/__tests__/pages/Home.test.tsx
```

## Architecture

### Entry & Routing

`src/main.tsx` bootstraps i18n first (before any component), then renders `BrowserRouter → AppShell → AppSplash → App`. `App.tsx` defines routes with lazy-loaded pages under a single `Layout` route.

### RTL Architecture — Critical

`document.documentElement.dir` is **always `'rtl'`** (frozen by `useLanguageSync`). The header and footer inherit this and their flex layouts are permanently RTL.

Only `<main dir={contentDir}>` switches between `'rtl'` (Hebrew) and `'ltr'` (EN/EL) to flip content reading direction. Never put `dir` on `<header>` or `<footer>`.

Use **CSS logical properties** throughout — `start-0`/`end-0`, `ps-6`/`pe-6`, `ms-`/`me-` — never physical `left`/`right` in layout code.

In RTL `flex-row` with `justify-between`: first DOM child → physically RIGHT, last DOM child → physically LEFT.

### i18n

Six namespaces: `common`, `home`, `about`, `services`, `portfolio`, `contact`. All loaded eagerly (no lazy loading). Fallback language is Hebrew (`he`).

Locale files live in `src/i18n/locales/{he,en,el}/`. When adding a key, update all three languages. The `LANGUAGES` export from `src/i18n/index.ts` is the source of truth for supported codes and directions.

### Animations

`src/lib/motion.ts` exports shared variants (`containerStagger`, `cardVariants`, `sectionVariants`, etc.) and `useAnimatedCounter`. Import from there rather than defining one-off variants in pages.

All pages have a unique dark hero animation (SVG-based): `FlashFrames` (Portfolio), `RadioWaves` (Contact), `ConstellationBg` (About), `GridPulse` (Services). Home hero is untouched by design.

Respect `useReducedMotion()` — pass it as prop or call it in the component and guard all `animate` and canvas loops.

### Tailwind CSS v4

**No `tailwind.config.ts`**. Configuration lives entirely in `src/index.css` via `@theme { ... }`. Custom utilities, keyframes, and gradients are also defined there.

`cn()` from `src/lib/utils.ts` wraps `clsx` + `tailwind-merge` — use it for conditional class merging.

### Component Conventions

- Glass cards: `bg-white/60 backdrop-blur-xl border border-white rounded-[2rem]`
- Color trinity: Cyan→Blue (`#2563eb`), Violet→Purple (`#7c3aed`), Fuchsia→Rose (`#db2777`)
- Page structure: dark hero section with wave SVG transition → light content sections → optional dark CTA
- `PageMeta` component wraps all per-page `<title>` and meta tags

### Testing

Vitest + Testing Library with jsdom. Setup file at `src/test-setup.ts`. CSS is disabled in tests (`css: false` in vite config). Tests live in `src/__tests__/` mirroring the `src/` structure.
