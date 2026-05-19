export const renderBoard = (ctx, shapes, activeShape, selectedId, zoom = 1, offsetX = 0, offsetY = 0) => {
  const canvas = ctx.canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // deep void background
  ctx.fillStyle = '#010408'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // subtle scan-line effect
  ctx.save()
  for (let y = 0; y < canvas.height; y += 3) {
    ctx.fillStyle = 'rgba(0,0,0,0.08)'
    ctx.fillRect(0, y, canvas.width, 1)
  }
  ctx.restore()

  // dot grid — drawn in world space
  ctx.save()
  ctx.translate(offsetX, offsetY)
  ctx.scale(zoom, zoom)

  ctx.fillStyle = 'rgba(30,56,90,0.6)'
  const spacing = 28
  const startX  = Math.floor(-offsetX / zoom / spacing) * spacing
  const startY  = Math.floor(-offsetY / zoom / spacing) * spacing
  const endX    = startX + canvas.width  / zoom + spacing
  const endY    = startY + canvas.height / zoom + spacing

  for (let x = startX; x < endX; x += spacing) {
    for (let y = startY; y < endY; y += spacing) {
      ctx.beginPath()
      ctx.arc(x, y, 0.9 / zoom, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // draw shapes in world space
  shapes.forEach(shape => {
    drawShape(ctx, shape)
    if (shape.shapeId === selectedId) drawSelection(ctx, shape)
  })

  if (activeShape) drawShape(ctx, activeShape)

  ctx.restore()
}

const drawShape = (ctx, shape) => {
  ctx.save()
  ctx.globalAlpha  = shape.opacity !== undefined ? shape.opacity : 1
  ctx.strokeStyle  = shape.strokeColor || '#00c8ff'
  ctx.fillStyle    = shape.fillColor   || 'transparent'
  ctx.lineWidth    = shape.strokeWidth || 2
  ctx.lineCap      = 'round'
  ctx.lineJoin     = 'round'

  switch (shape.type) {
    case 'rect': {
      ctx.beginPath()
      ctx.roundRect(shape.x, shape.y, shape.width, shape.height, 4)
      ctx.stroke()
      if (shape.fillColor && shape.fillColor !== 'transparent') ctx.fill()
      break
    }
    case 'circle': {
      const cx = shape.x + shape.width / 2
      const cy = shape.y + shape.height / 2
      const rx = Math.abs(shape.width  / 2)
      const ry = Math.abs(shape.height / 2)
      if (!rx || !ry) break
      ctx.beginPath()
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
      ctx.stroke()
      if (shape.fillColor && shape.fillColor !== 'transparent') ctx.fill()
      break
    }
    case 'line': {
      ctx.beginPath()
      ctx.moveTo(shape.x, shape.y)
      ctx.lineTo(shape.x + shape.width, shape.y + shape.height)
      ctx.stroke()
      break
    }
    case 'pencil': {
      const pts = shape.points
      if (!pts || pts.length < 2) break
      ctx.beginPath()
      ctx.moveTo(pts[0].x, pts[0].y)
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
      ctx.stroke()
      break
    }
    default: break
  }
  ctx.restore()
}

const drawSelection = (ctx, shape) => {
  ctx.save()
  ctx.strokeStyle = '#8855ff'
  ctx.lineWidth   = 1.5
  ctx.setLineDash([5, 4])
  ctx.shadowColor = '#8855ff'
  ctx.shadowBlur  = 8
  const pad = 8

  if (shape.type === 'circle') {
    ctx.beginPath()
    ctx.ellipse(
      shape.x + shape.width  / 2,
      shape.y + shape.height / 2,
      Math.abs(shape.width  / 2) + pad,
      Math.abs(shape.height / 2) + pad,
      0, 0, Math.PI * 2
    )
    ctx.stroke()
  } else if (shape.type === 'pencil') {
    if (!shape.points?.length) return
    ctx.beginPath()
    ctx.moveTo(shape.points[0].x, shape.points[0].y)
    shape.points.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.stroke()
  } else if (shape.type === 'line') {
    ctx.beginPath()
    ctx.moveTo(shape.x, shape.y)
    ctx.lineTo(shape.x + shape.width, shape.y + shape.height)
    ctx.stroke()
  } else {
    const x = Math.min(shape.x, shape.x + shape.width)
    const y = Math.min(shape.y, shape.y + shape.height)
    const w = Math.abs(shape.width)
    const h = Math.abs(shape.height)
    ctx.beginPath()
    ctx.roundRect(x - pad, y - pad, w + pad * 2, h + pad * 2, 6)
    ctx.stroke()
  }
  ctx.restore()
}