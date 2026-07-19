---
title: Pollen Robotics Website
emoji: 🌸
colorFrom: yellow
colorTo: red
sdk: docker
app_port: 7860
pinned: false
short_description: Landing Pollen + Reachy 2 + Reachy Mini
---

# pollen-website

Unified [Next.js](https://nextjs.org) (App Router) site for
`pollen-robotics.com`. A single application serves every product zone, each with
its own MUI theme and a shared header:

| Route             | Zone        | Content                                           |
| ----------------- | ----------- | ------------------------------------------------- |
| `/`               | Pollen      | Brand landing (full-height hero)                  |
| `/reachy-2`       | Reachy 2    | Full-size humanoid product page                   |
| `/reachy-mini`    | Reachy Mini | App store: the JS apps list (SSR, SEO-friendly)   |
| `/blog`           | Pollen      | MDX blog                                          |
| `/reachy-mini/blog` | Reachy Mini | MDX blog                                         |

## Architecture

- **Rendering**: server-side (SSR/ISR). The Reachy apps grid is fetched
  server-side from the catalog API and shipped in the HTML for SEO. It
  revalidates every 5 minutes (`revalidate = 300`), matching the API's own
  cache TTL, so the list stays fresh without a rebuild.
- **Data**: the catalog lives in the standalone `reachy_mini_api` Space. We
  consume its `/api/js-apps` projection (JS-only, categorized and moderated).
  Fetched server-to-server (no CORS). Base URL via `REACHY_API_BASE`.
- **Theming**: one MUI theme per zone (`src/theme/*.ts`), applied by each zone
  layout through `ZoneProvider`. The shared `Header` blends into each zone's
  hero background, mounted once per layout (no flicker on navigation).
- **Blog**: MDX files under `src/content/<zone>/blog/*.mdx`, compiled with
  `next-mdx-remote/rsc`, statically prerendered (`dynamicParams = false`).
- **Deploy**: Docker (`output: "standalone"`), `next start` on port 7860.

## Layout

```
pollen-website/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx            root (fonts + Emotion SSR cache)
│  │  ├─ (pollen)/             "/" landing + "/blog"
│  │  ├─ reachy-mini/          "/reachy-mini" apps + blog
│  │  ├─ reachy-2/             "/reachy-2"
│  │  ├─ sitemap.ts, robots.ts
│  ├─ components/              Header, AppsBrowser, ReachiesCarousel, Blog*, ...
│  ├─ theme/                   pollen.ts, reachy.ts, reachy2.ts
│  ├─ lib/                     apps.ts (catalog fetch), blog.ts, brand.ts
│  ├─ content/                 <zone>/blog/*.mdx
│  └─ workers/                 searchWorker.js (Fuse.js fuzzy search)
├─ public/assets/              images, reachies, logos
├─ Dockerfile                  standalone SSR image
└─ next.config.mjs
```

## Environment variables

| Variable              | Purpose                                   | Default                                        |
| --------------------- | ----------------------------------------- | ---------------------------------------------- |
| `REACHY_API_BASE`     | Catalog API base (server-side fetch)      | `https://pollen-robotics-reachy-mini.hf.space` |
| `NEXT_PUBLIC_SITE_URL`| Canonical origin (metadata, sitemap)      | `https://pollen-robotics.com`                  |
| `STATIC_EXPORT`       | `1` -> static export (`out/`) for GitHub Pages; unset -> standalone SSR | unset |

## Local dev

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start   # production build + server
```

## Deploy

Two targets share one codebase, with different triggers:

- **Hugging Face Space (staging, private)** - published on **every push to
  `main`** by `.github/workflows/deploy-hf-space.yml`. It builds the static
  export and uploads `out/` to the private static Space
  `pollen-robotics/pollen-robotics-website-staging` (created automatically on first
  run). A daily cron refreshes the baked-in apps catalog here. Requires an
  `HF_TOKEN` repo secret with write access to the `pollen-robotics` org.
- **GitHub Pages (production, `pollen-robotics.com`)** - **not** deployed on
  `main`. It ships only when the dedicated **`production` branch** is updated,
  via `.github/workflows/deploy.yml`: `git push origin main:production`.
  `workflow_dispatch` (Actions > Run workflow) is kept as a manual escape hatch.
  The custom domain is set via `public/CNAME`; `public/.nojekyll` preserves the
  `_next` directory.

Required GitHub repo secret: `HF_TOKEN` (write token for the `pollen-robotics`
HF org, used by the preview Space deploy).

```bash
# Reproduce either build locally
STATIC_EXPORT=1 npm run build && npx serve out
```
