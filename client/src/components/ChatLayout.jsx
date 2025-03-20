import { useEffect } from "react";
import ChatUsers from "./ChatUsers";
import { Outlet } from "react-router-dom";
import ChatUserss from "./ChatUserss";

const ChatLayout = () => {
  useEffect(() => {
    // to check if the detect windows screen size every time when also resized

  }, []);
  return (
    <div>
      <div className="md:flex z-50 h-screen hidden">
        <div className="w-1/4 h-screen bg-gray-50 dark:bg-slate-900 sticky top-0 overflow-y-auto">
          <ChatUserss />
        </div>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <div className="flex md:hidden h-screen ">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ChatLayout;
