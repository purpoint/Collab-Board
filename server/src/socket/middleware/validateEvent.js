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
  const required = ['shapeId', 'type']
  const validTypes = ['rect', 'circle', 'line', 'pencil']

  for (const field of required) {
    if (!shape[field]) {
      socket.emit('error', { message: `Shape missing field: ${field}` })
      return false
    }
  }

  if (!validTypes.includes(shape.type)) {
    socket.emit('error', { message: `Invalid shape type: ${shape.type}` })
    return false
  }

  return true
}