import React from "react";
import { RouterProvider } from "react-router-dom";
import { AppProvider } from "./contexts";
import { useAppRoutes } from "./hooks";

function App() {
  const router = useAppRoutes();

  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default App;
