import * as boardService from '../services/board.service.js'

export const createBoard = async (req, res, next) => {
    try {
        const { name } = req.body
        if (!name) return res.status(400).json({ error: 'Board name required' })

        const board = await boardService.createBoard(name, req.user.userId)
        res.status(201).json({ board })
    } catch (err) {
        next(err)
    }
}

export const getBoard = async (req, res, next) => {
    try {
        const board = await boardService.getBoardById(req.params.boardId)
        if (!board) return res.status(404).json({ error: 'Board not found' })
        res.json({ board })
    } catch (err) {
        next(err)
    }
}

export const joinBoard = async (req, res, next) => {
    try {
        const board = await boardService.joinBoard(req.params.boardId, req.user.userId)
        if (!board) return res.status(404).json({ error: 'Board not found' })
        res.json({ board })
    } catch (err) {
        next(err)
    }
}