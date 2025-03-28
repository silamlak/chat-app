import { IoCall, IoEllipsisVertical } from "react-icons/io5";
import { FaLongArrowAltLeft } from "react-icons/fa";
import Avatar from "./Avatar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DotsLoaderTyping } from "./Loader";
import Call from "./Call";
import CallButton from "./CallButton";
import ChatComponent from "./ChatComponent";

const ChatHeader = ({ userName, lastSeen, isOnline, isTyping = false }) => {

  const navigate = useNavigate();
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
        hour12: true,
      }); // "16:56"
    } else if (date > oneWeekAgo) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US");
    }
  };

  const handleToConversationList = () => {
    navigate("/");
  };

  return (
    <div className="sticky top-0 bg-slate-50 dark:bg-slate-900 flex items-center justify-between p-2 h-14">
      <div className="flex items-center space-x-2">
        <button className="mr-0 sm:mr-4 flex md:hidden cursor-pointer">
          <FaLongArrowAltLeft
            onClick={handleToConversationList}
            className="text-xl text-gray-600 dark:text-gray-300"
          />
        </button>
        <Avatar name={userName} size={40} isOnline={isOnline} />
        <h2 className="text-md normal-text font-semibold">{userName}</h2>
        {!isTyping && (
          <span className="text-[12px] text-gray-500 dark:text-gray-300">
            {isOnline ? "Online" : formatChatTimestamp(lastSeen)}
          </span>
        )}
        {isTyping && (
          <div className="flex justify-center items-center gap-1">
            <DotsLoaderTyping />
            <p className="text-[12px] text-blue-500">typing</p>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <button
          aria-label="Call"
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none"
        >
          {/* <ChatComponent /> */}
        </button>

        <button
          aria-label="More options"
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700  focus:outline-none"
        >
          <IoEllipsisVertical className="text-xl text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
