import express from "express";
import { login, logout, signup, updateAdminProfile, updatePassword } from "../controllers/admin.controller.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.put("/update", adminMiddleware, updateAdminProfile);
router.put("/update-password", adminMiddleware, updatePassword);

export default router;