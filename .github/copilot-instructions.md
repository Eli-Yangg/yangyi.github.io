# Copilot instructions for this repository

Purpose: give future Copilot sessions repository-specific, actionable guidance so suggestions and edits match project structure and workflows.

1. Build, test and lint commands

- Install: `npm install` (repo uses Node >= 22.12.0 per package.json). CI uses `npm ci --legacy-peer-deps`.
- Dev server: `npm run dev` (starts Astro dev at localhost:4321)
- Build: `npm run build` (produces static output in ./dist)
- Preview build: `npm run preview`
- Astro CLI: `npm run astro -- --help` (examples: `npm run astro -- check` to run Astro checks)
- Tests: No test runner configured in this repo. If adding tests, add npm scripts (e.g., `test`) and document how to run a single test.
- Linting: No linter configured. Add ESLint/Prettier if needed and expose via npm scripts.

2. High-level architecture (big picture)

- Site built with Astro (see `astro.config.mjs`). Output is a static site (`output: "static"`) and `site` is configured to the GitHub Pages URL.
- Integrations: React (`@astrojs/react`), MDX (`@astrojs/mdx`), Tailwind (`@astrojs/tailwind`) and a Vite Tailwind plugin.
- Content pipeline: `astro:content` collections are configured in `src/content.config.ts`. Blog posts live under `src/content/blog` as `.md` / `.mdx` files.
- Pages & layouts: route files live in `src/pages` (e.g., `index.astro`), shared layout components under `src/layouts`, UI components under `src/components` (mixture of `.astro` and React `.tsx`).
- Client-side interactivity: React components are used for interactive parts (e.g., `src/components/blog/BlogStats.tsx`) and are attached to Astro with client directives like `client:load`.
- Build & deploy: GitHub Actions workflow `.github/workflows/deploy.yml` runs `npm ci --legacy-peer-deps` and `npm run build`, then deploys `./dist` to GitHub Pages.

3. Key conventions and important patterns

- Content frontmatter: blog posts must include at minimum: `title` (string), `description` (string), `date` (ISO date), optional `tags` (string[]), optional `category` (string). Schema is enforced in `src/content.config.ts`.
- Where to add posts: place `.md`/`.mdx` files into `src/content/blog`. The site uses `getCollection('blog')` (`src/lib/blog.ts`) to read posts.
- Client directives: keep `client:load` / `client:idle` / `client:visible` usage when converting between Astro and React to preserve load behavior (see `index.astro` using `ParticlesBackground client:load`).
- React vs Astro components: Interactive, stateful UI lives in React `.tsx` components; layout and pages are `.astro`. Respect this split.
- Styling: global styles are imported in layouts (e.g., `src/layouts/BaseLayout.astro` imports `src/styles/global.css`). Tailwind classes are used throughout.
- Types: Type definitions live in `src/types` — use these when adding code to keep TS consistent.
- Build assumptions: CI uses Node 22 and `--legacy-peer-deps` when installing. Keep that in mind when adding/changing dependencies.

Files to check first when editing behavior:

- `astro.config.mjs` — site, integrations, and Vite plugins
- `src/content.config.ts` — content collection schema
- `src/content/blog/` — actual blog posts
- `src/lib/blog.ts` — blog-related helpers (stats, timeline)
- `src/components/` and `src/layouts/` — UI and structure
- `.github/workflows/deploy.yml` — CI and deployment steps

Notes for Copilot sessions

- When changing content schema, update `src/content.config.ts` and existing posts to match.
- For new interactive features, add React components under `src/components` and attach them with a client directive from an `.astro` page.
- When modifying deployment or build flags, also update `.github/workflows/deploy.yml`.

---

If you want, ask to add MCP server configuration (Playwright, etc.) for web testing or preview automation.
