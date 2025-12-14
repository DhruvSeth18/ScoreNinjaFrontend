import { BrowserRouter, Routes, Route, useLocation,Navigate  } from "react-router-dom";
import Home from '../component/Home/Home';
import Navbar from "../component/navbar/navbar";
import Login from "../component/Login/Login";
import SignUp from "../component/SignUp/SignUp";
import Test from '../component/testWindow/Test';
import { useEffect } from "react";
import Create from "../component/Quiz/Quiz";
import QuizNotStartedPage from "../component/QuizNotStartedPage/QuizNotStartedPage";

const AppWrapper = () => {
  const location = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  const hideNavbarPaths = ['/test'];

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/quiz/*" element={<Create />} />
        <Route path="/quiz/:quizId/wait" element={<QuizNotStartedPage />} />
        <Route path="/userId/control" element={<SignUp />} />
        <Route path="/test" element={<Test />} />
        <Route path="/*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const AppRoutes = () => (
  <BrowserRouter>
    <AppWrapper />
  </BrowserRouter>
);

export default AppRoutes;