import { Course } from "../models/course.model.js";
import { Purchase } from "../models/purchase.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createCourse = async (req, res) => {
    const adminId = req.adminId;
    const { title, description, price } = req.body;

    try {
        
        if (!title || !description || !price) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        
        if (!req.files || !req.files.image) {
            return res.status(400).json({ success: false, error: "Image file is required" });
        }

        const image = req.files.image;
        const allowedFormat = ["image/png", "image/jpeg", "image/jpg"];

        if (!allowedFormat.includes(image.mimetype)) {
            return res.status(400).json({
                success: false,
                error: "Invalid file format. Only PNG, JPG, JPEG allowed."
            });
        }

        // Upload to Cloudinary
        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: "CourseApp"
        });

        const course = await Course.create({
            title,
            description,
            price,
            image: {
                public_id: cloud_response.public_id,
                url: cloud_response.secure_url
            },
            creatorId: adminId,
        });

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            course
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Error creating course" });
    }
};


export const updateCourse = async (req, res) => {
    const adminId = req.adminId;
    const { courseId } = req.params;
    const { title, description, price } = req.body;

    try {
        const course = await Course.findOne({
            _id: courseId,
            creatorId: adminId, 
        });

        if (!course) {
            return res.status(404).json({ success: false, error: "Cannot update the course, created by other admin" });
        }

        // Optional fields
        if (title) course.title = title;
        if (description) course.description = description;
        if (price) course.price = price;

        // If image is being updated
        if (req.files && req.files.image) {
            const image = req.files.image;

            const allowedFormat = ["image/png", "image/jpeg", "image/jpg"];
            if (!allowedFormat.includes(image.mimetype)) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid file format"
                });
            }

            // Delete old image from Cloudinary
            if (course.image && course.image.public_id){
                await cloudinary.uploader.destroy(course.image.public_id);   
            }

            // Upload new image to Cloudinary
            const cloud_response = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "CourseApp"
            });

            // Update MongoDB with new image details
            course.image = {
                public_id: cloud_response.public_id,
                url: cloud_response.secure_url
            };
        }

        await course.save();

        res.status(202).json({ success: true, message: "Course updated successfully", course });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Error while updating course" });
    }
};


export const deleteCourse = async (req, res) => {
    const adminId = req.adminId;
    const { courseId } = req.params;

    try {
        const course = await Course.findOne({
            _id: courseId,
            creatorId: adminId,
        });
        if (!course) {
            return res.status(404).json({ success: false, error: "Cannot delete the course, created by other admin"});
        }

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(course.image.public_id);

        // Delete course from DB
        await course.deleteOne();

        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Error in deleting course",
        });
    }
};


export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.status(200).json({ success: true, message: "All courses are fetched Successfully", courses });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Error to Fetch all courses" })
    }
};


export const courseDetails = async (req, res) => {
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId);
    
        if (!course) {
            return res.status(404).json({ success: false, error: "Course not found" });
        }

        res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            course
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Error fetching course details" });
    }
};

export const buyCourses = async (req, res) => {
    const { userId } = req;
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ success: false, error: "Course not found" });
        }

        const existingPurchase = await Purchase.findOne({ userId, courseId })

        if (existingPurchase) {
            return res.status(400).json({
                success: false,
                error: "User has already purchased this course"
            })
        }

        const newPurchase = new Purchase({ userId, courseId })
        await newPurchase.save();

        res.status(201).json({ 
            success: true, 
            message: "Course purchased successfully", 
            newPurchase 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Error in course buying" })
    }
};