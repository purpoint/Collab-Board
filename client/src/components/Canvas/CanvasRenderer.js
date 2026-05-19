export const renderBoard = (ctx, shapes, activeShape, selectedId) => {
  const canvas = ctx.canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // deep dark background
  ctx.fillStyle = '#03050a'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // dot grid — subtle blue-gray dots
  ctx.fillStyle = 'rgba(30, 48, 80, 0.7)'
  const spacing = 28
  for (let x = spacing; x < canvas.width; x += spacing) {
    for (let y = spacing; y < canvas.height; y += spacing) {
      ctx.beginPath()
      ctx.arc(x, y, 0.9, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // draw all saved shapes
  shapes.forEach(shape => {
    drawShape(ctx, shape)
    if (shape.shapeId === selectedId) drawSelection(ctx, shape)
  })

  // draw in-progress preview shape
  if (activeShape) drawShape(ctx, activeShape)
}

const drawShape = (ctx, shape) => {
  ctx.strokeStyle = shape.strokeColor || '#06b6d4'
  ctx.fillStyle   = shape.fillColor   || 'transparent'
  ctx.lineWidth   = shape.strokeWidth || 2
  ctx.lineCap     = 'round'
  ctx.lineJoin    = 'round'

  switch (shape.type) {
    case 'rect': {
      ctx.beginPath()
      // use roundRect for modern look — 4px radius
      ctx.roundRect(shape.x, shape.y, shape.width, shape.height, 4)
      ctx.stroke()
      if (shape.fillColor && shape.fillColor !== 'transparent') ctx.fill()
      break
    }

    case 'circle': {
      const cx = shape.x + shape.width / 2
      const cy = shape.y + shape.height / 2
      const rx = Math.abs(shape.width / 2)
      const ry = Math.abs(shape.height / 2)
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
      if (!shape.points || shape.points.length < 2) break
      ctx.beginPath()
      ctx.moveTo(shape.points[0].x, shape.points[0].y)
      for (let i = 1; i < shape.points.length; i++) {
        ctx.lineTo(shape.points[i].x, shape.points[i].y)
      }
      ctx.stroke()
      break
    }

    default: break
  }
}

// dashed purple selection highlight
const drawSelection = (ctx, shape) => {
  ctx.save()
  ctx.strokeStyle = '#7c3aed'
  ctx.lineWidth   = 1.5
  ctx.setLineDash([5, 4])
  ctx.shadowColor = '#7c3aed'
  ctx.shadowBlur  = 6

  const pad = 8

  if (shape.type === 'circle') {
    const cx = shape.x + shape.width / 2
    const cy = shape.y + shape.height / 2
    ctx.beginPath()
    ctx.ellipse(cx, cy, Math.abs(shape.width / 2) + pad, Math.abs(shape.height / 2) + pad, 0, 0, Math.PI * 2)
    ctx.stroke()
  } else if (shape.type === 'line') {
    // for lines draw a highlight along the line
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