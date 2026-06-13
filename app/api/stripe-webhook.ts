import { json } from './_lib/anthropic'
import { updateSupabasePlan, verifyStripeSignature } from './_lib/stripe'

// Stripe sends raw JSON; we must read the raw body for signature verification.
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const payload = await req.text()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const sig = req.headers.get('stripe-signature')

  if (secret) {
    if (!sig || !(await verifyStripeSignature(payload, sig, secret))) {
      return json({ error: 'Invalid signature' }, 400)
    }
  }

  let event: { type?: string; data?: { object?: Record<string, unknown> } }
  try {
    event = JSON.parse(payload)
  } catch {
    return json({ error: 'Invalid payload' }, 400)
  }

  if (event.type === 'checkout.session.completed') {
    const obj = event.data?.object ?? {}
    const metadata = (obj.metadata ?? {}) as { userId?: string; plan?: string }
    const userId = metadata.userId || (obj.client_reference_id as string | undefined)
    const plan = metadata.plan || 'pro'
    if (userId) await updateSupabasePlan(userId, plan)
  }

  return json({ received: true })
}
