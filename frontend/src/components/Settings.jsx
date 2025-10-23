import React, { useState, useEffect } from "react";
import { FaUserEdit, FaKey } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import logo from "../assets/logo.png";
import { Backend_Url } from "../utils/utils";

function Settings() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();
    
    // Authentication feature
    useEffect(() => {
      const token = localStorage.getItem("user");
      if (!token) {
        toast.error("Please login to see your profile settings");
        navigate("/login")
      }
      setIsLoggedIn(!!token);
    }, []);

    // Edit user profile information function
    const handleProfileUpdate = async (e) => {
      e.preventDefault();
      try {
      const token = JSON.parse(localStorage.getItem("user"));

      const response = await axios.put(
          `${Backend_Url}/user/update`,
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
      } catch (error) {
      toast.error(error.response?.data?.error || "Error updating profile");
      }
    };

    // Edit user old password function
    const handlePasswordUpdate = async (e) => {
      e.preventDefault();
      try {
          const token = JSON.parse(localStorage.getItem("user"));

          const response = await axios.put(
          `${Backend_Url}/user/update-password`,
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

    // Logout feature
    const handleLogout = async () => {
      try {
        const response = await axios.get(`${Backend_Url}/user/logout`, {
          withCredentials: true,
        });
        toast.success(response.data.message);
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/");
      } catch (error) {
        toast.error(error.response?.data?.error || "Error logging out");
      }
    };

    // Sidebar toggle function
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex font-sans min-h-screen bg-gradient-to-br from-blue-50 to-white">

      {/* Sidebar Toggle Button */}
      <button
        className="md:hidden fixed top-3 left-2 z-50 text-2xl text-white rounded bg-blue-600 cursor-pointer"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-blue-700 to-indigo-800 text-white p-8 z-40 shadow-xl transform transition-transform duration-300 md:static md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center space-x-3 mb-10">
          <img src={logo} alt="SkillBloom Logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-2xl font-bold text-white">SkillBloom</h1>
        </div>

        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className="flex items-center p-2 rounded hover:bg-blue-600 transition"
              >
                <RiHome2Fill className="mr-3 text-lg" />
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/courses"
                className="flex items-center p-2 rounded hover:bg-blue-600 transition"
              >
                <FaDiscourse className="mr-3 text-lg" />
                Courses
              </Link>
            </li>
            <li>
              <Link
                to="/purchases"
                className="flex items-center p-2 rounded hover:bg-blue-600 transition"
              >
                <FaDownload className="mr-3 text-lg" />
                Purchases
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center p-2 rounded bg-blue-600"
              >
                <IoMdSettings className="mr-3 text-lg" />
                Settings
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full p-2 rounded hover:bg-red-600 text-red-200 transition cursor-pointer"
                >
                  <IoLogOut className="mr-3 text-lg" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center p-2 rounded hover:bg-blue-600 transition"
                >
                  <IoLogIn className="mr-3 text-lg" />
                  Login
                </Link>
              )}
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-6 left-6 text-xs text-white/60">
          <p>© 2025 SkillBloom</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 py-10">
        <h1 className="text-3xl font-bold text-blue-700 mb-8">Account Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

export default Settings;
