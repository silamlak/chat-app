import { IoCall, IoEllipsisVertical } from "react-icons/io5";
import Avatar from "./Avatar";

const ChatHeader = ({ userName, lastSeen }) => {
  return (
    <div className="sticky top-0 bg-slate-100 dark:bg-slate-900 flex items-center justify-between p-3">
      <div className="flex items-center space-x-2">
        <Avatar name={userName} size={40} />
        <h2 className="text-xl font-semibold dark:text-slate-50">{userName}</h2>
        <span className="text-sm text-gray-500 dark:text-gray-300">
          - Last seen: {lastSeen}
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
