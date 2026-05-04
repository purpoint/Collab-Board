import { createSlice } from '@reduxjs/toolkit'

const cursorSlice = createSlice({
    name: 'cursors',
    initialState: {},
    reducers: {
        updateCursor: (state, action) => {
            const { userId, username, color, x, y } = action.payload
            state[userId] = { username, color, x, y, lastSeen: Date.now() }
        },
        removeCursor: (state, action) => {
            delete state[action.payload]
        }
    }
})

export const { updateCursor, removeCursor } = cursorSlice.actions
export default cursorSlice.reducer