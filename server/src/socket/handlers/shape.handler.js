import { createShape, updateShape, deleteShape } from '../../services/shape.service.js'

export const registerShapeHandlers = (io, socket) => {
    socket.on('draw-shape', async ({ boardId, shape }) => {
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
        try {
            const updated = await updateShape(shapeId, boardId, updates)
            io.to(boardId).emit('shape-updated', { shape: updated })
        } catch (err) {
            socket.emit('error', { message: 'Failed to update shape' })
        }
    })

    socket.on('delete-shape', async ({ boardId, shapeId }) => {
        try {
            await deleteShape(shapeId, boardId)
            io.to(boardId).emit('shape-deleted', { shapeId })
        } catch (err) {
            socket.emit('error', { message: 'Failed to delete shape' })
        }
    })
}