import {
  callClaudeJson,
  ClaudeError,
  fallbackResponse,
  getApiKey,
  json,
  type ContentBlockParam,
} from './_lib/anthropic'
import { buildProfileSystemPrompt } from './_lib/prompts'
import {
  profileOutputJsonSchema,
  profileRequestSchema,
  profileResponseSchema,
} from './_lib/schemas'

const ANALYSIS_MODEL = process.env.ANTHROPIC_ANALYSIS_MODEL || 'claude-sonnet-4-6'

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  const apiKey = getApiKey()
  if (!apiKey) {
    return fallbackResponse('AI engine not configured')
  }

  let parsed
  try {
    parsed = profileRequestSchema.safeParse(await req.json())
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }
  if (!parsed.success) {
    return json({ error: 'Invalid request', detail: parsed.error.issues[0]?.message }, 400)
  }
  const body = parsed.data

  const content: ContentBlockParam[] = []
  if (body.imageBase64) {
    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: body.imageMediaType ?? 'image/jpeg',
        data: body.imageBase64,
      },
    })
  }
  content.push({
    type: 'text',
    text: body.imageBase64
      ? `Analyze this dating profile screenshot.${body.bioText ? ` Additional bio text provided by the user: ${body.bioText}` : ''}`
      : `Analyze this dating profile bio/prompt text:\n\n${body.bioText}`,
  })

  try {
    const raw = await callClaudeJson(apiKey, {
      model: ANALYSIS_MODEL,
      system: buildProfileSystemPrompt(),
      messages: [{ role: 'user', content }],
      maxTokens: 1500,
      jsonSchema: profileOutputJsonSchema,
    })

    // Clamp scores defensively (schema can't express numeric bounds).
    const c = raw as Record<string, unknown>
    for (const k of ['overallScore', 'photoScore', 'bioScore']) {
      if (typeof c[k] === 'number') c[k] = Math.min(100, Math.max(0, Math.round(c[k] as number)))
    }

    const validated = profileResponseSchema.safeParse(raw)
    if (!validated.success) {
      return fallbackResponse('Model returned unexpected shape')
    }
    return json(validated.data)
  } catch (err) {
    if (err instanceof ClaudeError) {
      return fallbackResponse(err.message)
    }
    return fallbackResponse('AI engine error')
  }
}
