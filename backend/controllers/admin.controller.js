import { Admin } from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import * as z from "zod";
import jwt from "jsonwebtoken";
import config from "../config.js";

export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const adminSchema = z.object({
        firstName: z.string().min(3, { message: "First name must be at least 3 characters" }),
        lastName: z.string().min(3, { message: "Last name must be at least 3 characters" }),
        email: z.string().email(),
        password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    });

    const validationResult = adminSchema.safeParse(req.body);

    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            error: validationResult.error.issues.map(err => err.message),
        });
    }

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                error: "Admin already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            firstName,
            lastName,
            email,
            password: hashedPassword, 
        });

        await newAdmin.save();

        res.status(201).json({
            success: true,
            message: "Admin signed up successfully",
            admin: {
                id: newAdmin._id,
                firstName: newAdmin.firstName,
                lastName: newAdmin.lastName,
                email: newAdmin.email,
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
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(403).json({
                success: false,
                error: "Invalid credentials",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(403).json({
                success: false,
                error: "Invalid credentials",
            });
        }
        
        // Authentication
        const token = jwt.sign(
            {
               id: admin._id,
            },
            config.JWT_ADMIN_PASSWORD,
            {expiresIn: "1d"}
        );

        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
        }
        res.cookie("jwt", token, cookieOptions);

        res.status(202).json({
            success: true,
            message: "Login successful",
            admin: {
                id: admin._id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
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


export const updateAdminProfile = async (req, res) =>{
    const adminId = req.adminId;

    try {
        const { firstName, lastName, email } = req.body;

        const updatedAdmin = await Admin.findByIdAndUpdate(
            adminId,
            { firstName, lastName, email },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                firstName: updatedAdmin.firstName,
                lastName: updatedAdmin.lastName,
                email: updatedAdmin.email,
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
    const adminId = req.adminId;
    
    try {
        const { currentPassword, newPassword } = req.body;

        const admin = await Admin.findById(adminId);
        if (!admin) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect current password" });

        admin.password = await bcrypt.hash(newPassword, 10);
        
        await admin.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
};

