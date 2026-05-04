import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../config/env.js'

export const socketAuth = (socket, next) => {
    try {
        const token = socket.handshake.auth.token
        if (!token) return next(new Error('No token'))

        const decoded = jwt.verify(token, JWT_SECRET)
        socket.user = decoded
        next()
    } catch (err) {
        next(new Error('Invalid token'))
    }
}