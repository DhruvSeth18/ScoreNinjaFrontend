import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './component/Home/Home';
import Login from './component/Login/Login';
import SignUp from './component/SignUp/SignUp';
import AppRoutes from './Router/Routes';

function App() {
  return (
    <AppRoutes/>
  );
}

export default App;
