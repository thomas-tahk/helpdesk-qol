import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { incidents } from './seeds/incidents.ts'

const app = new Hono()

app.use('/*', cors())

app.use('/*', async (c, next) => {
  if (c.req.path === '/health') return next()
  const ms = 50 + Math.floor(Math.random() * 251)
  await new Promise((r) => setTimeout(r, ms))
  await next()
})

app.get('/health', (c) => c.json({ ok: true }))

app.get('/incidents', (c) => {
  const summaries = incidents.map((i) => ({
    id: i.id,
    shortDescription: i.shortDescription,
    state: i.state,
    priority: i.priority,
    caller: i.caller,
    assignedTo: i.assignedTo,
    openedAt: i.openedAt,
  }))
  return c.json(summaries)
})

app.get('/incidents/:id', (c) => {
  const id = c.req.param('id')
  const incident = incidents.find((i) => i.id === id)
  if (!incident) return c.json({ error: 'not_found' }, 404)
  return c.json(incident)
})

const port = Number(process.env.PORT ?? 3000)

serve({ fetch: app.fetch, port }, ({ port }) => {
  console.log(`api listening on http://localhost:${port}`)
})
