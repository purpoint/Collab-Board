import { useEffect, useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../socket/socketClient.js'
import { EVENTS } from '../socket/events.js'
import { setAllShapes } from '../store/shapesSlice.js'
import { setBoard } from '../store/boardSlice.js'
import { showToast } from '../components/UI/Toast.jsx'

export const useBoard = (boardId) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [boardName, setBoardName] = useState('')

  const joinBoard = useCallback(() => {
    if (!boardId) return
    setLoading(true)
    socket.emit(EVENTS.JOIN_BOARD, { boardId })
  }, [boardId])

  useEffect(() => {
    if (!boardId) return

    joinBoard()

    socket.on(EVENTS.INIT_BOARD, ({ shapes, board }) => {
      dispatch(setAllShapes(shapes))
      dispatch(setBoard({ boardId }))
      if (board?.name) setBoardName(board.name)
      setLoading(false)
    })

    socket.on(EVENTS.USER_JOINED, ({ username }) => {
      showToast(`${username} joined the board`, 'success')
    })

    socket.on(EVENTS.USER_LEFT, ({ username }) => {
      showToast(`${username} left the board`, 'info')
    })

    socket.on('connect', joinBoard)

    return () => {
      socket.emit(EVENTS.LEAVE_BOARD, { boardId })
      socket.off(EVENTS.INIT_BOARD)
      socket.off(EVENTS.USER_JOINED)
      socket.off(EVENTS.USER_LEFT)
      socket.off('connect', joinBoard)
    }
  }, [boardId, dispatch, joinBoard])

  return { loading, boardName }
}