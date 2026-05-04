import { socketAuth } from './middleware/socketAuth.js'
import { registerBoardHandlers } from './handlers/board.handler.js'
import { registerShapeHandlers } from './handlers/shape.handler.js'
import { registerCursorHandlers } from './handlers/cursor.handler.js'

export const initSocket = (io) => {
    io.use(socketAuth)

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.username}`)

        registerBoardHandlers(io, socket)
        registerShapeHandlers(io, socket)
        registerCursorHandlers(io, socket)

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.username}`)
        })
    })
}