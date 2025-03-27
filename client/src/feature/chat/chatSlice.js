import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversation: [],
  messages: [],
  selectedConversation: null,
  conversationId: null,
  chatFriend: null,
  newFriend: null,
  unreadMessages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    selectconversation(state, action) {
      state.selectedConversation = action.payload;
    },
    changeconversation(state, action) {
      if (state?.conversation) {
        // console.log(state.conversation)
        const conversation = state.conversation?.find(
          (conversation) => conversation._id === action.payload
        );
        state.selectedConversation = conversation;
      }
    },

    updateTyping(state, action) {
      state.conversation = state.conversation.map((c) =>
        c.friend._id === action.payload ? { ...c, isTyping: true } : c
      );
      if(state.selectedConversation && state.selectedConversation.friend._id === action.payload){
        state.selectedConversation = {...state.selectedConversation, isTyping: true}
      }
    },
    updateStopTyping(state, action) {
      state.conversation = state.conversation.map((c) =>
        c.friend._id === action.payload ? { ...c, isTyping: false } : c
      );
      if (
        state.selectedConversation &&
        state.selectedConversation.friend._id === action.payload
      ) {
        state.selectedConversation = {
          ...state.selectedConversation,
          isTyping: false,
        };
      }
    },
    addNewFriend(state, action) {
      state.newFriend = action.payload;
    },
    setUnreadMessages(state, action) {
      state.unreadMessages = action.payload;
    },
    addUnreadMessage(state, action) {
      state.unreadMessages.push(action.payload);
    },
    removeReadMessage(state, action) {
      state.unreadMessages = state.unreadMessages.filter(
        (message) => message._id !== action.payload._id
      );
    },
    setUnreadMessagesNull(state) {
      state.unreadMessages = [];
    },
    addconversations(state, action) {
      state.conversation = action.payload;
    },
    addInMineconversations(state, action) {
      state.conversation.push(action.payload);
    },
    pushConversation(state, action) {
      console.log(action.payload);
      if (!Array.isArray(state.conversation)) {
        state.conversation = [];
      }

      if (state.conversation.length === 0) {
        state.conversation = [action.payload];
      } else {
        state.conversation.push(action.payload);
      }
    },
    addMessages(state, action) {
      state.messages = action.payload;
    },
    pushMessages(state, action) {
      // if (!state.selectedConversation) {
      //   console.warn("No selected conversation found!");
      //   return;
      // }

      // if (!state.selectedConversation?.friend?._id) {
      //   console.warn("Selected conversation has no friend ID!");
      //   return;
      // }

      // if (action?.payload?.sender !== state.selectedConversation?.friend?._id) {
      //   console.warn("Sender does not match selected conversation friend ID!");
      //   return;
      // }

      state.conversation.map((c) => {
        c.participants.map((participant) => {
          if (participant === action?.payload?.sender) {
            c.message = action.payload;
            state.messages.push(action.payload);
          }
        });
      });
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
    clearChatFriend(state) {
      state.chatFriend = null;
    },
    updateOnlineConversation(state, action) {
      if (state.conversation) {
        state.conversation.forEach((conversation) => {
          if (conversation.friend._id == action?.payload) {
            conversation.friend.isOnline = true;
          }
        });

        if (state.selectedConversation?.friend?._id == action?.payload) {
          state.selectedConversation.friend.isOnline = true;
        }
      }
    },
    updateOfflineConversation(state, action) {
      if (state.conversation) {
        state.conversation.forEach((conversation) => {
          if (conversation.friend._id == action?.payload) {
            conversation.friend.isOnline = false;
          }
        });

        if (state.selectedConversation?.friend?._id == action?.payload) {
          state.selectedConversation.friend.isOnline = false;
        }
      }
    },
    updateLastMessageInConversation(state, action) {
      if (state.conversation) {
        state.conversation.forEach((conversation) => {
          if (conversation._id == action?.payload?.conversationId) {
            conversation.message = action.payload;
          }
        });
      }
    },
    updateMessageRead(state, action) {
      if (state.conversation) {
        state.conversation.forEach((conversation) => {
          if (conversation._id == action?.payload) {
            conversation.message.isRead = true;
          }
        });
        state.messages.forEach((message) => {
          if (message.isRead === false) {
            message.isRead = true;
          }
        });
      }
    },

    clearMessage(state) {
      state.messages = [];
    },
    clearSelecetedConversation(state) {
      state.selectedConversation = null;
    },
  },
});

export const {
  selectconversation,
  changeconversation,
  addconversations,
  addMessages,
  addConversation,
  pushMessages,
  clearMessage,
  addChatFriend,
  clearChatFriend,
  pushMineMessage,
  pushConversation,
  updateOnlineConversation,
  updateOfflineConversation,
  updateLastMessageInConversation,
  updateMessageRead,
  clearSelecetedConversation,
  addInMineconversations,
  addNewFriend,
  setUnreadMessagesNull,
  removeReadMessage,
  addUnreadMessage,
  setUnreadMessages,
  updateStopTyping,
  updateTyping,
} = chatSlice.actions;

export default chatSlice.reducer;
