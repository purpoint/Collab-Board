export const registerCursorHandlers = (io, socket) => {
    socket.on('cursor-move', ({ boardId, x, y }) => {
        socket.to(boardId).emit('cursor-update', {
            userId: socket.user.userId,
            username: socket.user.username,
            color: socket.user.avatarColor,
            x,
            y
        })
    })
}