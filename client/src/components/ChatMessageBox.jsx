import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getMessages,
  updateReadMessage,
} from "../feature/chat/chatApi";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessages,
  changeconversation,
  clearMessage,
  removeReadMessage,
  setUnreadMessages,
  setUnreadMessagesNull,
  updateMessageRead,
} from "../feature/chat/chatSlice";
import { useEffect, useRef, useState } from "react";
import socket from "../utils/socketConection";
import ChatHeader from "./ChatHeader";
import { useParams } from "react-router-dom";
import { DotsLoader } from "./Loader";
import { SiNike } from "react-icons/si";
import { FaArrowDownLong } from "react-icons/fa6";
import InputMessage from "./InputMessage";

const ChatMessageBox = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const newFriend = useSelector((state) => state.chat.newFriend);
  const conversation = useSelector((state) => state.chat.selectedConversation);
  const myId = useSelector((state) => state.auth.userId);
  const unread = useSelector((state) => state.chat.unreadMessages);
  const [isInBottom, setIsInBottom] = useState(false);
  const { id } = useParams();
  const [ready, setReady] = useState(false);
  const messageBoxRef = useRef(null);

  useEffect(() => {
    if (id) {
      dispatch(changeconversation(id));
      dispatch(clearMessage());
    }
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const { data: messageData, isLoading } = useQuery({
    queryKey: ["messages", conversation?._id],
    queryFn: () => getMessages(conversation?._id),
    enabled: !!conversation?._id,
  });

  useEffect(() => {
    dispatch(setUnreadMessagesNull());
    if (messageData) {
      const unreadMessages = messageData?.messages?.filter(
        (message) => message.sender !== myId && !message.isRead
      );
      dispatch(setUnreadMessages(unreadMessages));
      dispatch(addMessages(messageData?.messages));
      if (messageBoxRef?.current) {
        messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
        setReady(true);
        setIsInBottom(true);
      }
    }
  }, [messageData, dispatch, myId]);

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
      dispatch(removeReadMessage(data));
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      const messageBox = messageBoxRef.current;
      if (messageBox) {
        if (messageBox.scrollTop >= -3 && messageBox.scrollTop <= 1) {
          setIsInBottom(true);
          const unreadMessages = messages.filter(
            (message) => message.sender !== myId && !message.isRead
          );
          if (unreadMessages.length > 0) {
            unreadMessages.forEach((message) => {
              mutationUpdateRead.mutate({
                conversationId: conversation?._id,
                messageId: message?._id,
              });
            });
          }
        } else {
          setIsInBottom(false);
        }
      }
    };

    const messageBox = messageBoxRef.current;
    messageBox?.addEventListener("scroll", handleScroll);
    // const callInterval = setTimeout(handleScroll, 1000);

    return () => {
      messageBox?.removeEventListener("scroll", handleScroll);
      // clearTimeout(callInterval)
    };
  }, [messages, myId, mutationUpdateRead, conversation?._id]);

  const handleToBottom = () => {
    messageBoxRef.current?.scrollTo({
      top: messageBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  };
  // console.log(messages)

  return (
    <div>
      <div className="h-screen flex flex-col overflow-y-auto bg-slate-100 dark:bg-slate-800">
        <ChatHeader
          isTyping={conversation?.isTyping || false}
          userName={conversation?.friend?.name || newFriend?.name}
          isOnline={conversation?.friend?.isOnline || newFriend?.isOnline}
          lastSeen={conversation?.friend?.lastSeen || newFriend?.lastSeen}
        />

        {isLoading && (
          <div className="text-center pt-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <DotsLoader />
          </div>
        )}

        <div
          className="p-4 flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-800 flex flex-col-reverse relative"
          ref={messageBoxRef}
        >
          {!messages && (
            <p className="w-auto bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Select a user to chat
            </p>
          )}
          <div className="p-2 w-full fixed bottom-16 left-2">
            {!isInBottom && ready && unread?.length > 0 && (
              <p className="flex justify-center items-center w-6 h-6 text-[12px] rounded-full bg-blue-300 dark:bg-blue-800 text-slate-700 dark:text-slate-300 sticky bottom-2 left-2 text-right shadow-2xl">
                {unread?.length}
              </p>
            )}
            {!isInBottom && ready && (
              <button
                onClick={handleToBottom}
                className="mt-1 flex justify-center items-center w-6 h-6 text-[12px] rounded-full bg-blue-300 dark:bg-blue-800 text-slate-700 dark:text-slate-300 sticky bottom-2 left-2 text-right shadow-2xl"
              >
                <FaArrowDownLong />
              </button>
            )}
          </div>
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
        <InputMessage />
      </div>
    </div>
  );
};

export default ChatMessageBox;
