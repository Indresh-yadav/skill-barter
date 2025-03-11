import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {registerUser} from "../api/api"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerUser(formData);
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center p-10">
      <h2 className="text-2xl">Register</h2>
      <form onSubmit={handleSubmit} className="w-80">
        <input type="text" name="name" placeholder="Name" className="w-full p-2 my-2 border rounded" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" className="w-full p-2 my-2 border rounded" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" className="w-full p-2 my-2 border rounded" onChange={handleChange} />
        <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">Register</button>
      </form>
    </div>
  );
};

export default Register;
