import http from 'http'
import { Server } from 'socket.io'
import app from './src/app.js'
import { connectDB } from './src/config/db.js'
import { PORT, CLIENT_URL } from './src/config/env.js'
import { initSocket } from './src/socket/index.js'

const httpServer = http.createServer(app)

const io = new Server(httpServer, {
  cors: { origin: CLIENT_URL }
})

initSocket(io)
connectDB()

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})