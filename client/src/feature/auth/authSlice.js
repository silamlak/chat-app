import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    userId: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setUserId: (state, action) => {
            state.userId = action.payload
        },
        getUser: (state, action) => {
            state.user = action.payload
        },
        logout: (state) => {
            state.user = null
            state.userId = null;
        }

    },
})

export const { setUser, logout, setUserId } = authSlice.actions;

export default authSlice.reducer