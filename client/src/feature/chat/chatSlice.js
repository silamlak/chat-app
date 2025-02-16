import { createSlice } from "@reduxjs/toolkit";

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
      console.log("Selected Conversation:", state.selectedConversation);
      console.log("Action Payload:", action.payload);

      if (!state.selectedConversation) {
        console.warn("No selected conversation found!");
        return;
      }

      if (!state.selectedConversation?.friend?._id) {
        console.warn("Selected conversation has no friend ID!");
        return;
      }

      if (action?.payload?.sender !== state.selectedConversation?.friend?._id) {
        console.warn("Sender does not match selected conversation friend ID!");
        return;
      }

      state.messages.push(action.payload);
      console.log("Message added:", action.payload);
    },
    pushMineMessage(state, action) {
      state.messages.push(action.payload);
    },

    addConversation(state, action) {
      state.conversationId = action.payload;
    },
    addChatFriend(state, action) {
      state.chatFriend = action.payload;
    },
    updateOnlineConversation(state, action){
      if(state.conversation){
        state.conversation.forEach((conversation) => {
          if (conversation.friend._id == action?.payload) {
            conversation.friend.isOnline = true;
          }
        });
      }
    },
    updateOfflineConversation(state, action){
      if(state.conversation){
        state.conversation.forEach((conversation) => {
          if(conversation.friend._id == action?.payload) {
            conversation.friend.isOnline = false
          }
        })
      }
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
  pushMineMessage,
  pushConversation,
  updateOnlineConversation,
  updateOfflineConversation,
} = chatSlice.actions;

export default chatSlice.reducer;
