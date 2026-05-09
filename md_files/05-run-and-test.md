# Step 5 — Run and Test

## Final folder structure check

```
htmlify/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   │       ├── PromptPanel.jsx
│   │       └── PreviewPanel.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── index.js
│   ├── package.json
│   ├── .env                    ← your API key here
│   └── routes/
│       └── generate.js
│       prompts/
│       └── index.js
│
└── templates/
    ├── explainer.html          ← skeleton files
    ├── report.html
    ├── pr.html
    ├── dashboard.html
    ├── slideshow.html
    └── explorer.html
```

## Start everything

Open 2 terminals:

```bash
# Terminal 1 — backend
cd htmlify/backend
node --watch index.js

# Terminal 2 — frontend
cd htmlify/frontend
npm run dev
```

Open browser: http://localhost:5173

## Test prompts to try first

Copy-paste these into the app to verify it works:

**Explainer template:**
```
Explain how Redis works — cover data structures,
persistence, pub/sub, and when to use it vs a database.
```

**Report template:**
```
Weekly engineering status report for a team building
a payments API. 3 features shipped, 1 delayed, 2 risks.
```

**PR template:**
```
PR that refactors the authentication middleware to use
JWT tokens instead of sessions. Affects 4 files.
Login, logout, refresh, and middleware validation changed.
```

## Verify token usage

After each generation, check your Anthropic console:
https://console.anthropic.com/usage

You should see:
- Input tokens: 300–800 (with skeleton)
- Output tokens: 2,000–3,500
- Cost: $0.01–0.02 per request (~₹1–2)

## Common errors and fixes

**CORS error in browser:**
```js
// Make sure backend/index.js has:
app.use(cors({ origin: 'http://localhost:5173' }))
```

**"Cannot find module" error:**
```json
// Make sure backend/package.json has:
{ "type": "module" }
```

**Streaming not working:**
```js
// Make sure frontend fetch reads the stream:
const reader = res.body.getReader()
// NOT: const data = await res.json()
```

**HTML shows as raw text in iframe:**
```jsx
// Use srcDoc not src:
<iframe srcDoc={html} />   // correct
<iframe src={html} />      // wrong
```

**API key not found:**
```bash
# Check .env is in backend/ folder not root
# Check variable name matches exactly:
ANTHROPIC_API_KEY=sk-ant-...
```

## What success looks like

1. You type a prompt and click Generate
2. The iframe starts filling with HTML within 2–3 seconds
3. You watch the page build live as Claude streams it
4. Download button saves a working .html file
5. Open that file in browser — it looks beautiful

That is your MVP working. Ship it.
