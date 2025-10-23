import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Typewriter } from 'react-simple-typewriter';
import logo from '../assets/logo.png';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaUserShield } from 'react-icons/fa';
import { Backend_Url } from "../utils/utils";

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Admin login function
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${Backend_Url}/admin/login`,
        { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(response.data.message);
      navigate("/admin/dashboard");
      localStorage.setItem("admin", JSON.stringify(response.data.token));
    } catch (error) {
      toast.error(error?.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-gray-800 font-sans">

      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="SkillBloom Logo" className="w-10 h-10 rounded-full border border-gray-300" />
            <h1 className="hidden sm:block text-2xl font-bold text-green-400">SkillBloom</h1>
          </div>
          <div>
            <Link to="/admin/signup" className="bg-gradient-to-r from-green-600 to-blue-600 px-4 py-2 rounded-lg hover:opacity-90 font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex justify-center items-center min-h-[85vh] px-4 py-8">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-lg border border-gray-200 rounded-2xl px-8 pt-8 pb-10 w-full max-w-md"
        >
          <div className='flex items-center mb-2 justify-center gap-2'>
            <FaUserShield className='text-3xl'/>
            <h2 className="text-3xl font-bold text-slate-800">Admin Login</h2>
          </div>

          <p className="text-center text-gray-500 mb-6 text-sm">
            <Typewriter
              words={["Welcome back, Admin!", "Manage your SkillBloom platform securely"]}
              loop={true}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={2000}
            />
          </p>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor='email' className="block text-sm font-semibold mb-1 text-gray-700">Admin Email</label>
            <input
              type="email"
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Password */}
          <div className="mb-6 relative">
            <label htmlFor='password' className="block text-sm font-semibold mb-1 text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-xl text-green-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-2 rounded-md hover:opacity-90 transition cursor-pointer"
          >
            {loading ? "Logging In..." : "Login as Admin"}
          </button>

          <p className="text-sm text-center mt-4 text-gray-600">
            New Admin?{" "}
            <Link to="/admin/signup" className="text-green-600 hover:underline font-medium">
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
