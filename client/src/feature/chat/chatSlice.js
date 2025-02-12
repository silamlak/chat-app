import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    users: [],
    selectedUser: null,
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        selectUser(state, action) {
            state.selectedUser = action.payload;
        },
        addUser(state, action) {
            state.users = action.payload;
        },
    },
});

export const { selectUser, addUser } = chatSlice.actions;

export default chatSlice.reducer;