import { useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export const useCanvasEvents = (canvasRef, tool, color, onShapeComplete) => {
    const isDrawing = useRef(false)
    const startPoint = useRef({ x: 0, y: 0 })
    const [activeShape, setActiveShape] = useState(null)

    const getCanvasPoint = (e) => {
        const rect = canvasRef.current.getBoundingClientRect()
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }

    const onMouseDown = (e) => {
        const point = getCanvasPoint(e)
        isDrawing.current = true
        startPoint.current = point
    }

    const onMouseMove = (e) => {
        if (!isDrawing.current) return
        const point = getCanvasPoint(e)

        setActiveShape({
            shapeId: 'preview',
            type: tool,
            x: startPoint.current.x,
            y: startPoint.current.y,
            width: point.x - startPoint.current.x,
            height: point.y - startPoint.current.y,
            strokeColor: color,
            fillColor: 'transparent',
            strokeWidth: 2
        })
    }

    const onMouseUp = (e) => {
        if (!isDrawing.current) return
        isDrawing.current = false

        const point = getCanvasPoint(e)
        const shape = {
            shapeId: uuidv4(),
            type: tool,
            x: startPoint.current.x,
            y: startPoint.current.y,
            width: point.x - startPoint.current.x,
            height: point.y - startPoint.current.y,
            strokeColor: color,
            fillColor: 'transparent',
            strokeWidth: 2,
            zIndex: Date.now()
        }

        setActiveShape(null)
        onShapeComplete(shape)
    }

    return { activeShape, onMouseDown, onMouseMove, onMouseUp }
}