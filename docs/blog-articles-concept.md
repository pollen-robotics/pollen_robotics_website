# Blog articles: a Markdown authoring concept

Status: proposal / RFC
Scope: `pollen-website` blog (`/blog` and `/reachy-mini/blog`)
Inspiration: the `research-article-template` (Astro + MDX + D3)

## 1. Goals (decided)

Bring a richer, `research-article-template`-like authoring experience to the
existing blog, tuned for a **product blog** rather than a scientific paper:

- Rich MDX authoring with **JSX components auto-injected** (`<Note>`, `<Image>`,
  `<Quote>`, `<Stack>`, ...), no per-file imports.
- Nice typography, cover/hero, authors, tags, styled code blocks.
- **Embeds are first-class**, in two flavours:
  - `Iframe` for external interactive content (HF Spaces, demos, YouTube, ...).
  - `HtmlEmbed` for self-contained D3/HTML dataviz files stored in the repo,
    exactly like the template (scripts re-executed, `ColorPalettes`, CSS-var
    theming).
- Theming via a **CSS-variable bridge derived from the zone's MUI theme**
  (no dark mode for now).

Explicitly out of scope for the first iteration: citations/bibliography, DOI,
PDF/LaTeX export. Math (KaTeX) is an optional, low-cost add-on.

## 2. Current state

The blog already works but is intentionally minimal.

- Content: `src/content/<zone>/blog/*.mdx`, one folder per zone
  (`pollen` -> `/blog`, `reachy-mini` -> `/reachy-mini/blog`).
- Read at build time with `gray-matter` in `src/lib/blog.ts`; frontmatter is
  limited to `title`, `date`, `description`.
- Compiled with `next-mdx-remote/rsc` (`compileMDX`) in
  `src/components/BlogPost.tsx`, with a **basic HTML -> MUI** mapping only
  (`h1-h3`, `p`, `a`, `ul`, `li`).
- Fully static prerender (`dynamicParams = false` + `generateStaticParams`),
  compatible with the GitHub Pages static export.

Gap analysis:

| Capability | Today |
| --- | --- |
| Frontmatter | `title`, `date`, `description` only |
| Author components (callouts, captioned images, columns) | none |
| Extended Markdown (tables, footnotes, task lists) | none (no `remark-gfm`) |
| Math (KaTeX) | none |
| Heading anchors + TOC | none |
| Code syntax highlighting | none (raw) |
| Embeds / dataviz | none |
| Iframes (Spaces, demos, video) | none |
| Cover/hero, authors, tags, reading time | none |

## 3. Reference: the `research-article-template`

A rich, web-native article engine (Astro 4 + MDX + D3):

- Rich frontmatter (`title`, `authors`+`affiliations`, `template`, `banner`,
  `doi`, `tags`, ...).
- Author component library: `Image`, `Note`, `Sidenote`, `Quote`, `Stack`,
  `Accordion`, `HtmlEmbed`, `Wide`/`FullWidth`, `Glossary`, `HfUser`,
  `TableOfContents`, ...
- Extended Markdown: KaTeX, citations `[@key]` + `bibliography.bib`, footnotes,
  heading anchors, Shiki dual-theme code, Mermaid.
- D3 embeds: self-contained HTML injected and executed lazily (`HtmlEmbed`),
  colors from `window.ColorPalettes` (OKLCH), theming via CSS variables +
  `data-theme`.
- Exports: PDF (Playwright/Paged.js), LaTeX, `llms.txt`, HF Spaces (Docker).

Key files (for reference): `app/astro.config.mjs`, `app/src/pages/index.astro`,
`app/src/content/article.mdx`, `app/src/components/*.astro`,
`app/src/components/HtmlEmbed.astro`, `app/src/content/embeds/**/*.html`,
`app/public/scripts/color-palettes.js`, `app/src/styles/_variables.css`.

## 4. Astro -> Next.js transposition

The template package cannot be reused as-is (it is Astro). The *concepts*
transpose well; the mechanics differ.

| Template element (Astro) | Next.js equivalent (pollen-website) | Difficulty |
| --- | --- | --- |
| `.astro` components | React/MUI components via the `next-mdx-remote` `components` map | Easy |
| `import.meta.glob(embeds, {query:'?raw'})` | `fs` read at build time, or files under `public/embeds/` | Medium |
| remark/rehype pipeline (`astro.config.mjs`) | `compileMDX({ mdxOptions: { remarkPlugins, rehypePlugins } })` | Easy (same plugins) |
| Embed `<script>` execution | Client component that re-executes injected scripts | Medium |
| `window.ColorPalettes` (`public/scripts/color-palettes.js`) | Copy into `public/scripts/` + load once | Easy |
| CSS variables + `data-theme` theming | Bridge to create: site uses per-zone MUI themes, no CSS vars, no dark mode | Structural |
| PDF/LaTeX, citations/DOI | Out of scope for a product blog | - |
| `output: export` (GitHub Pages) | No SSR/ISR: everything prerendered at build (already the case) | OK |

`next-mdx-remote` accepts `mdxOptions.remarkPlugins`/`rehypePlugins`, so
`remark-gfm`, `remark-math` + `rehype-katex`, `rehype-slug`,
`rehype-autolink-headings`, code highlighting, etc. plug in without changing the
rendering architecture.

## 5. Proposed concept

### 5.1 Enriched frontmatter (typed)

```yaml
---
title: "Open by design"
date: "2026-07-01"
description: "..."                     # SEO + index teaser
cover: "/assets/blog/open-by-design.webp"  # hero + OG image
authors:
  - name: "Jane Doe"
    url: "https://huggingface.co/..."
tags: ["open-source", "reachy-mini"]
draft: false                           # excluded from build when true
---
```

Unlike the template (unvalidated frontmatter, hand-normalized), we recommend a
**typed schema** (TS interface + light validation, optionally `zod`) in
`blog.ts` for better DX and clear build-time errors. Reading time can be derived
from the content length.

### 5.2 Author component library (MDX with JSX)

Ported to React/MUI and injected via the `components` map (no per-file import).
Authors write, for example:

```mdx
<Note variant="info" title="Heads up">
  Reachy Mini apps are just Hugging Face Spaces.
</Note>

<Image src="/assets/blog/robot.webp" caption="Reachy Mini" />

<Stack layout="2-col">
  <Image src="/assets/a.webp" />
  <Image src="/assets/b.webp" />
</Stack>
```

| Component | Purpose | Priority |
| --- | --- | --- |
| `Note` / `Callout` | Info/success/warning/danger box | high |
| `Image` | Optimized image, caption, reserved ratio, optional zoom | high |
| `Quote` | Pull quote with author/source | high |
| `Stack` | 2-3 responsive columns | medium |
| `Iframe` | Responsive external embed (see 5.4) | high |
| `HtmlEmbed` | Self-contained D3/HTML dataviz (see 5.4) | high |
| `Video` / `YouTube` | Responsive video embed | medium |
| `TableOfContents` | Auto TOC from heading slugs | medium |
| `Accordion`, `Sidenote` | Collapsible / margin note | low |

### 5.3 Extended Markdown (remark/rehype plugins)

- `remark-gfm`: tables, footnotes, task lists, strikethrough.
- `rehype-slug` + `rehype-autolink-headings`: anchors + TOC foundation.
- Code highlighting: `rehype-pretty-code`/Shiki (single light theme for now).
- Optional: `remark-math` + `rehype-katex` (+ KaTeX CSS) for formulas.

### 5.4 Embeds (first-class)

Two distinct mechanisms, both static-export friendly:

**a) `Iframe` - external interactive content.**
A thin responsive wrapper (aspect-ratio or fixed height, lazy load, title,
`loading="lazy"`, sandbox where relevant). Use for HF Spaces, live demos,
Trackio, maps, etc.

```mdx
<Iframe
  src="https://huggingface.co/spaces/pollen-robotics/some-demo"
  title="Live demo"
  height={520}
/>
```

**b) `HtmlEmbed` - self-contained D3/HTML dataviz in the repo.**
Reproduces the template pattern:

- HTML files live under `public/embeds/*.html` (served statically, GitHub Pages
  friendly). Structure: single root `<div class="d3-name">` + scoped `<style>` +
  IIFE `<script>`.
- `<HtmlEmbed src="d3-name.html" title="..." />` is a **client component** that
  injects the HTML and **re-executes the injected `<script>` tags** lazily
  (`IntersectionObserver`, since `innerHTML` does not run scripts).
- Copy `color-palettes.js` into `public/scripts/` and expose
  `window.ColorPalettes`; embeds read colors from it (never hardcoded).
- Embeds read theme **CSS variables** (`--text-color`, `--surface-bg`,
  `--primary-color`, `--border-color`, chart axis vars) - hence the theming
  bridge below.

```mdx
<HtmlEmbed src="d3-adoption.html" title="Community growth" />
```

Note: `HtmlEmbed` uses `dangerouslySetInnerHTML` + script re-execution. Content
is authored in-repo (trusted), so this is acceptable; do not use it for
untrusted HTML.

### 5.5 Theming bridge (no dark mode)

The template is fully driven by CSS variables + `data-theme`. This site uses
per-zone MUI themes and has no dark mode. We expose a small set of CSS variables
derived from the active zone's MUI theme via `<GlobalStyles>` in the blog
layout / `ReachyProviders`:

```
--text-color, --muted-color, --surface-bg, --border-color, --primary-color
(+ chart vars: --axis-color, --tick-color, --grid-color)
```

Article components and embeds consume these variables, so they stay decoupled
from the MUI theme without a global refactor. A real `data-theme` dark mode can
be layered on later if wanted.

## 6. Proposed file layout

```
pollen-website/
├─ public/
│  ├─ embeds/                 # self-contained D3/HTML dataviz files
│  └─ scripts/color-palettes.js
├─ src/
│  ├─ content/<zone>/blog/*.mdx
│  ├─ lib/blog.ts             # typed frontmatter + reading time
│  ├─ components/
│  │  ├─ BlogPost.tsx         # compileMDX + components map + mdxOptions
│  │  ├─ BlogIndex.tsx        # cards with cover/tags
│  │  └─ article/             # Note, Image, Quote, Stack, Iframe, HtmlEmbed, ...
│  └─ styles/                 # CSS-var bridge (GlobalStyles) + KaTeX CSS
```

## 7. Dependencies to add

Core: `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`,
`rehype-pretty-code` (or `shiki`).
Optional (math): `remark-math`, `rehype-katex`, `katex`.

All are build-time only and compatible with `output: export`.

## 8. Phased plan

| Phase | Content | Effort | Depends on |
| --- | --- | --- | --- |
| 0 - Foundations | Typed frontmatter + `mdxOptions` (gfm, slug, autolink) + CSS-var bridge | S | - |
| 1 - Author components | `Note`, `Image`, `Quote`, `Stack` + usage docs | M | 0 |
| 2 - Embeds | `Iframe` + `HtmlEmbed` + `ColorPalettes` | M/L | 0 |
| 3 - Cover/hero + index | `cover`, authors, tags, reading time, index cards | S/M | 0 |
| 4 - Advanced Markdown | Code highlighting, TOC, optional KaTeX | M | 0 |

## 9. Open questions / risks

- Reading direction for `HtmlEmbed`: bundle the full `ColorPalettes` (OKLCH) or a
  slimmed-down version? Full copy is simplest and keeps parity with the template.
- Do we want a shared, cross-zone article style, or per-zone (Pollen vs Reachy
  Mini) variations? The CSS-var bridge supports per-zone automatically.
- Iframe height: fixed vs aspect-ratio vs postMessage auto-resize (HF Spaces can
  postMessage their height). Start with fixed/aspect-ratio.
- Keep `next-mdx-remote`, or move to `@next/mdx`? `next-mdx-remote` is already in
  place, supports the plugin pipeline, and fits the file-based content model, so
  we keep it.

## 10. Appendix - target authoring example

```mdx
---
title: "Building your first Reachy Mini app"
date: "2026-07-05"
description: "A quick tour of the app store and how community apps get there."
cover: "/assets/blog/first-app.webp"
authors:
  - name: "Pollen Robotics"
tags: ["reachy-mini", "apps"]
---

## The app store, in a nutshell

Every Reachy Mini app is a Hugging Face Space tagged for the robot.

<Note variant="info" title="Good to know">
  The catalog is built directly from the community's Spaces.
</Note>

<HtmlEmbed src="d3-apps-growth.html" title="Apps published over time" />

Try one live:

<Iframe
  src="https://huggingface.co/spaces/pollen-robotics/reachy-mini-demo"
  title="Reachy Mini demo"
  height={520}
/>
```
