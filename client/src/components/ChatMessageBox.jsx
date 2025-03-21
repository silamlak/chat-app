import { useMutation, useQuery } from "@tanstack/react-query";
import { getMessages, sendMessage } from "../feature/chat/chatApi";
import { useDispatch, useSelector } from "react-redux";
import {
  addconversations,
  addInMineconversations,
  addMessages,
  clearMessage,
  pushConversation,
  pushMineMessage,
  selectconversation,
  updateLastMessageInConversation,
} from "../feature/chat/chatSlice";
import { useEffect, useState } from "react";
import socket from "../utils/socketConection";
import ChatHeader from "./ChatHeader";
import { useNavigate } from "react-router-dom";
import { DotsLoader } from "./Loader";
import { IoSend } from "react-icons/io5";

const ChatMessageBox = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const newFriend = useSelector((state) => state.chat.newFriend);
  const conversation = useSelector((state) => state.chat.selectedConversation);
  const conversations = useSelector((state) => state.chat.conversation);
  const chatFriend = useSelector((state) => state.chat.chatFriend);
  const myId = useSelector((state) => state.auth.userId);
  const [text, setText] = useState("");
  const navigate = useNavigate();

  // console.log(messages);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const { data: messageData, isLoading } = useQuery({
    queryKey: ["messages", conversation?._id],
    queryFn: () => getMessages(conversation?._id),
    enabled: !!conversation?._id,
  });

  useEffect(() => {
    if (messageData) {
      dispatch(addMessages(messageData?.messages));
    }
  }, [messageData, dispatch]);

  const mutation = useMutation({
    mutationFn: (text) => sendMessage(conversation?._id, text),
    onSuccess: (data) => {
      const body = {
        text,
        sender: myId,
        reciever: chatFriend?._id,
        createdAt: Date.now(),
      };

      dispatch(pushMineMessage(data?.message));
      dispatch(updateLastMessageInConversation(data?.message));

      const { conversationWithUser } = data;
      console.log(conversationWithUser);

      if (!conversationWithUser) {
        socket.emit("sendMessage", body);
      } else {
        navigate(`/${conversationWithUser._id}`);
        dispatch(selectconversation(conversationWithUser));
        const conversationData = {
          message: body,
          friendId: conversationWithUser?.friend?._id,
          sender: myId,
          friend: conversationWithUser?.friend,
          _id: conversationWithUser?._id,
        };
        dispatch(addInMineconversations(conversationData));

        console.log("Sending new conversation event", conversationData);
        socket.emit("sendNewConversation", conversationData);
      }
      setText("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      text,
      reciever: chatFriend?._id,
    };
    mutation.mutate(body);
  };

  console.log(conversations);

  return (
    <div>
      <div className="h-screen flex flex-col">
        <ChatHeader
          userName={conversation?.friend?.name || newFriend?.name}
          lastSeen={conversation?.friend?.isOnline || newFriend?.isOnline}
        />

        {isLoading && (
          <div className="text-center pt-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <DotsLoader />
          </div>
        )}

        <div className="p-4 flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-800">
          {!messages && (
            <p className="w-auto bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Select a user to chat
            </p>
          )}
          {messages?.map((message) => (
            <div
              key={message?._id}
              className={`mb-4 ${message?.sender === myId ? "text-right" : ""}`}
            >
              <div className="bg-slate-50 shadow dark:bg-slate-700 text-sm normal-text py-1 px-3 rounded-2xl inline-block">
                {message?.text}
              </div>
              <div className="text-sm text-gray-500 mt-1">10:00 AM</div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 border-2 border-slate-200 dark:border-slate-700 border-t-0 border-b-0 p-1  z-30 bg-slate-50 dark:bg-slate-900">
          <form onSubmit={(e) => handleSubmit(e)} className="flex">
            <input
              name="text"
              onChange={(e) => setText(e.target.value)}
              value={text}
              type="text"
              className="flex-1 rounded-l-lg p-2 focus:outline-none dark:text-slate-100 text-slate-800 dark:bg-slate-900 bg-slate-50"
              placeholder="Type your message..."
              autoComplete="off"
            />
            {text && (
              <button
                type="submit"
                className="bg-blue-400 dark:bg-blue-800 flex justify-center gap-1 items-center text-white p-2 rounded-r-lg"
              >
                <IoSend />
                <p>Send</p>
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageBox;
