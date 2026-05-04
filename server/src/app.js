import express from 'express'
import cors from 'cors'
import { CLIENT_URL } from './config/env.js'
import authRoutes from './routes/auth.routes.js'
import boardRoutes from './routes/board.routes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(cors({ origin: CLIENT_URL }))
app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/boards', boardRoutes)

app.use(errorHandler)

export default app