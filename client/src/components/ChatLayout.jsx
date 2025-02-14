import ChatUsers from "./ChatUsers";
import { Outlet } from "react-router-dom";

const ChatLayout = () => {
  return (
    <div className="flex h-screen">
      <aside className="w-1/4 h-screen bg-gray-50 dark:bg-slate-900 sticky top-0 overflow-y-auto">
        <ChatUsers />
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default ChatLayout;
