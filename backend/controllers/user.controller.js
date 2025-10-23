import { User } from "../models/user.model.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";
import bcrypt from "bcryptjs";
import * as z from "zod";
import jwt from "jsonwebtoken";
import config from "../config.js";

export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const userSchema = z.object({
        firstName: z.string().min(3, { message: "First name must be at least 3 characters" }),
        lastName: z.string().min(3, { message: "Last name must be at least 3 characters" }),
        email: z.string().email(),
        password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    });

    const validationResult = userSchema.safeParse(req.body);

    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            error: validationResult.error.issues.map(err => err.message),
        });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User signed up successfully",
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Error while signing up",
        });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(403).json({
                success: false,
                error: "Invalid credentials",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(403).json({
                success: false,
                error: "Invalid credentials",
            });
        }

        // Authentication
        const token = jwt.sign(
            {
                id: user._id,
            },
            config.JWT_USER_PASSWORD,
            { expiresIn: "1d" }
        );

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        }
        res.cookie("jwt", token, cookieOptions);

        res.status(202).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Error while logging in",
        });
    }
};


export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt");

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            error: "Error while logging out"
        });
    }
};


export const purchasedCourses = async (req, res) => {
    const userId = req.userId;

    try {
        const purchased = await Purchase.find({ userId });

        if (!purchased.length) {
            return res.status(200).json({
                success: true,
                message: "No purchased courses found",
                courses: []
            });
        }

        let purchasedCourseIds = [];
        for (let i = 0; i < purchased.length; i++) {
            purchasedCourseIds.push(purchased[i].courseId);
        }

        const coursesData = await Course.find({
            _id: { $in: purchasedCourseIds }
        });

        res.status(200).json({
            success: true,
            message: "Purchased courses fetched successfully",
            purchased,
            coursesData,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Error while fetching purchased courses"
        });
    }
};


export const updateUserProfile = async (req, res) =>{
    const userId = req.userId;

    try {
        const { firstName, lastName, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, email },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
            },
        });
    } catch (error) {
        console.error("Error in updating profile", error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};


export const updatePassword = async (req, res) => {
    const userId = req.userId;
    
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect current password" });

        user.password = await bcrypt.hash(newPassword, 10);
        
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
};

