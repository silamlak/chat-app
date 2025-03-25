import { IoCall, IoEllipsisVertical } from "react-icons/io5";
import Avatar from "./Avatar";

const ChatHeader = ({ userName, lastSeen, isOnline }) => {
  //create date changer function
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

  return (
    <div className="sticky top-0 bg-slate-50 dark:bg-slate-900 flex items-center justify-between p-2 h-14">
      <div className="flex items-center space-x-2">
        <Avatar name={userName} size={40} isOnline={isOnline} />
        <h2 className="text-md normal-text font-semibold">{userName}</h2>
        <span className="text-[12px] text-gray-500 dark:text-gray-300">
          {isOnline ? "Online" : formatChatTimestamp(lastSeen)}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <button
          aria-label="Call"
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none"
        >
          <IoCall className="text-xl text-gray-600 dark:text-gray-300" />
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
