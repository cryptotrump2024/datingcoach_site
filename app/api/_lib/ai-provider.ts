import { callClaudeJson, getApiKey as getAnthropicKey, type ContentBlockParam } from './anthropic'
import { callOpenRouterJson, getOpenRouterKey } from './openrouter'

// Provider abstraction: try AI providers in a configured order, falling
// through to the next on failure. Anthropic and OpenRouter are interchangeable
// backups for each other; if none is configured the caller returns a 503 so
// the client uses its built-in offline practice engine.

export type AIProvider = 'anthropic' | 'openrouter'

export class NoProviderError extends Error {
  constructor() {
    super('No AI provider configured')
  }
}

const CHAT_MODELS = {
  anthropic: () => process.env.ANTHROPIC_CHAT_MODEL || 'claude-haiku-4-5',
  openrouter: () => process.env.OPENROUTER_CHAT_MODEL || 'openai/gpt-4o-mini',
}

const ANALYSIS_MODELS = {
  anthropic: () => process.env.ANTHROPIC_ANALYSIS_MODEL || 'claude-sonnet-4-6',
  openrouter: () => process.env.OPENROUTER_ANALYSIS_MODEL || 'openai/gpt-4o-mini',
}

function keyFor(provider: AIProvider): string | null {
  return provider === 'anthropic' ? getAnthropicKey() : getOpenRouterKey()
}

/** Ordered list of providers that actually have a key configured. */
export function providerChain(): AIProvider[] {
  const primary = (process.env.AI_PRIMARY || 'anthropic').toLowerCase()
  const order: AIProvider[] =
    primary === 'openrouter' ? ['openrouter', 'anthropic'] : ['anthropic', 'openrouter']
  return order.filter((p) => keyFor(p) !== null)
}

export function anyProviderConfigured(): boolean {
  return providerChain().length > 0
}

export interface GenerateOptions {
  system: string
  messages: { role: 'user' | 'assistant'; content: string | ContentBlockParam[] }[]
  maxTokens: number
  jsonSchema: object
  kind: 'chat' | 'analysis'
}

export interface GenerateResult {
  data: unknown
  provider: AIProvider
}

/**
 * Generate a JSON object from the first working provider in the chain.
 * Throws NoProviderError when nothing is configured, or the last provider
 * error when every configured provider failed.
 */
export async function generateJson(opts: GenerateOptions): Promise<GenerateResult> {
  const chain = providerChain()
  if (chain.length === 0) throw new NoProviderError()

  const models = opts.kind === 'chat' ? CHAT_MODELS : ANALYSIS_MODELS
  let lastError: unknown

  for (const provider of chain) {
    const apiKey = keyFor(provider)!
    try {
      const data =
        provider === 'anthropic'
          ? await callClaudeJson(apiKey, {
              model: models.anthropic(),
              system: opts.system,
              messages: opts.messages,
              maxTokens: opts.maxTokens,
              jsonSchema: opts.jsonSchema,
            })
          : await callOpenRouterJson(apiKey, {
              model: models.openrouter(),
              system: opts.system,
              messages: opts.messages,
              maxTokens: opts.maxTokens,
              jsonSchema: opts.jsonSchema,
            })
      return { data, provider }
    } catch (err) {
      lastError = err
      // try the next provider in the chain
    }
  }

  throw lastError ?? new NoProviderError()
}
