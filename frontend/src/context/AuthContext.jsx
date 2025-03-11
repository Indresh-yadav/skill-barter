import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { loginUser } from "../api/api";
 
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);  // as token is passed through the component, so it is necessary to be a state.
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken); // Set token here // as if we do both things in one go React might try to update the state too quickly without the right value being available at the right time.
    
    if (storedToken) {
      // Fetch user data only if token exists
      axios
        .get("http://localhost:5000/api/auth/me", { headers: { Authorization: `Bearer ${storedToken}` } })
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []); // Only runs once when the component mounts

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    setToken(res.data.token); // Set the token state after successful login
    navigate("/dashboard"); // Redirect after login
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null); // Clear the token state
    setTimeout(() => navigate("/login"), 0); // Ensure safe navigation
  };

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
};
