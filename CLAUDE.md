# erikburns.com — Claude Code Instructions

## Stack
- 11ty v3, Nunjucks templates, SCSS, vanilla JS
- Hosting: Netlify

## Dev Server
```
npm start
```
Runs `npx netlify dev` → starts `npm run watch` (= `npx @11ty/eleventy --serve`) on port 8080.

## SCSS Compilation
**IMPORTANT:** There is NO separate `sass` CLI process. SCSS is compiled natively by 11ty via `addExtension("scss")` in `.eleventy.js`.

- Source entry point: `src/assets/styles/main.scss`
- Compiled output (what the browser gets): `dist/assets/styles/main.css`
- 11ty watches all imported SCSS partials automatically
- Hot reload works out of the box — edit any `_*.scss` partial and the browser reloads

**Do NOT check** `src/assets/css/main.css` or `css/main.css` — these are stale and irrelevant.
**Always check** `dist/assets/styles/main.css` to verify compiled output.

## Key Source Files
- `src/index.njk` — all page content
- `src/_layout/base.njk` — HTML shell, theme toggle JS
- `src/_include/nav.njk` — navbar + sidemenu
- `src/assets/styles/components/_landing.scss` — hero + section styles
- `src/assets/styles/components/_navbar.scss` — nav styles
- `src/assets/styles/base/_base.scss` — footer + global base styles
- `src/assets/styles/utils/_variables.scss` — color/spacing/font tokens
- `src/assets/js/typewriter.js` — blur-swap word cycler
- `src/_data/writing.js` — build-time Substack RSS fetch
- `netlify/functions/rebuild-rss.mjs` — scheduled daily rebuild (7am UTC)
