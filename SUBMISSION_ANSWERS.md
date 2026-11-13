# Project 8 — Submission Answers
Copy these into your Google Doc, then File → Download → PDF and upload to HQ.

---

## Requirements checklist (code / setup)

| Requirement | Status |
|---|---|
| L'Oréal logo on the page | Done |
| Branded colors / fonts / layout | Done (black, cream, gold; Montserrat + Cormorant Garamond) |
| System prompt limited to L'Oréal products / routines / recommendations | Done |
| Capture input → send via API → show reply | Done |
| Politely refuse off-topic questions | Done (in system prompt) |
| Cloudflare Worker + `OPENAI_API_KEY` secret | Done (`lorealbotchat.americosilva189.workers.dev`) |
| Frontend calls Worker (not OpenAI directly) | Done — no API key in the repo |
| LevelUp: conversation history | Done |
| LevelUp: display latest user question | Done |
| LevelUp: chat bubbles UI | Done |
| Responsive styles | Done (mobile media query) |
| Commit / push / GitHub Pages live link | **Still needed** — see Q1 below |

Note: The brief mentions a temporary `secrets.js`. We kept the key **only** in Cloudflare Secrets instead, which is the safer approach and matches the “Secure Your API Key” step. Do **not** put `sk-...` in the repo.

---

## 1. Paste your project’s URL here

**TODO — you still need this before you submit.**

After you push the project and turn on GitHub Pages, paste a link like:

`https://YOUR-GITHUB-USERNAME.github.io/08-prj-loreal-chatbot-main`

(Not the repo URL, not Codespaces, not localhost.)

If you want help creating the repo + GitHub Pages next, say so.

---

## 1B. Did you do any of the LevelUps?

Yes — all three LevelUps:

1. **Maintain Conversation History (10 pts)** — The chatbot keeps a `messages` array with the system prompt plus every user/assistant turn, so it can remember context (like a name or earlier questions) across the chat.
2. **Display User Question (5 pts)** — Each new question appears in a “You asked: …” strip above the chat window and updates with every new message.
3. **Chat Conversation UI (10 pts)** — User and assistant replies use distinct message bubbles (black user bubbles on the right, light assistant bubbles on the left).

---

## 2. Reflect on the process of creating an AI-powered chatbot. What part of the process required the most effort or problem-solving? How did you address it? Was there anything that surprised you along the way? (10 pt)

The part that took the most problem-solving was connecting the frontend to OpenAI **securely**. At first it was tempting to put the API key in a JavaScript file the browser loads, but that would expose the key on GitHub. I solved it by deploying a Cloudflare Worker from the provided helper script and storing `OPENAI_API_KEY` as a Worker secret. The chatbot only talks to my Worker URL; the Worker talks to OpenAI.

Another real snag was browser caching: after I added the Worker URL to `script.js`, the page still showed an old “add your Worker URL” message until a hard refresh. That surprised me — the backend was already working, but the browser was serving stale JavaScript. Clearing/cache-busting the script fixed it.

I was also surprised by how much the **system prompt** shapes the product. One clear prompt made the bot stay on L'Oréal beauty topics and politely refuse off-topic questions without extra UI logic.

---

## 3. How would you talk about this project when networking with recruiters or professionals? Write a few talking points you might use in an interview or networking setting to explain what you built and why it matters. (10 pt)

If I were introducing this project in an interview or networking conversation, I’d keep it concrete and outcome-focused:

**The one-liner:**  
“I built an AI-powered L'Oréal beauty advisor chatbot that helps users explore makeup, skincare, haircare, and fragrance products, then get personalized routine recommendations in a real chat interface.”

**What I actually built (so it doesn’t sound vague):**  
- A responsive front-end chat experience with branded UI, message bubbles, and a clear input/send flow.  
- A backend proxy using a Cloudflare Worker that receives the conversation, calls OpenAI’s Chat Completions API, and returns the assistant’s reply.  
- A carefully written system prompt so the bot stays on beauty/L'Oréal topics and politely redirects off-topic questions.  
- Conversation history so the assistant can remember earlier details (like a user’s concerns or preferences) and respond more naturally over multiple turns.

**Why it matters (the “so what” for recruiters):**  
- It shows I can take an AI idea from concept to a working product, not just experiment in a playground.  
- It shows I understand modern web + AI architecture: the browser shouldn’t hold secrets, so I kept the API key in Cloudflare and only exposed a Worker endpoint.  
- It shows product thinking — I cared about UX (chat bubbles, latest-question context, loading/error states) as much as the model call.  
- It’s relevant to real company needs: brands want AI that feels helpful, on-brand, and trustworthy, especially for customer discovery and education.

**A short story I could tell:**  
“The hardest part wasn’t getting a reply from the model — it was doing it the right way. Early on, putting a key in front-end JavaScript would have been faster, but unsafe. So I set up Cloudflare Secrets, pointed the app at my Worker, and verified the full path worked end to end. That taught me that shipping AI features is as much about security and reliability as it is about prompting.”

**Skills this demonstrates:** HTML/CSS/JavaScript, async API integration, prompt design, conversational UX, cloud deployment basics, and API key hygiene.

---

## 4. Imagine you’re sharing this project with a L’Oréal recruiter. What would you highlight about your chatbot? How does it show your creativity, technical skills, or understanding of L’Oréal’s brand? (10 pt)

If I were showing this to a L'Oréal recruiter, I wouldn’t lead with “I used OpenAI.” I’d lead with brand experience and consumer value, then back it up with the technical choices.

**Brand & creativity**  
I designed the chatbot to feel like a L'Oréal beauty advisor, not a generic tech demo. The interface uses the L'Oréal logo, a black / cream / gold palette, and elegant typography so the first impression matches L'Oréal’s polished identity. Creatively, I focused on the moments that make chat feel intentional: distinct user vs. assistant bubbles, a “You asked…” line that keeps the current question visible, and a tone in the system prompt that sounds helpful and premium rather than robotic. The goal was for someone to open the page and immediately feel, “This belongs to L'Oréal.”

**Understanding of L'Oréal**  
L'Oréal is about helping people discover beauty with confidence across categories — makeup, skincare, haircare, fragrance — and often across many product choices. My chatbot mirrors that by guiding users toward products and routines, answering “what order should I apply things?” style questions, and offering personalized suggestions. Just as important, it knows when *not* to answer: if someone asks something unrelated, it politely steers back to beauty. That reflects brand discipline — a L'Oréal experience should stay relevant, useful, and on-message.

**Technical skills**  
On the engineering side, I’d highlight three things:
1. **Secure AI integration** — The OpenAI key is stored as a Cloudflare Worker secret; the public site never sees it. That shows I understand production-minded AI work.  
2. **Conversation architecture** — I send a full `messages` history (system + user + assistant turns), so recommendations can build on earlier context instead of treating every question as isolated.  
3. **Front-end craft** — Clean HTML structure, branded CSS, responsive layout, loading/error handling, and a chat UI that feels familiar to people who already message on their phones.

**The takeaway I’d want them to remember**  
This project shows I can blend brand storytelling with practical AI engineering: create something that looks and sounds like L'Oréal, helps a real beauty shopper, and is built with security and UX in mind — the same combination consumer beauty brands need as they explore AI.
