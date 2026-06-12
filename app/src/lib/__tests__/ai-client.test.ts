import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  __resetAIClientForTests,
  getAIChatTurn,
  getAIEngineStatus,
  getAIProfileAnalysis,
} from '../ai-client'
import { buildChatSystemPrompt, buildProfileSystemPrompt } from '../../../api/_lib/prompts'
import { chatRequestSchema, chatResponseSchema } from '../../../api/_lib/schemas'

const validChatRequest = {
  persona: {
    name: 'Luna',
    age: 22,
    archetype: 'The Free Spirit',
    bio: 'Energetic dancer.',
    difficulty: 'Beginner',
    scenario: 'Dating App Match',
  },
  phase: 0,
  messages: [{ role: 'user' as const, content: 'Hey! Salsa or bachata?' }],
}

const validChatResponse = {
  reply: 'Salsa, obviously 💃 You dance?',
  analysis: {
    subtext: 'She liked the specific question.',
    psychology: 'Specificity signals genuine interest.',
    advice: 'Keep referencing her actual interests.',
    score: 4,
  },
  suggestedPhase: 1,
}

function mockFetchOnce(status: number, body: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      })
    )
  )
}

beforeEach(() => __resetAIClientForTests())
afterEach(() => vi.unstubAllGlobals())

describe('ai-client fallback behavior', () => {
  it('returns the parsed response when the API succeeds', async () => {
    mockFetchOnce(200, validChatResponse)
    const result = await getAIChatTurn(validChatRequest)
    expect(result).toEqual(validChatResponse)
    expect(getAIEngineStatus()).toBe('live')
  })

  it('returns null and marks unavailable on a 503 fallback signal', async () => {
    mockFetchOnce(503, { fallback: true, reason: 'AI engine not configured' })
    const result = await getAIChatTurn(validChatRequest)
    expect(result).toBeNull()
    expect(getAIEngineStatus()).toBe('unavailable')
  })

  it('returns null on garbage JSON shape', async () => {
    mockFetchOnce(200, { totally: 'wrong' })
    const result = await getAIChatTurn(validChatRequest)
    expect(result).toBeNull()
    expect(getAIEngineStatus()).toBe('unavailable')
  })

  it('returns null on network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    const result = await getAIChatTurn(validChatRequest)
    expect(result).toBeNull()
  })

  it('skips the network entirely during the cooldown window', async () => {
    mockFetchOnce(503, { fallback: true })
    await getAIChatTurn(validChatRequest)

    const spy = vi.fn()
    vi.stubGlobal('fetch', spy)
    const second = await getAIChatTurn(validChatRequest)
    expect(second).toBeNull()
    expect(spy).not.toHaveBeenCalled()
  })

  it('validates profile analysis responses', async () => {
    mockFetchOnce(200, {
      overallScore: 72,
      photoScore: 80,
      bioScore: 60,
      firstImpression: 'Adventurous and warm.',
      strengths: ['Great travel photos'],
      fixes: ['Add a conversation hook to the bio'],
      openers: ['Where was that cliff photo taken?'],
      extractedBio: 'Love hiking and dogs.',
    })
    const result = await getAIProfileAnalysis({ bioText: 'Love hiking and dogs.' })
    expect(result?.overallScore).toBe(72)
    expect(getAIEngineStatus()).toBe('live')
  })
})

describe('chat request/response schemas', () => {
  it('accepts a valid request', () => {
    expect(chatRequestSchema.safeParse(validChatRequest).success).toBe(true)
  })

  it('rejects empty message history and out-of-range phase', () => {
    expect(
      chatRequestSchema.safeParse({ ...validChatRequest, messages: [] }).success
    ).toBe(false)
    expect(chatRequestSchema.safeParse({ ...validChatRequest, phase: 9 }).success).toBe(false)
  })

  it('rejects scores outside 1-5', () => {
    const bad = structuredClone(validChatResponse)
    bad.analysis.score = 11
    expect(chatResponseSchema.safeParse(bad).success).toBe(false)
  })
})

describe('prompt builders', () => {
  it('embeds persona, difficulty behavior and scenario brief', () => {
    const prompt = buildChatSystemPrompt({
      ...chatRequestSchema.parse(validChatRequest),
      scenarioBrief: 'Revive a conversation that went quiet two days ago.',
    })
    expect(prompt).toContain('Luna')
    expect(prompt).toContain('22-year-old')
    expect(prompt).toContain('The Free Spirit')
    expect(prompt).toContain('warm, forgiving and encouraging') // Beginner behavior
    expect(prompt).toContain('Revive a conversation')
    expect(prompt).toContain('never mention being an AI')
  })

  it('keeps the profile prompt grounded against invention', () => {
    const prompt = buildProfileSystemPrompt()
    expect(prompt).toContain('Never invent details')
    expect(prompt).toContain('photoScore to 50')
  })
})
