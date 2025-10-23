import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookSquare, FaInstagram, FaTwitter } from "react-icons/fa";
import axios from "axios";
import logo from "../assets/logo.png";
import learning from '../assets/learning.svg';
import toast from "react-hot-toast";
import { Backend_Url } from "../utils/utils";

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Get token from localStorage for login & logout feature
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Logout feature
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${Backend_Url}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);

      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Logout failed");
    }
  }

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${Backend_Url}/course/courses`, {
          withCredentials: true,
        });
        const topCourses = response.data.courses.slice(0, 6);
        setCourses(topCourses);
      } catch (error) {
        console.error("Error fetching courses", error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="bg-slate-100 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-blue-600/90 backdrop-blur-md text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="SkillBloom Logo" className="w-10 h-10 rounded-full" />
            <h1 className="hidden sm:block text-2xl font-bold text-green-400">SkillBloom</h1>
          </div>
          <div className="space-x-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-blue-500 to-green-500 px-4 py-2 rounded hover:opacity-90 text-white font-semibold cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="hover:underline">Login</Link>
                <Link to="/signup" className="bg-gradient-to-r from-blue-500 to-green-500 px-4 py-2 rounded hover:opacity-90 text-white font-semibold">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-900 text-white py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Learn. Grow. <span className="text-green-400">Excel.</span>
            </h1>
            <p className="mt-4 text-lg text-slate-200">
              Master today’s most in-demand tech skills with hands-on courses and real-world projects.
            </p>
            <div className="mt-6 space-x-2 sm:space-x-4">
              <Link to="/courses" className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 sm:px-6 py-2 rounded shadow-lg hover:scale-105 transition">
                Explore Courses
              </Link>
              <Link to={"https://www.youtube.com/@ByteMyNotes"} className="border border-white px-3 sm:px-6 py-2 rounded hover:bg-white hover:text-blue-700 transition">
                Course Previews
              </Link>
            </div>
          </div>
          <div className="flex-1 mt-10 md:mt-0">
            <img
                src={learning}
                alt="Learning"
                className="w-full max-w-md mx-auto"
                />
          </div>
        </div>
      </section>

      {/* Course Section */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Top Courses</h2>
        <p className="text-center text-gray-600 mb-4">
          🎉 Get <span className="font-semibold text-green-600">20% off</span> on all courses — <span className="font-semibold text-red-600 animate-pulse">Limited Time Offer!</span>
        </p>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {courses.map((course) => (
            <div key={course._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4">
              <img src={course.image.url} alt={course.title} className="h-40 w-full object-fill rounded" />
              <h3 className="text-lg font-semibold mt-4 text-gray-800">{course.title}</h3>
              <div className="text-sm text-green-500 mt-1">Beginner • Self-paced</div>
              
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                Enroll Now
              </button>
              
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-100 py-14 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">What Our Learners Say</h2>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-600 italic">“SkillBloom helped me land a job in just 3 months. The mentors are amazing and the content is practical.”</p>
            <p className="font-semibold mt-4">– Priya S, Frontend Developer</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-600 italic">“I love how easy the platform is to use and the course quality is top-notch. Highly recommend!”</p>
            <p className="font-semibold mt-4">– Arjun R, Data Analyst</p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-r from-blue-600 to-green-500 py-12 text-white text-center px-6">
        <h2 className="text-2xl font-semibold mb-4">Stay in the loop</h2>
        <p className="mb-6">Get notified when we add new courses or run special discounts.</p>
        <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded border-white border-1 text-gray-800"
          />
          <button type="submit" className="bg-white text-blue-700 px-6 py-2 rounded hover:bg-slate-100">Subscribe</button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-white py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
              <h1 className="text-xl font-bold text-green-400">SkillBloom</h1>
            </div>
            <p className="text-sm text-gray-400">Empowering learners through technology.</p>
            <div className="flex space-x-4 mt-4 text-xl text-gray-400">
              <FaFacebookSquare className="hover:text-blue-500" />
              <FaInstagram className="hover:text-pink-400" />
              <FaTwitter className="hover:text-blue-300" />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="hover:text-gray-200"><Link to="/">Home</Link></li>
              <li className="hover:text-gray-200"><Link to="/courses">Courses</Link></li>
              <li className="hover:text-gray-200"><Link to="/">About</Link></li>
              <li className="hover:text-gray-200"><Link to="/">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="hover:text-gray-200">Terms</li>
              <li className="hover:text-gray-200">Privacy</li>
              <li className="hover:text-gray-200">Refund</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 mt-8">
          &copy; 2025 SkillBloom. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;
