import { useEffect, useRef, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../socket/socketClient.js'
import { EVENTS } from '../socket/events.js'
import { updateCursor } from '../store/cursorSlice.js'

export const useCursors = (canvasRef, boardId) => {
  const dispatch   = useDispatch()
  const lastEmit   = useRef(0)

  const handleCursorUpdate = useCallback((data) => {
    dispatch(updateCursor(data))
  }, [dispatch])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !boardId) return

    const handleMouseMove = (e) => {
      const now = Date.now()
      if (now - lastEmit.current < 30) return
      lastEmit.current = now

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      socket.emit(EVENTS.CURSOR_MOVE, { boardId, x, y })
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    socket.on(EVENTS.CURSOR_UPDATE, handleCursorUpdate)

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      socket.off(EVENTS.CURSOR_UPDATE, handleCursorUpdate)
    }
  }, [boardId, canvasRef, dispatch, handleCursorUpdate])
}