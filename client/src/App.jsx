import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ChatLayout from "./components/ChatLayout";
import ChatMessageBox from "./components/ChatMessageBox";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import socket from "./utils/socketConection";

const App = () => {
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    socket.emit("join", userId);
  }, [userId]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ChatLayout />,
      children: [
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
