import { BrowserRouter, Routes, Route, useLocation,Navigate  } from "react-router-dom";
import Home from '../Home/Home';
import Navbar from "../navbar/navbar";
import Login from "../Login/Login";
import SignUp from "../SignUp/SignUp";
import Test from "../testWindow/test";
import CreateQuiz from "../CreateQuiz/CreateQuiz";
import { useEffect } from "react";
import Create from "../Quiz/Quiz";

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
