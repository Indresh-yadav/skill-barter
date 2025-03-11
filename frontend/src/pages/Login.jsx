import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const [message, setMessage] = useState(""); 
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setMessage(""); // Clear previous messages
    setError("");

    try {
      await login(email, password);
      setMessage("Login Successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1000); 
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center p-10">
      <h2 className="text-2xl">Login</h2>
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="w-80">
        <input type="email" placeholder="Email" className="w-full p-2 my-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
        <input type="password" placeholder="Password" className="w-full p-2 my-2 border rounded" value={password}onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Login </button>
      </form>
    </div>
  );
};

export default Login;
