import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaPlusCircle,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserEdit,
  FaKey,
} from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Backend_Url } from "../utils/utils";

function CreateCourse() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  // Edit admin profile details function
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
    const token = JSON.parse(localStorage.getItem("admin"));

    const response = await axios.put(
        `${Backend_Url}/admin/update`,
        { firstName, lastName, email },
        { 
            headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            },
            withCredentials: true,
        }
    );
    toast.success(response.data.message);
    setFirstName("");
    setLastName("");
    setEmail("");
    } catch (error) {
    toast.error(error.response?.data?.error || "Error updating profile");
    }
  };

  // Edit admin password function
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
        const token = JSON.parse(localStorage.getItem("admin"));

        const response = await axios.put(
        `${Backend_Url}/admin/update-password`,
        { currentPassword, newPassword },
        {
        withCredentials: true,
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        }
    );
    toast.success(response.data.message);
    setCurrentPassword("");
    setNewPassword("");
    } catch (error) {
    toast.error(error.response?.data?.error || "Error updating password");
    }
  };

  // admin authentication feature
  useEffect(() => {
    const token = localStorage.getItem("admin");
    if (!token) {
      toast.error("Please login to see your profile settings");
      navigate("/admin/login")
    }
    setIsLoggedIn(!!token);
  }, []);

  // Logout function
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
        } fixed top-0 left-0 h-screen bg-slate-900 text-white flex flex-col z-1 transition-all duration-300 shadow-lg`}
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
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition"
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
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 transition"
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
      <main className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "sm:ml-64" : "ml-20"
        } px-8 py-8 overflow-auto`}>
        <h1 className="text-3xl font-bold text-blue-700 mb-8">Account Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Update Profile Info */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4 text-blue-600">
              <FaUserEdit className="mr-2" />
              <h2 className="text-xl font-semibold">Update Profile</h2>
            </div>
            <form className="space-y-4" onSubmit={handleProfileUpdate}>
              <div>
                <label htmlFor="firstname" className="block mb-1 text-gray-700">First Name</label>
                <input
                  type="text"
                  id="firstname"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastname" className="block mb-1 text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="lastname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
              >
                Update Profile
              </button>
            </form>
          </section>

          {/* Change Password */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4 text-blue-600">
              <FaKey className="mr-2" />
              <h2 className="text-xl font-semibold">Change Password</h2>
            </div>
            <form className="space-y-4" onSubmit={handlePasswordUpdate}>
              <div className="mb-6 relative">
                <label htmlFor="currPass" className="block mb-1 text-gray-700">Current Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="currPass"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-10 text-xl text-blue-700 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </button>
              </div>
              <div className="mb-6 relative">
                <label htmlFor="newPass" className="block mb-1 text-gray-700">New Password</label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPass"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-10 text-xl text-blue-700 cursor-pointer"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </button>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default CreateCourse;
