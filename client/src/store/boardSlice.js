import { createSlice } from '@reduxjs/toolkit'

const boardSlice = createSlice({
    name: 'board',
    initialState: {
        boardId: null,
        name: null,
        status: 'idle'
    },
    reducers: {
        setBoard: (state, action) => {
            state.boardId = action.payload.boardId
            state.name = action.payload.name
            state.status = 'joined'
        },
        clearBoard: (state) => {
            state.boardId = null
            state.name = null
            state.status = 'idle'
        }
    }
})

export const { setBoard, clearBoard } = boardSlice.actions
export default boardSlice.reducer