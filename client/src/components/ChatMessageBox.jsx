import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "../feature/chat/chatApi";
import { useDispatch, useSelector } from "react-redux";
import { pushMessages } from "../feature/chat/chatSlice";
import { useState } from "react";

const ChatMessageBox = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const all = useSelector((state) => state.chat);
  const conversationId = useSelector((state) => state.chat.conversationId);
  const myId = useSelector((state) => state.auth.userId);
  const [text, setText] = useState("");
console.log(all)
  const mutation = useMutation({
    mutationFn: (text) => sendMessage(conversationId, text),
    onSuccess: (data) => {
      console.log(data);
      const body = {
        text,
        sender: myId,
      };
      dispatch(pushMessages(body));
      setText("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(text);
  };

  return (
    <div>
      <div className="">
        <div className="border-b p-4">
          <h2 className="text-xl font-semibold">Chat with User 1</h2>
        </div>

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
