import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getconversations,
  getNewUsers,
  updateReadMessage,
} from "../feature/chat/chatApi";
import {
  addChatFriend,
  addconversations,
  selectconversation,
  updateMessageRead,
} from "../feature/chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Theme from "../utils/theme";
import Avatar from "./Avatar";
import socket from "../utils/socketConection";
import NewFriens from "./NewFriens";
import UserchatSearch from "./UserchatSearch";
import { CircularLoader } from "./Loader";

const ChatUsers = () => {
 const navigate = useNavigate();
 const isLoadingStatus = useSelector((state) => state.loader.isLoading);
 const conversations = useSelector((state) => state.chat.conversation) || [];
 const selectedConversation = useSelector(
   (state) => state.chat.selectedConversation
 );
 const myId = useSelector((state) => state.auth.userId);
 const dispatch = useDispatch();

 const { data } = useQuery({
   queryKey: ["conversations"],
   queryFn: getconversations,
 });

 useEffect(() => {
   socket.on("recieveupdateMessageRead", (data) => {
     dispatch(updateMessageRead(data?.conversationId));
   });
 }, [dispatch]);

 useEffect(() => {
   if (data) {
     dispatch(addconversations(data));
   }
 }, [data, dispatch]);

 const mutation = useMutation({
   mutationFn: (ids) => updateReadMessage(ids),
   onSuccess: (data) => {
     console.log(data);
     socket.emit("updateMessageRead", data);
     dispatch(updateMessageRead(selectedConversation?._id));
   },
 });

 const handleUserClick = (conversation) => {
   if (!conversation) return;
   dispatch(selectconversation(conversation));
   dispatch(addChatFriend(conversation?.friend));
   navigate(`/${conversation?._id}`);
   if (!conversation?.message?.isRead) {
     mutation.mutate({
       conversationId: conversation?._id,
       messageId: conversation?.message?._id,
     });
   }
 };
  return (
    <div className="relative block md:hidden">
      <div className="flex justify-center gap-2 p-2 items-center">
        <div className="flex items-center justify-center gap-2">
          <Theme />
          <NewFriens />
        </div>
        <UserchatSearch />
        {isLoadingStatus && <CircularLoader />}
      </div>
      <div className="dark:text-slate-50 p-4 overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Contacts</h2>
          <ul>
            {Array.isArray(conversations) &&
              conversations &&
              conversations?.map((conversation) => (
                <li
                  key={conversation?._id}
                  onClick={() => handleUserClick(conversation)}
                  className="flex items-center p-2 rounded-sm bg-slate-100 dark:bg-slate-800 mb-1 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-none duration-300"
                >
                  <Avatar
                    name={conversation?.friend?.name}
                    imageUrl={conversation?.friend?.imageUrl}
                    size={50}
                    isOnline={conversation?.friend?.isOnline}
                  />
                  <div>
                    <h3 className="font-semibold">
                      {conversation?.friend?.name}
                    </h3>
                    {conversation?.message?.sender == myId && (
                      <div className="relative">
                        <p className={` whitespace-nowrap `}>
                          {conversation?.message?.text}
                        </p>
                        {conversation?.message?.isRead ? (
                          <p>Read</p>
                        ) : (
                          <p>Not-Read</p>
                        )}
                      </div>
                    )}
                    <p
                      className={` whitespace-nowrap ${
                        conversation?.message?.isRead ? `text-sm` : `font-bold`
                      } `}
                    >
                      {conversation?.message?.text}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatUsers;
