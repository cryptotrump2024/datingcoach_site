// Minimal raw-fetch client for the Anthropic Messages API (no SDK dependency).
// Used only inside Vercel serverless functions — never shipped to the browser.

const API_URL = 'https://api.anthropic.com/v1/messages'
const API_VERSION = '2023-06-01'

export interface ContentBlockParam {
  type: 'text' | 'image'
  text?: string
  source?: { type: 'base64'; media_type: string; data: string }
}

export interface ClaudeCallOptions {
  model: string
  system: string
  messages: { role: 'user' | 'assistant'; content: string | ContentBlockParam[] }[]
  maxTokens: number
  jsonSchema: object
}

export class ClaudeError extends Error {
  constructor(
    message: string,
    public status: number,
    public retryable: boolean
  ) {
    super(message)
  }
}

export function getApiKey(): string | null {
  const key = process.env.ANTHROPIC_API_KEY
  return key && key.trim() !== '' ? key.trim() : null
}

/**
 * Calls the Messages API with structured outputs (output_config.format) so the
 * response text is guaranteed-valid JSON for the given schema. Returns the
 * parsed object; the caller validates with zod.
 */
export async function callClaudeJson(apiKey: string, opts: ClaudeCallOptions): Promise<unknown> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': API_VERSION,
    },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: opts.maxTokens,
      system: opts.system,
      messages: opts.messages,
      output_config: { format: { type: 'json_schema', schema: opts.jsonSchema } },
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
    throw new ClaudeError(`Anthropic API ${res.status}: ${detail}`, res.status, retryable)
  }

  const data = (await res.json()) as {
    stop_reason?: string
    content?: { type: string; text?: string }[]
  }

  if (data.stop_reason === 'refusal') {
    throw new ClaudeError('Model declined the request', 422, false)
  }
  if (data.stop_reason === 'max_tokens') {
    throw new ClaudeError('Response truncated (max_tokens)', 502, true)
  }

  const text = data.content?.find((b) => b.type === 'text')?.text
  if (!text) {
    throw new ClaudeError('Empty model response', 502, true)
  }
  return JSON.parse(text)
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/** Standard "no key / upstream failed" reply that tells the client to use the local engine. */
export function fallbackResponse(reason: string): Response {
  return json({ fallback: true, reason }, 503)
}
