#!/usr/bin/env node
// Direct end-to-end test of the OpenRouter AI path: real API call with the
// configured key + cheap model, validating the persona reply + coaching JSON.
// Usage: node scripts/test-ai.mjs   (reads app/.env.local)

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

if (existsSync(join(root, 'app/.env.local'))) {
  for (const line of readFileSync(join(root, 'app/.env.local'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2]
  }
}

const key = process.env.OPENROUTER_API_KEY
if (!key) {
  console.error('No OPENROUTER_API_KEY')
  process.exit(1)
}
const model = process.argv[2] || process.env.OPENROUTER_CHAT_MODEL || 'openai/gpt-4o-mini'

const schema = {
  type: 'object',
  properties: {
    reply: { type: 'string' },
    analysis: {
      type: 'object',
      properties: {
        subtext: { type: 'string' },
        psychology: { type: 'string' },
        advice: { type: 'string' },
        score: { type: 'integer' },
      },
      required: ['subtext', 'psychology', 'advice', 'score'],
    },
    suggestedPhase: { type: 'integer' },
  },
  required: ['reply', 'analysis', 'suggestedPhase'],
}

const system = `You are playing a 22-year-old woman named Luna (archetype: The Free Spirit) texting a man on a dating app, AND a separate dating coach analyzing his last message (subtext/psychology/advice + score 1-5). Difficulty Beginner: warm and encouraging. Reply in character; never mention being an AI.

IMPORTANT: Respond with ONLY one valid JSON object (no markdown/fences) conforming to this schema:
${JSON.stringify(schema)}`

const t0 = Date.now()
const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${key}`,
    'X-Title': 'DatingCoach',
    'HTTP-Referer': 'https://datingcoach.site',
  },
  body: JSON.stringify({
    model,
    max_tokens: 800,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      {
        role: 'user',
        content:
          "Two truths and a lie: I make great pasta, I've never seen Titanic, I once won a salsa contest",
      },
    ],
  }),
})

console.log('model:', model, '| http', res.status, '|', Date.now() - t0, 'ms')
if (!res.ok) {
  console.error('ERROR body:', (await res.text()).slice(0, 400))
  process.exit(1)
}
const data = await res.json()
const text = data.choices?.[0]?.message?.content ?? ''
let obj
try {
  obj = JSON.parse(text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim())
} catch (e) {
  console.error('JSON parse FAILED. Raw:', text.slice(0, 300))
  process.exit(1)
}
const ok =
  typeof obj.reply === 'string' &&
  obj.analysis &&
  typeof obj.analysis.subtext === 'string' &&
  typeof obj.analysis.score === 'number' &&
  typeof obj.suggestedPhase === 'number'
console.log('valid shape:', ok)
console.log('reply:', obj.reply)
console.log('score:', obj.analysis?.score, '| advice:', obj.analysis?.advice)
console.log('usage:', JSON.stringify(data.usage))
process.exit(ok ? 0 : 1)
