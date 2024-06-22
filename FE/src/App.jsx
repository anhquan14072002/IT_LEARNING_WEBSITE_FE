import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Search from './pages/Search';
import CheckMail from './pages/CheckMail';
import Document from './pages/Document';
import Lesson from './pages/Lesson';
import ChangePassword from './pages/ChangePassword';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/:id" element={<Register />} />
        <Route path="/document" element={<Document />} />
        <Route path="/document/lesson/:id" element={<Lesson />} />
        <Route path="/forgotpassword/:id" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkmail" element={<CheckMail />} />
        <Route path="/changepassword" element={<ChangePassword />} />
      </Routes>
    </Router>
  );
}

export default App;
