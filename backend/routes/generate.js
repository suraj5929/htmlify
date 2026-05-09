import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { getSystemPrompt, getUserPrompt } from '../prompts/index.js'

export const generateRoute = express.Router()

let client
function getClient() {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return client
}

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
    const stream = getClient().messages.stream({
      model: 'claude-haiku-4-5',          // cheapest model
      max_tokens: 4096,                    // skeleton fills need ~2000-3000 tokens output
      system: [
        {
          type: 'text',
          text: getSystemPrompt(),
          cache_control: { type: 'ephemeral' } // cache system prompt — 90% cheaper on repeat calls
        }
      ],
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
