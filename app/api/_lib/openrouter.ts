import type { ContentBlockParam } from './anthropic'

// OpenAI-compatible client for OpenRouter (https://openrouter.ai).
// Lets the project pick from many models (GPT, Gemini, Llama, Claude, …)
// behind a single key. Server-side only — never imported by the browser.

const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

export class OpenRouterError extends Error {
  constructor(
    message: string,
    public status: number,
    public retryable: boolean
  ) {
    super(message)
  }
}

export function getOpenRouterKey(): string | null {
  const key = process.env.OPENROUTER_API_KEY
  return key && key.trim() !== '' ? key.trim() : null
}

interface OpenRouterCallOptions {
  model: string
  system: string
  messages: { role: 'user' | 'assistant'; content: string | ContentBlockParam[] }[]
  maxTokens: number
  jsonSchema: object
}

type OpenAIContent =
  | string
  | ({ type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } })[]

function toOpenAIContent(content: string | ContentBlockParam[]): OpenAIContent {
  if (typeof content === 'string') return content
  return content.map((block) =>
    block.type === 'image' && block.source
      ? {
          type: 'image_url' as const,
          image_url: { url: `data:${block.source.media_type};base64,${block.source.data}` },
        }
      : { type: 'text' as const, text: block.text ?? '' }
  )
}

// Some models wrap JSON in ```json fences despite instructions — strip them.
function stripFences(text: string): string {
  const trimmed = text.trim()
  if (trimmed.startsWith('```')) {
    return trimmed
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim()
  }
  return trimmed
}

export async function callOpenRouterJson(
  apiKey: string,
  opts: OpenRouterCallOptions
): Promise<unknown> {
  const schemaHint = `\n\nIMPORTANT: Respond with ONLY a single valid JSON object — no markdown, no code fences, no commentary. The object must conform exactly to this JSON Schema:\n${JSON.stringify(
    opts.jsonSchema
  )}`

  const messages = [
    { role: 'system', content: opts.system + schemaHint },
    ...opts.messages.map((m) => ({ role: m.role, content: toOpenAIContent(m.content) })),
  ]

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://datingcoach.site',
      'X-Title': 'DatingCoach',
    },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: opts.maxTokens,
      messages,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    let detail = ''
    try {
      const body = (await res.json()) as { error?: { message?: string } }
      detail = body?.error?.message ?? ''
    } catch {
      /* non-JSON error body */
    }
    const retryable = res.status === 429 || res.status >= 500
    throw new OpenRouterError(`OpenRouter ${res.status}: ${detail}`, res.status, retryable)
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string }; finish_reason?: string }[]
  }
  const text = data.choices?.[0]?.message?.content
  if (!text) {
    throw new OpenRouterError('Empty model response', 502, true)
  }
  return JSON.parse(stripFences(text))
}
