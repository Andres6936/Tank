import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./routes/App";
import WaterContextProvider from "./context/WaterContext.tsx";
import "@master/keyframes.css";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <WaterContextProvider>
      <RouterProvider router={router} />
    </WaterContextProvider>
  </React.StrictMode>,
);
