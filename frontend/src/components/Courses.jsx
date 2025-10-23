import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";
import { Backend_Url } from "../utils/utils";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Get token from localstorage
  useEffect(() => {
    const token = localStorage.getItem("user");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${Backend_Url}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        toast.error(error?.response?.data?.error || "Failed to fetch courses");
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Calculates discountedPrice (integer) 
  const getDiscountedPrice = (price, discountPercent = 20) => {
    if (!price || isNaN(price)) {
      return 0;
    }
    const discount = (price * discountPercent) / 100;
    const finalPrice = price - discount;

    return Math.round(finalPrice);
  };

  // Filter courses dynamically by title or description
  const filteredCourses = courses.filter((course) => 
    [course.title, course.description]
    .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // (Login / Logout) feature
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

  // Welcome user
  useEffect(() => {
    if (isLoggedIn) {
      const showTimer = setTimeout(() => {
        setShowWelcome(true);
      }, 1000);

      const hideTimer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      }
    }
  }, [isLoggedIn]);

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

        {/* Optional User Info */}
        {showWelcome && (
          <div className="bg-white/10 p-3 rounded-lg mb-6">
            <p className="text-sm">Welcome back, Geek!</p>
          </div>
        )}

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
                className="flex items-center p-2 rounded bg-blue-600"
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
      <main className="flex-1 px-6 py-6">

        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-blue-700">Explore Our Courses</h1>
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

        {/* Course Grid */}
        <div className="overflow-y-auto h-[73vh] pr-2">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : courses.length === 0 ? (
            <p className="text-center text-gray-500">No courses posted yet by admin</p>
          ) : filteredCourses.length === 0 ? (
            <p className="text-center text-gray-500">No matching courses found</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={course.image.url}
                      alt={course.title}
                      className="h-full w-full object-fill hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                      {course.title}
                    </h2>

                    <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-3">
                      {course.description}
                    </p>

                    {/* Price & Discount */}
                    <div className="flex justify-between items-center mb-3 text-sm">
                      <div className="space-x-1">
                        <span className="font-bold text-blue-600 text-lg">
                          ₹{getDiscountedPrice(course.price)}
                        </span>
                        <span className="line-through text-gray-400">
                          ₹{course.price}
                        </span>
                      </div>
                      <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-0.5 rounded">
                        20% OFF
                      </span>
                    </div>

                    {/* Button */}
                    <Link
                      to={`/buy/${course._id}`}
                      className="block text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 mt-auto rounded-md font-medium hover:opacity-90 transition"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Courses;
