import { Router } from 'express'
import videos from './videos.ts'

const router = Router()

router.use('/videos', videos)

export default router
