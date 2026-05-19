import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../socket/socketClient.js'
import { EVENTS } from '../socket/events.js'
import { setAllShapes } from '../store/shapesSlice.js'
import { setBoard } from '../store/boardSlice.js'

export const useBoard = (boardId) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  const joinBoard = () => {
    if (!boardId) return
    setLoading(true)
    socket.emit(EVENTS.JOIN_BOARD, { boardId })
  }

  useEffect(() => {
    if (!boardId) return

    joinBoard()

    socket.on(EVENTS.INIT_BOARD, ({ shapes }) => {
      dispatch(setAllShapes(shapes))
      dispatch(setBoard({ boardId }))
      setLoading(false)
    })

    socket.on('connect', joinBoard)

    return () => {
      socket.emit(EVENTS.LEAVE_BOARD, { boardId })
      socket.off(EVENTS.INIT_BOARD)
      socket.off('connect', joinBoard)
    }
  }, [boardId])

  return { loading }
}