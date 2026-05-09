---
name: darwin-website-design-system
description: Use when building, editing, or extending Darwin Hernandez’s personal website, including homepage, Writing, Projects, About, Now, Wayfinder/North identity, visual system, reusable components, and content rollover. Do not use for unrelated websites.
---

# Darwin Website Design System Skill

## Purpose
Use this skill when building, editing, or extending Darwin Hernandez’s personal website. The site is a personal authority hub at the intersection of AI, product marketing, culture, writing, and small practical experiments. It should feel like a calm editorial field notebook for the AI era, not a generic tech portfolio and not a corporate resume page.

The main outcome is to turn Darwin’s scattered public presence into one coherent identity system:

- Substack = full essays and publishing home
- GitHub = projects and builder proof
- Spotify / listening trails = cultural signal and pattern recognition
- Website = interpretation layer that connects everything and explains why it matters

## Source mockups
Use these visual references as the design source of truth. Do not copy them pixel-for-pixel, but preserve their rhythm, hierarchy, spacing, and tone.

- `assets/mockups/home-wireframe.png` — homepage structure and section rhythm
- `assets/mockups/writing-page-wireframe.png` — writing archive and Substack promotion
- `assets/mockups/projects-page-wireframe.png` — public GitHub repos page
- `assets/mockups/about-page-preferred.png` — preferred About page direction
- `assets/mockups/essay-spotlight-card.png` — treatment for featured essay / Wayfinder map
- `assets/brand/brand-board-cool-wayfinder.png` — palette, typography, icon, and Wayfinder identity


## Image generation policy

This skill is primarily for implementing the website from existing mockups and assets. Do not generate new images unless the user explicitly asks for new mockups, icons, illustrations, or visual assets.

When new raster mockups or illustrations are required and an OpenAI image-generation tool/model is available, use `gpt-image-2` if the environment supports it. If `gpt-image-2` is not available in the current Codex environment, do not pretend to call it. Instead:

1. Reuse the existing images in `assets/mockups/` and `assets/brand/`.
2. Create lightweight SVG/CSS placeholders where appropriate.
3. Ask the user to generate the new visual asset separately in ChatGPT/image generation, then add it to the skill assets.

For icons, prefer simple inline SVG line icons that follow the Iconography Guide: thin strokes, rounded joins, Blueprint Blue / Soft Iris accents, and a calm editorial field-notebook style.

## Brand position
Darwin is a product marketer, writer, and builder who explores how AI, product marketing, and culture shape the future of go-to-market work. The site should communicate:

- Warm intelligence
- Practical experimentation
- Cultural taste
- Editorial clarity
- Builder proof
- Human-first technology thinking

The site should make a visitor think: “Darwin thinks clearly, builds useful things, understands culture, and can translate complexity into practical strategy.”

## Visual identity

### Palette
Use the cool Wayfinder palette. Avoid the earlier warm copper / parchment direction because it reads too close to Claude or Anthropic.

Core colors:

```css
:root {
  --moonstone-paper: #F4F5F8;
  --harbor-ink: #243246;
  --silver-fog: #D9DFE8;
  --blueprint-blue: #5868F2;
  --steel-slate: #7087A0;
  --deep-fjord: #2F5D76;
  --soft-iris: #8B78B8;
  --white: #FFFFFF;
}
```

Usage rules:

- `Moonstone Paper` is the default background.
- `Harbor Ink` is the main text color.
- `Blueprint Blue` is the primary action color.
- `Soft Iris` is for handwritten notes, annotations, subtle personality, and Wayfinder cues.
- `Steel Slate` is for metadata, secondary UI, dividers, and quiet labels.
- `Deep Fjord` is for deeper project/technical accents.
- Do not overuse blue. The site must not become “blue SaaS.” Keep the editorial notebook feeling.

### Typography
Use a literary serif for expressive headlines and a clean sans for body/UI.

Recommended implementation:

- Headings: `Fraunces`, `Cormorant Garamond`, or similar elegant serif
- Body/UI: `Inter`, `Source Sans 3`, or similar readable sans-serif
- Code/labels: `IBM Plex Mono` or similar mono

Hierarchy:

- Hero H1 should be large, calm, and editorial.
- Section labels should be small uppercase with generous letter spacing.
- Body copy should be easy to read and avoid dense paragraphs.
- Tags and metadata should be compact, pill-like, and quiet.

## Wayfinder / North identity system

The mascot/theme is **The Wayfinder**, with the companion name **North**.

North is not a cartoon mascot. North is a subtle editorial companion that helps visitors understand the signal behind Darwin’s work.

Visual language:

- Compass rose
- Contour lines
- Small sprig / leaf
- Handwritten annotation
- Dotted map paths
- Small guide figure only when helpful

Personality:

- Calm
- Curious
- Observant
- Useful
- Slightly poetic, never childish

Use North to add interpretation, not decoration.

Good North treatments:

- “North’s note”
- “North’s signal”
- “North’s map of this essay”
- “What this project reveals”
- “Listening trail map”

Avoid:

- Robot mascots
- Chatbot bubbles
- Too many faces
- Comic-style expressions
- Anything that competes with the writing

## Site navigation

Keep navigation basic and clear:

```text
Writing   Projects   Now   About   Contact
```

Rules:

- The Darwin Hernandez wordmark links to Home.
- Do not add “Home” to nav.
- Do not add “Listening” to nav in version 1. Use Listening as a homepage section or contextual element.
- Active page state uses a small underline in Blueprint Blue or Soft Iris.
- Dark mode toggle is optional. Only include it if fully implemented and accessible.

## Page templates

### Home page
Home is the editorial front page. It should not contain everything. It should connect identity, interpretation, writing, projects, taste, current exploration, credibility, and contact.

Required order:

1. Header / Navigation
2. Hero
3. What this site is / North’s note
4. Featured Essay Spotlight
5. Latest Writing
6. Featured Projects
7. Listening Trail
8. Now
9. Where this becomes useful
10. Contact CTA
11. Footer

Hero copy direction:

```text
I explore how AI, product marketing, and culture shape the future of go-to-market work.

I write, build small AI experiments, and translate complex technology into stories people can understand and use.
```

Hero CTAs:

- Primary: Read the writing
- Secondary: Explore projects

### Writing page
The Writing page curates Substack; it does not replace Substack.

Primary goals:

- Promote Substack
- Show best essays
- Give visitors a fast sense of Darwin’s thinking
- Link to full posts on Substack

Do not repost full essays. Use cards and spotlights.

Writing card fields:

```ts
type Essay = {
  title: string;
  subtitle?: string;
  date?: string;
  summary: string;
  northSignal?: string;
  whyItMatters?: string;
  tags: string[];
  substackUrl: string;
  image?: string;
};
```

Card UI:

- Title
- Subtitle / short argument
- Summary
- Tags
- “Read on Substack” CTA

Substack promotion block copy direction:

```text
Subscribe on Substack
Get new essays, field notes, and reflections on AI, marketing, strategy, and culture.
```

### Projects page
The Projects page translates GitHub into useful proof. Do not assume visitors know what a repo means.

Project card fields:

```ts
type Project = {
  name: string;
  description: string;
  whatItProves: string;
  language?: string;
  tools: string[];
  githubUrl: string;
  stars?: number;
  forks?: number;
  status?: "active" | "paused" | "experiment" | "archived";
  icon?: string;
};
```

For each project, explain:

- What it is
- Why Darwin built it
- What it proves
- Tools used
- GitHub link

Known public repo examples:

- `music-crewai` — CrewAI project that turns any music genre into a multi-file research report, saved per topic and viewable in a Gradio UI.
- `job_search_agent` — Agent workflow that helps prioritize job posts, tailor resumes, and monitor applications.
- `family-planner` — Agent to keep the Hernandez family organized.
- `kanban_board` — Simple Kanban board.
- `platform_game` — Platform game inspired by the 16-bit era.

Project page headline direction:

```text
Ideas in code. Curiosity in motion.
```

North’s note:

```text
Building is how I learn. Shipping is how I think.
```

### About page
Use `about-page-preferred.png` as the preferred direction. Keep it shorter and more editorial than a resume.

Primary headline:

```text
I explore the intersection of AI, product marketing, and culture to build what’s useful.
```

Intro copy:

```text
I’m a product marketer, writer, and builder who experiments with AI and studies how products, people, and ideas spread.
```

Required content blocks:

- Curious by nature
- Builder at heart
- Writer always
- My working thesis
- What I care about
- My path
- What I’m exploring now
- Cultural inputs / Beyond work
- Contact CTA

Working thesis:

```text
Technology is accelerating. Judgment is scarce. The future belongs to those who can combine AI, strategy, and storytelling to create clarity and drive impact.
```

### Now page
For version 1, the Now page can be simple. It should feel maintained, not overbuilt.

Use these four areas:

- Building
- Writing
- Reading
- Listening

Homepage Now card copy:

```text
Building
Testing AI agents, workflows, and lightweight tools for product marketing.

Writing
Essays on AI, product marketing, culture, and the tension between speed and meaning.

Reading
Strategy, philosophy, technology, and how people make sense of change.

Listening
Finding patterns in music, scenes, and creative movements.
```

## Content rollover system
Use a data-driven content model. New posts, projects, and playlists should be added as data objects, not hard-coded markup.

Recommended files:

```text
/src/content/essays.ts
/src/content/projects.ts
/src/content/playlists.ts
/src/content/now.ts
```

Every new entry should include:

- Title
- Short summary
- Why it matters
- Tags
- External URL
- Optional North signal

Never redesign the page just because new content is added.

## Component checklist
Build the site from reusable components:

- `Header`
- `Footer`
- `SectionLabel`
- `Hero`
- `NorthNote`
- `EssayCard`
- `EssaySpotlight`
- `ProjectCard`
- `PlaylistCard`
- `NowCard`
- `ContactCTA`
- `TagPill`
- `ExternalLink`
- `WayfinderIllustration`

## Implementation guidance
Preferred implementation is a static-first website using simple HTML/CSS or a lightweight framework. If using Next.js, keep the implementation static and content-driven. Avoid unnecessary client-side complexity.

Accessibility requirements:

- Semantic headings
- Keyboard-accessible navigation
- Visible focus states
- Alt text for images and illustrations
- Accessible label for dark mode toggle
- Sufficient contrast
- External links clearly marked

Performance requirements:

- Optimize images
- Use responsive images where possible
- Avoid heavy JavaScript
- Load fonts efficiently
- Keep motion subtle and optional

## Codex behavior rules
When using this skill in Codex or another coding agent:

1. Read `SKILL.md` first.
2. Review the visual mockups in `assets/mockups/`.
3. Build the page structure before polishing visuals.
4. Implement design tokens before components.
5. Use reusable content objects.
6. Do not hard-code all content into components.
7. Preserve the site’s calm editorial tone.
8. Do not create a generic SaaS design.
9. Do not create a childish mascot system.
10. Before finishing, compare the output to the mockups and report what matches and what differs.

## Acceptance criteria
The implementation is successful when:

- The site feels like the mockups, not a generic template.
- The navigation is basic and clear.
- The palette uses cool Wayfinder tones, not warm Anthropic-like tones.
- Writing links to Substack instead of duplicating full essays.
- Projects explain value, not just repo names.
- North adds interpretation in small, useful moments.
- The content system can scale without redesign.
