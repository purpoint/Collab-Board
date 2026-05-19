import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { shapesSelectors, setAllShapes } from '../store/shapesSlice.js'
import { socket } from '../socket/socketClient.js'
import { EVENTS } from '../socket/events.js'

export const useHistory = (boardId) => {
  const dispatch   = useDispatch()
  const shapes     = useSelector(shapesSelectors.selectAll)
  const past       = useRef([])
  const shapesRef  = useRef(shapes)

  useEffect(() => { shapesRef.current = shapes }, [shapes])

  const saveSnapshot = () => {
    past.current.push([...shapesRef.current])
    if (past.current.length > 50) past.current.shift()
  }

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (past.current.length === 0) return
        const previous = past.current.pop()

        // find what shape was added (is in current but not in previous)
        const prevIds   = new Set(previous.map(s => s.shapeId))
        const currentIds = new Set(shapesRef.current.map(s => s.shapeId))
        const addedIds  = [...currentIds].filter(id => !prevIds.has(id))

        // emit delete for each shape that was added
        addedIds.forEach(shapeId => {
          socket.emit(EVENTS.DELETE_SHAPE, { boardId, shapeId })
        })

        dispatch(setAllShapes(previous))
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [boardId])

  return { saveSnapshot }
}