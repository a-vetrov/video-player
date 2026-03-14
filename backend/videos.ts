import fs from 'node:fs/promises'
import path from 'node:path'
import { Router } from 'express'
import type { Request, Response } from 'express'

const VIDEO_DIR = path.join(process.cwd(), 'public', 'video')

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  try {
    const entries = await fs.readdir(VIDEO_DIR, { withFileTypes: true })
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
    res.json({ files })
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      res.json({ files: [] })
      return
    }
    console.error(err)
    res.status(500).json({ error: 'Failed to list videos' })
  }
})

export default router
