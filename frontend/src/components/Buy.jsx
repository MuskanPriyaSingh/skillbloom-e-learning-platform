import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams, Link } from "react-router-dom";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../assets/logo.png";
import { Backend_Url } from "../utils/utils.js";

function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Authentication feature
    if (token) setIsLoggedIn(true);
    else {
      toast.error("Please login to buy a course");
      navigate("/login");
    }
    
    // Fetch course details for purchase
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${Backend_Url}/course/details/${courseId}`);
        setCourse(response.data.course);
      } catch (error) {
        toast.error("Failed to load course details");
      }
    };
    fetchCourse();
  }, [courseId, token]);

  // Course purchase feature
  const handlePurchase = async () => {
    if (!token) {
      toast.error("Please login to purchase the course");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${Backend_Url}/course/buy/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success(response.data.message);
      setShowSuccess(true);

      // Automatically redirect after animation
      setTimeout(() => {
        navigate("/purchases");
      }, 3000);
    } catch (error) {
      if (error?.response?.status === 400) {
        toast.error("You have already purchased this course");
        navigate("/purchases");
      } else {
        toast.error(error?.response?.data?.error || "Error while purchasing");
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculates discountedPrice (integer) 
  const getDiscountedPrice = (price, discountPercent = 20) => {
    if (!price || isNaN(price)) {
      return 0;
    }
    const discount = (price * discountPercent) / 100;
    const finalPrice = price - discount;

    return Math.round(finalPrice);
  };

  // Calculates saved amount (integer)
  const getOffAmount = (price, discountPercent = 20) => {
    if (!price || isNaN(price)) {
      return 0;
    }
    const discount = (price * discountPercent) / 100;

    return Math.round(discount);
  };


  // Sidebar toggle feature
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Logout feature
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="flex font-sans bg-gradient-to-br from-blue-50 to-white min-h-screen">
      {/* Hamburger Button */}
      <button
        className="md:hidden fixed top-3 left-2 z-50 text-2xl text-white rounded bg-blue-600"
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

      {/* Main Section */}
      <main className="flex-1 flex justify-center items-center px-6 py-8 relative">
        {/* Success Animation Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/90 backdrop-blur-md z-50 animate-fade-in">
            <div className="bg-green-100 p-8 rounded-2xl shadow-lg text-center">
              <div className="flex justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-green-600 animate-bounce"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                Purchase Successful!
              </h2>
              <p className="text-gray-600">Redirecting to your purchases...</p>
            </div>
          </div>
        )}

        {/* Course Card */}
        {course ? (
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-8 hover:shadow-2xl transition-all duration-300">
            <img
              src={course.image?.url || "https://via.placeholder.com/600x300"}
              alt={course.title}
              className="rounded-xl w-full h-64 object-fill mb-6"
            />
            <h2 className="text-3xl font-bold text-blue-700 mb-3">{course.title}</h2>
            <p className="text-gray-700 text-justify mb-4">{course.description}</p>
            <div className="mb-6">
              <p className="text-xl font-semibold text-blue-600 mb-1">
              Price: ₹{getDiscountedPrice(course.price) || 1999}
              </p>
              <p className="text-md text-green-600 font-medium">
                You save ₹{getOffAmount(course.price)}!
              </p>      
            </div>
            
            <button
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 cursor-pointer ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              }`}
              onClick={handlePurchase}
              disabled={loading}
            >
              {loading ? "Processing..." : "Buy Now"}
            </button>
          </div>
        ) : (
          <p className="text-gray-500 text-lg">Loading course details...</p>
        )}
      </main>
    </div>
  );
}

export default Buy;
