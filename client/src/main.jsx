import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {Toaster} from "react-hot-toast";

import { Provider } from "react-redux";
import store from "./app/store.js";

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
        <Toaster />
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
