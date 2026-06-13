import { json } from './_lib/anthropic'
import { createCheckoutSession, getStripeKey, PLAN_PRICES } from './_lib/stripe'

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const key = getStripeKey()
  if (!key) {
    // Tells the client to fall back to the existing (mock) upgrade flow.
    return json({ fallback: true, reason: 'Payments not configured' }, 503)
  }

  let body: { plan?: string; billing?: string; userId?: string; email?: string }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const plan = body.plan === 'advanced' ? 'advanced' : 'pro'
  const billing = body.billing === 'annual' ? 'annual' : 'monthly'
  const priceKey = `${plan}:${billing}`
  if (!PLAN_PRICES[priceKey]) return json({ error: 'Unknown plan' }, 400)

  const origin = req.headers.get('origin') || 'https://datingcoach.site'

  try {
    const session = await createCheckoutSession(key, {
      priceKey,
      plan,
      userId: body.userId,
      email: body.email,
      successUrl: `${origin}/dashboard?upgrade=success`,
      cancelUrl: `${origin}/pricing?upgrade=cancelled`,
    })
    return json({ url: session.url })
  } catch (err) {
    return json({ error: 'Checkout failed', detail: String(err) }, 502)
  }
}
