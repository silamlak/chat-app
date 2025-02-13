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
      <div className="">
        <div className="border-b p-4">
          <h2 className="text-xl font-semibold">Chat with User 1</h2>
        </div>

        {isLoading && <div className="text-center text-gray-500">Loading</div>}

        <div className="p-4 overflow-y-auto">
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
              <div className="bg-blue-100 p-2 rounded-lg inline-block">
                {message?.text}
              </div>
              <div className="text-sm text-gray-500 mt-1">10:00 AM</div>
            </div>
          ))}
        </div>

        <div className="border-t p-4">
          <form onSubmit={(e) => handleSubmit(e)} className="flex">
            <input
              name="text"
              onChange={(e) => setText(e.target.value)}
              value={text}
              type="text"
              className="flex-1 border rounded-l-lg p-2"
              placeholder="Type your message..."
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
