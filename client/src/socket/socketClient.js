import { io } from 'socket.io-client'

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080'

export const socket = io(SERVER_URL, {
  autoConnect: false,
  auth: {
    token: localStorage.getItem('token')
  }
})