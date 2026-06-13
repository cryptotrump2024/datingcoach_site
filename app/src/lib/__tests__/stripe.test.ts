import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { PLAN_PRICES, verifyStripeSignature } from '../../../api/_lib/stripe'

const SECRET = 'whsec_test_secret'

function signedHeader(payload: string, timestamp: number, secret = SECRET): string {
  const sig = createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex')
  return `t=${timestamp},v1=${sig}`
}

describe('PLAN_PRICES', () => {
  it('covers both plans and billing periods with sane amounts', () => {
    expect(Object.keys(PLAN_PRICES).sort()).toEqual([
      'advanced:annual',
      'advanced:monthly',
      'pro:annual',
      'pro:monthly',
    ])
    expect(PLAN_PRICES['pro:monthly'].unitAmount).toBe(995)
    expect(PLAN_PRICES['pro:annual'].interval).toBe('year')
    expect(PLAN_PRICES['advanced:annual'].unitAmount).toBe(28740)
  })
})

describe('verifyStripeSignature', () => {
  const payload = JSON.stringify({ type: 'checkout.session.completed', id: 'evt_1' })

  it('accepts a valid recent signature', async () => {
    const now = Math.floor(Date.now() / 1000)
    expect(await verifyStripeSignature(payload, signedHeader(payload, now), SECRET)).toBe(true)
  })

  it('rejects a tampered payload', async () => {
    const now = Math.floor(Date.now() / 1000)
    const header = signedHeader(payload, now)
    expect(await verifyStripeSignature(payload + 'x', header, SECRET)).toBe(false)
  })

  it('rejects the wrong secret', async () => {
    const now = Math.floor(Date.now() / 1000)
    const header = signedHeader(payload, now, 'whsec_other')
    expect(await verifyStripeSignature(payload, header, SECRET)).toBe(false)
  })

  it('rejects an expired timestamp', async () => {
    const old = Math.floor(Date.now() / 1000) - 4000
    expect(await verifyStripeSignature(payload, signedHeader(payload, old), SECRET)).toBe(false)
  })

  it('rejects a malformed header', async () => {
    expect(await verifyStripeSignature(payload, 'garbage', SECRET)).toBe(false)
  })
})
