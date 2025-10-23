import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaPlusCircle,
  FaEdit,
  FaTrashAlt,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { IoMdSettings } from 'react-icons/io';
import logo from "../assets/logo.png";
import toast from "react-hot-toast";
import { Backend_Url } from "../utils/utils";

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  // Getting token from localStorage for authentication
  useEffect(() => {
    const token = localStorage.getItem("admin");
    if (token) {
      setIsLoggedIn(true);
    } else {
      toast.error("Please login to see the dashboard");
      navigate("/admin/login");
      setIsLoggedIn(false);
    }
  }, []);

  // Handles login/logout feature
  const handleLogout = async () => {
    try {
      await axios.get(`${Backend_Url}/admin/logout`, {
        withCredentials: true,
      });
      localStorage.removeItem("admin");
      setIsLoggedIn(false);
      navigate("/admin/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error logging out");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } fixed top-0 left-0 h-screen bg-slate-900 text-white flex flex-col transition-all duration-300`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="logo" className="w-10 h-10 rounded-full" />
            {sidebarOpen && (
              <h2 className="text-xl font-bold text-green-400">Admin</h2>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white focus:outline-none cursor-pointer"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 transition"
          >
            <FaHome /> {sidebarOpen && <span>Home</span>}
          </Link>

          <Link
            to="/admin/all-courses"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            <FaBook /> {sidebarOpen && <span>All Courses</span>}
          </Link>

          <Link
            to="/admin/create-course"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            <FaPlusCircle /> {sidebarOpen && <span>Create Course</span>}
          </Link>

          <Link
            to="/admin/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            <IoMdSettings /> {sidebarOpen && <span>Settings</span>}
          </Link>

        </nav>

        {/* Login / Logout */}
        <div className="border-t border-gray-700 mt-auto py-4 px-3">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 w-full text-left cursor-pointer"
            >
              <FaSignOutAlt /> {sidebarOpen && <span>Logout</span>}
            </button>
          ) : (
            <Link
              to="/admin/login"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 w-full"
            >
              <FaSignInAlt /> {sidebarOpen && <span>Login</span>}
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`${sidebarOpen ? "sm:ml-64" : "ml-20"} flex-1 min-h-screen overflow-y-auto p-8`}>
        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          Welcome, Admin 👋
        </h1>
        <p className="text-gray-600 mb-8">
          Manage all your courses efficiently from here. Choose an option from
          the sidebar to get started.
        </p>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
            <FaBook className="text-blue-600 text-4xl mx-auto mb-2" />
            <h3 className="text-xl font-semibold">All Courses</h3>
            <p className="text-gray-500 text-sm mt-1">View and manage courses</p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
            <FaPlusCircle className="text-green-600 text-4xl mx-auto mb-2" />
            <h3 className="text-xl font-semibold">Add New Course</h3>
            <p className="text-gray-500 text-sm mt-1">Create and publish course</p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
            <FaEdit className="text-yellow-500 text-4xl mx-auto mb-2" />
            <h3 className="text-xl font-semibold">Update Courses</h3>
            <p className="text-gray-500 text-sm mt-1">Edit existing course info</p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
            <FaTrashAlt className="text-red-500 text-4xl mx-auto mb-2" />
            <h3 className="text-xl font-semibold">Delete Courses</h3>
            <p className="text-gray-500 text-sm mt-1">Remove unwanted courses</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
