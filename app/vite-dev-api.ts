import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

// Dev-only: run the Vercel serverless functions in `app/api/*` under `vite dev`
// so the browser exercises the real AI engine locally (Vite doesn't serve
// /api otherwise). No effect on the production build.

const ROUTES: Record<string, string> = {
  '/api/chat': '/api/chat.ts',
  '/api/analyze-profile': '/api/analyze-profile.ts',
  '/api/create-checkout': '/api/create-checkout.ts',
  '/api/stripe-webhook': '/api/stripe-webhook.ts',
}

function loadEnvLocal(dir: string) {
  const path = resolve(dir, '.env.local')
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2]
  }
}

export function apiDevServer(): Plugin {
  return {
    name: 'datingcoach-api-dev',
    apply: 'serve',
    configureServer(server) {
      loadEnvLocal(server.config.root)
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? ''
        const route = url.split('?')[0]
        const file = ROUTES[route]
        if (!file) return next()

        try {
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const body = Buffer.concat(chunks)

          const headers: Record<string, string> = {}
          for (const [k, v] of Object.entries(req.headers)) {
            if (typeof v === 'string') headers[k] = v
            else if (Array.isArray(v)) headers[k] = v.join(', ')
          }

          const request = new Request(`http://localhost${url}`, {
            method: req.method,
            headers,
            body: req.method === 'GET' || req.method === 'HEAD' ? undefined : body,
          })

          const mod = await server.ssrLoadModule(file)
          const response: Response = await mod.default(request)

          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: String(err) }))
        }
      })
    },
  }
}
