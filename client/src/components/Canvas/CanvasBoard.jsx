import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { shapesSelectors } from '../../store/shapesSlice.js'
import { renderBoard } from './CanvasRenderer.js'
import { useCanvasEvents } from './useCanvasEvents.js'
import { useCursors } from '../../hooks/useCursors.js'

export const CanvasBoard = ({ tool, color, boardId, onShapeComplete }) => {
    const canvasRef = useRef(null)
    const shapes = useSelector(shapesSelectors.selectAll)

    const { activeShape, onMouseDown, onMouseMove, onMouseUp } =
        useCanvasEvents(canvasRef, tool, color, onShapeComplete)

    useCursors(canvasRef, boardId)

    // render loop
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        renderBoard(ctx, shapes, activeShape)
    }, [shapes, activeShape])

    // resize handler
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const resize = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
        }

        resize()
        const observer = new ResizeObserver(resize)
        observer.observe(canvas)
        return () => observer.disconnect()
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
        />
    )
}