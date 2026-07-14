# Harborview AI Chat Widget — Deployment Guide

This is a self-contained AI chat widget: a static HTML page (`index.html`) with a
floating chat bubble, plus a serverless backend (`api/chat.js`) that securely
calls Claude's API. Total cost: $0 (Vercel free tier + Anthropic API usage,
which is pennies for a demo).

## Files
- `index.html` — the chat widget + a placeholder landing page. Replace the
  `.page-content` section with your real Harborview page content, or just
  copy the widget code (the `<button id="chat-launcher">` through the closing
  `</script>` tag) into your existing site.
- `api/chat.js` — the backend function. Runs on Vercel, keeps your API key
  hidden from visitors.

## Step 1: Push this to GitHub
1. Create a free GitHub account if you don't have one (github.com)
2. Create a new repository, e.g. `harborview-chatbot`
3. Upload these three files (`index.html`, `api/chat.js`, `package.json`) —
   either drag-and-drop via GitHub's web uploader, or use git if you're
   comfortable with it

## Step 2: Deploy on Vercel
1. Go to vercel.com → sign in with your GitHub account
2. Click **Add New → Project**
3. Select the `harborview-chatbot` repo you just created
4. Before clicking Deploy, go to **Environment Variables** and add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: (paste your actual Claude API key from console.anthropic.com)
5. Click **Deploy**
6. Vercel gives you a live URL like `https://harborview-chatbot.vercel.app`

## Step 3: Test it
1. Open your new Vercel URL
2. Click the chat bubble (bottom right)
3. Try: "I'm looking to buy a home, budget around $450k, want to move in 3
   months" — the assistant should follow up naturally

## Step 4: Embed it on your actual site
If your real Harborview page lives elsewhere (e.g. your Lovable-built
funnel), you don't need the whole `index.html` — just copy:
- The CSS inside `<style>` (the chat-related rules, not `.page-content`)
- The HTML block for `#chat-launcher` and `#chat-window`
- The `<script>` block

...into your existing page. Then update the `API_URL` constant in the script
to point at your deployed Vercel backend, e.g.:

```js
const API_URL = "https://harborview-chatbot.vercel.app/api/chat";
```

## Cost notes
- Vercel free tier: plenty of headroom for a demo/portfolio project
- Anthropic API: billed per token. A short qualifying conversation (a few
  exchanges) costs a fraction of a cent. Set a low spending limit in your
  Anthropic console (Settings → Billing) if you want a hard cap, e.g. $5.

## Customizing the assistant's behavior
Open `api/chat.js` and edit the `system` prompt (the long string inside the
`system:` field). This controls tone, what questions it asks, and how it
qualifies leads. Adjust it to match Buyer vs Seller flows, or add more detail
about Harborview's actual service area.
