import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getconversations, updateReadMessage } from "../feature/chat/chatApi";
import {
  addChatFriend,
  addconversations,
  clearMessage,
  clearSelecetedConversation,
  selectconversation,
  updateMessageRead,
} from "../feature/chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Theme from "../utils/Theme";
import Avatar from "./Avatar";
import socket from "../utils/socketConection";
import NewFriens from "./NewFriens";
import UserchatSearch from "./UserchatSearch";
import { CircularLoader } from "./Loader";
import { SiNike } from "react-icons/si";
import { setLoading } from "../feature/loaderSlice";

const ChatUserss = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isLoadingStatus = useSelector((state) => state.loader.isLoading);
  const conversations = useSelector((state) => state.chat.conversation) || [];
  const selectedConversation = useSelector(
    (state) => state.chat.selectedConversation
  );
  const myId = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["conversations"],
    queryFn: getconversations,
  });

  const currentUrl = location.pathname;

  const isValidFormat = /^\/[0-9a-fA-F]{24}$/.test(currentUrl);

  useEffect(() => {
    if (!isValidFormat) {
      dispatch(clearSelecetedConversation());
    }
  }, [dispatch, isValidFormat]);

  useEffect(() => {
    if (data) {
      dispatch(addconversations(data));
    }
  }, [data, dispatch]);

  const mutation = useMutation({
    mutationFn: (ids) => updateReadMessage(ids),
    onSuccess: (data) => {
      socket.emit("updateMessageRead", data);
      dispatch(updateMessageRead(selectedConversation?._id));
    },
  });

  const handleUserClick = (conversation) => {
    if (!conversation) return;
    if (id === conversation?._id) return;
    dispatch(selectconversation(conversation));
    dispatch(addChatFriend(conversation?.friend));
    dispatch(clearMessage());
    navigate(`/${conversation?._id}`);
    if (
      !conversation?.message?.isRead &&
      conversation?.message?.sender !== myId
    ) {
      mutation.mutate({
        conversationId: conversation?._id,
        messageId: conversation?.message?._id,
      });
    }
  };

  const formatChatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }); // "16:56"
    } else if (date > oneWeekAgo) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US");
    }
  };
  const truncateText = (text, maxLength) => {
    return text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [conversations, isLoading, dispatch]);

  return (
    <div>
      <div className="reltive z-10 w-full overflow-x-hidden">
        <div className="flex justify-center gap-2 p-2 items-center h-14">
          <div className="flex items-center justify-center gap-2">
            <Theme />
            <NewFriens />
          </div>
          <UserchatSearch />
          {isLoadingStatus && <CircularLoader />}
        </div>
        <div className="dark:text-slate-50 p- overflow-y-auto">
          <div className="mb-4">
            {isError && error && (
              <div className="flex justify-center mt-6">
                <h2 className="text-sm normal-text font-semibold mb-2">
                  Unable to fetch conversations
                </h2>
              </div>
            )}
            {conversations && !isError && (
              <ul>
                {Array.isArray(conversations) &&
                  conversations &&
                  conversations?.map((conversation) => (
                    <li
                      key={conversation?._id}
                      onClick={() => handleUserClick(conversation)}
                      className={`${
                        selectedConversation?._id === conversation?._id
                          ? "bg-blue-200 dark:bg-blue-900"
                          : "bg-slate-100 dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      } relative flex items-center p-2 cursor-pointer transition-none duration-300 mb-1`}
                    >
                      <Avatar
                        name={conversation?.friend?.name}
                        imageUrl={conversation?.friend?.imageUrl}
                        size={40}
                        isOnline={conversation?.friend?.isOnline}
                      />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-200">
                          {conversation?.friend?.name}
                        </h3>
                        <div>
                          <p className="text-[10px] absolute small-text top-[22px] -translate-y-1/2 right-2">
                            {formatChatTimestamp(
                              conversation?.message?.createdAt
                            )}
                          </p>
                        </div>
                        {conversation?.message?.sender == myId && (
                          <div className="">
                            {conversation?.message?.isRead ? (
                              <div>
                                <div>
                                  <SiNike className="text-blue-500 absolute top-6 -translate-y-1/2 right-10" />
                                  <SiNike className="text-blue-500 absolute top-5 -translate-y-1/2 right-[38px]" />
                                </div>
                              </div>
                            ) : (
                              <div>
                                <SiNike className="text-blue-500 absolute top-6 -translate-y-1/2 right-10" />
                              </div>
                            )}
                          </div>
                        )}
                        <p
                          className={`w-full overflow-hidden text-ellipsis whitespace-nowrap text-slate-700 dark:text-slate-300 ${
                            conversation?.message?.sender !== myId &&
                            !conversation?.message?.isRead
                              ? "text-sm font-semibold"
                              : "text-sm font-normal"
                          }  `}
                        >
                          {truncateText(conversation?.message?.text, 22)}
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUserss;
