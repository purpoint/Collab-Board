import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { shapesSelectors } from '../../store/shapesSlice.js'
import { renderBoard } from './CanvasRenderer.js'
import { useCanvasEvents } from './useCanvasEvents.js'
import { useCursors } from '../../hooks/useCursors.js'

export const CanvasBoard = ({ tool, color, fillColor, strokeWidth, boardId, onShapeComplete, onDeleteShape }) => {
  const canvasRef = useRef(null)
  const shapesRef = useRef([])
  const shapes    = useSelector(shapesSelectors.selectAll)

  // keep shapesRef in sync so resize handler can access latest shapes
  shapesRef.current = shapes

  const { activeShape, selectedId, onMouseDown, onMouseMove, onMouseUp } =
    useCanvasEvents(canvasRef, tool, color, fillColor, strokeWidth, onShapeComplete, onDeleteShape)

  useCursors(canvasRef, boardId)

  // re-render whenever shapes, activeShape, or selectedId changes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    renderBoard(ctx, shapes, activeShape, selectedId)
  }, [shapes, activeShape, selectedId])

  // handle canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      // set actual pixel dimensions — critical for correct rendering
      canvas.width  = parent.offsetWidth
      canvas.height = parent.offsetHeight
      const ctx = canvas.getContext('2d')
      // re-render with latest shapes after resize
      renderBoard(ctx, shapesRef.current, null, null)
    }

    // run immediately
    resize()
    // run again after layout settles — fixes black canvas on first load
    setTimeout(resize, 50)
    setTimeout(resize, 200)

    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
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