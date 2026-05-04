import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { removeCursor } from '../../store/cursorSlice.js'
import { RemoteCursor } from './RemoteCursor.jsx'

export const CursorOverlay = () => {
    const cursors = useSelector(state => state.cursors)
    const dispatch = useDispatch()

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now()
            Object.entries(cursors).forEach(([userId, cursor]) => {
                if (now - cursor.lastSeen > 3000) {
                    dispatch(removeCursor(userId))
                }
            })
        }, 2000)
        return () => clearInterval(interval)
    }, [cursors])

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
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