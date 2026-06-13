import { fallbackResponse, json, type ContentBlockParam } from './_lib/anthropic'
import { anyProviderConfigured, generateJson } from './_lib/ai-provider'
import { buildProfileSystemPrompt } from './_lib/prompts'
import {
  profileOutputJsonSchema,
  profileRequestSchema,
  profileResponseSchema,
} from './_lib/schemas'

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  if (!anyProviderConfigured()) {
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
    const { data: raw } = await generateJson({
      kind: 'analysis',
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
  } catch {
    return fallbackResponse('AI engine error')
  }
}
