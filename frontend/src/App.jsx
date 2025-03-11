import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import DashBoard from "./pages/Dashboard";
import Search from "./pages/Search";

function App() {
  return (
      <Router>
        <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<DashBoard />}/>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/match" element={<Search />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        </AuthProvider>
      </Router>
  );
}

export default App;
