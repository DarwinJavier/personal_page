import { links, nowItems, playlists, principles, projects, writing } from "./data.js";

const rootPath = document.body.dataset.root || ".";
const page = document.body.dataset.page || "home";

const navItems = [
  ["Projects", "projects/"],
  ["Writing", "writing/"],
  ["About", "about/"],
];

function $(selector) {
  return document.querySelector(selector);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function pathFor(path) {
  return `${rootPath}/${path}`.replace(/\/\.\//, "/");
}

function icon(name) {
  const icons = {
    arrow: "->",
    external: "->",
    github: "GH",
    linkedin: "in",
    substack: "S",
    flask: "AI",
    pen: "PM",
    book: "BK",
    headphones: "MU",
    compass: "N",
  };
  return icons[name] || "•";
}

function lineIcon(name) {
  const common = `viewBox="0 0 48 48" aria-hidden="true"`;
  const paths = {
    flask: `<svg ${common}><path d="M18 6h12M21 6v12L10 38c-1 2 0 4 3 4h22c3 0 4-2 3-4L27 18V6"/><path d="M16 32h16"/></svg>`,
    pen: `<svg ${common}><path d="M11 37l3-10 20-20 7 7-20 20-10 3z"/><path d="M29 12l7 7"/><path d="M14 27l7 7"/></svg>`,
    book: `<svg ${common}><path d="M8 10h13c4 0 7 3 7 7v23c0-4-3-7-7-7H8z"/><path d="M40 10H27c-4 0-7 3-7 7v23c0-4 3-7 7-7h13z"/></svg>`,
    headphones: `<svg ${common}><path d="M10 28v-5a14 14 0 0 1 28 0v5"/><path d="M10 28h7v12h-7zM31 28h7v12h-7z"/></svg>`,
    target: `<svg ${common}><circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="9"/><circle cx="24" cy="24" r="2"/><path d="M31 17l9-9M34 8h6v6"/></svg>`,
    brain: `<svg ${common}><path d="M19 11c-5 0-8 4-8 8 0 2 1 4 3 5-2 1-3 4-2 7 1 4 5 6 9 4v-24z"/><path d="M29 11c5 0 8 4 8 8 0 2-1 4-3 5 2 1 3 4 2 7-1 4-5 6-9 4v-24z"/><path d="M19 20h-5M29 20h5M19 29h-5M29 29h5"/></svg>`,
    pencil: `<svg ${common}><path d="M9 39l4-12 20-20 8 8-20 20z"/><path d="M28 12l8 8"/><path d="M13 27l8 8"/></svg>`,
    globe: `<svg ${common}><circle cx="24" cy="24" r="17"/><path d="M7 24h34M24 7c5 5 8 11 8 17s-3 12-8 17M24 7c-5 5-8 11-8 17s3 12 8 17"/></svg>`,
  };
  return paths[name] || paths.target;
}

function assetPath(path) {
  return path.startsWith("assets/") ? pathFor(path) : path;
}

function header() {
  const el = $("#site-header");
  if (!el) return;

  const nav = navItems
    .map(([label, href]) => {
      const active = page === label.toLowerCase() || (label === "Writing" && page === "writing-b");
      return `<a class="${active ? "active" : ""}" href="${pathFor(href)}">${label}</a>`;
    })
    .join("");

  el.innerHTML = `
    <div class="shell header-inner">
      <a class="brand" href="${pathFor("index.html")}">Darwin Hernandez</a>
      <nav class="nav" aria-label="Primary">
        ${nav}
        <a href="${links.linkedin}" target="_blank" rel="noreferrer">Contact</a>
      </nav>
    </div>
  `;
}

function footer() {
  const el = $("#site-footer");
  if (!el) return;

  el.innerHTML = `
    <div class="shell footer-grid">
      <div>
        <a class="brand footer-brand" href="${pathFor("index.html")}">Darwin Hernandez</a>
        <p>AI - Product Marketing - Culture</p>
        <p>Builder, writer, strategist.</p>
      </div>
      <div>
        <h2>Navigation</h2>
        <a href="${pathFor("projects/")}">Projects</a>
        <a href="${pathFor("writing/")}">Writing</a>
        <a href="${pathFor("about/")}">About</a>
      </div>
      <div>
        <h2>Connect</h2>
        <a href="${links.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="${links.substack}" target="_blank" rel="noreferrer">Substack</a>
        <a href="${links.github}" target="_blank" rel="noreferrer">GitHub</a>
      </div>
      <div class="footer-note">
        <div class="north small-north"></div>
        <p class="handwritten">Thanks for stepping by.<br>- Darwin</p>
      </div>
    </div>
  `;
}

function tagList(tags) {
  return `<div class="tags">${tags.map((tag) => `<span>${tag}</span>`).join("")}</div>`;
}

function essayCard(essay, variant = "compact") {
  const summary = variant === "small" ? "" : `<p>${essay.summary}</p>`;
  if (variant === "wide") {
    return `
      <article class="essay-card ${variant}">
        <div class="image-mark essay-art" style="background-image: url('${assetPath(essay.image || "assets/img/writing-map.png")}')"></div>
        <div class="card-copy">
          <div>
            <time>${formatDate(essay.date)}</time>
            <h3>${essay.title}</h3>
            ${summary}
          </div>
          <div class="essay-card-footer">
            ${tagList(essay.tags.slice(0, 3))}
            <a class="button secondary essay-card-cta" href="${essay.sourceUrl}" target="_blank" rel="noreferrer">Read on Substack ${icon("external")}</a>
          </div>
        </div>
      </article>
    `;
  }

  return `
    <article class="essay-card ${variant}">
      <div class="image-mark essay-art" style="background-image: url('${assetPath(essay.image || "assets/img/writing-map.png")}')"></div>
      <div class="card-copy">
        <time>${formatDate(essay.date)}</time>
        <h3>${essay.title}</h3>
        <p class="strong">${essay.subtitle || ""}</p>
        ${summary}
        ${tagList(essay.tags)}
      </div>
      <a class="text-link" href="${essay.sourceUrl}" target="_blank" rel="noreferrer">Read on Substack ${icon("external")}</a>
    </article>
  `;
}

function essayTile(essay) {
  return `
    <article class="essay-tile">
      <div class="essay-tile-image essay-art" style="background-image: url('${assetPath(essay.image || "assets/img/writing-map.png")}')"></div>
      <div class="essay-tile-copy">
        <time>${formatDate(essay.date)}</time>
        <h2>${essay.title}</h2>
        <p>${essay.summary}</p>
      </div>
      <div class="essay-tile-footer">
        ${tagList(essay.tags.slice(0, 3))}
        <a class="text-link" href="${essay.sourceUrl}" target="_blank" rel="noreferrer">Read ${icon("external")}</a>
      </div>
    </article>
  `;
}

function projectCard(project, variant = "grid") {
  return `
    <article class="project-card ${variant}">
      <div class="project-icon ${project.slug}" style="background-image: url('${assetPath(project.image)}')" aria-hidden="true"></div>
      <div>
        <div class="card-topline">
          <h3>${project.title}</h3>
          <span class="pill">Public</span>
        </div>
        <p>${variant === "feature" ? project.plainEnglishDescription : project.shortDescription}</p>
      </div>
      <div class="project-meta">
        <a href="${project.githubUrl}" target="_blank" rel="noreferrer">View on GitHub ${icon("external")}</a>
      </div>
    </article>
  `;
}

function projectArchiveCard(project) {
  const proofPoints = project.proofPoints || [project.northSignal, project.whatThisProves];
  return `
    <article class="project-showcase-card">
      <div class="project-showcase-image" style="background-image: url('${assetPath(project.image)}')" aria-hidden="true"></div>
      <div class="project-showcase-copy">
        <div class="project-showcase-topline">
          <span class="eyebrow">${project.language}</span>
          <span class="pill">${project.featured ? "Featured" : "Experiment"}</span>
        </div>
        <h2>${project.title}</h2>
        <p class="strong">${project.shortDescription}</p>
        <p>${project.plainEnglishDescription}</p>
        <div class="project-proof">
          <span class="eyebrow">What this proves</span>
          <p>${project.whatThisProves}</p>
        </div>
        <div class="project-signal-list">
          ${proofPoints.slice(0, 3).map((point, index) => `
            <p><span>${lineIcon(["target", "brain", "globe"][index] || "target")}</span>${point}</p>
          `).join("")}
        </div>
        <div class="project-showcase-footer">
          ${tagList(project.builtWith)}
          <a class="button secondary essay-card-cta" href="${project.githubUrl}" target="_blank" rel="noreferrer">View on GitHub ${icon("external")}</a>
        </div>
      </div>
    </article>
  `;
}

function nowCard(item) {
  return `
    <article class="mini-card">
      <span class="mini-icon">${lineIcon(item.icon)}</span>
      <div>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </div>
    </article>
  `;
}

function principleCard(item) {
  return `
    <article class="principle-card">
      <span>${lineIcon(item.icon)}</span>
      <div>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </div>
    </article>
  `;
}

function northMap(essay) {
  const items = (essay.mapItems || []).map((item) => `
    <li>
      <span class="map-logo">${item.image ? `<img src="${assetPath(item.image)}" alt="">` : item.mark}</span>
      <div>
        <strong>${item.name}</strong>
        <p>${item.note}</p>
      </div>
    </li>
  `).join("");

  return `
    <aside class="north-map-card">
      <span class="eyebrow">North's Map of This Essay</span>
      <ol>${items}</ol>
      <p class="handwritten">${essay.northSignal}</p>
    </aside>
  `;
}

function compassBlock(note = "Guided by warm intelligence, practical experimentation, cultural taste, and an editorial point of view.") {
  return `
    <div class="generated-art" aria-hidden="true">
      <img src="${pathFor("assets/img/wayfinder-hero.png")}" alt="">
      <p class="handwritten">North<span>${note}</span></p>
    </div>
  `;
}

function writingBlock(note = "Writing is how I think in public.") {
  return `
    <div class="generated-art" aria-hidden="true">
      <img src="${pathFor("assets/img/writing-map.png")}" alt="">
      <p class="handwritten">${note}</p>
    </div>
  `;
}

function renderHome() {
  const featuredEssay = writing.find((item) => item.featured);
  const featuredProject = projects.find((item) => item.featured);
  const playlist = playlists.find((item) => item.featured);

  $("#hero-art").innerHTML = compassBlock("Guided by: warm intelligence, practical experimentation, cultural taste.");
  $("#latest-writing").innerHTML = writing
    .filter((item) => !item.featured)
    .slice(0, 3)
    .map((item) => essayCard(item, "small"))
    .join("");
  $("#featured-essay").innerHTML = `
    <div class="featured-essay-main">
      <img class="featured-essay-image" src="${assetPath(featuredEssay.featuredImage || featuredEssay.image)}" alt="">
      <div class="featured-essay-copy">
        <span class="eyebrow">Essay Spotlight</span>
        <h3>${featuredEssay.title}</h3>
        <p class="strong">${featuredEssay.subtitle}</p>
        <p>${featuredEssay.summary}</p>
        ${tagList(featuredEssay.tags)}
      </div>
    </div>
    <div class="featured-essay-side">
      ${northMap(featuredEssay)}
      <a class="button primary map-card-cta" href="${featuredEssay.sourceUrl}" target="_blank" rel="noreferrer">Read full essay on Substack ${icon("external")}</a>
    </div>
  `;
  $("#featured-project").innerHTML = `
    <div class="featured-project-main">
      <img class="featured-project-image" src="${assetPath(featuredProject.image)}" alt="">
      <div class="featured-project-copy">
        <span class="eyebrow">Featured Project</span>
        <h3>${featuredProject.title}</h3>
        <p>${featuredProject.plainEnglishDescription}</p>
        <p><strong>What this proves:</strong> ${featuredProject.whatThisProves}</p>
        ${tagList(featuredProject.builtWith)}
      </div>
    </div>
    <aside class="proof-list">
      ${(featuredProject.proofPoints || [featuredProject.northSignal]).map((point, index) => `
        <p><span>${lineIcon(["target", "brain", "globe"][index] || "target")}</span>${point}</p>
      `).join("")}
      <a class="text-link" href="${featuredProject.githubUrl}" target="_blank" rel="noreferrer">View on GitHub ${icon("arrow")}</a>
    </aside>
  `;
  $("#playlist").innerHTML = `
    <div class="listening-copy">
      <h3>${playlist.title}</h3>
      <p>${playlist.whyItBelongsHere}</p>
      <p><strong>Mood:</strong> ${playlist.mood}</p>
      <p><strong>North's signal:</strong> ${playlist.northSignal}</p>
      ${tagList(playlist.tags)}
      <a class="text-link" href="${playlist.spotifyUrl}" target="_blank" rel="noreferrer">Open on Spotify ${icon("arrow")}</a>
    </div>
    <div class="spotify-embed">
      <iframe
        title="${playlist.title} on Spotify"
        src="${playlist.spotifyEmbedUrl}"
        width="100%"
        height="352"
        frameborder="0"
        allowfullscreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"></iframe>
    </div>
  `;
  $("#now-list").innerHTML = nowItems.map(nowCard).join("");
  $("#principles").innerHTML = principles.map(principleCard).join("");
}

function renderWriting() {
  const writingGrid = $("#writing-grid");
  if (writingGrid) {
    writingGrid.innerHTML = writing.map(essayTile).join("");
    return;
  }

  $("#writing-art").innerHTML = writingBlock("North's note: Writing is how I think in public.");
  $("#writing-list").innerHTML = writing.map((item) => essayCard(item, "wide")).join("");
}

function renderWritingB() {
  $("#writing-grid").innerHTML = writing.map(essayTile).join("");
}

function renderProjects() {
  $("#projects-list").innerHTML = projects.map((item) => projectArchiveCard(item)).join("");
}

function renderNow() {
  $("#now-items").innerHTML = nowItems.map(nowCard).join("");
  $("#now-projects").innerHTML = projects.slice(0, 3).map((item) => projectCard(item, "feature")).join("");
}

function injectSchema(schema) {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

const personSchema = {
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
};

function schemaForHome() {
  injectSchema(personSchema);
}

function schemaForAbout() {
  injectSchema({
    ...personSchema,
    "knowsAbout": [
      "Product Marketing",
      "Go-to-Market Strategy",
      "Artificial Intelligence",
      "GTM Strategy",
      "Storytelling",
      "Brand Positioning"
    ]
  });
  injectSchema({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Who is Darwin Hernandez?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Darwin Hernandez is an AI-fluent Product Marketing and Go-to-Market (GTM) strategist, builder, and critical thinker. He helps companies translate complex technology into clear positioning, narrative, and growth strategy. He writes about AI, product marketing, and culture, and builds AI experiments and tools in public."
        }
      },
      {
        "@type": "Question",
        "name": "What does Darwin Hernandez specialize in?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Darwin Hernandez specializes in product marketing, go-to-market strategy, AI-powered workflows, brand positioning, and strategic storytelling. He brings both strategic judgment and hands-on building experience to GTM challenges."
        }
      },
      {
        "@type": "Question",
        "name": "Is Darwin Hernandez available for work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Darwin Hernandez is open to conversations about senior product marketing roles, GTM consulting engagements, and selected collaborations at the intersection of AI and marketing. Connect with him on LinkedIn at linkedin.com/in/darwin-javier-hernandez/."
        }
      },
      {
        "@type": "Question",
        "name": "What has Darwin Hernandez built?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Darwin Hernandez has built several public AI projects including music-crewai (a multi-agent music research tool), Puchi & Pao's Sparkling Adventure (a 16-bit platform game), a job search agent, a family planner, and a Kanban board. All projects are open source on GitHub at github.com/DarwinJavier."
        }
      },
      {
        "@type": "Question",
        "name": "Where can I read Darwin Hernandez's writing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Darwin Hernandez publishes essays on AI, product marketing, culture, and strategy on his Substack at mrdasein.substack.com and indexes all writing at darwinhernandez.com/writing/."
        }
      }
    ]
  });
}

function schemaForWriting() {
  injectSchema({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Essays by Darwin Hernandez",
    "itemListElement": writing.map((essay, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Article",
        "headline": essay.title,
        "description": essay.summary,
        "datePublished": essay.date,
        "url": essay.sourceUrl,
        "author": {
          "@type": "Person",
          "name": personSchema.name,
          "url": personSchema.url
        }
      }
    }))
  });
}

function schemaForProjects() {
  injectSchema({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Projects by Darwin Hernandez",
    "itemListElement": projects.map((project, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "SoftwareApplication",
        "name": project.title,
        "description": project.plainEnglishDescription,
        "url": project.githubUrl,
        "author": {
          "@type": "Person",
          "name": personSchema.name,
          "url": personSchema.url
        }
      }
    }))
  });
}

function renderAbout() {
  const aboutArt = $("#about-art");
  const aboutNow = $("#about-now");
  if (aboutArt) aboutArt.innerHTML = compassBlock("Darwin looks for clarity in complexity and meaning in movement.");
  if (aboutNow) aboutNow.innerHTML = nowItems.map(nowCard).join("");
}

header();
footer();
document.documentElement.classList.remove("dark");
localStorage.removeItem("darwin-theme");

if (page === "home") { renderHome(); schemaForHome(); }
if (page === "writing") { renderWriting(); schemaForWriting(); }
if (page === "writing-b") renderWritingB();
if (page === "projects") { renderProjects(); schemaForProjects(); }
if (page === "now") renderNow();
if (page === "about") { renderAbout(); schemaForAbout(); }
