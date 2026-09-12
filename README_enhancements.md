# Chronioñ — Search engine enhancements

This branch adds several optional components to improve the Chronioñ search experience without committing any API keys.

Included files:

- `auto_responses.json` — canned replies for a client-side assistant.
- `chat_widget.html` — simple chat UI that loads `chatbot.js` and uses `auto_responses.json`.
- `chatbot.js` — rule-based client chatbot with an optional AI fallback to `/api/chat`.
- `server_proxy.js` — an example Node/Express proxy with safe stubs for `/api/search`, `/api/summary` and `/api/chat` (AI requires `OPENAI_API_KEY` in env).

How to try locally

1. Clone repo and checkout this branch (`feature/search-enhancements`).

2. Serve the static files (e.g. `chat_widget.html`) using any static server or put them in your Chronioñ site root.

3. To run the proxy server locally (optional):

```bash
# install deps
npm install express node-fetch jsdom body-parser
node server_proxy.js
```

This starts the proxy at `http://localhost:3000` and exposes:
- `GET /api/search?q=...` — simple sample search (local index).
- `GET /api/summary?url=...` — extracts a short excerpt from a URL.
- `POST /api/chat` — calls OpenAI if `OPENAI_API_KEY` is set as environment variable.

Notes and next steps

- These components are intentionally lightweight and do not include any API keys.
- Recommended next steps:
  - Add a proper search index (SQLite FTS or MeiliSearch) and replace the `sampleIndex` in `server_proxy.js`.
  - Add persistent storage for user history and suggestions (localStorage or server DB).
  - Add caching (Redis) if you enable external API calls.
  - If you connect an AI provider, store the key in environment variables and never commit it to the repo.

If you want, I can open a Pull Request with these files on `feature/search-enhancements` and we can iterate from there.
