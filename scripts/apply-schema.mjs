#!/usr/bin/env node
// Applies supabase/schema.sql to the database in SUPABASE_DB_URL.
// Reads app/.env.local automatically. Usage: cd app && npm run apply-schema

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(join(dirname(fileURLToPath(import.meta.url)), '../app/package.json'))
const { Client } = require('pg')

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function loadEnvLocal() {
  const envPath = join(root, 'app', '.env.local')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2]
  }
}

loadEnvLocal()
const dbUrl = process.env.SUPABASE_DB_URL
if (!dbUrl) {
  console.error('SUPABASE_DB_URL is not set (env or app/.env.local).')
  console.error('Alternative: paste supabase/schema.sql into the Supabase SQL editor.')
  process.exit(1)
}

const sql = readFileSync(join(root, 'supabase', 'schema.sql'), 'utf8')

async function tryConnect(connectionString, label) {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })
  try {
    await client.connect()
    console.log(`Connected via ${label}.`)
    return client
  } catch (err) {
    console.warn(`Connection via ${label} failed: ${err.code ?? ''} ${err.message}`)
    try { await client.end() } catch { /* ignore */ }
    return null
  }
}

// Direct host first; if unreachable (e.g. IPv6-only from this network), try
// the Supabase session poolers (IPv4) across common regions.
const url = new URL(dbUrl)
const projectRef = url.hostname.split('.')[1] // db.<ref>.supabase.co
const password = decodeURIComponent(url.password)

let client = await tryConnect(dbUrl, `direct (${url.hostname})`)
if (!client) {
  const regions = [
    'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'eu-central-1', 'eu-west-1',
    'eu-west-2', 'eu-west-3', 'eu-north-1', 'ap-southeast-1', 'ap-southeast-2',
    'ap-northeast-1', 'ap-south-1', 'sa-east-1', 'ca-central-1',
  ]
  for (const region of regions) {
    const pooler = `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-${region}.pooler.supabase.com:5432/postgres`
    client = await tryConnect(pooler, `pooler (${region})`)
    if (client) break
  }
}

if (!client) {
  console.error('\nCould not reach the database from this machine.')
  console.error('Apply manually instead: Supabase Dashboard → SQL Editor → paste supabase/schema.sql → Run.')
  process.exit(1)
}

try {
  await client.query(sql)
  const { rows } = await client.query(
    `select table_name from information_schema.tables
     where table_schema = 'public'
       and table_name in ('profiles','conversations','profile_analyses','user_progress')
     order by table_name`
  )
  console.log('Schema applied. Tables present:', rows.map((r) => r.table_name).join(', '))
} finally {
  await client.end()
}
