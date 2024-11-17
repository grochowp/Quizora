import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy } from "react";

const Error = lazy(() => import("./views/Error/Error"));
const Home = lazy(() => import("./views/Home/Home"));
const RootLayout = lazy(() => import("./components/Layout/RootLayout"));
const Profile = lazy(() => import("./views/Profile/Profile"));
const Quizzes = lazy(() => import("./views/Quizzes/Quizzes"));
const Ranking = lazy(() => import("./views/Ranking/Ranking"));
const LoginPage = lazy(() => import("./views/Login/LoginPage"));

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="profile/:userId" element={<Profile />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="ranking" element={<Ranking />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
