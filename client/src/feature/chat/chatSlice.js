import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    users: [],
    messages: [],
    selectedUser: null,
    conversationId: null,
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    selectUser(state, action) {
      state.selectedUser = action.payload;
    },
    addUser(state, action) {
      state.users = action.payload;
    },
    addMessages(state, action) {
      state.messages = action.payload;
    },
    pushMessages(state, action) {
      state.messages.push(action.payload);
    },
    addConversation(state, action) {
      state.conversationId = action.payload;
    },

    clearMessage(state) {
      state.messages = [];
    }
  },
});

export const {
  selectUser,
  addUser,
  addMessages,
  addConversation,
  pushMessages,
  clearMessage,
} = chatSlice.actions;

export default chatSlice.reducer;