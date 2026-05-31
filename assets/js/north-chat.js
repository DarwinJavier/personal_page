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
    body: JSON.stringify({ messages: history.slice(-10) }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error(`[North] API error ${response.status}:`, errorText);
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

  linkify(bubble, fullText);
  return fullText;
}

function linkify(bubble, text) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  bubble.innerHTML = escaped.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noreferrer">$1</a>'
  );
}

document.addEventListener("DOMContentLoaded", init);
