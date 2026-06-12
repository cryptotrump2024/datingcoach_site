#!/usr/bin/env node
// E2E walk of the zero-env (local/fallback) build: screenshots + core flows.
// Usage: node scripts/visual-check.mjs (dev server must be running on :3000)

import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const require = createRequire(join(dirname(fileURLToPath(import.meta.url)), '../app/package.json'))
const { chromium } = require('playwright')

const OUT = '/tmp/dc-shots'
mkdirSync(OUT, { recursive: true })
const BASE = 'http://localhost:3000'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1380, height: 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
page.on('console', (m) => {
  if (m.type() === 'error' && !m.text().includes('favicon')) errors.push(`console: ${m.text()}`)
})

async function shot(name) {
  await page.waitForTimeout(700)
  await page.screenshot({ path: join(OUT, `${name}.png`) })
  console.log(`shot: ${name}`)
}

// 1. Home
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
await shot('01-home-hero')
await page.evaluate(() => window.scrollTo(0, 1600))
await shot('02-home-bento')
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await shot('03-home-footer')

// 2. Scenarios
await page.goto(`${BASE}/scenarios`, { waitUntil: 'networkidle' })
await shot('04-scenarios')

// 3. Start a drill that has a persona opener -> chat with fallback engine
await page.getByRole('button', { name: /She Texted First/i }).click()
await page.waitForURL('**/chat')
await page.waitForTimeout(3500) // persona opener arrives
await shot('05-chat-drill-opened')

const input = page.getByPlaceholder(/Message/i)
await input.fill("Haha guilty — that's Kalsoy in the Faroe Islands. Tiny ferry, zero plan, best day of the trip. What's the most spontaneous thing you've done lately?")
await page.keyboard.press('Enter')
await page.waitForTimeout(6000) // fallback engine reply + analysis
await shot('06-chat-after-reply')

const bubbles = await page.locator('div.flex-1 >> text=/.+/').count()
console.log('chat content nodes:', bubbles > 0 ? 'present' : 'MISSING')

// 4. Signup (local guest mode) -> dashboard empty state
await page.goto(`${BASE}/signup`, { waitUntil: 'networkidle' })
await shot('07-signup')
await page.getByPlaceholder(/username/i).fill('Alex')
await page.locator('input[type="email"]').fill('alex@example.com')
const pws = page.locator('input[type="password"]')
await pws.nth(0).fill('test-password-123')
if ((await pws.count()) > 1) await pws.nth(1).fill('test-password-123')
// agree to terms (custom checkbox button before the terms text)
const agree = page.locator('button:near(:text("Terms"))').first()
await agree.click().catch(() => {})
await page.getByRole('button', { name: /create|sign up/i }).first().click()
await page.waitForTimeout(1500)
console.log('after signup url:', page.url())
await shot('08-after-signup')

// 5. Dashboard (authenticated now, or login redirect — both informative)
await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' })
await shot('09-dashboard')

// 6. Pricing + 404
await page.goto(`${BASE}/pricing`, { waitUntil: 'networkidle' })
await shot('10-pricing')
await page.goto(`${BASE}/definitely-not-a-page`, { waitUntil: 'networkidle' })
await shot('11-404')

// Mobile pass
await page.setViewportSize({ width: 390, height: 844 })
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
await shot('12-home-mobile')
await page.goto(`${BASE}/scenarios`, { waitUntil: 'networkidle' })
await shot('13-scenarios-mobile')

console.log('\nJS errors captured:', errors.length === 0 ? 'none' : '')
for (const e of errors.slice(0, 12)) console.log('  -', e)

await browser.close()
