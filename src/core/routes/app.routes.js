import { Overview, Vaccinations, Cases, Deaths, Healthcare } from "../../pages";

// readonly array for all app routes
const appRoutes = Object.freeze([
  {
    name: "Overview",
    path: "/overview",
    element: <Overview />,
  },
  {
    name: "Vaccinations",
    path: "/vaccinations",
    element: <Vaccinations />,
  },
  {
    name: "Cases",
    path: "/cases",
    element: <Cases />,
  },
  {
    name: "Deaths",
    path: "/deaths",
    element: <Deaths />,
  },
  {
    name: "Healthcare",
    path: "/healthcare",
    element: <Healthcare />,
  },
]);

export default appRoutes;
