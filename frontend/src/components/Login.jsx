import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Typewriter } from 'react-simple-typewriter';
import logo from '../assets/logo.png';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Backend_Url } from "../utils/utils";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // User login function
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${Backend_Url}/user/login`,
        { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(response.data.message);
      localStorage.setItem("user", JSON.stringify(response.data.token));

      setTimeout(() => {
        navigate("/"); 
      }, 1500);

    } catch (error) {
      toast.error(error?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 text-gray-800 font-sans">

      {/* Header */}
      <header className="bg-blue-600/90 backdrop-blur-md text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="SkillBloom Logo" className="w-10 h-10 rounded-full" />
            <h1 className="hidden sm:block text-2xl font-bold text-green-400">SkillBloom</h1>
          </div>
          <div>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-500 to-green-500 px-4 py-2 rounded hover:opacity-90 text-white font"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Login Form Section */}
      <div className="flex justify-center items-center min-h-[80vh] px-4">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
            Welcome Back!
          </h2>

          {/* Typewriter line */}
          <p className="text-center text-gray-500 mb-6">
            <Typewriter
              words={["Login to continue your journey", "Grow with SkillBloom!"]}
              loop={true}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={2000}
            />
          </p>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-xl text-blue-700"
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-2 rounded-md hover:opacity-90 transition cursor-pointer"
          >
            {loading ? "Logging In..." : "Login"}
          </button>

          <p className="text-sm text-center mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
