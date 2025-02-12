import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/about",
      element: <h1>about</h1>,
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
