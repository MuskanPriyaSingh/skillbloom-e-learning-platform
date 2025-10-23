import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaPlusCircle,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";
import { Backend_Url } from "../utils/utils";

function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  // Handle course image for display
  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  // Create course 
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    const token = JSON.parse(localStorage.getItem("admin"));

    try {
      const response = await axios.post(
        `${Backend_Url}/course/create`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setTitle("");
      setDescription("");
      setPrice("");
      setImage("");
      setImagePreview("");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to create course");
    }
  };

  // Getting token from localStorage for authentication
  useEffect(() => {
    const token = localStorage.getItem("admin");
    if (!token) {
      toast.error("Please login to create course");
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
        } fixed top-0 left-0 h-screen bg-slate-900 text-white flex flex-col transition-all duration-300 shadow-lg`}
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
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 transition"
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
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "sm:ml-64" : "ml-20"
        } px-8 py-8 overflow-auto`}
      >
        <div className="max-w-sm sm:max-w-md md:max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-3 border border-gray-200">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-5 text-center">
            Create New Course
          </h3>

          <form onSubmit={handleCreateCourse} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="Enter course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Enter course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
              ></textarea>
            </div>

            <div>
              <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                Price
              </label>
              <input
                type="number"
                id="price"
                placeholder="Enter course price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="courseImage" className="block text-gray-700 font-medium mb-2">
                Course Image
              </label>
              <div className="flex flex-col">
                <img
                  src={imagePreview || "/imgPL.webp"}
                  alt="Preview"
                  className="w-52 h-28 object-fill rounded-lg border border-gray-300"
                />
                <input
                  type="file"
                  id="courseImage"
                  accept="image/*"
                  onChange={changePhotoHandler}
                  className="text-gray-500 cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 cursor-pointer"
            >
              Create Course
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateCourse;
