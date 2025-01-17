import { Route, Routes } from "react-router-dom";
import { lazy } from "react";
import { useLoggedUserContext } from "./contexts/LoggedUserContext";
import TimeAgo from "javascript-time-ago";
import pl from "javascript-time-ago/locale/pl";

const Error = lazy(() => import("./views/Error/Error"));
const Home = lazy(() => import("./views/Home/Home"));
const RootLayout = lazy(() => import("./components/Layout/RootLayout"));
const Profile = lazy(() => import("./views/Profile/Profile"));
const Quizzes = lazy(() => import("./views/Quizzes/Quizzes"));
const Ranking = lazy(() => import("./views/Ranking/Ranking"));
const LoginPage = lazy(() => import("./views/Login/LoginPage"));
const Stats = lazy(() => import("./views/Stats/Stats"));
const ManageQuiz = lazy(() => import("./views/ManageQuiz/ManageQuiz"));
const SolveQuiz = lazy(() => import("./views/SolveQuiz/SolveQuiz"));
const Achievements = lazy(() => import("./views/Achievements/Achievements"));
const Settings = lazy(() => import("./views/Settings/Settings"));

const App = () => {
  const { loggedUserData } = useLoggedUserContext();
  TimeAgo.addLocale(pl);

  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="quizzes" element={<Quizzes />} />
        <Route path="ranking" element={<Ranking />} />
        <Route path="quiz/:quizId" element={<SolveQuiz />} />

        {loggedUserData ? (
          <>
            <Route path="profile/:userId" element={<Profile />} />
            <Route path="stats" element={<Stats />} />
            <Route path="quiz/" element={<ManageQuiz />} />
            <Route path="quiz/manage" element={<ManageQuiz />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="settings" element={<Settings />} />
          </>
        ) : (
          <Route path="login" element={<LoginPage />} />
        )}
        <Route path="*" element={<Error />} />
      </Route>
    </Routes>
  );
};

export default App;
