# Darwin Website Production Pack

Use the documents in this folder in this order:

1. Brand Identity Playbook
2. Page Wireframes and UX Blueprints
3. Content Model and Rollover System
4. Iconography and Illustration Guidelines
5. Front-End Implementation Brief and Codex Prompt Pack
6. Data schema starter files

The core production principle: the website is the interpretation layer connecting LinkedIn, Substack, GitHub, and Spotify. Do not turn it into a dumping ground.

After updating projects or writing in `assets/js/data.js`, regenerate the crawlable initial HTML:

```powershell
node scripts/render-static-content.mjs
```

Commit the resulting changes to `projects/index.html` and `writing/index.html` with the content update.
