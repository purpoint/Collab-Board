import { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../socket/socketClient.js'
import { EVENTS } from '../socket/events.js'
import { addShape, updateShape, removeShape, setAllShapes } from '../store/shapesSlice.js'

export const useShapes = (boardId) => {
  const dispatch = useDispatch()

  const handleShapeAdded   = useCallback(({ shape })   => dispatch(addShape(shape)),    [dispatch])
  const handleShapeUpdated = useCallback(({ shape })   => dispatch(updateShape(shape)), [dispatch])
  const handleShapeDeleted = useCallback(({ shapeId }) => dispatch(removeShape(shapeId)), [dispatch])
  const handleBoardCleared = useCallback(() => dispatch(setAllShapes([])), [dispatch])

  useEffect(() => {
    socket.on(EVENTS.SHAPE_ADDED,   handleShapeAdded)
    socket.on(EVENTS.SHAPE_UPDATED, handleShapeUpdated)
    socket.on(EVENTS.SHAPE_DELETED, handleShapeDeleted)
    socket.on(EVENTS.BOARD_CLEARED, handleBoardCleared)

    return () => {
      socket.off(EVENTS.SHAPE_ADDED,   handleShapeAdded)
      socket.off(EVENTS.SHAPE_UPDATED, handleShapeUpdated)
      socket.off(EVENTS.SHAPE_DELETED, handleShapeDeleted)
      socket.off(EVENTS.BOARD_CLEARED, handleBoardCleared)
    }
  }, [handleShapeAdded, handleShapeUpdated, handleShapeDeleted, handleBoardCleared])

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