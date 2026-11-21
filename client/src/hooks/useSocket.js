import { useEffect, useState } from 'react'
import { socket } from '../socket/socketClient.js'

export const useSocket = () => {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // no token at all → this visitor never logged in, send them to the login page
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/'
      return
    }

    // always read the fresh token before connecting
    socket.auth = { token }
    socket.connect()

    const handleConnect = () => setConnected(true)
    const handleDisconnect = () => setConnected(false)

    // the server rejected the token (expired or invalid) → clear it and go to login
    const handleConnectError = (err) => {
      if (err.message === 'Invalid token' || err.message === 'No token') {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        socket.disconnect()
        window.location.href = '/'
      }
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('connect_error', handleConnectError)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('connect_error', handleConnectError)
      socket.disconnect()
    }
  }, [])

  return { connected }
}