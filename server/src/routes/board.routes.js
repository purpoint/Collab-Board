import express from 'express'
import { createBoard, getBoard, joinBoard } from '../controllers/board.controller.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, createBoard)
router.get('/:boardId', protect, getBoard)
router.post('/:boardId/join', protect, joinBoard)

export default router