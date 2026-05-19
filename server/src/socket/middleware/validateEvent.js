export const validate = (socket, data, requiredFields) => {
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      socket.emit('error', { message: `Missing required field: ${field}` })
      return false
    }
  }
  return true
}

export const validateShape = (socket, shape) => {
  const validTypes = ['rect', 'circle', 'line', 'pencil']

  // shapeId is always required
  if (!shape.shapeId) {
    socket.emit('error', { message: 'Shape missing shapeId' })
    return false
  }

  // type must exist and be valid
  if (!shape.type || !validTypes.includes(shape.type)) {
    socket.emit('error', { message: `Invalid shape type: ${shape.type}` })
    return false
  }

  // pencil only needs points — no x/y/width/height required
  if (shape.type === 'pencil') {
    if (!shape.points || shape.points.length < 2) {
      socket.emit('error', { message: 'Pencil shape needs at least 2 points' })
      return false
    }
    return true
  }

  // all other shapes need x and y
  if (shape.x === undefined || shape.y === undefined) {
    socket.emit('error', { message: 'Shape missing x or y coordinates' })
    return false
  }

  return true
}