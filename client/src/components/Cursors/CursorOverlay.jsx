import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useCallback } from 'react'
import { removeCursor } from '../../store/cursorSlice.js'
import { RemoteCursor } from './RemoteCursor.jsx'

export const CursorOverlay = () => {
  const cursors  = useSelector(state => state.cursors)
  const dispatch = useDispatch()

  const expireCursors = useCallback(() => {
    const now = Date.now()
    Object.entries(cursors).forEach(([userId, cursor]) => {
      if (now - cursor.lastSeen > 3000) {
        dispatch(removeCursor(userId))
      }
    })
  }, [cursors, dispatch])

  useEffect(() => {
    const interval = setInterval(expireCursors, 2000)
    return () => clearInterval(interval)
  }, [expireCursors])

  return (
    <div style={{
      position: 'absolute', inset: 0,
      pointerEvents: 'none', overflow: 'hidden'
    }}>
      {Object.entries(cursors).map(([userId, cursor]) => (
        <RemoteCursor
          key={userId}
          x={cursor.x}
          y={cursor.y}
          color={cursor.color}
          username={cursor.username}
        />
      ))}
    </div>
  )
}