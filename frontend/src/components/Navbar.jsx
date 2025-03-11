import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); // Hook to navigate

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/match?userId=${user._id}&skill=${encodeURIComponent(search.trim())}`); // Navigate to search page
      setSearch(""); // Clear input after search
    }
  };

  return (
    <nav className="bg-blue-500 p-4 flex justify-between items-center text-white">
      <h1 className="text-lg font-bold rounded-full px-4 py-2 bg-blue-700">Skill Barter</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search skills..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearch} // Trigger search on Enter
        className="border p-2 rounded text-black"
      />

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link to="/dashboard" className="bg-blue-700 px-4 py-2 rounded-full">Dashboard</Link>
            <Link to="/chat" className="bg-blue-700 px-4 py-2 rounded-full">Chat</Link>
            <Link to="/bookings" className="bg-blue-700 px-4 py-2 rounded-full">Bookings</Link>
            <button onClick={logout} className="bg-red-500 px-4 py-2 rounded-full">Logout</button>
          </>
        ) : (
          <>
            <Link to="/" className="bg-blue-700 px-4 py-2 rounded-full">Home</Link>
            <Link to="/login" className="bg-blue-700 px-4 py-2 rounded-full">Login</Link>
            <Link to="/register" className="bg-blue-700 px-4 py-2 rounded-full">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
