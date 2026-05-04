import { configureStore } from '@reduxjs/toolkit'
import boardReducer from './boardSlice.js'
import shapesReducer from './shapesSlice.js'
import cursorReducer from './cursorSlice.js'

export const store = configureStore({
    reducer: {
        board: boardReducer,
        shapes: shapesReducer,
        cursors: cursorReducer
    }
})