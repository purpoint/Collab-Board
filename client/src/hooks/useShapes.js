import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../socket/socketClient.js'
import { EVENTS } from '../socket/events.js'
import { addShape, updateShape, removeShape, setAllShapes } from '../store/shapesSlice.js'

export const useShapes = (boardId) => {
  const dispatch = useDispatch()

  useEffect(() => {
    socket.on(EVENTS.SHAPE_ADDED,   ({ shape }) => dispatch(addShape(shape)))
    socket.on(EVENTS.SHAPE_UPDATED, ({ shape }) => dispatch(updateShape(shape)))
    socket.on(EVENTS.SHAPE_DELETED, ({ shapeId }) => dispatch(removeShape(shapeId)))
    socket.on(EVENTS.BOARD_CLEARED, () => dispatch(setAllShapes([])))

    return () => {
      socket.off(EVENTS.SHAPE_ADDED)
      socket.off(EVENTS.SHAPE_UPDATED)
      socket.off(EVENTS.SHAPE_DELETED)
      socket.off(EVENTS.BOARD_CLEARED)
    }
  }, [])

  const emitDrawShape = (shape) => {
    socket.emit(EVENTS.DRAW_SHAPE, { boardId, shape })
  }

  const emitDeleteShape = (shapeId) => {
    socket.emit(EVENTS.DELETE_SHAPE, { boardId, shapeId })
  }

  const emitClearBoard = () => {
    socket.emit(EVENTS.CLEAR_BOARD, { boardId })
  }

  return { emitDrawShape, emitDeleteShape, emitClearBoard }
}