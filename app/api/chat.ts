import { fallbackResponse, json } from './_lib/anthropic'
import { anyProviderConfigured, generateJson } from './_lib/ai-provider'
import { buildChatSystemPrompt } from './_lib/prompts'
import { chatOutputJsonSchema, chatRequestSchema, chatResponseSchema } from './_lib/schemas'

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  if (!anyProviderConfigured()) {
    return fallbackResponse('AI engine not configured')
  }

  let parsed
  try {
    parsed = chatRequestSchema.safeParse(await req.json())
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }
  if (!parsed.success) {
    return json({ error: 'Invalid request', detail: parsed.error.issues[0]?.message }, 400)
  }
  const body = parsed.data

  // Messages must start with a user turn; if the persona opened the
  // conversation, anchor it with a synthetic user turn.
  const messages = [...body.messages]
  if (messages[0].role === 'assistant') {
    messages.unshift({
      role: 'user',
      content: '(You matched. She is about to see your profile — the conversation begins.)',
    })
  }

  try {
    const { data: raw } = await generateJson({
      kind: 'chat',
      system: buildChatSystemPrompt(body),
      messages,
      maxTokens: 800,
      jsonSchema: chatOutputJsonSchema,
    })

    // Clamp score/phase defensively before validation (schema can't express min/max).
    const candidate = raw as { analysis?: { score?: number }; suggestedPhase?: number }
    if (candidate?.analysis && typeof candidate.analysis.score === 'number') {
      candidate.analysis.score = Math.min(5, Math.max(1, Math.round(candidate.analysis.score)))
    }
    if (typeof candidate?.suggestedPhase === 'number') {
      candidate.suggestedPhase = Math.min(4, Math.max(0, Math.round(candidate.suggestedPhase)))
    }

    const validated = chatResponseSchema.safeParse(raw)
    if (!validated.success) {
      return fallbackResponse('Model returned unexpected shape')
    }
    return json(validated.data)
  } catch {
    return fallbackResponse('AI engine error')
  }
}
