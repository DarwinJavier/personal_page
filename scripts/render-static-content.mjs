import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { nowItems, playlists, principles, projects, writing } from "../assets/js/data.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function relativeAsset(asset) {
  return `../${asset}`;
}

function homeAsset(asset) {
  return `./${asset}`;
}

function tags(items) {
  return `<div class="tags">${items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>`;
}

function projectProofPoint(point, index) {
  const title = typeof point === "string" ? "" : point.title;
  const text = typeof point === "string" ? point : point.text;
  return `
            <p>
              <span class="project-signal-icon">${String(index + 1).padStart(2, "0")}</span>
              <span class="project-signal-copy">${title ? `<strong>${escapeHtml(title)}</strong>` : ""}${escapeHtml(text)}</span>
            </p>`;
}

function projectCard(project) {
  const detailUrl = project.detailUrl ? `./${project.detailUrl.replace(/^projects\//, "")}` : `./#${project.slug}`;
  const proofPoints = project.proofPoints || [project.northSignal, project.whatThisProves];
  const actions = [
    project.demoUrl
      ? `<a class="button primary essay-card-cta" href="${escapeHtml(project.demoUrl)}" target="_blank" rel="noreferrer">${escapeHtml(project.appCtaLabel || "View App")} -&gt;</a>`
      : "",
    project.detailUrl
      ? `<a class="button secondary essay-card-cta" href="${escapeHtml(detailUrl)}">Learn more -&gt;</a>`
      : `<a class="button secondary essay-card-cta" href="${escapeHtml(project.githubUrl)}" target="_blank" rel="noreferrer">View on GitHub -&gt;</a>`,
  ].filter(Boolean).join("\n                  ");

  return `
          <article id="${escapeHtml(project.slug)}" class="project-showcase-card">
            <div class="project-showcase-image" style="background-image: url('${escapeHtml(relativeAsset(project.image))}')" aria-hidden="true"></div>
            <div class="project-showcase-copy">
              <div class="project-showcase-topline">
                <span class="eyebrow">${escapeHtml(project.language)}</span>
                <span class="pill">${escapeHtml(project.status || (project.featured ? "Featured" : "Experiment"))}</span>
              </div>
              <h2><a href="${escapeHtml(detailUrl)}">${escapeHtml(project.title)}</a></h2>
              <p class="strong">${escapeHtml(project.shortDescription)}</p>
              <p>${escapeHtml(project.plainEnglishDescription)}</p>
              <div class="project-proof">
                <span class="eyebrow">What this proves</span>
                <p>${escapeHtml(project.whatThisProves)}</p>
              </div>
              <div class="project-signal-list">${proofPoints.slice(0, 3).map(projectProofPoint).join("")}
              </div>
              <div class="project-showcase-footer">
                ${tags(project.builtWith)}
                <div class="project-actions">
                  ${actions}
                </div>
              </div>
            </div>
          </article>`;
}

function essayCard(essay) {
  return `
          <article id="${escapeHtml(essay.slug)}" class="essay-tile">
            <div class="essay-tile-image essay-art" style="background-image: url('${escapeHtml(relativeAsset(essay.image || "assets/img/writing-map.png"))}')"></div>
            <div class="essay-tile-copy">
              <time datetime="${escapeHtml(essay.date)}">${escapeHtml(formatDate(essay.date))}</time>
              <h2><a href="./#${escapeHtml(essay.slug)}">${escapeHtml(essay.title)}</a></h2>
              <p>${escapeHtml(essay.summary)}</p>
            </div>
            <div class="essay-tile-footer">
              ${tags(essay.tags.slice(0, 3))}
              <a class="text-link" href="${escapeHtml(essay.sourceUrl)}" target="_blank" rel="noreferrer">Read -&gt;</a>
            </div>
          </article>`;
}

function projectSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Projects by Darwin Hernandez",
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: project.title,
        description: project.plainEnglishDescription,
        url: project.detailUrl
          ? `https://www.darwinhernandez.com/${project.detailUrl}`
          : project.demoUrl || project.githubUrl,
        sameAs: project.githubUrl,
        applicationCategory: project.language,
        operatingSystem: "Web",
        image: `https://www.darwinhernandez.com/${project.image}`,
        keywords: project.builtWith.join(", "),
        author: {
          "@type": "Person",
          name: "Darwin Hernandez",
          url: "https://www.darwinhernandez.com",
        },
      },
    })),
  };
}

function writingSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Essays by Darwin Hernandez",
    itemListElement: writing.map((essay, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Article",
        headline: essay.title,
        description: essay.summary,
        datePublished: essay.date,
        url: essay.sourceUrl,
        author: {
          "@type": "Person",
          name: "Darwin Hernandez",
          url: "https://www.darwinhernandez.com",
        },
      },
    })),
  };
}

function homeFeaturedProject(project) {
  const detailUrl = project.detailUrl ? `./${project.detailUrl}` : `./projects/#${project.slug}`;
  const proofs = (project.proofPoints || [project.northSignal]).slice(0, 3);
  const appAction = project.demoUrl
    ? `<a class="button primary" href="${escapeHtml(project.demoUrl)}" target="_blank" rel="noreferrer">${escapeHtml(project.appCtaLabel || "View App")} -&gt;</a>`
    : "";
  return `        <div id="featured-project" class="feature-grid">
          <div class="featured-project-main">
            <img class="featured-project-image" src="${escapeHtml(homeAsset(project.image))}" alt="">
            <div class="featured-project-copy">
              <span class="eyebrow">Featured Project</span>
              <h3><a href="${escapeHtml(detailUrl)}">${escapeHtml(project.title)}</a></h3>
              <p>${escapeHtml(project.homeDescription || project.plainEnglishDescription)}</p>
              <p><strong>What this proves:</strong> ${escapeHtml(project.homeWhatThisProves || project.whatThisProves)}</p>
              ${tags(project.builtWith)}
            </div>
          </div>
          <aside class="proof-list">
            ${proofs.map((point, index) => `<p><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(typeof point === "string" ? point : `${point.title}: ${point.text}`)}</p>`).join("")}
            <div class="featured-project-actions">
              ${appAction}
              ${project.detailUrl
                ? `<a class="text-link" href="${escapeHtml(detailUrl)}">Learn more -&gt;</a>`
                : `<a class="text-link" href="${escapeHtml(project.githubUrl)}" target="_blank" rel="noreferrer">View on GitHub -&gt;</a>`}
            </div>
          </aside>
        </div>`;
}

function homeFeaturedEssay(essay) {
  return `        <div id="featured-essay" class="feature-grid">
          <div class="featured-essay-main">
            <img class="featured-essay-image" src="${escapeHtml(homeAsset(essay.featuredImage || essay.image))}" alt="">
            <div class="featured-essay-copy">
              <span class="eyebrow">Essay Spotlight</span>
              <h3><a href="./writing/#${escapeHtml(essay.slug)}">${escapeHtml(essay.title)}</a></h3>
              <p class="strong">${escapeHtml(essay.subtitle)}</p>
              <p>${escapeHtml(essay.summary)}</p>
              ${tags(essay.tags)}
            </div>
          </div>
          <div class="featured-essay-side">
            <aside class="north-map-card">
              <span class="eyebrow">North's Map of This Essay</span>
              <ol>${(essay.mapItems || []).map((item) => `<li><span class="map-logo">${item.image ? `<img src="${escapeHtml(homeAsset(item.image))}" alt="">` : escapeHtml(item.mark)}</span><div><strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.note)}</p></div></li>`).join("")}</ol>
              <p class="handwritten">${escapeHtml(essay.northSignal)}</p>
            </aside>
            <a class="button primary map-card-cta" href="${escapeHtml(essay.sourceUrl)}" target="_blank" rel="noreferrer">Read full essay on Substack -&gt;</a>
          </div>
        </div>`;
}

function homeMrDaseinBanner() {
  return `        <div class="mr-dasein-banner">
          <div class="mr-dasein-copy">
            <span class="eyebrow">Darwin's Substack alter ego</span>
            <h2>Meet Mr. Dasein</h2>
            <p class="mr-dasein-lede">A critical, philosophical voice for examining AI, culture, and the systems quietly shaping how we live.</p>
            <p>Mr. Dasein questions what feels settled, looks at technology from the social side, and still makes room for music, pop culture, and curiosity.</p>
            <div class="mr-dasein-signals" aria-label="Topics explored by Mr. Dasein">
              <span>AI &amp; society</span>
              <span>Philosophy</span>
              <span>Pop culture</span>
              <span>Meaning</span>
            </div>
            <div class="mr-dasein-actions">
              <a class="button mr-dasein-primary" href="https://mrdasein.substack.com/" target="_blank" rel="noreferrer">Read Mr. Dasein -&gt;</a>
              <a class="mr-dasein-link" href="https://mrdasein.substack.com/p/welcome-to-mr-dasein" target="_blank" rel="noreferrer">Meet the voice -&gt;</a>
            </div>
          </div>
        </div>`;
}

function homePlaylist(playlist) {
  return `        <div id="playlist" class="feature-grid">
          <div class="listening-copy">
            <h3>${escapeHtml(playlist.title)}</h3>
            <p>${escapeHtml(playlist.whyItBelongsHere)}</p>
            <p><strong>Mood:</strong> ${escapeHtml(playlist.mood)}</p>
            <p><strong>North's signal:</strong> ${escapeHtml(playlist.northSignal)}</p>
            ${tags(playlist.tags)}
            <a class="text-link" href="${escapeHtml(playlist.spotifyUrl)}" target="_blank" rel="noreferrer">Open on Spotify -&gt;</a>
          </div>
          <div class="spotify-embed">
            <iframe title="${escapeHtml(playlist.title)} on Spotify" src="${escapeHtml(playlist.spotifyEmbedUrl)}" width="100%" height="352" frameborder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
          </div>
        </div>`;
}

function homeNowItem(item) {
  return `<article class="mini-card"><span class="mini-icon" aria-hidden="true">${escapeHtml(item.icon.toUpperCase())}</span><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></div></article>`;
}

function homePrinciple(item) {
  return `<article class="principle-card"><span aria-hidden="true">${escapeHtml(item.icon.toUpperCase())}</span><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></div></article>`;
}

function homePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Darwin Hernandez",
    alternateName: ["Darwin Javier Hernandez", "Darwin Hernandez, Mr. Dasein"],
    jobTitle: "Product Marketing & GTM Strategist",
    description: "AI-fluent Product Marketing and Go-to-Market (GTM) strategist, builder, writer, and critical thinker.",
    url: "https://www.darwinhernandez.com/",
    sameAs: [
      "https://www.linkedin.com/in/darwin-javier-hernandez/",
      "https://mrdasein.substack.com/",
      "https://github.com/DarwinJavier",
    ],
    knowsAbout: [
      "Product marketing",
      "Go-to-market strategy",
      "Artificial intelligence",
      "AI-powered workflows",
      "Strategic storytelling",
      "Brand positioning",
      "Culture and technology",
    ],
  };
}

function replaceBlock(html, marker, content) {
  const start = `<!-- ${marker}_START -->`;
  const end = `<!-- ${marker}_END -->`;
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
  const replacement = `${start}\n${content}\n        ${end}`;

  if (!pattern.test(html)) {
    throw new Error(`Missing ${marker} markers`);
  }

  return html.replace(pattern, replacement);
}

async function updatePage(relativePath, cardMarker, cards, schemaMarker, schemaId, schema) {
  const filePath = path.join(root, relativePath);
  let html = await fs.readFile(filePath, "utf8");
  html = replaceBlock(html, cardMarker, cards);
  html = replaceBlock(
    html,
    schemaMarker,
    `    <script id="${schemaId}" type="application/ld+json">${JSON.stringify(schema)}</script>`,
  );
  await fs.writeFile(filePath, html);
}

await updatePage(
  "projects/index.html",
  "STATIC_PROJECT_CARDS",
  `        <div id="projects-list" class="project-feature-list">${projects.map(projectCard).join("")}\n        </div>`,
  "STATIC_PROJECT_SCHEMA",
  "projects-schema",
  projectSchema(),
);

await updatePage(
  "writing/index.html",
  "STATIC_WRITING_CARDS",
  `        <div id="writing-grid" class="essay-tile-grid">${writing.map(essayCard).join("")}\n        </div>`,
  "STATIC_WRITING_SCHEMA",
  "writing-schema",
  writingSchema(),
);

const featuredProject = projects.find((project) => project.featured);
const featuredEssay = writing.find((essay) => essay.featured);
const featuredPlaylist = playlists.find((playlist) => playlist.featured);
const homePath = path.join(root, "index.html");
let homeHtml = await fs.readFile(homePath, "utf8");
homeHtml = replaceBlock(homeHtml, "STATIC_HOME_SCHEMA", `    <script id="home-person-schema" type="application/ld+json">${JSON.stringify(homePersonSchema())}</script>`);
homeHtml = replaceBlock(homeHtml, "STATIC_HOME_FEATURED_PROJECT", homeFeaturedProject(featuredProject));
homeHtml = replaceBlock(homeHtml, "STATIC_HOME_FEATURED_ESSAY", homeFeaturedEssay(featuredEssay));
homeHtml = replaceBlock(homeHtml, "STATIC_HOME_MR_DASEIN", homeMrDaseinBanner());
homeHtml = replaceBlock(homeHtml, "STATIC_HOME_PLAYLIST", homePlaylist(featuredPlaylist));
homeHtml = replaceBlock(homeHtml, "STATIC_HOME_NOW", `        <div id="now-list" class="mini-grid">${nowItems.map(homeNowItem).join("")}</div>`);
homeHtml = replaceBlock(homeHtml, "STATIC_HOME_PRINCIPLES", `        <div id="principles" class="principles-grid">${principles.map(homePrinciple).join("")}</div>`);
await fs.writeFile(homePath, homeHtml);

console.log(`Rendered homepage, ${projects.length} projects, and ${writing.length} essays into initial HTML.`);
