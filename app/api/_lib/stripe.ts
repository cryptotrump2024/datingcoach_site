// Minimal raw-fetch Stripe client (no SDK) so it runs in the same Web-Request
// runtime as the other functions. Server-side only.

const API = 'https://api.stripe.com/v1'

export function getStripeKey(): string | null {
  const k = process.env.STRIPE_SECRET_KEY
  return k && k.trim() !== '' ? k.trim() : null
}

export interface PlanPrice {
  name: string
  unitAmount: number // cents
  interval: 'month' | 'year'
}

// Pricing mirrors the Pricing page. Annual = per-month annual rate × 12.
export const PLAN_PRICES: Record<string, PlanPrice> = {
  'pro:monthly': { name: 'DatingCoach Pro (Monthly)', unitAmount: 995, interval: 'month' },
  'pro:annual': { name: 'DatingCoach Pro (Annual)', unitAmount: 9540, interval: 'year' },
  'advanced:monthly': { name: 'DatingCoach Advanced (Monthly)', unitAmount: 2995, interval: 'month' },
  'advanced:annual': { name: 'DatingCoach Advanced (Annual)', unitAmount: 28740, interval: 'year' },
}

export interface CheckoutParams {
  priceKey: string
  successUrl: string
  cancelUrl: string
  userId?: string
  email?: string
  plan: string
}

export async function createCheckoutSession(
  key: string,
  params: CheckoutParams
): Promise<{ id: string; url: string }> {
  const price = PLAN_PRICES[params.priceKey]
  if (!price) throw new Error(`Unknown price key: ${params.priceKey}`)

  const form = new URLSearchParams()
  form.set('mode', 'subscription')
  form.set('success_url', params.successUrl)
  form.set('cancel_url', params.cancelUrl)
  form.set('line_items[0][quantity]', '1')
  form.set('line_items[0][price_data][currency]', 'usd')
  form.set('line_items[0][price_data][unit_amount]', String(price.unitAmount))
  form.set('line_items[0][price_data][recurring][interval]', price.interval)
  form.set('line_items[0][price_data][product_data][name]', price.name)
  form.set('metadata[plan]', params.plan)
  if (params.userId) {
    form.set('metadata[userId]', params.userId)
    form.set('client_reference_id', params.userId)
  }
  if (params.email) form.set('customer_email', params.email)

  const res = await fetch(`${API}/checkout/sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Stripe ${res.status}: ${body.slice(0, 300)}`)
  }
  const data = (await res.json()) as { id: string; url: string }
  return { id: data.id, url: data.url }
}

// Verify a Stripe webhook signature (Stripe-Signature: t=...,v1=...) using
// Web Crypto so it works in both Node and Edge runtimes.
export async function verifyStripeSignature(
  payload: string,
  sigHeader: string,
  secret: string,
  toleranceSeconds = 300
): Promise<boolean> {
  const parts = Object.fromEntries(
    sigHeader.split(',').map((kv) => {
      const [k, v] = kv.split('=')
      return [k.trim(), v]
    })
  )
  const timestamp = parts['t']
  const expected = parts['v1']
  if (!timestamp || !expected) return false

  const age = Math.abs(Date.now() / 1000 - Number(timestamp))
  if (Number.isNaN(age) || age > toleranceSeconds) return false

  const enc = new TextEncoder()
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sigBuf = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(`${timestamp}.${payload}`))
  const computed = [...new Uint8Array(sigBuf)].map((b) => b.toString(16).padStart(2, '0')).join('')

  // constant-time-ish comparison
  if (computed.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < computed.length; i++) diff |= computed.charCodeAt(i) ^ expected.charCodeAt(i)
  return diff === 0
}

// Best-effort: reflect a paid plan onto the user's Supabase profile (bypasses
// RLS with the secret key). No-op if Supabase server env isn't configured.
export async function updateSupabasePlan(userId: string, plan: string): Promise<void> {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !secret || !userId) return
  const credits = plan === 'advanced' ? -1 : plan === 'pro' ? 50 : 3
  await fetch(`${url}/rest/v1/profiles?id=eq.${userId}`, {
    method: 'PATCH',
    headers: {
      apikey: secret,
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ plan, credits }),
  }).catch(() => undefined)
}
