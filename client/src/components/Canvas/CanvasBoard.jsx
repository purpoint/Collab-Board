import { useEffect, useRef, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { shapesSelectors } from '../../store/shapesSlice.js'
import { renderBoard } from './CanvasRenderer.js'
import { useCanvasEvents } from './useCanvasEvents.js'
import { useCursors } from '../../hooks/useCursors.js'

export const CanvasBoard = ({ tool, color, fillColor, strokeWidth, opacity, boardId, onShapeComplete, onDeleteShape }) => {
  const canvasRef  = useRef(null)
  const shapesRef  = useRef([])
  const shapes     = useSelector(shapesSelectors.selectAll)
  const [zoom, setZoom]       = useState(1)
  const [offset, setOffset]   = useState({ x: 0, y: 0 })
  const zoomRef  = useRef(1)
  const offsetRef = useRef({ x: 0, y: 0 })

  shapesRef.current = shapes

  const { activeShape, selectedId, onMouseDown, onMouseMove, onMouseUp } =
    useCanvasEvents(canvasRef, tool, color, fillColor, strokeWidth, opacity, onShapeComplete, onDeleteShape, zoomRef, offsetRef)

  useCursors(canvasRef, boardId)

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    renderBoard(ctx, shapesRef.current, null, null, zoomRef.current, offsetRef.current.x, offsetRef.current.y)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    renderBoard(ctx, shapes, activeShape, selectedId, zoom, offset.x, offset.y)
  }, [shapes, activeShape, selectedId, zoom, offset])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width  = parent.offsetWidth
      canvas.height = parent.offsetHeight
      redraw()
    }

    resize()
    setTimeout(resize, 50)
    setTimeout(resize, 200)
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [redraw])

  // zoom with ctrl+scroll
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleWheel = (e) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()

      const rect   = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const delta   = e.deltaY > 0 ? 0.9 : 1.1
      const newZoom = Math.min(Math.max(zoomRef.current * delta, 0.2), 5)

      // zoom toward mouse position
      const newOffsetX = mouseX - (mouseX - offsetRef.current.x) * (newZoom / zoomRef.current)
      const newOffsetY = mouseY - (mouseY - offsetRef.current.y) * (newZoom / zoomRef.current)

      zoomRef.current   = newZoom
      offsetRef.current = { x: newOffsetX, y: newOffsetY }
      setZoom(newZoom)
      setOffset({ x: newOffsetX, y: newOffsetY })
    }

    canvas.addEventListener('wheel', handleWheel, { passive: false })
    return () => canvas.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    />
  )
}