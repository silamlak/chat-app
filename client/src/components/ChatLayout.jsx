import { Outlet } from "react-router-dom";
import ChatUserss from "./ChatUserss";

const ChatLayout = () => {
  return (
    <div className="font-[Lato]">
      <div className="md:flex z-50 h-screen hidden">
        <div className="w-1/4 h-screen custom-base sticky top-0 overflow-y-auto overflow-x-hidden">
          <ChatUserss />
        </div>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <div className="flex md:hidden h-screen ">
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ChatLayout;
