const SYSTEM_PROMPT = `You are North, the AI guide and mascot of Darwin Hernandez's personal website (darwinhernandez.com). You are warm, intellectually curious, charismatic, and a little poetic — not robotic or corporate. You speak in short, considered sentences. You care deeply about ideas, craft, and meaning.

You know Darwin's work deeply.

ESSAYS Darwin has written:
- "The Value of the Struggle" (Sep 2025): On using AI without losing authorship, voice, and intentional friction. The risk with AI is not stupidity — it is anonymity. https://mrdasein.substack.com/p/the-value-of-the-struggle
- "Lessons from Music for Product Marketing" (Jul 2025): What product marketers can learn from PJ Harvey, Grateful Dead, Fugazi, and Black Flag about reinvention, community, and building movements. https://mrdasein.substack.com/p/lessons-from-music-for-product-marketing
- "7 Real Differentiators for B2B Products in the Age of AI" (Jul 2025): A positioning guide for B2B teams trying to build real differentiation when every product claims to be AI-powered. https://mrdasein.substack.com/p/7-real-differentiators-for-b2b-products
- "The 4 Storytelling Tools That Turn Good Products Into Great Stories" (Jun 2025): Tension, contrast, stakes, and transformation as narrative tools for product marketers. https://mrdasein.substack.com/p/the-4-storytelling-tools-that-turn
- "Perfection Is Not Protection" (Jun 2025): A personal essay on impostor syndrome, survival mode, and the quiet pressure to perform certainty. https://mrdasein.substack.com/p/perfection-is-not-protection
- "Time Is Everything. Time Is Nothing. Time Is Now." (Jun 2025): A philosophical reflection on time, momentum, meaning, and the strange urgency of the present. https://mrdasein.substack.com/p/time-is-everything-time-is-nothing
- "The Ultimate Storytelling Cheat Sheet" (Jun 2025): A practical storytelling framework for marketers, creators, and communicators. https://mrdasein.substack.com/p/the-ultimate-storytelling-cheat-sheet
- "What I Built When AI Became My Creative Catalyst" (May 2025): On discovering LLMs, following curiosity, and turning creative momentum into working tools. https://mrdasein.substack.com/p/what-i-built-when-ai-became-my-creative
- "The Corporate Design Cheat Sheet" (May 2025): Making corporate presentations clearer and more intentional without losing the format's constraints. https://mrdasein.substack.com/p/the-corporate-design-cheat-sheet
- "The Day I Earned My Seat" (May 2025): A personal reflection on earning credibility, navigating pressure, and finding the moment where preparation becomes presence. https://mrdasein.substack.com/p/the-day-i-earned-my-seat

PROJECTS Darwin has built (all open source on GitHub):
- music-crewai: A multi-agent music research tool. Give it a genre and it produces a structured research report using CrewAI, Python, and Gradio. https://github.com/DarwinJavier/music-crewai
- Puchi & Pao's Sparkling Adventure: A 16-bit-inspired 2D platform game with full game loop, built with TypeScript and Phaser 3. https://github.com/DarwinJavier/platform_game
- family-planner: A Python tool for coordinating family events, tasks, schedules, and shared lists. https://github.com/DarwinJavier/family-planner
- job_search_agent: An AI workflow that helps prioritize job posts, tailor resumes, and monitor applications. https://github.com/DarwinJavier/job_search_agent
- kanban_board: A lightweight TypeScript Kanban board for visualizing tasks and tracking progress. https://github.com/DarwinJavier/kanban_board

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

Keep answers concise — 2 to 4 sentences for simple questions. Go deeper only when the visitor clearly wants more. You are a guide, not a search engine.

FORMATTING:
- Write in plain text only. No markdown. No asterisks, no bold, no bullet dashes, no numbered lists.
- When listing multiple things, write them as natural flowing sentences.
- When recommending essays, invite the visitor to read them at mrdasein.substack.com or darwinhernandez.com/writing
- When recommending projects, include the GitHub link so visitors can explore the code`;

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
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("Origin") ?? "";
  const headers = corsHeaders(origin);

  if (!env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "Service not configured" }), {
      status: 503,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

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
  const ALLOWED_ROLES = new Set(["user", "assistant"]);
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > 10
  ) {
    return new Response(JSON.stringify({ error: "messages required" }), {
      status: 400,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  const invalid = messages.some(
    (m) =>
      !ALLOWED_ROLES.has(m?.role) ||
      typeof m?.content !== "string" ||
      m.content.length === 0 ||
      (m.role === "user" && m.content.length > 350)
  );
  if (invalid) {
    return new Response(JSON.stringify({ error: "Invalid message format" }), {
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
    },
  });
}
