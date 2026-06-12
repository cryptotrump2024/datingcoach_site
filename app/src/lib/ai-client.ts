import type { ChatRequest, ChatResponse, ProfileRequest, ProfileResponse } from '../../api/_lib/schemas'
import { chatResponseSchema, profileResponseSchema } from '../../api/_lib/schemas'

export type { ChatRequest, ChatResponse, ProfileRequest, ProfileResponse }

export type AIEngineStatus = 'unknown' | 'live' | 'unavailable'

// After any failure, stop hitting the API for a cooldown window so local
// dev / keyless deploys don't pay a failed round-trip on every message.
const COOLDOWN_MS = 10 * 60 * 1000
let unavailableUntil = 0
let status: AIEngineStatus = 'unknown'

export function getAIEngineStatus(): AIEngineStatus {
  return status
}

function markUnavailable() {
  status = 'unavailable'
  unavailableUntil = Date.now() + COOLDOWN_MS
}

async function postJson(url: string, body: unknown, timeoutMs: number): Promise<unknown | null> {
  if (Date.now() < unavailableUntil) return null
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    if (!res.ok) {
      markUnavailable()
      return null
    }
    return await res.json()
  } catch {
    markUnavailable()
    return null
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Asks the live AI engine for the persona's next reply + coaching analysis.
 * Returns null when the engine is unavailable — callers fall back to the
 * local practice engine (lib/conversation-engine).
 */
export async function getAIChatTurn(request: ChatRequest): Promise<ChatResponse | null> {
  const raw = await postJson('/api/chat', request, 20_000)
  if (raw === null) return null
  const parsed = chatResponseSchema.safeParse(raw)
  if (!parsed.success) {
    markUnavailable()
    return null
  }
  status = 'live'
  return parsed.data
}

/**
 * Sends the profile screenshot (and/or bio text) for live AI analysis.
 * Returns null when unavailable — callers fall back to local OCR scoring.
 */
export async function getAIProfileAnalysis(request: ProfileRequest): Promise<ProfileResponse | null> {
  const raw = await postJson('/api/analyze-profile', request, 45_000)
  if (raw === null) return null
  const parsed = profileResponseSchema.safeParse(raw)
  if (!parsed.success) {
    markUnavailable()
    return null
  }
  status = 'live'
  return parsed.data
}

/** Test-only: reset module state between cases. */
export function __resetAIClientForTests() {
  unavailableUntil = 0
  status = 'unknown'
}
