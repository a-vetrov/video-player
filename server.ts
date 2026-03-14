import fs from 'node:fs/promises'
import express from 'express'
import type { Request, Response } from 'express'
import type { ViteDevServer } from 'vite'

const isProduction = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT) || 5173
const base = process.env.BASE || '/'

const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''

const app = express()

let vite: ViteDevServer | undefined
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

type RenderResult = {
  head?: string | null
  html?: string | null
}

type Render = (url: string) => Promise<RenderResult>

app.use('*all', async (req: Request, res: Response) => {
  try {
    const url = req.originalUrl.replace(base, '')

    let template: string
    let render: Render

    if (!isProduction) {
      template = await fs.readFile('./index.html', 'utf-8')
      if (!vite) {
        throw new Error('Vite dev server is not initialized')
      }
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render as Render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render as Render
    }

    const rendered = await render(url)

    const html = template
      .replace('<!--app-head-->', rendered.head ?? '')
      .replace('<!--app-html-->', rendered.html ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (error) {
    const err = error as Error
    if (!isProduction && vite && 'ssrFixStacktrace' in vite && typeof vite.ssrFixStacktrace === 'function') {
      vite.ssrFixStacktrace(err)
    }
    console.error(err.stack)
    res.status(500).end(err.stack)
  }
})

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})

