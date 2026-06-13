import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  anyProviderConfigured,
  generateJson,
  NoProviderError,
  providerChain,
} from '../../../api/_lib/ai-provider'

const ENV_KEYS = ['ANTHROPIC_API_KEY', 'OPENROUTER_API_KEY', 'AI_PRIMARY']
const saved: Record<string, string | undefined> = {}

beforeEach(() => {
  for (const k of ENV_KEYS) saved[k] = process.env[k]
  for (const k of ENV_KEYS) delete process.env[k]
})
afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k]
    else process.env[k] = saved[k]
  }
  vi.unstubAllGlobals()
})

const chatJson = JSON.stringify({
  reply: 'hey',
  analysis: { subtext: 's', psychology: 'p', advice: 'a', score: 4 },
  suggestedPhase: 1,
})

function fetchByHost(handlers: { anthropic?: () => Response; openrouter?: () => Response }) {
  return vi.fn(async (url: string | URL) => {
    const u = String(url)
    if (u.includes('anthropic') && handlers.anthropic) return handlers.anthropic()
    if (u.includes('openrouter') && handlers.openrouter) return handlers.openrouter()
    throw new Error(`unexpected fetch to ${u}`)
  })
}

function ok(body: unknown) {
  return new Response(JSON.stringify(body), { status: 200 })
}

describe('providerChain', () => {
  it('is empty with no keys', () => {
    expect(providerChain()).toEqual([])
    expect(anyProviderConfigured()).toBe(false)
  })

  it('filters to configured providers and honors AI_PRIMARY order', () => {
    process.env.ANTHROPIC_API_KEY = 'a'
    process.env.OPENROUTER_API_KEY = 'o'
    process.env.AI_PRIMARY = 'openrouter'
    expect(providerChain()).toEqual(['openrouter', 'anthropic'])
    process.env.AI_PRIMARY = 'anthropic'
    expect(providerChain()).toEqual(['anthropic', 'openrouter'])
    delete process.env.ANTHROPIC_API_KEY
    expect(providerChain()).toEqual(['openrouter'])
  })
})

describe('generateJson', () => {
  const opts = {
    kind: 'chat' as const,
    system: 'sys',
    messages: [{ role: 'user' as const, content: 'hi' }],
    maxTokens: 200,
    jsonSchema: { type: 'object' },
  }

  it('throws NoProviderError when nothing configured', async () => {
    await expect(generateJson(opts)).rejects.toBeInstanceOf(NoProviderError)
  })

  it('uses OpenRouter when it is primary', async () => {
    process.env.OPENROUTER_API_KEY = 'o'
    process.env.AI_PRIMARY = 'openrouter'
    vi.stubGlobal(
      'fetch',
      fetchByHost({ openrouter: () => ok({ choices: [{ message: { content: chatJson } }] }) })
    )
    const result = await generateJson(opts)
    expect(result.provider).toBe('openrouter')
    expect((result.data as { reply: string }).reply).toBe('hey')
  })

  it('falls through to the backup provider when the primary errors', async () => {
    process.env.OPENROUTER_API_KEY = 'o'
    process.env.ANTHROPIC_API_KEY = 'a'
    process.env.AI_PRIMARY = 'openrouter'
    vi.stubGlobal(
      'fetch',
      fetchByHost({
        openrouter: () => new Response('{"error":{"message":"boom"}}', { status: 500 }),
        anthropic: () => ok({ stop_reason: 'end_turn', content: [{ type: 'text', text: chatJson }] }),
      })
    )
    const result = await generateJson(opts)
    expect(result.provider).toBe('anthropic')
  })
})
