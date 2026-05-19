import { createShape, updateShape, deleteShape, clearBoard } from '../../services/shape.service.js'
import { validate, validateShape } from '../middleware/validateEvent.js'

export const registerShapeHandlers = (io, socket) => {

  socket.on('draw-shape', async ({ boardId, shape }) => {
    if (!validate(socket, { boardId }, ['boardId'])) return
    if (!validateShape(socket, shape)) return

    try {
      const saved = await createShape({
        ...shape,
        boardId,
        createdBy: socket.user.userId
      })
      io.to(boardId).emit('shape-added', { shape: saved })
    } catch (err) {
      socket.emit('error', { message: 'Failed to save shape' })
    }
  })

  socket.on('update-shape', async ({ boardId, shapeId, updates }) => {
    if (!validate(socket, { boardId, shapeId }, ['boardId', 'shapeId'])) return

    try {
      const updated = await updateShape(shapeId, boardId, updates)
      io.to(boardId).emit('shape-updated', { shape: updated })
    } catch (err) {
      socket.emit('error', { message: 'Failed to update shape' })
    }
  })

  socket.on('delete-shape', async ({ boardId, shapeId }) => {
    if (!validate(socket, { boardId, shapeId }, ['boardId', 'shapeId'])) return

    try {
      await deleteShape(shapeId, boardId)
      io.to(boardId).emit('shape-deleted', { shapeId })
    } catch (err) {
      socket.emit('error', { message: 'Failed to delete shape' })
    }
  })

  socket.on('clear-board', async ({ boardId }) => {
    if (!validate(socket, { boardId }, ['boardId'])) return

    try {
      await clearBoard(boardId)
      io.to(boardId).emit('board-cleared')
    } catch (err) {
      socket.emit('error', { message: 'Failed to clear board' })
    }
  })
}