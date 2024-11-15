import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy } from "react";
import { profileLoader } from "./loaders/profileLoader";
import { homeLoader } from "./loaders/homeLoader";

const Error = lazy(() => import("./views/Error/Error"));
const Home = lazy(() => import("./views/Home/Home"));
const RootLayout = lazy(() => import("./components/Layout/RootLayout"));
const Profile = lazy(() => import("./views/Profile/Profile"));
const Quizzes = lazy(() => import("./views/Quizzes/Quizzes"));
const Ranking = lazy(() => import("./views/Ranking/Ranking"));

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <Error />,
      children: [
        { index: true, element: <Home />, loader: homeLoader },
        {
          path: "profile/:userId",
          element: <Profile />,
          loader: profileLoader,
        },
        {
          path: "quizzes",
          element: <Quizzes />,
        },
        {
          path: "ranking",
          element: <Ranking />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
