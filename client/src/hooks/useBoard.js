import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../socket/socketClient.js'
import { EVENTS } from '../socket/events.js'
import { setAllShapes } from '../store/shapesSlice.js'
import { setBoard } from '../store/boardSlice.js'

export const useBoard = (boardId) => {
    const dispatch = useDispatch()

    useEffect(() => {
        if (!boardId) return

        socket.emit(EVENTS.JOIN_BOARD, { boardId })

        socket.on(EVENTS.INIT_BOARD, ({ shapes }) => {
            dispatch(setAllShapes(shapes))
            dispatch(setBoard({ boardId }))
        })

        return () => {
            socket.emit(EVENTS.LEAVE_BOARD, { boardId })
            socket.off(EVENTS.INIT_BOARD)
        }
    }, [boardId])
}