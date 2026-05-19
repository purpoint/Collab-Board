import { useRef, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { simplifyPath } from '../../utils/simplifyPath.js'

export const useCanvasEvents = (canvasRef, tool, color, fillColor, strokeWidth, onShapeComplete, onDeleteShape) => {
  const isDrawing    = useRef(false)
  const startPoint   = useRef({ x: 0, y: 0 })
  const pencilPoints = useRef([])
  const [activeShape, setActiveShape] = useState(null)
  const [selectedId, setSelectedId]   = useState(null)

  const getPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        onDeleteShape(selectedId)
        setSelectedId(null)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedId, onDeleteShape])

  const onMouseDown = (e) => {
    const point = getPoint(e)
    isDrawing.current = true
    startPoint.current = point

    if (tool === 'pencil') {
      pencilPoints.current = [point]
    }
  }

  const onMouseMove = (e) => {
    if (!isDrawing.current) return
    const point = getPoint(e)

    if (tool === 'pencil') {
      pencilPoints.current.push(point)
      setActiveShape({
        shapeId: 'preview',
        type: 'pencil',
        points: [...pencilPoints.current],
        strokeColor: color,
        strokeWidth,
      })
      return
    }

    setActiveShape({
      shapeId: 'preview',
      type: tool,
      x: startPoint.current.x,
      y: startPoint.current.y,
      width:  point.x - startPoint.current.x,
      height: point.y - startPoint.current.y,
      strokeColor: color,
      fillColor,
      strokeWidth,
    })
  }

  const onMouseUp = (e) => {
    if (!isDrawing.current) return
    isDrawing.current = false
    const point = getPoint(e)

    if (tool === 'pencil') {
      const shape = {
        shapeId: uuidv4(),
        type: 'pencil',
        points: simplifyPath(pencilPoints.current, 2),
        strokeColor: color,
        strokeWidth,
        zIndex: Date.now(),
      }
      pencilPoints.current = []
      setActiveShape(null)
      onShapeComplete(shape)
      return
    }

    const shape = {
      shapeId: uuidv4(),
      type: tool,
      x: startPoint.current.x,
      y: startPoint.current.y,
      width:  point.x - startPoint.current.x,
      height: point.y - startPoint.current.y,
      strokeColor: color,
      fillColor,
      strokeWidth,
      zIndex: Date.now(),
    }

    setActiveShape(null)
    onShapeComplete(shape)
  }

  return { activeShape, selectedId, onMouseDown, onMouseMove, onMouseUp }
}