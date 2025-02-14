import { useMutation, useQuery } from "@tanstack/react-query";
import { getMessages, sendMessage } from "../feature/chat/chatApi";
import { useDispatch, useSelector } from "react-redux";
import {
  addChatFriend,
  addMessages,
  clearMessage,
  pushConversation,
  pushMessages,
} from "../feature/chat/chatSlice";
import { useEffect, useState } from "react";
import socket from "../utils/socketConection";
import ChatHeader from "./ChatHeader";
import { useNavigate } from "react-router-dom";

const ChatMessageBox = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const conversation = useSelector((state) => state.chat.selectedConversation);
  const chatFriend = useSelector((state) => state.chat.chatFriend);
  const myId = useSelector((state) => state.auth.userId);
  const [text, setText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearMessage());
  }, [conversation, dispatch]);

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
      };
      socket.emit("sendMessage", body);
      dispatch(pushMessages(body));
      const {conversationWithUser} = data
      if (conversationWithUser){
        dispatch(pushConversation(data?.conversationWithUser));
        dispatch(addChatFriend(data?.conversationWithUser?.friend));
        navigate(`/${data?.conversationWithUser._id}`);
        socket.emit("sendNewConversation", {
          message: data?.conversationWithUser,
          friendId: data?.conversationWithUser?.friend?._id,
        });
      }
      setText("");
    },
  });

  useEffect(() => {
    socket.on('recieveNewConversation', (data) => {
      console.log(data)
      dispatch(pushConversation(data));
    })
    return () => {
      socket.off("recieveNewConversation");
    }
  }, [dispatch])

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      text,
      reciever: chatFriend?._id,
    };
    mutation.mutate(body);
  };

  useEffect(() => {
    socket.on("recieveMessage", (data) => {
      dispatch(pushMessages(data));
    });
    return () => {
      socket.off("recieveMessage");
    };
  }, [dispatch]);

  return (
    <div>
      <div className="h-screen flex flex-col">
        <ChatHeader userName="User 1" lastSeen="2 hours ago" />

        {isLoading && (
          <div className="text-center bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Loading
          </div>
        )}

        <div className="p-4 flex-1 overflow-y-auto bg-slate-200 dark:bg-slate-800">
          {!messages && (
            <p className="w-auto bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Select a user to chat
            </p>
          )}
          {messages?.map((message) => (
            <div
              key={message?._id}
              className={`mb-4 ${message?.sender === myId ? "text-right" : ""}`}
            >
              <div className="bg-lime-50 dark:bg-blue-400 text-sm p-2 rounded-2xl inline-block">
                {message?.text}
              </div>
              <div className="text-sm text-gray-500 mt-1">10:00 AM</div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 p-1  z-30 bg-slate-100 dark:bg-slate-900">
          <form onSubmit={(e) => handleSubmit(e)} className="flex">
            <input
              name="text"
              onChange={(e) => setText(e.target.value)}
              value={text}
              type="text"
              className="flex-1 rounded-l-lg p-2 focus:outline-none dark:text-white"
              placeholder="Type your message..."
              autoComplete="off"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-r-lg"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageBox;
