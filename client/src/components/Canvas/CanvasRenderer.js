export const renderBoard = (ctx, shapes, activeShape) => {
    const canvas = ctx.canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // background
    ctx.fillStyle = '#03050a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // dot grid
    ctx.fillStyle = 'rgba(22, 32, 53, 0.9)'
    const spacing = 28
    for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
            ctx.beginPath()
            ctx.arc(x, y, 0.8, 0, Math.PI * 2)
            ctx.fill()
        }
    }

    shapes.forEach(shape => drawShape(ctx, shape))
    if (activeShape) drawShape(ctx, activeShape)
}

const drawShape = (ctx, shape) => {
    ctx.strokeStyle = shape.strokeColor || '#06b6d4'
    ctx.fillStyle = shape.fillColor || 'transparent'
    ctx.lineWidth = shape.strokeWidth || 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    switch (shape.type) {
        case 'rect':
            ctx.beginPath()
            ctx.roundRect(shape.x, shape.y, shape.width, shape.height, 4)
            ctx.stroke()
            if (shape.fillColor && shape.fillColor !== 'transparent') ctx.fill()
            break

        case 'circle':
            ctx.beginPath()
            ctx.ellipse(
                shape.x + shape.width / 2,
                shape.y + shape.height / 2,
                Math.abs(shape.width / 2),
                Math.abs(shape.height / 2),
                0, 0, Math.PI * 2
            )
            ctx.stroke()
            if (shape.fillColor && shape.fillColor !== 'transparent') ctx.fill()
            break

        case 'line':
            ctx.beginPath()
            ctx.moveTo(shape.x, shape.y)
            ctx.lineTo(shape.x + shape.width, shape.y + shape.height)
            ctx.stroke()
            break

        default: break
    }
}