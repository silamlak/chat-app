import React, { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import socket from "../utils/socketConection";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "../feature/chat/chatApi";
import {
  addInMineconversations,
  pushMineMessage,
  selectconversation,
  updateLastMessageInConversation,
} from "../feature/chat/chatSlice";
import { useNavigate } from "react-router-dom";
import { CircularLoader, DotsLoader, DotsLoaderTyping } from "./Loader";

const InputMessage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const conversation = useSelector((state) => state.chat.selectedConversation);
  const chatFriend = useSelector((state) => state.chat.chatFriend);
  const myId = useSelector((state) => state.auth.userId);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [dispatch]);

  const mutation = useMutation({
    mutationFn: (text) => sendMessage(conversation?._id, text),
    onSuccess: (data) => {
      const body = {
        text,
        sender: myId,
        reciever: chatFriend?._id,
        createdAt: new Date(Date.now()).toISOString(),
        _id: data?.message?._id,
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
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleOnChange = (value) => {
    setText(value);

    if (!typing) {
      setTyping(true);
      socket.emit("typing", { friendId: conversation?.friend, myId });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      socket.emit("stopTyping", { friendId: conversation?.friend, myId });
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      text,
      reciever: chatFriend?._id,
    };
    mutation.mutate(body);
    if (!text.trim()) return;
    setTyping(false);
    socket.emit("stopTyping", { friendId: conversation?.friend, myId });
  };

  return (
    <div>
      <div className="sticky bottom-0 border-2 border-slate-200 dark:border-slate-700 border-t-0 border-b-0 p-1 z-30 bg-slate-50 dark:bg-slate-900">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            ref={inputRef}
            name="text"
            onChange={(e) => handleOnChange(e.target.value)}
            value={text}
            type="text"
            className="flex-1 rounded-l-lg p-2 focus:outline-none dark:text-slate-100 text-slate-800 dark:bg-slate-900 bg-slate-50"
            placeholder="Type your message..."
            autoComplete="off"
          />
          {text && (
            <div className="">
              {!mutation.isPending && (
                <butoon
                  type="submit"
                  className="bg-blue-400 dark:bg-blue-800 flex justify-center gap-1 items-center text-white p-2 rounded-r-lg"
                >
                  <IoSend />
                  <p>Send</p>
                </butoon>
              )}

              {mutation.isPending && (
                <div className="flex justify-center gap-1 items-center text-white p-2 rounded-r-lg">
                  <DotsLoaderTyping />
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default InputMessage;
