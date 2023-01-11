import { createBrowserRouter, Navigate } from "react-router-dom";
import appRoutes from "../core/routes/app.routes";
import AppLayout from "../layouts/appLayout";
import { ErrorElement, Info } from "../pages";

// route hook to be used the react-router createBrowser function
const useAppRoutes = () => {
  const appChildren = appRoutes.map(({ path, element }) => ({ path, element }));
  appChildren.push({
    path: "",
    element: <Navigate to={"/overview"} replace />,
  });

  const routes = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: appChildren,
      errorElement: <ErrorElement />,
    },
    {
      path: "/info",
      element: <Info />,
      errorElement: <ErrorElement />,
    },
  ]);
  return routes;
};

export default useAppRoutes;
