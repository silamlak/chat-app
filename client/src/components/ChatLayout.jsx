import { Outlet, useLocation } from "react-router-dom";
import ChatUserss from "./ChatUserss";
import { useEffect } from "react";
import socket from "../utils/socketConection";
import {
  addUnreadMessage,
  pushConversation,
  pushMessages,
  updateMessageRead,
  updateOfflineConversation,
  updateStopTyping,
  updateTyping,
} from "../feature/chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "./Avatar";
import SignOut from "./SignOut";
import {
  requestNotificationPermission,
  showNotification,
} from "../utils/notifications";

const ChatLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const conversations = useSelector((state) => state.chat.conversation);

  const locationPath = location.pathname;
  //granting notification
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  //receive messages
  useEffect(() => {
    socket.on("recieveMessage", (data) => {
      dispatch(pushMessages(data));
      dispatch(addUnreadMessage(data));
      conversations.map((conversation) => {
        if (conversation.friend._id === data.sender) {
          showNotification(conversation.friend.name, data.text);
        }
      });
    });
    return () => {
      socket.off("recieveMessage");
    };
  }, [dispatch, conversations]);

  //receive new conversation
  useEffect(() => {
    socket.on("recieveNewConversation", (data) => {
      dispatch(pushConversation(data));
    });
    return () => {
      socket.off("recieveNewConversation");
    };
  }, [dispatch]);

  //receive update message read
  useEffect(() => {
    socket.on("recieveupdateMessageRead", (data) => {
      dispatch(updateMessageRead(data?.conversationId));
    });
    return () => {
      socket.off("recieveupdateMessageRead");
    };
  }, [dispatch]);

  //typing effect
  useEffect(() => {
    socket.on("userTyping", (data) => {
      dispatch(updateTyping(data?.myId));
    });
    socket.on("userStoppedTyping", (data) => {
      dispatch(updateStopTyping(data?.myId));
    });
    return () => {
      socket.off("userStoppedTyping");
      socket.off("userTyping");
    };
  }, [dispatch]);

  // useEffect(() => {
  //   const sendHeartbeat = () => {
  //     socket.emit("heartbeat", userId);
  //   };

  //   socket.on("offlineUserRecieve", (id) => {
  //         console.log({id, userId})
  //         dispatch(updateOfflineConversation(id));
  //       });

  //   const heartbeatInterval = setInterval(sendHeartbeat, 3000);

  //   return () => {
  //     clearInterval(heartbeatInterval);
  //     // socket.disconnect();
  //   };
  // }, [dispatch, userId]);
  return (
    <div className="font-[Lato]">
      <div className="md:flex z-50 h-screen hidden">
        <div className="w-1/4 h-screen custom-base sticky flex flex-col justify-between top-0 overflow-y-auto overflow-x-hidden">
          <ChatUserss />
          <div className="bg-blue-300 p-2 flex justify-between items-center">
            <Avatar />
            <SignOut />
          </div>
        </div>
        <main className="flex-1 overflow-y-auto">
          {locationPath === "/" && (
            <div className="w-full h-screen flex justify-center items-center bg-slate-100 dark:bg-slate-800">
              <div className="p-2 bg-slate-50 shadow dark:bg-slate-700 rounded-4xl">
                <p className="small-text text-[14px]">Start Conversation</p>
              </div>
            </div>
          )}
          <Outlet />
        </main>
      </div>
      <div className="flex md:hidden h-screen">
        <main className="flex-1 overflow-y-auto w-full bg-slate-700 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ChatLayout;
