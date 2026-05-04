import Board from '../models/Board.js'
import Shape from '../models/Shape.js'

export const createBoard = async (name, userId) => {
    const boardId = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()

    const board = new Board({
        boardId,
        name,
        ownerId: userId,
        members: [{ userId, role: 'owner' }]
    })

    await board.save()
    return board
}

export const getBoardById = async (boardId) => {
    return await Board.findByBoardId(boardId)
}

export const joinBoard = async (boardId, userId) => {
    const board = await Board.findOne({ boardId })
    if (!board) return null

    const alreadyMember = board.members.find(
        m => m.userId.toString() === userId.toString()
    )

    if (!alreadyMember) {
        board.members.push({ userId, role: 'editor' })
        await board.save()
    }

    return board
}