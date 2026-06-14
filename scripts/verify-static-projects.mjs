import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { projects } from "../assets/js/data.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = await fs.readFile(path.join(root, "projects", "index.html"), "utf8");

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const missing = [];

for (const project of projects) {
  const requiredText = [
    ["name", project.title],
    ["summary", project.shortDescription],
    ["description", project.plainEnglishDescription],
    ["why it matters", project.whatThisProves],
  ];

  for (const [field, value] of requiredText) {
    if (!html.includes(escapeHtml(value))) {
      missing.push(`${project.title}: ${field}`);
    }
  }
}

if (!html.includes('id="projects-list"') || !html.includes("STATIC_PROJECT_CARDS_START")) {
  missing.push("static project-card container");
}

if (missing.length) {
  throw new Error(`Missing from projects/index.html:\n- ${missing.join("\n- ")}`);
}

console.log(`Verified ${projects.length} projects in initial projects/index.html.`);
