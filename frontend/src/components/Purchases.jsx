import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import toast from 'react-hot-toast';
import { Backend_Url } from "../utils/utils";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const navigate = useNavigate();
  
  // Getting token from localStorage for login & logout feature
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  
  // Fetch purchased courses
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user"))

    const fetchPurchases = async () => {
      if (!token) {
        setErrorMessage("Please login to purchase the courses");
        return;
      }

      try {
        const response = await axios.get(`${Backend_Url}/user/purchases`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        setPurchases(response.data.coursesData)
      } catch (error) {
        setErrorMessage(error.response?.data?.error || "Failed to fetch purchase data");
      }
    };
    fetchPurchases();
  }, []);

  // Filter courses dynamically by title or description
  const filteredPurchases = purchases.filter((purchase) => 
    [purchase.title, purchase.description]
    .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  // Sidebar toggle feature
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex font-sans bg-gradient-to-br from-blue-50 to-white min-h-screen">

      {/* Hamburger Button */}
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

        {/* Navigation */}
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
                className="flex items-center p-2 rounded hover:bg-blue-600"
              >
                <FaDiscourse className="mr-3 text-lg" />
                Courses
              </Link>
            </li>
            <li>
              <Link
                to="/purchases"
                className="flex items-center p-2 rounded bg-blue-600 transition"
              >
                <FaDownload className="mr-3 text-lg" />
                My Courses
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center p-2 rounded hover:bg-blue-600 transition"
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
      <main className="flex-1 min-h-screen px-6 py-8 md:py-4 lg:py-7 bg-gradient-to-br from-white via-blue-50 to-white flex flex-col">

        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">My Courses</h1>
          <div className="flex items-center space-x-3">
            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 focus:outline-none w-40 md:w-60"
              />
              <button className="px-3 text-gray-600 hover:text-blue-600">
                <FiSearch />
              </button>
            </div>
            <FaCircleUser className="text-3xl text-blue-600" />
          </div>
        </header>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-6 text-center font-medium shadow-sm">
            {errorMessage}
          </div>
        )}

        {/* Purchases Grid */}
        <div className='overflow-y-auto h-[70vh] px-2 py-2'>
          {purchases.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPurchases.map((purchase, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl shadow-md overflow-hidden transform hover:scale-103 hover:shadow-xl transition duration-300"
                >
                  <img
                    src={purchase.image?.url || "https://via.placeholder.com/300"}
                    alt={purchase.title}
                    className="w-full h-48 object-fill"
                  />

                  <div className="p-5 flex flex-col justify-between h-44">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition">
                        {purchase.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-3">
                        {purchase.description || "No description available"}
                      </p>
                    </div>

                    <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer">
                      View Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-20">
              <FaCircleUser className="text-5xl text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700">No Purchases Yet</h2>
              <p className="text-gray-500 mt-2">Start your learning journey by enrolling in a course today.</p>
              <Link
                to="/courses"
                className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
              >
                Browse Courses
              </Link>
            </div>
          )}  
        </div>
      </main>
    </div>
  );
}

export default Purchases;