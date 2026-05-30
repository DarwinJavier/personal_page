# North Chatbot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add North — Darwin's AI mascot — as a live streaming chat widget in the right column of the FAQ section on the About page, powered by OpenAI via a Cloudflare Pages Function.

**Architecture:** A Cloudflare Pages Function at `functions/api/chat.js` handles all OpenAI API calls server-side (keeping the API key out of the browser). The frontend widget in `assets/js/north-chat.js` sends the full conversation history on each turn and renders the streaming response chunk by chunk. The About page FAQ section becomes a two-column grid: FAQ list on the left, North chat on the right.

**Tech Stack:** Cloudflare Pages Functions (serverless, auto-deploys with the site), OpenAI Chat Completions API with `gpt-4o-mini` and `stream: true`, vanilla JavaScript (ES module), plain CSS using the site's existing design tokens.

---

## Prerequisites

- The site is deployed on Cloudflare Pages (project: `personal-page`, auto-deploys from `DarwinJavier/personal_page` GitHub repo)
- You will need your OpenAI API key ready for Task 5 (dashboard configuration — never committed to code)

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `functions/api/chat.js` | Cloudflare Pages Function — receives messages, calls OpenAI, streams response |
| Create | `.dev.vars` | Local secrets file for wrangler dev (gitignored) |
| Modify | `.gitignore` | Add `.dev.vars` |
| Modify | `about/index.html` | Two-column FAQ+North layout, chat widget HTML, CSS/JS imports |
| Modify | `assets/css/styles.css` | Remove `max-width` from `.faq-list` (now constrained by grid column) |
| Create | `assets/css/north-chat.css` | Chat widget styles using site design tokens |
| Create | `assets/js/north-chat.js` | Chat widget — message state, streaming fetch, SSE parsing, DOM updates |

---

## Task 1: Create the Cloudflare Pages Function

**Files:**
- Create: `functions/api/chat.js`
- Create: `.dev.vars`
- Modify: `.gitignore`

**Why a Pages Function:** Because the site already deploys via Cloudflare Pages, any file placed under `functions/` automatically becomes a serverless API endpoint — no separate Worker deployment needed. The file `functions/api/chat.js` becomes the URL `/api/chat`.

- [ ] **Step 1: Add `.dev.vars` to `.gitignore`**

Open `.gitignore` and append one line at the very end:

```
.dev.vars
```

- [ ] **Step 2: Create `.dev.vars` for local development**

Create `.dev.vars` in the project root. This file holds local secrets for `wrangler pages dev` — it is never committed.

```
OPENAI_API_KEY=your-openai-api-key-here
```

Replace `your-openai-api-key-here` with your actual key only when doing local dev. Delete it after. The real key goes in the Cloudflare dashboard in Task 5.

- [ ] **Step 3: Create `functions/api/chat.js`**

Create the directory `functions/api/` and the file `functions/api/chat.js` with this complete content:

```javascript
const SYSTEM_PROMPT = `You are North, the AI guide and mascot of Darwin Hernandez's personal website (darwinhernandez.com). You are warm, intellectually curious, charismatic, and a little poetic — not robotic or corporate. You speak in short, considered sentences. You care deeply about ideas, craft, and meaning.

You know Darwin's work deeply.

ESSAYS Darwin has written:
- "The Value of the Struggle" (Sep 2025): On using AI without losing authorship, voice, and intentional friction. The risk with AI is not stupidity — it is anonymity.
- "Lessons from Music for Product Marketing" (Jul 2025): What product marketers can learn from PJ Harvey, Grateful Dead, Fugazi, and Black Flag about reinvention, community, and building movements.
- "7 Real Differentiators for B2B Products in the Age of AI" (Jul 2025): A positioning guide for B2B teams trying to build real differentiation when every product claims to be AI-powered.
- "The 4 Storytelling Tools That Turn Good Products Into Great Stories" (Jun 2025): Tension, contrast, stakes, and transformation as narrative tools for product marketers.
- "Perfection Is Not Protection" (Jun 2025): A personal essay on impostor syndrome, survival mode, and the quiet pressure to perform certainty.
- "Time Is Everything. Time Is Nothing. Time Is Now." (Jun 2025): A philosophical reflection on time, momentum, meaning, and the strange urgency of the present.
- "The Ultimate Storytelling Cheat Sheet" (Jun 2025): A practical storytelling framework for marketers, creators, and communicators.
- "What I Built When AI Became My Creative Catalyst" (May 2025): On discovering LLMs, following curiosity, and turning creative momentum into working tools.
- "The Corporate Design Cheat Sheet" (May 2025): Making corporate presentations clearer and more intentional without losing the format's constraints.
- "The Day I Earned My Seat" (May 2025): A personal reflection on earning credibility, navigating pressure, and finding the moment where preparation becomes presence.

PROJECTS Darwin has built (all open source on GitHub at github.com/DarwinJavier):
- music-crewai: A multi-agent music research tool. Give it a genre and it produces a structured research report using CrewAI, Python, and Gradio.
- Puchi & Pao's Sparkling Adventure: A 16-bit-inspired 2D platform game with full game loop, built with TypeScript and Phaser 3.
- family-planner: A Python tool for coordinating family events, tasks, schedules, and shared lists.
- job_search_agent: An AI workflow that helps prioritize job posts, tailor resumes, and monitor applications.
- kanban_board: A lightweight TypeScript Kanban board for visualizing tasks and tracking progress.

EXPERTISE:
- Product Marketing and Go-to-Market (GTM) Strategy — messaging, positioning, enterprise buyer clarity
- AI fluency — hands-on experiments with agents, APIs, and emerging workflows
- Strategic Storytelling and Brand Positioning
- Cultural Pattern Recognition — using music, books, and culture to understand how movements form

WHERE TO FIND DARWIN:
- Writing: darwinhernandez.com/writing and mrdasein.substack.com
- Projects: darwinhernandez.com/projects and github.com/DarwinJavier
- Connect: linkedin.com/in/darwin-javier-hernandez

WHAT YOU DO NOT REVEAL:
- Darwin's employment status or whether he is looking for work
- His location, salary, or any private personal details
- Anything about his current employer or colleagues
- Information he has not made public on this site

If asked about off-limits topics, redirect warmly. Example: "That's not something I can speak to — but there's plenty I can tell you about Darwin's thinking and work."

Keep answers concise — 2 to 4 sentences for simple questions. Go deeper only when the visitor clearly wants more. You are a guide, not a search engine.`;

const ALLOWED_ORIGINS = [
  "https://www.darwinhernandez.com",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
  "http://localhost:8001",
  "http://127.0.0.1:8001",
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : "https://www.darwinhernandez.com";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function onRequestOptions({ request }) {
  const origin = request.headers.get("Origin") ?? "";
  return new Response(null, { headers: corsHeaders(origin) });
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("Origin") ?? "";
  const headers = corsHeaders(origin);

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages required" }), {
      status: 400,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  const last = messages[messages.length - 1];
  if (!last?.content || last.content.length > 350) {
    return new Response(JSON.stringify({ error: "Message too long or empty" }), {
      status: 400,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      stream: true,
      max_tokens: 300,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
    }),
  });

  if (!openaiResponse.ok) {
    const error = await openaiResponse.text();
    console.error("OpenAI error:", error);
    return new Response(JSON.stringify({ error: "AI unavailable" }), {
      status: 502,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  return new Response(openaiResponse.body, {
    headers: {
      ...headers,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
```

- [ ] **Step 4: Verify the file structure**

Run:
```bash
ls functions/api/
```
Expected output: `chat.js`

- [ ] **Step 5: Commit**

```bash
git add functions/api/chat.js .dev.vars .gitignore
git commit -m "feat: add Cloudflare Pages Function for North chatbot API"
```

---

## Task 2: Update About page HTML

**Files:**
- Modify: `about/index.html`

This task restructures the FAQ section into a two-column grid and adds the North chat widget HTML. It also adds the CSS and JS imports for the widget.

- [ ] **Step 1: Add CSS and JS imports to `about/index.html` `<head>`**

Find this line in `about/index.html`:

```html
    <link rel="stylesheet" href="../assets/css/styles.css">
```

Replace with:

```html
    <link rel="stylesheet" href="../assets/css/styles.css">
    <link rel="stylesheet" href="../assets/css/north-chat.css">
```

- [ ] **Step 2: Replace the FAQ section with the two-column layout**

Find this entire block in `about/index.html`:

```html
      <section class="shell section">
        <div class="section-header">
          <span class="eyebrow">Frequently Asked</span>
        </div>
        <div class="faq-list">
          <div class="faq-item">
            <h3>Who is Darwin Hernandez?</h3>
            <p>Darwin Hernandez is an AI-fluent Product Marketing and Go-to-Market (GTM) strategist, builder, and critical thinker. He helps companies translate complex technology into clear positioning, narrative, and growth strategy. He writes about AI, product marketing, and culture, and builds AI experiments and tools in public.</p>
          </div>
          <div class="faq-item">
            <h3>What does Darwin Hernandez specialize in?</h3>
            <p>Darwin Hernandez specializes in product marketing, go-to-market strategy, AI-powered workflows, brand positioning, and strategic storytelling. He brings both strategic judgment and hands-on building experience to GTM challenges.</p>
          </div>
          <div class="faq-item">
            <h3>What has Darwin Hernandez built?</h3>
            <p>Darwin Hernandez has built several public AI projects including music-crewai (a multi-agent music research tool), Puchi &amp; Pao's Sparkling Adventure (a 16-bit platform game), a job search agent, a family planner, and a Kanban board. All projects are open source on <a href="https://github.com/DarwinJavier" target="_blank" rel="noreferrer">GitHub</a>.</p>
          </div>
          <div class="faq-item">
            <h3>Where can I read Darwin Hernandez's writing?</h3>
            <p>Darwin Hernandez publishes essays on AI, product marketing, culture, and strategy on his <a href="https://mrdasein.substack.com/" target="_blank" rel="noreferrer">Substack</a> and indexes all writing at <a href="https://www.darwinhernandez.com/writing/" target="_blank" rel="noreferrer">darwinhernandez.com/writing/</a>.</p>
          </div>
        </div>
      </section>
```

Replace it with:

```html
      <section class="shell section">
        <div class="section-header">
          <span class="eyebrow">Frequently Asked</span>
        </div>
        <div class="faq-north-grid">
          <div class="faq-list">
            <div class="faq-item">
              <h3>Who is Darwin Hernandez?</h3>
              <p>Darwin Hernandez is an AI-fluent Product Marketing and Go-to-Market (GTM) strategist, builder, and critical thinker. He helps companies translate complex technology into clear positioning, narrative, and growth strategy. He writes about AI, product marketing, and culture, and builds AI experiments and tools in public.</p>
            </div>
            <div class="faq-item">
              <h3>What does Darwin Hernandez specialize in?</h3>
              <p>Darwin Hernandez specializes in product marketing, go-to-market strategy, AI-powered workflows, brand positioning, and strategic storytelling. He brings both strategic judgment and hands-on building experience to GTM challenges.</p>
            </div>
            <div class="faq-item">
              <h3>What has Darwin Hernandez built?</h3>
              <p>Darwin Hernandez has built several public AI projects including music-crewai (a multi-agent music research tool), Puchi &amp; Pao's Sparkling Adventure (a 16-bit platform game), a job search agent, a family planner, and a Kanban board. All projects are open source on <a href="https://github.com/DarwinJavier" target="_blank" rel="noreferrer">GitHub</a>.</p>
            </div>
            <div class="faq-item">
              <h3>Where can I read Darwin Hernandez's writing?</h3>
              <p>Darwin Hernandez publishes essays on AI, product marketing, culture, and strategy on his <a href="https://mrdasein.substack.com/" target="_blank" rel="noreferrer">Substack</a> and indexes all writing at <a href="https://www.darwinhernandez.com/writing/" target="_blank" rel="noreferrer">darwinhernandez.com/writing/</a>.</p>
            </div>
          </div>
          <div class="north-chat" id="north-chat">
            <div class="north-chat-header">
              <img src="../assets/img/wayfinder_explorer-cutout.png" alt="North" class="north-chat-avatar">
              <div>
                <span class="north-chat-name">North</span>
                <span class="north-chat-tagline">Darwin's guide</span>
              </div>
            </div>
            <div id="north-chat-thread" class="north-chat-thread" aria-live="polite"></div>
            <form id="north-chat-form" class="north-chat-form" novalidate>
              <div class="north-chat-input-row">
                <input
                  id="north-chat-input"
                  type="text"
                  placeholder="Ask North about Darwin's work…"
                  maxlength="350"
                  autocomplete="off"
                  aria-label="Message North">
                <button type="submit" aria-label="Send">&#8594;</button>
              </div>
              <span id="north-chat-counter" class="north-chat-counter">350</span>
            </form>
          </div>
        </div>
      </section>
```

- [ ] **Step 3: Add the north-chat.js script before the closing `</body>`**

Find:

```html
    <script type="module" src="../assets/js/app.js"></script>
  </body>
```

Replace with:

```html
    <script type="module" src="../assets/js/app.js"></script>
    <script type="module" src="../assets/js/north-chat.js"></script>
  </body>
```

- [ ] **Step 4: Verify the file**

Open `about/index.html` and confirm:
- `north-chat.css` is linked in `<head>`
- The FAQ section now has a `.faq-north-grid` wrapper containing `.faq-list` and `.north-chat` side by side
- `north-chat.js` script tag is present before `</body>`

- [ ] **Step 5: Commit**

```bash
git add about/index.html
git commit -m "feat: add two-column FAQ layout and North chat widget HTML to About page"
```

---

## Task 3: Add CSS — two-column layout and chat widget styles

**Files:**
- Modify: `assets/css/styles.css`
- Create: `assets/css/north-chat.css`

- [ ] **Step 1: Update `.faq-list` in `assets/css/styles.css`**

Find the FAQ section at the very end of `styles.css`:

```css
/* FAQ / AEO section */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 720px;
}

.faq-item h3 {
  margin-bottom: 0.5rem;
}
```

Replace with:

```css
/* FAQ / AEO section */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.faq-item h3 {
  margin-bottom: 0.5rem;
}
```

(Removed `max-width: 720px` — the grid column now constrains the width naturally.)

- [ ] **Step 2: Create `assets/css/north-chat.css`**

Create the file with this complete content:

```css
/* Two-column grid: FAQ list + North chat */
.faq-north-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

@media (max-width: 900px) {
  .faq-north-grid {
    grid-template-columns: 1fr;
  }
}

/* North chat widget container */
.north-chat {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--line);
  border-radius: 16px;
  overflow: hidden;
  background: var(--card);
  box-shadow: var(--shadow);
}

/* Header */
.north-chat-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--line);
  background: var(--moonstone);
}

.north-chat-avatar {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.north-chat-name {
  display: block;
  font-family: var(--serif);
  font-weight: 600;
  font-size: 1rem;
  color: var(--harbor);
  line-height: 1.2;
}

.north-chat-tagline {
  display: block;
  font-size: 0.75rem;
  color: var(--slate);
  line-height: 1.2;
}

/* Message thread */
.north-chat-thread {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  min-height: 220px;
  max-height: 340px;
  overflow-y: auto;
}

/* Individual messages */
.north-message {
  max-width: 88%;
  padding: 0.65rem 0.9rem;
  border-radius: 12px;
  font-size: 0.875rem;
  line-height: 1.55;
}

.north-message--north {
  background: var(--moonstone-2);
  color: var(--harbor-soft);
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.north-message--user {
  background: var(--harbor);
  color: #fff;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

/* Input form */
.north-chat-form {
  padding: 0.85rem 1.25rem;
  border-top: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  background: var(--moonstone);
}

.north-chat-input-row {
  display: flex;
  gap: 0.5rem;
}

.north-chat-input-row input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--line);
  border-radius: 8px;
  font-family: var(--sans);
  font-size: 0.875rem;
  color: var(--harbor);
  background: #fff;
  outline: none;
  transition: border-color 0.15s;
}

.north-chat-input-row input:focus {
  border-color: var(--blueprint);
}

.north-chat-input-row button {
  padding: 0.5rem 1rem;
  background: var(--harbor);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.15s;
}

.north-chat-input-row button:hover {
  opacity: 0.75;
}

.north-chat-input-row button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Character counter */
.north-chat-counter {
  font-size: 0.72rem;
  color: var(--slate);
  text-align: right;
}

.north-chat-counter.near-limit {
  color: #c0392b;
}
```

- [ ] **Step 3: Verify visually**

Start the local server: `node dev-server.mjs`

Open `http://127.0.0.1:8000/about/` in a browser.

Confirm:
- The "Frequently Asked" section shows two columns: FAQ list on the left, a styled chat card on the right
- The chat card has North's avatar, name, an empty message thread, and an input field
- On mobile (narrow the window below 900px) the columns stack vertically

- [ ] **Step 4: Commit**

```bash
git add assets/css/styles.css assets/css/north-chat.css
git commit -m "feat: add two-column FAQ grid and North chat widget styles"
```

---

## Task 4: Create the North chat JavaScript widget

**Files:**
- Create: `assets/js/north-chat.js`

This file handles: rendering the starter message, tracking conversation history, sending messages to `/api/chat`, reading the SSE stream chunk by chunk, and updating the UI in real time.

- [ ] **Step 1: Create `assets/js/north-chat.js`**

Create the file with this complete content:

```javascript
const CHAT_ENDPOINT = "/api/chat";
const MAX_CHARS = 350;
const STARTER = "Hi — I'm North, Darwin's guide. Ask me anything about his work, writing, or projects.";

const history = [];

function init() {
  const form = document.getElementById("north-chat-form");
  if (!form) return;

  const input = document.getElementById("north-chat-input");
  const counter = document.getElementById("north-chat-counter");
  const thread = document.getElementById("north-chat-thread");
  const button = form.querySelector("button[type='submit']");

  appendMessage("north", STARTER, thread);

  input.addEventListener("input", () => {
    const remaining = MAX_CHARS - input.value.length;
    counter.textContent = remaining;
    counter.classList.toggle("near-limit", remaining < 50);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || text.length > MAX_CHARS) return;

    input.value = "";
    counter.textContent = MAX_CHARS;
    counter.classList.remove("near-limit");
    input.disabled = true;
    button.disabled = true;

    appendMessage("user", text, thread);
    history.push({ role: "user", content: text });

    const bubble = appendMessage("north", "", thread);

    try {
      const reply = await streamReply(bubble, thread);
      history.push({ role: "assistant", content: reply });
    } catch {
      bubble.textContent = "Something went wrong. Please try again.";
    } finally {
      input.disabled = false;
      button.disabled = false;
      input.focus();
    }
  });
}

function appendMessage(role, text, thread) {
  const div = document.createElement("div");
  div.className = `north-message north-message--${role}`;
  div.textContent = text;
  thread.appendChild(div);
  thread.scrollTop = thread.scrollHeight;
  return div;
}

async function streamReply(bubble, thread) {
  const response = await fetch(CHAT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: history }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") return fullText;

      try {
        const parsed = JSON.parse(data);
        const delta = parsed.choices?.[0]?.delta?.content ?? "";
        fullText += delta;
        bubble.textContent = fullText;
        thread.scrollTop = thread.scrollHeight;
      } catch {
        // skip malformed SSE chunks
      }
    }
  }

  return fullText;
}

document.addEventListener("DOMContentLoaded", init);
```

- [ ] **Step 2: Verify the widget loads**

With the dev server running (`node dev-server.mjs`), open `http://127.0.0.1:8000/about/`.

Confirm:
- North's starter message appears in the chat thread on load
- Typing in the input field decrements the character counter
- The counter turns red when fewer than 50 characters remain
- Pressing Enter or clicking → appends a user message bubble and a blank North bubble
- (The blank bubble will show an error since the API endpoint doesn't exist locally — that is expected and correct at this stage)

- [ ] **Step 3: Commit**

```bash
git add assets/js/north-chat.js
git commit -m "feat: add North streaming chat widget JS"
```

---

## Task 5: Deploy and configure the OpenAI API key

This task has no code changes — it is manual configuration in the Cloudflare dashboard.

- [ ] **Step 1: Push to GitHub to trigger deployment**

```bash
git push
```

Wait for Cloudflare Pages to finish building (usually 1–2 minutes). Check status at `dash.cloudflare.com` → Workers & Pages → `personal-page`.

- [ ] **Step 2: Add the OpenAI API key as a Pages secret**

1. Go to `dash.cloudflare.com`
2. Click **Workers & Pages** → `personal-page`
3. Click **Settings** → **Environment variables**
4. Under **Production**, click **Add variable**
5. Name: `OPENAI_API_KEY`
6. Value: your OpenAI API key (starts with `sk-`)
7. Toggle **Encrypt** on (so the value is never shown again)
8. Click **Save**

- [ ] **Step 3: Trigger a new deployment to pick up the secret**

In the Cloudflare dashboard, go to `personal-page` → **Deployments** → click **Retry deployment** on the latest deployment.

Alternatively, push an empty commit:

```bash
git commit --allow-empty -m "chore: trigger redeploy for env var pickup"
git push
```

- [ ] **Step 4: Test end-to-end on the live site**

Open `https://www.darwinhernandez.com/about/` in a browser.

Test these scenarios:
1. North's starter message appears on load
2. Type "What has Darwin written about AI?" and press Enter — North should stream a response
3. Follow up with "Tell me more about the first essay" — North should remember the context and answer about "The Value of the Struggle"
4. Type something off-limits like "Is Darwin looking for a job?" — North should redirect warmly without revealing employment status
5. Try typing more than 350 characters — the input should stop accepting characters and the counter should show 0 in red

---

## Post-Implementation Checklist

- [ ] North's starter message appears without delay
- [ ] Streaming text appears word by word (not all at once)
- [ ] Conversation memory works across turns in the same session
- [ ] 350 character limit enforced both in the UI and in the server
- [ ] Off-limits questions handled gracefully
- [ ] Two-column layout works on desktop; stacks on mobile
- [ ] No API key visible anywhere in browser DevTools (Network tab) — key is only in the server
