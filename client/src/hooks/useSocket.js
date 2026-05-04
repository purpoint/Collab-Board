import { useEffect, useState } from 'react'
import { socket } from '../socket/socketClient.js'

export const useSocket = () => {
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        // always read fresh token before connecting
        socket.auth = { token: localStorage.getItem('token') }
        socket.connect()

        socket.on('connect', () => setConnected(true))
        socket.on('disconnect', () => setConnected(false))

        return () => {
            socket.off('connect')
            socket.off('disconnect')
            socket.disconnect()
        }
    }, [])

    return { connected }
}