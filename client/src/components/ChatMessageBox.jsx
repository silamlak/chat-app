import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getMessages,
  sendMessage,
  updateReadMessage,
} from "../feature/chat/chatApi";
import { useDispatch, useSelector } from "react-redux";
import {
  addconversations,
  addInMineconversations,
  addMessages,
  changeconversation,
  clearMessage,
  pushConversation,
  pushMineMessage,
  selectconversation,
  updateLastMessageInConversation,
  updateMessageRead,
} from "../feature/chat/chatSlice";
import { useEffect, useRef, useState } from "react";
import socket from "../utils/socketConection";
import ChatHeader from "./ChatHeader";
import { useNavigate, useParams } from "react-router-dom";
import { DotsLoader } from "./Loader";
import { IoSend } from "react-icons/io5";
import { SiNike } from "react-icons/si";
import { useInView } from "react-intersection-observer";

const ChatMessageBox = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const newFriend = useSelector((state) => state.chat.newFriend);
  const conversation = useSelector((state) => state.chat.selectedConversation);
  const chatFriend = useSelector((state) => state.chat.chatFriend);
  const myId = useSelector((state) => state.auth.userId);
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const observers = useRef(new Map());
  const messageBoxRef = useRef(null);

  useEffect(() => {
    if (id) {
      dispatch(changeconversation(id));
      dispatch(clearMessage());
    }
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(clearMessage());
    inputRef.current?.focus();
  }, [dispatch]);

  const { data: messageData, isLoading } = useQuery({
    queryKey: ["messages", conversation?._id],
    queryFn: () => getMessages(conversation?._id),
    enabled: !!conversation?._id,
  });

  useEffect(() => {
    if (messageData) {
      dispatch(addMessages(messageData?.messages));
      if (messageBoxRef.current) {
        messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
        setReady(true);
      }
    }
  }, [messageData, dispatch]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      text,
      reciever: chatFriend?._id,
    };
    mutation.mutate(body);
  };

  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const messageDate = new Date(date);
    const formattedDate = messageDate.toISOString().split("T")[0];

    const formattedToday = today.toISOString().split("T")[0];
    const formattedYesterday = yesterday.toISOString().split("T")[0];

    if (formattedDate === formattedToday) return "Today";
    if (formattedDate === formattedYesterday) return "Yesterday";

    return messageDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

  let lastRenderedDate = null;

  const mutationUpdateRead = useMutation({
    mutationFn: (ids) => updateReadMessage(ids),
    onSuccess: (data) => {
      console.log(data);
      socket.emit("updateMessageRead", data);
      dispatch(updateMessageRead(conversation?._id));
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      const messageBox = messageBoxRef.current;
      if (messageBox) {
        const isAtBottom =
          messageBox.scrollHeight - messageBox.scrollTop ===
          messageBox.clientHeight;

        console.log("Scrolling...");
        console.log("scrollHeight:", messageBox.scrollHeight);
        console.log("scrollTop:", messageBox.scrollTop);
        console.log("clientHeight:", messageBox.clientHeight);
        console.log("isAtBottom:", isAtBottom);

        if (messageBox.scrollTop >= -3 && messageBox.scrollTop <= 1) {
          console.log("messages");
          const unreadMessages = messages.filter(
            (message) => message.sender !== myId && !message.isRead
          );

          console.log("Unread messages:", unreadMessages);

          if (unreadMessages.length > 0) {
            unreadMessages.forEach((message) => {
              console.log("Marking message as read:", message._id);
              mutationUpdateRead.mutate({
                conversationId: conversation?._id,
                messageId: message?._id,
              });
            });
          }
        }
      }
    };

    const messageBox = messageBoxRef.current;
    messageBox?.addEventListener("scroll", handleScroll);

    // Clean up on component unmount
    return () => {
      messageBox?.removeEventListener("scroll", handleScroll);
    };
  }, [messages, myId, mutationUpdateRead, conversation?._id]);
  return (
    <div>
      <div className="h-screen flex flex-col overflow-y-auto bg-slate-100 dark:bg-slate-800">
        <ChatHeader
          userName={conversation?.friend?.name || newFriend?.name}
          isOnline={conversation?.friend?.isOnline || newFriend?.isOnline}
          lastSeen={conversation?.friend?.lastSeen || newFriend?.lastSeen}
        />

        {isLoading && (
          <div className="text-center pt-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <DotsLoader />
          </div>
        )}

        <div className="p-4 flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-800 flex flex-col-reverse"  ref={messageBoxRef}>
          {!messages && (
            <p className="w-auto bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Select a user to chat
            </p>
          )}
          <div className="">
            {ready &&
              messages?.map((message) => {
                const messageDate = formatDate(message?.createdAt);
                const showHeader = messageDate !== lastRenderedDate; // Show header only if it's a new date

                lastRenderedDate = messageDate; // Update last rendered date

                return (
                  <div key={message?._id} data-id={message._id}>
                    {/* Date Header */}
                    {showHeader && (
                      <div className="text-gray-700 dark:text-slate-100 text-sm my-4 text-center flex justify-center items-center gap-1">
                        <p className="w-40 h-[1px] bg-slate-500"></p>
                        <p className="text-nowrap">{messageDate}</p>
                        <p className="w-40 h-[1px] bg-slate-500"></p>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`mt-4 ${
                        message?.sender === myId ? "text-right" : ""
                      }`}
                    >
                      <div className="flex-row items-center bg-slate-50 shadow dark:bg-slate-700 text-sm normal-text py-1 px-3 rounded-2xl inline-block">
                        <div className="flex flex-row items-center gap-1">
                          <div className="">{message?.text}</div>
                          {message?.sender === myId && (
                            <div className="">
                              {message?.isRead ? (
                                <div className="flex flex-col -gap-4">
                                  <SiNike className="text-blue-500 dark:text-slate-100 ml-[2px]" />
                                  <SiNike className="text-blue-500 dark:text-slate-100 -mt-[10px]" />
                                </div>
                              ) : (
                                <div className="flex flex-col -gap-4">
                                  <SiNike className="text-blue-500 dark:text-slate-100" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-[12px] text-gray-500 mx-2">
                        <span>
                          {new Date(message?.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="sticky bottom-0 border-2 border-slate-200 dark:border-slate-700 border-t-0 border-b-0 p-1 z-30 bg-slate-50 dark:bg-slate-900">
          <form onSubmit={(e) => handleSubmit(e)} className="flex">
            <input
              ref={inputRef}
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
