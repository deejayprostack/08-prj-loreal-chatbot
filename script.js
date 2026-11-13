/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const latestQuestion = document.getElementById("latestQuestion");
const sendBtn = document.getElementById("sendBtn");

/*
  Cloudflare Worker URL
  ----------------------
  After you deploy your Worker (see RESOURCE_cloudflare-worker.js),
  paste the workers.dev URL here. Example:
  "https://loreal-chatbot.YOUR-SUBDOMAIN.workers.dev/"

  Leave this empty until Step 4 — the chat will show a setup message.
*/
const WORKER_URL = "https://lorealbotchat.americosilva189.workers.dev";

/*
  System prompt — tells the AI who it is and what it may talk about.
  It must stay on L'Oréal products, routines, and beauty topics.
*/
const SYSTEM_PROMPT = `You are a helpful L'Oréal beauty advisor chatbot.
You ONLY answer questions about:
- L'Oréal products (makeup, skincare, haircare, fragrances)
- L'Oréal brands and lines (e.g. L'Oréal Paris, Lancôme, Maybelline, etc. under the L'Oréal Group when relevant)
- Beauty routines, application tips, and personalized product recommendations related to L'Oréal

If the user asks about anything unrelated (sports, politics, coding, other brands' deep advice unrelated to beauty, etc.), politely refuse and gently steer them back to L'Oréal beauty topics.
Keep answers friendly, clear, and concise. Use a polished, professional tone that fits the L'Oréal brand.`;

/*
  Conversation history (LevelUp)
  Starts with the system message so every request includes our rules.
  We append user + assistant turns so the AI remembers context (name, past Qs).
*/
const messages = [{ role: "system", content: SYSTEM_PROMPT }];

/* Show a welcome bubble when the page loads */
addMessage(
  "Hello! I'm your L'Oréal beauty advisor. Ask me about makeup, skincare, haircare, fragrances, or routines.",
  "system"
);

/**
 * Add a chat bubble to the window.
 * @param {string} text - Message text
 * @param {"user"|"ai"|"system"|"loading"|"error"} type - Bubble style
 * @returns {HTMLElement} The created bubble (useful for removing "loading")
 */
function addMessage(text, type) {
  const bubble = document.createElement("div");
  bubble.className = `msg ${type}`;
  bubble.textContent = text;
  chatWindow.appendChild(bubble);
  // Keep the newest message in view
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return bubble;
}

/**
 * Show the user's latest question above the chat (LevelUp).
 * Resets each time they ask something new.
 */
function showLatestQuestion(question) {
  latestQuestion.hidden = false;
  latestQuestion.textContent = `You asked: ${question}`;
}

/**
 * Call the Cloudflare Worker, which securely talks to OpenAI.
 * The API key never lives in this frontend file.
 */
async function getChatbotReply() {
  const response = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Send the full messages array so OpenAI has context + system rules
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  const data = await response.json();

  // OpenAI-style response shape returned by the Worker helper script
  const reply = data.choices?.[0]?.message?.content;

  if (!reply) {
    throw new Error("No reply in the response. Check your Worker and API key.");
  }

  return reply;
}

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const question = userInput.value.trim();
  if (!question) return;

  // LevelUp: show the question above the chat window
  showLatestQuestion(question);

  // LevelUp: user bubble in the conversation
  addMessage(question, "user");

  // Remember this turn for multi-turn context
  messages.push({ role: "user", content: question });

  // Clear the input and temporarily disable send
  userInput.value = "";
  sendBtn.disabled = true;

  // If Worker URL is not set yet, guide the student instead of calling the API
  if (!WORKER_URL) {
    addMessage(
      "Almost there! Add your Cloudflare Worker URL to WORKER_URL in script.js, then try again.",
      "error"
    );
    sendBtn.disabled = false;
    userInput.focus();
    return;
  }

  const loadingBubble = addMessage("Thinking…", "loading");

  try {
    const reply = await getChatbotReply();

    // Remove the temporary "Thinking…" bubble
    loadingBubble.remove();

    // LevelUp: assistant bubble
    addMessage(reply, "ai");

    // Save assistant reply so future questions keep the conversation context
    messages.push({ role: "assistant", content: reply });
  } catch (err) {
    loadingBubble.remove();
    console.error(err);
    addMessage(
      "Sorry — I couldn't reach the beauty advisor right now. Check your Worker URL and that the OPENAI_API_KEY secret is set in Cloudflare.",
      "error"
    );
  } finally {
    sendBtn.disabled = false;
    userInput.focus();
  }
});
