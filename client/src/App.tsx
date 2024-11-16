import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy } from "react";
import { profileLoader } from "./loaders/profileLoader";
import { homeLoader } from "./loaders/homeLoader";

// Lazy-loaded components
const Error = lazy(() => import("./views/Error/Error"));
const Home = lazy(() => import("./views/Home/Home"));
const RootLayout = lazy(() => import("./components/Layout/RootLayout"));
const Profile = lazy(() => import("./views/Profile/Profile"));
const Quizzes = lazy(() => import("./views/Quizzes/Quizzes"));
const Ranking = lazy(() => import("./views/Ranking/Ranking"));

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route
            path="profile/:userId"
            element={<Profile />}
            loader={profileLoader}
          />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="ranking" element={<Ranking />} />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
