# 💌 Be My Valentine

A tiny, cute Valentine web page: open the envelope, read the letter, and try clicking “No” (spoiler: it’s… complicated 😉).

## Demo (GitHub Pages)

Enable GitHub Pages and the site will be available at:

`https://<username>.github.io/<repo>/`

**Setup:**

1. Go to **Settings → Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `main`
4. **Folder:** `/ (root)`
5. Save

## Features

- Animated envelope + letter reveal
- Typewriter effect for the question
- Floating hearts in the background
- “No” button escapes your attempts
- “Yes” swaps to an accepted state (without `innerHTML`)
- Supports `prefers-reduced-motion`

## Project Structure

├── index.html
├── style.css
├── app.js
└── assets/
├── bubuRead.gif
├── bubuLove.gif
└── duduFlowers.gif

## 🚀 Run Locally

No build step needed.

### Option A: Open the file directly

Just open `index.html` in your browser.

### Option B: Use a local server (recommended)

Some browsers are picky with local assets when opening files directly.

**VS Code Live Server** is the easiest, or run a quick server:

```bash
# Python 3
python -m http.server 8080
```
