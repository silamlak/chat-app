import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  conversation: [],
  messages: [],
  selectedConversation: null,
  conversationId: null,
  chatFriend: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    selectconversation(state, action) {
      state.selectedConversation = action.payload;
    },
    addconversations(state, action) {
      state.conversation = action.payload;
    },
    pushConversation(state, action) {
      state.conversation.push(action.payload);
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
    addChatFriend(state, action) {
      state.chatFriend = action.payload;
    },

    clearMessage(state) {
      state.messages = [];
    },
  },
});

export const {
  selectconversation,
  addconversations,
  addMessages,
  addConversation,
  pushMessages,
  clearMessage,
  addChatFriend,
  pushConversation,
} = chatSlice.actions;

export default chatSlice.reducer;