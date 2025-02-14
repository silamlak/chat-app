import { useMutation, useQuery } from "@tanstack/react-query";
import { getMessages, sendMessage } from "../feature/chat/chatApi";
import { useDispatch, useSelector } from "react-redux";
import {
  addConversation,
  addMessages,
  clearMessage,
  pushMessages,
} from "../feature/chat/chatSlice";
import { useEffect, useState } from "react";
import socket from "../utils/socketConection";
import ChatHeader from "./ChatHeader";

const ChatMessageBox = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const userId = useSelector((state) => state.chat.selectedUser);
  const conversationId = useSelector((state) => state.chat.conversationId);
  const myId = useSelector((state) => state.auth.userId);
  const [text, setText] = useState("");

  useEffect(() => {
    dispatch(clearMessage());
  }, [userId, dispatch]);

  const { data: messageData, isLoading } = useQuery({
    queryKey: ["messages", userId],
    queryFn: () => getMessages(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (messageData) {
      dispatch(addMessages(messageData?.messages));
      dispatch(addConversation(messageData?.conversationId));
    }
  }, [messageData, dispatch]);

  const mutation = useMutation({
    mutationFn: (text) => sendMessage(conversationId, text),
    onSuccess: (data) => {
      console.log(data);
      const body = {
        text,
        sender: myId,
        reciever: userId,
      };
      socket.emit("sendMessage", body);
      dispatch(pushMessages(body));
      setText("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      text,
      reciever: userId,
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

        {isLoading && <div className="text-center text-gray-500">Loading</div>}

        <div className="p-4 overflow-y-auto bg-slate-200 dark:bg-slate-800">
          {!messages && (
            <div className="text-center text-gray-500">
              Select a user to chat
            </div>
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

        <div className="sticky bottom-0 p-1 bg-slate-100 dark:bg-slate-900">
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
