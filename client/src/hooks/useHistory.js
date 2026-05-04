import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setAllShapes } from '../store/shapesSlice.js'

export const useHistory = () => {
    const past = useRef([])
    const future = useRef([])
    const dispatch = useDispatch()

    const saveSnapshot = (shapes) => {
        past.current.push(shapes)
        if (past.current.length > 50) past.current.shift()
        future.current = []
    }

    const undo = () => {
        if (past.current.length === 0) return
        const previous = past.current.pop()
        dispatch(setAllShapes(previous))
    }

    return { saveSnapshot, undo }
}