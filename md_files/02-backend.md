# Step 2 — Backend (Node.js + Claude API)

## File: backend/index.js

```js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { generateRoute } from './routes/generate.js'

dotenv.config()

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json({ limit: '2mb' }))

app.use('/api', generateRoute)

app.get('/health', (req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))
```

## File: backend/package.json

Add `"type": "module"` so ES imports work:

```json
{
  "name": "htmlify-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.20.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^4.18.0",
    "nanoid": "^5.0.0"
  }
}
```

## File: backend/routes/generate.js

```js
import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { getSystemPrompt, getUserPrompt } from '../prompts/index.js'

export const generateRoute = express.Router()

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

generateRoute.post('/generate', async (req, res) => {
  const { prompt, template } = req.body

  if (!prompt || !template) {
    return res.status(400).json({ error: 'prompt and template are required' })
  }

  // Set up SSE streaming
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const stream = client.messages.stream({
      model: 'claude-haiku-4-5',          // cheapest model
      max_tokens: 3000,                    // cap to save tokens
      system: getSystemPrompt(),           // cached system prompt
      messages: [
        {
          role: 'user',
          content: getUserPrompt(template, prompt)
        }
      ]
    })

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        // Send each chunk to frontend as SSE
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
    res.end()

  } catch (err) {
    console.error('Claude API error:', err.message)
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    res.end()
  }
})
```

## File: backend/prompts/index.js

```js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load skeleton HTML files once at startup (not per request)
function loadSkeleton(name) {
  const filePath = path.join(__dirname, '../../templates', `${name}.html`)
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8')
  }
  return null
}

// System prompt — kept short and cached
export function getSystemPrompt() {
  return `You are an expert at generating beautiful, self-contained HTML files.
Rules you must always follow:
- Output ONLY raw HTML. No markdown. No explanation. No code fences.
- Start your response with <!DOCTYPE html> and nothing before it.
- All CSS must be inline in a <style> tag inside <head>.
- No external dependencies. No CDN links. Fully self-contained.
- Use dark theme: background #0a0e1a, text #e2e8f0.
- Use clean professional fonts via Google Fonts import only.
- Make it beautiful enough to share with a manager or client.`
}

// Per-template user prompt
export function getUserPrompt(template, userInput) {
  const skeleton = loadSkeleton(template)

  const templateInstructions = {
    explainer: `Create a concept explainer HTML page about the following topic.
Include: summary card at top, SVG architecture diagram, color-coded sections,
component breakdown cards, a step-by-step flow, and a code example if relevant.`,

    report: `Create a professional status report HTML page.
Include: summary metrics cards at top, a table of completed items,
a risks section with color badges (green/amber/red), and a clean timeline.`,

    pr: `Create a PR explainer HTML page for the following change description.
Include: what changed and why, color-coded diff view (green adds / red removes),
inline annotations, key files changed, and a risk assessment badge.`,

    dashboard: `Create a data dashboard HTML page.
Include: metric cards at top, SVG charts for trends, a data table,
and color-coded status indicators.`,

    slideshow: `Create an arrow-key navigable slide deck HTML page.
Include 5-7 slides. Use left/right arrow keys to navigate.
Each slide should have a title, key points, and relevant visual.`,

    explorer: `Create a code/concept explorer HTML page.
Include: overview section, interactive expandable sections for each component,
a module map using SVG boxes and arrows, and a glossary.`
  }

  const instruction = templateInstructions[template] || templateInstructions.explainer

  if (skeleton) {
    // Token-efficient: fill skeleton instead of generating from scratch
    return `${instruction}

TOPIC / CONTENT:
${userInput}

Use the following HTML skeleton as your base structure.
Keep ALL existing CSS, layout structure, and JS exactly as-is.
Only replace placeholder text, data, and SVG content with real content about the topic.
Do not add new sections. Do not change fonts or colors.

SKELETON:
${skeleton}`
  }

  // Fallback: full generation (more tokens but works without skeleton)
  return `${instruction}

TOPIC / CONTENT:
${userInput}`
}
```
