import express from "express";
import {signup, login, logout, purchasedCourses, updateUserProfile, updatePassword} from "../controllers/user.controller.js";
import userMiddleware from "../middlewares/user.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.put("/update", userMiddleware, updateUserProfile);
router.put("/update-password", userMiddleware, updatePassword);
router.get("/purchases", userMiddleware, purchasedCourses);

export default router;