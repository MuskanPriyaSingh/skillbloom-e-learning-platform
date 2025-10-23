import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Backend_Url } from "../utils/utils";

function UpdateCourse() {
  const { courseId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Getting token from localStorage for authentication
  useEffect(() => {
    const token = localStorage.getItem("admin");
    if (!token) {
      toast.error("Please login to update courses");
      navigate("/admin/login")
    }
  }, []);

  // Fetch course details
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`${Backend_Url}/course/details/${courseId}`, {
          withCredentials: true,
        })
        setTitle(response.data.course.title);
        setDescription(response.data.course.description);
        setPrice(response.data.course.price);
        setImagePreview(response.data.course.image.url);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error(error?.data?.error || "Failed to fetch course data");
        setLoading(false);
      }
    };
    fetchCourseData(); 
  }, [courseId]);
   
  // handle image to display
  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  // Edit course function
  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    if (image) {formData.append("image", image)};

    const token = JSON.parse(localStorage.getItem("admin"));

    try {
      const response = await axios.put(
        `${Backend_Url}/course/update/${courseId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      navigate("/admin/all-courses");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to update course");
      console.error(error);
    }
  };
  
  // shows when function takes some time to update course
  if (loading) {
    return <p className='text-center text-gray-500'>Loading...</p>
  }

  return (
    <div className="min-h-screen p-5">
      <div className="max-w-sm sm:max-w-xl md:max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-3 border border-gray-200">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-5 text-center">
          Update Course
        </h3>

        {/* Update course form */}
        <form onSubmit={handleUpdateCourse} className="space-y-4">
          <div>
            <label htmlFor='title' className="block text-gray-700 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id='title'
              placeholder="Enter course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor='description' className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              id='description'
              placeholder="Enter course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
            ></textarea>
          </div>

          <div>
            <label htmlFor='price' className="block text-gray-700 font-medium mb-2">
              Price
            </label>
            <input
              type="number"
              id='price'
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
                src={imagePreview ? `${imagePreview}` : "/imgPL.webp"}
                alt="Preview"
                className="w-52 h-28 object-fill rounded-lg border border-gray-300"
              />
              <input
                type="file"
                id="courseImage"
                accept="image/*"
                onChange={changePhotoHandler}
                className="text-gray-500  cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 cursor-pointer"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateCourse