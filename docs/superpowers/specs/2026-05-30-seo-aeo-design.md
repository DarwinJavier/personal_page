# SEO & AEO Strategy — darwinhernandez.com
**Date:** 2026-05-30
**Status:** Approved

---

## Goal

Build a complete SEO and AEO foundation for darwinhernandez.com so that Darwin Hernandez is discoverable by recruiters, potential clients, peers, and Substack readers — in that priority order.

**Primary identity to establish across all systems:**
> "AI-Fluent Product Marketing & GTM Strategist | Builder | Critical Thinker"

**Full description (for schema and meta):**
> "Product Marketing and Go-to-Market (GTM) strategist with deep AI fluency, a builder's mindset, and sharp analytical judgment. I translate complex technology into positioning, narrative, and growth."

---

## Site Context

- **Domain:** https://www.darwinhernandez.com/
- **Stack:** Static HTML, no framework, no build system. ES module JS (`app.js`), content centralized in `data.js`.
- **Pages:** home (`/`), about (`/about/`), writing (`/writing/`), projects (`/projects/`), now (`/now/`)
- **Current SEO state:** Title + meta description only. No robots.txt, sitemap, structured data, OG tags, or canonical URLs.

---

## Approach: Data-Driven SEO + AEO Layer

Chosen over static-only (doesn't scale) and minimal (no AEO coverage). JSON-LD schema is injected dynamically via `app.js` using the existing `data-page` attribute on `<body>`, so content added to `data.js` automatically gets structured data.

---

## Section 1 — Foundation Files

### `robots.txt` (root)

```
User-agent: *
Allow: /

Sitemap: https://www.darwinhernandez.com/sitemap.xml
```

Allows all crawlers including GPTBot and PerplexityBot.

### `sitemap.xml` (root)

Lists all 5 pages. Priority weights:

| URL | Priority | Frequency |
|---|---|---|
| `https://www.darwinhernandez.com/` | 1.0 | weekly |
| `https://www.darwinhernandez.com/about/` | 0.9 | monthly |
| `https://www.darwinhernandez.com/writing/` | 0.8 | weekly |
| `https://www.darwinhernandez.com/projects/` | 0.8 | monthly |
| `https://www.darwinhernandez.com/now/` | 0.5 | weekly |

---

## Section 2 — Global Meta Layer

Added to the `<head>` of all 5 HTML files.

### Canonical URL tag
```html
<link rel="canonical" href="https://www.darwinhernandez.com/{page-path}/">
```
Prevents duplicate content penalties from URL variants (trailing slash, query strings, etc.).

### Open Graph tags (per page)
Controls appearance when shared on LinkedIn, Slack, and in AI-generated link previews.

Fields per page:
- `og:type` — `website` for all pages
- `og:url` — absolute URL of the page
- `og:site_name` — "Darwin Hernandez"
- `og:title` — page-specific title with identity keywords
- `og:description` — page-specific description
- `og:image` — `https://www.darwinhernandez.com/assets/img/og-default.png`

### Twitter Card tags (per page)
- `twitter:card` — `summary_large_image`
- `twitter:title`, `twitter:description`, `twitter:image` — mirrors OG values

### OG Image
- File: `assets/img/og-default.png`
- Required dimensions: 1200×630px
- **Status: placeholder needed.** A simple branded image with Darwin's name and tagline. Can be created later — not blocking implementation.

### Per-page title and OG values

| Page | `<title>` | `og:title` | `og:description` |
|---|---|---|---|
| Home | Darwin Hernandez \| AI-Fluent Product Marketing & GTM Strategist | same | "Product Marketing and GTM strategist with deep AI fluency, a builder's mindset, and sharp analytical judgment." |
| About | About Darwin Hernandez \| Product Marketing & GTM Strategist | same | "AI-fluent Product Marketing and GTM strategist, builder, and critical thinker. I translate complex technology into positioning, narrative, and growth." |
| Writing | Writing \| Darwin Hernandez | "Essays by Darwin Hernandez on AI, Product Marketing & Culture" | "Field notes and essays on AI, GTM strategy, storytelling, and culture — by Darwin Hernandez." |
| Projects | Projects \| Darwin Hernandez | "AI & GTM Projects by Darwin Hernandez" | "Public experiments and tools by Darwin Hernandez — AI agents, automation systems, and GTM experiments built in public." |
| Now | Now \| Darwin Hernandez | "What Darwin Hernandez Is Working On Now" | "A live snapshot of what Darwin Hernandez is building, reading, writing, and listening to." |

---

## Section 3 — Structured Data (JSON-LD)

Injected dynamically by a new `injectSchema()` function in `app.js`, called on page load. Uses existing `data-page` attribute on `<body>`.

### Schema map

| `data-page` value | Schema type(s) injected |
|---|---|
| `home` | `Person` |
| `about` | `Person` (extended) + `FAQPage` |
| `writing` | `ItemList` wrapping `Article` per entry in `data.js` |
| `projects` | `ItemList` wrapping `SoftwareApplication` per entry in `data.js` |
| `now` | none |

### `Person` schema (home)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Darwin Hernandez",
  "jobTitle": "Product Marketing & GTM Strategist",
  "description": "AI-fluent Product Marketing and Go-to-Market (GTM) strategist, builder, and critical thinker.",
  "url": "https://www.darwinhernandez.com",
  "sameAs": [
    "https://www.linkedin.com/in/darwin-javier-hernandez/",
    "https://mrdasein.substack.com/",
    "https://github.com/DarwinJavier"
  ]
}
```

### `Person` schema (about — extended version)
Same as above plus:
```json
{
  "knowsAbout": [
    "Product Marketing",
    "Go-to-Market Strategy",
    "Artificial Intelligence",
    "GTM Strategy",
    "Storytelling",
    "Brand Positioning"
  ]
}
```

### `ItemList` + `Article` schema (writing page)
One `ItemList` is injected containing one `ListItem` per essay. Each `ListItem` embeds a full `Article` object. Built from `data.js` `writing` array:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{title}",
  "description": "{summary}",
  "datePublished": "{date}",
  "url": "{sourceUrl}",
  "author": {
    "@type": "Person",
    "name": "Darwin Hernandez",
    "url": "https://www.darwinhernandez.com"
  }
}
```

### `ItemList` + `SoftwareApplication` schema (projects page)
One `ItemList` is injected containing one `ListItem` per project. Each `ListItem` embeds a full `SoftwareApplication` object. Built from `data.js` `projects` array:
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "{title}",
  "description": "{plainEnglishDescription}",
  "url": "{githubUrl}",
  "author": {
    "@type": "Person",
    "name": "Darwin Hernandez",
    "url": "https://www.darwinhernandez.com"
  }
}
```

---

## Section 4 — AEO Layer (About Page)

### FAQPage schema
Injected alongside the `Person` schema on the about page. Targets the exact questions AI engines (ChatGPT, Perplexity, Google AI Overviews) are asked about Darwin.

**5 targeted questions and answers:**

**Q: Who is Darwin Hernandez?**
> Darwin Hernandez is an AI-fluent Product Marketing and Go-to-Market (GTM) strategist, builder, and critical thinker. He helps companies translate complex technology into clear positioning, narrative, and growth strategy. He writes about AI, product marketing, and culture, and builds AI experiments and tools in public.

**Q: What does Darwin Hernandez specialize in?**
> Darwin Hernandez specializes in product marketing, go-to-market strategy, AI-powered workflows, brand positioning, and strategic storytelling. He brings both strategic judgment and hands-on building experience to GTM challenges.

**Q: Is Darwin Hernandez available for work?**
> Darwin Hernandez is open to conversations about senior product marketing roles, GTM consulting engagements, and selected collaborations at the intersection of AI and marketing. Connect with him on LinkedIn.

**Q: What has Darwin Hernandez built?**
> Darwin Hernandez has built several public AI projects including music-crewai (a multi-agent music research tool), a platform game (Puchi & Pao's Sparkling Adventure), a job search agent, a family planner, and a Kanban board. All projects are open source on GitHub.

**Q: Where can I read Darwin Hernandez's writing?**
> Darwin Hernandez publishes essays on AI, product marketing, culture, and strategy on his Substack (mrdasein.substack.com) and indexes all writing at darwinhernandez.com/writing/.

### Visible FAQ section on About page
The FAQ content is rendered visually on the About page (required by Google — schema alone is not enough). Rendered as a stacked Q&A list (no JavaScript accordion needed — plain HTML, styled to match the existing design system).

---

## Files to Create / Modify

| Action | File |
|---|---|
| Create | `/robots.txt` |
| Create | `/sitemap.xml` |
| Modify | `/index.html` — canonical, OG, Twitter tags; update title |
| Modify | `/about/index.html` — canonical, OG, Twitter tags; update title; add FAQ section |
| Modify | `/writing/index.html` — canonical, OG, Twitter tags; update title |
| Modify | `/projects/index.html` — canonical, OG, Twitter tags; update title |
| Modify | `/now/index.html` — canonical, OG, Twitter tags; update title |
| Modify | `/assets/js/app.js` — add `injectSchema()` function |
| Note | `/assets/img/og-default.png` — 1200×630px branded image needed (not blocking) |

---

## Success Criteria

- Google Search Console can crawl and index all 5 pages cleanly
- Rich results test (search.google.com/test/rich-results) validates Person and Article schema
- Sharing any page on LinkedIn produces a rich card with title, description, and image
- Asking ChatGPT or Perplexity "Who is Darwin Hernandez?" returns an accurate, sourced answer
- No canonical errors, duplicate title tags, or missing meta descriptions flagged in GSC
