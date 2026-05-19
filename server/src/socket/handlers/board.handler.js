import { getBoardShapes } from '../../services/shape.service.js'
import { joinBoard } from '../../services/board.service.js'

export const registerBoardHandlers = (io, socket) => {
  socket.on('join-board', async ({ boardId }) => {
    try {
      const board = await joinBoard(boardId, socket.user.userId)
      socket.join(boardId)

      const shapes = await getBoardShapes(boardId)

      // send full board state to the joining user
      socket.emit('init-board', {
        shapes,
        board: { boardId, name: board?.name || boardId }
      })

      // notify others in the room
      socket.to(boardId).emit('user-joined', {
        userId:      socket.user.userId,
        username:    socket.user.username,
        avatarColor: socket.user.avatarColor
      })

      console.log(`${socket.user.username} joined board ${boardId}`)
    } catch (err) {
      socket.emit('error', { message: 'Failed to join board' })
    }
  })

  socket.on('leave-board', ({ boardId }) => {
    socket.leave(boardId)
    socket.to(boardId).emit('user-left', {
      userId:   socket.user.userId,
      username: socket.user.username
    })
  })
}