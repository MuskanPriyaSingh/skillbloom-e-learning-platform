import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Backend_Url } from "../utils/utils";

function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Getting token from localStorage for authentication
  useEffect(() => {
    const token = localStorage.getItem("admin");
    if (!token) {
      toast.error("Please login to see the courses");
      navigate("/admin/login");
    }
  }, []);

  // Fetch all courses function
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${Backend_Url}/course/courses`,
          { withCredentials: true }
        );
        setCourses(response.data.courses);
      } catch (error) {
        toast.error(error?.response?.data?.error || "Failed to fetch courses");
      } finally {
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

  // Delete course function
  const handleDeleteCourse = async (courseId) => {
    const token = JSON.parse(localStorage.getItem("admin")); 
    try {
      const response = await axios.delete(
        `${Backend_Url}/course/delete/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to delete course");
    }
  };

  // shows if not getting data from database
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg animate-pulse">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-2 sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">All Courses</h1>
          <Link
            to="/admin/dashboard"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No courses available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden border border-gray-100"
              >
                <img
                  src={course?.image?.url}
                  alt={course.title}
                  className="w-full h-48 object-fill"
                />
                <div className="p-5 flex flex-col justify-between h-[260px] sm:h-[265px] lg:h-[270px]">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {course.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4">
                      {course.description.length > 200
                        ? `${course.description.slice(0, 200)}...`
                        : course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="space-x-1">
                        <span className="font-bold text-blue-700 text-lg">
                          ₹{getDiscountedPrice(course.price)}
                        </span>
                        <span className="line-through text-gray-400 text-sm">
                          ₹{course.price}
                        </span>
                      </div>
                      <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded">
                        20% OFF
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between mt-2">
                    <Link
                      to={`/admin/update-course/${course._id}`}
                      className="flex items-center gap-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                    >
                      <FaEdit /> Update
                    </Link>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllCourses;
