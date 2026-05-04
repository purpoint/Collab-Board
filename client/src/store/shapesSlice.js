import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'

const shapesAdapter = createEntityAdapter({
    selectId: (shape) => shape.shapeId
})

const shapesSlice = createSlice({
    name: 'shapes',
    initialState: shapesAdapter.getInitialState(),
    reducers: {
        setAllShapes: shapesAdapter.setAll,
        addShape: shapesAdapter.upsertOne,
        updateShape: shapesAdapter.upsertOne,
        removeShape: shapesAdapter.removeOne
    }
})

export const { setAllShapes, addShape, updateShape, removeShape } = shapesSlice.actions
export const shapesSelectors = shapesAdapter.getSelectors((state) => state.shapes)
export default shapesSlice.reducer