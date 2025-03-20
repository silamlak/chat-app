import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ChatLayout from "./components/ChatLayout";
import ChatMessageBox from "./components/ChatMessageBox";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import socket from "./utils/socketConection";
import { updateOfflineConversation, updateOnlineConversation } from "./feature/chat/chatSlice";
import ChatUsers from "./components/ChatUsers";

// import {io} from 'socket.io-client'
// const socket = io("http://localhost:5500");

const App = () => {
  const dispatch = useDispatch()
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    socket.emit("join", userId);
    socket.on("onlineUserRecieve", (id) => {
      console.log(id);
      dispatch(updateOnlineConversation(id));
    });
    socket.on("offlineUserRecieve", (id) => {
      console.log("Offline", id);
      dispatch(updateOfflineConversation(id));
    });
  }, [userId, dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ChatLayout />,
      children: [
        {
          path: "/",
          element: <ChatUsers />,
        },
        {
          path: "/:id",
          element: <ChatMessageBox />,
        },
      ],
    },
    {
      path: "/sign-up",
      element: <SignUp />,
    },
    {
      path: "/sign-in",
      element: <SignIn />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
