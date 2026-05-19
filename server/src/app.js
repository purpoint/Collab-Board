import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { CLIENT_URL } from './config/env.js'
import authRoutes from './routes/auth.routes.js'
import boardRoutes from './routes/board.routes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(cors({ origin: CLIENT_URL }))
app.use(express.json())

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many auth attempts, please try again later.' }
})

app.use(generalLimiter)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/boards', boardRoutes)

app.use(errorHandler)

export default app