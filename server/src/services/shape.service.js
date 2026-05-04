import Shape from '../models/Shape.js'

export const createShape = async (shapeData) => {
    const shape = new Shape(shapeData)
    await shape.save()
    return shape
}

export const updateShape = async (shapeId, boardId, updates) => {
    const shape = await Shape.findOneAndUpdate(
        { shapeId, boardId },
        { ...updates, updatedAt: new Date() },
        { new: true }
    )
    return shape
}

export const deleteShape = async (shapeId, boardId) => {
    const shape = await Shape.findOneAndUpdate(
        { shapeId, boardId },
        { isDeleted: true },
        { new: true }
    )
    return shape
}

export const getBoardShapes = async (boardId) => {
    return await Shape.findActiveByBoard(boardId)
}